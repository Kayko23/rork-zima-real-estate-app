import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/hooks/useAppStore";
import { VoyageFiltersProvider } from "@/components/voyages/filterContext";
import { useBootstrapFx } from "@/lib/bootstrapFx";
import { SessionProvider } from "@/hooks/useSession";

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Retour", headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(proTabs)" options={{ headerShown: false }} />
      <Stack.Screen name="services" options={{ headerShown: false }} />
      <Stack.Screen name="property/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="provider/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="become-provider" options={{ headerShown: false }} />
      <Stack.Screen name="legal" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal", headerShown: false }} />
    </Stack>
  );
}

function AppInitializer({ children }: { children: React.ReactNode }) {
  useBootstrapFx();
  return <>{children}</>;
}

export default function RootLayout() {
  const onLayoutRootView = useCallback(async () => {
    try { 
      await SplashScreen.hideAsync(); 
    } catch (error) {
      console.log('SplashScreen hide error:', error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AppProvider>
          <AppInitializer>
            <VoyageFiltersProvider>
              <GestureHandlerRootView style={styles.container}>
                <View style={styles.container} onLayout={onLayoutRootView}>
                  <RootLayoutNav />
                </View>
              </GestureHandlerRootView>
            </VoyageFiltersProvider>
          </AppInitializer>
        </AppProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});