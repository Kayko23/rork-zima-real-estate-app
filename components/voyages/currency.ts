export type Currency = { code: string; symbol: string; label: string };

const M = (code: string, symbol: string, label?: string): Currency => ({ code, symbol, label: label ?? code });

const MAP: Record<string, Currency> = {
  "côte d'ivoire": M("XOF", "F CFA", "Franc CFA (UEMOA)"),
  benin: M("XOF", "F CFA"),
  "burkina faso": M("XOF", "F CFA"),
  mali: M("XOF", "F CFA"),
  niger: M("XOF", "F CFA"),
  senegal: M("XOF", "F CFA"),
  togo: M("XOF", "F CFA"),
  "guinée-bissau": M("XOF", "F CFA"),
  cameroun: M("XAF", "F CFA", "Franc CFA (CEMAC)"),
  tchad: M("XAF", "F CFA"),
  centrafrique: M("XAF", "F CFA"),
  congo: M("XAF", "F CFA"),
  gabon: M("XAF", "F CFA"),
  "guinée équatoriale": M("XAF", "F CFA"),
  nigeria: M("NGN", "₦", "Naira"),
  ghana: M("GHS", "₵", "Cedi"),
  liberia: M("LRD", "$"),
  "sierra leone": M("SLL", "Le"),
  "cap-vert": M("CVE", "$"),
  gambie: M("GMD", "D"),
  "guinée": M("GNF", "FG"),
  maroc: M("MAD", "د.م."),
  tunisie: M("TND", "د.ت."),
  egypte: M("EGP", "£"),
  kenya: M("KES", "KSh"),
  "afrique du sud": M("ZAR", "R"),
  usa: M("USD", "$"),
  "états-unis": M("USD", "$"),
  france: M("EUR", "€"),
  turquie: M("TRY", "₺"),
};

const norm = (s?: string) => (s || "").trim().toLowerCase();

export function currencyFromCountry(country?: string): Currency {
  const n = norm(country);
  if (!n) return M("XOF", "F CFA");
  const hit = MAP[n] || MAP[n.replace("cote", "côté")] || MAP[n.replace("’", "'")];
  return hit ?? M("USD", "$");
}

export function localeForCurrency(cur: string): string {
  switch (cur) {
    case "XOF":
    case "XAF":
      return "fr-FR";
    case "NGN":
      return "en-NG";
    case "GHS":
      return "en-GH";
    case "ZAR":
      return "en-ZA";
    case "MAD":
      return "fr-MA";
    case "TND":
      return "fr-TN";
    case "EGP":
      return "ar-EG";
    case "KES":
      return "en-KE";
    case "EUR":
      return "fr-FR";
    case "TRY":
      return "tr-TR";
    case "USD":
    default:
      return "en-US";
  }
}

export function formatPrice(value: number, cur: Currency, opts: Intl.NumberFormatOptions = {}) {
  const nf = new Intl.NumberFormat(localeForCurrency(cur.code), {
    style: "currency",
    currency: cur.code,
    currencyDisplay: cur.code === "XOF" || cur.code === "XAF" ? "code" : "symbol",
    maximumFractionDigits: 0,
    ...opts,
  });
  let out = nf.format(value);
  if (cur.code === "XOF" || cur.code === "XAF") out = out.replace(cur.code, "F CFA");
  return out;
}
