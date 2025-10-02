import { useCallback, useEffect, useMemo, useState } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ALLOWED_COUNTRY_CODES, DEFAULT_COUNTRY, CfaCountryCode } from '@/constants/cfa';

export type Settings = {
  language: string;
  currency: string;
  allowedCountries: readonly CfaCountryCode[];
  defaultCountry: CfaCountryCode;
  setLanguage: (lang: string) => void;
  setCurrency: (cur: string) => void;
  isLoading: boolean;
  error?: string;
};

export const [SettingsProvider, useSettings] = createContextHook<Settings>(() => {
  const qc = useQueryClient();
  const [language, setLanguageState] = useState<string>('fr');
  const [currency, setCurrencyState] = useState<string>('XOF');

  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  });

  useEffect(() => {
    if (settingsQuery.data) {
      console.log('[Settings] Loaded', settingsQuery.data);
      setLanguageState(settingsQuery.data.language ?? 'fr');
      setCurrencyState(settingsQuery.data.currency ?? 'XOF');
    }
  }, [settingsQuery.data]);

  const { mutate, isPending } = useMutation({
    mutationFn: (patch: Partial<{ language: string; currency: string }>) => api.setSettings(patch),
    onSuccess: (data) => {
      setLanguageState(data.language);
      setCurrencyState(data.currency);
      qc.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (e: unknown) => {
      console.log('[Settings] Save error', e);
    },
  });

  const setLanguage = useCallback((lang: string) => {
    mutate({ language: lang });
  }, [mutate]);
  const setCurrency = useCallback((cur: string) => {
    mutate({ currency: cur });
  }, [mutate]);

  return useMemo<Settings>(() => ({
    language,
    currency,
    allowedCountries: ALLOWED_COUNTRY_CODES,
    defaultCountry: DEFAULT_COUNTRY,
    setLanguage,
    setCurrency,
    isLoading: settingsQuery.isLoading || isPending,
    error: settingsQuery.error ? String(settingsQuery.error) : undefined,
  }), [language, currency, setLanguage, setCurrency, settingsQuery.isLoading, settingsQuery.error, isPending]);
});
