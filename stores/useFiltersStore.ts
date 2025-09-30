import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { 
  PropertyFilters, 
  TripFilters, 
  ProFilters, 
  SavedPreset,
  FilterScope,
} from '@/lib/filters/types';

type State = {
  property: PropertyFilters;
  trip: TripFilters;
  pro: ProFilters;
  presets: SavedPreset[];
};

type Actions = {
  setProperty: (p: Partial<PropertyFilters>) => void;
  resetProperty: () => void;
  setTrip: (p: Partial<TripFilters>) => void;
  resetTrip: () => void;
  setPro: (p: Partial<ProFilters>) => void;
  resetPro: () => void;
  savePreset: (name: string, scope: FilterScope) => void;
  loadPreset: (id: string) => void;
  deletePreset: (id: string) => void;
};

const initialState: State = { 
  property: {}, 
  trip: {}, 
  pro: {}, 
  presets: [],
};

export const useFiltersStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setProperty: (p) => set({ property: { ...get().property, ...p } }),
      resetProperty: () => set({ property: {} }),
      
      setTrip: (p) => set({ trip: { ...get().trip, ...p } }),
      resetTrip: () => set({ trip: {} }),
      
      setPro: (p) => set({ pro: { ...get().pro, ...p } }),
      resetPro: () => set({ pro: {} }),
      
      savePreset: (name, scope) => {
        const state = get();
        const payload = scope === 'property' 
          ? state.property 
          : scope === 'trip' 
          ? state.trip 
          : state.pro;
        
        const id = `${scope}-${Date.now()}`;
        const newPreset: SavedPreset = { 
          id, 
          name, 
          scope, 
          payload, 
          updatedAt: Date.now(),
        };
        
        set({ presets: [newPreset, ...state.presets] });
      },
      
      loadPreset: (id) => {
        const preset = get().presets.find(x => x.id === id);
        if (!preset) return;
        
        if (preset.scope === 'property') {
          set({ property: preset.payload as PropertyFilters });
        } else if (preset.scope === 'trip') {
          set({ trip: preset.payload as TripFilters });
        } else {
          set({ pro: preset.payload as ProFilters });
        }
      },
      
      deletePreset: (id) => set({ 
        presets: get().presets.filter(p => p.id !== id),
      }),
    }),
    { 
      name: 'zima.filters.v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
