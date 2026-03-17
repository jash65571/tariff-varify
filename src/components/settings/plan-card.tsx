"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PlanCardProps = {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  onUpgrade: () => void;
  loading: boolean;
  accent?: boolean;
};

export function PlanCard({
  name,
  price,
  period,
  features,
  cta,
  onUpgrade,
  loading,
  accent = false,
}: PlanCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-6",
        accent
          ? "border-emerald-600 ring-1 ring-emerald-600/20"
          : "border-gray-200 dark:border-gray-800"
      )}
    >
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {name}
      </p>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-mono text-3xl font-bold tracking-tight">
          {price}
        </span>
        <span className="text-sm text-gray-400 dark:text-gray-500">
          {period}
        </span>
      </div>

      <ul className="mt-6 space-y-2.5">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300"
          >
            <Check
              size={14}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500"
            />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={onUpgrade}
        disabled={loading}
        className={cn(
          "mt-6 flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 disabled:opacity-50",
          accent
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "border border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
        )}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          cta
        )}
      </button>
    </div>
  );
}
