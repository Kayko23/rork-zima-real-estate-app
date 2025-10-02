import type { MobileMoneyProvider } from '@/types';

const XOF = ['Bénin', 'Burkina Faso', "Côte d'Ivoire", 'Guinée-Bissau', 'Mali', 'Niger', 'Sénégal', 'Togo'];
const XAF = ['Cameroun', 'Congo', 'Gabon', 'Tchad', 'RCA', 'Guinée Équatoriale'];
const GHS = ['Ghana'];
const NGN = ['Nigeria'];

export function currencyForCountry(country?: string): string {
  if (!country) return 'XOF';
  if (XOF.includes(country)) return 'XOF';
  if (XAF.includes(country)) return 'XAF';
  if (GHS.includes(country)) return 'GHS';
  if (NGN.includes(country)) return 'NGN';
  return 'XOF';
}

export const PROVIDERS_BY_COUNTRY: Record<string, MobileMoneyProvider[]> = {
  "Sénégal": ['orange', 'wave'],
  "Côte d'Ivoire": ['orange', 'mtn', 'moov', 'wave'],
  "Bénin": ['mtn', 'moov'],
  "Togo": ['mtn', 'moov'],
  "Mali": ['orange', 'moov'],
  "Burkina Faso": ['orange', 'moov'],
  "Niger": ['mtn', 'moov'],
  "Guinée-Bissau": ['orange'],
  "Cameroun": ['mtn', 'orange'],
  "Gabon": ['mtn', 'moov'],
  "Congo": ['mtn', 'moov'],
  "Tchad": ['moov'],
  "RCA": ['orange'],
  "Guinée Équatoriale": ['mtn'],
  "Ghana": ['mtn'],
  "Nigeria": ['mtn'],
};

export function providersForCountry(country?: string): MobileMoneyProvider[] {
  if (!country) return ['orange', 'mtn', 'moov', 'wave'];
  return PROVIDERS_BY_COUNTRY[country] ?? ['orange', 'mtn', 'moov', 'wave'];
}

export function validateMsisdn(country: string, phone: string): boolean {
  const d = phone.replace(/[^\d]/g, '');
  const len = d.length;
  if (XOF.includes(country)) return len >= 8 && len <= 10;
  if (XAF.includes(country)) return len >= 8 && len <= 10;
  if (country === 'Ghana') return len >= 9 && len <= 10;
  if (country === 'Nigeria') return len === 10 || len === 11;
  return len >= 8 && len <= 12;
}

export type MobileMoneyCharge = {
  provider: MobileMoneyProvider;
  country: string;
  phone: string;
  amount: number;
  currency: string;
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
