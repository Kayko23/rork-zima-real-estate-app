import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useApp } from "@/hooks/useAppStore";
import { Check } from "lucide-react-native";

const LANGS = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
];
const CURRENCIES = [
  { code: "XOF", label: "Franc CFA (XOF)" },
  { code: "NGN", label: "Naira (NGN)" },
  { code: "GHS", label: "Cedi (GHS)" },
  { code: "USD", label: "US Dollar (USD)" },
];

export default function LanguageCurrencyScreen() {
  const { language, currency, setLanguage, setCurrency } = useApp();

  return (
    <View style={s.container}>
      <Text style={s.title}>Langue</Text>
      {LANGS.map(l => (
        <Pressable key={l.code} style={s.row} onPress={() => setLanguage(l.code as any)}>
          <Text style={s.rowTxt}>{l.label}</Text>
          {language === l.code && <Check color="#059669" />}
        </Pressable>
      ))}

      <Text style={[s.title, s.currencyTitle]}>Devise</Text>
      {CURRENCIES.map(c => (
        <Pressable key={c.code} style={s.row} onPress={() => setCurrency(c.code as any)}>
          <Text style={s.rowTxt}>{c.label}</Text>
          {currency === c.code && <Check color="#059669" />}
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  currencyTitle: { marginTop: 18 },
  row: { height: 52, backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", paddingHorizontal: 12, marginBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowTxt: { fontWeight: "600" },
});