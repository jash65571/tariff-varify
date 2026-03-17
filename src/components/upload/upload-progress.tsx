"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getTariffRate, getRiskLevel } from "@/lib/tariffs/lookup";
import type { Mapping } from "./upload-wizard";

type Props = { fileName: string; headers: string[]; rows: string[][]; mapping: Mapping; userId: string };

export function UploadProgress({ fileName, headers, rows, mapping, userId }: Props) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Preparing your data...");
  const [error, setError] = useState("");
  const router = useRouter();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function process() {
      const supabase = createClient();

      try {
        setStatus("Creating upload...");
        const { data: upload, error: uploadErr } = await supabase
          .from("bom_uploads")
          .insert({ user_id: userId, filename: fileName, total_items: rows.length, status: "processing" })
          .select("id")
          .single();

        if (uploadErr || !upload) {
          setError(`Failed to create upload: ${uploadErr?.message || "Unknown error"}`);
          return;
        }

        setStatus(`Analyzing ${rows.length.toLocaleString()} items...`);
        const nameIdx = headers.indexOf(mapping.item_name);
        const countryIdx = headers.indexOf(mapping.supplier_country);
        const spendIdx = headers.indexOf(mapping.annual_spend);
        const descIdx = mapping.description ? headers.indexOf(mapping.description) : -1;
        const qtyIdx = mapping.quantity ? headers.indexOf(mapping.quantity) : -1;
        const unitIdx = mapping.unit_cost ? headers.indexOf(mapping.unit_cost) : -1;

        const items = rows.map((row) => {
          const tariff = getTariffRate(row[countryIdx] || "");
          const spend = parseFloat(row[spendIdx]?.replace(/[,$\s]/g, "") || "0") || 0;
          return {
            upload_id: upload.id,
            item_name: row[nameIdx] || "Unknown Item",
            description: descIdx >= 0 ? row[descIdx] || null : null,
            supplier_country: tariff.countryName,
            country_code: tariff.countryCode,
            annual_spend: spend,
            quantity: qtyIdx >= 0 ? parseFloat(row[qtyIdx] || "0") || null : null,
            unit_cost: unitIdx >= 0 ? parseFloat(row[unitIdx]?.replace(/[,$\s]/g, "") || "0") || null : null,
            tariff_rate: tariff.tariffRate,
            tariff_cost: Math.round(spend * (tariff.tariffRate / 100) * 100) / 100,
            risk_level: getRiskLevel(tariff.tariffRate),
          };
        });

        const BATCH = 100;
        for (let i = 0; i < items.length; i += BATCH) {
          const batch = items.slice(i, i + BATCH);
          const { error: batchErr } = await supabase.from("bom_items").insert(batch);
          if (batchErr) {
            setError(`Failed to save items: ${batchErr.message}`);
            return;
          }
          setProgress(Math.round(((i + batch.length) / items.length) * 100));
        }

        setStatus("Calculating exposure...");
        const totalSpend = items.reduce((s, it) => s + it.annual_spend, 0);
        const totalExposure = items.reduce((s, it) => s + it.tariff_cost, 0);
        const effectiveRate = totalSpend > 0 ? Math.round((totalExposure / totalSpend) * 10000) / 100 : 0;

        await supabase.from("bom_uploads").update({
          total_spend: totalSpend,
          total_tariff_exposure: totalExposure,
          effective_tariff_rate: effectiveRate,
          total_items: items.length,
          status: "completed",
        }).eq("id", upload.id);

        // HS code classification (non-blocking)
        try {
          setStatus("Classifying HS codes...");
          const { data: saved } = await supabase
            .from("bom_items").select("id, item_name, description").eq("upload_id", upload.id);
          if (saved?.length) {
            const CBATCH = 20;
            for (let i = 0; i < saved.length; i += CBATCH) {
              const batch = saved.slice(i, i + CBATCH).map((s) => ({
                id: s.id, item_name: s.item_name, description: s.description || undefined,
              }));
              const res = await fetch("/api/classify", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: batch }),
              });
              if (res.ok) {
                const { results } = await res.json();
                for (const r of results) {
                  if (r.hs_code) {
                    await supabase.from("bom_items")
                      .update({ hs_code: r.hs_code, hs_confidence: r.confidence }).eq("id", r.id);
                  }
                }
              }
            }
          }
        } catch (err) {
          console.error("HS classification skipped:", err);
        }

        // Trigger recommendations (non-blocking)
        try {
          setStatus("Finding savings opportunities...");
          await fetch("/api/recommendations", { method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uploadId: upload.id }) });
        } catch { /* recommendations can be generated later */ }

        setProgress(100);
        setStatus("Done. Opening your report...");
        setTimeout(() => { router.push(`/reports/${upload.id}`); router.refresh(); }, 600);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    }

    process();
  }, [fileName, headers, rows, mapping, userId, router]);

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h2 className="text-lg font-semibold">{status}</h2>

      <div className="mx-auto mt-6 h-2 max-w-xs overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 font-mono text-sm text-gray-400">{progress}%</p>
      {error && <p className="mt-6 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
