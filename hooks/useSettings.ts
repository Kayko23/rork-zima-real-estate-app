import { useEffect, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import type { Locale } from '@/lib/i18n';

export type Country = {
  code: string;
  name_fr: string;
  name_en: string;
  flag: string;
  region: 'ECOWAS' | 'CEMAC';
};

type SettingsContextValue = {
  locale: Locale | null;
  country: Country | null;
  setLocale: (v: Locale) => Promise<void>;
  setCountry: (c: Country) => Promise<void>;
  ready: boolean;
};

export const [SettingsProvider, useSettings] = createContextHook<SettingsContextValue>(() => {
  const [locale, setLocaleState] = useState<Locale | null>(null);
  const [country, setCountryState] = useState<Country | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [L, C] = await Promise.all([
          AsyncStorage.getItem('zima.locale'),
          AsyncStorage.getItem('zima.country'),
        ]);
        if (L) setLocaleState(L as Locale);
        if (C) setCountryState(JSON.parse(C));
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setLocale = useCallback(async (v: Locale) => {
    setLocaleState(v);
    await AsyncStorage.setItem('zima.locale', v);
  }, []);

  const setCountry = useCallback(async (c: Country) => {
    setCountryState(c);
    await AsyncStorage.setItem('zima.country', JSON.stringify(c));
  }, []);

  return useMemo(
    () => ({ locale, country, setLocale, setCountry, ready }),
    [locale, country, setLocale, setCountry, ready]
  );
});
