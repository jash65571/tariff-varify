import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Pricing — TariffVerify" };

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
      "Unlimited uploads and items",
      "What-if scenario modeling",
      "AI savings recommendations",
      "PDF report export",
      "Tariff rate change alerts",
      "Email notifications",
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

const faqs = [
  {
    q: "Can I try it before paying?",
    a: "Yes. The free plan lets you upload one BOM with up to 50 items. No credit card needed.",
  },
  {
    q: "What happens if I go over the free plan limit?",
    a: "You'll see your first report in full. To upload more BOMs or use scenarios, you'll need to upgrade.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Month-to-month, cancel from settings. No phone call required.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major credit cards via Stripe. Invoicing available on Enterprise.",
  },
];

export default function PricingPage() {
  return (
    <div className="pt-28 pb-20 sm:pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Pricing</h1>
          <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
            Start free. Upgrade when you need scenarios, exports, and alerts.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
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

        {/* FAQ */}
        <div className="mx-auto mt-24 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight">Questions</h2>
          <div className="mt-8 divide-y divide-gray-200 dark:divide-gray-800">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-5">
                <p className="text-sm font-medium">{faq.q}</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
