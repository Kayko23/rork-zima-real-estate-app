import React from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ViewStyle } from "react-native";
import VoyageCard from "./VoyageCard";
import { TripItem } from "./helpers";
import SkeletonCard from "../ui/SkeletonCard";

const stylesInline = StyleSheet.create({
  section: { marginTop: 18 },
  listContent: { paddingHorizontal: 16 },
  skeleton: { marginRight: 14 },
  footer: { marginRight: 20 },
});

export default function VoyageCarousel({ title, data, onSeeAll, loading, onEndReached }:{
  title:string;
  data:TripItem[];
  onSeeAll?: ()=>void;
  loading?: boolean;
  onEndReached?: ()=>void;
}) {
  return (
    <View style={stylesInline.section}>
      <View style={s.head}>
        <Text style={s.title}>{title}</Text>
        {!!onSeeAll && <Text onPress={onSeeAll} style={s.seeAll}>Voir tout</Text>}
      </View>

      {loading && data.length===0 ? (
        <FlatList
          data={[1,2,3,4]}
          keyExtractor={(i)=>String(i)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={stylesInline.listContent as ViewStyle}
          renderItem={()=> <SkeletonCard width={300} height={250} style={stylesInline.skeleton} />}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(it)=>it.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          onEndReachedThreshold={0.4}
          onEndReached={onEndReached}
          contentContainerStyle={stylesInline.listContent as ViewStyle}
          renderItem={({item})=>
            <VoyageCard item={item} />
          }
          ListFooterComponent={loading ? <ActivityIndicator style={stylesInline.footer} /> : null}
        />
      )}
    </View>
  );
}
const s = StyleSheet.create({
  head:{ paddingHorizontal:16, flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:10 },
  title:{ fontWeight:"900", fontSize:20, color:"#0B3B36" },
  seeAll:{ color:"#134E48", fontWeight:"800" }
});