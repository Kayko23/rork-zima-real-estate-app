import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Phone, MessageCircle, Wallet } from "lucide-react-native";
import { BlurView } from "expo-blur";

export default function BookingBar({
  price, onContact, onWhatsApp, onCall
}:{ price:number; onContact:()=>void; onWhatsApp:()=>void; onCall:()=>void }) {
  return (
    <BlurView intensity={26} tint="light" style={s.wrap}>
      <Text style={s.price}>{price.toLocaleString()} FCFA</Text>
      <View style={s.actions}>
        <TouchableOpacity testID="call" style={s.ghost} onPress={onCall}><Phone size={18}/></TouchableOpacity>
        <TouchableOpacity testID="whatsapp" style={s.ghost} onPress={onWhatsApp}><MessageCircle size={18}/></TouchableOpacity>
        <TouchableOpacity testID="contact" style={s.cta} onPress={onContact}>
          <Wallet size={18} color="#fff"/><Text style={s.ctaTxt}>Contacter</Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
}
const s = StyleSheet.create({
  wrap:{ position:"absolute", left:12, right:12, bottom:12, borderRadius:18, padding:12, backgroundColor:"rgba(255,255,255,.7)", flexDirection:"row", alignItems:"center", justifyContent:"space-between", gap:10 },
  price:{ fontWeight:"900", color:"#0B3B36", fontSize:16 },
  actions:{ flexDirection:"row", alignItems:"center", gap:10 },
  ghost:{ backgroundColor:"#fff", borderWidth:1, borderColor:"#DCEAE6", paddingVertical:10, paddingHorizontal:12, borderRadius:12 },
  cta:{ backgroundColor:"#134E48", flexDirection:"row", alignItems:"center", gap:8, paddingVertical:10, paddingHorizontal:14, borderRadius:12 },
  ctaTxt:{ color:"#fff", fontWeight:"900" }
});
