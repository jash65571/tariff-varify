export type Feature =
  | "scenarios"
  | "pdf_export"
  | "api_access"
  | "unlimited_uploads"
  | "unlimited_items";

const ACCESS_MAP: Record<string, Set<Feature>> = {
  free: new Set(),
  pro: new Set([
    "scenarios",
    "pdf_export",
    "unlimited_uploads",
    "unlimited_items",
  ]),
  enterprise: new Set([
    "scenarios",
    "pdf_export",
    "api_access",
    "unlimited_uploads",
    "unlimited_items",
  ]),
};

export function canAccess(plan: string, feature: Feature): boolean {
  return ACCESS_MAP[plan]?.has(feature) ?? false;
}

export const MAX_FREE_UPLOADS = 1;
export const MAX_FREE_ITEMS = 50;
