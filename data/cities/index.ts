// data/cities/index.ts
// Import all city data statically
import CI from './CI.json';
import SN from './SN.json';
import CM from './CM.json';

export type CityItem = { n: string; a?: string };

const ISO_BY_NAME: Record<string, string> = {
  'Bénin':'BJ','Burkina Faso':'BF','Côte d\'Ivoire':'CI','Guinée-Bissau':'GW','Mali':'ML','Niger':'NE','Sénégal':'SN','Togo':'TG',
  'Cap-Vert':'CV','Gambie':'GM','Ghana':'GH','Guinée':'GN','Libéria':'LR','Nigeria':'NG','Sierra Leone':'SL',
  'Cameroun':'CM','Congo':'CG','Gabon':'GA','Tchad':'TD','Rép. centrafricaine':'CF','Guinée équatoriale':'GQ'
};

// Static data mapping
const CITY_DATA: Record<string, CityItem[]> = {
  'CI': CI as CityItem[],
  'SN': SN as CityItem[],
  'CM': CM as CityItem[],
  // Add more as needed
};

export async function loadCitiesByCountry(countryName: string): Promise<CityItem[]> {
  const iso = ISO_BY_NAME[countryName];
  if (!iso || !CITY_DATA[iso]) return [];
  
  // Return a copy to avoid mutations
  return [...CITY_DATA[iso]];
}