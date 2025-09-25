import React from "react";
import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type TabKey = "biens" | "services" | "voyages";

export default function TopTabsControlled({
  active, onChange,
}: { active: TabKey; onChange: (k: TabKey) => void }) {
  return (
    <View style={s.pill}>
      <Tab k="biens" label="Propriétés" icon="home-outline" active={active} onChange={onChange} />
      <Tab k="services" label="Professionnels" icon="briefcase-outline" active={active} onChange={onChange} />
      <Tab k="voyages" label="Voyages" icon="bed-outline" active={active} onChange={onChange} />
    </View>
  );
}

function Tab({
  k, label, icon, active, onChange,
}: { k: TabKey; label: string; icon: any; active: TabKey; onChange: (k: TabKey) => void }) {
  const is = active === k;
  
  const handlePress = () => {
    onChange(k);
    
    // Navigate to the appropriate route
    switch (k) {
      case 'biens':
        router.push('/(tabs)/home');
        break;
      case 'services':
        router.push('/(tabs)/professionnels');
        break;
      case 'voyages':
        router.push('/(tabs)/voyages');
        break;
    }
  };
  
  return (
    <Pressable onPress={handlePress} style={s.tab} accessibilityRole="button">
      <Ionicons name={icon} size={26} color={is ? "#111827" : "#6B7280"} />
      <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}
            style={[s.label, { color: is ? "#111827" : "#6B7280" }]}>{label}</Text>
      {is ? <View style={s.indicator} /> : <View style={s.spacer} />}
    </Pressable>
  );
}

const s = StyleSheet.create({
  pill: {
    flexDirection: "row", alignItems: "center", gap: 8,
    marginHorizontal: 16, borderRadius: 22, paddingHorizontal: 6, paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1, borderColor: "rgba(230,232,235,0.9)",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.06, shadowRadius: 18 },
      android: { elevation: 4 },
      web: { boxShadow: "0 10px 24px rgba(0,0,0,0.06)" } as any,
    }),
  },
  tab: { flex: 1, height: 84, alignItems: "center", justifyContent: "center", paddingVertical: 6 },
  label: { fontSize: 14, lineHeight: 18, fontWeight: "700", marginTop: 6 },
  indicator: { position: "absolute", bottom: 6, height: 3, width: 28, borderRadius: 2, backgroundColor: "#111827" },
  spacer: { height: 3 },
});