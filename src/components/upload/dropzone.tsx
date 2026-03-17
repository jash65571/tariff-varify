"use client";

import { useState, useCallback } from "react";
import { FileUp, File, X } from "lucide-react";
import Papa from "papaparse";
import { cn } from "@/lib/utils";

const MAX_SIZE = 10 * 1024 * 1024;

export type ParsedFile = {
  name: string;
  size: number;
  headers: string[];
  rows: string[][];
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function processRows(raw: string[][]): { headers: string[]; rows: string[][] } | string {
  if (raw.length < 2) return "No data rows found. Make sure your file has headers and at least one row.";
  const headers = raw[0].map((h) => String(h).trim()).filter(Boolean);
  if (headers.length < 2) return "Could only find one column. Check that your CSV uses commas as delimiters.";
  const rows = raw.slice(1).filter((r) => r.some((c) => String(c).trim()));
  if (rows.length === 0) return "Headers found but no data rows. Is the file empty below the header?";
  return { headers, rows: rows.map((r) => r.map((c) => String(c))) };
}

interface DropzoneProps {
  onParsed: (data: ParsedFile) => void;
}

export function Dropzone({ onParsed }: DropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [parsing, setParsing] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      setError("");
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (ext !== "csv" && ext !== "xlsx" && ext !== "xls" && ext !== "tsv") {
        setError("Only .csv, .tsv, and .xlsx files are supported.");
        return;
      }
      if (file.size > MAX_SIZE) {
        setError(`File too large (${formatSize(file.size)}). Max is 10MB.`);
        return;
      }
      if (file.size === 0) {
        setError("This file is empty.");
        return;
      }

      setParsing(true);

      if (ext === "csv" || ext === "tsv") {
        Papa.parse(file, {
          skipEmptyLines: true,
          delimiter: ext === "tsv" ? "\t" : undefined,
          complete(results) {
            setParsing(false);
            const result = processRows(results.data as string[][]);
            if (typeof result === "string") { setError(result); return; }
            onParsed({ name: file.name, size: file.size, ...result });
          },
          error() {
            setParsing(false);
            setError("Couldn't read this file. Check that it's valid CSV with UTF-8 encoding.");
          },
        });
      } else {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const XLSX = await import("xlsx");
            const data = new Uint8Array(e.target!.result as ArrayBuffer);
            const wb = XLSX.read(data, { type: "array" });
            const sheet = wb.Sheets[wb.SheetNames[0]];
            const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as string[][];
            const result = processRows(raw);
            if (typeof result === "string") { setError(result); setParsing(false); return; }
            onParsed({ name: file.name, size: file.size, ...result });
          } catch {
            setError("Couldn't read this Excel file. Try exporting as CSV.");
          }
          setParsing(false);
        };
        reader.readAsArrayBuffer(file);
      }
    },
    [onParsed]
  );

  return (
    <div>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        className={cn(
          "flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-6 py-20 text-center transition-all",
          dragging
            ? "border-emerald-500 bg-emerald-500/5"
            : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
        )}
      >
        {parsing ? (
          <File size={32} strokeWidth={1.5} className="animate-pulse text-emerald-500" />
        ) : (
          <FileUp size={32} strokeWidth={1.5} className={cn(dragging ? "text-emerald-500" : "text-gray-300 dark:text-gray-700")} />
        )}
        <p className="mt-4 text-sm font-medium">
          {parsing ? "Parsing file..." : "Drag and drop your file here"}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">or click to browse</p>
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-600">
          .csv, .tsv, or .xlsx — up to 10MB
        </p>
        <input type="file" accept=".csv,.xlsx,.xls,.tsv" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
      </label>

      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30">
          <X size={16} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
