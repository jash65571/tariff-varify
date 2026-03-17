"use client";

type SavedScenario = {
  id: string;
  name: string;
  upload_id: string;
  changes: Record<string, { from: string; to: string }>;
  total_savings: number;
  created_at: string;
};

type Props = {
  scenarios: SavedScenario[];
  onLoad: (scenario: SavedScenario) => void;
};

function fmt(n: number) {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function SavedScenariosList({ scenarios, onLoad }: Props) {
  return (
    <div>
      <p className="mb-4 text-sm font-medium">Saved scenarios</p>
      <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        {scenarios.map((s) => (
          <div
            key={s.id}
            className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium">{s.name}</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {new Date(s.created_at).toLocaleDateString()} &middot;{" "}
                {Object.keys(s.changes).length} change
                {Object.keys(s.changes).length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-medium text-emerald-600 dark:text-emerald-400">
                +{fmt(Number(s.total_savings))}
              </span>
              <button
                onClick={() => onLoad(s)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
              >
                Load
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
