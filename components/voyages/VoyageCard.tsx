import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Heart } from "lucide-react-native";
import { TripItem } from "./helpers";
import { router } from "expo-router";
import { useMoney } from "@/lib/money";
import { useApp } from "@/hooks/useAppStore";

export default function VoyageCard({ item, onPress }:{ item:TripItem; onPress?:()=>void }) {
  const { isFavoriteVoyage, toggleFavoriteVoyage } = useApp();
  const isFav = isFavoriteVoyage(item.id);
  
  const handlePress = () => {
    if (onPress) return onPress();
    router.push(`/trip/${item.id}`);
  };
  
  const handleToggleFavorite = (e: any) => {
    e.stopPropagation();
    toggleFavoriteVoyage(item.id);
  };
  
  const { formatFrom } = useMoney();
  return (
    <TouchableOpacity style={c.card} activeOpacity={0.9} onPress={handlePress} testID={`voyage-card-${item.id}`}>
      <Image source={item.image} style={c.img}/>
      {!!item.badge && <View style={[c.badge, item.badge==="Premium"?{backgroundColor:"#D4AF37"}:item.badge==="Top"?{backgroundColor:"#0EA5A3"}:{backgroundColor:"#0B3B36"}]}> 
        <Text style={c.badgeTxt}>{item.badge}</Text>
      </View>}
      <TouchableOpacity style={c.like} onPress={handleToggleFavorite} activeOpacity={0.8}>
        <Heart size={18} color={isFav ? '#EF4444' : '#fff'} fill={isFav ? '#EF4444' : 'transparent'} strokeWidth={2.5} />
      </TouchableOpacity>

      <View style={c.body}>
        <Text numberOfLines={1} style={c.title}>{item.title}</Text>
        <Text style={c.place}>{item.city}, {item.country}</Text>
        <Text style={c.price}>{formatFrom(item.price, item.currency || 'USD')} <Text style={c.dim}>/ nuit</Text></Text>
        <Text style={c.rating}>★ {item.rating} · {item.reviews} avis</Text>
      </View>
    </TouchableOpacity>
  );
}
const c = StyleSheet.create({
  card:{ width:300, marginRight:14, borderRadius:16, overflow:"hidden", backgroundColor:"#fff" },
  img:{ width:"100%", height:180 },
  like:{ position:"absolute", top:12, right:12, backgroundColor:"rgba(255,255,255,.95)", borderRadius:999, padding:6, shadowColor:"#000", shadowOpacity:0.2, shadowRadius:10, shadowOffset:{width:0, height:3}, elevation:4 },
  badge:{ position:"absolute", left:12, top:12, borderRadius:999, paddingHorizontal:10, paddingVertical:6 },
  badgeTxt:{ color:"#fff", fontWeight:"900", letterSpacing:0.3 },
  body:{ padding:12, gap:4 },
  title:{ fontSize:16, fontWeight:"900", color:"#0B3B36" },
  place:{ color:"#4B635F" },
  price:{ marginTop:2, fontWeight:"900", color:"#0B3B36" },
  dim:{ color:"#4B635F", fontWeight:"600" },
  rating:{ marginTop:2, color:"#0B3B36", fontWeight:"700" },
});