const features = [
  {
    problem: "Stop Googling HS codes at 11pm",
    solution:
      "Your part descriptions go in. Tariff classification codes come out — with confidence scores, so you know which ones to double-check with your broker. Handles thousands of line items in seconds.",
  },
  {
    problem: "Your spreadsheet breaks every time rates change",
    solution:
      "Tariff rates update automatically. When Section 301 rates shift or new duties get announced, your exposure numbers update the same day. Not next quarter when someone remembers to check.",
  },
  {
    problem: "\"What if we move this to Vietnam?\"",
    solution:
      "Model sourcing changes before you commit. Swap a supplier country and instantly see the tariff impact. Compare scenarios side by side. Make the decision with actual numbers.",
  },
  {
    problem: "The board wants a tariff number by Friday",
    solution:
      "One-click PDF export with exposure summaries, country breakdowns, and risk flags. Looks like you spent a week on it. Takes about 30 seconds.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="border-t border-gray-200 py-20 dark:border-gray-800 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {features.map((f) => (
            <div
              key={f.problem}
              className="grid grid-cols-1 gap-2 py-10 first:pt-0 last:pb-0 sm:grid-cols-2 sm:gap-16 sm:py-12"
            >
              <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {f.problem}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {f.solution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
