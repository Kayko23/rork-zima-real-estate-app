export type Domain = 'property' | 'travel' | 'pro';

export type CategorySlug =
  | 'residential-houses'
  | 'residential-compounds'
  | 'residential-multifamily'
  | 'residential-colocation'
  | 'residential-student'
  | 'commerce-boutiques'
  | 'commerce-restaurants'
  | 'commerce-warehouses'
  | 'offices'
  | 'events'
  | 'land'
  | 'hotel'
  | 'daily-stay';

export type CategoryDef = {
  slug: CategorySlug;
  domain: Domain;
  i18nKey: string;
  icon?: string;
};

export const CATEGORIES: Record<CategorySlug, CategoryDef> = {
  'residential-houses': { slug: 'residential-houses', domain: 'property', i18nKey: 'Maisons individuelles' },
  'residential-compounds': { slug: 'residential-compounds', domain: 'property', i18nKey: 'Cités résidentielles' },
  'residential-multifamily': { slug: 'residential-multifamily', domain: 'property', i18nKey: 'Appartements & studios' },
  'residential-colocation': { slug: 'residential-colocation', domain: 'property', i18nKey: 'Colocation' },
  'residential-student': { slug: 'residential-student', domain: 'property', i18nKey: 'Logements étudiants' },
  'commerce-boutiques': { slug: 'commerce-boutiques', domain: 'property', i18nKey: 'Boutiques' },
  'commerce-restaurants': { slug: 'commerce-restaurants', domain: 'property', i18nKey: 'Restaurants' },
  'commerce-warehouses': { slug: 'commerce-warehouses', domain: 'property', i18nKey: 'Magasins & entrepôts' },
  'offices': { slug: 'offices', domain: 'property', i18nKey: 'Bureaux' },
  'events': { slug: 'events', domain: 'property', i18nKey: 'Espaces événementiels' },
  'land': { slug: 'land', domain: 'property', i18nKey: 'Terrains' },
  'hotel': { slug: 'hotel', domain: 'travel', i18nKey: 'Hôtels' },
  'daily-stay': { slug: 'daily-stay', domain: 'travel', i18nKey: 'Résidences journalières' },
};

export function getDomain(slug: CategorySlug): Domain {
  return CATEGORIES[slug]?.domain ?? 'property';
}

export function getLabel(slug: CategorySlug): string {
  return CATEGORIES[slug]?.i18nKey ?? slug;
}
