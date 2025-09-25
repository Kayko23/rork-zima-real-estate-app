import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MapPin } from "lucide-react-native";

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <View style={s.wrap}>
      <MapPin size={48} color="#9CA3AF" />
      <Text style={s.t}>Aucun résultat</Text>
      <Text style={s.s}>
        Essayez d&apos;ajuster les filtres ou changez de destination.
      </Text>
      <Pressable style={s.cta} onPress={onReset}>
        <Text style={s.ctaTxt}>Réinitialiser</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 8,
    padding: 24,
  },
  t: {
    fontWeight: "900",
    fontSize: 18,
    color: "#1F2937",
  },
  s: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
  },
  cta: {
    marginTop: 8,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaTxt: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
});