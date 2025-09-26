import { useEffect } from "react";
import { useApp } from "@/hooks/useAppStore";
import { COUNTRY_TO_CURRENCY } from "@/lib/currency-data";

export function useSuggestCurrency(selectedCountryISO2?: string) {
  const { currency, setCurrency } = useApp();
  
  useEffect(() => {
    if (!selectedCountryISO2) return;
    const suggested = COUNTRY_TO_CURRENCY[selectedCountryISO2];
    if (suggested && suggested !== currency) {
      // Auto-apply the suggested currency for the selected country
      setCurrency(suggested);
    }
  }, [selectedCountryISO2, currency, setCurrency]);
}