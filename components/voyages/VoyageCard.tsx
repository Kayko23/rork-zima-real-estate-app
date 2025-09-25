import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Heart, Star } from "lucide-react-native";
import { formatPrice, VoyageItem } from "./helpers";

export function VoyageCard({
  item,
  onPress,
}: {
  item: VoyageItem;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={c.wrap}>
      <View style={c.photoWrap}>
        <Image source={{ uri: item.photos[0] }} style={c.photo} />
        <Pressable style={c.fav}>
          <Heart size={18} color="#fff" />
        </Pressable>
        {item.badges?.[0] && (
          <View style={c.badge}>
            <Text style={c.badgeTxt}>{item.badges[0]}</Text>
          </View>
        )}
      </View>
      <View style={c.content}>
        <Text numberOfLines={1} style={c.title}>
          {item.title}
        </Text>
        <Text style={c.place}>
          {item.city}, {item.country}
        </Text>
        <Text style={c.price}>
          {formatPrice(item.price)}{" "}
          <Text style={c.unit}>/ {item.unit === "night" ? "nuit" : "jour"}</Text>
        </Text>
        <View style={c.ratingRow}>
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text style={c.rating}>
            {item.rating} · {item.reviews} avis
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const c = StyleSheet.create({
  wrap: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  photoWrap: {
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  content: {
    padding: 12,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  fav: {
    position: "absolute",
    right: 8,
    top: 8,
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    left: 8,
    top: 8,
    backgroundColor: "#059669",
    paddingHorizontal: 8,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTxt: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 11,
  },
  title: {
    fontWeight: "800",
    fontSize: 15,
    color: "#1F2937",
  },
  place: {
    color: "#6B7280",
    marginTop: 2,
    fontSize: 13,
  },
  price: {
    fontWeight: "800",
    marginTop: 2,
    color: "#1F2937",
    fontSize: 14,
  },
  unit: {
    color: "#6B7280",
    fontWeight: "700",
    fontSize: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  rating: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 12,
  },
});