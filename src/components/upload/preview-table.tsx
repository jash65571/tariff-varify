"use client";

import { useMemo } from "react";
import { normalizeCountry } from "@/lib/tariffs/countries";
import { cn } from "@/lib/utils";
import type { Mapping } from "./upload-wizard";

interface PreviewTableProps {
  headers: string[];
  rows: string[][];
  totalRows: number;
  mapping: Mapping;
  onConfirm: () => void;
  onBack: () => void;
}

function parseSpend(raw: string): number {
  return parseFloat(raw?.replace(/[,$\s]/g, "") || "0") || 0;
}

export function PreviewTable({ headers, rows, totalRows, mapping, onConfirm, onBack }: PreviewTableProps) {
  const idx = useMemo(() => ({
    name: headers.indexOf(mapping.item_name),
    country: headers.indexOf(mapping.supplier_country),
    spend: headers.indexOf(mapping.annual_spend),
  }), [headers, mapping]);

  const preview = rows.slice(0, 20);
  const remaining = rows.length - 20;

  return (
    <div>
      <h2 className="text-lg font-semibold">Review your data</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {rows.length.toLocaleString()} items mapped from {totalRows.toLocaleString()} total rows.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <th className="px-4 py-2.5 font-medium text-gray-500">Item Name</th>
              <th className="px-4 py-2.5 font-medium text-gray-500">Country</th>
              <th className="px-4 py-2.5 font-medium text-gray-500">Annual Spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {preview.map((row, i) => {
              const rawCountry = idx.country >= 0 ? (row[idx.country] || "").trim() : "";
              const country = normalizeCountry(rawCountry);
              const changed = country !== rawCountry && rawCountry !== "";
              const missing = !rawCountry;
              const spend = parseSpend(row[idx.spend] || "");
              const low = spend > 0 && spend < 100;

              return (
                <tr key={i}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium">
                    {row[idx.name] || "—"}
                  </td>
                  <td className={cn("whitespace-nowrap px-4 py-2", missing && "text-red-500")}>
                    {missing ? (
                      "Missing"
                    ) : changed ? (
                      <>
                        <span className="mr-1 text-gray-400 line-through">{rawCountry}</span>
                        <span className="text-gray-400">→ </span>
                        <span>{country}</span>
                      </>
                    ) : (
                      country
                    )}
                  </td>
                  <td className={cn("whitespace-nowrap px-4 py-2 font-mono", low && "text-amber-500")}>
                    {spend > 0 ? `$${spend.toLocaleString()}` : row[idx.spend] || "—"}
                    {low && <span className="ml-1.5 text-[10px] font-sans text-amber-400">low?</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {remaining > 0 && (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          and {remaining.toLocaleString()} more rows
        </p>
      )}

      <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button onClick={onBack} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">
          Back
        </button>
        <button onClick={onConfirm} className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700">
          Analyze my BOM
        </button>
      </div>
    </div>
  );
}
