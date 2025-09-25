import type { Option } from "./helpers";

/** Fallback minimal. En prod: remplace par un appel API /countries et /cities?country=XX */
const COUNTRIES: Option[] = [
  {value:"SN", label:"Sénégal"}, {value:"CI", label:"Côte d'Ivoire"}, {value:"GH", label:"Ghana"},
  {value:"NG", label:"Nigeria"}, {value:"TG", label:"Togo"}, {value:"BJ", label:"Bénin"},
  {value:"BF", label:"Burkina Faso"}, {value:"ML", label:"Mali"}, {value:"CM", label:"Cameroun"},
  {value:"GA", label:"Gabon"}, {value:"GN", label:"Guinée"}, {value:"NE", label:"Niger"}
];

const CITIES: Record<string, Option[]> = {
  SN: [{value:"dakar",label:"Dakar"},{value:"saly",label:"Saly"},{value:"saint-louis",label:"Saint-Louis"}],
  CI: [{value:"abidjan",label:"Abidjan"},{value:"yamoussoukro",label:"Yamoussoukro"},{value:"grand-bassam",label:"Grand-Bassam"}],
  GH: [{value:"accra",label:"Accra"},{value:"kumasi",label:"Kumasi"}],
  NG: [{value:"lagos",label:"Lagos"},{value:"abuja",label:"Abuja"},{value:"port-harcourt",label:"Port Harcourt"}],
  TG: [{value:"lome",label:"Lomé"}], BJ: [{value:"cotonou",label:"Cotonou"}],
  BF:[{value:"ouagadougou",label:"Ouagadougou"}], ML:[{value:"bamako",label:"Bamako"}],
  CM:[{value:"yaounde",label:"Yaoundé"},{value:"douala",label:"Douala"}],
  GA:[{value:"libreville",label:"Libreville"}], GN:[{value:"conakry",label:"Conakry"}], NE:[{value:"niamey",label:"Niamey"}],
};

export function getCountries(keyword:string): Option[] {
  const kw = keyword.trim().toLowerCase();
  return COUNTRIES.filter(c => c.label.toLowerCase().includes(kw));
}
export function getCities(countryCode?:string|null, keyword?:string): Option[] {
  if (!countryCode) return [];
  const kw = (keyword||"").trim().toLowerCase();
  return (CITIES[countryCode]||[]).filter(c => c.label.toLowerCase().includes(kw));
}