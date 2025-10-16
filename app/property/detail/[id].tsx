import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import MediaCarousel from '@/components/detail/MediaCarousel';
import Section from '@/components/detail/Section';
import Chip from '@/components/detail/Chip';
import Divider from '@/components/detail/Divider';
import { fmtMoney } from '@/utils/money';

export type PropertyDetailParams = {
  id: string;
  title: string;
  city: string;
  country?: string;
  images?: string[];
  price?: number;
  currency?: string;
  listingType: 'A_VENDRE' | 'A_LOUER';
  area?: number;
  beds?: number;
  baths?: number;
  rooms?: number;
  rating?: number;
  description?: string;
  amenities?: string[];
  contact?: { phone?: string; whatsapp?: string; email?: string };
  addressLine?: string;
  coordinates?: { lat: number; lng: number };
};

export default function PropertyDetail() {
  const params = useLocalSearchParams();
  
  const p: PropertyDetailParams = {
    id: String(params.id || ''),
    title: String(params.title || 'Propriété'),
    city: String(params.city || ''),
    country: params.country ? String(params.country) : undefined,
    images: params.images ? JSON.parse(String(params.images)) : [],
    price: params.price ? Number(params.price) : undefined,
    currency: params.currency ? String(params.currency) : 'XOF',
    listingType: (params.listingType as 'A_VENDRE' | 'A_LOUER') || 'A_VENDRE',
    area: params.area ? Number(params.area) : undefined,
    beds: params.beds ? Number(params.beds) : undefined,
    baths: params.baths ? Number(params.baths) : undefined,
    rooms: params.rooms ? Number(params.rooms) : undefined,
    rating: params.rating ? Number(params.rating) : undefined,
    description: params.description ? String(params.description) : undefined,
    amenities: params.amenities ? JSON.parse(String(params.amenities)) : [],
    contact: params.contact ? JSON.parse(String(params.contact)) : {},
    addressLine: params.addressLine ? String(params.addressLine) : undefined,
  };

  const openTel = (num?: string) => num && Linking.openURL(`tel:${num}`);
  const openWA = (num?: string) => num && Linking.openURL(`https://wa.me/${num.replace(/\D/g, '')}`);
  const openMail = (m?: string) => m && Linking.openURL(`mailto:${m}`);

  const openMap = () => {
    const q = encodeURIComponent(p.addressLine || `${p.city}, ${p.country || ''}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
  };

  return (
    <>
      <Stack.Screen options={{ title: p.title, headerShown: true }} />
      <ScrollView style={styles.container}>
        <MediaCarousel images={p.images} />

        <Section title={p.title}>
          <Text style={styles.locationText}>
            {p.city}
            {p.country ? ` • ${p.country}` : ''}
            {p.rating ? ` • ★ ${p.rating}` : ''}
          </Text>
          {typeof p.price === 'number' && (
            <Text style={styles.priceText}>
              {fmtMoney(p.price, p.currency || 'XOF')} {p.listingType === 'A_LOUER' ? '/ mois' : ''}
            </Text>
          )}
          <View style={styles.chipsRow}>
            {!!p.area && <Chip label={`${p.area} m²`} />}
            {!!p.rooms && <Chip label={`${p.rooms} pièces`} />}
            {!!p.beds && <Chip label={`${p.beds} ch`} />}
            {!!p.baths && <Chip label={`${p.baths} sdb`} />}
            <Chip label={p.listingType === 'A_VENDRE' ? 'À vendre' : 'À louer'} />
          </View>
        </Section>

        {p.description ? (
          <Section title="Description">
            <Text style={styles.descText}>{p.description}</Text>
          </Section>
        ) : null}

        {!!p.amenities?.length && (
          <Section title="Équipements">
            <View style={styles.chipsRow}>
              {p.amenities.map((a, i) => (
                <Chip key={i} label={a} />
              ))}
            </View>
          </Section>
        )}

        <Section title="Localisation">
          <TouchableOpacity onPress={openMap}>
            <Text style={styles.linkText}>{p.addressLine || `${p.city}, ${p.country || ''}`}</Text>
          </TouchableOpacity>
        </Section>

        <Divider />

        <Section title="Contacter">
          <View style={styles.buttonsRow}>
            <ActionButton label="Appeler" onPress={() => openTel(p.contact?.phone)} />
            <ActionButton label="WhatsApp" onPress={() => openWA(p.contact?.whatsapp || p.contact?.phone)} />
            <ActionButton label="Email" onPress={() => openMail(p.contact?.email)} />
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
  linkText: { color: '#0E9F6E', fontWeight: '800' as const },
  buttonsRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  actionButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionButtonText: { color: '#fff', fontWeight: '800' as const },
});
