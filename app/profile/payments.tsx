import EmptyScreen from "@/components/ui/EmptyScreen";

export default function PaymentsScreen() {
  return (
    <EmptyScreen
      title="Paiements"
      subtitle="Ajoutez une carte, un compte mobile money et consultez vos transactions."
      primaryCta={{ label: "Ajouter un moyen de paiement", onPress: () => console.log("Paiement à implémenter") }}
      secondaryCta={{ label: "Historique", onPress: () => console.log("Historique à implémenter") }}
    />
  );
}