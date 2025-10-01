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
  try {
    console.log(`[fetchListings] Starting fetch for status: ${status}`);
    await delay(100);
    const filtered = DEMO.filter(l => l.status === status);
    console.log(`[fetchListings] Fetched ${filtered.length} listings with status: ${status}`);
    return filtered;
  } catch (error) {
    console.error('[fetchListings] Error:', error);
    if (error instanceof Error) {
      console.error('[fetchListings] Error message:', error.message);
      console.error('[fetchListings] Error stack:', error.stack);
    }
    return [];
  }
}

export async function getListingById(id: string): Promise<Listing | null> {
  try {
    console.log(`[getListingById] Looking for listing with id: ${id}`);
    await delay(100);
    const listing = DEMO.find(l => l.id === id);
    console.log(`[getListingById] Found listing:`, listing?.id, listing?.title);
    return listing || null;
  } catch (error) {
    console.error('[getListingById] Error:', error);
    return null;
  }
}

export async function createListing(payload: Partial<Listing>): Promise<Listing> {
  await delay(400);
  const newListing = { 
    ...(payload as Listing), 
    id: String(Date.now()), 
    status: "pending" as ListingStatus, 
    photos: payload.photos ?? [],
    rating: 4.5,
    reviews: 0,
    contacts: 0,
    views: 0
  };
  DEMO.push(newListing);
  console.log("[createListing] Created new listing:", newListing.id, newListing.title);
  return newListing;
}

export async function updateListing(id: string, payload: Partial<Listing>): Promise<Listing> {
  await delay(300);
  const index = DEMO.findIndex(l => l.id === id);
  if (index !== -1) {
    DEMO[index] = { ...DEMO[index], ...payload };
    console.log("[updateListing] Updated listing:", DEMO[index].id, DEMO[index].title);
    return DEMO[index];
  }
  const updated = { ...(DEMO.find(l => l.id === id)!), ...payload };
  console.log("[updateListing] Listing not found in DEMO, returning merged:", id);
  return updated;
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
let DEMO: Listing[] = [
  { id:"101", title:"Villa · Accra", city:"Accra", country:"Ghana", price:274500000, currency:"XOF", type:"sale", surface:280, beds:4, baths:3, photos:["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200"], rating:4.8, reviews:67, contacts:3, status:"active", premium:true, views:1250 },
  { id:"102", title:"Appartement cosy", city:"Dakar", country:"Sénégal", price:850, currency:"USD", type:"rent", rentPeriod:"monthly", surface:85, beds:2, baths:2, photos:["https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200"], rating:4.6, reviews:23, contacts:1, status:"pending", views:890 },
  { id:"103", title:"Studio centre-ville", city:"Abidjan", country:"Côte d'Ivoire", price:400, currency:"USD", type:"rent", rentPeriod:"daily", surface:30, beds:1, baths:1, photos:["https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200"], status:"expired", views:456 }
];