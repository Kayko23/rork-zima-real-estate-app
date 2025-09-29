import React from "react";
import { createListing } from "@/services/annonces.api";
import ListingForm from "@/components/provider/ListingForm";
import { router } from "expo-router";

export default function NewListingScreen(){
  return (
    <ListingForm 
      onSubmit={async (payload) => { 
        await createListing(payload); 
        router.back(); 
      }} 
    />
  );
}