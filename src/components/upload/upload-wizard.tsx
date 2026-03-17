"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, Loader2 } from "lucide-react";
import { MAX_FREE_UPLOADS } from "@/lib/stripe/plans";
import { StepIndicator } from "./step-indicator";
import { Dropzone, type ParsedFile } from "./dropzone";
import { ColumnMapper } from "./column-mapper";
import { AiColumnMapper } from "./ai-column-mapper";
import { PreviewTable } from "./preview-table";
import { UploadProgress } from "./upload-progress";

export type Mapping = {
  item_name: string; supplier_country: string; annual_spend: string;
  description: string; quantity: string; unit_cost: string;
};

type Detection = { field: string; column: string; reason: string };
type Props = { plan: string; userId: string; uploadCount: number };

export function UploadWizard({ plan, userId, uploadCount }: Props) {
  const [step, setStep] = useState(1);
  const [parsed, setParsed] = useState<ParsedFile | null>(null);
  const [mapping, setMapping] = useState<Mapping | null>(null);
  const [aiMapping, setAiMapping] = useState<Record<string, string> | null>(null);
  const [aiDetections, setAiDetections] = useState<Detection[]>([]);
  const [useManualMapping, setUseManualMapping] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const maxItems = plan === "free" ? 50 : Infinity;
  const overLimit = parsed ? parsed.rows.length > maxItems : false;
  const activeRows = parsed ? (overLimit ? parsed.rows.slice(0, maxItems) : parsed.rows) : [];

  async function handleFileParsed(data: ParsedFile) {
    setParsed(data); setDetecting(true); setStep(2);
    try {
      const res = await fetch("/api/parse-columns", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headers: data.headers, sampleRows: data.rows.slice(0, 5) }),
      });
      const json = await res.json();
      if (json.mapping && !json.error) { setAiMapping(json.mapping); setAiDetections(json.detections || []); }
      else { setUseManualMapping(true); }
    } catch { setUseManualMapping(true); }
    setDetecting(false);
  }

  if (plan === "free" && uploadCount >= MAX_FREE_UPLOADS) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload BOM</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload a bill of materials to analyze tariff exposure.</p>
        <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-gray-200 px-6 py-16 text-center dark:border-gray-800">
          <Upload size={24} strokeWidth={1.5} className="text-gray-300 dark:text-gray-700" />
          <p className="mt-4 text-sm font-medium">You&apos;ve used your free upload</p>
          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">Upgrade to Pro for unlimited BOM analysis, scenario modeling, and PDF exports.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/settings" className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700">Upgrade to Pro</Link>
            <Link href="/reports" className="inline-flex items-center rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">Your current report</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator current={step} />
      {overLimit && step < 4 && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Your BOM has {parsed!.rows.length.toLocaleString()} items. Free plan supports up to {maxItems}.{" "}
            <Link href="/settings" className="font-medium underline">Upgrade to Pro</Link> for unlimited items, or continue with the first {maxItems}.
          </p>
        </div>
      )}

      {step === 1 && <Dropzone onParsed={handleFileParsed} />}

      {step === 2 && detecting && (
        <div className="mx-auto max-w-md py-16 text-center">
          <Loader2 size={24} className="mx-auto animate-spin text-emerald-500" />
          <p className="mt-4 text-sm font-medium">Detecting columns...</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Analyzing your headers to auto-map fields.</p>
        </div>
      )}

      {step === 2 && !detecting && parsed && !useManualMapping && aiMapping && (
        <AiColumnMapper headers={parsed.headers} sampleRows={parsed.rows.slice(0, 3)} aiMapping={aiMapping}
          detections={aiDetections} onConfirm={(m) => { setMapping(m); setStep(3); }} onFallback={() => setUseManualMapping(true)} />
      )}

      {step === 2 && !detecting && parsed && useManualMapping && (
        <ColumnMapper headers={parsed.headers} sampleRows={parsed.rows.slice(0, 3)}
          onMapped={(m) => { setMapping(m); setStep(3); }} onBack={() => setStep(1)} />
      )}

      {step === 3 && parsed && mapping && (
        <PreviewTable headers={parsed.headers} rows={activeRows} totalRows={parsed.rows.length}
          mapping={mapping} onConfirm={() => setStep(4)} onBack={() => setStep(2)} />
      )}

      {step === 4 && parsed && mapping && (
        <UploadProgress fileName={parsed.name} headers={parsed.headers}
          rows={activeRows} mapping={mapping} userId={userId} />
      )}
    </div>
  );
}
