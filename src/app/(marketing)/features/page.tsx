import type { Metadata } from "next";
import { Features } from "@/components/marketing/features";

export const metadata: Metadata = { title: "Features — TariffVerify" };

export default function FeaturesPage() {
  return (
    <main className="pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Features
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          Everything you need to understand, track, and reduce your tariff
          exposure.
        </p>
      </div>
      <Features />
    </main>
  );
}
