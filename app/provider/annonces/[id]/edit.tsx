import { useLocalSearchParams, router } from "expo-router";
import ListingForm from "@/components/provider/ListingForm";
import { updateListing } from "@/services/annonces.api";

export default function EditListing(){
  const { id } = useLocalSearchParams<{id:string}>();
  
  const handleSubmit = async (payload: any) => {
    if (!id) return;
    await updateListing(id, payload); 
    router.back();
  };

  return <ListingForm initial={{ id }} onSubmit={handleSubmit} />;
}