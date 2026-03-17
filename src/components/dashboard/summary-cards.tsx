import { cn } from "@/lib/utils";

type Props = {
  totalSpend: number;
  totalExposure: number;
  effectiveRate: number;
  itemsAtRisk: number;
};

function fmt(n: number) {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function SummaryCards({ totalSpend, totalExposure, effectiveRate, itemsAtRisk }: Props) {
  const highRate = effectiveRate > 15;
  const riskLabel = effectiveRate < 10 ? "Low" : effectiveRate < 20 ? "Medium" : effectiveRate < 30 ? "High" : "Critical";
  const riskBadge =
    effectiveRate < 10
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
      : effectiveRate < 20
        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
        : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400";

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 sm:text-[11px]">Total Annual Spend</p>
        <p className="mt-2 font-mono text-xl font-bold tracking-tight sm:text-2xl">{fmt(totalSpend)}</p>
      </div>

      <div className={cn("rounded-lg border p-4", highRate ? "border-red-200 dark:border-red-900/50" : "border-gray-200 dark:border-gray-800")}>
        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 sm:text-[11px]">Tariff Exposure</p>
        <p className={cn("mt-2 font-mono text-xl font-bold tracking-tight sm:text-2xl", highRate && "text-red-600 dark:text-red-400")}>
          {fmt(totalExposure)}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 sm:text-[11px]">Effective Rate</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-xl font-bold tracking-tight sm:text-2xl">{effectiveRate.toFixed(1)}%</span>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", riskBadge)}>{riskLabel}</span>
        </div>
      </div>

      <div className={cn("rounded-lg border p-4", itemsAtRisk > 0 ? "border-amber-200 dark:border-amber-900/50" : "border-gray-200 dark:border-gray-800")}>
        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 sm:text-[11px]">Items at Risk</p>
        <p className={cn("mt-2 font-mono text-xl font-bold tracking-tight sm:text-2xl", itemsAtRisk > 0 && "text-amber-600 dark:text-amber-400")}>
          {itemsAtRisk}
        </p>
      </div>
    </div>
  );
}
