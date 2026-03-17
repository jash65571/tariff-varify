"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  createCheckoutSession,
  createPortalSession,
} from "@/lib/stripe/checkout";
import { PlanCard } from "./plan-card";

type Props = {
  userId: string;
  email: string;
  plan: string;
  stripeCustomerId: string | null;
  priceProId: string;
  priceEnterpriseId: string;
  onToast: (msg: string) => void;
};

export function BillingSection({
  userId,
  email,
  plan,
  stripeCustomerId,
  priceProId,
  priceEnterpriseId,
  onToast,
}: Props) {
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [managingBilling, setManagingBilling] = useState(false);

  async function handleUpgrade(priceId: string) {
    setUpgrading(priceId);
    try {
      const url = await createCheckoutSession(priceId, userId, email);
      window.location.href = url;
    } catch {
      onToast("Something went wrong. Please try again.");
      setUpgrading(null);
    }
  }

  async function handleManageBilling() {
    if (!stripeCustomerId) return;
    setManagingBilling(true);
    try {
      const url = await createPortalSession(stripeCustomerId);
      window.location.href = url;
    } catch {
      onToast("Could not open billing portal.");
      setManagingBilling(false);
    }
  }

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Billing
      </h2>
      {plan === "free" ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PlanCard
            name="Pro"
            price="$99"
            period="/mo"
            features={[
              "Unlimited uploads",
              "Unlimited line items",
              "Scenario modeling",
              "PDF report export",
            ]}
            cta="Upgrade to Pro"
            onUpgrade={() => handleUpgrade(priceProId)}
            loading={upgrading === priceProId}
            accent
          />
          <PlanCard
            name="Enterprise"
            price="$299"
            period="/mo"
            features={[
              "Everything in Pro",
              "REST API access",
              "SSO authentication",
              "Dedicated support",
            ]}
            cta="Upgrade to Enterprise"
            onUpgrade={() => handleUpgrade(priceEnterpriseId)}
            loading={upgrading === priceEnterpriseId}
          />
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-800">
          <div>
            <p className="text-sm font-medium capitalize">{plan} plan</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {plan === "pro"
                ? "Unlimited uploads, scenarios, PDF export"
                : "Full access with API, SSO, and dedicated support"}
            </p>
          </div>
          <button
            onClick={handleManageBilling}
            disabled={managingBilling || !stripeCustomerId}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium transition-all duration-150 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:hover:bg-gray-900"
          >
            {managingBilling ? (
              <Loader2 size={14} className="animate-spin" />
            ) : null}
            Manage subscription
          </button>
        </div>
      )}
    </section>
  );
}
