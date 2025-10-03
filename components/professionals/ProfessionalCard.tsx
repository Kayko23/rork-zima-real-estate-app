import React from "react";
import { View, Text, ImageBackground, StyleSheet, Pressable } from "react-native";
import { Heart } from "lucide-react-native";

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

export default function ProfessionalCard({ item, onPressProfile }: Props) {
  const imageUri = item.cover || item.avatar || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800";

  return (
    <Pressable
      onPress={() => onPressProfile?.(item.id)}
      style={s.card}
      accessibilityLabel={`Voir le profil de ${item.name}`}
    >
      <ImageBackground
        source={{ uri: imageUri }}
        style={s.imageBackground}
        imageStyle={s.imageStyle}
        resizeMode="cover"
      >
        <View style={s.topBar}>
          {item.badges?.includes("premium") && (
            <View style={s.premiumBadge}>
              <Text style={s.premiumText}>Premium</Text>
            </View>
          )}
          <Pressable
            style={s.favoriteBtn}
            accessibilityLabel="Ajouter aux favoris"
            onPress={(e) => {
              e.stopPropagation();
            }}
          >
            <Heart size={18} color="#fff" />
          </Pressable>
        </View>

        <View style={s.bottomInfo}>
          <Text style={s.name} numberOfLines={1}>
            {item.name} • {item.city}
          </Text>

          <View style={s.priceTag}>
            <Text style={s.priceText}>0 FCFA</Text>
          </View>
        </View>

        <View style={s.ratingBadge}>
          <Text style={s.ratingText}>⭐ {item.rating.toFixed(1)}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  imageBackground: {
    width: "100%",
    height: 298,
    justifyContent: "space-between",
  },
  imageStyle: {
    borderRadius: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 12,
  },
  premiumBadge: {
    backgroundColor: "#0E2F26",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    color: "#fff",
    fontWeight: "600" as const,
    fontSize: 12,
  },
  favoriteBtn: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 999,
  },
  bottomInfo: {
    padding: 12,
  },
  name: {
    color: "#fff",
    fontWeight: "700" as const,
    fontSize: 16,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  priceTag: {
    marginTop: 6,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    fontWeight: "700" as const,
    fontSize: 13,
    color: "#0E2F26",
  },
  ratingBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: "#fff",
    fontWeight: "600" as const,
    fontSize: 12,
  },
});
