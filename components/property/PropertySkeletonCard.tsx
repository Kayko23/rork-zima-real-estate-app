import React from "react";
import { View, StyleSheet } from "react-native";
import Shimmer from "@/components/common/Shimmer";
import { radius } from "@/theme/tokens";

export default function PropertySkeletonCard() {
  console.log("PropertySkeletonCard: render");
  return (
    <View style={s.card} testID="property-skeleton-card">
      <Shimmer style={s.img}/>
      <View style={{ padding:12 }}>
        <Shimmer style={{ height:18, width:"65%", marginBottom:10 }}/>
        <Shimmer style={{ height:32, width:180, borderRadius:999 }}/>
        <View style={{ flexDirection:"row", gap:8, marginTop:12 }}>
          <Shimmer style={{ height:28, width:70, borderRadius:999 }}/>
          <Shimmer style={{ height:28, width:70, borderRadius:999 }}/>
          <Shimmer style={{ height:28, width:90, borderRadius:999 }}/>
        </View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  card:{ borderRadius: radius.lg, overflow:"hidden" },
  img:{ height:220, width:"100%" },
});
