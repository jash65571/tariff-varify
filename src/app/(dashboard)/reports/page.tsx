import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { DeleteUploadButton } from "@/components/dashboard/delete-upload-button";

export const metadata: Metadata = { title: "Reports — TariffVerify" };

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: uploads } = await supabase
    .from("bom_uploads").select("*").eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  if (!uploads || uploads.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Tariff exposure reports for each BOM you upload.
        </p>
        <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-gray-200 px-6 py-16 text-center dark:border-gray-800">
          <FileText size={24} strokeWidth={1.5} className="text-gray-300 dark:text-gray-700" />
          <p className="mt-4 text-sm font-medium">No reports yet</p>
          <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Upload a BOM and we&apos;ll generate a report with tariff rates and exposure by country.
          </p>
          <Link href="/upload" className="mt-6 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">
            Upload a BOM
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {uploads.length} report{uploads.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/upload" className="rounded-lg bg-gray-950 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-200">
          New analysis
        </Link>
      </div>

      <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        {uploads.map((u) => {
          const rate = Number(u.effective_tariff_rate) || 0;
          const statusBadge =
            u.status === "completed"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
              : u.status === "failed"
                ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400";

          return (
            <Link
              key={u.id}
              href={`/reports/${u.id}`}
              className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{u.filename}</p>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", statusBadge)}>{u.status}</span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {u.total_items} items — {new Date(u.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs sm:text-right">
                <div className="flex gap-6">
                  <div>
                    <p className="text-gray-400">Spend</p>
                    <p className="font-mono font-medium">${Number(u.total_spend).toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Exposure</p>
                    <p className="font-mono font-medium text-red-600 dark:text-red-400">${Number(u.total_tariff_exposure).toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Rate</p>
                    <p className="font-mono font-medium">{rate.toFixed(1)}%</p>
                  </div>
                </div>
                <DeleteUploadButton uploadId={u.id} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
