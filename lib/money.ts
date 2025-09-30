import * as Localization from "expo-localization";
import { useApp } from "@/hooks/useAppStore";

const VALID_CURRENCIES = new Set([
  'XOF', 'XAF', 'NGN', 'GHS', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY'
]);

function isValidCurrency(currency: string): boolean {
  return VALID_CURRENCIES.has(currency);
}

export function useMoney() {
  const { currency: appCur, fxBase, fxRates } = useApp();

  const locale = Localization.getLocales()[0]?.languageTag ?? "fr-FR";
  const safeCurrency = isValidCurrency(appCur) ? appCur : 'XOF';

  function convert(amount: number, from: string) {
    if (!amount || typeof amount !== 'number' || isNaN(amount)) return 0;
    if (!from || typeof from !== 'string') return amount;
    if (!from || from === safeCurrency) return amount;
    if (!fxBase || !fxRates || Object.keys(fxRates).length === 0) return amount;
    
    try {
      const toBase = from === fxBase ? amount : amount / (fxRates[from] ?? 1);
      const toApp  = safeCurrency === fxBase ? toBase : toBase * (fxRates[safeCurrency] ?? 1);
      return toApp;
    } catch (error) {
      console.error('[useMoney] Convert error:', error);
      return amount;
    }
  }

  function format(amount: number, currency = safeCurrency) {
    if (!amount || typeof amount !== 'number' || isNaN(amount)) return '0';
    if (!currency || typeof currency !== 'string' || !isValidCurrency(currency)) {
      currency = safeCurrency;
    }
    
    try {
      return new Intl.NumberFormat(locale, { 
        style: "currency", 
        currency, 
        maximumFractionDigits: 0 
      }).format(amount);
    } catch (error) {
      console.error('[useMoney] Format error:', error, { amount, currency });
      return `${amount.toFixed(0)} ${currency}`;
    }
  }

  function formatFrom(amount: number, fromCurrency: string) {
    if (!amount || typeof amount !== 'number' || isNaN(amount)) return '0';
    if (!fromCurrency || typeof fromCurrency !== 'string') return format(amount);
    
    try {
      return format(convert(amount, fromCurrency), safeCurrency);
    } catch (error) {
      console.error('[useMoney] FormatFrom error:', error);
      return format(amount);
    }
  }

  return { appCurrency: safeCurrency, format, formatFrom, locale };
}