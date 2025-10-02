import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { loadCitiesByCountry, CityItem } from '../data/cities';
import { normalize } from '../utils/text';
import { isCfaCountry } from '@/constants/cfa';

type Props = {
  country?: string;              // code pays (ex: 'CI')
  placeholder?: string;
  onSelect: (fullLabel: string) => void; // ex "Abidjan, Côte d'Ivoire"
};

export default function CityPicker({ country, placeholder='Rechercher une ville', onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<CityItem[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!country) { setSource([]); return; }
      if (!isCfaCountry(country)) { setSource([]); return; }
      const data = await loadCitiesByCountry(country);
      if (mounted) setSource(data);
    })();
    return () => { mounted = false; };
  }, [country]);

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return source.slice(0, 50);
    return source
      .filter(c => normalize(c.n).includes(q) || (c.a && normalize(c.a).includes(q)))
      .slice(0, 100);
  }, [query, source]);

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
        keyExtractor={(it, idx) => it.n + idx}
        renderItem={({item}) => (
          <Pressable onPress={() => onSelect(item.n)} style={styles.row}>
            <Text style={styles.title}>{item.n}</Text>
            {!!item.a && <Text style={styles.sub}>{item.a}</Text>}
          </Pressable>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth:1, borderColor:'#E6E8EC', borderRadius:14, paddingHorizontal:12, paddingVertical:10, fontWeight:'700'
  },
  row: { paddingVertical:12, borderBottomWidth:1, borderBottomColor:'#F0F2F5', paddingHorizontal:4 },
  title: { fontWeight:'800' },
  sub: { color:'#6B7280', fontWeight:'700', marginTop:2 },
  list: { maxHeight: 320 }
});