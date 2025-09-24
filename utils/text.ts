// utils/text.ts
export const normalize = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim();