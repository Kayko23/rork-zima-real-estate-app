import { router, Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyScreen from "@/components/ui/EmptyScreen";

export default function PaymentsScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ title: "Paiements" }} />
      <EmptyScreen
        title="Paiements"
        subtitle="Ajoutez une carte, un compte mobile money et consultez vos transactions."
        primaryCta={{ label: "Ajouter un moyen de paiement", onPress: () => router.push("/profile/payment-method/new") }}
        secondaryCta={{ label: "Historique", onPress: () => router.push("/profile/transactions") }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});