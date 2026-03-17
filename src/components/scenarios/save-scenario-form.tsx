"use client";

import { useState } from "react";

type Props = {
  onSave: (name: string) => Promise<void>;
};

export function SaveScenarioForm({ onSave }: Props) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    await onSave(name.trim());
    setName("");
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="text-sm font-medium">Scenario name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Move PCBs to Vietnam"
          className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving || !name.trim()}
        className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-200"
      >
        {saving ? "Saving..." : "Save scenario"}
      </button>
    </div>
  );
}
