import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: null,
    description: "Get a quick snapshot of your tariff exposure. No credit card required.",
    cta: "Start for free",
    featured: false,
    features: [
      "1 BOM upload",
      "Up to 50 line items",
      "Basic exposure breakdown",
      "AI-powered HS classification",
      "Country-level tariff view",
    ],
  },
  {
    name: "Pro",
    price: "$99",
    period: "/mo",
    description: "For teams that need ongoing visibility into tariff costs and sourcing options.",
    cta: "Start free trial",
    featured: true,
    features: [
      "Unlimited uploads and items",
      "What-if scenario modeling",
      "PDF report export",
      "Tariff rate change alerts",
      "Historical trend tracking",
      "Priority email support",
    ],
  },
  {
    name: "Enterprise",
    price: "$299",
    period: "/mo",
    description: "For organizations with complex supply chains and compliance requirements.",
    cta: "Contact sales",
    featured: false,
    features: [
      "Everything in Pro",
      "REST API access",
      "Multi-user workspaces",
      "SSO / SAML authentication",
      "Custom tariff schedules",
      "Dedicated account manager",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-gray-200 py-16 dark:border-gray-800 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-emerald-500">Pricing</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple pricing, no surprises
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Start free. Upgrade when you need scenarios, exports, and alerts.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "rounded-xl border p-6 sm:p-8",
                tier.featured
                  ? "border-emerald-500/50 bg-emerald-500/[0.03] ring-1 ring-emerald-500/20"
                  : "border-gray-200 dark:border-gray-800"
              )}
            >
              {tier.featured && (
                <span className="mb-4 inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-mono text-4xl font-bold tracking-tight">{tier.price}</span>
                {tier.period && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">{tier.period}</span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {tier.description}
              </p>
              <Link
                href="/signup"
                className={cn(
                  "mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-all duration-150",
                  tier.featured
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "border border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                )}
              >
                {tier.cta}
              </Link>
              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check
                      size={16}
                      strokeWidth={1.5}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
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
