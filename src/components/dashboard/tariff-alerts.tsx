import { cn } from "@/lib/utils";

type RateChange = {
  id: string;
  country: string;
  old_rate: number;
  new_rate: number;
  change_date: string;
  description: string | null;
};

type AlertItem = RateChange & {
  affectedCount: number;
  exposureChange: number;
};

type Props = {
  alerts: AlertItem[];
};

export function TariffAlerts({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <section>
        <h2 className="text-sm font-medium">Tariff alerts</h2>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          No rate changes affecting your BOM in the last 30 days.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-sm font-medium">Tariff alerts</h2>
      <div className="mt-3 space-y-3">
        {alerts.map((alert) => {
          const isIncrease = alert.new_rate > alert.old_rate;
          const diff = Math.abs(alert.new_rate - alert.old_rate);
          const date = new Date(alert.change_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={alert.id}
              className={cn(
                "rounded-lg border px-4 py-3",
                isIncrease
                  ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30"
                  : "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30"
              )}
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isIncrease
                        ? "text-red-700 dark:text-red-400"
                        : "text-emerald-700 dark:text-emerald-400"
                    )}
                  >
                    {alert.country} tariffs {isIncrease ? "increased" : "decreased"} from{" "}
                    {alert.old_rate}% to {alert.new_rate}%
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-xs",
                      isIncrease
                        ? "text-red-600 dark:text-red-400/80"
                        : "text-emerald-600 dark:text-emerald-400/80"
                    )}
                  >
                    {isIncrease ? "+" : "-"}{diff.toFixed(1)}pp affecting{" "}
                    {alert.affectedCount} item{alert.affectedCount !== 1 ? "s" : ""}
                    {alert.exposureChange > 0 && (
                      <> &mdash; exposure {isIncrease ? "up" : "down"} $
                        {Math.abs(alert.exposureChange).toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                      </>
                    )}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {date}
                </span>
              </div>
              {alert.description && (
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {alert.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
