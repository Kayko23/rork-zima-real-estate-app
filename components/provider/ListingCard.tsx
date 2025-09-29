import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Star, Eye, Users, Heart, Pencil, Pause, Rocket, Trash2, TrendingUp } from "lucide-react-native";
import { Listing } from "@/services/annonces.api";
import { router } from "expo-router";

export default function ListingCard({ item }: { item: Listing }) {
  const photo = item.photos?.[0];

  return (
    <View style={s.card}>
      <View style={s.imageWrap}>
        <Image source={{ uri: photo }} style={s.image} />
        {item.premium && <View style={s.premium}><Text style={s.premiumTxt}>Premium</Text></View>}
        <View style={s.badges}>
          <Text style={s.tag}>
            {item.type === "sale" ? "À VENDRE" : 
             item.rentPeriod === "daily" ? "LOCATION JOUR" : "LOCATION MOIS"}
          </Text>
        </View>
        <Pressable style={s.fav}><Heart color="#fff" /></Pressable>
      </View>

      <View style={s.info}>
        <Text style={s.title} numberOfLines={1}>{item.title}</Text>
        <Text style={s.price}>
          {Intl.NumberFormat("fr-FR").format(item.price)} {item.currency}
          {item.type === "rent" && item.rentPeriod && (
            <Text style={s.period}> / {item.rentPeriod === "monthly" ? "mois" : "jour"}</Text>
          )}
        </Text>
        <View style={s.meta}>
          <Text>🛏 {item.beds ?? 0}</Text>
          <Text>🛁 {item.baths ?? 0}</Text>
          <Text>📐 {item.surface ?? 0}m²</Text>
        </View>
      </View>

      <View style={s.stats}>
        <View style={s.stat}><Eye size={16} /><Text> {item.views ?? 1250} vues</Text></View>
        <View style={s.stat}><Users size={16} /><Text> {item.contacts ?? 0} contacts</Text></View>
        {item.rating && <View style={s.stat}><Star size={16} color="#f59e0b"/><Text> {item.rating}</Text></View>}
        <View style={[s.status, statusStyle[item.status]]}><Text style={s.statusTxt}>{labelStatus[item.status]}</Text></View>
      </View>

      {/* barre d'actions */}
      <View style={s.actions}>
        <Pill icon={<Pencil size={16}/>} label="Modifier" onPress={() => router.push(`/provider/annonces/${item.id}/edit`)} />
        <Pill icon={<TrendingUp size={16} color="#b45309"/>} label="Ajuster" onPress={() => router.push(`/provider/annonces/${item.id}/adjust`)} />
        <Pill icon={<Pause size={16}/>} label={item.status==="active" ? "Pause" : "Reprendre"} onPress={() => router.push(`/provider/annonces/${item.id}/pause`)} />
        <Pill icon={<Rocket size={16} color="#065f46"/>} label="Boost" onPress={() => router.push(`/provider/annonces/${item.id}/boost`)} />
        <Pill danger icon={<Trash2 size={16} color="#b91c1c"/>} label="Supprimer" onPress={() => router.push(`/provider/annonces/${item.id}/delete`)} />
      </View>
    </View>
  );
}

function Pill({ icon, label, danger, onPress }:{icon:any; label:string; danger?:boolean; onPress:()=>void}) {
  return (
    <Pressable onPress={onPress} style={[s.pill, danger && s.pillDanger]}>
      <View>{icon}</View>
      <Text style={[s.pillTxt, danger && s.pillTxtDanger]}>{label}</Text>
    </Pressable>
  );
}

const labelStatus = { active:"Actif", pending:"En attente", expired:"Expiré" } as const;
const statusStyle = StyleSheet.create({
  active:{ backgroundColor:"#ecfdf5", borderColor:"#a7f3d0" },
  pending:{ backgroundColor:"#fff7ed", borderColor:"#fed7aa" },
  expired:{ backgroundColor:"#fef2f2", borderColor:"#fecaca" },
});

const s = StyleSheet.create({
  card:{ borderRadius:20, overflow:"hidden", backgroundColor:"#fff", marginHorizontal:16, marginBottom:18 },
  imageWrap:{ height:240, position:"relative" },
  image:{ width:"100%", height:"100%" },
  premium:{ position:"absolute", top:14, right:14, backgroundColor:"#b45309", paddingHorizontal:10, paddingVertical:6, borderRadius:999 },
  premiumTxt:{ color:"#fff", fontWeight:"700" },
  badges:{ position:"absolute", left:14, top:14 },
  tag:{ color:"#fff", backgroundColor:"#111827", paddingHorizontal:10, paddingVertical:6, borderRadius:999, fontWeight:"700" },
  fav:{ position:"absolute", right:14, bottom:14, width:40, height:40, borderRadius:20, backgroundColor:"#0008", justifyContent:"center", alignItems:"center" },
  info:{ padding:14, gap:6 },
  title:{ fontSize:18, fontWeight:"800" },
  price:{ fontWeight:"800" },
  period:{ fontWeight:"600", color:"#6b7280" },
  meta:{ flexDirection:"row", gap:14, color:"#6b7280" },
  stats:{ flexDirection:"row", flexWrap:"wrap", gap:10, paddingHorizontal:14, paddingBottom:6, alignItems:"center" },
  stat:{ flexDirection:"row", alignItems:"center", gap:4 },
  status:{ marginLeft:"auto", paddingHorizontal:10, paddingVertical:4, borderRadius:999, borderWidth:1 },
  statusTxt:{ fontWeight:"700" },
  actions:{ flexDirection:"row", flexWrap:"wrap", gap:10, padding:14 },
  pill:{ flexDirection:"row", alignItems:"center", gap:8, backgroundColor:"#F3F4F6", borderRadius:14, paddingHorizontal:14, paddingVertical:10 },
  pillDanger:{ backgroundColor:"#FEF2F2" },
  pillTxt:{ fontWeight:"700" },
  pillTxtDanger:{ color:"#b91c1c", fontWeight:"800" },
});