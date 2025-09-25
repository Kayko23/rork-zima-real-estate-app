import React from "react";
import { SectionList, Text, View, StyleSheet } from "react-native";
import type { Section } from "@/lib/grouping";
import AllCard, { AllCardSkeleton } from "@/components/browse/AllCards";

export default function GroupedList({
  sections,
  loading,
  onEndReached,
  onRefresh,
}: {
  sections: Section[];
  loading?: boolean;
  onEndReached?: () => void;
  onRefresh?: () => void;
}) {
  const skeleton = Array.from({ length: 6 }).map((_, i) => ({ id: `sk_${i}` }));

  return (
    <SectionList
      sections={sections.length ? sections : ([{ key: "sk", title: "", data: skeleton }] as any)}
      keyExtractor={(item: any, idx) => (item.id ? String(item.id) : `sk_${idx}`)}
      renderItem={({ item }: any) => (item.kind ? <AllCard item={item} /> : <AllCardSkeleton />)}
      renderSectionHeader={({ section }) =>
        section.title ? (
          <View style={s.header}>
            <Text style={s.title}>{section.title}</Text>
            {!!section.subtitle && <Text style={s.subtitle}>{section.subtitle}</Text>}
          </View>
        ) : null
      }
      stickySectionHeadersEnabled
      onEndReachedThreshold={0.3}
      onEndReached={onEndReached}
      refreshing={!!loading}
      onRefresh={onRefresh}
      contentContainerStyle={{ paddingBottom: 24 }}
      testID="grouped-list"
    />
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  title: { fontSize: 16, fontWeight: "900", color: "#0F172A" },
  subtitle: { fontSize: 12, color: "#64748B", marginTop: 2 },
});
