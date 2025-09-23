import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/hooks/useAppStore";

// Prevent auto-hide of native splash
SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Retour", headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
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

  useEffect(() => {
    const prepare = async () => {
      try {
        // Minimal preparation to avoid hydration timeout
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsAppReady(true);
      } catch (e) {
        console.warn('Error during app preparation:', e);
        setIsAppReady(true);
      }
    };

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <GestureHandlerRootView style={styles.container}>
            <RootLayoutNav />
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