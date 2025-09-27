import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';

type User = { 
  id: string; 
  email?: string; 
  phone?: string; 
  role: "user" | "provider"; 
  name?: string; 
  firstName?: string;
  lastName?: string;
};

// Simple storage abstraction to avoid direct AsyncStorage import
const storage = {
  async multiSet(items: [string, string][]) {
    // In a real app, this would use a proper storage provider
    if (typeof window !== 'undefined' && window.localStorage) {
      items.forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    }
  },
  async multiGet(keys: string[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
      return keys.map(key => [key, localStorage.getItem(key)] as [string, string | null]);
    }
    return keys.map(key => [key, null] as [string, string | null]);
  },
  async multiRemove(keys: string[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
      keys.forEach(key => localStorage.removeItem(key));
    }
  }
};

export const [SessionProvider, useSession] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setSession = useCallback(async (newUser: User, token: string) => {
    try {
      if (!newUser?.id?.trim() || !token?.trim()) {
        console.error('Invalid user or token provided');
        return;
      }
      
      const sanitizedUser = {
        ...newUser,
        id: newUser.id.trim(),
        email: newUser.email?.trim(),
        phone: newUser.phone?.trim(),
        name: newUser.name?.trim(),
        firstName: newUser.firstName?.trim(),
        lastName: newUser.lastName?.trim(),
      };
      
      await storage.multiSet([
        ["@zima.user", JSON.stringify(sanitizedUser)], 
        ["@zima.token", token.trim()]
      ]);
      setUser(sanitizedUser);
      setAccessToken(token.trim());
    } catch (error) {
      console.error("Error saving session:", error);
    }
  }, []);
  
  const clearSession = useCallback(async () => {
    try {
      await storage.multiRemove(["@zima.user", "@zima.token"]);
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  }, []);

  const hydrate = useCallback(async () => {
    try {
      const [[, u], [, t]] = await storage.multiGet(["@zima.user", "@zima.token"]);
      if (u && t && u.trim() && t.trim()) {
        try {
          const userData = JSON.parse(u);
          if (userData && userData.id) {
            setUser(userData);
            setAccessToken(t);
          }
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          // Clear invalid data
          await storage.multiRemove(["@zima.user", "@zima.token"]);
        }
      }
    } catch (error) {
      console.error("Error hydrating session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const initSession = async () => {
      try {
        await hydrate();
      } catch (error) {
        console.error('Session initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('Session hydration timeout');
        setIsLoading(false);
      }
    }, 2000);
    
    initSession();
    
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [hydrate, isLoading]);

  return useMemo(() => ({
    user,
    accessToken,
    isLoading,
    setSession,
    clearSession,
    isAuthenticated: !!user && !!accessToken,
  }), [user, accessToken, isLoading, setSession, clearSession]);
});