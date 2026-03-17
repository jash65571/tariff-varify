import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Upload", "Map Columns", "Preview", "Analyzing"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;

        return (
          <div key={label} className="flex items-center">
            {i > 0 && (
              <div
                className={cn(
                  "h-px w-6 sm:w-10",
                  done ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-800"
                )}
              />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                      : "border border-gray-300 text-gray-400 dark:border-gray-700 dark:text-gray-500"
                )}
              >
                {done ? <Check size={12} strokeWidth={2.5} /> : num}
              </div>
              <span
                className={cn(
                  "hidden text-xs sm:inline",
                  active
                    ? "font-medium"
                    : "text-gray-400 dark:text-gray-500"
                )}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
