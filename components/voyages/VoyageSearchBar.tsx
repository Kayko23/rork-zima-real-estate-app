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
      <View style={s.pill}><MapPin size={16}/><Text style={s.txt}>{destination}</Text></View>
      <View style={s.pill}><Calendar size={16}/><Text style={s.txt}>{dates}</Text></View>
      <View style={s.pill}><Users size={16}/><Text style={s.txt}>{pax}</Text></View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  wrap:{ flexDirection:"row", gap:8, flexWrap:"wrap", alignItems:"center" },
  pill:{ flexDirection:"row", alignItems:"center", gap:6, paddingVertical:8, paddingHorizontal:12, borderRadius:999, backgroundColor:"#fff", borderWidth:1, borderColor:"#E6EFEC"},
  txt:{ fontWeight:"700", color:"#0B3B36" }
});