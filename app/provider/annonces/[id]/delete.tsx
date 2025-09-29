import React from "react";
import { useLocalSearchParams, router } from "expo-router";
import ConfirmSheet from "@/components/provider/ConfirmSheet";
import { deleteListing } from "@/services/annonces.api";

export default function DeleteScreen(){
  const { id } = useLocalSearchParams<{id:string}>();
  
  return (
    <ConfirmSheet
      title="Supprimer définitivement ?"
      description="Cette action est irréversible."
      confirmLabel="Supprimer"
      onConfirm={async ()=>{ 
        await deleteListing(id!); 
        router.back(); 
      }}
    />
  );
}