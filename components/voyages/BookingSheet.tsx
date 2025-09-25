import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { X, Calendar, Users } from "lucide-react-native";

export default function BookingSheet({
  visible, onClose, nightlyPrice, onRequest
}:{ visible:boolean; onClose:()=>void; nightlyPrice:number; onRequest:(p:{start:string; end:string; guests:number})=>void }) {
  const [start, setStart] = useState<string|null>(null);
  const [end, setEnd] = useState<string|null>(null);
  const [guests, setGuests] = useState<number>(1);

  if (!visible) return null;

  const can = !!start && !!end;

  return (
    <View style={m.backdrop}>
      <Pressable testID="overlay" style={m.flex} onPress={onClose}/>
      <BlurView intensity={40} tint="light" style={m.sheet}>
        <View style={m.header}>
          <Text style={m.title}>Réserver</Text>
          <Pressable onPress={onClose}><X size={22}/></Pressable>
        </View>

        <Text style={m.label}>Dates</Text>
        <View style={m.row}>
          <Pressable style={m.pill} onPress={()=>setStart(new Date().toISOString().slice(0,10))}>
            <Calendar size={16}/><Text style={m.pillTxt}>{start ?? "Arrivée"}</Text>
          </Pressable>
          <Pressable style={m.pill} onPress={()=>setEnd(new Date(Date.now()+86400000).toISOString().slice(0,10))}>
            <Calendar size={16}/><Text style={m.pillTxt}>{end ?? "Départ"}</Text>
          </Pressable>
        </View>

        <Text style={m.label}>Voyageurs</Text>
        <View style={m.row}>
          <Pressable style={m.pill} onPress={()=>setGuests(Math.max(1, guests-1))}><Text style={m.pillTxt}>-</Text></Pressable>
          <Pressable style={m.pill}><Users size={16}/><Text style={m.pillTxt}>{guests} voyageur(s)</Text></Pressable>
          <Pressable style={m.pill} onPress={()=>setGuests(guests+1)}><Text style={m.pillTxt}>+</Text></Pressable>
        </View>

        {can && (
          <Text style={m.total}>Total estimé: {nightlyPrice.toLocaleString()} FCFA / nuit</Text>
        )}

        <Pressable disabled={!can} style={[m.cta, !can && m.disabled]} onPress={()=>onRequest({ start: start as string, end: end as string, guests })}>
          <Text style={m.ctaTxt}>Demander la réservation</Text>
        </Pressable>
      </BlurView>
    </View>
  );
}

const m = StyleSheet.create({
  backdrop:{ position:"absolute", left:0, right:0, top:0, bottom:0, backgroundColor:"rgba(0,0,0,.25)", justifyContent:"flex-end" },
  flex:{ flex:1 },
  sheet:{ borderTopLeftRadius:22, borderTopRightRadius:22, overflow:"hidden", padding:16, backgroundColor:"rgba(255,255,255,.7)" },
  header:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  title:{ fontSize:18, fontWeight:"900", color:"#0B3B36" },
  label:{ marginTop:12, fontWeight:"800", color:"#0B3B36" },
  row:{ flexDirection:"row", gap:10, marginTop:8 },
  pill:{ backgroundColor:"#fff", borderWidth:1, borderColor:"#E6EFEC", borderRadius:999, paddingVertical:10, paddingHorizontal:14, flexDirection:"row", alignItems:"center", gap:8 },
  pillTxt:{ fontWeight:"800", color:"#0B3B36" },
  total:{ marginTop:10, fontWeight:"800", color:"#0B3B36" },
  cta:{ marginTop:16, backgroundColor:"#134E48", borderRadius:14, alignItems:"center", paddingVertical:12 },
  ctaTxt:{ color:"#fff", fontWeight:"900" },
  disabled:{ opacity:.5 }
});
