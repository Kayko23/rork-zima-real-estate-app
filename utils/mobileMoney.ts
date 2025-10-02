import type { MobileMoneyProvider } from '@/types';
import { CfaCountryCode, CurrencyCode, getCfaCurrencyForCountry } from '@/constants/cfa';

export function currencyForCountry(countryCode?: string): CurrencyCode {
  if (!countryCode) return 'XOF';
  return getCfaCurrencyForCountry(countryCode);
}

export const PROVIDERS_BY_COUNTRY: Record<CfaCountryCode, MobileMoneyProvider[]> = {
  SN: ['orange', 'wave'],
  CI: ['orange', 'mtn', 'moov', 'wave'],
  BJ: ['mtn', 'moov'],
  TG: ['mtn', 'moov'],
  ML: ['orange', 'moov'],
  BF: ['orange', 'moov'],
  NE: ['mtn', 'moov'],
  GW: ['orange'],
  CM: ['mtn', 'orange'],
  GA: ['mtn', 'moov'],
  CG: ['mtn', 'moov'],
  TD: ['moov'],
  CF: ['orange'],
  GQ: ['mtn'],
};

export function providersForCountry(countryCode?: string): MobileMoneyProvider[] {
  if (!countryCode) return ['orange', 'mtn', 'moov', 'wave'];
  return PROVIDERS_BY_COUNTRY[countryCode as CfaCountryCode] ?? ['orange', 'mtn', 'moov', 'wave'];
}

export function validateMsisdn(countryCode: string, phone: string): boolean {
  const d = phone.replace(/[^\d]/g, '');
  const len = d.length;
  return len >= 8 && len <= 12;
}

export type MobileMoneyCharge = {
  provider: MobileMoneyProvider;
  countryCode: CfaCountryCode;
  phone: string;
  amount: number;
  currency: CurrencyCode;
  description?: string;
};

export async function startMobileMoneyCharge(payload: MobileMoneyCharge):
  Promise<{ status: 'pending' | 'success' | 'failed'; trxId?: string; reason?: string }>
{
  console.log('[MobileMoney] Starting charge:', payload);
  await sleep(400);
  await sleep(1200);
  const ok = Math.random() > 0.15;
  
  if (ok) {
    console.log('[MobileMoney] Charge successful');
    return { status: 'success', trxId: `MM-${Date.now()}` };
  } else {
    console.log('[MobileMoney] Charge failed');
    return { status: 'failed', reason: 'Refus opérateur' };
  }
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
