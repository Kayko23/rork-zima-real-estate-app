import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type TabKey = "biens" | "services" | "voyages";

export default function TopTabs({ defaultTab = "biens" as TabKey }) {
  const [active, setActive] = useState<TabKey>(defaultTab);
  const r = useRouter();

  const go = (key: TabKey) => {
    if (!key?.trim()) return;
    setActive(key);
    if (key === "biens") r.push("/(tabs)/categories");
    if (key === "services") r.push("/(tabs)/services");
    if (key === "voyages") r.push("/browse?title=Voyages&kind=voyages");
  };

  return (
    <View style={s.pill}>
      <Tab
        icon={<Ionicons name="home-outline" size={26} color={active === "biens" ? "#111827" : "#6B7280"} />}
        label="Biens immobiliers"
        active={active === "biens"}
        onPress={() => go("biens")}
      />
      <Tab
        icon={<Ionicons name="briefcase-outline" size={26} color={active === "services" ? "#111827" : "#6B7280"} />}
        label="Services"
        active={active === "services"}
        onPress={() => go("services")}
      />
      <Tab
        icon={<Ionicons name="bed-outline" size={26} color={active === "voyages" ? "#111827" : "#6B7280"} />}
        label="Voyages"
        active={active === "voyages"}
        onPress={() => go("voyages")}
      />
    </View>
  );
}

function Tab({
  icon, label, active, onPress,
}: { icon: React.ReactNode; label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={s.tab} accessibilityRole="button">
      {/* eslint-disable-next-line @rork/linters/general-no-raw-text */}
      <View style={s.iconContainer}>{icon}</View>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        style={[s.tabLabel, active ? s.tabLabelActive : s.tabLabelInactive]}
      >
        {label}
      </Text>
      {active ? <View style={s.indicator}/> : <View style={s.spacer} />}
    </Pressable>
  );
}

const s = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    borderRadius: 22,
    paddingHorizontal: 6,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1, borderColor: "rgba(230,232,235,0.9)",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.06, shadowRadius: 18 },
      android: { elevation: 4 },
      web: { boxShadow: "0 10px 24px rgba(0,0,0,0.06)" } as any,
    }),
  },
  tab: {
    flex: 1,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 14, lineHeight: 18, fontWeight: "700",
    marginTop: 6,
  },
  tabLabelActive: { color: "#111827" },
  tabLabelInactive: { color: "#6B7280" },
  indicator: {
    position: "absolute",
    bottom: 6,
    height: 3, width: 28,
    borderRadius: 2,
    backgroundColor: "#111827",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    height: 3,
  },
});