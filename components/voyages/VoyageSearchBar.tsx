import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";

export type VoyageQuery = {
  destination?: { label: string; lat?: number; lng?: number };
  dateFrom?: string;
  dateTo?: string; // ISO
  guests?: number;
  type?: "hotel" | "residence" | "daily" | "all";
};

export function VoyageSearchBar({
  onPress,
  query,
}: {
  onPress: () => void;
  query?: VoyageQuery;
}) {
  const pill = (label: string, value?: string) => (
    <View style={s.pill}>
      <Text style={s.pillTxt}>{value || label}</Text>
    </View>
  );

  return (
    <Pressable onPress={onPress} style={s.wrap}>
      <Search size={18} color="#1F2937" />
      <View style={s.pillsContainer}>
        {pill("Destination", query?.destination?.label)}
        {pill(
          "Dates",
          query?.dateFrom && query?.dateTo ? "Dates choisies" : undefined
        )}
        {pill("Voyageurs", query?.guests ? `${query.guests}` : undefined)}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    height: 48,
    borderRadius: 999,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  pill: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 10,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  pillTxt: {
    fontWeight: "700",
    color: "#111827",
    fontSize: 12,
  },
  pillsContainer: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
    flexWrap: "wrap",
  },
});