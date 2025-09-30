import { Currency } from './types';

export const NBSP = '\u00A0';

export function formatMoney(value: number, currency: Currency, locale = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency, 
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\s/g, NBSP);
}

export function formatCompactMoney(value: number, currency: Currency): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M${NBSP}${currency}`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K${NBSP}${currency}`;
  }
  return `${value}${NBSP}${currency}`;
}
