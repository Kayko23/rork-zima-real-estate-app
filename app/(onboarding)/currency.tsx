import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, Platform } from "react-native";
import * as Localization from "expo-localization";
import { CURRENCIES, COUNTRY_TO_CURRENCY, CurrencyItem } from "@/lib/currency-data";
import { useApp } from "@/hooks/useAppStore";
import { router } from "expo-router";
import { Check, Globe, Search } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

export default function CurrencyPickerScreen() {
  const { currency, setCurrency, completeOnboarding } = useApp();
  const [q, setQ] = useState("");

  const region = Localization.getLocales()[0]?.regionCode ?? "";
  const recommended = COUNTRY_TO_CURRENCY[region];

  const data = useMemo(() => {
    return CURRENCIES
      .filter(c =>
        c.code.toLowerCase().includes(q.toLowerCase()) ||
        c.name.toLowerCase().includes(q.toLowerCase())
      )
      .sort((a,b) => (a.code === recommended ? -1 : b.code === recommended ? 1 : 0));
  }, [q, recommended]);

  function pick(item: CurrencyItem) { 
    setCurrency(item.code); 
  }

  async function finish() {
    console.log('Completing onboarding with currency:', currency);
    await completeOnboarding();
    router.replace("/"); // Home
  }

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      {/* Progress indicator */}
      <View style={s.progressWrap}>
        <Text style={s.progressLabel}>Configuration</Text>
        <Text style={s.progressPct}>100%</Text>
      </View>
      <View style={s.progressBarBg}>
        <View style={s.progressBarFg} />
      </View>

      <Text style={s.title}>Choisir votre devise</Text>
      <Text style={s.subtitle}>Elle sera utilisée pour tous les prix dans ZIMA.</Text>

      <View style={s.search}>
        <Search size={18} color="#64748B" />
        <TextInput
          placeholder="Rechercher (code ou nom)"
          value={q}
          onChangeText={setQ}
          style={s.input}
          autoCapitalize="none"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {!!recommended && (
        <View style={s.hint}>
          <Globe size={16} color="#0B3C2F" />
          <Text style={s.hintTxt}>
            Recommandé pour votre région : <Text style={s.hintBold}>{recommended}</Text>
          </Text>
        </View>
      )}

      <FlatList
        contentContainerStyle={s.listContent}
        data={data}
        keyExtractor={(i) => i.code}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = currency === item.code;
          return (
            <Pressable 
              style={[s.row, isSelected && s.rowActive]} 
              onPress={() => pick(item)}
              testID={`currency-${item.code}`}
            >
              <View style={s.flagContainer}>
                <Text style={s.flag}>{item.flag}</Text>
              </View>
              <View style={s.itemContent}>
                <Text style={[s.rowTitle, isSelected && s.rowTitleActive]}>
                  {item.code} · {item.symbol}
                </Text>
                <Text style={s.rowSub}>{item.name}</Text>
              </View>
              <View style={[s.check, isSelected && s.checkActive]}>
                {isSelected && <Check size={16} color="#fff" />}
              </View>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={s.separator} />}
      />

      <Pressable style={s.cta} onPress={finish} testID="continue-button">
        <Text style={s.ctaTxt}>Continuer</Text>
      </Pressable>

      <Text style={s.hintBottom}>
        Vous pourrez modifier ceci plus tard dans les paramètres
      </Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF", 
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  progressWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "600",
  },
  progressPct: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "600",
  },
  progressBarBg: {
    height: 4,
    borderRadius: 999,
    backgroundColor: "#E6E8EB",
  },
  progressBarFg: {
    width: "100%",
    height: 4,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  title: { 
    marginTop: 32,
    fontSize: 28, 
    lineHeight: 34,
    fontWeight: "800", 
    color: "#0F172A" 
  },
  subtitle: { 
    color: "#475569", 
    marginTop: 8, 
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 22,
  },
  search: { 
    flexDirection: "row", 
    gap: 8, 
    alignItems: "center", 
    backgroundColor: "#F8FAFC", 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    height: 48, 
    borderWidth: 1, 
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  input: { 
    flex: 1,
    fontSize: 16,
    color: "#0F172A",
  },
  hint: { 
    flexDirection: "row", 
    gap: 8, 
    alignItems: "center", 
    backgroundColor: "#EAF6F1", 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 16,
  },
  hintTxt: { 
    color: "#0B3C2F",
    fontSize: 14,
    flex: 1,
  },
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12,
    backgroundColor: "#fff", 
    borderRadius: 16, 
    padding: 16,
    borderWidth: 1, 
    borderColor: "#E6E8EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  rowActive: {
    borderColor: Colors.primary,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  flag: {
    fontSize: 20,
  },
  rowTitle: { 
    fontWeight: "700", 
    color: "#0F172A",
    fontSize: 16,
  },
  rowTitleActive: {
    color: Colors.primary,
  },
  rowSub: { 
    color: "#64748B", 
    marginTop: 2,
    fontSize: 14,
  },
  check: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center", 
    justifyContent: "center" 
  },
  checkActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  cta: { 
    height: 52, 
    borderRadius: 16, 
    backgroundColor: Colors.primary, 
    alignItems: "center", 
    justifyContent: "center", 
    marginTop: 24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  ctaTxt: { 
    color: "#fff", 
    fontWeight: "800",
    fontSize: 16,
  },
  hintBottom: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 20,
    fontSize: 14,
    lineHeight: 20,
  },
  itemContent: { flex: 1 },
  separator: { height: 10 },
  hintBold: { fontWeight: "700" },
  listContent: { paddingVertical: 8 },
});