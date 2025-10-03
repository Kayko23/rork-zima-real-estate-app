import React from "react";
import { View, Text, Image, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { Phone, Mail, Star } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";

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
  tags?: string[];
  category: "agent" | "property_manager" | "agency" | "hotel_booking" | "short_stay" | "event_space";
  email?: string;
  phone?: string;
  whatsapp?: string;
};

type Props = {
  item: Provider;
  onPressProfile?: (id: string) => void;
  onPressCall?: (phone?: string) => void;
  onPressWhatsApp?: (whatsapp?: string) => void;
  onPressMail?: (email?: string) => void;
};

export default function ProfessionalCard({ item, onPressProfile, onPressCall, onPressWhatsApp, onPressMail }: Props) {
  const { width } = useWindowDimensions();
  const CARD_GAP = 12;
  const sidePadding = 16;
  const cardWidth = (width - sidePadding * 2 - CARD_GAP) / 2;
  const isHorizontal = false;

  return (
    <View style={[s.card, isHorizontal ? { width: 248 } : { width: cardWidth }]}>
      <View style={s.header}>
        <Image
          source={{ uri: item.avatar || "https://i.pravatar.cc/150" }}
          style={s.avatar}
        />
        {item.badges?.includes("premium") && (
          <View style={s.premium}>
            <Text style={s.premiumText}>Premium</Text>
          </View>
        )}
      </View>

      <Text style={s.name} numberOfLines={1}>{item.name}</Text>
      <Text style={s.location} numberOfLines={1}>
        {item.city}, {item.country}
      </Text>

      <View style={s.meta}>
        <Star size={14} color="#F5A524" fill="#F5A524" />
        <Text style={s.rating}>{item.rating.toFixed(1)}</Text>
      </View>

      {!!item.tags?.length && (
        <View style={s.tagsWrap}>
          {item.tags.slice(0, 2).map((tag) => (
            <View key={tag} style={s.tag}>
              <Text style={s.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={s.footer}>
        <View style={s.actions}>
          <Pressable
            onPress={() => onPressMail?.(item.email)}
            style={s.iconBtn}
            accessibilityLabel="Envoyer un email"
          >
            <Mail size={18} color="#0E4D3A" />
          </Pressable>
          <Pressable
            onPress={() => onPressCall?.(item.phone)}
            style={s.iconBtn}
            accessibilityLabel="Appeler"
          >
            <Phone size={18} color="#0E4D3A" />
          </Pressable>
          <Pressable
            onPress={() => onPressWhatsApp?.(item.whatsapp)}
            style={s.iconBtn}
            accessibilityLabel="WhatsApp"
          >
            <Ionicons name="logo-whatsapp" size={18} color="#0E4D3A" />
          </Pressable>
        </View>

        <Pressable
          onPress={() => onPressProfile?.(item.id)}
          style={({ pressed }) => [s.cta, pressed && { opacity: 0.9 }]}
          accessibilityLabel={`Voir le profil de ${item.name}`}
        >
          <Text style={s.ctaText}>Voir profil</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    minHeight: 250,
  },
  header: { alignItems: "center", justifyContent: "center" },
  avatar: { width: "100%", height: 90, borderRadius: 12, backgroundColor: "#E9EFEA" },
  premium: {
    position: "absolute",
    left: 8,
    top: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#0E4D3A",
    borderRadius: 999,
  },
  premiumText: { color: "white", fontWeight: "700", fontSize: 12 },
  name: { marginTop: 10, fontWeight: "700", fontSize: 16, color: "#1E1F1E" },
  location: { marginTop: 2, color: "#5C6B63", fontSize: 13 },
  meta: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 6 },
  rating: { fontWeight: "600", color: "#1E1F1E" },
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  tag: {
    backgroundColor: "#F2F6F4",
    borderWidth: 1,
    borderColor: "#DCE6E1",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { color: "#1E4237", fontSize: 12, fontWeight: "600" },
  footer: {
    marginTop: "auto",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  iconBtn: {
    backgroundColor: "#EAF3EF",
    borderRadius: 999,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  cta: {
    backgroundColor: "#0E4D3A",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 44,
  },
  ctaText: { color: "white", fontWeight: "700" },
});
