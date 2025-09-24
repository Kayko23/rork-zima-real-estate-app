// data/regions.ts
export const UEMOA = [
  'Bénin','Burkina Faso','Côte d\'Ivoire','Guinée-Bissau','Mali','Niger','Sénégal','Togo'
];

export const CEDEAO_ONLY = [
  'Cap-Vert','Gambie','Ghana','Guinée','Libéria','Nigeria','Sierra Leone'
];

export const CEMAC = [
  'Cameroun','Congo','Gabon','Tchad','Rép. centrafricaine','Guinée équatoriale'
];

export const CEDEAO = [...UEMOA, ...CEDEAO_ONLY];

// Ensemble total (unique + tri alpha)
export const ALL_TARGET_COUNTRIES = Array.from(new Set([...CEDEAO, ...CEMAC]))
  .sort((a,b)=>a.localeCompare(b,'fr',{sensitivity:'base'}));