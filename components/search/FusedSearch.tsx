import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchSheet from "./SearchSheet";

export default function FusedSearch({
  mode,
  onSubmit,
}: { mode: "biens" | "services" | "voyages"; onSubmit: (params: any) => void }) {
  const [open, setOpen] = useState(false);

  const placeholder =
    mode === "services" ? "Rechercher par nom, ville ou spécialité"
    : mode === "voyages" ? "Où allez-vous ?"
    : "Où cherchez-vous un bien ?";

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={s.fused}>
        <Ionicons name="search-outline" size={20} color="#111827" />
        <Text numberOfLines={1} style={s.placeholder}>{placeholder}</Text>
        <View style={s.chipsRow}>
          {/* mini chips d'état (pays/ville/dates selon mode) -> facultatif */}
        </View>
      </Pressable>

      <SearchSheet
        open={open}
        mode={mode}
        onClose={() => setOpen(false)}
        onApply={(params) => { setOpen(false); onSubmit(params); }}
      />
    </>
  );
}

const s = StyleSheet.create({
  fused: {
    height: 52, borderRadius: 26, backgroundColor: "#fff",
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 14, borderWidth: 1, borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
  },
  placeholder: { flex: 1, fontSize: 16, fontWeight: "700", color: "#111827" },
  chipsRow: { flexDirection: "row", gap: 6 },
});