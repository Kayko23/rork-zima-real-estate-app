import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

export default function SkeletonCard({ width, height, style }:{ width:number; height:number; style?:ViewStyle }) {
  return <View style={[sk.box, {width, height}, style]} testID="skeleton-card"/>;
}
const sk = StyleSheet.create({
  box:{ backgroundColor:"#EDEFF0", borderRadius:16 }
});