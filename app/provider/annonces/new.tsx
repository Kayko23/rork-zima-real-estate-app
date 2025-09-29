import { createListing } from "@/services/annonces.api";
import ListingForm from "@/components/provider/ListingForm";
import { router } from "expo-router";

export default function NewListingScreen(){
  const handleSubmit = async (payload: any) => {
    await createListing(payload); 
    router.back();
  };

  return <ListingForm onSubmit={handleSubmit} />;
}