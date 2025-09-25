import React from "react";
import { View, Text, Pressable, StyleSheet, Switch } from "react-native";
import { X } from "lucide-react-native";

export type TripsFilters = {
  priceMin?: number; priceMax?: number;
  morning?: boolean; afternoon?: boolean; evening?: boolean;
  wifi?: boolean; pool?: boolean; breakfast?: boolean;
};

export default function FilterSheet({
  visible, onClose, value, onChange,
}: {
  visible: boolean; onClose: () => void;
  value: TripsFilters; onChange: (v: TripsFilters) => void;
}) {
  if (!visible) return null;
  return (
    <View style={s.backdrop} testID="voyage.filterSheet">
      <View style={s.sheet}>
        <View style={s.header}>
          <Text style={s.title}>Filtres</Text>
          <Pressable onPress={onClose}><X size={22} color="#1F2937" /></Pressable>
        </View>

        <Group title="Équipements">
          <Toggle label="Wi-Fi"    val={!!value.wifi}      on={(v) => onChange({ ...value, wifi: v })} />
          <Toggle label="Piscine"  val={!!value.pool}      on={(v) => onChange({ ...value, pool: v })} />
          <Toggle label="Petit-déj" val={!!value.breakfast} on={(v) => onChange({ ...value, breakfast: v })} />
        </Group>

        <Group title="Moment de la journée">
          <Toggle label="Matin"       val={!!value.morning}   on={(v) => onChange({ ...value, morning: v })} />
          <Toggle label="Après-midi"  val={!!value.afternoon} on={(v) => onChange({ ...value, afternoon: v })} />
          <Toggle label="Soir"        val={!!value.evening}   on={(v) => onChange({ ...value, evening: v })} />
        </Group>

        <Pressable style={s.cta} onPress={onClose}><Text style={s.ctaText}>Appliquer</Text></Pressable>
      </View>
    </View>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontWeight: "800", marginBottom: 8, color: "#0F172A" }}>{title}</Text>
      <View style={{ gap: 10 }}>{children}</View>
    </View>
  );
}
function Toggle({ label, val, on }: { label: string; val: boolean; on: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Text style={{ fontSize: 16 }}>{label}</Text><Switch value={val} onValueChange={on} />
    </View>
  );
}

const s = StyleSheet.create({
  backdrop: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: { fontWeight: "900", fontSize: 18 },
  cta: { marginTop: 12, backgroundColor: "#0B3B2E", padding: 14, borderRadius: 12, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "700" },
});
