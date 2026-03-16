import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Cta() {
  return (
    <section className="border-t border-gray-200 py-16 dark:border-gray-800 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 px-6 py-16 text-center dark:border-gray-800 dark:bg-gray-900 sm:px-16 sm:py-24">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-[80px]" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Stop guessing. Start seeing.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Your competitors are already modeling tariff scenarios. Upload your first
            BOM in under two minutes and see exactly where your margins are at risk.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition-all duration-150 hover:bg-emerald-600"
          >
            Get started for free
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
