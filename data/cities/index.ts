// data/cities/index.ts
export type CityItem = { n: string; a?: string };

const ISO_BY_NAME: Record<string, string> = {
  'Bénin':'BJ','Burkina Faso':'BF','Côte d\'Ivoire':'CI','Guinée-Bissau':'GW','Mali':'ML','Niger':'NE','Sénégal':'SN','Togo':'TG',
  'Cap-Vert':'CV','Gambie':'GM','Ghana':'GH','Guinée':'GN','Libéria':'LR','Nigeria':'NG','Sierra Leone':'SL',
  'Cameroun':'CM','Congo':'CG','Gabon':'GA','Tchad':'TD','Rép. centrafricaine':'CF','Guinée équatoriale':'GQ'
};

export async function loadCitiesByCountry(countryName: string): Promise<CityItem[]> {
  const iso = ISO_BY_NAME[countryName];
  if (!iso) return [];
  try {
    const mod = await import(/* @vite-ignore */ `./${iso}.json`);
    const data = (mod.default ?? mod) as CityItem[];
    return data;
  } catch {
    return [];
  }
}