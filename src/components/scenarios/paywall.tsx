import Link from "next/link";
import { GitBranch } from "lucide-react";

export function ScenarioPaywall() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Scenarios</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Model what happens when you move parts between countries.
      </p>

      <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-gray-200 px-6 py-16 text-center dark:border-gray-800">
        <GitBranch
          size={24}
          strokeWidth={1.5}
          className="text-gray-300 dark:text-gray-700"
        />
        <p className="mt-4 text-sm font-medium">
          Scenario modeling is a Pro feature
        </p>
        <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          See how much you could save by moving parts to different countries.
          Compare sourcing strategies with real tariff data.
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700"
        >
          Upgrade to Pro
        </Link>
      </div>
    </div>
  );
}
