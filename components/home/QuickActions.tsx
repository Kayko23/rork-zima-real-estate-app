import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Type from "@/constants/typography";
import AppButton from "@/components/ui/AppButton";

const GREEN = "#19715C";

export default function QuickActions() {
  return (
    <View style={s.row}>
      <AppButton
        style={[s.card, s.outlined]}
        userHref="/(tabs)/categories"
        providerHref="/(proTabs)/listings"
        accessibilityLabel="Accéder aux biens immobiliers"
        testID="qa-properties"
      >
        <Ionicons name="home-outline" size={22} color={GREEN} />
        <Text style={s.label} numberOfLines={1} adjustsFontSizeToFit>Biens immobiliers</Text>
      </AppButton>

      <AppButton
        style={s.card}
        userHref="/(tabs)/services"
        providerHref="/(proTabs)/dashboard"
        accessibilityLabel="Accéder aux services et professionnels"
        testID="qa-services"
      >
        <Ionicons name="briefcase-outline" size={22} color="#0F172A" />
        <Text style={s.label} numberOfLines={1} adjustsFontSizeToFit>Services</Text>
      </AppButton>

      <AppButton
        style={s.card}
        userHref="/browse?title=Voyages&kind=voyages"
        providerHref="/(proTabs)/agenda"
        accessibilityLabel="Accéder aux voyages"
        testID="qa-voyages"
      >
        <Ionicons name="bed-outline" size={22} color="#0F172A" />
        <Text style={s.label} numberOfLines={1} adjustsFontSizeToFit>Voyages</Text>
      </AppButton>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginTop: 2, marginBottom: 8 },
  card: {
    flex: 1,
    height: 68,
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
  label: { ...Type.h3, color: "#0F172A", flexShrink: 1 },
});