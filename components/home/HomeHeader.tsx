import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TopTabsControlled from "./TopTabsControlled";

type TabKey = "biens" | "services" | "voyages";

export default function HomeHeader({
  active, onChange,
}: { active: TabKey; onChange: (k: TabKey) => void }) {
  return (
    <View style={s.container}>
      <Text style={s.wordmark}>ZIMA</Text>
      <TopTabsControlled active={active} onChange={onChange} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { backgroundColor: "#F3F6F6", paddingTop: 4, paddingBottom: 8 },
  wordmark: {
    textAlign: "center",
    fontSize: 30, lineHeight: 36, fontWeight: "800",
    color: "#1B4F45", letterSpacing: 1.5, marginBottom: 8,
  },
});