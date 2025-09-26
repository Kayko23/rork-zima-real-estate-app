import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { X, Calendar, Users, MapPin } from "lucide-react-native";
import { VoyageQuery, Option } from "./helpers";
import { BlurView } from "expo-blur";
import { getCities, getCountries } from "./worlddata"; // fourni ci-dessous
import { useVoyageFilters } from "@/components/voyages/filterContext";

export default function VoyageSearchSheet({
  visible, onClose, initial, onSubmit
}:{ visible:boolean; onClose:()=>void; initial?:VoyageQuery; onSubmit:(q:VoyageQuery)=>void }) {
  const [q, setQ] = useState<VoyageQuery>(initial || { type:"all" });
  const [kw, setKw] = useState("");
  const { setCountry, set } = useVoyageFilters();

  if (!visible) return null;

  const countries = getCountries(kw);
  const cities = getCities(q.country?.value, kw);

  return (
    <View style={m.backdrop} testID="voyage-search-sheet">
      <Pressable style={{flex:1}} onPress={onClose}/>
      <BlurView intensity={40} tint="light" style={m.sheet}>
        <View style={m.header}>
          <Text style={m.title}>Où voulez-vous aller ?</Text>
          <Pressable onPress={onClose}><X size={22} color="#0B3B36"/></Pressable>
        </View>

        <Text style={m.label}>Destination</Text>
        <View style={m.inputRow}>
          <MapPin size={18} color="#134E48"/>
          <TextInput
            placeholder="Rechercher pays ou ville"
            value={kw}
            onChangeText={setKw}
            style={m.input}
          />
        </View>

        <FlatList
          data={q.country ? cities : countries}
          keyExtractor={(it)=>it.value}
          style={{maxHeight:220, marginTop:8}}
          keyboardShouldPersistTaps="handled"
          renderItem={({item})=>(
            <TouchableOpacity
              style={m.item}
              onPress={()=> {
                if (!q.country) {
                  setQ({...q, country:item as Option, city:null});
                  setCountry((item as Option).label);
                } else {
                  setQ({...q, city:item as Option});
                  set({ destination: { country: q.country?.label, city: (item as Option).label } });
                }
              }}>
              <Text style={m.itemTxt}>{item.label}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={{padding:12,color:"#667"}}>Aucun résultat…</Text>}
        />

        <Text style={[m.label,{marginTop:14}]}>Dates</Text>
        <View style={m.rowPills}>
          <Pressable style={m.pill}
            onPress={()=>setQ({...q, startDate:new Date().toISOString().slice(0,10)})}>
            <Calendar size={16}/><Text style={m.pillTxt}>{q.startDate ?? "Arrivée"}</Text>
          </Pressable>
          <Pressable style={m.pill}
            onPress={()=>setQ({...q, endDate:new Date(Date.now()+86400000).toISOString().slice(0,10)})}>
            <Calendar size={16}/><Text style={m.pillTxt}>{q.endDate ?? "Départ"}</Text>
          </Pressable>
        </View>

        <Text style={[m.label,{marginTop:14}]}>Voyageurs</Text>
        <View style={m.rowPills}>
          <Pressable style={m.pill}
            onPress={()=>setQ({...q, guests: Math.max(1,(q.guests??1)+1)})}>
            <Users size={16}/><Text style={m.pillTxt}>{q.guests ?? 1} voyageur(s)</Text>
          </Pressable>
          <Pressable style={[m.pill,{backgroundColor:"#0B3B36"}]} onPress={()=>{ onSubmit(q); onClose(); }}>
            <Text style={[m.pillTxt,{color:"#fff", fontWeight:"800"}]}>Rechercher</Text>
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
}
const m = StyleSheet.create({
  backdrop:{ position:"absolute", inset:0, backgroundColor:"rgba(0,0,0,.25)", justifyContent:"flex-end" },
  sheet:{ borderTopLeftRadius:22, borderTopRightRadius:22, overflow:"hidden", padding:16, backgroundColor:"rgba(255,255,255,.7)" },
  header:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:8 },
  title:{ fontSize:18, fontWeight:"800", color:"#0B3B36" },
  label:{ fontWeight:"700", color:"#0B3B36", marginTop:6 },
  inputRow:{ flexDirection:"row", alignItems:"center", gap:8, borderWidth:1, borderColor:"#E6EFEC", backgroundColor:"#fff", borderRadius:12, paddingHorizontal:10, height:46, marginTop:6 },
  input:{ flex:1, fontSize:16 },
  item:{ paddingVertical:10, paddingHorizontal:8, borderBottomWidth:1, borderColor:"#EEF3F1" },
  itemTxt:{ fontSize:15, color:"#0B3B36" },
  rowPills:{ flexDirection:"row", gap:10, marginTop:8, flexWrap:"wrap" },
  pill:{ flexDirection:"row", alignItems:"center", gap:6, paddingVertical:10, paddingHorizontal:14, borderRadius:999, backgroundColor:"#fff", borderWidth:1, borderColor:"#E6EFEC" },
  pillTxt:{ fontWeight:"700", color:"#0B3B36" },
});