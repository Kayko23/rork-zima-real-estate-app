import React, { useMemo, useState } from 'react';
import { Modal, View, Text, FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import type { City } from './types';
import { getCitiesByCountryCode } from '@/constants/countries';

export default function CityPickerSheet({
  visible,
  onClose,
  countryCode,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  countryCode: string | null;
  onSelect: (v: City) => void;
}): React.ReactElement {
  const [search, setSearch] = useState("");

  const allCities = useMemo(() => {
    if (!countryCode) return [];
    const cityNames = getCitiesByCountryCode(countryCode);
    return cityNames.map((name, idx) => ({ id: `${countryCode}-${idx}`, name, countryCode }));
  }, [countryCode]);

  const cities = useMemo(() => {
    if (!search.trim()) return allCities;
    const q = search.toLowerCase();
    return allCities.filter(c => c.name.toLowerCase().includes(q));
  }, [allCities, search]);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={() => { onClose(); setSearch(""); }}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <Text style={s.title}>Choisir une ville</Text>
          <View style={s.searchBox}>
            <Search size={18} color="#6b7280" />
            <TextInput
              style={s.searchInput}
              placeholder="Rechercher une ville..."
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
          </View>
          <FlatList
            data={cities}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onSelect(item);
                  onClose();
                  setSearch("");
                }}
                style={s.row}
              >
                <Text style={s.name}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: 'white', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '80%' },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 12, marginBottom: 12, gap: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 16 },
  row: { paddingVertical: 12 },
  name: { fontSize: 16, color: '#0B1D17' },
});
