"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Props = {
  userId: string;
  email: string;
  companyName: string;
  plan: string;
  emailAlertsEnabled: boolean;
  onToast: (msg: string) => void;
};

const PLAN_BADGE: Record<string, string> = {
  free: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  pro: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  enterprise: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
};

export function AccountSection({
  userId,
  email,
  companyName: initial,
  plan,
  emailAlertsEnabled: initialAlerts,
  onToast,
}: Props) {
  const [company, setCompany] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [alertsOn, setAlertsOn] = useState(initialAlerts);

  async function saveCompany() {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ company_name: company })
      .eq("id", userId);
    setSaving(false);
    onToast("Company name saved.");
  }

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Account
      </h2>
      <div className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {email}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium">Company</p>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your company name"
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-gray-800 dark:bg-gray-900 dark:focus:border-emerald-500"
            />
          </div>
          <button
            onClick={saveCompany}
            disabled={saving}
            className="shrink-0 self-end rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium transition-all duration-150 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:hover:bg-gray-900"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium">Plan</p>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
              PLAN_BADGE[plan] ?? PLAN_BADGE.free
            )}
          >
            {plan}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium">Email alerts</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Notify me when tariff changes affect my BOM
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={alertsOn}
            onClick={async () => {
              const next = !alertsOn;
              setAlertsOn(next);
              const supabase = createClient();
              await supabase
                .from("profiles")
                .update({ email_alerts_enabled: next })
                .eq("id", userId);
              onToast(next ? "Email alerts enabled." : "Email alerts disabled.");
            }}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
              alertsOn ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform dark:bg-gray-100",
                alertsOn ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
