import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Calendar, Users, MapPin } from "lucide-react-native";

export type VoyageQuery = {
  destination?: string;
  startDate?: string;
  endDate?: string;
  guests?: number;
};

export default function VoyageSearchBar({
  value,
  onOpen,
}: {
  value: VoyageQuery;
  onOpen: () => void;
}) {
  return (
    <Pressable onPress={onOpen} style={s.wrap} testID="voyage.searchBar">
      <Chip icon={MapPin} label={value.destination || "Destination"} />
      <Chip icon={Calendar} label={value.startDate && value.endDate ? "Dates" : "Dates"} />
      <Chip icon={Users} label={`${value.guests ?? 1} voyageur${(value.guests ?? 1) > 1 ? "s" : ""}`} />
    </Pressable>
  );
}

type IconProps = { size?: number; color?: string };
function Chip({ icon: Icon, label }: { icon: React.ComponentType<IconProps>; label: string }) {
  return (
    <View style={s.chip}>
      <View style={s.iconWrap}><Icon size={16} color="#0F172A" /></View>
      <Text numberOfLines={1} style={s.chipText}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    gap: 8,
    padding: 8,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    alignSelf: "stretch",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F2F4F7",
    borderRadius: 20,
    gap: 6,
  },
  chipText: { fontSize: 14, fontWeight: "600", color: "#0F172A", maxWidth: 120 },
  iconWrap: { alignItems: "center", justifyContent: "center" },
});
