import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/hooks/useAppStore';
import { currencyForCountry, validateMsisdn, providersForCountry } from '@/utils/mobileMoney';
import type { MobileMoneyProvider } from '@/types';
import { colors, radius } from '@/theme/tokens';

const COUNTRIES = [
  "Sénégal", "Côte d'Ivoire", "Bénin", "Togo", "Mali", "Burkina Faso", "Niger", "Guinée-Bissau",
  "Cameroun", "Gabon", "Congo", "Tchad", "RCA", "Guinée Équatoriale", "Ghana", "Nigeria",
];

export default function AddMobileMoneyScreen() {
  const router = useRouter();
  const { addPaymentMethod } = useApp();
  const [country, setCountry] = useState<string>("Sénégal");
  const [provider, setProvider] = useState<MobileMoneyProvider>('orange');
  const [phone, setPhone] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');

  const currency = currencyForCountry(country);
  const providers = providersForCountry(country);

  useEffect(() => {
    if (!providers.includes(provider)) {
      setProvider(providers[0]);
    }
  }, [country, provider, providers]);

  const onSave = async () => {
    if (!validateMsisdn(country, phone)) {
      Alert.alert('Numéro invalide', 'Vérifie le format du numéro pour le pays choisi.');
      return;
    }
    
    await addPaymentMethod({
      id: `mm_${Date.now()}`,
      type: 'mobile_money',
      isDefault: true,
      provider,
      country,
      phone: phone.replace(/[^\d]/g, ''),
      accountName: accountName || 'Compte Mobile Money',
      currency,
    });
    
    Alert.alert('Ajouté', `${provider.toUpperCase()} • ${country} • ${currency}`);
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={s.container} style={s.scrollView}>
        <Label>Pays</Label>
        <Chips value={country} items={COUNTRIES} onChange={setCountry} />

        <Label>Opérateur</Label>
        <Chips
          value={provider.toUpperCase()}
          items={providers.map(p => p.toUpperCase())}
          onChange={(v) => setProvider(v.toLowerCase() as MobileMoneyProvider)}
        />

        <Label>Titulaire (optionnel)</Label>
        <Input placeholder="Nom du compte" value={accountName} onChangeText={setAccountName} />

        <Label>Téléphone (Mobile Money)</Label>
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
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <Text style={s.label}>{children}</Text>
);

const Input = (props: any) => <TextInput {...props} style={s.input} />;

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
  container: { padding: 16, gap: 12, paddingBottom: 24 },
  label: { fontWeight: '800', marginTop: 6, color: colors.text },
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
  chipTx: { color: colors.text, fontWeight: '700', fontSize: 13 },
  chipTxActive: { color: '#fff' },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 8,
  },
  currencyLabel: { color: colors.sub, fontSize: 14 },
  currencyValue: { fontWeight: '800', color: colors.text, fontSize: 16 },
  cta: {
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaTx: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
