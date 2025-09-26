import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { X, Filter, Star, Users, Calendar } from "lucide-react-native";
import BottomSheet from "@/components/ui/BottomSheet";
import RangeSlider from "@/components/ui/RangeSlider";
import AmenitiesChips, { AmenityKey } from "@/components/voyages/AmenitiesChips";
import type { VoyageFilters } from "@/components/voyages/helpers";

type Props = { visible: boolean; onClose: () => void; initial?: VoyageFilters; onSubmit?: (f: VoyageFilters) => void };

export default function TripsFilterSheet({ visible, onClose, initial, onSubmit }: Props) {
  const [local, setLocal] = useState<VoyageFilters>({ priceMin: 0, priceMax: 200000, ratingMin: 0, premiumOnly: false, amenities: [] });

  useEffect(() => {
    if (initial) setLocal({ ...local, ...initial, amenities: initial.amenities ?? [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, visible]);

  const apply = () => { onSubmit?.(local); onClose(); };
  const currency = "FCFA" as const;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={m.header}>
        <View style={m.headRow}>
          <Filter size={18} color="#134E48" />
          <Text style={m.title}>Filtres</Text>
        </View>
        <Pressable onPress={onClose}><X size={22} color="#1F2937" /></Pressable>
      </View>

      <ScrollView contentContainerStyle={m.scrollPad} showsVerticalScrollIndicator={false}>
        <Text style={m.label}>Voyageurs</Text>
        <View style={m.row}>
          <Pressable style={m.pill} onPress={()=>setLocal(p=>({ ...p, guests: Math.max(1, Number((p as any).guests ?? 1) - 1) }))}><Text style={m.pillTxt}>−</Text></Pressable>
          <Pressable style={m.pill}><Users size={16}/><Text style={m.pillTxt}>{(local as any).guests ?? 1}</Text></Pressable>
          <Pressable style={m.pill} onPress={()=>setLocal(p=>({ ...p, guests: Number((p as any).guests ?? 1) + 1 }))}><Text style={m.pillTxt}>+</Text></Pressable>
        </View>

        <Text style={m.label}>Dates</Text>
        <View style={m.row}>
          <Pressable style={m.block}><Calendar size={16} color="#134E48" /><Text style={m.blockTxt}>{(local as any).startDate || "Arrivée"}</Text></Pressable>
          <Pressable style={m.block}><Calendar size={16} color="#134E48" /><Text style={m.blockTxt}>{(local as any).endDate || "Départ"}</Text></Pressable>
        </View>

        <Text style={m.label}>Prix par nuit</Text>
        <View style={m.gap8}>
          <RangeSlider
            min={0}
            max={200000}
            value={[local.priceMin, local.priceMax]}
            onChange={([a,b])=> setLocal({ ...local, priceMin: a, priceMax: b })}
          />
          <View style={m.rowSpread}>
            <View style={m.badge}><Text style={m.badgeTxt}>{(local.priceMin).toLocaleString()} {currency}</Text></View>
            <View style={m.badge}><Text style={m.badgeTxt}>{(local.priceMax).toLocaleString()} {currency}</Text></View>
          </View>
        </View>

        <Text style={m.label}>Note minimale</Text>
        <View style={m.row}>
          {[0,3,4,4.5,5].map((r)=> (
            <Pressable key={String(r)} onPress={()=>setLocal({ ...local, ratingMin: r })}
              style={[m.chip, local.ratingMin===r && m.chipActive]}>
              <Star size={14} color={local.ratingMin===r ? "#fff" : "#374151"} />
              <Text style={[m.chipTxt, local.ratingMin===r && m.chipTxtActive]}> {r}+</Text>
            </Pressable>
          ))}
        </View>

        <Text style={m.label}>Label</Text>
        <Pressable style={[m.chip, local.premiumOnly && m.chipActive]} onPress={()=>setLocal({ ...local, premiumOnly: !local.premiumOnly })}>
          <Text style={[m.chipTxt, local.premiumOnly && m.chipTxtActive]}>Premium uniquement</Text>
        </Pressable>

        <Text style={m.label}>Équipements</Text>
        <AmenitiesChips
          selected={(local.amenities ?? []) as AmenityKey[]}
          onToggle={(k: AmenityKey)=> {
            const cur = (local.amenities ?? []) as AmenityKey[];
            const arr = cur.includes(k) ? cur.filter(x=>x!==k) : [...cur, k];
            setLocal({ ...local, amenities: arr });
          }}
        />
      </ScrollView>

      <View style={m.footer}>
        <Pressable onPress={()=> setLocal({ priceMin: 0, priceMax: 200000, ratingMin: 0, premiumOnly: false, amenities: [] })} style={m.reset}>
          <Text style={m.resetTxt}>Réinitialiser</Text>
        </Pressable>
        <Pressable onPress={apply} style={m.apply} testID="filters-apply">
          <Text style={m.applyTxt}>Voir les résultats</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const m = StyleSheet.create({
  header:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:6 },
  headRow:{ flexDirection:"row", alignItems:"center", gap:8 },
  scrollPad:{ paddingBottom:8 },
  gap8:{ gap:8 },
  rowSpread:{ flexDirection:"row", alignItems:"center", justifyContent:"space-between" },
  title:{ fontWeight:"900", fontSize:18, color:"#134E48" },
  label:{ marginTop:10, marginBottom:6, fontWeight:"800", color:"#0B3B36" },
  row:{ flexDirection:"row", alignItems:"center", gap:10 },
  chip:{ borderWidth:1, borderColor:"#E6EFEC", borderRadius:999, paddingHorizontal:14, paddingVertical:9, flexDirection:"row", alignItems:"center", gap:6, backgroundColor:"#fff" },
  chipActive:{ backgroundColor:"#134E48", borderColor:"#134E48" },
  chipTxt:{ fontWeight:"800", color:"#374151" },
  chipTxtActive:{ color:"#fff" },
  pill:{ backgroundColor:"#fff", borderWidth:1, borderColor:"#E6EFEC", borderRadius:999, paddingVertical:9, paddingHorizontal:14, flexDirection:"row", alignItems:"center", gap:8 },
  pillTxt:{ fontWeight:"800", color:"#0B3B36" },
  block:{ flex:1, backgroundColor:"#fff", borderRadius:14, padding:12, borderWidth:1, borderColor:"#E6EFEC", flexDirection:"row", gap:8, alignItems:"center" },
  blockTxt:{ fontWeight:"700", color:"#0B3B36" },
  badge:{ backgroundColor:"#F1F6F4", borderRadius:10, paddingVertical:6, paddingHorizontal:10 },
  badgeTxt:{ fontWeight:"900", color:"#0B3B36" },
  footer:{ flexDirection:"row", gap:10, marginTop:6 },
  reset:{ flex:1, borderRadius:14, borderWidth:1, borderColor:"#DCE7E3", backgroundColor:"#fff", alignItems:"center", paddingVertical:12 },
  resetTxt:{ fontWeight:"900", color:"#0F172A" },
  apply:{ flex:1.3, borderRadius:14, backgroundColor:"#134E48", alignItems:"center", paddingVertical:12 },
  applyTxt:{ color:"#fff", fontWeight:"900" },
});