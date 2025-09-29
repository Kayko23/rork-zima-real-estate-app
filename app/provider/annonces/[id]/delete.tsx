import { useLocalSearchParams, router } from "expo-router";
import ConfirmSheet from "@/components/provider/ConfirmSheet";
import { deleteListing } from "@/services/annonces.api";

export default function DeleteScreen(){
  const { id } = useLocalSearchParams<{id:string}>();
  
  const handleConfirm = async () => {
    if (!id) return;
    await deleteListing(id); 
    router.back();
  };

  return (
    <ConfirmSheet
      title="Supprimer définitivement ?"
      description="Cette action est irréversible."
      confirmLabel="Supprimer"
      onConfirm={handleConfirm}
      danger
    />
  );
}