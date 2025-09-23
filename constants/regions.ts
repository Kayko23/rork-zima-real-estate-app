export type Country = { code: string; name: string };

const UEMOA: Country[] = [
  { code: "BJ", name: "Bénin" }, { code: "BF", name: "Burkina Faso" },
  { code: "CI", name: "Côte d'Ivoire" }, { code: "GW", name: "Guinée-Bissau" },
  { code: "ML", name: "Mali" }, { code: "NE", name: "Niger" },
  { code: "SN", name: "Sénégal" }, { code: "TG", name: "Togo" },
];

const ECOWAS: Country[] = [
  { code: "BJ", name: "Bénin" }, { code: "BF", name: "Burkina Faso" },
  { code: "CV", name: "Cap-Vert" }, { code: "CI", name: "Côte d'Ivoire" },
  { code: "GM", name: "Gambie" }, { code: "GH", name: "Ghana" },
  { code: "GN", name: "Guinée" }, { code: "GW", name: "Guinée-Bissau" },
  { code: "LR", name: "Libéria" }, { code: "ML", name: "Mali" },
  { code: "NE", name: "Niger" }, { code: "NG", name: "Nigéria" },
  { code: "SN", name: "Sénégal" }, { code: "SL", name: "Sierra Leone" },
  { code: "TG", name: "Togo" },
];

const CEMAC: Country[] = [
  { code: "CM", name: "Cameroun" }, { code: "CF", name: "République centrafricaine" },
  { code: "TD", name: "Tchad" }, { code: "CG", name: "Congo (Rép. du)" },
  { code: "GQ", name: "Guinée équatoriale" }, { code: "GA", name: "Gabon" },
];

// union sans doublons
export const AFRICA_TARGET_COUNTRIES: Country[] = Array.from(
  new Map([...UEMOA, ...ECOWAS, ...CEMAC].map(c => [c.code, c])).values()
).sort((a, b) => a.name.localeCompare(b.name));

// UEMOA/BCEAO (Afrique de l'Ouest) + CEMAC/BEAC (Afrique centrale)
export const BLOCS = {
  UEMOA: ["Bénin", "Burkina Faso", "Côte d'Ivoire", "Guinée-Bissau", "Mali", "Niger", "Sénégal", "Togo"],
  CEMAC: ["Cameroun", "Centrafrique", "Tchad", "Congo (Rép.)", "Guinée équatoriale", "Gabon"],
};

// Villes par pays - échantillon (remplacer par un dataset complet si nécessaire)
export const VILLES: Record<string, string[]> = {
  "Bénin": ["Cotonou", "Porto-Novo", "Parakou", "Abomey-Calavi", "Bohicon", "Natitingou", "Djougou", "Kandi", "Ouidah", "Lokossa"],
  "Burkina Faso": ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", "Banfora", "Kaya", "Tenkodogo", "Fada N'Gourma", "Dori", "Gaoua"],
  "Côte d'Ivoire": ["Abidjan", "Yamoussoukro", "Bouaké", "Daloa", "San-Pédro", "Korhogo", "Man", "Divo", "Gagnoa", "Anyama"],
  "Guinée-Bissau": ["Bissau", "Bafatá", "Gabú", "Cacheu", "Bolama", "Farim", "Canchungo", "Mansôa", "Bubaque", "Catió"],
  "Mali": ["Bamako", "Sikasso", "Mopti", "Kayes", "Ségou", "Gao", "Tombouctou", "Kidal", "Koutiala", "Djenné"],
  "Niger": ["Niamey", "Zinder", "Maradi", "Agadez", "Dosso", "Tahoua", "Tillabéri", "Diffa", "Arlit", "Tessaoua"],
  "Sénégal": ["Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack", "Louga", "Tambacounda", "Diourbel", "Kolda", "Fatick"],
  "Togo": ["Lomé", "Sokodé", "Kara", "Kpalimé", "Atakpamé", "Dapaong", "Tsévié", "Aného", "Vogan", "Bassar"],

  "Cameroun": ["Yaoundé", "Douala", "Garoua", "Bamenda", "Bafoussam", "Maroua", "Nkongsamba", "Bertoua", "Edéa", "Kumba"],
  "Centrafrique": ["Bangui", "Berbérati", "Bambari", "Bria", "Bouar", "Carnot", "Kaga-Bandoro", "Bossangoa", "Sibut", "Mbaïki"],
  "Tchad": ["N'Djamena", "Moundou", "Sarh", "Abéché", "Kélo", "Koumra", "Pala", "Am Timan", "Bongor", "Mongo"],
  "Congo (Rép.)": ["Brazzaville", "Pointe-Noire", "Dolisie", "Owando", "Ouesso", "Impfondo", "Sibiti", "Kinkala", "Madingou", "Gamboma"],
  "Guinée équatoriale": ["Malabo", "Bata", "Ebebiyín", "Mongomo", "Aconibe", "Añisoc", "Luba", "Evinayong", "Mikomeseng", "Nsok"],
  "Gabon": ["Libreville", "Port-Gentil", "Franceville", "Oyem", "Moanda", "Mouila", "Lambaréné", "Tchibanga", "Koulamoutou", "Makokou"],
};

export type FilterState = {
  bloc: "UEMOA" | "CEMAC" | "TOUS";
  pays: string | null;
  ville: string | null;
  type: "tous" | "à vendre" | "à louer";
  min?: number;
  max?: number;
};