import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Cta() {
  return (
    <section className="border-t border-gray-200 py-20 dark:border-gray-800 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Try it with your own data
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Upload a BOM, see your exposure. No credit card. No demo call. Just answers.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-emerald-700"
          >
            Upload your BOM — it&apos;s free
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
