import { router } from "expo-router";
import EmptyScreen from "@/components/ui/EmptyScreen";

export default function NotFound() {
  return (
    <EmptyScreen
      title="Oups… page introuvable"
      subtitle="Le lien est peut-être expiré ou n'existe pas."
      primaryCta={{ label: "Aller à l'accueil", onPress: () => router.replace("/") }}
      secondaryCta={{ label: "Retour", onPress: () => router.back() }}
    />
  );
}
