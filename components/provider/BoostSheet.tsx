import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const plans = [
  { id:"p7",  label:"Boost 7 jours",  days:7,  price:5000 },
  { id:"p14", label:"Boost 14 jours", days:14, price:9000 },
  { id:"p30", label:"Boost 30 jours", days:30, price:18000 },
];

export default function BoostSheet({ onConfirm }:{ onConfirm:(plan:{days:7|14|30; price:number})=>void }) {
  const [sel, setSel] = useState(plans[0]);
  
  return (
    <View style={s.container}>
      <Text style={s.title}>Booster l&apos;annonce</Text>
      {plans.map(p => (
        <Pressable key={p.id} onPress={()=> setSel(p)} style={[s.row, sel.id===p.id && s.rowActive]}>
          <Text style={s.rowTxt}>{p.label}</Text>
          <Text style={s.rowTxt}>{Intl.NumberFormat("fr-FR").format(p.price)} FCFA</Text>
        </Pressable>
      ))}
      <Pressable style={s.cta} onPress={()=> onConfirm(sel as any)}>
        <Text style={s.ctaTxt}>Payer & Activer</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { padding:16, gap:10 },
  title: { fontSize:18, fontWeight:"800" },
  row:{ height:56, borderRadius:12, borderWidth:1, borderColor:"#e5e7eb", backgroundColor:"#fff", paddingHorizontal:12, flexDirection:"row", alignItems:"center", justifyContent:"space-between" },
  rowActive:{ borderColor:"#065f46" },
  rowTxt:{ fontWeight:"700" },
  cta:{ height:48, backgroundColor:"#065f46", borderRadius:12, alignItems:"center", justifyContent:"center" },
  ctaTxt:{ color:"#fff", fontWeight:"800" },
});