import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const SYS_PROMPT =
  "You are a supply chain and trade compliance advisor for US manufacturers. Given a product and its current sourcing details, suggest 3 alternative sourcing countries with lower US import tariff rates. Be specific and practical. Return JSON.";

function buildUserPrompt(item: {
  item_name: string;
  description: string | null;
  supplier_country: string;
  tariff_rate: number;
  tariff_cost: number;
  annual_spend: number;
}): string {
  const desc = item.description ? ` (${item.description})` : "";
  return `Product: ${item.item_name}${desc}. Currently sourced from ${item.supplier_country} at ${item.tariff_rate}% tariff rate, costing $${item.tariff_cost}/year in duties on $${item.annual_spend} annual spend. Suggest 3 alternative countries. For each, provide: {country, tariffRate (number), estimatedSavings (number), tradeOffs (string describing quality/lead time/risk considerations), tradeAgreement (relevant FTA or null)}. Return JSON: {alternatives: [{country, tariffRate, estimatedSavings, tradeOffs, tradeAgreement}]}`;
}

type Alternative = {
  country: string;
  tariffRate: number;
  estimatedSavings: number;
  tradeOffs: string;
  tradeAgreement: string | null;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { uploadId } = (await request.json()) as { uploadId: string };
    if (!uploadId) {
      return NextResponse.json({ error: "Missing uploadId" }, { status: 400 });
    }

    // Verify ownership
    const { data: upload } = await supabase
      .from("bom_uploads").select("id, user_id").eq("id", uploadId).single();
    if (!upload || upload.user_id !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Check plan
    const { data: profile } = await supabase
      .from("profiles").select("plan").eq("id", user.id).single();
    if (!profile || profile.plan === "free") {
      // Return count only for free users
      const { count } = await supabase
        .from("bom_items").select("id", { count: "exact", head: true })
        .eq("upload_id", uploadId).gt("tariff_rate", 15);
      return NextResponse.json({ paywalled: true, itemCount: count || 0 });
    }

    // Check cache
    const { data: cached } = await supabase
      .from("recommendations").select("*").eq("upload_id", uploadId);
    if (cached && cached.length > 0) {
      return NextResponse.json({ recommendations: cached, cached: true });
    }

    // Fetch high-risk items
    const { data: items } = await supabase
      .from("bom_items").select("*").eq("upload_id", uploadId)
      .gt("tariff_rate", 15).order("tariff_cost", { ascending: false }).limit(5);

    if (!items?.length) {
      return NextResponse.json({ recommendations: [], message: "No high-risk items found" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI not configured" }, { status: 500 });
    }

    const client = new OpenAI({ apiKey });
    const recommendations: Array<{
      item_name: string; item_id: string; current_country: string;
      current_rate: number; current_cost: number; alternatives: Alternative[];
      total_potential_savings: number;
    }> = [];

    for (const item of items) {
      try {
        const res = await client.chat.completions.create({
          model: "gpt-4o",
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYS_PROMPT },
            { role: "user", content: buildUserPrompt(item) },
          ],
        });
        const text = res.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(text);
        const alts: Alternative[] = parsed.alternatives || [];
        const maxSaving = alts.reduce((m, a) => Math.max(m, a.estimatedSavings || 0), 0);

        const rec = {
          upload_id: uploadId,
          item_id: item.id,
          item_name: item.item_name,
          current_country: item.supplier_country,
          current_rate: Number(item.tariff_rate),
          current_cost: Number(item.tariff_cost),
          alternatives: alts,
          total_potential_savings: maxSaving,
        };

        // Save to DB (ignore errors if table doesn't exist yet)
        try {
          await supabase.from("recommendations").insert(rec);
        } catch { /* table may not exist */ }

        recommendations.push({ ...rec, item_id: item.id });
      } catch {
        // Skip this item on OpenAI failure
        continue;
      }
    }

    return NextResponse.json({ recommendations, cached: false });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Recommendation generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
