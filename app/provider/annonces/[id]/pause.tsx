import React from "react";
import { useLocalSearchParams, router } from "expo-router";
import ConfirmSheet from "@/components/provider/ConfirmSheet";
import { pauseListing, resumeListing } from "@/services/annonces.api";

export default function PauseScreen(){
  const { id, action } = useLocalSearchParams<{id:string; action?:string}>();
  const isResume = action === "resume";
  
  return (
    <ConfirmSheet
      title={isResume ? "Reprendre l'annonce ?" : "Mettre l'annonce en pause ?"}
      confirmLabel={isResume ? "Reprendre" : "Mettre en pause"}
      onConfirm={async ()=>{ 
        if (isResume) {
          await resumeListing(id!);
        } else {
          await pauseListing(id!);
        }
        router.back(); 
      }}
    />
  );
}