import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { COUNTRIES, CITIES } from "@/constants/countries";
import { GlassCard, GlassButton } from "./Glass";

export type FiltersState = {
  country: string | null;
  city: string | null;
  intent: "tous" | "à vendre" | "à louer";
};

export default function Filters({ onApply }: { onApply: (f: FiltersState) => void }) {
  const [f, setF] = useState<FiltersState>({ country: null, city: null, intent: "tous" });

  const cities = useMemo(() => (f.country ? (CITIES[f.country] ?? []) : []), [f.country]);

  const handleCountryChange = (value: string | null) => {
    setF({ ...f, country: value || null, city: null });
  };

  const handleCityChange = (value: string | null) => {
    setF({ ...f, city: value || null });
  };

  const handleIntentChange = (intent: "tous" | "à vendre" | "à louer") => {
    setF({ ...f, intent });
  };

  return (
    <GlassCard style={s.wrap}>
      <Text style={s.title}>Filtres</Text>

      <Text style={s.label}>Pays</Text>
      <View style={s.box}>
        <Picker 
          selectedValue={f.country || ""} 
          onValueChange={(value) => handleCountryChange(value === "" ? null : value)}
        >
          <Picker.Item label="Tous les pays" value="" />
          {COUNTRIES.map(c => <Picker.Item key={c} label={c} value={c} />)}
        </Picker>
      </View>

      <Text style={s.label}>Ville</Text>
      <View style={s.box}>
        <Picker 
          enabled={!!f.country} 
          selectedValue={f.city || ""} 
          onValueChange={(value) => handleCityChange(value === "" ? null : value)}
        >
          <Picker.Item label={f.country ? "Toutes les villes" : "Choisissez d'abord un pays"} value="" />
          {cities.map(v => <Picker.Item key={v} label={v} value={v} />)}
        </Picker>
      </View>

      <View style={s.row}>
        {(["tous","à vendre","à louer"] as const).map(t => (
          <GlassButton 
            key={t} 
            title={t}
            onPress={() => handleIntentChange(t)}
            style={[s.pill, f.intent === t && s.pillActive]} 
          />
        ))}
      </View>

      <GlassButton title="Appliquer" onPress={() => onApply(f)} style={s.applyButton} />
    </GlassCard>
  );
}

const s = StyleSheet.create({
  wrap: { margin: 12, padding: 12 },
  title: { fontWeight: "800", fontSize: 16, marginBottom: 8, color: "#0F172A" },
  label: { marginTop: 10, marginBottom: 4, color: "#475569", fontWeight: "600" },
  box: { 
    overflow: "hidden", 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: "rgba(230,232,235,0.9)",
    backgroundColor: "#fff"
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  pill: { paddingVertical: 8, paddingHorizontal: 12 },
  pillActive: { backgroundColor: "rgba(25,113,92,0.12)", borderColor: "#19715C", borderWidth: 2 },
  applyButton: { marginTop: 8 },
});