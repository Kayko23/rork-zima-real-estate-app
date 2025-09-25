import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import type { AllItem } from '@/lib/all-api';

export default function AllCard({ item, onPress }: { item: AllItem; onPress?: () => void }) {
  if (item.kind === 'property') {
    return (
      <Pressable style={s.row} onPress={onPress} testID={`allcard-${item.kind}-${(item as any).id}`}>
        <Image source={{ uri: (item as any).images?.[0] }} style={s.thumb} />
        <View style={s.body}>
          <Text numberOfLines={1} style={s.title}>{(item as any).title}</Text>
          <Text style={s.meta}>{(item as any).location?.city}, {(item as any).location?.country}</Text>
          <Text style={s.sub}>★ {(item as any).provider?.rating?.toFixed?.(1) ?? '—'} · {(item as any).provider?.reviewCount ?? 0} avis</Text>
          <Text style={s.price}>{(item as any).price?.toLocaleString?.() ?? ''} {(item as any).currency ?? ''}</Text>
        </View>
      </Pressable>
    );
  }
  if (item.kind === 'trip') {
    return (
      <Pressable style={s.row} onPress={onPress} testID={`allcard-${item.kind}-${(item as any).id}`}>
        <Image source={{ uri: (item as any).image }} style={s.thumb} />
        <View style={s.body}>
          <Text numberOfLines={1} style={s.title}>{(item as any).title}</Text>
          <Text style={s.meta}>{(item as any).city}, {(item as any).country}</Text>
          <Text style={s.sub}>★ {(item as any).rating?.toFixed?.(1) ?? '—'} · {(item as any).reviews ?? 0} avis</Text>
          <Text style={s.price}>{(item as any).price_per_night?.toLocaleString?.() ?? ''} FCFA / nuit</Text>
        </View>
      </Pressable>
    );
  }
  return (
    <Pressable style={s.row} onPress={onPress} testID={`allcard-${item.kind}-${(item as any).id}`}>
      <Image source={{ uri: (item as any).avatar || (item as any).images?.[0] }} style={s.thumb} />
      <View style={s.body}>
        <Text numberOfLines={1} style={s.title}>{(item as any).name}</Text>
        <Text style={s.meta}>{(item as any).location?.city}, {(item as any).location?.country}</Text>
        <Text style={s.sub}>★ {(item as any).rating?.toFixed?.(1) ?? '—'} · {(item as any).reviewCount ?? 0} avis</Text>
        <Text style={s.tag}>Pro</Text>
      </View>
    </Pressable>
  );
}

export function AllCardSkeleton() {
  return (
    <View style={s.row}>
      <View style={[s.thumb, { backgroundColor: '#E5E7EB' }]} />
      <View style={{ flex: 1, gap: 8 }}>
        <View style={sk.block(18, '80%')} />
        <View style={sk.block(14, '60%')} />
        <View style={sk.block(14, '40%')} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  thumb: { width: 92, height: 92, borderRadius: 12, backgroundColor: '#F3F4F6' },
  body: { flex: 1 },
  title: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  meta: { color: '#475569', marginTop: 2 },
  sub: { color: '#64748B', marginTop: 2 },
  price: { marginTop: 4, fontWeight: '900', color: '#0F172A' },
  tag: { marginTop: 4, color: '#0B3B2E', fontWeight: '800' },
});
const sk = { block: (h: number, w: number | string) => ({ height: h, width: w, backgroundColor: '#E5E7EB', borderRadius: 6 }) };
