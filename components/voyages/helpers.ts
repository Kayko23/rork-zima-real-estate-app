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
  rating: number;
  reviews: number;
  badge?: "Top" | "Premium";
  image: { uri: string };
  type: "hotel" | "daily";
};