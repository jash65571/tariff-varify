import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Background gradient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Now in public beta
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Know your tariff exposure{" "}
            <span className="text-emerald-500">before it hits your margins</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Upload your Bill of Materials, get AI-powered HS code classification,
            and visualize exactly how tariffs impact your bottom line — in minutes,
            not weeks.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition-all duration-150 hover:bg-emerald-600 sm:w-auto"
            >
              Upload your BOM — it&apos;s free
              <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium transition-all duration-150 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900 sm:w-auto"
            >
              See how it works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
