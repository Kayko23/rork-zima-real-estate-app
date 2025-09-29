
import EmptyScreen from "@/components/ui/EmptyScreen";

export default function SupportScreen() {
  return (
    <EmptyScreen
      title="Aide & Support"
      subtitle="Trouvez des réponses, contactez-nous ou ouvrez un ticket."
      primaryCta={{ label: "Centre d'aide", onPress: () => console.log("FAQ not implemented yet") }}
      secondaryCta={{ label: "Contacter", onPress: () => console.log("Contact support not implemented yet") }}
    />
  );
}