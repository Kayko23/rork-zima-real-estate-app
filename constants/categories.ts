import type { Category, ResidentialSubcategory, CommercialSubcategory } from '@/types';

export const MAIN_CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: 'residential', label: 'Résidentiel', icon: 'home' },
  { key: 'commercial', label: 'Commerces', icon: 'shopping-bag' },
  { key: 'office', label: 'Bureaux', icon: 'briefcase' },
  { key: 'land', label: 'Terrains', icon: 'map' },
  { key: 'hospitality', label: 'Hôtellerie', icon: 'hotel' },
];

export const RESIDENTIAL_SUBCATEGORIES: {
  key: ResidentialSubcategory;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    key: 'single_family',
    label: 'Maisons individuelles',
    description: 'Villas, maisons privées, maisons de luxe, manoirs, duplex/triplex individuels',
    icon: 'home',
  },
  {
    key: 'gated_community',
    label: 'Cités résidentielles',
    description: 'Résidences fermées avec sécurité, équipements partagés (piscine, gym)',
    icon: 'shield',
  },
  {
    key: 'multifamily',
    label: 'Immeubles & copropriétés',
    description: 'Appartements, studios, lofts, duplex en immeuble',
    icon: 'building',
  },
  {
    key: 'flatshare',
    label: 'Colocation',
    description: 'Logements partagés, chambres privées ou lits',
    icon: 'users',
  },
  {
    key: 'student_private',
    label: 'Logements étudiants privés',
    description: 'Résidences universitaires privées, studios/chambres étudiants',
    icon: 'graduation-cap',
  },
];

export const COMMERCIAL_SUBCATEGORIES: {
  key: CommercialSubcategory;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    key: 'retail',
    label: 'Boutiques & Retail',
    description: 'Magasins, boutiques, commerces de détail',
    icon: 'shopping-bag',
  },
  {
    key: 'restaurant',
    label: 'Restaurants & Cafés',
    description: 'Restaurants, cafés, bars, espaces de restauration',
    icon: 'utensils',
  },
  {
    key: 'warehouse',
    label: 'Magasins & Entrepôts',
    description: 'Dépôts, showrooms, espaces de stockage',
    icon: 'warehouse',
  },
];

export const getCategoryLabel = (category: Category): string => {
  return MAIN_CATEGORIES.find((c) => c.key === category)?.label ?? category;
};

export const getResidentialSubcategoryLabel = (
  subcategory: ResidentialSubcategory
): string => {
  return (
    RESIDENTIAL_SUBCATEGORIES.find((s) => s.key === subcategory)?.label ??
    subcategory
  );
};

export const getCommercialSubcategoryLabel = (
  subcategory: CommercialSubcategory
): string => {
  return (
    COMMERCIAL_SUBCATEGORIES.find((s) => s.key === subcategory)?.label ??
    subcategory
  );
};
