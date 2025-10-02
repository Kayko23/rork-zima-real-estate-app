export type CurrencyCode = 'XOF' | 'XAF';
export type CfaCountryCode =
  | 'BJ' | 'BF' | 'CI' | 'GW' | 'ML' | 'NE' | 'SN' | 'TG'    // UEMOA
  | 'CM' | 'CF' | 'TD' | 'CG' | 'GQ' | 'GA';                 // CEMAC

export const CFA_COUNTRIES: Record<CfaCountryCode, {
  name: string; 
  zone: 'UEMOA'|'CEMAC'; 
  currency: CurrencyCode;
}> = {
  BJ: { name: 'Bénin', zone: 'UEMOA', currency: 'XOF' },
  BF: { name: 'Burkina Faso', zone: 'UEMOA', currency: 'XOF' },
  CI: { name: "Côte d'Ivoire", zone: 'UEMOA', currency: 'XOF' },
  GW: { name: 'Guinée-Bissau', zone: 'UEMOA', currency: 'XOF' },
  ML: { name: 'Mali', zone: 'UEMOA', currency: 'XOF' },
  NE: { name: 'Niger', zone: 'UEMOA', currency: 'XOF' },
  SN: { name: 'Sénégal', zone: 'UEMOA', currency: 'XOF' },
  TG: { name: 'Togo', zone: 'UEMOA', currency: 'XOF' },
  CM: { name: 'Cameroun', zone: 'CEMAC', currency: 'XAF' },
  CF: { name: 'République centrafricaine', zone: 'CEMAC', currency: 'XAF' },
  TD: { name: 'Tchad', zone: 'CEMAC', currency: 'XAF' },
  CG: { name: 'Congo', zone: 'CEMAC', currency: 'XAF' },
  GQ: { name: 'Guinée équatoriale', zone: 'CEMAC', currency: 'XAF' },
  GA: { name: 'Gabon', zone: 'CEMAC', currency: 'XAF' },
};

export const ALLOWED_COUNTRY_CODES = Object.keys(CFA_COUNTRIES) as CfaCountryCode[];
export const DEFAULT_COUNTRY: CfaCountryCode = 'SN';

export function getCfaCountryByCode(code: string): typeof CFA_COUNTRIES[CfaCountryCode] | undefined {
  return CFA_COUNTRIES[code as CfaCountryCode];
}

export function getCfaCurrencyForCountry(code: string): CurrencyCode {
  return CFA_COUNTRIES[code as CfaCountryCode]?.currency ?? 'XOF';
}

export function isCfaCountry(code: string): boolean {
  return ALLOWED_COUNTRY_CODES.includes(code as CfaCountryCode);
}

export function getCfaCountriesList() {
  return ALLOWED_COUNTRY_CODES.map(code => ({
    code,
    ...CFA_COUNTRIES[code]
  }));
}
