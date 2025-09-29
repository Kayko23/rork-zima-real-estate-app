import { router, Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyScreen from "@/components/ui/EmptyScreen";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ title: "Éditer le profil" }} />
      <EmptyScreen
        title="Éditer le profil"
        subtitle="Mettez à jour votre nom, photo, téléphone, langue et devise."
        primaryCta={{ label: "Ouvrir le formulaire", onPress: () => router.push("/profile/form") }}
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