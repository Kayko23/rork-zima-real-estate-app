import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MapPin } from "lucide-react-native";
import { VoyageQuery } from "./helpers";

export default function VoyageSearchBar({ value, onPress }:{
  value: VoyageQuery; onPress: ()=>void;
}) {
  const destination = value.city?.label ?? value.country?.label ?? "Destination";

  return (
    <TouchableOpacity style={s.wrap} onPress={onPress} activeOpacity={0.9} testID="voyage-searchbar">
      <View style={s.row}>
        <View style={[s.pill, { flex: 1, minWidth: "100%" }]}>
          <MapPin size={16} color="#0B3B36" />
          <Text style={s.txt} numberOfLines={1}>{destination}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  wrap: {
    backgroundColor: "#F8FFFE",
    borderRadius: 16,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E6EFEC",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6EFEC",
    minHeight: 42,
    minWidth: 120,
  },
  txt: {
    fontWeight: "600",
    color: "#0B3B36",
    fontSize: 14,
  }
});