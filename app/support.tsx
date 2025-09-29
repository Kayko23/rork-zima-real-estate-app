import { router, Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyScreen from "@/components/ui/EmptyScreen";

export default function SupportScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ title: "Aide & Support" }} />
      <EmptyScreen
        title="Aide & Support"
        subtitle="Trouvez des réponses, contactez-nous ou ouvrez un ticket."
        primaryCta={{ label: "Centre d'aide", onPress: () => router.push("/support/faq") }}
        secondaryCta={{ label: "Contacter", onPress: () => router.push("/support/contact") }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});