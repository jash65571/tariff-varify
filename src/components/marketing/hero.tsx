import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DashboardPreview } from "./dashboard-preview";

export function Hero() {
  return (
    <section className="relative pt-28 pb-8 sm:pt-36 sm:pb-12">
      {/* Dotted grid background */}
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            You&apos;re probably overpaying on tariffs.{" "}
            <span className="text-gray-400 dark:text-gray-500">
              Most manufacturers are.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg">
            $258 billion in tariff revenue was collected last year. The effective
            rate on Chinese imports hit 17% — the highest since the 1930s. And
            80% of manufacturers still track this in spreadsheets.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-emerald-700 sm:w-auto"
            >
              Upload your BOM — it&apos;s free
              <ArrowRight size={16} />
            </Link>
            <a
              href="#pricing"
              className="inline-flex w-full items-center justify-center rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900 sm:w-auto"
            >
              See pricing
            </a>
          </div>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}
