import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/hooks/useAppStore";
import ZimaSplashScreen from "@/components/ui/SplashScreen";
import RouteLoader from "@/components/ui/RouteLoader";

// Empêche la fermeture auto du splash natif
SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Retour", headerShown: false }}>
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(proTabs)" options={{ headerShown: false }} />
      <Stack.Screen name="services" options={{ headerShown: false }} />
      <Stack.Screen name="property/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="provider/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="become-provider" options={{ headerShown: false }} />
      <Stack.Screen name="legal" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: "modal",
          headerShown: false 
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const prepare = async () => {
      try {
        // Précharge les assets critiques si nécessaire
        // await preloadAssets();
        
        // Petit délai pour s'assurer que tout est prêt
        await new Promise<void>((resolve) => {
          timeoutId = setTimeout(() => resolve(), 500);
        });
        
        setIsAppReady(true);
      } catch (e) {
        console.warn('Error during app preparation:', e);
        setIsAppReady(true);
      }
    };

    prepare();
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    // Dès que le premier layout est prêt -> on cache le splash natif
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Tant que pas prêt : on laisse le splash natif affiché
  if (!isAppReady) {
    return null;
  }

  // Show custom splash screen
  if (showSplash) {
    return (
      <View style={styles.container} onLayout={onLayoutRootView}>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <ZimaSplashScreen 
              onComplete={handleSplashComplete}
              minDuration={5000}
              maxDuration={5000}
            />
          </AppProvider>
        </QueryClientProvider>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <GestureHandlerRootView style={styles.container}>
            <RootLayoutNav />
            <RouteLoader visible={isLoading} />
          </GestureHandlerRootView>
        </AppProvider>
      </QueryClientProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});