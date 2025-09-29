import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="edit" options={{ title: "Éditer le profil" }} />
      <Stack.Screen name="payments" options={{ title: "Paiements" }} />
      <Stack.Screen name="settings" options={{ title: "Paramètres" }} />
      <Stack.Screen name="language-currency" options={{ title: "Langue & Devise" }} />
      <Stack.Screen name="switch-mode" options={{ title: "Passer en mode prestataire" }} />
      <Stack.Screen name="help" options={{ title: "Aide & support" }} />
      {/* ponts vers les onglets existants */}
      <Stack.Screen name="favorites-bridge" options={{ headerShown: false }} />
      <Stack.Screen name="messages-bridge" options={{ headerShown: false }} />
    </Stack>
  );
}