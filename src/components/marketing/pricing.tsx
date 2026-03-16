import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: null,
    description: "See if it works for you. No credit card.",
    cta: "Start free",
    href: "/signup",
    accent: false,
    features: [
      "1 BOM upload",
      "50 line items max",
      "Basic exposure view",
      "AI HS code classification",
    ],
  },
  {
    name: "Pro",
    price: "$99",
    period: "/mo",
    description: "For teams tracking tariff costs regularly.",
    cta: "Start free trial",
    href: "/signup",
    accent: true,
    features: [
      "Unlimited uploads",
      "Unlimited line items",
      "What-if scenario modeling",
      "PDF report export",
      "Rate change alerts",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "$299",
    period: "/mo",
    description: "For complex supply chains and compliance teams.",
    cta: "Start free trial",
    href: "/signup",
    accent: false,
    features: [
      "Everything in Pro",
      "REST API access",
      "Multi-user workspaces",
      "SSO authentication",
      "Custom tariff schedules",
      "Dedicated account manager",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-gray-200 py-20 dark:border-gray-800 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing</h2>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Start free. Upgrade when you need scenarios and exports.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "rounded-xl border p-6 sm:p-8",
                tier.accent
                  ? "border-emerald-600 ring-1 ring-emerald-600/20"
                  : "border-gray-200 dark:border-gray-800"
              )}
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{tier.name}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-mono text-4xl font-bold tracking-tight">{tier.price}</span>
                {tier.period && (
                  <span className="text-sm text-gray-400 dark:text-gray-500">{tier.period}</span>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{tier.description}</p>

              <Link
                href={tier.href}
                className={cn(
                  "mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-all duration-150",
                  tier.accent
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "border border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                )}
              >
                {tier.cta}
              </Link>

              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <Check size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
