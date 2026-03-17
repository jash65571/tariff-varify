import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function planFromPrice(priceId: string): string {
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  if (priceId === process.env.STRIPE_PRICE_ENTERPRISE) return "enterprise";
  return "free";
}

async function findUserBySubscription(subscriptionId: string) {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_subscription_id", subscriptionId)
    .single();
  return data?.id as string | undefined;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      if (!userId) break;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (!subscriptionId) break;

      const subscription =
        await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0]?.price.id;
      const plan = planFromPrice(priceId);

      await supabaseAdmin.from("profiles").update({
        plan,
        stripe_customer_id:
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id,
        stripe_subscription_id: subscriptionId,
      }).eq("id", userId);

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data
        .object as Stripe.Subscription;
      const userId =
        subscription.metadata?.supabase_user_id ??
        (await findUserBySubscription(subscription.id));

      if (!userId) break;

      const priceId = subscription.items.data[0]?.price.id;
      const plan = planFromPrice(priceId);

      await supabaseAdmin
        .from("profiles")
        .update({ plan })
        .eq("id", userId);

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data
        .object as Stripe.Subscription;
      const userId =
        subscription.metadata?.supabase_user_id ??
        (await findUserBySubscription(subscription.id));

      if (!userId) break;

      await supabaseAdmin
        .from("profiles")
        .update({
          plan: "free",
          stripe_subscription_id: null,
        })
        .eq("id", userId);

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(
        "Payment failed for invoice:",
        invoice.id,
        "customer:",
        invoice.customer
      );
      break;
    }
  }

  return NextResponse.json({ received: true });
}
