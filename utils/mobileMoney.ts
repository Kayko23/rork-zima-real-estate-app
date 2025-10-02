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

export function validateMsisdn(country: string, phone: string): boolean {
  const digits = phone.replace(/[^\d]/g, '');
  const len = digits.length;

  if (XOF.includes(country)) {
    return len >= 8 && len <= 10;
  }
  if (XAF.includes(country)) {
    return len >= 8 && len <= 10;
  }
  if (country === 'Ghana') return len >= 9 && len <= 10;
  if (country === 'Nigeria') return len === 10 || len === 11;
  return len >= 8 && len <= 11;
}

export type MobileMoneyCharge = {
  provider: MobileMoneyProvider;
  country: string;
  phone: string;
  amount: number;
  currency: string;
  description?: string;
};

export async function startMobileMoneyCharge(
  payload: MobileMoneyCharge
): Promise<{ status: 'pending' | 'success' | 'failed'; trxId?: string; reason?: string }> {
  console.log('[Mobile Money] Starting charge:', payload);
  
  await sleep(500);
  await sleep(1200);
  
  const ok = Math.random() > 0.15;
  
  if (ok) {
    console.log('[Mobile Money] Charge successful');
    return { status: 'success', trxId: `MM-${Date.now()}` };
  } else {
    console.log('[Mobile Money] Charge failed');
    return { status: 'failed', reason: 'Refusé par l\'opérateur' };
  }
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
