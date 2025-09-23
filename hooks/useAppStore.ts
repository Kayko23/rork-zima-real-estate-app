import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserMode, User, FilterState } from '@/types';

type Language = 'fr' | 'en' | 'pt';

// Simple in-memory storage for demo purposes to avoid hydration issues
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      console.log(`Storage: ${key} = ${value}`);
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
  const [isHydrated] = useState(true);
  const [language, setLanguageState] = useState<Language | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load data immediately but handle errors gracefully
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const savedMode = await storage.getItem('userMode');
      const savedUser = await storage.getItem('user');
      const savedLanguage = await storage.getItem('language');
      const savedOnboarding = await storage.getItem('hasCompletedOnboarding');
      
      if (savedMode && savedMode.trim()) {
        setUserMode(savedMode as UserMode);
      }
      if (savedUser && savedUser.trim()) {
        setUser(JSON.parse(savedUser));
      }
      if (savedLanguage && savedLanguage.trim()) {
        setLanguageState(savedLanguage as Language);
      }
      if (savedOnboarding === 'true') {
        setHasCompletedOnboarding(true);
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.log('Error loading persisted data:', error);
      setIsInitialized(true);
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

  return useMemo(() => ({
    userMode,
    user,
    filters,
    hasUnreadNotifications,
    isHydrated,
    language,
    hasCompletedOnboarding,
    isInitialized,
    switchMode,
    toggleAppMode,
    updateUser,
    updateFilters,
    clearFilters,
    markNotificationsAsRead,
    setLanguage,
    completeOnboarding
  }), [userMode, user, filters, hasUnreadNotifications, isHydrated, language, hasCompletedOnboarding, isInitialized, switchMode, toggleAppMode, updateUser, updateFilters, clearFilters, markNotificationsAsRead, setLanguage, completeOnboarding]);
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
      switchMode: async () => {},
      toggleAppMode: async () => {},
      updateUser: async () => {},
      updateFilters: () => {},
      clearFilters: () => {},
      markNotificationsAsRead: () => {},
      setLanguage: async () => {},
      completeOnboarding: async () => {}
    };
  }
  
  return store;
};