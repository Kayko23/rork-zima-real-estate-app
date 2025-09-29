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

  useEffect(() => {
    // Load persisted data after component mounts
    const initializeStore = async () => {
      try {
        await loadPersistedData();
      } catch (error) {
        console.error('Store initialization error:', error);
        setIsInitialized(true); // Continue anyway
      }
    };
    
    initializeStore();
  }, []);

  const loadPersistedData = async () => {
    try {
      const savedMode = await storage.getItem('userMode');
      const savedUser = await storage.getItem('user');
      const savedLanguage = await storage.getItem('language');
      const savedOnboarding = await storage.getItem('hasCompletedOnboarding');
      const savedCurrency = await storage.getItem('currency');
      
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

  return useMemo(() => ({
    userMode,
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
    hydrate
  }), [userMode, user, filters, hasUnreadNotifications, isHydrated, language, hasCompletedOnboarding, isInitialized, activeHomeTab, currency, fxBase, fxRates, switchMode, toggleAppMode, updateUser, updateFilters, clearFilters, markNotificationsAsRead, setLanguage, completeOnboarding, setHomeTab, setCurrency, setFx, hydrate]);
});

// Export a safe version of the hook that always returns a valid object
export const useApp = () => {
  const store = useAppStore();
  
  // Return default values if store is not yet initialized
  if (!store) {
    return {
      userMode: 'user' as const,
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
      hydrate: async () => {}
    };
  }
  
  return store;
};