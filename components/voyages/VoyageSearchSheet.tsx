import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { X, Calendar, Users, MapPin } from "lucide-react-native";
import type { VoyageQuery } from "./VoyageSearchBar";

export function VoyageSearchSheet({
  visible,
  onClose,
  initial,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  initial?: VoyageQuery;
  onSubmit: (q: VoyageQuery) => void;
}) {
  const [q, setQ] = useState<VoyageQuery>(initial || { type: "all" });
  
  if (!visible) return null;

  return (
    <View style={m.backdrop}>
      <View style={m.sheet}>
        <View style={m.header}>
          <Text style={m.title}>Où voulez-vous aller ?</Text>
          <Pressable onPress={onClose}>
            <X size={24} color="#1F2937" />
          </Pressable>
        </View>

        <Text style={m.label}>Destination</Text>
        <View style={m.row}>
          <MapPin size={18} color="#6B7280" />
          <TextInput
            placeholder="Rechercher une ville / hôtel"
            style={m.input}
            value={q.destination?.label}
            onChangeText={(t) =>
              setQ((prev) => ({ ...prev, destination: { label: t } }))
            }
          />
        </View>

        <Text style={m.label}>Dates</Text>
        <View style={m.dateRow}>
          <Pressable
            style={[m.row, m.dateInput]}
            onPress={() => {
              /* ouvrir calendrier */
            }}
          >
            <Calendar size={18} color="#6B7280" />
            <Text style={m.placeholder}>
              {q.dateFrom ? q.dateFrom : "Arrivée"}
            </Text>
          </Pressable>
          <Pressable
            style={[m.row, m.dateInput]}
            onPress={() => {
              /* ouvrir calendrier */
            }}
          >
            <Calendar size={18} color="#6B7280" />
            <Text style={m.placeholder}>
              {q.dateTo ? q.dateTo : "Départ"}
            </Text>
          </Pressable>
        </View>

        <Text style={m.label}>Voyageurs</Text>
        <View style={m.row}>
          <Users size={18} color="#6B7280" />
          <TextInput
            keyboardType="number-pad"
            placeholder="Nombre"
            style={m.input}
            value={q.guests?.toString()}
            onChangeText={(t) =>
              setQ((prev) => ({ ...prev, guests: Number(t || "0") }))
            }
          />
        </View>

        <Text style={m.label}>Type d&apos;hébergement</Text>
        <View style={m.chips}>
          {(["all", "hotel", "residence", "daily"] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setQ((prev) => ({ ...prev, type: t }))}
              style={[m.chip, q.type === t && m.chipActive]}
            >
              <Text style={[m.chipTxt, q.type === t && m.chipTxtActive]}>
                {t === "all"
                  ? "Tous"
                  : t === "hotel"
                  ? "Hôtels"
                  : t === "residence"
                  ? "Résidences"
                  : "Journaliers"}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={m.cta}
          onPress={() => {
            onSubmit(q);
            onClose();
          }}
        >
          <Text style={m.ctaTxt}>Rechercher</Text>
        </Pressable>
      </View>
    </View>
  );
}

const m = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
  },
  label: {
    marginTop: 4,
    fontWeight: "800",
    color: "#1F2937",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  dateRow: {
    flexDirection: "row",
    gap: 8,
  },
  dateInput: {
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
  },
  placeholder: {
    color: "#6B7280",
    fontWeight: "700",
    fontSize: 14,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  chip: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: "#E0F2FE",
    borderWidth: 1,
    borderColor: "#0EA5E9",
  },
  chipTxt: {
    fontWeight: "700",
    color: "#374151",
    fontSize: 12,
  },
  chipTxtActive: {
    color: "#0EA5E9",
  },
  cta: {
    marginTop: 10,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaTxt: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});