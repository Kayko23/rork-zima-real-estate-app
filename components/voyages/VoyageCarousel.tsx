import React from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { VoyageCard, VoyageCardSkeleton } from "./VoyageCard";
import type { Hotel } from "@/lib/hotels-api";

export default function VoyageCarousel({
  title, loading, data, onEnd,
}: {
  title: string;
  loading: boolean;
  data: Hotel[];
  onEnd?: () => void;
}) {
  return (
    <View style={{ marginBottom: 18 }}>
      <View style={s.row}><Text style={s.title}>{title}</Text><Text style={s.link}>Voir tout</Text></View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        data={loading ? Array.from({ length: 3 }).map((_, i) => ({ id: `sk_${i}` } as any)) : data}
        keyExtractor={(it: any) => it.id}
        renderItem={({ item }: any) =>
          loading ? <VoyageCardSkeleton /> : <VoyageCard item={item} onPress={() => {}} />}
        onEndReachedThreshold={0.3}
        onEndReached={onEnd}
      />
    </View>
  );
}
const s = StyleSheet.create({
  row: { paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "900", color: "#0F172A" },
  link: { color: "#0B3B2E", fontWeight: "800" },
  listContent: { paddingLeft: 16, paddingRight: 16 },
});
