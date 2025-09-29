import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MapPin, Calendar, Users } from "lucide-react-native";
import { VoyageQuery } from "./helpers";

export default function VoyageSearchBar({ value, onPress }:{
  value: VoyageQuery; onPress: ()=>void;
}) {
  const destination = value.city?.label ?? value.country?.label ?? "Destination";
  const dates = value.startDate && value.endDate ? `${value.startDate} – ${value.endDate}` : "Dates";
  const pax = value.guests ? `${value.guests} voyageur${value.guests>1?"s":""}` : "1 voyageur";

  return (
    <TouchableOpacity style={s.wrap} onPress={onPress} activeOpacity={0.9} testID="voyage-searchbar">
      <View style={s.row}>
        <View style={s.pill}>
          <MapPin size={16} color="#0B3B36" />
          <Text style={s.txt} numberOfLines={1}>{destination}</Text>
        </View>
      </View>
      <View style={s.row}>
        <View style={s.pill}>
          <Calendar size={16} color="#0B3B36" />
          <Text style={s.txt} numberOfLines={1}>{dates}</Text>
        </View>
        <View style={s.pill}>
          <Users size={16} color="#0B3B36" />
          <Text style={s.txt} numberOfLines={1}>{pax}</Text>
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
    gap: 8,
    borderWidth: 1,
    borderColor: "#E6EFEC",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6EFEC",
    minHeight: 40,
  },
  txt: {
    flex: 1,
    fontWeight: "600",
    color: "#0B3B36",
    fontSize: 14,
  }
});