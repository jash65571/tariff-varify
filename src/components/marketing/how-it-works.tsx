import { FileUp, Sparkles, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: FileUp,
    title: "Upload your BOM",
    description:
      "Drop your CSV file — we parse it instantly. Map columns to item name, supplier country, and annual spend. That's all we need.",
  },
  {
    number: "2",
    icon: Sparkles,
    title: "AI classifies your items",
    description:
      "Claude analyzes every product description and assigns the correct HS code with a confidence score. No more manual lookups.",
  },
  {
    number: "3",
    icon: BarChart3,
    title: "See your exposure",
    description:
      "Interactive charts break down tariff costs by country, category, and risk level. Know exactly where your money goes.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-emerald-500">How it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            From CSV to clarity in three steps
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center md:text-left">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 md:mx-0">
                <step.icon size={24} className="text-emerald-500" strokeWidth={1.5} />
              </div>
              <div className="mt-4">
                <span className="font-mono text-xs font-medium text-gray-400 dark:text-gray-500">
                  Step {step.number}
                </span>
                <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
