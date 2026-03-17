"use client";

import { cn } from "@/lib/utils";
import { TARIFF_RATES } from "@/lib/tariffs/rates";
import { getTariffRate } from "@/lib/tariffs/lookup";

const COUNTRY_OPTIONS = Object.keys(TARIFF_RATES).sort();

type BomItem = {
  id: string;
  item_name: string;
  supplier_country: string;
  annual_spend: number;
  tariff_rate: number;
  tariff_cost: number;
  risk_level: string;
};

type Props = {
  items: BomItem[];
  changes: Record<string, string>;
  onChange: (itemId: string, newCountry: string) => void;
};

function fmt(n: number) {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function ScenarioBuilder({ items, changes, onChange }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
          Change supplier countries
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs dark:border-gray-800 dark:bg-gray-900">
              <th className="px-4 py-2 font-medium text-gray-500">Item</th>
              <th className="px-4 py-2 font-medium text-gray-500">Current</th>
              <th className="px-2 py-2 font-medium text-gray-500" />
              <th className="px-4 py-2 font-medium text-gray-500">Move to</th>
              <th className="px-4 py-2 text-right font-medium text-gray-500">New Rate</th>
              <th className="px-4 py-2 text-right font-medium text-gray-500">New Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {items.map((item) => {
              const newCountry = changes[item.id] || item.supplier_country;
              const result = getTariffRate(newCountry);
              const newCost = (Number(item.annual_spend) * result.tariffRate) / 100;
              const changed = changes[item.id] && changes[item.id] !== item.supplier_country;

              return (
                <tr key={item.id} className={cn(changed && "bg-emerald-50/50 dark:bg-emerald-950/20")}>
                  <td className="max-w-[200px] truncate px-4 py-2 font-medium">
                    {item.item_name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-500 dark:text-gray-400">
                    {item.supplier_country}
                  </td>
                  <td className="px-2 py-2 text-gray-300 dark:text-gray-600">
                    &rarr;
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={newCountry}
                      onChange={(e) => onChange(item.id, e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50"
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-right font-mono text-sm">
                    {result.tariffRate}%
                  </td>
                  <td className={cn(
                    "whitespace-nowrap px-4 py-2 text-right font-mono text-sm font-medium",
                    changed && "text-emerald-600 dark:text-emerald-400"
                  )}>
                    {fmt(newCost)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-gray-100 md:hidden dark:divide-gray-800/50">
        {items.map((item) => {
          const newCountry = changes[item.id] || item.supplier_country;
          const result = getTariffRate(newCountry);
          const newCost = (Number(item.annual_spend) * result.tariffRate) / 100;
          const changed = changes[item.id] && changes[item.id] !== item.supplier_country;

          return (
            <div key={item.id} className={cn("px-4 py-3", changed && "bg-emerald-50/50 dark:bg-emerald-950/20")}>
              <p className="text-sm font-medium">{item.item_name}</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Currently: {item.supplier_country}
              </p>
              <select
                value={newCountry}
                onChange={(e) => onChange(item.id, e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="mt-1.5 flex items-center gap-3 text-xs">
                <span className="text-gray-400">Rate: {result.tariffRate}%</span>
                <span className={cn("font-mono font-medium", changed && "text-emerald-600 dark:text-emerald-400")}>
                  Cost: {fmt(newCost)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
