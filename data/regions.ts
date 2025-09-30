// data/regions.ts
import { COUNTRY_CITIES } from '../constants/countries';

export const UEMOA_COUNTRIES = Object.values(COUNTRY_CITIES)
  .filter(c => c.bloc.includes('UEMOA'))
  .map(c => c.name);

export const CEDEAO_ONLY_COUNTRIES = Object.values(COUNTRY_CITIES)
  .filter(c => c.bloc.includes('CEDEAO') && !c.bloc.includes('UEMOA'))
  .map(c => c.name);

export const CEMAC_COUNTRIES = Object.values(COUNTRY_CITIES)
  .filter(c => c.bloc.includes('CEMAC'))
  .map(c => c.name);

export const CEDEAO_COUNTRIES = Object.values(COUNTRY_CITIES)
  .filter(c => c.bloc.includes('CEDEAO'))
  .map(c => c.name);

// Legacy exports
export const UEMOA = UEMOA_COUNTRIES;
export const CEDEAO_ONLY = CEDEAO_ONLY_COUNTRIES;
export const CEMAC = CEMAC_COUNTRIES;
export const CEDEAO = CEDEAO_COUNTRIES;

// Ensemble total (unique + tri alpha)
export const ALL_TARGET_COUNTRIES = Array.from(
  new Set([...CEDEAO_COUNTRIES, ...CEMAC_COUNTRIES])
).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
