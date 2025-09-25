import React from "react";
import { FlatList } from "react-native";
import { VoyageCard } from "./VoyageCard";
import { VoyageItem } from "./helpers";

export function VoyageCarousel({
  data,
  onPressItem,
}: {
  data: VoyageItem[];
  onPressItem: (it: VoyageItem) => void;
}) {
  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(it) => it.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      renderItem={({ item }) => (
        <VoyageCard item={item} onPress={() => onPressItem(item)} />
      )}
    />
  );
}