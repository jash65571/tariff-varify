"use client";

import { useState, useEffect } from "react";
import type { Mapping } from "./upload-wizard";

const fields = [
  { key: "item_name", label: "Item Name", required: true, hints: ["name", "item", "part", "product", "component"] },
  { key: "supplier_country", label: "Supplier Country", required: true, hints: ["country", "origin", "supplier", "source"] },
  { key: "description", label: "Description", required: false, hints: ["desc", "detail"] },
  { key: "quantity", label: "Quantity", required: false, hints: ["qty", "quantity", "units"] },
  { key: "unit_cost", label: "Unit Cost", required: false, hints: ["unit cost", "unit_cost", "unit price", "per unit"] },
  { key: "annual_spend", label: "Annual Spend", required: true, hints: ["spend", "cost", "amount", "price", "value", "total"] },
] as const;

function autoDetect(headers: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  const used = new Set<number>();
  const lower = headers.map((h) => h.toLowerCase().replace(/[_-]/g, " ").trim());

  for (const field of fields) {
    for (let i = 0; i < lower.length; i++) {
      if (used.has(i)) continue;
      if (field.hints.some((hint) => lower[i].includes(hint))) {
        result[field.key] = headers[i];
        used.add(i);
        break;
      }
    }
  }
  return result;
}

interface ColumnMapperProps {
  headers: string[];
  sampleRows: string[][];
  onMapped: (mapping: Mapping) => void;
  onBack: () => void;
}

export function ColumnMapper({ headers, sampleRows, onMapped, onBack }: ColumnMapperProps) {
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    setMapping(autoDetect(headers));
  }, [headers]);

  function handleContinue() {
    const missing = fields.filter((f) => f.required && !mapping[f.key]);
    if (missing.length > 0) {
      setError(`Map the required columns: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }
    onMapped({
      item_name: mapping.item_name || "",
      supplier_country: mapping.supplier_country || "",
      annual_spend: mapping.annual_spend || "",
      description: mapping.description || "",
      quantity: mapping.quantity || "",
      unit_cost: mapping.unit_cost || "",
    });
  }

  const mapped = fields.filter((f) => mapping[f.key]);

  return (
    <div>
      <h2 className="text-lg font-semibold">Map your columns</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Tell us which columns match our fields. We auto-detected what we could.
      </p>

      <div className="mt-6 space-y-3">
        {fields.map((field) => (
          <div key={field.key} className="grid grid-cols-1 items-center gap-1.5 sm:grid-cols-[180px_1fr] sm:gap-4">
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <select
              value={mapping[field.key] || ""}
              onChange={(e) => { setMapping((m) => ({ ...m, [field.key]: e.target.value })); setError(""); }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50 dark:focus-visible:ring-offset-gray-950"
            >
              <option value="">Select column...</option>
              {headers.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {mapped.length > 0 && sampleRows.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Preview
          </p>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                  {mapped.map((f) => (
                    <th key={f.key} className="whitespace-nowrap px-4 py-2 font-medium text-gray-500">{f.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {sampleRows.map((row, i) => (
                  <tr key={i}>
                    {mapped.map((f) => {
                      const idx = headers.indexOf(mapping[f.key]);
                      return <td key={f.key} className="whitespace-nowrap px-4 py-2">{idx >= 0 ? row[idx] || "—" : "—"}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="mt-6 flex items-center gap-3">
        <button onClick={onBack} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">
          Back
        </button>
        <button onClick={handleContinue} className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-200">
          Continue
        </button>
      </div>
    </div>
  );
}
