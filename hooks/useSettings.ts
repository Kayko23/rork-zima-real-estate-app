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
  allowAllCountries: boolean;
  setLocale: (v: Locale) => Promise<void>;
  setCountry: (c: Country) => Promise<void>;
  setAllowAllCountries: (v: boolean) => Promise<void>;
  ready: boolean;
};

export const [SettingsProvider, useSettings] = createContextHook<SettingsContextValue>(() => {
  const [locale, setLocaleState] = useState<Locale | null>(null);
  const [country, setCountryState] = useState<Country | null>(null);
  const [allowAllCountries, setAllowAllCountriesState] = useState<boolean>(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [L, C, A] = await Promise.all([
          AsyncStorage.getItem('zima.locale'),
          AsyncStorage.getItem('zima.country'),
          AsyncStorage.getItem('zima.allowAllCountries'),
        ]);
        if (L) setLocaleState(L as Locale);
        if (C) setCountryState(JSON.parse(C));
        if (A != null) setAllowAllCountriesState(A === '1');
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

  const setAllowAllCountries = useCallback(async (v: boolean) => {
    setAllowAllCountriesState(v);
    await AsyncStorage.setItem('zima.allowAllCountries', v ? '1' : '0');
  }, []);

  return useMemo(
    () => ({ locale, country, allowAllCountries, setLocale, setCountry, setAllowAllCountries, ready }),
    [locale, country, allowAllCountries, setLocale, setCountry, setAllowAllCountries, ready]
  );
});
