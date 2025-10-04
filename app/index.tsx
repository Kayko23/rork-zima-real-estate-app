import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/hooks/useSession";
import { useSettings } from "@/hooks/useSettings";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSession();
  const { ready, locale, country } = useSettings();
  const [hasNavigated, setHasNavigated] = useState<boolean>(false);

  useEffect(() => {
    if (hasNavigated) return;

    if (!ready) return; // wait for settings hydration

    const timer = setTimeout(() => {
      if (hasNavigated) return;
      setHasNavigated(true);

      // Onboarding gate
      if (!locale || !country) {
        router.replace("/(onboarding)/language");
        return;
      }

      // If you have auth, go home either way for now
      router.replace("/(tabs)/home");
    }, isLoading ? 100 : 0);

    return () => clearTimeout(timer);
  }, [ready, locale, country, isLoading, hasNavigated, router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#0B3C2F" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});