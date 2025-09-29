import React from "react";
import { useLocalSearchParams, router } from "expo-router";
import ListingForm from "@/components/provider/ListingForm";
import { updateListing } from "@/services/annonces.api";

export default function EditListing(){
  const { id } = useLocalSearchParams<{id:string}>();
  
  return (
    <ListingForm 
      initial={{ id }} 
      onSubmit={async (payload)=>{ 
        await updateListing(id!, payload); 
        router.back(); 
      }} 
    />
  );
}