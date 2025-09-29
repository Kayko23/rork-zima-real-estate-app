import React from "react";
import { View, ScrollView, Pressable, Text, StyleSheet } from "react-native";
import { buildQuickReplies, UserRole, ThreadContext } from "./quickReplies";

type Props = {
  role: UserRole;
  ctx: ThreadContext;
  locale?: "fr" | "en";
  hasAppointment?: boolean;
  hasDocs?: boolean;
  onSelect: (text: string, id: string) => void;
};

export default function QuickReplies({ role, ctx, locale="fr", hasAppointment, hasDocs, onSelect }: Props) {
  const data = buildQuickReplies({ role, ctx, locale, hasAppointment, hasDocs });
  if (!data.length) return null;
  
  return (
    <View style={s.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
        {data.map(r => (
          <Pressable key={r.id} style={s.chip} onPress={() => onSelect(r.text, r.id)}>
            <Text style={s.txt}>{r.text}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { paddingTop: 8, paddingBottom: 6, backgroundColor: "white", borderTopWidth: 1, borderColor: "#E6ECE9" },
  row: { paddingHorizontal: 12, gap: 8 },
  chip: { backgroundColor: "#F1F6F4", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
  txt: { color: "#0B1F15", fontWeight: "600" },
});