import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useMemo, useState } from "react";
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

export type Preset = { id: string; name: string; q: VoyageFilters; createdAt: number };

const KEY = "voyage.filters.last";
const PK = "voyage.filters.presets";

const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== "undefined" && window.localStorage) return window.localStorage.getItem(key);
    } catch {}
    return null;
  },
  async setItem(key: string, value: string) {
    try {
      if (typeof window !== "undefined" && window.localStorage) window.localStorage.setItem(key, value);
    } catch {}
  },
};

const initial: VoyageFilters = { type: "all", guests: 1, amenities: [] };

export const [VoyageFiltersProvider, useVoyageFilters] = createContextHook(() => {
  const [q, setQ] = useState<VoyageFilters>(initial);
  const [currency, setCurrency] = useState<Currency>(currencyFromCountry());
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    (async () => {
      const raw = await storage.getItem(KEY);
      if (raw && raw.trim()) {
        try {
          // Validate JSON string before parsing
          if (raw.startsWith('{') && raw.endsWith('}')) {
            const saved = JSON.parse(raw) as VoyageFilters;
            if (saved && typeof saved === 'object') {
              setQ(saved);
              setCurrency(currencyFromCountry(saved.destination?.country));
            }
          }
        } catch (error) {
          console.log('Error parsing voyage filters:', error);
        }
      }
      const pr = await storage.getItem(PK);
      if (pr && pr.trim()) {
        try {
          // Validate JSON string before parsing
          if (pr.startsWith('[') && pr.endsWith(']')) {
            const parsed = JSON.parse(pr) as Preset[];
            if (Array.isArray(parsed)) {
              setPresets(parsed);
            }
          }
        } catch (error) {
          console.log('Error parsing voyage presets:', error);
        }
      }
    })();
  }, []);

  const set = useCallback((partial: Partial<VoyageFilters>) => {
    setQ((prev) => ({ ...prev, ...partial }));
  }, []);

  const setCountry = useCallback((country?: string) => {
    setQ((prev) => {
      const range = defaultPriceRangeForCountry(country);
      const next: VoyageFilters = {
        ...prev,
        destination: { ...(prev.destination ?? {}), country },
        priceMin: prev.priceMin ?? range.min,
        priceMax: prev.priceMax ?? range.max,
      };
      setCurrency(currencyFromCountry(country));
      return next;
    });
  }, []);

  const toggleAmenity = useCallback((k: AmenityKey) => {
    setQ((prev) => {
      const cur = prev.amenities ?? [];
      const next = cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k];
      return { ...prev, amenities: next } as VoyageFilters;
    });
  }, []);

  const reset = useCallback(() => {
    setQ(initial);
    setCurrency(currencyFromCountry());
  }, []);

  const hydrate = useCallback(async () => {
    const raw = await storage.getItem(KEY);
    if (raw && raw.trim()) {
      try {
        // Validate JSON string before parsing
        if (raw.startsWith('{') && raw.endsWith('}')) {
          const saved = JSON.parse(raw) as VoyageFilters;
          if (saved && typeof saved === 'object') {
            setQ(saved);
            setCurrency(currencyFromCountry(saved.destination?.country));
          }
        }
      } catch (error) {
        console.log('Error hydrating voyage filters:', error);
      }
    }
    const pr = await storage.getItem(PK);
    if (pr && pr.trim()) {
      try {
        // Validate JSON string before parsing
        if (pr.startsWith('[') && pr.endsWith(']')) {
          const parsed = JSON.parse(pr) as Preset[];
          if (Array.isArray(parsed)) {
            setPresets(parsed);
          }
        }
      } catch (error) {
        console.log('Error hydrating voyage presets:', error);
      }
    }
  }, []);

  const savePreset = useCallback(async () => {
    await storage.setItem(KEY, JSON.stringify(q));
  }, [q]);

  const listPresets = useCallback(async () => {
    const raw = await storage.getItem(PK);
    if (!raw || !raw.trim()) {
      setPresets([]);
      return [];
    }
    try {
      // Validate JSON string before parsing
      if (raw.startsWith('[') && raw.endsWith(']')) {
        const list: Preset[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          setPresets(list);
          return list;
        }
      }
      setPresets([]);
      return [];
    } catch (error) {
      console.log('Error listing voyage presets:', error);
      setPresets([]);
      return [];
    }
  }, []);

  const saveNamedPreset = useCallback(async (name: string) => {
    const p: Preset = { id: `${Date.now()}`, name, q, createdAt: Date.now() };
    const updated = [p, ...presets].slice(0, 20);
    setPresets(updated);
    await storage.setItem(PK, JSON.stringify(updated));
    return p;
  }, [q, presets]);

  const applyPreset = useCallback((id: string) => {
    const p = presets.find((x) => x.id === id);
    if (!p) return;
    setQ(p.q);
    setCurrency(currencyFromCountry(p.q.destination?.country));
  }, [presets]);

  const deletePreset = useCallback(async (id: string) => {
    const updated = presets.filter((x) => x.id !== id);
    setPresets(updated);
    await storage.setItem(PK, JSON.stringify(updated));
  }, [presets]);

  return {
    q,
    currency,
    set,
    setCountry,
    toggleAmenity,
    reset,
    hydrate,
    savePreset,
    presets,
    listPresets,
    saveNamedPreset,
    applyPreset,
    deletePreset,
  };
});
