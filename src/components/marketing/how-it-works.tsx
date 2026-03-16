const steps = [
  {
    number: "01",
    title: "Drop your CSV",
    body: "Export your BOM from whatever you use today. We accept any CSV with part names, countries, and spend. Column mapping takes 30 seconds.",
  },
  {
    number: "02",
    title: "AI assigns HS codes",
    body: "Part descriptions go in, tariff classification codes come out. Every code gets a confidence score so you know which ones to verify with your broker.",
  },
  {
    number: "03",
    title: "See your exposure",
    body: "Interactive breakdown by country, by part, by risk level. Model what happens when rates change. Export a report for the board.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-gray-200 py-20 dark:border-gray-800 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Three steps. That&apos;s it.
        </h2>

        <div className="mt-16 space-y-14">
          {steps.map((step) => (
            <div
              key={step.number}
              className="grid grid-cols-1 gap-3 sm:grid-cols-[4rem_1fr] sm:gap-8"
            >
              <p className="font-mono text-sm text-gray-300 dark:text-gray-700 sm:pt-1 sm:text-right">
                {step.number}
              </p>
              <div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
