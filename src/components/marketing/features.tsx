import { Sparkles, Globe, GitBranch, Map, FileText, Bell } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered HS Classification",
    description:
      "AI reads your product descriptions and assigns 6-digit HS codes with confidence scores. Handles ambiguous items that trip up even experienced brokers.",
  },
  {
    icon: Globe,
    title: "Real-Time Tariff Rates",
    description:
      "Current duty rates for every major trade lane — US-China, US-EU, USMCA, and more. Rates update as trade policy changes, so your numbers are always fresh.",
  },
  {
    icon: GitBranch,
    title: "What-If Scenarios",
    description:
      "Move a component from China to Vietnam and instantly see the impact. Compare multiple sourcing strategies side-by-side before making commitments.",
  },
  {
    icon: Map,
    title: "Country Risk Heatmap",
    description:
      "Visualize tariff exposure geographically. Spot concentration risk in high-tariff countries and identify diversification opportunities at a glance.",
  },
  {
    icon: FileText,
    title: "PDF Export",
    description:
      "Generate boardroom-ready reports with charts, summaries, and recommendations. Share with stakeholders who don't need dashboard access.",
  },
  {
    icon: Bell,
    title: "Tariff Alerts",
    description:
      "Get notified when rates change for your HS codes. Stay ahead of policy shifts instead of discovering them on your next invoice.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-gray-200 py-16 dark:border-gray-800 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-emerald-500">Features</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage tariff risk
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Built for operations teams, procurement leads, and CFOs who need clarity
            on how trade policy affects their cost structure.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 p-6 transition-all duration-150 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <feature.icon size={20} className="text-gray-600 dark:text-gray-300" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
