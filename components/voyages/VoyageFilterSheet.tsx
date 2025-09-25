import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { X, Star } from "lucide-react-native";
import type { VoyageFilters } from "./helpers";

export default function VoyageFilterSheet({
  visible, onClose, initial, onSubmit
}:{ visible:boolean; onClose:()=>void; initial?:VoyageFilters; onSubmit:(f:VoyageFilters)=>void }) {
  const [f, setF] = useState<VoyageFilters>(initial || { priceMin:0, priceMax:1000000, ratingMin:0, premiumOnly:false, amenities:[] });

  if (!visible) return null;

  return (
    <View style={m.backdrop} testID="voyage-filter-sheet">
      <Pressable style={m.flex1} onPress={onClose}/>
      <BlurView intensity={40} tint="light" style={m.sheet}>
        <View style={m.header}>
          <Text style={m.title}>Filtres</Text>
          <Pressable onPress={onClose}><X size={22} color="#0B3B36"/></Pressable>
        </View>

        <Text style={m.section}>Prix par nuit</Text>
        <Text style={m.hint}>{f.priceMin} – {f.priceMax} FCFA</Text>

        <View style={m.sliderRow}>
          <Pressable style={[m.pill, m.pillInline]} onPress={()=>setF(prev=>({ ...prev, priceMax: Math.max(10000, (prev.priceMax - 5000)) }))}>
            <Text style={m.pillTxt}>- 5k</Text>
          </Pressable>
          <Pressable style={[m.pill, m.pillInline]} onPress={()=>setF(prev=>({ ...prev, priceMax: Math.min(200000, (prev.priceMax + 5000)) }))}>
            <Text style={m.pillTxt}>+ 5k</Text>
          </Pressable>
        </View>

        <Text style={m.section}>Note minimale</Text>
        <View style={m.row}>
          {[0,3,4,4.5].map(n=> (
            <Pressable key={n} style={[m.pill, f.ratingMin===n && m.pillOn]} onPress={()=>setF({...f, ratingMin:n})}>
              <Star size={14} color={f.ratingMin===n?"#fff":"#0B3B36"}/>
              <Text style={[m.pillTxt, f.ratingMin===n && m.pillOnTxt]}>{n}+</Text>
            </Pressable>
          ))}
        </View>

        <Text style={m.section}>Label</Text>
        <Pressable style={[m.pill, f.premiumOnly && m.pillOn]} onPress={()=>setF({...f, premiumOnly:!f.premiumOnly})}>
          <Text style={[m.pillTxt, f.premiumOnly && m.pillOnTxt]}>Premium uniquement</Text>
        </Pressable>

        <Pressable style={m.cta} onPress={()=>onSubmit(f)}>
          <Text style={m.ctaTxt}>Voir les résultats</Text>
        </Pressable>
      </BlurView>
    </View>
  );
}

const m = StyleSheet.create({
  backdrop:{ position:"absolute", inset:0, backgroundColor:"rgba(0,0,0,.25)", justifyContent:"flex-end" },
  flex1:{ flex:1 },
  sheet:{ borderTopLeftRadius:22, borderTopRightRadius:22, overflow:"hidden", padding:16, backgroundColor:"rgba(255,255,255,.7)" },
  header:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  title:{ fontSize:18, fontWeight:"800", color:"#0B3B36" },
  section:{ marginTop:14, fontWeight:"800", color:"#0B3B36" },
  hint:{ color:"#4B635F", marginBottom:6, marginTop:4 },
  row:{ flexDirection:"row", gap:8, marginTop:6, flexWrap:"wrap" },
  sliderRow:{ flexDirection:"row", gap:8, marginTop:6 },
  pill:{ flexDirection:"row", alignItems:"center", gap:8, paddingVertical:8, paddingHorizontal:12, borderRadius:999, backgroundColor:"#fff", borderWidth:1, borderColor:"#E6EFEC"},
  pillInline:{},
  pillOn:{ backgroundColor:"#0B3B36", borderColor:"#0B3B36" },
  pillOnTxt:{ color:"#fff" },
  pillTxt:{ fontWeight:"700", color:"#0B3B36" },
  cta:{ marginTop:18, backgroundColor:"#134E48", borderRadius:14, alignItems:"center", paddingVertical:12 },
  ctaTxt:{ color:"#fff", fontWeight:"800" }
});