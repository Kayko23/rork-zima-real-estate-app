import React from "react";
import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#19715C";

export default function QuickActions() {
  const r = useRouter();
  return (
    <View style={s.row}>
      {/* Biens immobiliers */}
      <Pressable style={[s.card, s.outlined]} onPress={() => r.push("/(tabs)/categories")} accessibilityRole="button">
        <Ionicons name="home-outline" size={20} color={GREEN} />
        <Text style={s.label} numberOfLines={1} adjustsFontSizeToFit>Biens immobiliers</Text>
      </Pressable>

      {/* Services */}
      <Pressable style={s.card} onPress={() => r.push("/(tabs)/services")} accessibilityRole="button">
        <Ionicons name="briefcase-outline" size={20} color="#0F172A" />
        <Text style={s.label} numberOfLines={1} adjustsFontSizeToFit>Services</Text>
      </Pressable>

      {/* Voyages (nouvelle section) */}
      <Pressable
        style={s.card}
        onPress={() => r.push({ pathname: "/browse", params: { title: "Voyages", kind: "voyages" } })}
        accessibilityRole="button"
      >
        <Ionicons name="bed-outline" size={20} color="#0F172A" />
        <Text style={s.label} numberOfLines={1} adjustsFontSizeToFit>Voyages</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginTop: 10 },
  card: {
    flex: 1,
    height: 72,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1, borderColor: "rgba(230,232,235,0.9)",
    paddingHorizontal: 14,
    flexDirection: "row", alignItems: "center", gap: 10,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.06, shadowRadius: 18 },
      android: { elevation: 4 },
      web: { boxShadow: "0 10px 24px rgba(0,0,0,0.06)" } as any,
    }),
  },
  outlined: { borderColor: GREEN, borderWidth: 2 },
  label: { fontSize: 16, fontWeight: "700", color: "#0F172A", flexShrink: 1 },
});