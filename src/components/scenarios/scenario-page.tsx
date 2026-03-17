"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getTariffRate } from "@/lib/tariffs/lookup";
import { ScenarioBuilder } from "./scenario-builder";
import { ScenarioComparison } from "./scenario-comparison";
import { SavedScenariosList } from "./saved-scenarios-list";
import { SaveScenarioForm } from "./save-scenario-form";

type BomUpload = {
  id: string;
  filename: string;
  total_spend: number;
  total_tariff_exposure: number;
  effective_tariff_rate: number;
  total_items: number;
  created_at: string;
};

type BomItem = {
  id: string;
  item_name: string;
  supplier_country: string;
  annual_spend: number;
  tariff_rate: number;
  tariff_cost: number;
  risk_level: string;
};

type SavedScenario = {
  id: string;
  name: string;
  upload_id: string;
  changes: Record<string, { from: string; to: string }>;
  total_savings: number;
  created_at: string;
};

type Props = {
  uploads: BomUpload[];
  savedScenarios: SavedScenario[];
  userId: string;
};

export function ScenarioPage({ uploads, savedScenarios: initial, userId }: Props) {
  const [selectedUploadId, setSelectedUploadId] = useState("");
  const [items, setItems] = useState<BomItem[]>([]);
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [scenarios, setScenarios] = useState<SavedScenario[]>(initial);
  const [loading, setLoading] = useState(false);

  const handleSelectUpload = useCallback(async (uploadId: string) => {
    setSelectedUploadId(uploadId);
    setChanges({});
    if (!uploadId) { setItems([]); return; }
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("bom_items").select("*").eq("upload_id", uploadId)
      .order("tariff_cost", { ascending: false });
    setItems((data as BomItem[]) || []);
    setLoading(false);
  }, []);

  const handleChange = useCallback((itemId: string, newCountry: string) => {
    setChanges((prev) => ({ ...prev, [itemId]: newCountry }));
  }, []);

  const handleSave = useCallback(async (name: string) => {
    if (!selectedUploadId) return;
    const changeRecords: Record<string, { from: string; to: string }> = {};
    let current = 0, scenario = 0;
    for (const item of items) {
      current += Number(item.tariff_cost);
      const nc = changes[item.id];
      if (nc && nc !== item.supplier_country) {
        changeRecords[item.id] = { from: item.supplier_country, to: nc };
        scenario += (Number(item.annual_spend) * getTariffRate(nc).tariffRate) / 100;
      } else {
        scenario += Number(item.tariff_cost);
      }
    }
    const supabase = createClient();
    const { data } = await supabase.from("scenarios")
      .insert({ user_id: userId, upload_id: selectedUploadId, name, changes: changeRecords, total_savings: current - scenario })
      .select().single();
    if (data) setScenarios((prev) => [data as SavedScenario, ...prev]);
  }, [selectedUploadId, items, changes, userId]);

  const handleLoad = useCallback(async (scenario: SavedScenario) => {
    if (scenario.upload_id !== selectedUploadId) {
      await handleSelectUpload(scenario.upload_id);
    }
    const restored: Record<string, string> = {};
    for (const [itemId, change] of Object.entries(scenario.changes)) {
      restored[itemId] = change.to;
    }
    setChanges(restored);
  }, [selectedUploadId, handleSelectUpload]);

  const hasChanges = Object.keys(changes).some((id) => {
    const item = items.find((i) => i.id === id);
    return item && changes[id] !== item.supplier_country;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Scenarios</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Model what happens when you move parts between countries.
      </p>

      <div className="mt-6">
        <label className="text-sm font-medium">Select a BOM upload</label>
        <select
          value={selectedUploadId}
          onChange={(e) => handleSelectUpload(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50"
        >
          <option value="">Choose an upload...</option>
          {uploads.map((u) => (
            <option key={u.id} value={u.id}>
              {u.filename} ({u.total_items} items)
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">Loading items...</p>
      )}

      {selectedUploadId && items.length > 0 && !loading && (
        <div className="mt-6 space-y-6">
          <ScenarioBuilder items={items} changes={changes} onChange={handleChange} />
          <ScenarioComparison originalItems={items} changes={changes} />
          {hasChanges && <SaveScenarioForm onSave={handleSave} />}
        </div>
      )}

      {scenarios.length > 0 && (
        <div className="mt-10">
          <SavedScenariosList scenarios={scenarios} onLoad={handleLoad} />
        </div>
      )}
    </div>
  );
}
