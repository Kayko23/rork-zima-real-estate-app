export type PriceRange = { min: number; max: number };

const DEFAULT: PriceRange = { min: 10000, max: 200000 };

const MAP: Record<string, PriceRange> = {
  "côte d'ivoire": { min: 15000, max: 250000 },
  senegal: { min: 15000, max: 250000 },
  benin: { min: 10000, max: 200000 },
  togo: { min: 10000, max: 200000 },
  mali: { min: 12000, max: 180000 },
  "burkina faso": { min: 12000, max: 180000 },
  niger: { min: 10000, max: 160000 },
  "guinée-bissau": { min: 10000, max: 160000 },
  cameroun: { min: 8000, max: 150000 },
  gabon: { min: 12000, max: 220000 },
  congo: { min: 10000, max: 180000 },
  tchad: { min: 8000, max: 150000 },
  centrafrique: { min: 8000, max: 150000 },
  "guinée équatoriale": { min: 15000, max: 260000 },
  nigeria: { min: 3000, max: 500000 },
  ghana: { min: 30, max: 1500 },
  kenya: { min: 1500, max: 50000 },
  maroc: { min: 150, max: 2000 },
  tunisie: { min: 50, max: 800 },
  egypte: { min: 300, max: 6000 },
  france: { min: 30, max: 600 },
  "états-unis": { min: 40, max: 800 },
};

const norm = (s?: string) => (s || "").trim().toLowerCase();

export function defaultPriceRangeForCountry(country?: string): PriceRange {
  return MAP[norm(country)] ?? DEFAULT;
}
