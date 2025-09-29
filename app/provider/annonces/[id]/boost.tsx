import React from "react";
import { useLocalSearchParams, router } from "expo-router";
import BoostSheet from "@/components/provider/BoostSheet";
import { boostListing } from "@/services/annonces.api";

export default function BoostScreen(){
  const { id } = useLocalSearchParams<{id:string}>();
  
  return (
    <BoostSheet 
      onConfirm={async (plan)=> { 
        await boostListing(id!, plan); 
        router.back(); 
      }} 
    />
  );
}