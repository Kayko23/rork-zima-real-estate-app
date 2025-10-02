import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Heart, Star, Bath, BedDouble, Ruler } from "lucide-react-native";
import { colors, radius, shadow } from "@/theme/tokens";
import { formatPrice } from "@/lib/format";
import { useRouter } from "expo-router";

export type Property = {
  id: string;
  title: string; city: string; country?: string;
  price: number; currency?: string;
  beds?: number; baths?: number; area?: number;
  rating?: number; photos: string[];
  badge?: "À VENDRE" | "À LOUER" | "Premium";
};

export default function PropertyCard({ item }: { item: Property }) {
  const [fav, setFav] = React.useState<boolean>(false);
  const router = useRouter();
  const go = () => router.push({ pathname: "/property/[id]", params: { id: item.id }} as any);

  return (
    <Pressable onPress={go} style={({pressed})=>[styles.card, pressed && { transform:[{scale:.995}] }]} testID={`property-card-${item.id}`}>
      <Image source={{ uri: item.photos[0] }} style={styles.img} />
      <View style={styles.overlay} />
      <View style={styles.badges}>
        {item.badge && (
          <View style={styles.badge}><Text style={styles.badgeTxt}>{item.badge}</Text></View>
        )}
        <Pressable onPress={() => setFav(v => !v)} style={styles.heart} hitSlop={10} accessibilityLabel="Ajouter aux favoris">
          <Heart size={20} color={fav ? "#fff" : "#fff"} fill={fav ? "#EC4899" : "transparent"} />
        </Pressable>
      </View>
      <View style={styles.bottom}>
        <Text numberOfLines={1} style={styles.title}>{item.title} • {item.city}</Text>
        <View style={styles.pricePill}><Text style={styles.price}>{formatPrice(item.price, item.currency)}</Text></View>
        <View style={styles.meta}>
          <View style={styles.metaItem}><BedDouble size={16} color="#fff" /><Text style={styles.metaTxt}>{item.beds ?? "-"}</Text></View>
          <View style={styles.metaItem}><Bath size={16} color="#fff" /><Text style={styles.metaTxt}>{item.baths ?? "-"}</Text></View>
          <View style={styles.metaItem}><Ruler size={16} color="#fff" /><Text style={styles.metaTxt}>{item.area ?? "-"} m²</Text></View>
          <View style={[styles.metaItem,{marginLeft:"auto"}]}><Star size={16} color="#FFD166" /><Text style={styles.metaTxt}>{item.rating ?? "—"}</Text></View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card:{ borderRadius: radius.lg, overflow:"hidden", backgroundColor: colors.panel, ...(shadow.card as any) },
  img:{ width:"100%", height:260 },
  overlay:{ ...StyleSheet.absoluteFillObject, backgroundColor: colors.cardOverlay },
  badges:{ position:"absolute", top:12, left:12, right:12, flexDirection:"row", alignItems:"center" },
  badge:{ backgroundColor:"rgba(17,24,39,.85)", paddingHorizontal:12, paddingVertical:6, borderRadius:999 },
  badgeTxt:{ color:"#fff", fontWeight:"700" },
  heart:{ marginLeft:"auto", height:36, width:36, borderRadius:18, alignItems:"center", justifyContent:"center",
          backgroundColor:"rgba(0,0,0,.35)" },
  bottom:{ position:"absolute", left:12, right:12, bottom:12 },
  title:{ color:"#fff", fontSize:18, fontWeight:"700", marginBottom:8 },
  pricePill:{ alignSelf:"flex-start", backgroundColor:"rgba(255,255,255,.9)", paddingHorizontal:14, paddingVertical:8, borderRadius:999 },
  price:{ color: colors.chip, fontWeight:"800", letterSpacing:0.2 },
  meta:{ flexDirection:"row", alignItems:"center", gap:14, marginTop:10 },
  metaItem:{ flexDirection:"row", alignItems:"center", gap:6, paddingHorizontal:10, paddingVertical:6, backgroundColor:"rgba(17,24,39,.35)", borderRadius:999 },
  metaTxt:{ color:"#fff", fontWeight:"600" },
});
