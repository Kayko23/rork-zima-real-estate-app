import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/hooks/useSession";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSession();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (hasNavigated) return;
    
    const timer = setTimeout(() => {
      if (!hasNavigated) {
        setHasNavigated(true);
        if (isAuthenticated) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/(onboarding)/splash");
        }
      }
    }, isLoading ? 100 : 0);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, hasNavigated, router]);

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