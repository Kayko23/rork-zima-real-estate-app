import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserMode, User, FilterState } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

type Language = 'fr' | 'en' | 'pt';

type CurrencyState = {
  currency: string;
  fxBase: string | null;
  fxRates: Record<string, number>;
};

type Plan = 'pro-monthly' | 'pro-yearly' | 'none';

import type { PaymentMethod } from '@/types';
import { startMobileMoneyCharge, currencyForCountry } from '@/utils/mobileMoney';
import type { CurrencyCode as CfaCurrencyCode } from '@/constants/cfa';

type SubscriptionState = {
  plan: Plan;
  nextBillingAt?: string | null;
  paymentMethods: PaymentMethod[];
};

// Cross-platform storage
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
};

const defaultUser: User = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  isProvider: false,
  preferences: {
    language: 'fr',
    currency: 'USD',
    country: 'GH'
  }
};

const getDeviceLanguage = (): Language | null => {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (locale.startsWith('fr')) return 'fr';
    if (locale.startsWith('pt')) return 'pt';
    if (locale.startsWith('en')) return 'en';
    return null;
  } catch {
    return null;
  }
};

const defaultFilters: FilterState = {
  sortBy: 'recent'
};

export const [AppProvider, useAppStore] = createContextHook(() => {
  const [userMode, setUserMode] = useState<UserMode>('user');
  const [user, setUser] = useState<User>(defaultUser);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [language, setLanguageState] = useState<Language | null>('fr');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeHomeTab, setActiveHomeTab] = useState<'biens' | 'services' | 'voyages'>('biens');
  const [currency, setCurrencyState] = useState<string>('XOF');
  const [fxBase, setFxBase] = useState<string | null>(null);
  const [fxRates, setFxRates] = useState<Record<string, number>>({});
  const [favoritePropertyIds, setFavoritePropertyIds] = useState<Set<string>>(new Set());
  const [favoriteProviderIds, setFavoriteProviderIds] = useState<Set<string>>(new Set());
  const [favoriteVoyageIds, setFavoriteVoyageIds] = useState<Set<string>>(new Set());
  const [favoriteVehicleIds, setFavoriteVehicleIds] = useState<Set<string>>(new Set());
  const [subscription, setSubscription] = useState<SubscriptionState>({
    plan: 'none',
    nextBillingAt: null,
    paymentMethods: [],
  });

  useEffect(() => {
    let mounted = true;
    
    const initializeStore = async () => {
      try {
        await loadPersistedData();
      } catch (error) {
        console.error('Store initialization error:', error);
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };
    
    // Very short timeout to prevent hydration issues
    const timeout = setTimeout(() => {
      if (mounted) {
        setIsInitialized(true);
      }
    }, 200);
    
    initializeStore();
    
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const loadPersistedData = async () => {
    try {
      const savedMode = await storage.getItem('userMode');
      const savedUser = await storage.getItem('user');
      const savedLanguage = await storage.getItem('language');
      const savedOnboarding = await storage.getItem('hasCompletedOnboarding');
      const savedCurrency = await storage.getItem('currency');
      const savedFavProperties = await storage.getItem('favoriteProperties');
      const savedFavProviders = await storage.getItem('favoriteProviders');
      const savedFavVoyages = await storage.getItem('favoriteVoyages');
      const savedFavVehicles = await storage.getItem('favoriteVehicles');
      const savedSubscription = await storage.getItem('subscription');
      
      if (savedMode && savedMode.trim()) {
        setUserMode(savedMode as UserMode);
      }
      if (savedUser && savedUser.trim()) {
        try {
          // Validate JSON string before parsing
          if (savedUser.startsWith('{') && savedUser.endsWith('}')) {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser && typeof parsedUser === 'object') {
              setUser({ ...defaultUser, ...parsedUser });
            }
          } else {
            throw new Error('Invalid JSON format');
          }
        } catch (error) {
          console.log('Invalid user JSON, using default:', error);
          // Clear corrupted data
          await storage.setItem('user', JSON.stringify(defaultUser));
        }
      }
      if (savedLanguage && savedLanguage.trim()) {
        setLanguageState(savedLanguage as Language);
      }
      if (savedOnboarding === 'true') {
        setHasCompletedOnboarding(true);
      }
      if (savedCurrency && savedCurrency.trim()) {
        setCurrencyState(savedCurrency);
      }
      if (savedFavProperties) {
        try {
          const parsed = JSON.parse(savedFavProperties);
          setFavoritePropertyIds(new Set(parsed));
        } catch (e) {
          console.log('Error parsing favorite properties', e);
        }
      }
      if (savedFavProviders) {
        try {
          const parsed = JSON.parse(savedFavProviders);
          setFavoriteProviderIds(new Set(parsed));
        } catch (e) {
          console.log('Error parsing favorite providers', e);
        }
      }
      if (savedFavVoyages) {
        try {
          const parsed = JSON.parse(savedFavVoyages);
          setFavoriteVoyageIds(new Set(parsed));
        } catch (e) {
          console.log('Error parsing favorite voyages', e);
        }
      }
      if (savedFavVehicles) {
        try {
          const parsed = JSON.parse(savedFavVehicles);
          setFavoriteVehicleIds(new Set(parsed));
        } catch (e) {
          console.log('Error parsing favorite vehicles', e);
        }
      }
      if (savedSubscription) {
        try {
          const parsed = JSON.parse(savedSubscription);
          setSubscription(parsed);
        } catch (e) {
          console.log('Error parsing subscription', e);
        }
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.log('Error loading persisted data:', error);
      setIsInitialized(true); // Continue anyway
    }
  };

  const switchMode = useCallback(async (mode: UserMode) => {
    if (mode && mode.trim()) {
      setUserMode(mode);
      await storage.setItem('userMode', mode);
      
      // Fire mode change event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('appModeChanged', {
          detail: { from: userMode, to: mode, source: 'system' }
        }));
      }
    }
  }, [userMode]);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    await storage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const markNotificationsAsRead = useCallback(() => {
    setHasUnreadNotifications(false);
  }, []);

  const toggleAppMode = useCallback(async (next?: UserMode) => {
    const newMode = next ?? (userMode === 'user' ? 'provider' : 'user');
    await switchMode(newMode);
  }, [userMode, switchMode]);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await storage.setItem('language', lang);
    
    // Update user preferences as well
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        language: lang
      }
    };
    setUser(updatedUser);
    await storage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  const completeOnboarding = useCallback(async () => {
    setHasCompletedOnboarding(true);
    await storage.setItem('hasCompletedOnboarding', 'true');
  }, []);

  const setHomeTab = useCallback((tab: 'biens' | 'services' | 'voyages') => {
    setActiveHomeTab(tab);
  }, []);

  const setCurrency = useCallback(async (cur: string) => {
    if (cur && cur.trim()) {
      setCurrencyState(cur);
      await storage.setItem('currency', cur);
    }
  }, []);

  const setFx = useCallback((base: string, rates: Record<string, number>) => {
    setFxBase(base);
    setFxRates(rates);
  }, []);

  const hydrate = useCallback(async () => {
    try {
      await loadPersistedData();
    } catch (error) {
      console.error('Hydration error:', error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const toggleFavoriteProperty = useCallback(async (id: string) => {
    setFavoritePropertyIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        console.log('[Favorites] Removed property', id);
      } else {
        next.add(id);
        console.log('[Favorites] Added property', id);
      }
      storage.setItem('favoriteProperties', JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  const toggleFavoriteProvider = useCallback(async (id: string) => {
    setFavoriteProviderIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        console.log('[Favorites] Removed provider', id);
      } else {
        next.add(id);
        console.log('[Favorites] Added provider', id);
      }
      storage.setItem('favoriteProviders', JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  const toggleFavoriteVoyage = useCallback(async (id: string) => {
    setFavoriteVoyageIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        console.log('[Favorites] Removed voyage', id);
      } else {
        next.add(id);
        console.log('[Favorites] Added voyage', id);
      }
      storage.setItem('favoriteVoyages', JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  const toggleFavoriteVehicle = useCallback(async (id: string) => {
    setFavoriteVehicleIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        console.log('[Favorites] Removed vehicle', id);
      } else {
        next.add(id);
        console.log('[Favorites] Added vehicle', id);
      }
      storage.setItem('favoriteVehicles', JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  const isFavoriteProperty = useCallback((id: string) => favoritePropertyIds.has(id), [favoritePropertyIds]);
  const isFavoriteProvider = useCallback((id: string) => favoriteProviderIds.has(id), [favoriteProviderIds]);
  const isFavoriteVoyage = useCallback((id: string) => favoriteVoyageIds.has(id), [favoriteVoyageIds]);
  const isFavoriteVehicle = useCallback((id: string) => favoriteVehicleIds.has(id), [favoriteVehicleIds]);

  const setPlan = useCallback(async (plan: Plan, nextBillingAt?: string | null) => {
    const updated = { ...subscription, plan, nextBillingAt: nextBillingAt ?? subscription.nextBillingAt };
    setSubscription(updated);
    await storage.setItem('subscription', JSON.stringify(updated));
  }, [subscription]);

  const addPaymentMethod = useCallback(async (pm: PaymentMethod) => {
    const list = [...subscription.paymentMethods, pm];
    if (list.length === 1) list[0].isDefault = true;
    const updated = { ...subscription, paymentMethods: list };
    setSubscription(updated);
    await storage.setItem('subscription', JSON.stringify(updated));
  }, [subscription]);

  const removePaymentMethod = useCallback(async (id: string) => {
    const list = subscription.paymentMethods.filter(p => p.id !== id);
    if (!list.some(p => p.isDefault) && list[0]) list[0].isDefault = true;
    const updated = { ...subscription, paymentMethods: list };
    setSubscription(updated);
    await storage.setItem('subscription', JSON.stringify(updated));
  }, [subscription]);

  const setDefaultPaymentMethod = useCallback(async (id: string) => {
    const methods = subscription.paymentMethods.map(pm => ({ ...pm, isDefault: pm.id === id }));
    const updated = { ...subscription, paymentMethods: methods };
    setSubscription(updated);
    await storage.setItem('subscription', JSON.stringify(updated));
  }, [subscription]);

  const setPaymentMethods = useCallback(async (methods: PaymentMethod[]) => {
    const updated = { ...subscription, paymentMethods: methods };
    setSubscription(updated);
    await storage.setItem('subscription', JSON.stringify(updated));
  }, [subscription]);

  const subscribeWithDefault = useCallback(async (plan: Exclude<Plan, 'none'>) => {
    const def = subscription.paymentMethods.find(p => p.isDefault);
    if (!def) return { ok: false, msg: 'Aucun moyen de paiement par défaut.' };

    const amount = plan === 'pro-monthly' ? 15000 : 150000;
    
    if (def.type === 'mobile_money') {
      const detectedCurrency = currencyForCountry(def.countryCode);
      const currency: CfaCurrencyCode = ((def.currency === 'XOF' || def.currency === 'XAF') ? def.currency : detectedCurrency) as CfaCurrencyCode;
      const res = await startMobileMoneyCharge({
        provider: def.provider!,
        countryCode: def.countryCode! as any,
        phone: def.phone!,
        amount,
        currency,
        description: plan === 'pro-monthly' ? 'ZIMA Pro Mensuel' : 'ZIMA Pro Annuel',
      });
      
      if (res.status === 'success') {
        const days = plan === 'pro-monthly' ? 30 : 365;
        const next = new Date();
        next.setDate(next.getDate() + days);
        await setPlan(plan, next.toISOString());
        return { ok: true, msg: `Abonnement activé. Prochaine échéance: ${next.toLocaleDateString('fr-FR')}` };
      } else {
        return { ok: false, msg: res.reason || 'Paiement refusé.' };
      }
    }

    const days = plan === 'pro-monthly' ? 30 : 365;
    const next = new Date();
    next.setDate(next.getDate() + days);
    await setPlan(plan, next.toISOString());
    return { ok: true, msg: `Abonnement activé. Prochaine échéance: ${next.toLocaleDateString('fr-FR')}` };
  }, [subscription, setPlan]);

  const cancelSubscription = useCallback(async () => {
    const updated = { ...subscription, plan: 'none' as Plan, nextBillingAt: null };
    setSubscription(updated);
    await storage.setItem('subscription', JSON.stringify(updated));
  }, [subscription]);

  const isPro = useMemo(() => userMode === 'provider', [userMode]);

  return useMemo(() => ({
    userMode,
    isPro,
    user,
    filters,
    hasUnreadNotifications,
    isHydrated,
    language,
    hasCompletedOnboarding,
    isInitialized,
    activeHomeTab,
    currency,
    fxBase,
    fxRates,
    favoritePropertyIds,
    favoriteProviderIds,
    favoriteVoyageIds,
    favoriteVehicleIds,
    subscription,
    switchMode,
    toggleAppMode,
    updateUser,
    updateFilters,
    clearFilters,
    markNotificationsAsRead,
    setLanguage,
    completeOnboarding,
    setHomeTab,
    setCurrency,
    setFx,
    hydrate,
    toggleFavoriteProperty,
    toggleFavoriteProvider,
    toggleFavoriteVoyage,
    toggleFavoriteVehicle,
    isFavoriteProperty,
    isFavoriteProvider,
    isFavoriteVoyage,
    isFavoriteVehicle,
    setPlan,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    setPaymentMethods,
    subscribeWithDefault,
    cancelSubscription
  }), [userMode, isPro, user, filters, hasUnreadNotifications, isHydrated, language, hasCompletedOnboarding, isInitialized, activeHomeTab, currency, fxBase, fxRates, favoritePropertyIds, favoriteProviderIds, favoriteVoyageIds, favoriteVehicleIds, subscription, switchMode, toggleAppMode, updateUser, updateFilters, clearFilters, markNotificationsAsRead, setLanguage, completeOnboarding, setHomeTab, setCurrency, setFx, hydrate, toggleFavoriteProperty, toggleFavoriteProvider, toggleFavoriteVoyage, toggleFavoriteVehicle, isFavoriteProperty, isFavoriteProvider, isFavoriteVoyage, isFavoriteVehicle, setPlan, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod, setPaymentMethods, subscribeWithDefault, cancelSubscription]);
});

// Export a safe version of the hook that always returns a valid object
export const useApp = () => {
  const store = useAppStore();
  
  // Return default values if store is not yet initialized
  if (!store) {
    return {
      userMode: 'user' as const,
      isPro: false,
      user: defaultUser,
      filters: defaultFilters,
      hasUnreadNotifications: false,
      isHydrated: false,
      language: null as Language | null,
      hasCompletedOnboarding: false,
      isInitialized: false,
      activeHomeTab: 'biens' as const,
      currency: 'XOF',
      fxBase: null,
      fxRates: {},
      favoritePropertyIds: new Set<string>(),
      favoriteProviderIds: new Set<string>(),
      favoriteVoyageIds: new Set<string>(),
      favoriteVehicleIds: new Set<string>(),
      subscription: { plan: 'none' as const, nextBillingAt: null, paymentMethods: [] },
      switchMode: async () => {},
      toggleAppMode: async () => {},
      updateUser: async () => {},
      updateFilters: () => {},
      clearFilters: () => {},
      markNotificationsAsRead: () => {},
      setLanguage: async () => {},
      completeOnboarding: async () => {},
      setHomeTab: () => {},
      setCurrency: async () => {},
      setFx: () => {},
      hydrate: async () => {},
      toggleFavoriteProperty: async () => {},
      toggleFavoriteProvider: async () => {},
      toggleFavoriteVoyage: async () => {},
      toggleFavoriteVehicle: async () => {},
      isFavoriteProperty: () => false,
      isFavoriteProvider: () => false,
      isFavoriteVoyage: () => false,
      isFavoriteVehicle: () => false,
      setPlan: async () => {},
      addPaymentMethod: async () => {},
      removePaymentMethod: async () => {},
      setDefaultPaymentMethod: async () => {},
      setPaymentMethods: async () => {},
      subscribeWithDefault: async () => ({ ok: false, msg: '' }),
      cancelSubscription: async () => {}
    };
  }
  
  return store;
};