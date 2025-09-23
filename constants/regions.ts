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