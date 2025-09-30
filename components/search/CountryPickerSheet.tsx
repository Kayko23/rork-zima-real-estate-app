import React, { useMemo } from 'react';
import { Modal, View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import type { Country } from './types';
import { COUNTRY_CITIES, getAllCountries } from '../../constants/countries';

const resolveCountries = (): Country[] => {
  try {
    const fn: unknown = getAllCountries;
    const list = typeof fn === 'function' ? (fn as () => { code: string; name: string }[])() : Object.values(COUNTRY_CITIES);
    return list
      .map((c) => ({ code: c.code, name: c.name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  } catch (e) {
    console.error('[CountryPickerSheet] Failed to resolve countries', e);
    const fallback = Object.values(COUNTRY_CITIES).map((c) => ({ code: c.code, name: c.name })) as Country[];
    return fallback.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }
};

const COUNTRIES: Country[] = resolveCountries();

export default function CountryPickerSheet({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (c: Country) => void;
}): React.ReactElement {
  const data = useMemo(() => COUNTRIES, []);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={s.backdrop} testID="country-picker-backdrop">
        <View style={s.sheet} testID="country-picker-sheet">
          <Text style={s.title}>Choisir un pays</Text>
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
  sheet: { backgroundColor: 'white', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '70%' },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  row: { paddingVertical: 12 },
  name: { fontSize: 16, color: '#0B1D17' },
});
