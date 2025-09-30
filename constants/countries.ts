export type CountryBloc = 'UEMOA' | 'CEDEAO' | 'CEMAC';

export interface CountryData {
  code: string;
  name: string;
  bloc: CountryBloc[];
  cities: string[];
}

export const COUNTRY_CITIES: Record<string, CountryData> = {
  BJ: { 
    code: 'BJ', 
    name: 'Bénin',
    bloc: ['UEMOA', 'CEDEAO'], 
    cities: ['Porto-Novo', 'Cotonou', 'Abomey-Calavi', 'Parakou', 'Bohicon', 'Djougou', 'Kandi', 'Natitingou', 'Ouidah', 'Abomey'] 
  },
  BF: { 
    code: 'BF', 
    name: 'Burkina Faso',
    bloc: ['UEMOA', 'CEDEAO'], 
    cities: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Ouahigouya', 'Banfora', 'Kaya', 'Tenkodogo', 'Fada N\'Gourma', 'Dori', 'Gaoua'] 
  },
  CI: { 
    code: 'CI', 
    name: 'Côte d\'Ivoire',
    bloc: ['UEMOA', 'CEDEAO'], 
    cities: ['Yamoussoukro', 'Abidjan', 'Bouaké', 'Daloa', 'San-Pédro', 'Korhogo', 'Man', 'Abengourou', 'Gagnoa', 'Divo'] 
  },
  GW: { 
    code: 'GW', 
    name: 'Guinée-Bissau',
    bloc: ['UEMOA', 'CEDEAO'], 
    cities: ['Bissau', 'Bafatá', 'Gabú', 'Cacheu', 'Bissorã', 'Bolama', 'Canchungo', 'Mansôa', 'Buba', 'Farim'] 
  },
  ML: { 
    code: 'ML', 
    name: 'Mali',
    bloc: ['UEMOA', 'CEDEAO'], 
    cities: ['Bamako', 'Sikasso', 'Ségou', 'Mopti', 'Kayes', 'Gao', 'Koutiala', 'Tombouctou', 'Koulikoro', 'San'] 
  },
  NE: { 
    code: 'NE', 
    name: 'Niger',
    bloc: ['UEMOA', 'CEDEAO'], 
    cities: ['Niamey', 'Zinder', 'Maradi', 'Agadez', 'Tahoua', 'Dosso', 'Diffa', 'Tillabéri', 'Arlit', 'Birni N\'Konni'] 
  },
  SN: { 
    code: 'SN', 
    name: 'Sénégal',
    bloc: ['UEMOA', 'CEDEAO'], 
    cities: ['Dakar', 'Thiès', 'Touba', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Mbour', 'Rufisque', 'Diourbel', 'Louga'] 
  },
  TG: { 
    code: 'TG', 
    name: 'Togo',
    bloc: ['UEMOA', 'CEDEAO'], 
    cities: ['Lomé', 'Sokodé', 'Kara', 'Kpalimé', 'Atakpamé', 'Dapaong', 'Tsévié', 'Aného', 'Mango', 'Badou'] 
  },
  CV: { 
    code: 'CV', 
    name: 'Cap-Vert',
    bloc: ['CEDEAO'], 
    cities: ['Praia', 'Mindelo', 'Santa Maria', 'Espargos', 'Assomada', 'Pedra Badejo', 'Tarrafal', 'Porto Novo', 'Sal Rei', 'São Filipe'] 
  },
  GM: { 
    code: 'GM', 
    name: 'Gambie',
    bloc: ['CEDEAO'], 
    cities: ['Banjul', 'Serekunda', 'Brikama', 'Bakau', 'Farafenni', 'Soma', 'Janjanbureh', 'Basse Santa Su', 'Lamin', 'Gunjur'] 
  },
  GH: { 
    code: 'GH', 
    name: 'Ghana',
    bloc: ['CEDEAO'], 
    cities: ['Accra', 'Kumasi', 'Tamale', 'Sekondi-Takoradi', 'Cape Coast', 'Koforidua', 'Ho', 'Sunyani', 'Tema', 'Bolgatanga'] 
  },
  GN: { 
    code: 'GN', 
    name: 'Guinée',
    bloc: ['CEDEAO'], 
    cities: ['Conakry', 'Kankan', 'Kindia', 'Labé', 'N\'Zérékoré', 'Boké', 'Mamou', 'Faranah', 'Kissidougou', 'Siguiri'] 
  },
  LR: { 
    code: 'LR', 
    name: 'Liberia',
    bloc: ['CEDEAO'], 
    cities: ['Monrovia', 'Gbarnga', 'Buchanan', 'Kakata', 'Zwedru', 'Harper', 'Voinjama', 'Ganta', 'Robertsport', 'Sanniquellie'] 
  },
  NG: { 
    code: 'NG', 
    name: 'Nigeria',
    bloc: ['CEDEAO'], 
    cities: ['Abuja', 'Lagos', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City', 'Kaduna', 'Maiduguri', 'Enugu', 'Jos'] 
  },
  SL: { 
    code: 'SL', 
    name: 'Sierra Leone',
    bloc: ['CEDEAO'], 
    cities: ['Freetown', 'Bo', 'Kenema', 'Makeni', 'Koidu', 'Lunsar', 'Port Loko', 'Waterloo', 'Kabala', 'Kailahun'] 
  },
  CM: { 
    code: 'CM', 
    name: 'Cameroun',
    bloc: ['CEMAC'], 
    cities: ['Yaoundé', 'Douala', 'Garoua', 'Maroua', 'Bafoussam', 'Bamenda', 'Ngaoundéré', 'Bertoua', 'Limbe', 'Buea'] 
  },
  CF: { 
    code: 'CF', 
    name: 'République centrafricaine',
    bloc: ['CEMAC'], 
    cities: ['Bangui', 'Bimbo', 'Berbérati', 'Bambari', 'Bria', 'Bouar', 'Bossangoa', 'Kaga-Bandoro', 'Mbaïki', 'Bangassou'] 
  },
  TD: { 
    code: 'TD', 
    name: 'Tchad',
    bloc: ['CEMAC'], 
    cities: ['N\'Djamena', 'Moundou', 'Sarh', 'Abéché', 'Kélo', 'Am Timan', 'Pala', 'Koumra', 'Bongor', 'Faya-Largeau'] 
  },
  CG: { 
    code: 'CG', 
    name: 'Congo',
    bloc: ['CEMAC'], 
    cities: ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Owando', 'Ouesso', 'Impfondo', 'Sibiti', 'Kinkala', 'Mossendjo'] 
  },
  GQ: { 
    code: 'GQ', 
    name: 'Guinée équatoriale',
    bloc: ['CEMAC'], 
    cities: ['Malabo', 'Bata', 'Ebebiyin', 'Evinayong', 'Aconibe', 'Luba', 'Mongomo', 'San Antonio de Palé', 'Nsork', 'Mbini'] 
  },
  GA: { 
    code: 'GA', 
    name: 'Gabon',
    bloc: ['CEMAC'], 
    cities: ['Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda', 'Lambaréné', 'Tchibanga', 'Koulamoutou', 'Makokou', 'Bitam'] 
  },
};

export function getAllCountries(): CountryData[] {
  return Object.values(COUNTRY_CITIES).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

export function getCountriesByBloc(bloc: CountryBloc): CountryData[] {
  return getAllCountries().filter(c => c.bloc.includes(bloc));
}

export function getCountryByCode(code: string): CountryData | undefined {
  return COUNTRY_CITIES[code];
}

export function getCountryByName(name: string): CountryData | undefined {
  return getAllCountries().find(c => c.name === name);
}

export function getCitiesByCountryCode(code: string): string[] {
  return COUNTRY_CITIES[code]?.cities || [];
}

export function getCitiesByCountryName(name: string): string[] {
  return getCountryByName(name)?.cities || [];
}

export const COUNTRIES = getAllCountries().map(c => c.name);

export const CITIES: Record<string, string[]> = Object.values(COUNTRY_CITIES).reduce((acc, country) => {
  acc[country.name] = country.cities;
  return acc;
}, {} as Record<string, string[]>);
