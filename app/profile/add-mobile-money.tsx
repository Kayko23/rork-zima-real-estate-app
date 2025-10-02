import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/hooks/useAppStore';
import { currencyForCountry, validateMsisdn } from '@/utils/mobileMoney';
import type { MobileMoneyProvider } from '@/types';
import { colors, radius } from '@/theme/tokens';
import { ChevronLeft } from 'lucide-react-native';

const COUNTRIES = [
  'Sénégal', "Côte d'Ivoire", 'Bénin', 'Togo', 'Mali', 'Burkina Faso', 'Niger', 'Guinée-Bissau',
  'Cameroun', 'Gabon', 'Congo', 'Tchad', 'RCA', 'Guinée Équatoriale',
  'Ghana', 'Nigeria',
];

const PROVIDERS: { key: MobileMoneyProvider; label: string }[] = [
  { key: 'orange', label: 'Orange Money' },
  { key: 'mtn', label: 'MTN MoMo' },
  { key: 'moov', label: 'Moov Money' },
  { key: 'wave', label: 'Wave' },
];

export default function AddMobileMoneyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addPaymentMethod } = useApp();
  const [country, setCountry] = useState<string>('Sénégal');
  const [provider, setProvider] = useState<MobileMoneyProvider>('orange');
  const [phone, setPhone] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');

  const currency = currencyForCountry(country);

  const onSave = async () => {
    if (!validateMsisdn(country, phone)) {
      Alert.alert('Numéro invalide', 'Vérifie le format du numéro pour le pays choisi.');
      return;
    }
    
    const id = `mm_${Date.now()}`;
    await addPaymentMethod({
      id,
      type: 'mobile_money',
      isDefault: false,
      provider,
      country,
      phone: phone.replace(/[^\d]/g, ''),
      accountName: accountName || 'Compte Mobile Money',
      currency,
    });
    
    Alert.alert('Ajouté', `Mobile money ${PROVIDERS.find(p => p.key === provider)?.label} — ${currency}`);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Ajouter Mobile Money',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <ChevronLeft color={colors.text} size={24} />
            </Pressable>
          ),
        }}
      />
      
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.label}>Pays</Text>
        <ChipRow items={COUNTRIES} value={country} onChange={setCountry} />

        <Text style={s.label}>Opérateur</Text>
        <View style={s.providerGrid}>
          {PROVIDERS.map(p => (
            <Pressable
              key={p.key}
              onPress={() => setProvider(p.key)}
              style={[s.providerChip, provider === p.key && s.providerChipActive]}
            >
              <Text style={[s.providerText, provider === p.key && s.providerTextActive]}>
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>Titulaire (optionnel)</Text>
        <TextInput
          placeholder="Nom du compte"
          value={accountName}
          onChangeText={setAccountName}
          style={s.input}
          placeholderTextColor={colors.sub}
        />

        <Text style={s.label}>Téléphone (Mobile Money)</Text>
        <TextInput
          placeholder="ex: 770000000"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          style={s.input}
          placeholderTextColor={colors.sub}
        />

        <View style={s.currencyRow}>
          <Text style={s.currencyLabel}>Devise détectée</Text>
          <Text style={s.currencyValue}>{currency}</Text>
        </View>

        <Pressable onPress={onSave} style={s.cta}>
          <Text style={s.ctaText}>Enregistrer</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function ChipRow({ items, value, onChange }: { items: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <View style={s.chipRow}>
      {items.map(it => (
        <Pressable
          key={it}
          onPress={() => onChange(it)}
          style={[s.chip, value === it && s.chipActive]}
        >
          <Text style={[s.chipText, value === it && s.chipTextActive]}>{it}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { padding: 16, gap: 16, paddingBottom: 40 },
  label: { fontWeight: '800', color: colors.text, fontSize: 15 },
  input: {
    backgroundColor: colors.panel,
    borderColor: colors.muted,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: colors.text,
  },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.muted,
    backgroundColor: colors.panel,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: '700', fontSize: 13 },
  chipTextActive: { color: '#fff' },
  providerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  providerChip: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.muted,
    backgroundColor: colors.panel,
    alignItems: 'center',
  },
  providerChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  providerText: { color: colors.text, fontWeight: '700', fontSize: 14 },
  providerTextActive: { color: '#fff' },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
  },
  currencyLabel: { color: colors.text, fontWeight: '600' },
  currencyValue: { color: colors.primary, fontWeight: '800', fontSize: 16 },
  cta: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
