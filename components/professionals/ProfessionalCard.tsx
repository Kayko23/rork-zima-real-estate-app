import React from "react";
import { View, Text, ImageBackground, StyleSheet, Pressable, Linking } from "react-native";
import { Heart, Mail, Phone } from "lucide-react-native";
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
  tags?: string[];
  category: "agent" | "property_manager" | "agency" | "hotel_booking" | "short_stay" | "event_space";
  email?: string;
  phone?: string;
  whatsapp?: string;
};

const ROLE_LABELS: Record<Provider["category"], string> = {
  agent: "Agent immobilier",
  property_manager: "Gestionnaire de biens",
  agency: "Agence immobilière",
  hotel_booking: "Réservation – Hôtels",
  short_stay: "Réservation – Séjours",
  event_space: "Gestion d'espaces",
};

type Props = {
  item: Provider;
  onPressProfile?: (id: string) => void;
};

export default function ProfessionalCard({ item, onPressProfile }: Props) {
  const { isFavoriteProvider, toggleFavoriteProvider } = useApp();
  const isFav = isFavoriteProvider(item.id);
  const imageUri = item.cover || item.avatar || `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80`;

  console.log('[ProfessionalCard] Rendering:', item.name, 'ID:', item.id, 'Image:', imageUri);

  const handleEmail = (e: any) => {
    e.stopPropagation();
    if (item.email) {
      Linking.openURL(`mailto:${item.email}`);
    }
  };

  const handleCall = (e: any) => {
    e.stopPropagation();
    if (item.phone) {
      Linking.openURL(`tel:${item.phone}`);
    }
  };

  const handleWhatsApp = (e: any) => {
    e.stopPropagation();
    if (item.whatsapp) {
      Linking.openURL(`whatsapp://send?phone=${item.whatsapp}`);
    }
  };

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
            accessibilityLabel={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavoriteProvider(item.id);
            }}
          >
            <Heart size={18} color={isFav ? "#EF4444" : "#fff"} fill={isFav ? "#EF4444" : "none"} strokeWidth={2.5} />
          </Pressable>
        </View>

        <View style={s.bottomInfo}>
          <Text style={s.name} numberOfLines={1}>
            {item.name} • {item.city}
          </Text>
          <Text style={s.role} numberOfLines={1}>
            {ROLE_LABELS[item.category]}
          </Text>

          <View style={s.actionsRow}>
            {item.email && (
              <Pressable
                onPress={handleEmail}
                style={s.actionBtn}
                accessibilityLabel={`Envoyer un mail à ${item.name}`}
              >
                <Mail size={18} color="#0E2F26" />
              </Pressable>
            )}
            {item.phone && (
              <Pressable
                onPress={handleCall}
                style={s.actionBtn}
                accessibilityLabel={`Appeler ${item.name}`}
              >
                <Phone size={18} color="#0E2F26" />
              </Pressable>
            )}
            {item.whatsapp && (
              <Pressable
                onPress={handleWhatsApp}
                style={s.actionBtn}
                accessibilityLabel={`Envoyer un WhatsApp à ${item.name}`}
              >
                <Text style={s.whatsappIcon}>💬</Text>
              </Pressable>
            )}
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
    backgroundColor: "#D4AF37",
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
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 8,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  bottomInfo: {
    padding: 12,
  },
  name: {
    color: "#fff",
    fontWeight: "800" as const,
    fontSize: 18,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  role: {
    color: "#F2F2F2",
    fontWeight: "600" as const,
    fontSize: 14,
    marginTop: 2,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  whatsappIcon: {
    fontSize: 18,
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
