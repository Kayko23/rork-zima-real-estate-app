import AsyncStorage from '@react-native-async-storage/async-storage';
import { providers as MOCK_PROVIDERS } from '@/constants/professionals';

const KEYS = {
  properties: 'mock/properties',
  payments: 'mock/payments',
  threads: 'mock/threads',
  settings: 'mock/settings',
} as const;

function uid() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (e) {
    console.log('[api.read] error', e);
    return fallback;
  }
}

async function write<T>(key: string, val: T): Promise<T> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.log('[api.write] error', e);
  }
  return val;
}

const MOCK_PROPERTIES = [
  { id: 'p1', title: 'Villa moderne avec piscine', city: 'Abidjan', country: 'Côte d\'Ivoire', price: 450000, currency: 'XOF', bedrooms: 4, bathrooms: 3, surface: 280, livingrooms: 2, rating: 4.8, photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], transaction: 'sale', category: 'residential', premium: true, visible: true },
  { id: 'p2', title: 'Appartement 2 pièces centre-ville', city: 'Dakar', country: 'Sénégal', price: 185000, currency: 'XOF', bedrooms: 2, bathrooms: 2, surface: 85, livingrooms: 1, rating: 4.6, photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], transaction: 'rent', category: 'residential', premium: false, visible: true },
  { id: 'p3', title: 'Penthouse de luxe avec vue mer', city: 'Lomé', country: 'Togo', price: 520000, currency: 'XOF', bedrooms: 3, bathrooms: 3, surface: 180, livingrooms: 2, rating: 4.9, photos: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'], transaction: 'sale', category: 'residential', premium: true, visible: true },
  { id: 'p4', title: 'Studio moderne centre', city: 'Abidjan', country: 'Côte d\'Ivoire', price: 88000, currency: 'XOF', bedrooms: 1, bathrooms: 1, surface: 45, livingrooms: 0, rating: 4.3, photos: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'], transaction: 'rent', category: 'residential', premium: false, visible: true },
  { id: 'p5', title: 'Maison familiale avec jardin', city: 'Cotonou', country: 'Bénin', price: 320000, currency: 'XOF', bedrooms: 4, bathrooms: 2, surface: 200, livingrooms: 2, rating: 4.7, photos: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'], transaction: 'sale', category: 'residential', premium: true, visible: true },
  { id: 'c1', title: 'Boutique centre commercial', city: 'Abidjan', country: 'Côte d\'Ivoire', price: 280000, currency: 'XOF', surface: 120, rating: 4.5, photos: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'], transaction: 'rent', category: 'commercial', premium: true, visible: true },
  { id: 'c2', title: 'Restaurant équipé', city: 'Dakar', country: 'Sénégal', price: 450000, currency: 'XOF', surface: 200, rating: 4.7, photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'], transaction: 'sale', category: 'commercial', premium: true, visible: true },
  { id: 'c3', title: 'Magasin avec entrepôt', city: 'Lomé', country: 'Togo', price: 350000, currency: 'XOF', surface: 300, rating: 4.4, photos: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'], transaction: 'rent', category: 'commercial', premium: false, visible: true },
  { id: 'o1', title: 'Bureau moderne Plateau', city: 'Abidjan', country: 'Côte d\'Ivoire', price: 220000, currency: 'XOF', surface: 150, rating: 4.6, photos: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'], transaction: 'rent', category: 'office', premium: true, visible: true },
  { id: 'o2', title: 'Espace coworking', city: 'Dakar', country: 'Sénégal', price: 180000, currency: 'XOF', surface: 200, rating: 4.8, photos: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'], transaction: 'rent', category: 'office', premium: false, visible: true },
  { id: 'l1', title: 'Terrain constructible', city: 'Abidjan', country: 'Côte d\'Ivoire', price: 850000, currency: 'XOF', surface: 500, rating: 4.3, photos: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'], transaction: 'sale', category: 'land', premium: true, visible: true },
  { id: 'l2', title: 'Parcelle bord de mer', city: 'Lomé', country: 'Togo', price: 1200000, currency: 'XOF', surface: 800, rating: 4.9, photos: ['https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'], transaction: 'sale', category: 'land', premium: true, visible: true },
  { id: 'v1', title: 'Salle de réception', city: 'Abidjan', country: 'Côte d\'Ivoire', price: 350000, currency: 'XOF', surface: 400, rating: 4.7, photos: ['https://images.unsplash.com/photo-1519167758481-83f29da8c2b6?w=800'], transaction: 'rent', category: 'venue', premium: true, visible: true },
  { id: 'v2', title: 'Espace événementiel jardin', city: 'Dakar', country: 'Sénégal', price: 280000, currency: 'XOF', surface: 600, rating: 4.8, photos: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'], transaction: 'rent', category: 'venue', premium: false, visible: true },
  { id: 'h1', title: 'Hôtel Ivoire Suite', city: 'Abidjan', country: 'Côte d\'Ivoire', price: 75000, currency: 'XOF', rating: 4.8, photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'], category: 'hotel', premium: true, visible: true },
  { id: 'h2', title: 'Hôtel Teranga', city: 'Dakar', country: 'Sénégal', price: 65000, currency: 'XOF', rating: 4.6, photos: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'], category: 'hotel', premium: false, visible: true },
  { id: 't1', title: 'Suite Luxe Hôtel Ivoire', city: 'Abidjan', country: 'Côte d\'Ivoire', price: 75000, currency: 'XOF', rating: 4.8, reviews: 156, photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'], category: 'travel', type: 'hotel', premium: true, visible: true },
  { id: 't2', title: 'Résidence Almadies', city: 'Dakar', country: 'Sénégal', price: 65000, currency: 'XOF', rating: 4.6, reviews: 89, photos: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'], category: 'travel', type: 'daily', premium: false, visible: true },
  { id: 't3', title: 'Villa Bord de Mer', city: 'Lomé', country: 'Togo', price: 95000, currency: 'XOF', rating: 4.9, reviews: 203, photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'], category: 'travel', type: 'hotel', premium: true, visible: true },
  { id: 't4', title: 'Appartement Cocody', city: 'Abidjan', country: 'Côte d\'Ivoire', price: 55000, currency: 'XOF', rating: 4.4, reviews: 67, photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], category: 'travel', type: 'daily', premium: false, visible: true },
  { id: 't5', title: 'Resort Plage Assinie', city: 'Assinie', country: 'Côte d\'Ivoire', price: 120000, currency: 'XOF', rating: 4.9, reviews: 312, photos: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'], category: 'travel', type: 'hotel', premium: true, visible: true },
  { id: 't6', title: 'Chambre Plateau', city: 'Abidjan', country: 'Côte d\'Ivoire', price: 45000, currency: 'XOF', rating: 4.2, reviews: 45, photos: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'], category: 'travel', type: 'daily', premium: false, visible: true },
];

async function seedPropertiesIfEmpty() {
  const arr = await read<any[]>(KEYS.properties, []);
  if (arr.length) return arr;
  await write(KEYS.properties, MOCK_PROPERTIES);
  return MOCK_PROPERTIES;
}

export const api = {
  async listProperties(params?: Record<string, string | number | undefined>) {
    const all = await seedPropertiesIfEmpty();
    return all.filter((p) => {
      if (p.deletedAt) return false;
      if (params?.category && p.category !== params.category) return false;
      if (params?.country && p.country !== params.country) return false;
      if (params?.city && p.city !== params.city) return false;
      if (params?.priceMin && p.price < Number(params.priceMin)) return false;
      if (params?.priceMax && p.price > Number(params.priceMax)) return false;
      if (params?.ratingMin && (p.rating ?? 0) < Number(params.ratingMin)) return false;
      return p.visible !== false;
    });
  },
  async getProperty(id: string) {
    const all = await read<any[]>(KEYS.properties, []);
    const p = all.find((x) => x.id === id);
    if (!p) throw new Error('NOT_FOUND');
    return p;
  },
  async createProperty(p: any) {
    const all = await read<any[]>(KEYS.properties, []);
    const doc = { ...p, id: uid(), createdAt: Date.now(), visible: true, ownerId: p?.ownerId ?? null };
    const next = [doc, ...all];
    await write(KEYS.properties, next);
    return doc;
  },
  async updateProperty(id: string, patch: any) {
    const all = await read<any[]>(KEYS.properties, []);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) throw new Error('NOT_FOUND');
    const updated = { ...all[i], ...patch, updatedAt: Date.now() };
    all[i] = updated;
    await write(KEYS.properties, all);
    return updated;
  },
  async deleteProperty(id: string) {
    const all = await read<any[]>(KEYS.properties, []);
    const next = all.filter((x) => x.id !== id);
    await write(KEYS.properties, next);
    return true as const;
  },
  async pauseProperty(id: string) {
    const all = await read<any[]>(KEYS.properties, []);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) throw new Error('NOT_FOUND');
    all[i].visible = false;
    all[i].updatedAt = Date.now();
    await write(KEYS.properties, all);
    return all[i];
  },
  async publishProperty(id: string) {
    const all = await read<any[]>(KEYS.properties, []);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) throw new Error('NOT_FOUND');
    all[i].visible = true;
    all[i].updatedAt = Date.now();
    await write(KEYS.properties, all);
    return all[i];
  },
  async softDeleteProperty(id: string) {
    let all = await read<any[]>(KEYS.properties, []);
    all = all.map((p) => (p.id === id ? { ...p, deletedAt: Date.now(), visible: false } : p));
    await write(KEYS.properties, all);
    return true as const;
  },
  async listProviderProperties(providerId: string) {
    const all = await read<any[]>(KEYS.properties, []);
    return all.filter((p) => p.ownerId === providerId);
  },
  payments: {
    async listMethods() {
      const store = await read(KEYS.payments, {
        methods: [
          { id: 'm_1', brand: 'Visa', last4: '4242', exp_month: 4, exp_year: 2028, default: true },
        ],
        subscription: { active: false, plan: null as null | 'pro' | 'premium' },
      });
      return store.methods;
    },
    async getSubscription() {
      const store = await read(KEYS.payments, {
        methods: [] as any[],
        subscription: { active: false, plan: null as null | 'pro' | 'premium' },
      });
      return store.subscription;
    },
    async updateSubscription(plan: 'pro' | 'premium') {
      const store = await read(KEYS.payments, {
        methods: [] as any[],
        subscription: { active: false, plan: null as null | 'pro' | 'premium' },
      });
      store.subscription = { active: true, plan };
      await write(KEYS.payments, store);

      const props = await read<any[]>(KEYS.properties, []);
      props.forEach((p) => (p.visible = true));
      await write(KEYS.properties, props);

      return store.subscription;
    },
    async cancelSubscription() {
      const store = await read(KEYS.payments, {
        methods: [] as any[],
        subscription: { active: false, plan: null as null | 'pro' | 'premium' },
      });
      store.subscription = { active: false, plan: null };
      await write(KEYS.payments, store);

      const props = await read<any[]>(KEYS.properties, []);
      props.forEach((p) => (p.visible = false));
      await write(KEYS.properties, props);

      return true as const;
    },
  },
  async listThreads() {
    return read<any[]>(KEYS.threads, []);
  },
  async sendMessage(threadId: string, message: any) {
    const threads = await read<any[]>(KEYS.threads, []);
    let t = threads.find((x) => x.id === threadId);
    if (!t) {
      t = { id: threadId, messages: [] };
      threads.unshift(t);
    }
    t.messages.push({ id: uid(), ...message, createdAt: Date.now() });
    await write(KEYS.threads, threads);
    return t;
  },
  async getSettings() {
    return read(KEYS.settings, { currency: 'XOF', language: 'fr' });
  },
  async setSettings(patch: any) {
    const cur = await read(KEYS.settings, { currency: 'XOF', language: 'fr' });
    const next = { ...cur, ...patch };
    await write(KEYS.settings, next);
    return next;
  },
  };

// ===== Providers (professionnels) =====
const PROVIDERS_KEY = 'mock/providers' as const;

export const providerCategories = [
  'Agent immobilier',
  'Gestionnaire de biens',
  'Agence immobilière',
  'Resp. réservation hôtel',
  'Resp. réservation résidence',
  'Gestionnaire évènementiel',
] as const;

async function seedProvidersIfEmpty() {
  const arr = await read<any[]>(PROVIDERS_KEY, []);
  if (arr.length) return arr;
  await write(PROVIDERS_KEY, MOCK_PROVIDERS);
  return MOCK_PROVIDERS;
}

export const providersApi = {
  async list(params?: Record<string, string | number | undefined>) {
    const all = await seedProvidersIfEmpty();
    return all.filter((p) => {
      if (params?.country && p.country !== params.country) return false;
      if (params?.city && p.city !== params.city) return false;
      if (params?.category && p.category !== params.category) return false;
      if (params?.ratingMin && p.rating < Number(params.ratingMin)) return false;
      return true;
    });
  },
  async get(id: string) {
    const all = await seedProvidersIfEmpty();
    const p = all.find((x) => x.id === id);
    if (!p) throw new Error('NOT_FOUND');
    return p;
  },
  async update(id: string, patch: any) {
    const all = await read<any[]>(PROVIDERS_KEY, []);
    const i = all.findIndex((x) => x.id === id);
    if (i < 0) throw new Error('NOT_FOUND');
    all[i] = { ...all[i], ...patch };
    await write(PROVIDERS_KEY, all);
    return all[i];
  },
};

// ===== Provider Reviews (mock) =====
const REVIEWS_KEY = 'mock/providerReviews' as const;

export type ProviderReview = {
  id: string;
  providerId: string;
  author: string;
  rating: number;
  text: string;
  createdAt: number;
};

async function seedReviewsIfEmpty() {
  const cur = await read<ProviderReview[]>(REVIEWS_KEY, []);
  if (cur.length) return cur;
  const demo: ProviderReview[] = Array.from({ length: 12 }).map((_, i) => ({
    id: `rev_${i + 1}`,
    providerId: `pro_${(i % 6) + 1}`,
    author: ['Awa', 'Jean', 'Moussa', 'Dora', 'Linda'][i % 5],
    rating: [3, 4, 5, 4.5, 5][i % 5] as number,
    text: ['Très pro', 'Bon suivi', 'Réponse rapide', 'Service impeccable', 'Rien à dire'][i % 5],
    createdAt: Date.now() - i * 86400000,
  }));
  await write(REVIEWS_KEY, demo);
  return demo;
}

export const providerReviewsApi = {
  async list(providerId: string) {
    const all = await seedReviewsIfEmpty();
    return all
      .filter((r) => r.providerId === providerId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
  async add(
    providerId: string,
    payload: Omit<ProviderReview, 'id' | 'providerId' | 'createdAt'>,
  ) {
    const all = await read<ProviderReview[]>(REVIEWS_KEY, []);
    const doc: ProviderReview = { id: uid(), providerId, createdAt: Date.now(), ...payload };
    all.unshift(doc);
    await write(REVIEWS_KEY, all);
    return doc;
  },
};

export type Api = typeof api;
