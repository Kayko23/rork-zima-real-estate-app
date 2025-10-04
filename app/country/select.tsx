import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, TextInput, Switch, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { COUNTRIES } from '@/data/countries';
import { useSettings } from '@/hooks/useSettings';

export default function CountrySelect() {
  const { country, setCountry, allowAllCountries, setAllowAllCountries } = useSettings();
  const [q, setQ] = useState<string>('');
  const router = useRouter();
  const segments = useSegments();

  const data = useMemo(() => COUNTRIES.filter((c) => c.name_fr.toLowerCase().includes(q.toLowerCase()) || c.name_en.toLowerCase().includes(q.toLowerCase())), [q]);

  const onPick = useCallback(
    async (code: string) => {
      const c = COUNTRIES.find((x) => x.code === code);
      if (c) {
        await setCountry(c);
        const seg0 = segments[0];
        if (seg0 === '(onboarding)' || seg0 === 'country') {
          router.replace('/');
        } else {
          try {
            router.back();
          } catch (_) {
            router.replace('/');
          }
        }
      }
    },
    [router, setCountry, segments]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisir un pays</Text>

      <TextInput
        testID="country-search-input"
        placeholder="Rechercher un pays…"
        value={q}
        onChangeText={setQ}
        style={styles.search}
      />

      <FlatList
        data={data}
        keyExtractor={(it) => it.code}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            testID={`country-item-${item.code}`}
            onPress={() => onPick(item.code)}
            style={[styles.item, item.code === country?.code ? styles.itemActive : undefined]}
          >
            <Text style={styles.itemText}>
              {item.flag}  {item.name_fr}
            </Text>
            {item.code === country?.code ? <Text style={styles.activeLabel}>Actif</Text> : null}
          </Pressable>
        )}
      />

      <View style={styles.switchRow}>
        <Switch testID="toggle-allow-all" value={allowAllCountries} onValueChange={setAllowAllCountries} />
        <Text>Voir des biens de tous les pays</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '800' as const },
  search: { backgroundColor: '#f1f5f9', borderRadius: 12, paddingHorizontal: 14, height: 44 },
  listContent: { paddingVertical: 8, gap: 8 },
  item: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 8,
  },
  itemActive: { backgroundColor: '#e8f1ee', borderColor: '#0e5a43' },
  itemText: { fontSize: 18 },
  activeLabel: { color: '#0e5a43', fontWeight: '700' as const },
  switchRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 10, marginTop: 8 },
});
