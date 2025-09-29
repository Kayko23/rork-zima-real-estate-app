import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

export default function AdjustSheet({ initial, onConfirm }:{
  initial:{ price:number; currency:string; from?:string; to?:string };
  onConfirm:(v:{ price:number; currency:string; from?:string; to?:string })=>void;
}) {
  const [price, setPrice] = useState(String(initial.price));
  const [currency, setCurrency] = useState(initial.currency);
  const [from, setFrom] = useState(initial.from ?? "");
  const [to, setTo] = useState(initial.to ?? "");
  
  return (
    <View style={s.wrap}>
      <Text style={s.title}>Ajuster l&apos;annonce</Text>
      <View style={s.row}>
        <TextInput style={[s.input,s.flex]} keyboardType="numeric" value={price} onChangeText={setPrice} placeholder="Prix" />
        <TextInput style={[s.input,s.currency]} value={currency} onChangeText={setCurrency} placeholder="Devise" />
      </View>
      <Text style={s.label}>Disponibilité (optionnel)</Text>
      <View style={s.row}>
        <TextInput style={[s.input,s.flex]} value={from} onChangeText={setFrom} placeholder="Du (YYYY-MM-DD)" />
        <TextInput style={[s.input,s.flex]} value={to} onChangeText={setTo} placeholder="Au (YYYY-MM-DD)" />
      </View>
      <Pressable style={s.cta} onPress={()=> onConfirm({ price: Number(price||0), currency, from, to })}>
        <Text style={s.ctaTxt}>Enregistrer</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:{ padding:16, gap:10 }, 
  title:{ fontSize:18, fontWeight:"800" }, 
  row: { flexDirection:"row", gap:10 },
  flex: { flex:1 },
  currency: { width:110 },
  input:{ height:48, borderRadius:12, borderWidth:1, borderColor:"#e5e7eb", paddingHorizontal:12, backgroundColor:"#fff" }, 
  label:{ fontWeight:"700", marginTop:6 },
  cta:{ height:48, backgroundColor:"#064e3b", borderRadius:12, alignItems:"center", justifyContent:"center" }, 
  ctaTxt:{ color:"#fff", fontWeight:"800" }
});