import React from "react";
import { View, Text, FlatList, Pressable, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import CategorySkeletonRow from "@/components/category/CategorySkeletonRow";

export type Category = { id: string; title: string; image: string; href: string };

function CategoriesSection({
  title = "Par catégories",
  data,
  loading,
}: {
  title?: string;
  data: Category[];
  loading?: boolean;
}) {
  const router = useRouter();
  console.log("CategoriesSection: render loading=", loading, "items=", data?.length ?? 0);

  return (
    <View style={{ marginTop: 24 }} testID="categories-section">
      <View style={s.header}>
        <Text style={s.h2}>{title}</Text>
        <Pressable onPress={() => router.push({ pathname: '/categories' } as any)}
          accessibilityRole="button"
          testID="see-all-categories">
          {({ pressed }) => (
            <Text style={[s.seeAll, pressed && { opacity: 0.6 }]}>Voir tout ›</Text>
          )}
        </Pressable>
      </View>

      {loading ? (
        <CategorySkeletonRow count={3} />
      ) : (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 12 }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(item.href as any)}
              style={s.card}
              android_ripple={{ color: "#dde7e2" }}
              accessibilityRole="button"
              testID={`category-card-${item.id}`}
            >
              <Image source={{ uri: item.image }} style={s.image} />
              <View style={s.badgeWrap}>
                <Text style={s.badgeText}>{item.title}</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={!loading ? (
            <View style={{ paddingHorizontal: 12 }}>
              <Text style={{ color: "#6B7280" }}>Aucune catégorie</Text>
            </View>
          ) : null}
        />
      )}
    </View>
  );
}

export default React.memo(CategoriesSection);

const s = StyleSheet.create({
  header: { paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  h2: { fontSize: 22, fontWeight: "800", color: "#0f241c" },
  seeAll: { fontSize: 15, color: "#0f6e4f", fontWeight: "600" },
  card: {
    width: 260, height: 150, marginRight: 12, borderRadius: 16, overflow: "hidden", backgroundColor: "#F6F8F7",
  },
  image: { width: "100%", height: "100%" },
  badgeWrap: { position: "absolute", left: 12, bottom: 12, backgroundColor: "rgba(15,36,28,0.65)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  badgeText: { color: "white", fontWeight: "700" },
});
