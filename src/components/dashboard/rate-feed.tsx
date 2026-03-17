import { cn } from "@/lib/utils";

type RateChange = {
  id: string;
  country: string;
  old_rate: number;
  new_rate: number;
  change_date: string;
  description: string | null;
};

type Props = {
  changes: RateChange[];
};

export function RateFeed({ changes }: Props) {
  if (changes.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-sm font-medium">Recent rate changes</h2>
      <div className="mt-3 divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        {changes.map((rc) => {
          const isIncrease = rc.new_rate > rc.old_rate;
          const date = new Date(rc.change_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={rc.id}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {date}
                </span>
                <span className="text-sm font-medium">{rc.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
                  {rc.old_rate}%
                </span>
                <span className="text-gray-400">&rarr;</span>
                <span
                  className={cn(
                    "font-mono text-sm font-medium",
                    isIncrease
                      ? "text-red-600 dark:text-red-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  )}
                >
                  {rc.new_rate}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
