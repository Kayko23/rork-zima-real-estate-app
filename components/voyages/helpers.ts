export type Option = { value: string; label: string };

export type VoyageQuery = {
  type: "all" | "hotel" | "daily"; // hotel = hôtels, daily = résidences journalieres
  country?: Option | null;
  city?: Option | null;
  startDate?: string | null; // ISO YYYY-MM-DD
  endDate?: string | null;
  guests?: number;
};

export type VoyageFilters = {
  priceMin: number; priceMax: number;
  ratingMin: number;
  premiumOnly: boolean;
  amenities?: string[]; // wifi, piscine, parking, etc.
};

export type TripItem = {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number; // par nuit
  currency?: string; // devise du prix
  rating: number;
  reviews: number;
  badge?: "Top" | "Premium";
  image: { uri: string };
  type: "hotel" | "daily";
};

export type Amenity = "wifi" | "piscine" | "parking" | "clim" | "cuisine" | "sécurité24h";

export type Host = {
  id: string;
  name: string;
  avatar: { uri: string };
  verified: boolean;
  reviews: number;
  years: number;
};

export type TripDetail = TripItem & {
  description: string;
  photos: { uri: string }[];
  address: string;
  lat: number;
  lng: number;
  rooms: number;
  baths: number;
  area?: number; // m²
  amenities: Amenity[];
  host: Host;
  // Avis condensés
  ratingBreakdown?: { label: string; value: number }[];
};