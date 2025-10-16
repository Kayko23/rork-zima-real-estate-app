import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import MediaCarousel from '@/components/detail/MediaCarousel';
import Section from '@/components/detail/Section';
import Chip from '@/components/detail/Chip';
import Divider from '@/components/detail/Divider';
import { fmtMoney } from '@/utils/money';

export type TravelDetailParams = {
  id: string;
  title: string;
  city: string;
  country?: string;
  images?: string[];
  rating?: number;
  pricePerNight?: number;
  currency?: string;
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  description?: string;
  addressLine?: string;
  contact?: { phone?: string; whatsapp?: string; email?: string; website?: string };
  policies?: string[];
};

export default function TravelDetail() {
  const params = useLocalSearchParams();

  const d: TravelDetailParams = {
    id: String(params.id || ''),
    title: String(params.title || 'Hébergement'),
    city: String(params.city || ''),
    country: params.country ? String(params.country) : undefined,
    images: params.images ? JSON.parse(String(params.images)) : [],
    rating: params.rating ? Number(params.rating) : undefined,
    pricePerNight: params.pricePerNight ? Number(params.pricePerNight) : undefined,
    currency: params.currency ? String(params.currency) : 'XOF',
    guests: params.guests ? Number(params.guests) : undefined,
    bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
    bathrooms: params.bathrooms ? Number(params.bathrooms) : undefined,
    amenities: params.amenities ? JSON.parse(String(params.amenities)) : [],
    description: params.description ? String(params.description) : undefined,
    contact: params.contact ? JSON.parse(String(params.contact)) : {},
    policies: params.policies ? JSON.parse(String(params.policies)) : [],
  };

  const openTel = (num?: string) => num && Linking.openURL(`tel:${num}`);
  const openWA = (num?: string) => num && Linking.openURL(`https://wa.me/${num.replace(/\D/g, '')}`);
  const openMail = (m?: string) => m && Linking.openURL(`mailto:${m}`);
  const openWeb = (u?: string) => u && Linking.openURL(u);

  return (
    <>
      <Stack.Screen options={{ title: d.title, headerShown: true }} />
      <ScrollView style={styles.container}>
        <MediaCarousel images={d.images} />

        <Section title={d.title}>
          <Text style={styles.locationText}>
            {d.city}
            {d.country ? ` • ${d.country}` : ''}
            {d.rating ? ` • ★ ${d.rating}` : ''}
          </Text>
          {typeof d.pricePerNight === 'number' && (
            <Text style={styles.priceText}>{fmtMoney(d.pricePerNight, d.currency || 'XOF')} / nuit</Text>
          )}
          <View style={styles.chipsRow}>
            {!!d.guests && <Chip label={`${d.guests} voyageurs`} />}
            {!!d.bedrooms && <Chip label={`${d.bedrooms} ch`} />}
            {!!d.bathrooms && <Chip label={`${d.bathrooms} sdb`} />}
          </View>
        </Section>

        {d.description ? (
          <Section title="Description">
            <Text style={styles.descText}>{d.description}</Text>
          </Section>
        ) : null}

        {!!d.amenities?.length && (
          <Section title="Équipements">
            <View style={styles.chipsRow}>
              {d.amenities.map((a, i) => (
                <Chip key={i} label={a} />
              ))}
            </View>
          </Section>
        )}

        {!!d.policies?.length && (
          <Section title="Politiques">
            {d.policies.map((p, i) => (
              <Text key={i} style={styles.policyText}>
                • {p}
              </Text>
            ))}
          </Section>
        )}

        <Section title="Contact">
          <View style={styles.buttonsRow}>
            <ActionButton label="Appeler" onPress={() => openTel(d.contact?.phone)} />
            <ActionButton label="WhatsApp" onPress={() => openWA(d.contact?.whatsapp || d.contact?.phone)} />
            <ActionButton label="Email" onPress={() => openMail(d.contact?.email)} />
            <ActionButton label="Site web" onPress={() => openWeb(d.contact?.website)} />
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
  policyText: { color: '#334155', marginBottom: 6 },
  buttonsRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  actionButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionButtonText: { color: '#fff', fontWeight: '800' as const },
});
