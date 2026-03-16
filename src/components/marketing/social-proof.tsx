const stats = [
  {
    value: "$258B",
    label: "in US tariff revenue collected last year",
  },
  {
    value: "80%",
    label: "of SMB importers still track tariffs in spreadsheets",
  },
  {
    value: "17%",
    label: "average effective tariff rate on Chinese imports",
  },
];

export function SocialProof() {
  return (
    <section className="border-y border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12">
          {stats.map((stat) => (
            <div key={stat.value} className="text-center">
              <p className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
