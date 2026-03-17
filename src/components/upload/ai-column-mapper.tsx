"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import type { Mapping } from "./upload-wizard";

type Detection = { field: string; column: string; reason: string };
type Props = {
  headers: string[];
  sampleRows: string[][];
  aiMapping: Record<string, string>;
  detections: Detection[];
  onConfirm: (mapping: Mapping) => void;
  onFallback: () => void;
};

const REQUIRED = ["item_name", "supplier_country", "annual_spend"];
const LABELS: Record<string, string> = {
  item_name: "Item Name", supplier_country: "Supplier Country",
  annual_spend: "Annual Spend", description: "Description",
  quantity: "Quantity", unit_cost: "Unit Cost",
};

export function AiColumnMapper({ headers, sampleRows, aiMapping, detections, onConfirm, onFallback }: Props) {
  const [overrides, setOverrides] = useState<Record<string, string>>(aiMapping);
  const [error, setError] = useState("");
  const active = { ...aiMapping, ...overrides };
  const mapped = Object.entries(active).filter(([, v]) => v);

  function handleConfirm() {
    const missing = REQUIRED.filter((f) => !active[f]);
    if (missing.length) { setError(`Required: ${missing.map((f) => LABELS[f] || f).join(", ")}`); return; }
    onConfirm({
      item_name: active.item_name || "", supplier_country: active.supplier_country || "",
      annual_spend: active.annual_spend || "", description: active.description || "",
      quantity: active.quantity || "", unit_cost: active.unit_cost || "",
    });
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">We mapped your columns automatically</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Review the detected mappings below. Override any that look wrong.
      </p>
      <div className="mt-6 space-y-2">
        {detections.map((d) => {
          const key = Object.entries(LABELS).find(([, v]) => v === d.field)?.[0];
          return (
            <div key={d.field} className="flex flex-col gap-2 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                <span className="text-sm">
                  <span className="font-medium">{d.column}</span>
                  <span className="mx-1.5 text-gray-400">&rarr;</span>{d.field}
                </span>
              </div>
              {key && (
                <div className="relative">
                  <select
                    value={overrides[key] || active[key] || ""}
                    onChange={(e) => { setOverrides((p) => ({ ...p, [key]: e.target.value })); setError(""); }}
                    className="w-full appearance-none rounded-md border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-xs outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50 sm:w-48"
                  >
                    <option value="">None</option>
                    {headers.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {mapped.length > 0 && sampleRows.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">Preview</p>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                  {mapped.map(([k]) => (
                    <th key={k} className="whitespace-nowrap px-4 py-2 font-medium text-gray-500">{LABELS[k] || k}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {sampleRows.slice(0, 3).map((row, i) => (
                  <tr key={i}>
                    {mapped.map(([k, col]) => {
                      const idx = headers.indexOf(col);
                      return <td key={k} className="whitespace-nowrap px-4 py-2">{idx >= 0 ? row[idx] || "\u2014" : "\u2014"}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleConfirm} className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-700">
          Looks good
        </button>
        <button onClick={onFallback} className="text-sm text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          Let me map manually
        </button>
      </div>
    </div>
  );
}
