import React from "react";
import { useLocalSearchParams, router } from "expo-router";
import AdjustSheet from "@/components/provider/AdjustSheet";
import { adjustListing } from "@/services/annonces.api";

export default function AdjustScreen(){
  const { id } = useLocalSearchParams<{id:string}>();
  
  return (
    <AdjustSheet
      initial={{ price: 0, currency:"XOF" }}
      onConfirm={async (values) => { 
        await adjustListing(id!, values); 
        router.back(); 
      }}
    />
  );
}