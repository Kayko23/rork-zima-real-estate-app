import { router } from "expo-router";
import EmptyScreen from "@/components/ui/EmptyScreen";

export default function SettingsScreen() {
  return (
    <EmptyScreen
      title="Paramètres"
      subtitle="Notifications, confidentialité, langue & devise, sécurité."
      primaryCta={{ label: "Ouvrir les paramètres", onPress: () => console.log("Settings detail not implemented yet") }}
      secondaryCta={{ label: "Retour", onPress: () => router.back() }}
    />
  );
}