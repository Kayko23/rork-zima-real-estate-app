import React, { useMemo, useState } from 'react';
import { View, FlatList, Text, Pressable, StyleSheet } from 'react-native';
import { VoyageCard } from '@/components/voyages/VoyageCard';
import { mockVoyages } from '@/components/voyages/helpers';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VoyageSearchList() {
  const [sort, setSort] = useState<'popular' | 'priceAsc' | 'priceDesc' | 'rating'>('popular');
  const insets = useSafeAreaInsets();

  const list = useMemo(() => {
    const arr = [...mockVoyages];
    if (sort === 'priceAsc') arr.sort((a, b) => a.price - b.price);
    if (sort === 'priceDesc') arr.sort((a, b) => b.price - a.price);
    if (sort === 'rating') arr.sort((a, b) => b.rating - a.rating);
    return arr;
  }, [sort]);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}> 
      <Stack.Screen options={{ title: 'Résultats' }} />

      <View style={s.toolbar}>
        {(['popular', 'priceAsc', 'priceDesc', 'rating'] as const).map((k) => (
          <Pressable
            key={k}
            onPress={() => setSort(k)}
            style={[s.sortBtn, sort === k ? s.sortBtnActive : undefined]}
            testID={`sort-${k}`}
          >
            <Text style={[s.sortTxt, sort === k ? s.sortTxtActive : undefined]}>
              {k === 'popular' ? 'Pertinence' : k === 'priceAsc' ? 'Prix ↑' : k === 'priceDesc' ? 'Prix ↓' : 'Mieux notés'}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={list}
        keyExtractor={(it) => it.id}
        contentContainerStyle={s.list}
        renderItem={({ item }) => <VoyageCard item={item} onPress={() => {}} />}
        testID="voyage-results-list"
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  toolbar: { paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', gap: 8 },
  sortBtn: { height: 36, paddingHorizontal: 12, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },
  sortBtnActive: { backgroundColor: '#0E5A46' },
  sortTxt: { fontWeight: '800', color: '#111827' },
  sortTxtActive: { color: '#fff' },
  list: { padding: 16, gap: 16, paddingBottom: 120 },
});
