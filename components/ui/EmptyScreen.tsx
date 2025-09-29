import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; onPress: () => void };
  secondaryCta?: { label: string; onPress: () => void };
};

export default function EmptyScreen({ title, subtitle, primaryCta, secondaryCta }: Props) {
  const insets = useSafeAreaInsets();
  
  return (
    <SafeAreaView style={[s.root, { paddingTop: insets.top + 16 }]}>
      <View style={s.body}>
        <Text style={s.title}>{title}</Text>
        {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
        <View style={s.row}>
          {primaryCta ? (
            <Pressable onPress={primaryCta.onPress} style={s.primary}>
              <Text style={s.primaryTxt}>{primaryCta.label}</Text>
            </Pressable>
          ) : null}
          {secondaryCta ? (
            <Pressable onPress={secondaryCta.onPress} style={s.secondary}>
              <Text style={s.secondaryTxt}>{secondaryCta.label}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F7F9F8" },
  body: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: "800", color: "#0B1F15", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 16, lineHeight: 22, color: "#243C30", opacity: 0.8, textAlign: "center" },
  row: { flexDirection: "row", gap: 12, marginTop: 24 },
  primary: { backgroundColor: "#1F2937", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12 },
  primaryTxt: { color: "white", fontWeight: "700" },
  secondary: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: "#C7D3CD" },
  secondaryTxt: { color: "#0B1F15", fontWeight: "700" },
});