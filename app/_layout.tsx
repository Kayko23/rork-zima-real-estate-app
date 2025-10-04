import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "@/hooks/useAppStore";
import { VoyageFiltersProvider } from "@/components/voyages/filterContext";
import { useBootstrapFx } from "@/lib/bootstrapFx";
import { SessionProvider } from "@/hooks/useSession";
import { SettingsProvider, useSettings } from "@/hooks/useSettings";
import { SearchPresetProvider } from "@/hooks/useSearchPreset";

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function OnboardingGate() {
  const { ready, locale, country } = useSettings();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!ready) return;
    const inOnboarding = segments[0] === '(onboarding)';
    if ((!locale || !country) && !inOnboarding) {
      router.replace('/(onboarding)/language');
    }
  }, [ready, locale, country, segments, router]);

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
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <SessionProvider>
            <AppProvider>
              <SearchPresetProvider>
                <AppInitializer>
                  <VoyageFiltersProvider>
                    <GestureHandlerRootView style={styles.container}>
                      <View style={styles.container} onLayout={onLayoutRootView}>
                        <OnboardingGate />
                      </View>
                    </GestureHandlerRootView>
                  </VoyageFiltersProvider>
                </AppInitializer>
              </SearchPresetProvider>
            </AppProvider>
          </SessionProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});