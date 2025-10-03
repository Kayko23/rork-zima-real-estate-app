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

export const api = {
  async listProperties(params?: Record<string, string | number | undefined>) {
    const all = await read<any[]>(KEYS.properties, []);
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
