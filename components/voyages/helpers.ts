export type StayType = "hotel" | "residence" | "daily" | "pro";
export type PricingUnit = "night" | "day";

export type VoyageItem = {
  id: string;
  title: string;
  city: string;
  country: string;
  photos: string[];
  price: number;
  unit: PricingUnit;  // night | day
  rating: number;     // 0..5
  reviews: number;
  type: StayType;
  badges?: ("Premium" | "Top" | "Nouveau")[];
  amenities?: string[]; // wifi, parking, piscine...
};

export const formatPrice = (v: number) => `${v.toLocaleString("fr-FR")} FCFA`;

export const mockVoyages: VoyageItem[] = [
  {
    id: "v1",
    title: "Studio cosy proche plage",
    city: "Dakar",
    country: "Sénégal",
    photos: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=640&h=480&fit=crop"],
    price: 45000,
    unit: "night",
    rating: 4.8,
    reviews: 67,
    type: "residence",
    badges: ["Top"],
    amenities: ["wifi", "clim", "parking"]
  },
  {
    id: "v2",
    title: "Chambre Deluxe - Hotel Ivoire",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=640&h=480&fit=crop"],
    price: 75000,
    unit: "night",
    rating: 4.6,
    reviews: 120,
    type: "hotel",
    badges: ["Premium"],
    amenities: ["piscine", "petit-dej", "wifi"]
  },
  {
    id: "v3",
    title: "Villa journalière avec piscine",
    city: "Accra",
    country: "Ghana",
    photos: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=640&h=480&fit=crop"],
    price: 120000,
    unit: "day",
    rating: 4.9,
    reviews: 32,
    type: "daily",
    amenities: ["piscine", "parking", "wifi"]
  },
  {
    id: "v4",
    title: "Appartement moderne centre-ville",
    city: "Douala",
    country: "Cameroun",
    photos: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=640&h=480&fit=crop"],
    price: 35000,
    unit: "night",
    rating: 4.5,
    reviews: 89,
    type: "residence",
    badges: ["Nouveau"],
    amenities: ["wifi", "parking"]
  },
  {
    id: "v5",
    title: "Suite Executive - Hotel Laico",
    city: "Ouagadougou",
    country: "Burkina Faso",
    photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=640&h=480&fit=crop"],
    price: 85000,
    unit: "night",
    rating: 4.7,
    reviews: 156,
    type: "hotel",
    badges: ["Premium"],
    amenities: ["piscine", "spa", "wifi", "petit-dej"]
  },
  {
    id: "v6",
    title: "Maison de vacances bord de mer",
    city: "Lomé",
    country: "Togo",
    photos: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=640&h=480&fit=crop"],
    price: 95000,
    unit: "day",
    rating: 4.8,
    reviews: 43,
    type: "daily",
    amenities: ["plage", "wifi", "parking", "barbecue"]
  }
];

export type Amenity = "wifi" | "piscine" | "parking" | "clim" | "cuisine" | "sécurité24h";

export type Host = {
  id: string;
  name: string;
  avatar: { uri: string };
  verified: boolean;
  reviews: number;
  years: number;
};

export type TripItem = {
  id: string;
  type: "hotel" | "residence" | "daily";
  title: string;
  city: string;
  country: string;
  price: number;
  rating: number;
  reviews: number;
  image: { uri: string };
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
  ratingBreakdown?: { label: string; value: number }[];
};