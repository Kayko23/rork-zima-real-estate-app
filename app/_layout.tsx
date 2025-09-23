import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/hooks/useAppStore";
import ZimaSplashScreen from "@/components/ui/SplashScreen";
import RouteLoader from "@/components/ui/RouteLoader";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Retour" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
    const prepare = async () => {
      try {
        // Simulate app preparation time
        const timer = setTimeout(() => {
          setIsAppReady(true);
        }, 800);
        
        return () => clearTimeout(timer);
      } catch (e) {
        console.warn(e);
        setIsAppReady(true);
      } finally {
        // Hide native splash screen
        SplashScreen.hideAsync();
      }
    };

    const cleanup = prepare();
    return () => {
      if (cleanup instanceof Promise) {
        cleanup.then(cleanupFn => cleanupFn?.());
      }
    };
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show custom splash screen until app is ready
  if (!isAppReady || showSplash) {
    return (
      <ZimaSplashScreen 
        onComplete={handleSplashComplete}
        minDuration={5000}
        maxDuration={5000}
      />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <GestureHandlerRootView style={styles.container}>
          <RootLayoutNav />
          <RouteLoader visible={isLoading} />
        </GestureHandlerRootView>
      </AppProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});