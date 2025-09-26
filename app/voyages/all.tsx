import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import VoyageCard from "@/components/voyages/VoyageCard";
import { useTrips } from "@/hooks/useTrips";
import SkeletonLine from "@/components/ui/SkeletonLine";

export default function AllTripsScreen() {
  const { items, loading, loadMore, refresh } = useTrips("all");

  return (
    <SafeAreaView style={s.screen}>
      <Stack.Screen options={{ title: "Tous les logements", headerShadowVisible:false }} />

      <FlatList
        data={items}
        keyExtractor={(it)=>it.id}
        contentContainerStyle={s.listContent}
        renderItem={({item})=> (
          <View style={s.cardWrap}>
            <VoyageCard item={item} onPress={()=>router.push(`/trip/${item.id}` as const)} />
          </View>
        )}
        onEndReachedThreshold={0.4}
        onEndReached={loadMore}
        refreshing={loading && items.length===0}
        onRefresh={refresh}
        ListFooterComponent={()=>(loading ? <SkeletonLine height={100} radius={14}/> : null)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:{ flex:1, backgroundColor:"#F7FAF9" },
  listContent:{ padding:12, rowGap:12 },
  cardWrap:{},
});