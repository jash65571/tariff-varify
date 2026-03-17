"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Alternative = {
  country: string;
  tariffRate: number;
  estimatedSavings: number;
  tradeOffs: string;
  tradeAgreement: string | null;
};

type Recommendation = {
  item_name: string;
  current_country: string;
  current_rate: number;
  current_cost: number;
  alternatives: Alternative[];
  total_potential_savings: number;
};

type Props = { uploadId: string; plan: string };

export function SavingsRecommendations({ uploadId, plan }: Props) {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [paywalled, setPaywalled] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uploadId }),
        });
        const data = await res.json();
        if (data.paywalled) {
          setPaywalled(true);
          setItemCount(data.itemCount || 0);
        } else if (data.recommendations) {
          setRecs(data.recommendations);
        }
      } catch { /* silent */ }
      setLoading(false);
    }
    load();
  }, [uploadId]);

  if (loading) {
    return (
      <div className="mt-10 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Loader2 size={16} className="animate-spin" />
        Loading savings analysis...
      </div>
    );
  }

  if (paywalled) {
    return (
      <section className="relative mt-10">
        <h2 className="text-sm font-medium">Savings recommendations</h2>
        <div className="relative mt-3 overflow-hidden rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <div className="pointer-events-none select-none blur-sm" aria-hidden>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/80">
            <p className="text-sm font-medium">
              We found potential savings across {itemCount} item{itemCount !== 1 ? "s" : ""}
            </p>
            <p className="mt-1 max-w-xs text-center text-sm text-gray-500 dark:text-gray-400">
              Upgrade to see specific recommendations for reducing your tariff costs.
            </p>
            <Link href="/settings" className="mt-4 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700">
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (recs.length === 0) return null;

  const totalSavings = recs.reduce((s, r) => s + r.total_potential_savings, 0);

  return (
    <section className="mt-10">
      <h2 className="text-sm font-medium">
        Potential annual savings: ${totalSavings.toLocaleString("en-US", { maximumFractionDigits: 0 })} across {recs.length} item{recs.length !== 1 ? "s" : ""}
      </h2>
      <div className="mt-3 space-y-4">
        {recs.map((rec, idx) => (
          <div key={idx} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <p className="text-sm font-medium">{rec.item_name}</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Currently: {rec.current_country} at {rec.current_rate}%
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {rec.alternatives.map((alt, i) => (
                <div key={i} className="rounded-md border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium">{alt.country}</span>
                    <span className="font-mono text-xs text-gray-500">{alt.tariffRate}%</span>
                  </div>
                  <p className={cn("mt-1 text-lg font-semibold", alt.estimatedSavings > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500")}>
                    {alt.estimatedSavings > 0 ? `-$${alt.estimatedSavings.toLocaleString()}` : "$0"}
                  </p>
                  {alt.tradeAgreement && (
                    <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                      {alt.tradeAgreement}
                    </span>
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{alt.tradeOffs}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
