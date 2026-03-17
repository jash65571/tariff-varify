import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pricing — TariffVerify" };

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
    </main>
  );
}
