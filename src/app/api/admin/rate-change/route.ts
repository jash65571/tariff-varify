import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!serviceKey || !supabaseUrl) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    // Auth check
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (auth !== serviceKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { country, countryCode, oldRate, newRate, source, description } = body as {
      country: string; countryCode: string; oldRate: number;
      newRate: number; source: string; description: string;
    };

    if (!country || oldRate == null || newRate == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // 1. Insert rate change
    const { error: insertErr } = await admin.from("tariff_rate_changes").insert({
      country, country_code: countryCode, old_rate: oldRate,
      new_rate: newRate, source, description,
    });
    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    // 2. Find affected bom_items
    const { data: affected } = await admin
      .from("bom_items").select("id, upload_id, annual_spend, supplier_country")
      .eq("supplier_country", country);

    const affectedItems = affected || [];

    // 3. Update tariff_cost for affected items
    for (const item of affectedItems) {
      const spend = Number(item.annual_spend) || 0;
      const newCost = Math.round(spend * (newRate / 100) * 100) / 100;
      await admin.from("bom_items").update({
        tariff_rate: newRate, tariff_cost: newCost,
      }).eq("id", item.id);
    }

    // 4. Recalculate upload totals
    const uploadIds = [...new Set(affectedItems.map((i) => i.upload_id))];
    for (const uid of uploadIds) {
      const { data: items } = await admin
        .from("bom_items").select("annual_spend, tariff_cost").eq("upload_id", uid);
      if (!items) continue;
      const totalSpend = items.reduce((s, i) => s + (Number(i.annual_spend) || 0), 0);
      const totalExposure = items.reduce((s, i) => s + (Number(i.tariff_cost) || 0), 0);
      const effectiveRate = totalSpend > 0
        ? Math.round((totalExposure / totalSpend) * 10000) / 100 : 0;
      await admin.from("bom_uploads").update({
        total_spend: totalSpend, total_tariff_exposure: totalExposure,
        effective_tariff_rate: effectiveRate,
      }).eq("id", uid);
    }

    // 5. Find affected Pro users with email alerts enabled
    const { data: uploads } = await admin
      .from("bom_uploads").select("user_id").in("id", uploadIds);
    const userIds = [...new Set((uploads || []).map((u) => u.user_id))];

    const { data: profiles } = await admin
      .from("profiles").select("id, email, plan, email_alerts_enabled")
      .in("id", userIds).eq("email_alerts_enabled", true)
      .in("plan", ["pro", "enterprise"]);

    const notified: string[] = [];

    // 6. Send email notifications via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && profiles?.length) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);
        const direction = newRate > oldRate ? "increased" : "decreased";

        for (const profile of profiles) {
          try {
            await resend.emails.send({
              from: "TariffVerify <alerts@tariffverify.com>",
              to: profile.email,
              subject: "Tariff rate change affects your BOM",
              text: `${country} tariff rates ${direction} from ${oldRate}% to ${newRate}%.${description ? ` ${description}` : ""}\n\nLog in to TariffVerify to review the impact on your BOM.\n\n${process.env.NEXT_PUBLIC_APP_URL || "https://tariffverify.com"}`,
            });
            notified.push(profile.email);
          } catch (emailErr) {
            console.error(`Failed to email ${profile.email}:`, emailErr);
          }
        }
      } catch (resendErr) {
        console.error("Resend import/init failed:", resendErr);
      }
    }

    return NextResponse.json({
      affectedItems: affectedItems.length,
      affectedUploads: uploadIds.length,
      notifiedUsers: notified,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Rate change failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
