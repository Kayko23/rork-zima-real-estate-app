import { Currency, PriceRange, CountryCode } from './types';

export const COUNTRY_TO_CURRENCY: Record<CountryCode, Currency> = {
  SN: 'XOF', CI: 'XOF', BF: 'XOF', ML: 'XOF', NE: 'XOF', BJ: 'XOF', TG: 'XOF',
  CM: 'XAF', GA: 'XAF', CG: 'XAF', TD: 'XAF', GQ: 'XAF', CD: 'XAF', CF: 'XAF',
  NG: 'NGN', 
  GH: 'GHS',
  RW: 'USD', BI: 'USD', DJ: 'USD', SO: 'USD', KE: 'USD', UG: 'USD', TZ: 'USD',
  MZ: 'USD', ZM: 'USD', ZW: 'USD', BW: 'USD', NA: 'USD', ZA: 'USD', LS: 'USD',
  SZ: 'USD', MG: 'USD', MU: 'USD', SC: 'USD',
};

export const DEFAULT_PRICE_RANGE: Record<Currency, PriceRange> = {
  XOF: { min: 10000, max: 5_000_000, step: 5_000, currency: 'XOF' },
  XAF: { min: 10000, max: 5_000_000, step: 5_000, currency: 'XAF' },
  NGN: { min: 3_000, max: 500_000, step: 1_000, currency: 'NGN' },
  GHS: { min: 50, max: 50_000, step: 50, currency: 'GHS' },
  USD: { min: 10, max: 10_000, step: 5, currency: 'USD' },
  EUR: { min: 10, max: 10_000, step: 5, currency: 'EUR' },
};

export function currencyForCountry(cc?: CountryCode): Currency {
  if (!cc) return 'USD';
  return COUNTRY_TO_CURRENCY[cc] ?? 'USD';
}

export function getPriceRangeForCountry(cc?: CountryCode): PriceRange {
  const currency = currencyForCountry(cc);
  return DEFAULT_PRICE_RANGE[currency];
}
