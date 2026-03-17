"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function DeleteReportButton({ uploadId }: { uploadId: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!window.confirm("Delete this report? This removes all items and scenarios for this upload.")) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("bom_uploads").delete().eq("id", uploadId);
    router.push("/reports");
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:text-red-600 disabled:opacity-50 dark:border-red-900/50 dark:hover:text-red-400"
    >
      <Trash2 size={14} />
      Delete
    </button>
  );
}
