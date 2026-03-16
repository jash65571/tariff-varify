"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const rows = [
  { part: "Aluminum Heat Sink",    origin: "CN", spend: 82400,  rate: 25.0, duty: 20600, risk: "high" as const },
  { part: "MLCC Capacitor 100nF",  origin: "TW", spend: 34200,  rate: 0,    duty: 0,     risk: "low" as const },
  { part: "PCB Assembly 6-Layer",  origin: "CN", spend: 156000, rate: 25.0, duty: 39000, risk: "high" as const },
  { part: "Steel Bracket M8",      origin: "DE", spend: 12800,  rate: 2.5,  duty: 320,   risk: "low" as const },
  { part: "Injection Mold Housing",origin: "VN", spend: 44600,  rate: 0,    duty: 0,     risk: "low" as const },
  { part: "Power Supply Unit 12V", origin: "CN", spend: 28900,  rate: 25.0, duty: 7225,  risk: "high" as const },
];

function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mx-auto mt-16 max-w-4xl sm:mt-20"
    >
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        {/* Chrome */}
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5 dark:border-gray-800 dark:bg-gray-950">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="ml-3 rounded bg-gray-100 px-3 py-1 dark:bg-gray-800">
            <span className="font-mono text-[11px] text-gray-400 dark:text-gray-500">app.tariffverify.com/dashboard</span>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 dark:divide-gray-800 dark:border-gray-800">
          <div className="px-3 py-4 sm:px-6">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:text-[11px]">Annual Spend</p>
            <p className="mt-1 font-mono text-base font-semibold tracking-tight sm:text-xl">$358,900</p>
          </div>
          <div className="px-3 py-4 sm:px-6">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:text-[11px]">Tariff Exposure</p>
            <p className="mt-1 font-mono text-base font-semibold tracking-tight text-red-600 dark:text-red-500 sm:text-xl">$67,145</p>
          </div>
          <div className="px-3 py-4 sm:px-6">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:text-[11px]">Effective Rate</p>
            <p className="mt-1 font-mono text-base font-semibold tracking-tight sm:text-xl">18.7%</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:px-6 sm:text-[11px]">Part</th>
                <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:px-6 sm:text-[11px]">Origin</th>
                <th className="hidden px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:table-cell sm:px-6 sm:text-[11px]">Spend</th>
                <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:px-6 sm:text-[11px]">Rate</th>
                <th className="hidden px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:table-cell sm:px-6 sm:text-[11px]">Duty</th>
                <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:px-6 sm:text-[11px]">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {rows.map((r) => (
                <tr key={r.part}>
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs font-medium sm:px-6">{r.part}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs text-gray-500 sm:px-6">{r.origin}</td>
                  <td className="hidden whitespace-nowrap px-3 py-2.5 font-mono text-xs sm:table-cell sm:px-6">{usd(r.spend)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs sm:px-6">{r.rate}%</td>
                  <td className="hidden whitespace-nowrap px-3 py-2.5 font-mono text-xs sm:table-cell sm:px-6">{usd(r.duty)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 sm:px-6">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      r.risk === "high"
                        ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                        : "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
                    )}>
                      {r.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
