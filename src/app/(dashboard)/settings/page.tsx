import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SettingsPage } from "@/components/settings/settings-page";

export const metadata: Metadata = {
  title: "Settings — TariffVerify",
};

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, company_name, plan, stripe_customer_id, email_alerts_enabled")
    .eq("id", user!.id)
    .single();

  return (
    <SettingsPage
      userId={user!.id}
      email={profile?.email ?? user!.email ?? ""}
      companyName={profile?.company_name ?? ""}
      plan={profile?.plan ?? "free"}
      emailAlertsEnabled={profile?.email_alerts_enabled ?? true}
      stripeCustomerId={profile?.stripe_customer_id ?? null}
      priceProId={process.env.STRIPE_PRICE_PRO!}
      priceEnterpriseId={process.env.STRIPE_PRICE_ENTERPRISE!}
    />
  );
}
