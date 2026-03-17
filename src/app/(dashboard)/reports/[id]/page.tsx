import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canAccess } from "@/lib/stripe/plans";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { CountryDonut } from "@/components/charts/country-donut";
import { TopItemsBar } from "@/components/charts/top-items-bar";
import { BomTable } from "@/components/dashboard/bom-table";
import { SavingsRecommendations } from "@/components/dashboard/savings-recommendations";

export const metadata: Metadata = { title: "Report — TariffVerify" };

export default async function ReportPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: upload } = await supabase
    .from("bom_uploads").select("*").eq("id", id).single();

  if (!upload || upload.user_id !== user!.id) notFound();

  const { data: profile } = await supabase
    .from("profiles").select("plan").eq("id", user!.id).single();
  const plan = profile?.plan || "free";
  const canPdf = canAccess(plan, "pdf_export");

  const { data: items } = await supabase
    .from("bom_items").select("*").eq("upload_id", id)
    .order("tariff_cost", { ascending: false });

  const all = items || [];
  const atRisk = all.filter((i) => i.risk_level === "high" || i.risk_level === "critical").length;

  // Aggregate by country
  const cMap = new Map<string, { value: number; rate: number }>();
  for (const item of all) {
    const e = cMap.get(item.supplier_country);
    if (e) e.value += Number(item.tariff_cost) || 0;
    else cMap.set(item.supplier_country, { value: Number(item.tariff_cost) || 0, rate: Number(item.tariff_rate) || 0 });
  }
  const countryData = Array.from(cMap.entries())
    .map(([name, d]) => ({ name, value: Math.round(d.value), rate: d.rate }))
    .sort((a, b) => b.value - a.value);

  const topItems = all.slice(0, 10).map((i) => ({
    name: i.item_name.length > 25 ? i.item_name.slice(0, 22) + "..." : i.item_name,
    value: Math.round(Number(i.tariff_cost) || 0),
    rate: Number(i.tariff_rate) || 0,
  }));

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{upload.filename}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {upload.total_items} items — uploaded {new Date(upload.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          {canPdf ? (
            <a href={`/api/export/pdf?id=${upload.id}`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">
              Export PDF
            </a>
          ) : (
            <button disabled className="cursor-not-allowed rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-400 dark:border-gray-800" title="Upgrade to Pro for PDF exports">
              Export PDF
            </button>
          )}
          <Link href="/upload" className="rounded-lg bg-gray-950 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-200">
            New analysis
          </Link>
        </div>
      </div>

      <SummaryCards
        totalSpend={Number(upload.total_spend) || 0}
        totalExposure={Number(upload.total_tariff_exposure) || 0}
        effectiveRate={Number(upload.effective_tariff_rate) || 0}
        itemsAtRisk={atRisk}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <CountryDonut data={countryData} />
        <TopItemsBar data={topItems} />
      </div>

      <BomTable items={all.map((i) => ({
        id: i.id,
        item_name: i.item_name,
        supplier_country: i.supplier_country,
        annual_spend: Number(i.annual_spend) || 0,
        tariff_rate: Number(i.tariff_rate) || 0,
        tariff_cost: Number(i.tariff_cost) || 0,
        risk_level: i.risk_level,
        hs_code: i.hs_code ?? null,
        hs_confidence: i.hs_confidence != null ? Number(i.hs_confidence) : null,
      }))} />

      <SavingsRecommendations uploadId={id} plan={plan} />
    </div>
  );
}
