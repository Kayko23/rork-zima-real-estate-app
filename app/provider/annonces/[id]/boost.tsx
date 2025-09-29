import { useLocalSearchParams, router } from "expo-router";
import BoostSheet from "@/components/provider/BoostSheet";
import { boostListing } from "@/services/annonces.api";

export default function BoostScreen(){
  const { id } = useLocalSearchParams<{id:string}>();
  
  const handleConfirm = async (plan: any) => {
    if (!id) return;
    await boostListing(id, plan); 
    router.back();
  };

  return <BoostSheet onConfirm={handleConfirm} />;
}