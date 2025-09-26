import React, { useMemo } from 'react';
import { Modal, View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import type { City } from './types';

const CITIES: City[] = [
  { id: 'abj', name: 'Abidjan', countryCode: 'CI' },
  { id: 'yop', name: 'Yopougon', countryCode: 'CI' },
  { id: 'dk', name: 'Dakar', countryCode: 'SN' },
  { id: 'th', name: 'Thies', countryCode: 'SN' },
  { id: 'acc', name: 'Accra', countryCode: 'GH' },
  { id: 'lag', name: 'Lagos', countryCode: 'NG' },
  { id: 'abjng', name: 'Abuja', countryCode: 'NG' },
  { id: 'lom', name: 'Lomé', countryCode: 'TG' },
  { id: 'cotonou', name: 'Cotonou', countryCode: 'BJ' },
  { id: 'yao', name: 'Yaoundé', countryCode: 'CM' },
  { id: 'lib', name: 'Libreville', countryCode: 'GA' },
];

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
  const cities = useMemo(() => (countryCode ? CITIES.filter((c) => c.countryCode === countryCode) : CITIES), [countryCode]);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <Text style={s.title}>Choisir une ville</Text>
          <FlatList
            data={cities}
            keyExtractor={(i) => i.id}
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
