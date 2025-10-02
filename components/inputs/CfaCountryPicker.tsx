import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { getCfaCountriesList, CfaCountryCode } from '@/constants/cfa';
import { normalize } from '@/utils/text';

type Props = {
  placeholder?: string;
  onSelect: (countryCode: CfaCountryCode) => void;
  selectedCode?: CfaCountryCode;
};

export default function CfaCountryPicker({ placeholder = 'Rechercher un pays', onSelect, selectedCode }: Props) {
  const [query, setQuery] = useState('');
  const countries = getCfaCountriesList();

  const results = React.useMemo(() => {
    const q = normalize(query);
    if (!q) return countries;
    return countries.filter(c => normalize(c.name).includes(q));
  }, [query, countries]);

  return (
    <View>
      <TextInput
        placeholder={placeholder}
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={results}
        keyExtractor={(it) => it.code}
        renderItem={({ item }) => {
          const isSelected = selectedCode === item.code;
          return (
            <Pressable 
              onPress={() => onSelect(item.code)} 
              style={[styles.row, isSelected && styles.rowSelected]}
            >
              <View style={styles.rowContent}>
                <Text style={[styles.title, isSelected && styles.titleSelected]}>{item.name}</Text>
                <Text style={[styles.sub, isSelected && styles.subSelected]}>
                  {item.zone} • {item.currency}
                </Text>
              </View>
            </Pressable>
          );
        }}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#E6E8EC',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontWeight: '700',
    backgroundColor: '#fff',
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    paddingHorizontal: 4,
  },
  rowSelected: {
    backgroundColor: '#F0F9F6',
  },
  rowContent: {
    gap: 2,
  },
  title: {
    fontWeight: '800',
    color: '#0E1B2B',
  },
  titleSelected: {
    color: '#0E6049',
  },
  sub: {
    color: '#6B7280',
    fontWeight: '700',
    fontSize: 12,
  },
  subSelected: {
    color: '#0E6049',
    opacity: 0.7,
  },
  list: {
    maxHeight: 400,
  },
});
