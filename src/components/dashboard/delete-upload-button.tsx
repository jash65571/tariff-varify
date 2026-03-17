"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function DeleteUploadButton({ uploadId }: { uploadId: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this report? This removes all items and scenarios for this upload.")) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("bom_uploads").delete().eq("id", uploadId);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className="rounded p-1 text-gray-400 transition-colors hover:text-red-500 disabled:opacity-50 dark:text-gray-500 dark:hover:text-red-400"
      title="Delete report"
    >
      <Trash2 size={16} />
    </button>
  );
}
