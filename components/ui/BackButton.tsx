import React from "react";
import { Pressable, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

export default function BackButton({ top = 12, left = 12 }: { top?: number; left?: number }) {
  const r = useRouter();
  return (
    <Pressable onPress={() => r.back()} accessibilityRole="button"
      style={[styles.wrap, { top, left }]} hitSlop={10}>
      <ChevronLeft size={22} color="#0F172A" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute", 
    zIndex: 10,
    width: 40, 
    height: 40, 
    borderRadius: 20,
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1, 
    borderColor: "rgba(230,232,235,0.9)",
    ...Platform.select({
      ios: { 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 8 }, 
        shadowOpacity: 0.08, 
        shadowRadius: 16 
      },
      android: { elevation: 6 },
      web: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      } as any,
    }),
  },
});