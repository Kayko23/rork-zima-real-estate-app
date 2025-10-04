import { router } from 'expo-router';
import { CATEGORIES, CategorySlug } from '@/types/taxonomy';

type Mode = 'push' | 'replace';

export function openCategory(slug: CategorySlug, params: Record<string, any> = {}, mode: Mode = 'push') {
  const def = CATEGORIES[slug];
  if (!def) return;

  const route =
    def.domain === 'property'
      ? '/(tabs)/properties'
      : def.domain === 'travel'
      ? '/(tabs)/voyages'
      : '/professionals';

  const fullParams = { ...params, category: slug };

  if (mode === 'replace') {
    router.replace({ pathname: route as any, params: fullParams });
  } else {
    router.push({ pathname: route as any, params: fullParams });
  }
}

export function seeAllPremium(section: 'properties' | 'travel' | 'pros') {
  const base =
    section === 'properties'
      ? '/(tabs)/properties'
      : section === 'travel'
      ? '/(tabs)/voyages'
      : '/professionals';
  router.push({ pathname: base as any, params: { premium: '1' } });
}

export function seeAllCategory(slug: CategorySlug) {
  openCategory(slug, {}, 'push');
}
