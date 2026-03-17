import type { Metadata } from "next";
import Link from "next/link";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { CountryDonut } from "@/components/charts/country-donut";
import { TopItemsBar } from "@/components/charts/top-items-bar";
import { TariffAlerts } from "@/components/dashboard/tariff-alerts";
import { RateFeed } from "@/components/dashboard/rate-feed";

export const metadata: Metadata = { title: "Dashboard — TariffVerify" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles").select("company_name").eq("id", user!.id).single();

  const { data: uploads } = await supabase
    .from("bom_uploads").select("*").eq("user_id", user!.id)
    .eq("status", "completed").order("created_at", { ascending: false });

  const company = profile?.company_name;
  const hasData = uploads && uploads.length > 0;

  if (!hasData) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome{company ? `, ${company}` : ""}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your tariff exposure at a glance.
        </p>
        <div className="mt-12 flex flex-col items-center rounded-xl border border-dashed border-gray-200 px-6 py-20 text-center dark:border-gray-800">
          <Upload size={32} strokeWidth={1.5} className="text-gray-300 dark:text-gray-700" />
          <h2 className="mt-6 text-lg font-semibold">Upload your first BOM</h2>
          <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
            Drop a CSV with your part names, supplier countries, and annual spend.
            We&apos;ll calculate your tariff exposure in about 30 seconds.
          </p>
          <Link href="/upload" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700">
            Upload your BOM
          </Link>
        </div>
      </div>
    );
  }

  const latest = uploads[0];
  const { data: items } = await supabase
    .from("bom_items").select("*").eq("upload_id", latest.id)
    .order("tariff_cost", { ascending: false });

  const all = items || [];
  const atRisk = all.filter((i) => i.risk_level === "high" || i.risk_level === "critical").length;

  const cMap = new Map<string, { value: number; rate: number }>();
  for (const item of all) {
    const e = cMap.get(item.supplier_country);
    if (e) e.value += Number(item.tariff_cost) || 0;
    else cMap.set(item.supplier_country, { value: Number(item.tariff_cost) || 0, rate: Number(item.tariff_rate) || 0 });
  }
  const countryData = Array.from(cMap.entries())
    .map(([name, d]) => ({ name, value: Math.round(d.value), rate: d.rate }))
    .sort((a, b) => b.value - a.value);

  const topItems = all.slice(0, 8).map((i) => ({
    name: i.item_name.length > 25 ? i.item_name.slice(0, 22) + "..." : i.item_name,
    value: Math.round(Number(i.tariff_cost) || 0),
    rate: Number(i.tariff_rate) || 0,
  }));

  // Fetch rate changes (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data: rateChanges } = await supabase
    .from("tariff_rate_changes").select("*")
    .gte("change_date", thirtyDaysAgo)
    .order("change_date", { ascending: false }).limit(10);

  const allChanges = (rateChanges || []) as Array<{
    id: string; country: string; old_rate: number; new_rate: number;
    change_date: string; description: string | null;
  }>;

  // Build personalized alerts
  const userCountries = [...new Set(all.map((i) => i.supplier_country))];
  const userAlerts = allChanges
    .filter((rc) => userCountries.includes(rc.country))
    .map((rc) => {
      const affected = all.filter((i) => i.supplier_country === rc.country);
      const exposureChange = affected.reduce((s, i) => {
        const spend = Number(i.annual_spend) || 0;
        return s + spend * ((rc.new_rate - rc.old_rate) / 100);
      }, 0);
      return { ...rc, affectedCount: affected.length, exposureChange: Math.round(exposureChange) };
    });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back{company ? `, ${company}` : ""}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Showing results from {latest.filename}</p>
        </div>
        <Link href={`/reports/${latest.id}`} className="text-sm text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50">
          View full report &rarr;
        </Link>
      </div>

      <SummaryCards totalSpend={Number(latest.total_spend) || 0} totalExposure={Number(latest.total_tariff_exposure) || 0}
        effectiveRate={Number(latest.effective_tariff_rate) || 0} itemsAtRisk={atRisk} />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <CountryDonut data={countryData} />
        <TopItemsBar data={topItems} />
      </div>

      <div className="mt-10 space-y-8">
        <TariffAlerts alerts={userAlerts} />
        <RateFeed changes={allChanges} />
      </div>

      {uploads.length > 1 && (
        <div className="mt-10">
          <h2 className="mb-4 text-sm font-medium">Recent uploads</h2>
          <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
            {uploads.map((u) => (
              <Link key={u.id} href={`/reports/${u.id}`} className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
                <div>
                  <p className="text-sm font-medium">{u.filename}</p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{u.total_items} items — {new Date(u.created_at).toLocaleDateString()}</p>
                </div>
                <p className="font-mono text-sm font-medium text-red-600 dark:text-red-400">${Number(u.total_tariff_exposure).toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
