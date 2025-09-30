import React, { useMemo } from 'react';
import { Modal, View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import type { Country } from './types';
import { getAllCountries } from '../../constants/countries';

const COUNTRIES: Country[] = getAllCountries()
  .map(c => ({ code: c.code, name: c.name }))
  .sort((a, b) => a.name.localeCompare(b.name, 'fr'));

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
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <Text style={s.title}>Choisir un pays</Text>
          <FlatList
            data={data}
            keyExtractor={(i) => i.code}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onSelect(item);
                  onClose();
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
  sheet: { backgroundColor: 'white', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '70%' },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  row: { paddingVertical: 12 },
  name: { fontSize: 16, color: '#0B1D17' },
});
