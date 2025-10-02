import React from "react";
import { View, StyleSheet } from "react-native";
import Shimmer from "@/components/common/Shimmer";

function CategorySkeletonItem() {
  console.log("CategorySkeletonItem: render");
  return (
    <View style={s.card} accessibilityRole="image" testID="category-skeleton-item">
      <Shimmer style={s.image} />
      <View style={s.footer}>
        <Shimmer style={{ height: 16, width: 120, borderRadius: 6 }} />
      </View>
    </View>
  );
}

export default React.memo(CategorySkeletonItem);

const s = StyleSheet.create({
  card: {
    width: 260,
    height: 150,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F3F5F4",
    marginRight: 12,
  },
  image: { flex: 1, width: "100%" },
  footer: { position: "absolute", left: 12, bottom: 12 },
});
