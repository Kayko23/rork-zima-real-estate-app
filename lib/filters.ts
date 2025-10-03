import { SearchPreset, SortMode } from '@/types/search';

export const premiumPreset = (domain: SearchPreset['domain']): SearchPreset => ({
  domain,
  premium: true,
});

export const categoryPreset = (
  category: SearchPreset['category'],
  subcategory?: SearchPreset['subcategory'],
): SearchPreset => ({
  domain: 'properties',
  category,
  subcategory,
});

export const sortForPreset = (preset?: SearchPreset): SortMode =>
  preset?.premium ? 'premium_first' : 'recent';
