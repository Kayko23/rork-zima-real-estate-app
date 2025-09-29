
import EmptyScreen from "@/components/ui/EmptyScreen";

export default function PaymentsScreen() {
  return (
    <EmptyScreen
      title="Paiements"
      subtitle="Ajoutez une carte, un compte mobile money et consultez vos transactions."
      primaryCta={{ label: "Ajouter un moyen de paiement", onPress: () => console.log("Payment method not implemented yet") }}
      secondaryCta={{ label: "Historique", onPress: () => console.log("Transaction history not implemented yet") }}
    />
  );
}