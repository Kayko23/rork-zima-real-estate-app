import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AmenityKey } from "@/components/voyages/AmenitiesChips";
import { currencyFromCountry, type Currency } from "@/components/voyages/currency";
import { defaultPriceRangeForCountry } from "@/components/voyages/pricingDefaults";

export type VoyageFilters = {
  type: "all" | "hotel" | "daily";
  destination?: { country?: string; city?: string };
  start?: string; end?: string;
  guests?: number;
  ratingMin?: 3 | 3.5 | 4 | 4.5 | 5;
  priceMin?: number; priceMax?: number;
  amenities: AmenityKey[];
};

type Preset = { id: string; name: string; q: VoyageFilters; createdAt: number };

type State = {
  q: VoyageFilters;
  currency: Currency;
  set: (partial: Partial<VoyageFilters>) => void;
  setCountry: (country?: string) => void;
  toggleAmenity: (k: AmenityKey) => void;
  reset: () => void;
  hydrate: () => Promise<void>;
  savePreset: () => Promise<void>;
  presets: Preset[];
  listPresets: () => Promise<Preset[]>;
  saveNamedPreset: (name: string) => Promise<Preset>;
  applyPreset: (id: string) => void;
  deletePreset: (id: string) => Promise<void>;
};

const KEY = "voyage.filters.last";
const PK = "voyage.filters.presets";
const initial: VoyageFilters = { type: "all", guests: 1, amenities: [] };

export const useVoyageFilters = create<State>((set, get) => ({
  q: initial,
  currency: currencyFromCountry(),

  set: (partial: Partial<VoyageFilters>) => set({ q: { ...get().q, ...partial } }),

  setCountry: (country?: string) => {
    set((state: State) => {
      const prev = state.q;
      const currency = currencyFromCountry(country);
      const range = defaultPriceRangeForCountry(country);
      const next: VoyageFilters = {
        ...prev,
        destination: { ...(prev.destination || {}), country },
        priceMin: prev.priceMin ?? range.min,
        priceMax: prev.priceMax ?? range.max,
      };
      return { q: next, currency };
    });
  },

  toggleAmenity: (k: AmenityKey) => {
    const cur = get().q.amenities;
    const next = cur.includes(k) ? cur.filter((x: AmenityKey) => x !== k) : [...cur, k];
    set({ q: { ...get().q, amenities: next } });
  },

  reset: () => set({ q: initial, currency: currencyFromCountry() }),

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (!raw) return;
      const q: VoyageFilters = JSON.parse(raw);
      set({ q, currency: currencyFromCountry(q.destination?.country) });
    } catch {}
  },

  savePreset: async () => {
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(get().q));
    } catch {}
  },

  presets: [],

  listPresets: async () => {
    try {
      const raw = await AsyncStorage.getItem(PK);
      const list: Preset[] = raw ? JSON.parse(raw) : [];
      set({ presets: list });
      return list;
    } catch { return []; }
  },

  saveNamedPreset: async (name: string) => {
    const cur = get().q;
    const p: Preset = { id: `${Date.now()}`, name, q: cur, createdAt: Date.now() };
    try {
      const raw = await AsyncStorage.getItem(PK);
      const list: Preset[] = raw ? JSON.parse(raw) : [];
      const updated = [p, ...list].slice(0, 20);
      await AsyncStorage.setItem(PK, JSON.stringify(updated));
      set({ presets: updated });
      return p;
    } catch {
      set({ presets: [p, ...get().presets] });
      return p;
    }
  },

  applyPreset: (id: string) => {
    const p = get().presets.find((x) => x.id === id);
    if (!p) return;
    const currency = currencyFromCountry(p.q.destination?.country);
    set({ q: p.q, currency });
  },

  deletePreset: async (id: string) => {
    try {
      const raw = await AsyncStorage.getItem(PK);
      const list: Preset[] = raw ? JSON.parse(raw) : [];
      const updated = list.filter((x) => x.id !== id);
      await AsyncStorage.setItem(PK, JSON.stringify(updated));
      set({ presets: updated });
    } catch {}
  },
}));
