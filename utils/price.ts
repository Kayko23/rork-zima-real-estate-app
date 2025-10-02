import { CurrencyCode } from '@/constants/cfa';

export function formatCfa(amount: number, currency: CurrencyCode = 'XOF'): string {
  if (!amount || typeof amount !== 'number') return '0 F CFA';
  
  const formatter = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  
  const formatted = formatter.format(amount);
  
  return `${formatted} F CFA`;
}

export function formatCfaShort(amount: number, currency: CurrencyCode = 'XOF'): string {
  if (!amount || typeof amount !== 'number') return '0';
  
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}Md`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}k`;
  }
  
  return amount.toString();
}

export function parseCfaAmount(input: string): number {
  const cleaned = input.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
}
