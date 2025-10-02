import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { router } from 'expo-router';

 type FormState = {
  title: string;
  type: 'sale' | 'rent';
  price: string;
  currency: string;
  country: string;
  city: string;
  rooms?: string;
  baths?: string;
  surface?: string;
  description?: string;
  photos: string;
};

export default function NewPropertyScreen() {
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>({
    title: '',
    type: 'rent',
    price: '',
    currency: 'XOF',
    country: '',
    city: '',
    rooms: '',
    baths: '',
    surface: '',
    description: '',
    photos: ''
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const priceNum = Number(form.price);
      if (!form.title || !form.country || !form.city || !priceNum) {
        throw new Error('Veuillez renseigner titre, pays, ville et prix.');
      }
      const body = {
        title: form.title,
        type: form.type,
        price: priceNum,
        currency: form.currency,
        country: form.country,
        city: form.city,
        rooms: form.rooms ? Number(form.rooms) : undefined,
        baths: form.baths ? Number(form.baths) : undefined,
        surface: form.surface ? Number(form.surface) : undefined,
        description: form.description ?? '',
        photos: form.photos ? form.photos.split(/\s*,\s*/).filter(Boolean) : [],
      };
      console.log('[NewProperty] create payload', body);
      return api.createProperty(body);
    },
    onSuccess: async (doc: any) => {
      console.log('[NewProperty] created', doc?.id);
      await qc.invalidateQueries({ predicate: () => true });
      Alert.alert('Succès', 'Annonce créée', [{ text: 'Voir', onPress: () => router.replace({ pathname: '/property/[id]', params: { id: String(doc.id) } }) }]);
    },
    onError: (e: unknown) => {
      console.log('[NewProperty] error', e);
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Impossible de créer l\'annonce');
    }
  });

  const set = useCallback(<K extends keyof FormState>(k: K, v: FormState[K]) => setForm((s) => ({ ...s, [k]: v })), []);

  return (
    <View style={styles.screen} testID="property-new-screen">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }} showsVerticalScrollIndicator={false}>
        <Text style={[styles.h1, { paddingTop: insets.top + 8 }]}>Nouvelle annonce</Text>

        <Field label="Titre">
          <Input value={form.title} onChangeText={(t) => set('title', t)} placeholder="Ex: Appartement moderne" />
        </Field>

        <Field label="Type">
          <View style={styles.row}>
            <Toggle active={form.type === 'rent'} label="Location" onPress={() => set('type', 'rent')} />
            <Toggle active={form.type === 'sale'} label="Vente" onPress={() => set('type', 'sale')} />
          </View>
        </Field>

        <Field label="Prix">
          <View style={styles.row}>
            <Input keyboardType={Platform.select({ ios: 'number-pad', android: 'numeric', default: 'numeric' })} value={form.price} onChangeText={(t) => set('price', t)} placeholder="Ex: 250000" style={{ flex: 1 }} />
            <Input value={form.currency} onChangeText={(t) => set('currency', t)} style={{ width: 90, textAlign: 'center' }} />
          </View>
        </Field>

        <Field label="Localisation">
          <View style={styles.row}>
            <Input value={form.country} onChangeText={(t) => set('country', t)} placeholder="Pays" style={{ flex: 1 }} />
            <Input value={form.city} onChangeText={(t) => set('city', t)} placeholder="Ville" style={{ flex: 1 }} />
          </View>
        </Field>

        <Field label="Détails">
          <View style={styles.row}>
            <Input value={form.rooms} onChangeText={(t) => set('rooms', t)} placeholder="Pièces" keyboardType="number-pad" style={{ flex: 1 }} />
            <Input value={form.baths} onChangeText={(t) => set('baths', t)} placeholder="SDB" keyboardType="number-pad" style={{ flex: 1 }} />
            <Input value={form.surface} onChangeText={(t) => set('surface', t)} placeholder="Surface (m²)" keyboardType="number-pad" style={{ flex: 1 }} />
          </View>
        </Field>

        <Field label="Description">
          <Input value={form.description} onChangeText={(t) => set('description', t)} placeholder="Décrivez le bien" multiline />
        </Field>

        <Field label="Photos (URLs séparées par des virgules)">
          <Input value={form.photos} onChangeText={(t) => set('photos', t)} placeholder="https://..., https://..." multiline />
        </Field>

        <Pressable disabled={createMutation.isPending} onPress={() => createMutation.mutate()} style={[styles.cta, createMutation.isPending && { opacity: 0.6 }]} testID="submit-new">
          <Text style={styles.ctaTxt}>{createMutation.isPending ? 'Création…' : 'Publier l\'annonce'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Field({ label, children }: React.PropsWithChildren<{ label: string }>) {
  return (
    <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function Input(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput {...props} style={[styles.input, props.style]} placeholderTextColor="#94a3b8" />;
}

function Toggle({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.toggle, active && styles.toggleOn]} testID={`toggle-${label}`}>
      <Text style={[styles.toggleTxt, active && styles.toggleOnTxt]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F6F6' },
  h1: { fontSize: 24, fontWeight: '800', color: '#0B3B36', marginHorizontal: 16, marginBottom: 16 },
  label: { fontSize: 13, color: '#475569', marginBottom: 8, fontWeight: '700' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E6EFEC', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, color: '#0B3B36' },
  row: { flexDirection: 'row', gap: 10 },
  toggle: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#E6EFEC', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  toggleOn: { backgroundColor: '#0B6B53', borderColor: '#0B6B53' },
  toggleTxt: { fontWeight: '700', color: '#0B3B36' },
  toggleOnTxt: { color: '#fff' },
  cta: { marginHorizontal: 16, marginTop: 8, marginBottom: 24, height: 52, backgroundColor: '#0B6B53', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  ctaTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
