const COUNTRY_MAP: Record<string, string> = {
  // China
  cn: "China", chn: "China", china: "China", prc: "China",
  "mainland china": "China", "people's republic of china": "China",
  "peoples republic of china": "China",

  // United States
  us: "United States", usa: "United States",
  "united states": "United States", "united states of america": "United States",

  // Canada
  ca: "Canada", can: "Canada", canada: "Canada",

  // Mexico
  mx: "Mexico", mex: "Mexico", mexico: "Mexico", "méxico": "Mexico",

  // Germany
  de: "Germany", deu: "Germany", germany: "Germany", deutschland: "Germany",

  // United Kingdom
  gb: "United Kingdom", gbr: "United Kingdom", uk: "United Kingdom",
  "united kingdom": "United Kingdom", "great britain": "United Kingdom",
  england: "United Kingdom",

  // Japan
  jp: "Japan", jpn: "Japan", japan: "Japan",

  // South Korea
  kr: "South Korea", kor: "South Korea", "south korea": "South Korea",
  korea: "South Korea", "republic of korea": "South Korea", rok: "South Korea",
  "s korea": "South Korea", "s. korea": "South Korea",

  // Taiwan
  tw: "Taiwan", twn: "Taiwan", taiwan: "Taiwan", roc: "Taiwan",
  "republic of china": "Taiwan", "chinese taipei": "Taiwan",

  // Vietnam
  vn: "Vietnam", vnm: "Vietnam", vietnam: "Vietnam", "viet nam": "Vietnam",

  // India
  in: "India", ind: "India", india: "India",

  // Thailand
  th: "Thailand", tha: "Thailand", thailand: "Thailand",

  // Malaysia
  my: "Malaysia", mys: "Malaysia", malaysia: "Malaysia",

  // Singapore
  sg: "Singapore", sgp: "Singapore", singapore: "Singapore",

  // Indonesia
  id: "Indonesia", idn: "Indonesia", indonesia: "Indonesia",

  // Philippines
  ph: "Philippines", phl: "Philippines", philippines: "Philippines",

  // France
  fr: "France", fra: "France", france: "France",

  // Italy
  it: "Italy", ita: "Italy", italy: "Italy", italia: "Italy",

  // Spain
  es: "Spain", esp: "Spain", spain: "Spain", "españa": "Spain",

  // Netherlands
  nl: "Netherlands", nld: "Netherlands", netherlands: "Netherlands",
  holland: "Netherlands", "the netherlands": "Netherlands",

  // Belgium
  be: "Belgium", bel: "Belgium", belgium: "Belgium",

  // Austria
  at: "Austria", aut: "Austria", austria: "Austria",

  // Switzerland
  ch: "Switzerland", che: "Switzerland", switzerland: "Switzerland",
  schweiz: "Switzerland",

  // Sweden
  se: "Sweden", swe: "Sweden", sweden: "Sweden",

  // Poland
  pl: "Poland", pol: "Poland", poland: "Poland", polska: "Poland",

  // Czech Republic
  cz: "Czech Republic", cze: "Czech Republic",
  "czech republic": "Czech Republic", czechia: "Czech Republic",
  czech: "Czech Republic",

  // Hungary
  hu: "Hungary", hun: "Hungary", hungary: "Hungary",

  // Romania
  ro: "Romania", rou: "Romania", romania: "Romania",

  // Ireland
  ie: "Ireland", irl: "Ireland", ireland: "Ireland",

  // Denmark
  dk: "Denmark", dnk: "Denmark", denmark: "Denmark",

  // Finland
  fi: "Finland", fin: "Finland", finland: "Finland",

  // Portugal
  pt: "Portugal", prt: "Portugal", portugal: "Portugal",

  // Greece
  gr: "Greece", grc: "Greece", greece: "Greece",

  // Turkey
  tr: "Turkey", tur: "Turkey", turkey: "Turkey",
  "türkiye": "Turkey", turkiye: "Turkey",

  // Australia
  au: "Australia", aus: "Australia", australia: "Australia",

  // New Zealand
  nz: "New Zealand", nzl: "New Zealand", "new zealand": "New Zealand",

  // South Africa
  za: "South Africa", zaf: "South Africa", "south africa": "South Africa",
  "s africa": "South Africa", "s. africa": "South Africa",

  // Israel
  il: "Israel", isr: "Israel", israel: "Israel",

  // Saudi Arabia
  sa: "Saudi Arabia", sau: "Saudi Arabia", "saudi arabia": "Saudi Arabia",
  ksa: "Saudi Arabia",

  // UAE
  ae: "United Arab Emirates", are: "United Arab Emirates",
  uae: "United Arab Emirates", "united arab emirates": "United Arab Emirates",
  dubai: "United Arab Emirates",

  // Brazil
  br: "Brazil", bra: "Brazil", brazil: "Brazil", brasil: "Brazil",

  // Bangladesh
  bd: "Bangladesh", bgd: "Bangladesh", bangladesh: "Bangladesh",

  // Pakistan
  pk: "Pakistan", pak: "Pakistan", pakistan: "Pakistan",

  // Cambodia
  kh: "Cambodia", khm: "Cambodia", cambodia: "Cambodia",

  // Sri Lanka
  lk: "Sri Lanka", lka: "Sri Lanka", "sri lanka": "Sri Lanka",
  ceylon: "Sri Lanka",

  // Myanmar
  mm: "Myanmar", mmr: "Myanmar", myanmar: "Myanmar", burma: "Myanmar",

  // Nigeria
  ng: "Nigeria", nga: "Nigeria", nigeria: "Nigeria",

  // Egypt
  eg: "Egypt", egy: "Egypt", egypt: "Egypt",

  // Chile
  cl: "Chile", chl: "Chile", chile: "Chile",

  // Colombia
  co: "Colombia", col: "Colombia", colombia: "Colombia",

  // Argentina
  ar: "Argentina", arg: "Argentina", argentina: "Argentina",

  // Peru
  pe: "Peru", per: "Peru", peru: "Peru",
};

export function normalizeCountry(raw: string): string {
  if (!raw) return "";
  const key = raw.trim().toLowerCase().replace(/\./g, "").replace(/\s+/g, " ");
  return COUNTRY_MAP[key] ?? raw.trim();
}
