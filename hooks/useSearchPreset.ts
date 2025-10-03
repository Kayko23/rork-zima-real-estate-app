import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchPreset } from '@/types/search';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';

const STORAGE_KEY = 'zima.searchPreset';

const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch {
      // Ignore errors
    }
    return null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch {
      // Ignore errors
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch {
      // Ignore errors
    }
  },
};

export const [SearchPresetProvider, useSearchPreset] = createContextHook(() => {
  const [preset, setPresetState] = useState<SearchPreset | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await storage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as SearchPreset;
          setPresetState(parsed);
        }
      } catch (error) {
        console.log('Error loading search preset:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    load();
  }, []);

  const setPreset = useCallback(async (p?: SearchPreset) => {
    setPresetState(p);
    if (p) {
      await storage.setItem(STORAGE_KEY, JSON.stringify(p));
    } else {
      await storage.removeItem(STORAGE_KEY);
    }
  }, []);

  const reset = useCallback(async () => {
    setPresetState(undefined);
    await storage.removeItem(STORAGE_KEY);
  }, []);

  return useMemo(() => ({
    preset,
    setPreset,
    reset,
    isLoaded,
  }), [preset, setPreset, reset, isLoaded]);
});
