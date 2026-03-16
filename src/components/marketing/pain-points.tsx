const painPoints = [
  "Section 301 tariffs wiping out margins on Chinese components",
  "\"What's our tariff exposure?\" from the CFO — with no good answer",
  "China+1 sourcing decisions based on gut feel, not data",
  "USMCA qualification spreadsheets that nobody trusts",
  "Customs brokers billing $200/hr to look up HS codes",
  "BOM cost models that are wrong the day tariff rates change",
];

export function PainPoints() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Built for manufacturers dealing with
        </p>
        <div className="mt-8 grid grid-cols-1 gap-x-16 gap-y-3 sm:grid-cols-2">
          {painPoints.map((point) => (
            <p
              key={point}
              className="flex items-start gap-3 py-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400"
            >
              <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600" />
              {point}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
