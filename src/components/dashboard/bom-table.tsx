"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  item_name: string;
  supplier_country: string;
  annual_spend: number;
  tariff_rate: number;
  tariff_cost: number;
  risk_level: string;
  hs_code: string | null;
  hs_confidence: number | null;
};

type SortKey = "item_name" | "supplier_country" | "annual_spend" | "tariff_rate" | "tariff_cost" | "hs_code";

const cols: { key: SortKey; label: string }[] = [
  { key: "item_name", label: "Item" },
  { key: "hs_code", label: "HS Code" },
  { key: "supplier_country", label: "Country" },
  { key: "annual_spend", label: "Spend" },
  { key: "tariff_rate", label: "Rate" },
  { key: "tariff_cost", label: "Duty" },
];

const risk: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  medium: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  high: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  critical: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

function fmt(n: number) {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function BomTable({ items }: { items: Item[] }) {
  const [sortBy, setSortBy] = useState<SortKey>("tariff_cost");
  const [asc, setAsc] = useState(false);

  function toggle(key: SortKey) {
    if (sortBy === key) setAsc(!asc);
    else { setSortBy(key); setAsc(false); }
  }

  const sorted = [...items].sort((a, b) => {
    const av = a[sortBy] ?? "", bv = b[sortBy] ?? "";
    const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
    return asc ? cmp : -cmp;
  });

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-sm font-medium">All items ({items.length})</h3>

      {/* Desktop */}
      <div className="hidden overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 sm:block">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              {cols.map((c) => (
                <th key={c.key} onClick={() => toggle(c.key)} className="cursor-pointer whitespace-nowrap px-4 py-2.5 font-medium text-gray-500 hover:text-gray-950 dark:hover:text-gray-50">
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    {sortBy === c.key && <ArrowUpDown size={12} />}
                  </span>
                </th>
              ))}
              <th className="px-4 py-2.5 font-medium text-gray-500">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {sorted.map((it) => (
              <tr key={it.id}>
                <td className="whitespace-nowrap px-4 py-2.5 font-medium">{it.item_name}</td>
                <td className="whitespace-nowrap px-4 py-2.5 font-mono">
                  {it.hs_code ? (
                    <span className="inline-flex items-center gap-1.5">
                      {it.hs_code}
                      {it.hs_confidence != null && it.hs_confidence < 0.7 && (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">Review</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-400">Pending</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-gray-500">{it.supplier_country}</td>
                <td className="whitespace-nowrap px-4 py-2.5 font-mono">{fmt(it.annual_spend)}</td>
                <td className="whitespace-nowrap px-4 py-2.5 font-mono">{it.tariff_rate}%</td>
                <td className="whitespace-nowrap px-4 py-2.5 font-mono">{fmt(it.tariff_cost)}</td>
                <td className="whitespace-nowrap px-4 py-2.5">
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", risk[it.risk_level] || risk.low)}>{it.risk_level}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 sm:hidden">
        {sorted.map((it) => (
          <div key={it.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium">{it.item_name}</p>
              <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", risk[it.risk_level] || risk.low)}>{it.risk_level}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">{it.supplier_country}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs">
              <div>
                <p className="text-gray-400">HS Code</p>
                <p className="font-mono font-medium">
                  {it.hs_code ? (
                    <span className="inline-flex items-center gap-1">
                      {it.hs_code}
                      {it.hs_confidence != null && it.hs_confidence < 0.7 && (
                        <span className="rounded bg-amber-50 px-1 py-0.5 text-[10px] text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">Review</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-400">Pending</span>
                  )}
                </p>
              </div>
              <div><p className="text-gray-400">Spend</p><p className="font-mono font-medium">{fmt(it.annual_spend)}</p></div>
              <div><p className="text-gray-400">Rate</p><p className="font-mono font-medium">{it.tariff_rate}%</p></div>
              <div><p className="text-gray-400">Duty</p><p className="font-mono font-medium">{fmt(it.tariff_cost)}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
