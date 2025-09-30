import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MapPin, Phone, MessageCircle, Mail, Star, Heart } from "lucide-react-native";
import { useApp } from "@/hooks/useAppStore";

export type Provider = {
  id: string;
  name: string;
  avatar?: string;
  cover?: string;
  city: string;
  country: string;
  rating: number;
  reviews: number;
  listings: number;
  badges?: ("premium" | "verified")[];
  tags?: string[]; // ex: ["Résidentiel","Luxe","Commercial"]
  category: "agent" | "property_manager" | "agency" | "hotel_booking" | "short_stay" | "event_space";
};

type Props = {
  item: Provider;
  onPressProfile?: (p: Provider) => void;
  onPressCall?: (p: Provider) => void;
  onPressWhatsApp?: (p: Provider) => void;
  onPressMail?: (p: Provider) => void;
};

export default function ProviderCard({ item, onPressProfile, onPressCall, onPressWhatsApp, onPressMail }: Props) {
  const { isFavoriteProvider, toggleFavoriteProvider } = useApp();
  const isFav = isFavoriteProvider(item.id);
  
  return (
    <View style={s.card}>
      <View style={s.coverWrap}>
        <Image source={{ uri: item.cover || "https://picsum.photos/640/360" }} style={s.cover} />
        <Image source={{ uri: item.avatar || "https://i.pravatar.cc/100" }} style={s.avatar} />
        
        {/* Badges */}
        {(item.badges?.includes("premium") || item.badges?.includes("verified")) && (
          <View style={s.badgesWrap}>
            {item.badges?.includes("premium") && (
              <View style={[s.badge, { backgroundColor: "#B18A42" }]}>
                <Text style={s.badgeText}>Premium</Text>
              </View>
            )}
            {item.badges?.includes("verified") && (
              <View style={[s.badge, { backgroundColor: "#5A46FF" }]}>
                <Text style={s.badgeText}>Vérifié</Text>
              </View>
            )}
          </View>
        )}
        
        <TouchableOpacity 
          style={s.favoriteButton} 
          onPress={() => toggleFavoriteProvider(item.id)}
          activeOpacity={0.8}
        >
          <Heart 
            size={18} 
            color={isFav ? '#EF4444' : '#fff'}
            fill={isFav ? '#EF4444' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <View style={s.content}>
        <Text style={s.name} numberOfLines={1}>{item.name}</Text>

        <View style={s.row}>
          <View style={s.row}>
            <Star size={16} color="#EAB308" fill="#EAB308" />
            <Text style={s.rating}>{item.rating.toFixed(1)}</Text>
            <Text style={s.muted}> ({item.reviews} avis)</Text>
            <Text style={s.muted}> • {item.listings} annonces</Text>
          </View>
        </View>

        <View style={[s.row, s.locationRow]}>
          <MapPin size={16} color="#0E5A46" />
          <Text style={s.location}>{item.city}, {item.country}</Text>
        </View>

        {!!item.tags?.length && (
          <View style={s.tagsWrap}>
            {item.tags.slice(0, 3).map((t) => (
              <View key={t} style={s.tag}><Text style={s.tagTxt}>{t}</Text></View>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity style={s.cta} activeOpacity={0.8} onPress={() => onPressProfile?.(item)}>
        <Text style={s.ctaTxt}>Voir profil</Text>
      </TouchableOpacity>

      <View style={s.actions}>
        <TouchableOpacity style={s.action} onPress={() => onPressCall?.(item)}>
          <Phone size={18} color="#0E5A46" />
        </TouchableOpacity>
        <TouchableOpacity style={s.action} onPress={() => onPressWhatsApp?.(item)}>
          <MessageCircle size={18} color="#0E5A46" />
        </TouchableOpacity>
        <TouchableOpacity style={s.action} onPress={() => onPressMail?.(item)}>
          <Mail size={18} color="#0E5A46" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    width: 300,
    borderRadius: 22,
    backgroundColor: "#fff",
    marginRight: 14,
    shadowColor: "#0E5A46",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  coverWrap: { 
    borderTopLeftRadius: 22, 
    borderTopRightRadius: 22, 
    overflow: "hidden",
    position: "relative",
  },
  cover: { width: "100%", height: 150 },
  avatar: {
    width: 54, height: 54, borderRadius: 27, position: "absolute", left: 14, bottom: -27,
    borderWidth: 3, borderColor: "#fff",
  },
  badgesWrap: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  favoriteButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  name: { fontSize: 18, fontWeight: "700", color: "#0F172A", paddingLeft: 64, marginTop: 8 },
  row: { flexDirection: "row", alignItems: "center" },
  rating: { fontWeight: "700", marginLeft: 4, color: "#111827" },
  muted: { color: "#6B7280", marginLeft: 4 },
  location: { marginLeft: 6, color: "#334155", fontWeight: "600" },
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8, marginBottom: 6 },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "#E9F5F1" },
  tagTxt: { color: "#0E5A46", fontWeight: "600", fontSize: 12 },
  cta: {
    marginHorizontal: 14, marginTop: 8, height: 44, borderRadius: 999,
    borderColor: "#0E5A46", borderWidth: 1.5, alignItems: "center", justifyContent: "center",
  },
  ctaTxt: { color: "#0E5A46", fontWeight: "800", fontSize: 16 },
  actions: { flexDirection: "row", justifyContent: "space-around", padding: 14, paddingTop: 10 },
  content: {
    paddingHorizontal: 14,
    paddingTop: 6,
  },
  locationRow: {
    marginTop: 6,
  },
  action: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: "#F2F7F5",
    alignItems: "center", justifyContent: "center",
  },
});