import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { router } from 'expo-router';
import { assertCanPublish, PublicationGuardError } from '@/lib/proGuards';
import { PublicationGuardModal } from '@/components/pro/PublicationGuardModal';
import { ProStatus } from '@/types/pro';
import { PropertyListingSchema, PropertyListing } from '@/lib/listingSchemas';
import { CheckCircle2 } from 'lucide-react-native';

type FormState = {
  title: string;
  transaction: 'sale' | 'rent' | 'lease';
  price: string;
  currency: 'XOF' | 'GHS' | 'NGN' | 'USD' | 'EUR';
  country: string;
  city: string;
  address: string;
  categoryPath: string[];
  bedrooms?: string;
  bathrooms?: string;
  livingrooms?: string;
  areaM2?: string;
  description: string;
  coverUrl: string;
  gallery: string;
  amenities: string[];
  orientation?: string;
  landmark?: string;
};

export default function NewPropertyScreen() {
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>({
    title: '',
    transaction: 'rent',
    price: '',
    currency: 'XOF',
    country: '',
    city: '',
    address: '',
    categoryPath: ['residential', 'appartement'],
    bedrooms: '',
    bathrooms: '',
    livingrooms: '',
    areaM2: '',
    description: '',
    coverUrl: '',
    gallery: '',
    amenities: [],
    orientation: '',
    landmark: ''
  });

  const [guardModal, setGuardModal] = useState<{
    visible: boolean;
    message: string;
    action?: { label: string; route: string };
  }>({ visible: false, message: '' });

  const proStatus: ProStatus = 'verified';

  const createMutation = useMutation({
    mutationFn: async () => {
      try {
        assertCanPublish(proStatus, true);
      } catch (error) {
        if (error instanceof PublicationGuardError) {
          setGuardModal({
            visible: true,
            message: error.message,
            action: error.action,
          });
          throw error;
        }
        throw error;
      }

      const payload: Partial<PropertyListing> = {
        title: form.title,
        transaction: form.transaction,
        price: {
          amount: Number(form.price),
          currency: form.currency
        },
        country: form.country,
        city: form.city,
        address: form.address,
        categoryPath: form.categoryPath,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        livingrooms: form.livingrooms ? Number(form.livingrooms) : undefined,
        areaM2: form.areaM2 ? Number(form.areaM2) : undefined,
        description: form.description,
        media: {
          coverUrl: form.coverUrl,
          gallery: form.gallery ? form.gallery.split(/\s*,\s*/).filter(Boolean) : []
        },
        amenities: form.amenities,
        orientation: form.orientation,
        isPremium: false,
        isVip: false,
        documents: []
      };

      const validated = PropertyListingSchema.parse(payload);
      console.log('[NewProperty] create payload', validated);
      return api.createProperty(validated);
    },
    onSuccess: async (doc: any) => {
      console.log('[NewProperty] created', doc?.id);
      await qc.invalidateQueries({ predicate: () => true });
      Alert.alert('Succès', 'Annonce créée', [{ text: 'Voir', onPress: () => router.replace({ pathname: '/property/[id]', params: { id: String(doc.id) } }) }]);
    },
    onError: (e: unknown) => {
      console.log('[NewProperty] error', e);
      if (!(e instanceof PublicationGuardError)) {
        Alert.alert('Erreur', e instanceof Error ? e.message : 'Impossible de créer l\'annonce');
      }
    }
  });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((s) => ({ ...s, [k]: v }));

  const toggleAmenity = (amenity: string) => {
    setForm(s => ({
      ...s,
      amenities: s.amenities.includes(amenity)
        ? s.amenities.filter(a => a !== amenity)
        : [...s.amenities, amenity]
    }));
  };

  return (
    <View style={styles.screen} testID="property-new-screen">
      <PublicationGuardModal
        visible={guardModal.visible}
        onClose={() => setGuardModal({ visible: false, message: '' })}
        message={guardModal.message}
        action={guardModal.action}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        <Text style={[styles.h1, { paddingTop: insets.top + 8 }]}>Nouvelle annonce</Text>

        <Field label="Titre">
          <Input value={form.title} onChangeText={(t) => set('title', t)} placeholder="Ex: Appartement moderne" />
        </Field>

        <Field label="Type">
          <View style={styles.row}>
            <Toggle active={form.transaction === 'rent'} label="Location" onPress={() => set('transaction', 'rent')} />
            <Toggle active={form.transaction === 'sale'} label="Vente" onPress={() => set('transaction', 'sale')} />
          </View>
        </Field>

        <Field label="Prix">
          <View style={styles.row}>
            <Input 
              keyboardType={Platform.select({ ios: 'number-pad', android: 'numeric', default: 'numeric' })} 
              value={form.price} 
              onChangeText={(t) => set('price', t)} 
              placeholder="Ex: 250000" 
              style={{ flex: 1 }} 
            />
            <View style={styles.currencyBox}>
              <Text style={styles.currencyText}>{form.currency}</Text>
            </View>
          </View>
        </Field>

        <Field label="Localisation">
          <View style={styles.row}>
            <Input value={form.country} onChangeText={(t) => set('country', t)} placeholder="Pays" style={{ flex: 1 }} />
            <Input value={form.city} onChangeText={(t) => set('city', t)} placeholder="Ville" style={{ flex: 1 }} />
          </View>
          <Input 
            value={form.address} 
            onChangeText={(t) => set('address', t)} 
            placeholder="Adresse complète" 
            style={{ marginTop: 8 }} 
          />
        </Field>

        <Field label="Détails">
          <View style={styles.row}>
            <Input 
              value={form.bedrooms} 
              onChangeText={(t) => set('bedrooms', t)} 
              placeholder="Pièces" 
              keyboardType="number-pad" 
              style={{ flex: 1 }} 
            />
            <Input 
              value={form.bathrooms} 
              onChangeText={(t) => set('bathrooms', t)} 
              placeholder="SDB" 
              keyboardType="number-pad" 
              style={{ flex: 1 }} 
            />
          </View>
          <Input 
            value={form.areaM2} 
            onChangeText={(t) => set('areaM2', t)} 
            placeholder="Surface (m²)" 
            keyboardType="number-pad" 
            style={{ marginTop: 8 }} 
          />
        </Field>

        <Field label="Description">
          <Input 
            value={form.description} 
            onChangeText={(t) => set('description', t)} 
            placeholder="Décrivez le bien (min. 30 caractères)" 
            multiline 
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: 'top' }}
          />
        </Field>

        <Field label="Photos (URLs séparées par des virgules)">
          <Input 
            value={form.coverUrl} 
            onChangeText={(t) => set('coverUrl', t)} 
            placeholder="https://..." 
            style={{ marginBottom: 8 }}
          />
          <Input 
            value={form.gallery} 
            onChangeText={(t) => set('gallery', t)} 
            placeholder="https://..., https://..." 
            multiline 
          />
        </Field>

        <Field label="Équipements">
          <View style={styles.amenitiesGrid}>
            {['Wifi', 'Parking', 'Piscine', 'Climatisation', 'Sécurité 24/7', 'Jardin'].map(amenity => (
              <Pressable
                key={amenity}
                onPress={() => toggleAmenity(amenity)}
                style={[styles.amenityChip, form.amenities.includes(amenity) && styles.amenityChipActive]}
              >
                {form.amenities.includes(amenity) && (
                  <CheckCircle2 size={16} color="#fff" style={{ marginRight: 4 }} />
                )}
                <Text style={[styles.amenityText, form.amenities.includes(amenity) && styles.amenityTextActive]}>
                  {amenity}
                </Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Pressable 
          disabled={createMutation.isPending} 
          onPress={() => createMutation.mutate()} 
          style={[styles.cta, createMutation.isPending && { opacity: 0.6 }]} 
          testID="submit-new"
        >
          <Text style={styles.ctaTxt}>{createMutation.isPending ? 'Création…' : "Publier l'annonce"}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Field({ label, children }: React.PropsWithChildren<{ label: string }>) {
  return (
    <View style={{ marginBottom: 16 }}>
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
  h1: { fontSize: 24, fontWeight: '800', color: '#0B3B36', marginBottom: 16 },
  label: { fontSize: 13, color: '#475569', marginBottom: 8, fontWeight: '700' },
  input: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#E6EFEC', 
    borderRadius: 12, 
    paddingHorizontal: 14, 
    paddingVertical: 12, 
    color: '#0B3B36',
    fontSize: 15
  },
  row: { flexDirection: 'row', gap: 10 },
  toggle: { 
    flex: 1, 
    height: 44, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E6EFEC', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#fff' 
  },
  toggleOn: { backgroundColor: '#0B6B53', borderColor: '#0B6B53' },
  toggleTxt: { fontWeight: '700', color: '#0B3B36', fontSize: 14 },
  toggleOnTxt: { color: '#fff' },
  currencyBox: {
    width: 90,
    height: 44,
    backgroundColor: '#F8FAFB',
    borderWidth: 1,
    borderColor: '#E6EFEC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3B36'
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E6EFEC'
  },
  amenityChipActive: {
    backgroundColor: '#0B6B53',
    borderColor: '#0B6B53'
  },
  amenityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B3B36'
  },
  amenityTextActive: {
    color: '#fff'
  },
  cta: { 
    marginTop: 8, 
    marginBottom: 24, 
    height: 52, 
    backgroundColor: '#0B6B53', 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  ctaTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
