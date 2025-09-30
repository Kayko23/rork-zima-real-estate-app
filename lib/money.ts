import * as Localization from "expo-localization";
import { useApp } from "@/hooks/useAppStore";

export function useMoney() {
  const { currency: appCur, fxBase, fxRates } = useApp();

  const locale = Localization.getLocales()[0]?.languageTag ?? "fr-FR";

  function convert(amount: number, from: string) {
    if (!amount || typeof amount !== 'number') return 0;
    if (!from || typeof from !== 'string') return amount;
    if (!from || from === appCur) return amount;
    if (!fxBase || !fxRates || !fxRates[appCur]) return amount; // pas de taux → pas de conversion
    // normalise en base, puis convertit vers devise app
    const toBase = from === fxBase ? amount : amount / (fxRates[from] ?? 1);
    const toApp  = appCur === fxBase ? toBase : toBase * (fxRates[appCur] ?? 1);
    return toApp;
  }

  function format(amount: number, currency = appCur) {
    if (!amount || typeof amount !== 'number') return '0';
    if (!currency || typeof currency !== 'string') return amount.toString();
    return Intl.NumberFormat(locale, { 
      style: "currency", 
      currency, 
      maximumFractionDigits: 0 
    }).format(amount);
  }

  function formatFrom(amount: number, fromCurrency: string) {
    if (!amount || typeof amount !== 'number') return '0';
    if (!fromCurrency || typeof fromCurrency !== 'string') return format(amount);
    return format(convert(amount, fromCurrency), appCur);
  }

  return { appCurrency: appCur, format, formatFrom, locale };
}