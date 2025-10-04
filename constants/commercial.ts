export type CommercialSubKey = 'BOUTIQUES' | 'RESTAURANTS' | 'MAGASINS_ENTREPOTS';

export const COMMERCIAL_SUBS: { key: CommercialSubKey; label: string; icon: string }[] = [
  { key: 'BOUTIQUES', label: 'Boutiques', icon: 'store' },
  { key: 'RESTAURANTS', label: 'Restaurants', icon: 'utensils' },
  { key: 'MAGASINS_ENTREPOTS', label: 'Magasins & entrepôts', icon: 'warehouse' },
];

export const COMMERCIAL_SUBS_DICTIONARY: Record<CommercialSubKey, string> = {
  BOUTIQUES: 'Boutiques',
  RESTAURANTS: 'Restaurants',
  MAGASINS_ENTREPOTS: 'Magasins & entrepôts',
};

export const ACCESSIBILITY_OPTIONS = ['Aucune', 'PMR', 'Ascenseur', 'Rampe'] as const;
export const FOOT_TRAFFIC_OPTIONS = ['Faible', 'Moyen', 'Élevé'] as const;
export const KITCHEN_TYPE_OPTIONS = ['Aucune', 'Légère', 'Pro'] as const;
export const GAS_TYPE_OPTIONS = ['Électrique', 'Gaz bouteille', 'Gaz réseau'] as const;
export const TRUCK_ACCESS_OPTIONS = ['VL', 'PL 19t', 'Semi'] as const;
