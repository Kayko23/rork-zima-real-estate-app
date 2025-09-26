import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export type AmenityKey = "wifi" | "piscine" | "parking" | "clim" | "cuisine" | "sécurité24h";

export const AMENITIES: Record<AmenityKey, string> = {
  wifi: "Wi‑Fi",
  piscine: "Piscine",
  parking: "Parking",
  clim: "Climatisation",
  cuisine: "Cuisine",
  "sécurité24h": "Sécurité 24h",
};

export default function AmenitiesChips({ selected, onToggle }:{ selected: AmenityKey[]; onToggle:(k: AmenityKey)=>void }){
  return (
    <View style={s.wrap} testID="amenities-chips">
      {(Object.keys(AMENITIES) as AmenityKey[]).map((k)=>{
        const active = selected.includes(k);
        return (
          <Pressable key={k} onPress={()=>onToggle(k)} style={[s.chip, active && s.active]}>
            <Text style={[s.txt, active && s.txtActive]}>{AMENITIES[k]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderColor: "#E6EFEC", backgroundColor: "#fff", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  active: { backgroundColor: "#134E48", borderColor: "#134E48" },
  txt: { color: "#0B3B36", fontWeight: "800" },
  txtActive: { color: "#fff" },
});