export type ListingStatus = "active" | "pending" | "expired";
export type ListingType = "sale" | "rent";
export type RentPeriod = "monthly" | "daily";

export interface Listing {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  currency: string;         // "XOF" etc.
  type: ListingType;        // sale/rent
  rentPeriod?: RentPeriod;  // monthly/daily (only for rent)
  surface?: number;
  beds?: number;
  baths?: number;
  photos: string[];         // urls
  rating?: number;
  reviews?: number;
  contacts?: number;
  status: ListingStatus;
  premium?: boolean;
  views?: number;
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// === STUBS. Remplace baseURL + fetch réels plus tard ===
export async function fetchListings(status: ListingStatus): Promise<Listing[]> {
  await delay(300);
  return DEMO.filter(l => l.status === status);
}

export async function createListing(payload: Partial<Listing>): Promise<Listing> {
  await delay(400);
  return { ...(payload as Listing), id: String(Date.now()), status: "pending", photos: payload.photos ?? [] };
}

export async function updateListing(id: string, payload: Partial<Listing>): Promise<Listing> {
  await delay(300);
  return { ...(DEMO.find(l => l.id === id)!), ...payload };
}

export async function adjustListing(id: string, data: { price?: number; currency?: string; availableFrom?: string; availableTo?: string; }): Promise<Listing> {
  await delay(250);
  return { ...(DEMO.find(l => l.id === id)!), ...data };
}

export async function pauseListing(id: string): Promise<Listing> {
  await delay(200);
  return { ...(DEMO.find(l => l.id === id)!), status: "pending" };
}

export async function resumeListing(id: string): Promise<Listing> {
  await delay(200);
  return { ...(DEMO.find(l => l.id === id)!), status: "active" };
}

export async function boostListing(id: string, plan: { days: 7|14|30; price: number }): Promise<{ success: boolean }> {
  await delay(300);
  return { success: true };
}

export async function deleteListing(id: string): Promise<{ success: boolean }> {
  await delay(250);
  return { success: true };
}

// --- Démo ---
const DEMO: Listing[] = [
  { id:"101", title:"Villa · Accra", city:"Accra", country:"Ghana", price:274500000, currency:"XOF", type:"sale", surface:280, beds:4, baths:3, photos:["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200"], rating:4.8, reviews:67, contacts:3, status:"active", premium:true, views:1250 },
  { id:"102", title:"Appartement cosy", city:"Dakar", country:"Sénégal", price:850, currency:"USD", type:"rent", rentPeriod:"monthly", surface:85, beds:2, baths:2, photos:["https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200"], rating:4.6, reviews:23, contacts:1, status:"pending", views:890 },
  { id:"103", title:"Studio centre-ville", city:"Abidjan", country:"Côte d'Ivoire", price:400, currency:"USD", type:"rent", rentPeriod:"daily", surface:30, beds:1, baths:1, photos:["https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200"], status:"expired", views:456 }
];