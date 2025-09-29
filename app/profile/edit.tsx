import { router } from "expo-router";
import EmptyScreen from "@/components/ui/EmptyScreen";

export default function EditProfileScreen() {
  return (
    <EmptyScreen
      title="Éditer le profil"
      subtitle="Mettez à jour votre nom, photo, téléphone, langue et devise."
      primaryCta={{ label: "Ouvrir le formulaire", onPress: () => console.log("Formulaire à implémenter") }}
      secondaryCta={{ label: "Retour", onPress: () => router.back() }}
    />
  );
}