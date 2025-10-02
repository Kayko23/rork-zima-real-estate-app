import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const doc = { ...p, id: uid(), createdAt: Date.now(), visible: true };
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

export type Api = typeof api;
