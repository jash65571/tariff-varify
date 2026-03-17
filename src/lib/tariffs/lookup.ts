import { normalizeCountry } from "./countries";
import { TARIFF_RATES, DEFAULT_RATE, DEFAULT_SOURCE } from "./rates";

export type TariffResult = {
  countryCode: string;
  countryName: string;
  tariffRate: number;
  rateSource: string;
};

export function getTariffRate(rawCountry: string): TariffResult {
  const countryName = normalizeCountry(rawCountry);
  const entry = TARIFF_RATES[countryName];

  if (entry) {
    return {
      countryCode: entry.code,
      countryName,
      tariffRate: entry.rate,
      rateSource: entry.source,
    };
  }

  return {
    countryCode: rawCountry.trim().toUpperCase().slice(0, 2),
    countryName: countryName || rawCountry.trim(),
    tariffRate: DEFAULT_RATE,
    rateSource: DEFAULT_SOURCE,
  };
}

export function getRiskLevel(rate: number): "low" | "medium" | "high" | "critical" {
  if (rate < 10) return "low";
  if (rate <= 20) return "medium";
  if (rate <= 30) return "high";
  return "critical";
}
