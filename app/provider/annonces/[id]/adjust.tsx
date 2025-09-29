import { useLocalSearchParams, router } from "expo-router";
import AdjustSheet from "@/components/provider/AdjustSheet";
import { adjustListing } from "@/services/annonces.api";

export default function AdjustScreen(){
  const { id } = useLocalSearchParams<{id:string}>();
  
  const handleConfirm = async (values: any) => {
    if (!id) return;
    await adjustListing(id, values); 
    router.back();
  };

  return (
    <AdjustSheet
      initial={{ price: 0, currency:"XOF" }}
      onConfirm={handleConfirm}
    />
  );
}