import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, TextInput, FlatList, Pressable } from "react-native";
import { AFRICA_TARGET_COUNTRIES } from "@/constants/regions";
import { useCities } from "@/hooks/useCities";
import { T } from "@/constants/typography";

export default function SearchSheet({ open, onClose, onApply, mode }: {
  open: boolean; onClose: () => void; onApply: (p: any) => void; mode: "biens" | "services" | "voyages";
}) {
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [cityQuery, setCityQuery] = useState("");
  const [page, setPage] = useState(1);
  const { cities, loading } = useCities(country, cityQuery, page);

  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose} transparent>
      <View style={s.wrap}>
        <View style={s.sheet}>
          <View style={s.headerContainer}>
            <View style={s.grabber} />
          </View>

          <Text style={[T.h1, { marginHorizontal: 16, marginBottom: 6 }]}>
            {mode === "services" ? "Où exercer ?" : "Où ?"}
          </Text>

          {/* Pays */}
          <View style={s.countrySection}>
            <Text style={[T.muted, { marginBottom: 6 }]}>Pays</Text>
            <Pressable style={s.select} onPress={() => {/* ouvre un picker si tu préfères */}}>
              <TextInput
                placeholder="Choisir un pays"
                value={country ? AFRICA_TARGET_COUNTRIES.find(c => c.code === country)?.name : ""}
                onFocus={() => { }}
                style={s.selectInput}
                readOnly
              />
            </Pressable>
            <FlatList
              data={AFRICA_TARGET_COUNTRIES}
              keyExtractor={(i) => i.code}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.countryList}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => { setCountry(item.code); setPage(1); }}
                  style={[s.countryPill, country === item.code && s.countryPillActive]}
                >
                  <Text style={{ fontWeight: "700", color: country === item.code ? "#fff" : "#111827" }}>
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          </View>

          {/* Villes */}
          <View style={s.citySection}>
            <Text style={[T.muted, { marginBottom: 6 }]}>Ville</Text>
            <TextInput
              placeholder="Rechercher une ville"
              onChangeText={setCityQuery}
              style={s.input}
              autoCorrect={false}
            />
            <FlatList
              data={cities}
              keyExtractor={(i) => i.id}
              keyboardShouldPersistTaps="handled"
              onEndReached={() => setPage(p => p + 1)}
              ListFooterComponent={loading ? <Text style={s.loadingText}>Chargement…</Text> : null}
              renderItem={({ item }) => (
                <Pressable style={s.cityRow} onPress={() => onApply({ country, cityId: item.id, cityName: item.name })}>
                  <Text style={s.cityName}>{item.name}</Text>
                  {item.admin ? <Text style={s.cityAdmin}>{item.admin}</Text> : null}
                </Pressable>
              )}
              style={s.cityList}
            />
          </View>

          <View style={s.bottomSpacer} />
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingBottom: 18,
  },
  headerContainer: { alignItems: "center", paddingVertical: 6 },
  grabber: { width: 44, height: 5, borderRadius: 3, backgroundColor: "rgba(0,0,0,0.15)" },
  countrySection: { marginHorizontal: 16, marginBottom: 8 },
  countryList: { gap: 8, paddingVertical: 8 },
  citySection: { marginHorizontal: 16, marginBottom: 12 },
  cityList: { maxHeight: 260, marginTop: 8 },
  bottomSpacer: { height: 12 },
  loadingText: { textAlign: "center", padding: 8 },
  cityName: { fontSize: 16, fontWeight: "700" },
  cityAdmin: { color: "#6B7280" },
  input: {
    height: 50, borderRadius: 12, paddingHorizontal: 14,
    borderWidth: 1, borderColor: "rgba(0,0,0,0.08)", fontSize: 16, fontWeight: "600",
  },
  select: { borderRadius: 12, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)" },
  selectInput: { height: 46, paddingHorizontal: 14, fontSize: 16, fontWeight: "700", color: "#111827" },
  cityRow: { paddingVertical: 10, borderBottomWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  countryPill: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: "#F3F4F6" },
  countryPillActive: { backgroundColor: "#1B4F45" },
});