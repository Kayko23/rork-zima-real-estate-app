import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
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
      contentContainerStyle={styles.container}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <VoyageCard item={item} onPress={() => onPressItem(item)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  separator: {
    width: 12,
  },
});