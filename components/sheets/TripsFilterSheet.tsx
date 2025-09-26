import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { X, Filter, Star, Users, Calendar } from "lucide-react-native";
import BottomSheet from "@/components/ui/BottomSheet";
import RangeSlider from "@/components/ui/RangeSlider";
import AmenitiesChips, { AmenityKey } from "@/components/voyages/AmenitiesChips";
import { useVoyageFilters, type VoyageFilters } from "@/components/voyages/filterContext";
import { defaultPriceRangeForCountry } from "@/components/voyages/pricingDefaults";
import { fetchTripsCount } from "@/lib/tripsApi";
import { formatPrice } from "@/components/voyages/currency";

type Props = { visible: boolean; onClose: () => void };

export default function TripsFilterSheet({ visible, onClose }: Props) {
  const { q, set, reset, currency, listPresets, presets, saveNamedPreset, applyPreset, deletePreset, savePreset, hydrate } = useVoyageFilters();
  const [local, setLocal] = useState<VoyageFilters>(q);
  const [count, setCount] = useState<number | undefined>(undefined);
  const [loadingCount, setLoadingCount] = useState<boolean>(false);

  useEffect(()=>{ if (visible) { hydrate(); listPresets(); setLocal(q); setCount(undefined); } }, [visible, hydrate, listPresets, q]);

  const baseRange = useMemo(()=> defaultPriceRangeForCountry(local.destination?.country), [local.destination?.country]);
  const minVal = local.priceMin ?? baseRange.min;
  const maxVal = local.priceMax ?? baseRange.max;

  useEffect(()=>{
    if (!visible) return;
    const timer = setTimeout(async ()=>{
      try {
        setLoadingCount(true);
        const next = await fetchTripsCount(local);
        setCount(next);
      } catch(e){
        setCount(undefined);
      } finally {
        setLoadingCount(false);
      }
    }, 350);
    return ()=> clearTimeout(timer);
  }, [local, visible]);

  const apply = async () => {
    set(local);
    await savePreset();
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={m.header}>
        <View style={m.headRow}>
          <Filter size={18} color="#134E48" />
          <Text style={m.title}>Filtres</Text>
        </View>
        <Pressable onPress={async ()=>{
          const name = buildPresetName(local);
          await saveNamedPreset(name);
        }} testID="save-preset"><Text style={m.saveTxt}>Enregistrer</Text></Pressable>
        <Pressable onPress={onClose}><X size={22} color="#1F2937" /></Pressable>
      </View>

      {presets.length>0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={m.presetsRow}>
          {presets.map(p=> (
            <Pressable key={p.id} style={m.presetChip} onPress={()=>applyPreset(p.id)} onLongPress={()=>deletePreset(p.id)} testID={`preset-${p.id}`}>
              <Text style={m.presetTxt} numberOfLines={1}>{p.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <ScrollView contentContainerStyle={m.scrollPad} showsVerticalScrollIndicator={false}>
        <Text style={m.label}>Voyageurs</Text>
        <View style={m.row}>
          <Pressable style={m.pill} onPress={()=>setLocal((p: VoyageFilters)=>({ ...p, guests: Math.max(1, (p.guests ?? 1) - 1) }))}><Text style={m.pillTxt}>−</Text></Pressable>
          <Pressable style={m.pill}><Users size={16}/><Text style={m.pillTxt}>{local.guests ?? 1}</Text></Pressable>
          <Pressable style={m.pill} onPress={()=>setLocal((p: VoyageFilters)=>({ ...p, guests: (p.guests ?? 1) + 1 }))}><Text style={m.pillTxt}>+</Text></Pressable>
        </View>

        <Text style={m.label}>Dates</Text>
        <View style={m.row}>
          <Pressable style={m.block}><Calendar size={16} color="#134E48" /><Text style={m.blockTxt}>{(local as any).start || "Arrivée"}</Text></Pressable>
          <Pressable style={m.block}><Calendar size={16} color="#134E48" /><Text style={m.blockTxt}>{(local as any).end || "Départ"}</Text></Pressable>
        </View>

        <Text style={m.label}>Prix par nuit</Text>
        <View style={m.gap8}>
          <RangeSlider
            min={baseRange.min}
            max={baseRange.max}
            value={[minVal, maxVal]}
            onChange={([a,b])=> setLocal({ ...local, priceMin: a, priceMax: b })}
          />
          <View style={m.rowSpread}>
            <View style={m.badge}><Text style={m.badgeTxt}>{formatPrice(minVal, currency)}</Text></View>
            <View style={m.badge}><Text style={m.badgeTxt}>{formatPrice(maxVal, currency)}</Text></View>
          </View>
        </View>

        <Text style={m.label}>Note minimale</Text>
        <View style={m.row}>
          {[3,3.5,4,4.5,5].map((r)=> (
            <Pressable key={String(r)} onPress={()=>setLocal({ ...local, ratingMin: r as any })}
              style={[m.chip, (local as any).ratingMin===r && m.chipActive]}>
              <Star size={14} color={(local as any).ratingMin===r ? "#fff" : "#374151"} />
              <Text style={[m.chipTxt, (local as any).ratingMin===r && m.chipTxtActive]}> {r}+</Text>
            </Pressable>
          ))}
        </View>

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
        <Pressable onPress={()=>{ reset(); setLocal(q); setCount(undefined); }} style={m.reset} testID="filters-reset">
          <Text style={m.resetTxt}>Réinitialiser</Text>
        </Pressable>
        <Pressable onPress={apply} style={[m.apply, (count===0) && {opacity:.5}]} testID="filters-apply" disabled={count===0 && !loadingCount}>
          <Text style={m.applyTxt}>{loadingCount?"Calcul...":`Voir les résultats${count!=null?` (${count})`:""}`}</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

function buildPresetName(q: VoyageFilters): string {
  const city = q.destination?.city || q.destination?.country || "Preset";
  const d = new Date();
  const t = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  return `${city} ${t}`;
}

const m = StyleSheet.create({
  header:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:6 },
  headRow:{ flexDirection:"row", alignItems:"center", gap:8 },
  saveTxt:{ color:"#1F2937", fontWeight:"700", marginRight:12 },
  presetsRow:{ paddingHorizontal:16, paddingBottom:6, gap:8 },
  presetChip:{ backgroundColor:"#F1F5F9", paddingHorizontal:12, paddingVertical:8, borderRadius:999, marginRight:8 },
  presetTxt:{ fontWeight:"700", color:"#0F172A", maxWidth:160 },
  scrollPad:{ paddingBottom:8, paddingHorizontal:16 },
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
  footer:{ flexDirection:"row", gap:10, marginTop:6, paddingHorizontal:16, marginBottom:6 },
  reset:{ flex:1, borderRadius:14, borderWidth:1, borderColor:"#DCE7E3", backgroundColor:"#fff", alignItems:"center", paddingVertical:12 },
  resetTxt:{ fontWeight:"900", color:"#0F172A" },
  apply:{ flex:1.3, borderRadius:14, backgroundColor:"#134E48", alignItems:"center", paddingVertical:12 },
  applyTxt:{ color:"#fff", fontWeight:"900" },
});