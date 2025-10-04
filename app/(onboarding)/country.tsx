import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '@/hooks/useSettings';
import { COUNTRIES } from '@/data/countries';
import { t } from '@/lib/i18n';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

import { useApp } from '@/hooks/useAppStore';

export default function CountryScreen() {
  const { locale, setCountry } = useSettings();
  const { completeOnboarding } = useApp();
  const L = t(locale ?? 'fr');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<string | null>(null);
  const router = useRouter();

  const filtered = COUNTRIES.filter((c) =>
    (c.name_fr + c.name_en).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>{L.chooseCountry}</Text>
      <TextInput
        placeholder={L.searchCountry}
        style={styles.searchInput}
        value={q}
        onChangeText={setQ}
      />

      <FlatList
        data={filtered}
        numColumns={3}
        keyExtractor={(it) => it.code}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSel(item.code)}
            style={[
              styles.countryCard,
              sel === item.code && styles.countryCardSelected,
            ]}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <Text style={styles.countryName}>
              {locale === 'en' ? item.name_en : item.name_fr}
            </Text>
            <Text style={styles.region}>{item.region}</Text>
          </Pressable>
        )}
      />

      <View style={styles.footer}>
        <Pressable
          disabled={!sel}
          onPress={async () => {
            const country = COUNTRIES.find((c) => c.code === sel);
            if (!country) return;
            await setCountry(country);
            await completeOnboarding();
            router.replace('/(tabs)/home');
          }}
          style={[styles.nextButton, !sel && styles.nextButtonDisabled]}
        >
          <Text style={styles.nextButtonText}>{L.next}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 8,
  },
  searchInput: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    padding: 12,
    marginBottom: 12,
  },
  columnWrapper: {
    gap: 10,
  },
  listContent: {
    gap: 10,
    paddingBottom: 100,
  },
  countryCard: {
    flex: 1,
    minHeight: 100,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 6,
  },
  countryCardSelected: {
    borderColor: '#0e5a43',
    backgroundColor: '#e8f1ee',
  },
  flag: {
    fontSize: 28,
  },
  countryName: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
  },
  region: {
    fontSize: 10,
    color: '#6b7280',
  },
  footer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
  },
  nextButton: {
    backgroundColor: '#0e5a43',
    padding: 18,
    borderRadius: 16,
  },
  nextButtonDisabled: {
    backgroundColor: '#cfd8d5',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
});
