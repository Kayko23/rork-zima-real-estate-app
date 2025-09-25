// lib/all-api.ts
import { HotelsAPI, type Hotel, type Paged as PagedHotels } from '@/lib/hotels-api';
import { mockProperties, mockProviders } from '@/constants/data';

export type Kind = 'property' | 'pro' | 'trip';

export type Property = (typeof mockProperties)[number];
export type Pro = (typeof mockProviders)[number];

export type AllItem =
  | ({ kind: 'property' } & Property)
  | ({ kind: 'pro' } & Pro)
  | ({ kind: 'trip' } & Hotel);

export type AllQuery = {
  q?: string;
  city?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  startDate?: string;
  endDate?: string;
  only?: Kind;
  page?: number;
  pageSize?: number;
  sort?: 'new' | 'popular' | 'rating' | 'price_low' | 'price_high';
};

export type Paged<T> = { data: T[]; page: number; totalPages: number; total: number };

export async function listAll(q: AllQuery): Promise<Paged<AllItem>> {
  const page = q.page ?? 1;
  const pageSize = q.pageSize ?? 12;
  const perSource = Math.max(4, Math.floor(pageSize / 3));
  const wants = (k: Kind) => !q.only || q.only === k;

  const lower = (s: string | undefined) => (s ? s.toLowerCase() : '');
  const matchText = (text: string | undefined) => {
    if (!q.q) return true;
    const needle = lower(q.q);
    return lower(text).includes(needle);
  };
  const matchCity = (city?: string) => (!q.city ? true : lower(city) === lower(q.city));
  const matchCountry = (country?: string) => (!q.country ? true : lower(country) === lower(q.country));

  // Properties (from mocks)
  const propsAll: AllItem[] = wants('property')
    ? mockProperties
        .filter((p) => matchText(p.title) || matchText(p.location?.city) || matchText(p.location?.country))
        .filter((p) => matchCity(p.location?.city))
        .filter((p) => matchCountry(p.location?.country))
        .filter((p) => (q.minPrice != null ? p.price >= q.minPrice : true))
        .filter((p) => (q.maxPrice != null ? p.price <= q.maxPrice : true))
        .map((p) => ({ kind: 'property', ...p }))
    : [];

  // Pros (from mocks)
  const prosAll: AllItem[] = wants('pro')
    ? mockProviders
        .filter((p) => matchText(p.name) || matchText(p.location?.city) || matchText(p.location?.country))
        .filter((p) => matchCity(p.location?.city))
        .filter((p) => matchCountry(p.location?.country))
        .map((p) => ({ kind: 'pro', ...p }))
    : [];

  // Trips (from API with fallback to empty)
  let tripsPage: PagedHotels<Hotel> | undefined;
  if (wants('trip')) {
    try {
      tripsPage = await HotelsAPI.listRecommended({
        city: q.city,
        country: q.country,
        startDate: q.startDate,
        endDate: q.endDate,
        guests: q.guests,
        page,
        pageSize: perSource,
      });
    } catch (e) {
      tripsPage = { data: [], page: 1, totalPages: 1, total: 0 };
    }
  }
  const tripsAll: AllItem[] = (tripsPage?.data ?? []).map((h) => ({ kind: 'trip', ...h }));

  // Local paging for mocks
  const start = (page - 1) * perSource;
  const end = start + perSource;
  const propsPage = propsAll.slice(start, end);
  const prosPage = prosAll.slice(start, end);

  let fused = ([] as AllItem[]).concat(propsPage, prosPage, tripsAll);

  const sorted = (() => {
    switch (q.sort) {
      case 'price_low':
        return fused.sort((a: any, b: any) => priceVal(a) - priceVal(b));
      case 'price_high':
        return fused.sort((a: any, b: any) => priceVal(b) - priceVal(a));
      case 'rating':
        return fused.sort((a: any, b: any) => ratingVal(b) - ratingVal(a));
      default:
        return fused;
    }
  })();

  return { data: sorted, page, totalPages: 999, total: 9999 };
}

function priceVal(x: AllItem) {
  if (x.kind === 'property') return (x as any).price ?? Number.MAX_SAFE_INTEGER;
  if (x.kind === 'trip') return (x as any).price_per_night ?? Number.MAX_SAFE_INTEGER;
  return Number.MAX_SAFE_INTEGER - 1;
}
function ratingVal(x: AllItem) {
  if (x.kind === 'property') return (x as any).provider?.rating ?? 0;
  if (x.kind === 'trip') return (x as any).rating ?? 0;
  if (x.kind === 'pro') return (x as any).rating ?? 0;
  return 0;
}
