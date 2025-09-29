import { router, Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyScreen from "@/components/ui/EmptyScreen";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ title: "Paramètres" }} />
      <EmptyScreen
        title="Paramètres"
        subtitle="Notifications, confidentialité, langue & devise, sécurité."
        primaryCta={{ label: "Ouvrir les paramètres", onPress: () => router.push("/profile/settings/detail") }}
        secondaryCta={{ label: "Retour", onPress: () => router.back() }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});