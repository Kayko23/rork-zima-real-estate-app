import type { VoyageFilters } from "@/components/voyages/filterContext";

const API = process.env.EXPO_PUBLIC_TRIPS_API ?? "https://example.com/api";

const mapQuery = (q: VoyageFilters) => {
  const p = new URLSearchParams();
  if (q.type !== "all") p.set("kind", q.type);
  if (q.destination?.country) p.set("country", q.destination.country);
  if (q.destination?.city) p.set("city", q.destination.city);
  if (q.start) p.set("check_in", q.start);
  if (q.end) p.set("check_out", q.end);
  if (q.guests) p.set("guests", String(q.guests));
  if (q.priceMin != null) p.set("price_min", String(q.priceMin));
  if (q.priceMax != null) p.set("price_max", String(q.priceMax));
  if (q.ratingMin) p.set("rating_min", String(q.ratingMin));
  if (q.amenities?.length) p.set("amenities", q.amenities.join(","));
  return p.toString();
};

export async function fetchTripsCount(q: VoyageFilters): Promise<number> {
  try {
    const res = await fetch(`${API}/trips/count?${mapQuery(q)}`);
    if (!res.ok) return 0;
    const data = await res.json();
    const count = Number((data as any).count);
    return Number.isFinite(count) ? count : 0;
  } catch {
    return 0;
  }
}
