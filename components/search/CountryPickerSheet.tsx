import React, { useMemo, useState } from 'react';
import { Modal, View, Text, FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import type { Country } from './types';
import { getAllCountries } from '../../constants/countries';



export default function CountryPickerSheet({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (c: Country) => void;
}): React.ReactElement {
  const [search, setSearch] = useState("");
  
  const allCountries = useMemo(() => {
    return getAllCountries().map(c => ({ code: c.code, name: c.name }));
  }, []);

  const data = useMemo(() => {
    if (!search.trim()) return allCountries;
    const q = search.toLowerCase();
    return allCountries.filter(c => c.name.toLowerCase().includes(q));
  }, [allCountries, search]);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={() => { onClose(); setSearch(""); }}>
      <View style={s.backdrop} testID="country-picker-backdrop">
        <View style={s.sheet} testID="country-picker-sheet">
          <Text style={s.title}>Choisir un pays</Text>
          <View style={s.searchBox}>
            <Search size={18} color="#6b7280" />
            <TextInput
              style={s.searchInput}
              placeholder="Rechercher un pays..."
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
          </View>
          <FlatList
            data={data}
            keyExtractor={(i) => i.code}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  console.log('[CountryPickerSheet] select', item);
                  onSelect(item);
                  onClose();
                  setSearch("");
                }}
                style={s.row}
                testID={`country-row-${item.code}`}
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
