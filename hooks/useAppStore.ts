import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserMode, User, FilterState } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'fr' | 'en' | 'pt';

// Storage implementation with AsyncStorage
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.log(`Error getting ${key}:`, error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(`Error setting ${key}:`, error);
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

const defaultFilters: FilterState = {
  sortBy: 'recent'
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [userMode, setUserMode] = useState<UserMode>('user');
  const [user, setUser] = useState<User>(defaultUser);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [isHydrated, setIsHydrated] = useState(true); // Start as hydrated to prevent mismatch
  const [language, setLanguageState] = useState<Language | null>(null);

  useEffect(() => {
    // Load persisted data after component mount
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const savedMode = await storage.getItem('userMode');
      const savedUser = await storage.getItem('user');
      const savedLanguage = await storage.getItem('language');
      
      if (savedMode && savedMode.trim()) {
        setUserMode(savedMode as UserMode);
      }
      if (savedUser && savedUser.trim()) {
        setUser(JSON.parse(savedUser));
      }
      if (savedLanguage && savedLanguage.trim()) {
        setLanguageState(savedLanguage as Language);
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
    
    // Update user preferences
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        language: lang as 'fr' | 'en' | 'pt'
      }
    };
    setUser(updatedUser);
    await storage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  return useMemo(() => ({
    userMode,
    user,
    filters,
    hasUnreadNotifications,
    isHydrated,
    language,
    switchMode,
    toggleAppMode,
    updateUser,
    updateFilters,
    clearFilters,
    markNotificationsAsRead,
    setLanguage
  }), [userMode, user, filters, hasUnreadNotifications, isHydrated, language, switchMode, toggleAppMode, updateUser, updateFilters, clearFilters, markNotificationsAsRead, setLanguage]);
});