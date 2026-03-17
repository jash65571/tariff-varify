export type TariffEntry = {
  rate: number;
  source: string;
  code: string;
};

export const DEFAULT_RATE = 10;
export const DEFAULT_SOURCE = "Universal baseline";

export const TARIFF_RATES: Record<string, TariffEntry> = {
  // --- Section 301 ---
  "China":              { rate: 30, source: "Section 301 + universal baseline", code: "CN" },

  // --- Section 122 (USMCA partners) ---
  "Canada":             { rate: 10, source: "Section 122", code: "CA" },
  "Mexico":             { rate: 10, source: "Section 122", code: "MX" },

  // --- Reciprocal tariffs (above baseline) ---
  "India":              { rate: 26, source: "Reciprocal tariff", code: "IN" },
  "Thailand":           { rate: 36, source: "Reciprocal tariff", code: "TH" },
  "Switzerland":        { rate: 31, source: "Reciprocal tariff", code: "CH" },
  "Indonesia":          { rate: 32, source: "Reciprocal tariff", code: "ID" },
  "Malaysia":           { rate: 24, source: "Reciprocal tariff", code: "MY" },
  "Philippines":        { rate: 17, source: "Reciprocal tariff", code: "PH" },
  "Israel":             { rate: 17, source: "Reciprocal tariff", code: "IL" },
  "Bangladesh":         { rate: 37, source: "Reciprocal tariff", code: "BD" },
  "Pakistan":           { rate: 29, source: "Reciprocal tariff", code: "PK" },
  "Cambodia":           { rate: 49, source: "Reciprocal tariff", code: "KH" },
  "Sri Lanka":          { rate: 44, source: "Reciprocal tariff", code: "LK" },
  "Myanmar":            { rate: 44, source: "Reciprocal tariff", code: "MM" },
  "South Africa":       { rate: 30, source: "Reciprocal tariff", code: "ZA" },
  "Nigeria":            { rate: 14, source: "Reciprocal tariff", code: "NG" },

  // --- Universal baseline (10%) ---
  "Vietnam":            { rate: 10, source: "Universal baseline", code: "VN" },
  "Taiwan":             { rate: 10, source: "Universal baseline", code: "TW" },
  "Japan":              { rate: 10, source: "Universal baseline", code: "JP" },
  "South Korea":        { rate: 10, source: "Universal baseline", code: "KR" },
  "United Kingdom":     { rate: 10, source: "Universal baseline", code: "GB" },
  "Australia":          { rate: 10, source: "Universal baseline", code: "AU" },
  "New Zealand":        { rate: 10, source: "Universal baseline", code: "NZ" },
  "Singapore":          { rate: 10, source: "Universal baseline", code: "SG" },
  "Turkey":             { rate: 10, source: "Universal baseline", code: "TR" },
  "Saudi Arabia":       { rate: 10, source: "Universal baseline", code: "SA" },
  "United Arab Emirates": { rate: 10, source: "Universal baseline", code: "AE" },
  "Egypt":              { rate: 10, source: "Universal baseline", code: "EG" },
  "Brazil":             { rate: 10, source: "Universal baseline", code: "BR" },
  "Chile":              { rate: 10, source: "Universal baseline", code: "CL" },
  "Colombia":           { rate: 10, source: "Universal baseline", code: "CO" },
  "Argentina":          { rate: 10, source: "Universal baseline", code: "AR" },
  "Peru":               { rate: 10, source: "Universal baseline", code: "PE" },

  // --- EU members (10% each) ---
  "Germany":            { rate: 10, source: "Universal baseline", code: "DE" },
  "France":             { rate: 10, source: "Universal baseline", code: "FR" },
  "Italy":              { rate: 10, source: "Universal baseline", code: "IT" },
  "Spain":              { rate: 10, source: "Universal baseline", code: "ES" },
  "Netherlands":        { rate: 10, source: "Universal baseline", code: "NL" },
  "Belgium":            { rate: 10, source: "Universal baseline", code: "BE" },
  "Austria":            { rate: 10, source: "Universal baseline", code: "AT" },
  "Ireland":            { rate: 10, source: "Universal baseline", code: "IE" },
  "Poland":             { rate: 10, source: "Universal baseline", code: "PL" },
  "Sweden":             { rate: 10, source: "Universal baseline", code: "SE" },
  "Czech Republic":     { rate: 10, source: "Universal baseline", code: "CZ" },
  "Hungary":            { rate: 10, source: "Universal baseline", code: "HU" },
  "Romania":            { rate: 10, source: "Universal baseline", code: "RO" },
  "Denmark":            { rate: 10, source: "Universal baseline", code: "DK" },
  "Finland":            { rate: 10, source: "Universal baseline", code: "FI" },
  "Portugal":           { rate: 10, source: "Universal baseline", code: "PT" },
  "Greece":             { rate: 10, source: "Universal baseline", code: "GR" },

  // --- Domestic ---
  "United States":      { rate: 0, source: "Domestic", code: "US" },
};
