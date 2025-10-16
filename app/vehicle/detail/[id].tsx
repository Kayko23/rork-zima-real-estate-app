import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import MediaCarousel from '@/components/detail/MediaCarousel';
import Section from '@/components/detail/Section';
import Chip from '@/components/detail/Chip';
import Divider from '@/components/detail/Divider';
import { fmtMoney } from '@/utils/money';

export type VehicleDetailParams = {
  id: string;
  title: string;
  city: string;
  country?: string;
  images?: string[];
  rating?: number;
  forRent?: boolean;
  pricePerDay?: number;
  price?: number;
  currency?: string;
  seats?: number;
  fuel?: 'diesel' | 'essence' | 'electrique' | 'hybride' | 'gpl' | 'autre';
  transmission?: 'auto' | 'manuelle';
  doors?: number;
  luggage?: number;
  description?: string;
  agency?: { name?: string; verified?: boolean };
  driver?: { name?: string; years?: number; languages?: string[] };
  contact?: { phone?: string; whatsapp?: string; email?: string };
};

const fuelLabel: Record<string, string> = {
  diesel: 'Diesel',
  essence: 'Essence',
  electrique: 'Électrique',
  hybride: 'Hybride',
  gpl: 'GPL',
  autre: 'Autre',
};

const transLabel: Record<string, string> = {
  auto: 'Auto',
  manuelle: 'Manuelle',
};

export default function VehicleDetail() {
  const params = useLocalSearchParams();

  const v: VehicleDetailParams = {
    id: String(params.id || ''),
    title: String(params.title || 'Véhicule'),
    city: String(params.city || ''),
    country: params.country ? String(params.country) : undefined,
    images: params.images ? JSON.parse(String(params.images)) : [],
    rating: params.rating ? Number(params.rating) : undefined,
    forRent: params.forRent === 'true',
    pricePerDay: params.pricePerDay ? Number(params.pricePerDay) : undefined,
    price: params.price ? Number(params.price) : undefined,
    currency: params.currency ? String(params.currency) : 'XOF',
    seats: params.seats ? Number(params.seats) : undefined,
    fuel: params.fuel as any,
    transmission: params.transmission as any,
    doors: params.doors ? Number(params.doors) : undefined,
    luggage: params.luggage ? Number(params.luggage) : undefined,
    description: params.description ? String(params.description) : undefined,
    agency: params.agency ? JSON.parse(String(params.agency)) : undefined,
    driver: params.driver ? JSON.parse(String(params.driver)) : undefined,
    contact: params.contact ? JSON.parse(String(params.contact)) : {},
  };

  const openTel = (n?: string) => n && Linking.openURL(`tel:${n}`);
  const openWA = (n?: string) => n && Linking.openURL(`https://wa.me/${n.replace(/\D/g, '')}`);
  const openMail = (m?: string) => m && Linking.openURL(`mailto:${m}`);

  return (
    <>
      <Stack.Screen options={{ title: v.title, headerShown: true }} />
      <ScrollView style={styles.container}>
        <MediaCarousel images={v.images} />

        <Section title={v.title}>
          <Text style={styles.locationText}>
            {v.city}
            {v.country ? ` • ${v.country}` : ''}
            {v.rating ? ` • ★ ${v.rating}` : ''}
          </Text>
          {v.forRent && typeof v.pricePerDay === 'number' ? (
            <Text style={styles.priceText}>{fmtMoney(v.pricePerDay, v.currency || 'XOF')} / jour</Text>
          ) : typeof v.price === 'number' ? (
            <Text style={styles.priceText}>{fmtMoney(v.price, v.currency || 'XOF')}</Text>
          ) : null}
          <View style={styles.chipsRow}>
            {!!v.seats && <Chip label={`${v.seats} places`} />}
            {!!v.fuel && <Chip label={fuelLabel[v.fuel] || v.fuel} />}
            {!!v.transmission && <Chip label={transLabel[v.transmission] || v.transmission} />}
            {!!v.doors && <Chip label={`${v.doors} portes`} />}
            {!!v.luggage && <Chip label={`${v.luggage} bag.`} />}
          </View>
        </Section>

        {v.description ? (
          <Section title="Description">
            <Text style={styles.descText}>{v.description}</Text>
          </Section>
        ) : null}

        {v.agency?.name || v.driver?.name ? (
          <Section title="Opérateur">
            {v.agency?.name && (
              <Text style={styles.boldText}>
                {v.agency.name} {v.agency.verified ? '• Vérifiée ✓' : ''}
              </Text>
            )}
            {v.driver?.name && (
              <View style={{ marginTop: 6 }}>
                <Text style={styles.boldText}>{v.driver.name}</Text>
                {!!v.driver.years && <Text style={styles.descText}>{v.driver.years} ans d&apos;expérience</Text>}
                {!!v.driver.languages?.length && (
                  <Text style={styles.descText}>Langues : {v.driver.languages.join(', ')}</Text>
                )}
              </View>
            )}
          </Section>
        ) : null}

        <Section title="Contacter">
          <View style={styles.buttonsRow}>
            <ActionButton label="Appeler" onPress={() => openTel(v.contact?.phone)} />
            <ActionButton label="WhatsApp" onPress={() => openWA(v.contact?.whatsapp || v.contact?.phone)} />
            <ActionButton label="Email" onPress={() => openMail(v.contact?.email)} />
          </View>
        </Section>

        <Divider />
      </ScrollView>
    </>
  );
}

function ActionButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.actionButton}>
      <Text style={styles.actionButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  locationText: { color: '#334155', fontWeight: '700' as const, marginBottom: 6 },
  priceText: { fontSize: 22, fontWeight: '900' as const, color: '#0F172A' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  descText: { color: '#334155', lineHeight: 20 },
  boldText: { color: '#0F172A', fontWeight: '800' as const },
  buttonsRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  actionButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionButtonText: { color: '#fff', fontWeight: '800' as const },
});
