"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What format does the file need to be?",
    a: "CSV. Columns for part name, country, and cost. During upload you map your columns to ours — takes about 30 seconds.",
  },
  {
    q: "How accurate is the HS code classification?",
    a: "Good enough to save you hours. Not perfect enough to replace your broker on a final filing. Think of it as a first pass that gets you 85\u201390% of the way there.",
  },
  {
    q: "Are the tariff rates current?",
    a: "Yes. We track Section 301, MFN, USMCA, and more. Pro users get alerts when rates change for their codes.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Month-to-month. Cancel from settings. No phone call required.",
  },
  {
    q: "Is my data secure?",
    a: "Encrypted in transit and at rest. Row-level security means nobody sees your BOM data but you. We don\u2019t sell data. Ever.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t border-gray-200 py-20 dark:border-gray-800 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">FAQ</h2>

        <div className="mt-12 max-w-2xl divide-y divide-gray-200 dark:divide-gray-800">
          {faqs.map((faq, i) => (
            <div key={i} className="py-5">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-start justify-between gap-4 text-left"
              >
                <span className="text-sm font-medium">{faq.q}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={1.5}
                  className={cn(
                    "mt-0.5 shrink-0 text-gray-400 transition-transform duration-200",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
