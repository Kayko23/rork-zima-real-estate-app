import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Heart } from "lucide-react-native";
import type { Hotel } from "@/lib/hotels-api";

export function VoyageCard({ item, onPress }: { item: Hotel; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={c.card} testID={`voyage.card.${item.id}`}>
      <Image source={{ uri: item.image }} style={c.img} />
      {item.badge ? <View style={c.badge}><Text style={c.badgeTxt}>{item.badge}</Text></View> : null}
      <Pressable style={c.like}><Heart size={18} color="#fff" /></Pressable>

      <View style={c.body}>
        <Text numberOfLines={2} style={c.title}>{item.title}</Text>
        <Text style={c.sub}>{item.city}, {item.country}</Text>
        <Text style={c.price}>{item.price_per_night.toLocaleString()} FCFA <Text style={c.night}>/ nuit</Text></Text>
        <Text style={c.rating}>★ {item.rating.toFixed(1)} · {item.reviews} avis</Text>
      </View>
    </Pressable>
  );
}

export function VoyageCardSkeleton() {
  return (
    <View style={[c.card, c.skeletonCard]}>
      <View style={[c.img, c.skelBlock]} />
      <View style={c.skelBody}>
        <View style={[c.skelLine, c.skelLineWide]} />
        <View style={[c.skelLine, c.skelLineMid]} />
        <View style={[c.skelLine, c.skelLineSmall]} />
      </View>
    </View>
  );
}

const c = StyleSheet.create({
  card: { width: 320, borderRadius: 18, overflow: "hidden", backgroundColor: "#fff", marginRight: 12 },
  img: { width: "100%", height: 180 },
  body: { padding: 10, gap: 2 },
  title: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  sub: { color: "#475569", marginBottom: 2 },
  price: { fontWeight: "900", color: "#0F172A" },
  night: { fontWeight: "500", color: "#334155" },
  rating: { color: "#334155", marginTop: 6, fontWeight: "600" },
  badge: { position: "absolute", top: 10, left: 10, backgroundColor: "#0EA5A7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  badgeTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },
  like: { position: "absolute", top: 10, right: 10, backgroundColor: "rgba(0,0,0,0.35)", padding: 6, borderRadius: 999 },
  skeletonCard: { backgroundColor: "#F3F4F6" },
  skelBlock: { backgroundColor: "#E5E7EB" },
  skelBody: { padding: 10, gap: 6 },
  skelLine: { height: 14, backgroundColor: "#E5E7EB", borderRadius: 6 },
  skelLineWide: { width: "80%" },
  skelLineMid: { width: "60%" },
  skelLineSmall: { width: "40%" },
});