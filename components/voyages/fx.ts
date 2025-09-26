import AsyncStorage from "@react-native-async-storage/async-storage";

/** === Pivot USD → conversions simples === */
export type Rates = Record<string, number>;
let RATES: Rates = {
  USD: 1,
  XOF: 612, XAF: 612,
  NGN: 1550, GHS: 15.6, KES: 129, ZAR: 17.9,
  MAD: 10.0, TND: 3.1, EGP: 49,
  EUR: 0.92, TRY: 34.0,
};

const FX_KEY = "zima.fx.rates.v1";
const FX_AT  = "zima.fx.updatedAt.v1";

/** Conversion currency A → currency B (en arrondissant aux unités) */
export function convert(amount: number, from: string, to: string) {
  const f = RATES[from] ?? 1;
  const t = RATES[to] ?? 1;
  const usd = amount / f;
  return Math.max(0, Math.round(usd * t));
}

export function getRates(){ return { ...RATES }; }
export function updateRates(next: Rates){ RATES = { ...RATES, ...next }; }

/** Charge les taux depuis le cache local (si existant) */
export async function loadRatesFromCache(){
  try {
    const raw = await AsyncStorage.getItem(FX_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Rates;
    if (parsed && typeof parsed === "object") updateRates(parsed);
  } catch {/* ignore */}
}

/** Sauve les taux + horodatage */
async function saveRates(r: Rates){
  try {
    await AsyncStorage.setItem(FX_KEY, JSON.stringify(r));
    await AsyncStorage.setItem(FX_AT, String(Date.now()));
  } catch {}
}

export async function getLastFxUpdateAt(): Promise<number|null>{
  try {
    const raw = await AsyncStorage.getItem(FX_AT);
    return raw ? Number(raw) : null;
  } catch { return null; }
}

/**
 * Récupère des taux depuis exchangerate.host (gratuit sans clé).
 * On utilise USD comme base, et on extrait seulement les devises utiles.
 */
export async function refreshRatesOnline() {
  try {
    const res = await fetch("https://api.exchangerate.host/latest?base=USD");
    if (!res.ok) throw new Error("bad status");
    const json = await res.json();
    const r = json?.rates || {};

    const next: Rates = {
      USD: 1,
      XOF: r["XOF"] ?? RATES.XOF,
      XAF: r["XAF"] ?? RATES.XAF,
      NGN: r["NGN"] ?? RATES.NGN,
      GHS: r["GHS"] ?? RATES.GHS,
      KES: r["KES"] ?? RATES.KES,
      ZAR: r["ZAR"] ?? RATES.ZAR,
      MAD: r["MAD"] ?? RATES.MAD,
      TND: r["TND"] ?? RATES.TND,
      EGP: r["EGP"] ?? RATES.EGP,
      EUR: r["EUR"] ?? RATES.EUR,
      TRY: r["TRY"] ?? RATES.TRY,
    };
    updateRates(next);
    await saveRates(next);
    return true;
  } catch {
    return false; // fallback sur cache/valeurs embarquées
  }
}
