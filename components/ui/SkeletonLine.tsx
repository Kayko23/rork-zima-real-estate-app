import React from "react";
import { View, StyleSheet } from "react-native";

export default function SkeletonLine({ width="100%", height=16, radius=8 }:{ width?:number|string; height?:number; radius?:number }) {
  return <View style={[s.box, { width, height, borderRadius: radius }]} testID="skeleton-line"/>;
}
const s = StyleSheet.create({
  box:{ backgroundColor:"#EDEFF0" }
});