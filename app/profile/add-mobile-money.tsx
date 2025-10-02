import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/hooks/useAppStore';
import { currencyForCountry, validateMsisdn, providersForCountry } from '@/utils/mobileMoney';
import type { MobileMoneyProvider } from '@/types';
import { colors, radius } from '@/theme/tokens';
import { getCfaCountriesList, CfaCountryCode } from '@/constants/cfa';

const CFA_COUNTRIES_LIST = getCfaCountriesList();

export default function AddMobileMoneyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addPaymentMethod } = useApp();
  const [countryCode, setCountryCode] = useState<CfaCountryCode>('SN');
  const [provider, setProvider] = useState<MobileMoneyProvider>('orange');
  const [phone, setPhone] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');

  const currency = currencyForCountry(countryCode);
  const providers = providersForCountry(countryCode);
  const countryName = CFA_COUNTRIES_LIST.find(c => c.code === countryCode)?.name ?? 'Sénégal';

  useEffect(() => {
    if (!providers.includes(provider)) {
      setProvider(providers[0]);
    }
  }, [countryCode, provider, providers]);

  const onSave = async () => {
    if (!validateMsisdn(countryCode, phone)) {
      Alert.alert('Numéro invalide', 'Vérifie le format du numéro pour le pays choisi.');
      return;
    }
    
    await addPaymentMethod({
      id: `mm_${Date.now()}`,
      type: 'mobile_money',
      isDefault: true,
      provider,
      countryCode,
      phone: phone.replace(/[^\d]/g, ''),
      accountName: accountName || 'Compte Mobile Money',
      currency,
    });
    
    Alert.alert('Ajouté', `${provider.toUpperCase()} • ${countryName} • ${currency}`);
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Ajouter Mobile Money', headerShown: true }} />
      <ScrollView 
        contentContainerStyle={[s.container, { paddingBottom: insets.bottom + 24 }]} 
        style={s.scrollView}
      >
        <Label><Text>Pays</Text></Label>
        <CountryChips value={countryCode} onChange={setCountryCode} />

        <Label><Text>Opérateur</Text></Label>
        <Chips
          value={provider.toUpperCase()}
          items={providers.map(p => p.toUpperCase())}
          onChange={(v) => setProvider(v.toLowerCase() as MobileMoneyProvider)}
        />

        <Label><Text>Titulaire (optionnel)</Text></Label>
        <Input placeholder="Nom du compte" value={accountName} onChangeText={setAccountName} />

        <Label><Text>Téléphone (Mobile Money)</Text></Label>
        <Input
          placeholder="ex: 770000000"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <View style={s.currencyRow}>
          <Text style={s.currencyLabel}>Devise détectée</Text>
          <Text style={s.currencyValue}>{currency}</Text>
        </View>

        <Pressable onPress={onSave} style={s.cta}>
          <Text style={s.ctaTx}>Enregistrer</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <View style={s.label}>{children}</View>
);

const Input = (props: any) => <TextInput {...props} style={s.input} />;

const CountryChips = ({
  value,
  onChange,
}: {
  value: CfaCountryCode;
  onChange: (v: CfaCountryCode) => void;
}) => (
  <View style={s.chipsContainer}>
    {CFA_COUNTRIES_LIST.map((country) => (
      <Pressable
        key={country.code}
        onPress={() => onChange(country.code)}
        style={[s.chip, value === country.code && s.chipActive]}
      >
        <Text style={[s.chipTx, value === country.code && s.chipTxActive]}>
          {country.name}
        </Text>
      </Pressable>
    ))}
  </View>
);

const Chips = ({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <View style={s.chipsContainer}>
    {items.map((it) => (
      <Pressable
        key={it}
        onPress={() => onChange(it)}
        style={[s.chip, value === it && s.chipActive]}
      >
        <Text style={[s.chipTx, value === it && s.chipTxActive]}>{it}</Text>
      </Pressable>
    ))}
  </View>
);

const s = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 16, gap: 12 },
  label: { fontWeight: '800' as const, marginTop: 6 },
  input: {
    backgroundColor: colors.panel,
    borderColor: colors.muted,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    height: 46,
    color: colors.text,
  },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.muted,
    backgroundColor: colors.panel,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTx: { color: colors.text, fontWeight: '700' as const, fontSize: 13 },
  chipTxActive: { color: '#fff' },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 8,
  },
  currencyLabel: { color: colors.sub, fontSize: 14 },
  currencyValue: { fontWeight: '800' as const, color: colors.text, fontSize: 16 },
  cta: {
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaTx: { color: '#fff', fontWeight: '800' as const, fontSize: 15 },
});
