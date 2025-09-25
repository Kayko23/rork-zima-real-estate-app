import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserMode, User, FilterState } from '@/types';

type Language = 'fr' | 'en' | 'pt';

// Simple storage that doesn't cause hydration issues
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Ignore errors
    }
    return null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Ignore errors
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore errors
    }
  },
  clear: async (): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Only clear app-specific keys to avoid affecting other apps
        const keysToRemove = ['userMode', 'user', 'language', 'hasCompletedOnboarding'];
        keysToRemove.forEach(key => {
          window.localStorage.removeItem(key);
        });
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
  const [isHydrated, setIsHydrated] = useState(true);
  const [language, setLanguageState] = useState<Language | null>('fr');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);
  const [activeHomeTab, setActiveHomeTab] = useState<'biens' | 'services' | 'voyages'>('biens');

  useEffect(() => {
    // Load persisted data after component mounts
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      
      const savedMode = await storage.getItem('userMode');
      const savedUser = await storage.getItem('user');
      const savedLanguage = await storage.getItem('language');
      const savedOnboarding = await storage.getItem('hasCompletedOnboarding');
      
      // If any data seems corrupted, clear all and start fresh
      if (savedUser && (!savedUser.startsWith('{') || !savedUser.endsWith('}'))) {
        console.log('Detected corrupted localStorage data, clearing all app data');
        await storage.clear();
        return;
      }
      
      if (savedMode && savedMode.trim()) {
        setUserMode(savedMode as UserMode);
      }
      if (savedUser && savedUser.trim()) {
        try {
          // Check if the saved data looks like valid JSON
          if (savedUser.startsWith('{') && savedUser.endsWith('}')) {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser && typeof parsedUser === 'object' && parsedUser.id) {
              setUser(parsedUser);
            } else {
              console.log('Invalid user data structure, resetting to default');
              await storage.setItem('user', JSON.stringify(defaultUser));
            }
          } else {
            console.log('Invalid JSON format in saved user data, resetting to default');
            await storage.setItem('user', JSON.stringify(defaultUser));
          }
        } catch (error) {
          console.log('Error parsing saved user data:', error);
          // Reset to default user if parsing fails
          await storage.setItem('user', JSON.stringify(defaultUser));
        }
      }
      if (savedLanguage && savedLanguage.trim()) {
        setLanguageState(savedLanguage as Language);
      }
      if (savedOnboarding === 'true') {
        setHasCompletedOnboarding(true);
      }
    } catch (error) {
      console.log('Error loading persisted data:', error);
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
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      const userJson = JSON.stringify(updatedUser);
      await storage.setItem('user', userJson);
    } catch (error) {
      console.log('Error updating user data:', error);
    }
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
    try {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          language: lang
        }
      };
      setUser(updatedUser);
      const userJson = JSON.stringify(updatedUser);
      await storage.setItem('user', userJson);
    } catch (error) {
      console.log('Error updating user language:', error);
    }
  }, [user]);

  const completeOnboarding = useCallback(async () => {
    setHasCompletedOnboarding(true);
    await storage.setItem('hasCompletedOnboarding', 'true');
  }, []);

  const setHomeTab = useCallback((tab: 'biens' | 'services' | 'voyages') => {
    setActiveHomeTab(tab);
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
    switchMode,
    toggleAppMode,
    updateUser,
    updateFilters,
    clearFilters,
    markNotificationsAsRead,
    setLanguage,
    completeOnboarding,
    setHomeTab
  }), [userMode, user, filters, hasUnreadNotifications, isHydrated, language, hasCompletedOnboarding, isInitialized, activeHomeTab, switchMode, toggleAppMode, updateUser, updateFilters, clearFilters, markNotificationsAsRead, setLanguage, completeOnboarding, setHomeTab]);
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
      switchMode: async () => {},
      toggleAppMode: async () => {},
      updateUser: async () => {},
      updateFilters: () => {},
      clearFilters: () => {},
      markNotificationsAsRead: () => {},
      setLanguage: async () => {},
      completeOnboarding: async () => {},
      setHomeTab: () => {}
    };
  }
  
  return store;
};