import React from "react";
import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/hooks/useAppStore";
import Type from "@/constants/typography";
export default function ActionDouble() {
  const r = useRouter();
  const { setHomeTab, toggleAppMode } = useApp();
  
  const handleFindPro = () => {
    setHomeTab('services');
    r.replace("/(tabs)/home");
  };
  
  const handlePublish = async () => {
    await toggleAppMode('provider');
    r.replace('/(proTabs)/dashboard');
  };
  
  return (
    <View style={s.row}>
      <Pressable style={s.big} onPress={handlePublish} accessibilityRole="button" testID="cta-publish">
        <Ionicons name="add-circle-outline" size={22} color="#19715C" />
        <Text style={s.bigText} numberOfLines={1} adjustsFontSizeToFit>Publier un bien</Text>
      </Pressable>
      <Pressable style={s.big} onPress={handleFindPro} accessibilityRole="button" testID="cta-find-pro">
        <Ionicons name="person-outline" size={22} color="#8B6A2B" />
        <Text style={s.bigText} numberOfLines={1} adjustsFontSizeToFit>Trouver un pro</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginTop: 14, marginBottom: 8 },
  big: {
    flex: 1,
    height: 120,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1, borderColor: "rgba(230,232,235,0.9)",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.06, shadowRadius: 18 },
      android: { elevation: 4 },
    }),
  },
  bigText: { ...Type.h3, color: "#0F172A" },
});