export type Domain = 'properties' | 'travel' | 'pros';

export type CategorySlug =
  | 'residentiel'
  | 'commerces'
  | 'bureaux'
  | 'terrains'
  | 'hotel'
  | 'residence-journaliere'
  | 'espaces-evenementiels';

export type SubcategorySlug =
  | 'single_family'
  | 'gated_community'
  | 'multifamily'
  | 'flatshare'
  | 'student_private'
  | 'retail'
  | 'restaurant'
  | 'warehouse';

export type SearchPreset = {
  domain: Domain;
  premium?: boolean;
  category?: CategorySlug;
  subcategory?: SubcategorySlug;
  query?: string;
};

export type SortMode = 'premium_first' | 'recent' | 'price_asc' | 'price_desc';
