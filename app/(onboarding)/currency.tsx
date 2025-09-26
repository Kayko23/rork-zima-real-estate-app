import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Pressable } from "react-native";
import * as Localization from "expo-localization";
import { CURRENCIES, COUNTRY_TO_CURRENCY, CurrencyItem } from "@/lib/currency-data";
import { useApp } from "@/hooks/useAppStore";
import { router } from "expo-router";
import { Check, Globe, Search } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CurrencyPickerScreen() {
  const { currency, setCurrency, hydrate } = useApp();
  const [q, setQ] = useState("");
  const insets = useSafeAreaInsets();

  // devise recommandée en fonction du pays de l'appareil
  const region = Localization.getLocales()[0]?.regionCode ?? "";
  const recommended = COUNTRY_TO_CURRENCY[region];

  const data = useMemo(() => {
    const list = CURRENCIES.filter(
      c => c.code.toLowerCase().includes(q.toLowerCase()) ||
           c.name.toLowerCase().includes(q.toLowerCase())
    );
    // remonter la recommandée
    return list.sort((a,b) => (a.code === recommended ? -1 : b.code === recommended ? 1 : 0));
  }, [q, recommended]);

  function pick(c: CurrencyItem) {
    setCurrency(c.code);
  }

  async function finish() {
    // hydrate déjà persistant puis go home
    await hydrate();
    router.replace("/"); // page d'accueil
  }

  return (
    <View style={[s.container, { paddingTop: insets.top + 20 }]}>
      <Text style={s.title}>Choisir votre devise</Text>
      <Text style={s.subtitle}>La devise sera utilisée pour afficher tous les prix.</Text>

      <View style={s.search}>
        <Search size={18} color="#64748B" />
        <TextInput
          placeholder="Rechercher (code ou nom)"
          style={s.input}
          value={q}
          onChangeText={setQ}
          autoCapitalize="none"
        />
      </View>

      {!!recommended && (
        <View style={s.hint}>
          <Globe size={16} color="#0B3C2F" />
          <Text style={s.hintTxt}>Recommandé pour votre région : <Text style={s.hintBold}>{recommended}</Text></Text>
        </View>
      )}

      <FlatList
        data={data}
        keyExtractor={(i) => i.code}
        contentContainerStyle={s.listContent}
        renderItem={({ item }) => (
          <Pressable style={s.row} onPress={() => pick(item)}>
            <View style={s.itemContent}>
              <Text style={s.rowTitle}>{item.code} · {item.symbol}</Text>
              <Text style={s.rowSub}>{item.name}</Text>
            </View>
            {currency === item.code && (
              <View style={s.check}><Check size={16} color="#fff" /></View>
            )}
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={s.separator} />}
      />

      <Pressable style={s.cta} onPress={finish}>
        <Text style={s.ctaTxt}>Continuer</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F6F8FA" },
  title: { fontSize: 22, fontWeight: "800", color: "#0B3C2F" },
  subtitle:{ color:"#51626F", marginTop:6, marginBottom:16 },
  search: { flexDirection:"row", gap:8, alignItems:"center", backgroundColor:"#fff", borderRadius:12, paddingHorizontal:12, height:48, borderWidth:1, borderColor:"#E7EDF3" },
  input: { flex:1 },
  hint: { flexDirection:"row", gap:8, alignItems:"center", backgroundColor:"#EAF6F1", borderRadius:12, padding:12, marginTop:12 },
  hintTxt: { color:"#0B3C2F" },
  row: { flexDirection:"row", alignItems:"center", backgroundColor:"#fff", borderRadius:16, padding:14, borderWidth:1, borderColor:"#E7EDF3", marginHorizontal:2 },
  rowTitle: { fontWeight:"800", color:"#0B3C2F" },
  rowSub: { color:"#64748B", marginTop:2 },
  check: { width:24, height:24, borderRadius:12, backgroundColor:"#0B3C2F", alignItems:"center", justifyContent:"center" },
  cta:{ height:52, borderRadius:14, backgroundColor:"#0B3C2F", alignItems:"center", justifyContent:"center", marginTop:12 },
  ctaTxt:{ color:"#fff", fontWeight:"800" },
  itemContent: { flex: 1 },
  separator: { height: 10 },
  hintBold: { fontWeight: "700" },
  listContent: { paddingVertical: 8 },
});