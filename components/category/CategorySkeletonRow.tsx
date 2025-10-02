import React from "react";
import { FlatList, View } from "react-native";
import CategorySkeletonItem from "./CategorySkeletonItem";

export default function CategorySkeletonRow({ count = 3 }: { count?: number }) {
  console.log("CategorySkeletonRow: render count=", count);
  const data = React.useMemo(() => Array.from({ length: count }).map((_, i) => i), [count]);
  return (
    <View style={{ paddingHorizontal: 12, marginTop: 8 }} testID="category-skeleton-row">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(i) => `cat-skel-${i}`}
        renderItem={() => <CategorySkeletonItem />}
      />
    </View>
  );
}
