"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What file format does the upload support?",
    answer:
      "We accept CSV files. Your spreadsheet should include columns for item name or description, supplier country, and annual spend. During upload, you'll map your columns to ours — so your headers don't need to match exactly.",
  },
  {
    question: "How does the AI classification work?",
    answer:
      "We send your product descriptions to OpenAI's GPT models, which analyze each item and return the most likely 6-digit HS code along with a confidence score. Items with low confidence are flagged for your review.",
  },
  {
    question: "Are the tariff rates accurate and up to date?",
    answer:
      "Yes. We maintain current duty rates for major trade relationships including US-China (Section 301), US-EU, USMCA, and standard MFN rates. Rates are updated as trade policy changes, and Pro users get alerts when rates shift for their HS codes.",
  },
  {
    question: "Can I model different sourcing strategies?",
    answer:
      "Absolutely. With a Pro or Enterprise plan, you can create what-if scenarios — like moving a component from China to Vietnam — and instantly see how the change affects your total tariff exposure and landed cost.",
  },
  {
    question: "Is my data secure?",
    answer:
      "All data is encrypted in transit and at rest. We use Supabase with Row Level Security, which means your BOM data is completely isolated from other users. We never share or sell your data.",
  },
  {
    question: "Can I cancel or change plans anytime?",
    answer:
      "Yes. All plans are month-to-month with no long-term commitment. You can upgrade, downgrade, or cancel from your account settings at any time. If you cancel, you keep access through the end of your billing period.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t border-gray-200 py-16 dark:border-gray-800 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-emerald-500">FAQ</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Common questions
          </h2>
        </div>

        <div className="mx-auto mt-16 max-w-2xl divide-y divide-gray-200 dark:divide-gray-800">
          {faqs.map((faq, index) => (
            <div key={index} className="py-5">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-start justify-between gap-4 text-left"
              >
                <span className="text-sm font-medium">{faq.question}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={1.5}
                  className={cn(
                    "mt-0.5 shrink-0 text-gray-400 transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                      {faq.answer}
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
