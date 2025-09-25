// lib/hotels-api.ts
// Petite couche d’accès (tu peux brancher RapidAPI/Booking, Amadeus, etc.)
const BASE = "https://zima-proxy.yourdomain.com/hotels";

export type Hotel = {
  id: string;
  title: string;
  city: string;
  country: string;
  price_per_night: number;
  rating: number;
  reviews: number;
  badge?: "Top" | "Premium";
  image: string;
};

export type HotelQuery = {
  lat?: number;
  lng?: number;
  city?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  guests?: number;
  page?: number;
  pageSize?: number;
  sort?: "popular" | "recommended" | "rating" | "price_low" | "price_high";
  tags?: string[];
};

export type Paged<T> = { data: T[]; page: number; totalPages: number; total: number };

async function get<T>(path: string, params: Record<string, any> = {}): Promise<T> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) v.forEach((x) => qs.append(k, String(x)));
    else qs.append(k, String(v));
  });
  const res = await fetch(`${BASE}${path}?${qs.toString()}`);
  if (!res.ok) throw new Error(`Hotels API: ${res.status}`);
  return res.json() as Promise<T>;
}

export const HotelsAPI = {
  listPopular: (q: HotelQuery) => get<Paged<Hotel>>("/popular", q),
  listRecommended: (q: HotelQuery) => get<Paged<Hotel>>("/recommended", q),
};
