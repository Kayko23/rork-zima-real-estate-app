import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { trpc, trpcClient } from "@/lib/trpc";
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
    const seg0 = segments[0];
    const inOnboarding = seg0 === '(onboarding)';
    const inCountry = seg0 === 'country';

    if (!locale || !country) {
      if (!(inOnboarding || inCountry)) {
        router.replace('/(onboarding)/language');
      }
      return;
    }

    if (inOnboarding) {
      router.replace('/');
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
      <Stack.Screen name="legal" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="country/select" options={{ headerShown: true, title: 'Choisir un pays' }} />
      <Stack.Screen name="vehicles" options={{ headerShown: false }} />
      <Stack.Screen name="property/detail/[id]" options={{ headerShown: true, title: 'Détail du bien' }} />
      <Stack.Screen name="travel/detail/[id]" options={{ headerShown: true, title: 'Détail du séjour' }} />
      <Stack.Screen name="vehicle/detail/[id]" options={{ headerShown: true, title: 'Détail du véhicule' }} />
      <Stack.Screen name="pro/onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="pro/status" options={{ headerShown: false }} />
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
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
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
      </trpc.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});