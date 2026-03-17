"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AccountSection } from "./account-section";
import { BillingSection } from "./billing-section";

type Props = {
  userId: string;
  email: string;
  companyName: string;
  plan: string;
  emailAlertsEnabled: boolean;
  stripeCustomerId: string | null;
  priceProId: string;
  priceEnterpriseId: string;
};

export function SettingsPage({
  userId,
  email,
  companyName,
  plan,
  emailAlertsEnabled,
  stripeCustomerId,
  priceProId,
  priceEnterpriseId,
}: Props) {
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setToast("Your plan has been upgraded.");
    } else if (searchParams.get("canceled") === "true") {
      setToast("Checkout was canceled.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="max-w-2xl">
      {toast && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          {toast}
        </div>
      )}

      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Manage your account and billing.
      </p>

      <div className="mt-8 space-y-8">
        <AccountSection
          userId={userId}
          email={email}
          companyName={companyName}
          plan={plan}
          emailAlertsEnabled={emailAlertsEnabled}
          onToast={setToast}
        />
        <BillingSection
          userId={userId}
          email={email}
          plan={plan}
          stripeCustomerId={stripeCustomerId}
          priceProId={priceProId}
          priceEnterpriseId={priceEnterpriseId}
          onToast={setToast}
        />
      </div>
    </div>
  );
}
