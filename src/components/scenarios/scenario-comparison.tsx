"use client";

import { cn } from "@/lib/utils";
import { getTariffRate } from "@/lib/tariffs/lookup";

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
  originalItems: BomItem[];
  changes: Record<string, string>;
};

function fmt(n: number) {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function ScenarioComparison({ originalItems, changes }: Props) {
  const currentTotal = originalItems.reduce((sum, i) => sum + Number(i.tariff_cost), 0);
  const currentSpend = originalItems.reduce((sum, i) => sum + Number(i.annual_spend), 0);
  const currentRate = currentSpend > 0 ? (currentTotal / currentSpend) * 100 : 0;

  let scenarioTotal = 0;
  for (const item of originalItems) {
    const newCountry = changes[item.id];
    if (newCountry && newCountry !== item.supplier_country) {
      const result = getTariffRate(newCountry);
      scenarioTotal += (Number(item.annual_spend) * result.tariffRate) / 100;
    } else {
      scenarioTotal += Number(item.tariff_cost);
    }
  }

  const scenarioRate = currentSpend > 0 ? (scenarioTotal / currentSpend) * 100 : 0;
  const savings = currentTotal - scenarioTotal;
  const hasChanges = Object.keys(changes).some(
    (id) => {
      const item = originalItems.find((i) => i.id === id);
      return item && changes[id] !== item.supplier_country;
    }
  );

  const maxVal = Math.max(currentTotal, scenarioTotal, 1);
  const currentPct = (currentTotal / maxVal) * 100;
  const scenarioPct = (scenarioTotal / maxVal) * 100;

  if (!hasChanges) return null;

  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800 sm:p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
        Impact comparison
      </p>

      {/* Cards */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 sm:text-[11px]">
            Current exposure
          </p>
          <p className="mt-2 font-mono text-xl font-bold tracking-tight text-red-600 dark:text-red-400">
            {fmt(currentTotal)}
          </p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {currentRate.toFixed(1)}% effective rate
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 sm:text-[11px]">
            Scenario exposure
          </p>
          <p className="mt-2 font-mono text-xl font-bold tracking-tight">
            {fmt(scenarioTotal)}
          </p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {scenarioRate.toFixed(1)}% effective rate
          </p>
        </div>

        <div className={cn(
          "rounded-lg border p-4",
          savings > 0
            ? "border-emerald-200 dark:border-emerald-900/50"
            : "border-gray-200 dark:border-gray-800"
        )}>
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 sm:text-[11px]">
            {savings >= 0 ? "Savings" : "Additional cost"}
          </p>
          <p className={cn(
            "mt-2 font-mono text-2xl font-bold tracking-tight",
            savings > 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          )}>
            {savings >= 0 ? "+" : "-"}{fmt(Math.abs(savings))}
          </p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {Math.abs(currentRate - scenarioRate).toFixed(1)}pp rate {savings >= 0 ? "reduction" : "increase"}
          </p>
        </div>
      </div>

      {/* Bars */}
      <div className="mt-6 space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Current</span>
            <span className="font-mono font-medium text-red-600 dark:text-red-400">{fmt(currentTotal)}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-3 rounded-full bg-red-500 dark:bg-red-600 transition-all"
              style={{ width: `${currentPct}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Scenario</span>
            <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">{fmt(scenarioTotal)}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-3 rounded-full bg-emerald-500 dark:bg-emerald-600 transition-all"
              style={{ width: `${scenarioPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
