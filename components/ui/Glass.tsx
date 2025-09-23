import React from "react";
import { View, Pressable, Text, ViewStyle, StyleSheet, Platform } from "react-native";

export function GlassCard({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function GlassButton({ title, onPress, style }: {title: string; onPress?:()=>void; style?: ViewStyle}) {
  return (
    <Pressable onPress={onPress} style={[s.btn, style]} accessibilityRole="button">
      <Text style={s.btnText}>{title}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1, 
    borderColor: "rgba(230,232,235,0.9)",
    ...Platform.select({
      ios: { 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 12 }, 
        shadowOpacity: 0.08, 
        shadowRadius: 24 
      },
      android: { elevation: 8 },
      web: {
        boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
      } as any,
    }),
  },
  btn: {
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 12, 
    paddingHorizontal: 18,
    borderWidth: 1, 
    borderColor: "rgba(230,232,235,0.9)",
  },
  btnText: { fontWeight: "800", color: "#0F172A" },
});