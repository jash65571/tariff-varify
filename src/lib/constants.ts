export const PLAN_LIMITS = {
  free: {
    maxUploads: 1,
    maxItems: 50,
    scenarios: false,
    pdfExport: false,
    apiAccess: false,
  },
  pro: {
    maxUploads: Infinity,
    maxItems: Infinity,
    scenarios: true,
    pdfExport: true,
    apiAccess: false,
  },
  enterprise: {
    maxUploads: Infinity,
    maxItems: Infinity,
    scenarios: true,
    pdfExport: true,
    apiAccess: true,
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;
