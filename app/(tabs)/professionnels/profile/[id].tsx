import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, Pressable, Share, Linking, Alert, Platform, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, Feather } from '@expo/vector-icons';
import { providers } from '@/constants/professionals';

type Listing = {
  id: string;
  title: string;
  city: string;
  area: string;
  priceLabel: string;
  badge?: 'À vendre' | 'À louer';
  thumb: string;
};

type Review = {
  id: string;
  author: string;
  dateLabel: string;
  rating: number;
  text: string;
};

type Pro = {
  id: string;
  name: string;
  role: 'Agent' | 'Agence';
  city: string;
  country: string;
  avatar: string;
  cover: string;
  premium: boolean;
  verified: boolean;
  specialties: string[];
  languages: string[];
  zones: string[];
  rating: number;
  ratingsCount: number;
  listings: Listing[];
  reviews: Review[];
  phone?: string;
  whatsapp?: string;
  email?: string;
};

const palette = {
  bg: '#EFF3F2',
  card: '#FFFFFF',
  text: '#0E3B33',
  muted: '#6B7C77',
  border: '#E1E7E5',
  teal: '#0C584F',
  tealDark: '#0A4A42',
  gold: '#A97B2F',
  violet: '#5746E6',
  chip: '#EDF3F2',
  success: '#1DBF73',
};

function Chip({ label, tone = 'default' as const, icon }: { label: string; tone?: 'default' | 'soft'; icon?: React.ReactNode }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: tone === 'soft' ? palette.chip : palette.card,
        borderWidth: tone === 'soft' ? 0 : 1,
        borderColor: palette.border,
      }}
      testID={`chip-${label}`}
    >
      {icon ? icon : null}
      <Text style={{ color: palette.text, fontSize: 15 }}>{label}</Text>
    </View>
  );
}

function Badge({ label, color = palette.gold, icon }: { label: string; color?: string; icon?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FFF', borderRadius: 999, borderWidth: 1, borderColor: palette.border }}>
      {icon ? icon : null}
      <Text style={{ color: palette.text, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}

export default function ProviderProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<'overview' | 'listings' | 'reviews'>('overview');
  const [faved, setFaved] = useState<boolean>(false);

  const pro: Pro = useMemo(() => {
    const providerData = providers.find(p => p.id === id);
    if (!providerData) {
      // Fallback data
      return {
        id: 'p16',
        name: 'Chioma Okafor',
        role: 'Agent' as const,
        city: 'Lagos',
        country: 'Nigeria',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
        cover: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
        premium: true,
        verified: true,
        specialties: ['Luxe', 'Investissement', 'Conseil'],
        languages: ['Français', 'English'],
        zones: ['Centre-ville', 'Résidentiel', 'Commercial'],
        rating: 4.9,
        ratingsCount: 156,
        listings: [
          {
            id: 'l1',
            title: 'Villa moderne avec piscine',
            city: 'Lagos',
            area: 'Nigeria',
            priceLabel: '$125,000',
            badge: 'À vendre',
            thumb: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=800&auto=format&fit=crop',
          },
          {
            id: 'l2',
            title: 'Appartement centre-ville',
            city: 'Lagos',
            area: 'Nigeria',
            priceLabel: '$850/mois',
            badge: 'À louer',
            thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
          },
        ],
        reviews: [
          {
            id: 'r1',
            author: 'Client satisfait',
            dateLabel: '20/11/2024',
            rating: 5,
            text: 'Excellent service ! Très professionnel et à l\'écoute. M\'a aidé à trouver la propriété parfaite.',
          },
          {
            id: 'r2',
            author: 'Autre client',
            dateLabel: '15/10/2024',
            rating: 5,
            text: 'Service impeccable. Connaît très bien le marché local.',
          },
        ],
        phone: '+234901234568',
        whatsapp: '234901234568',
        email: 'chioma@okaforproperties.ng',
      };
    }
    
    return {
      id: providerData.id,
      name: providerData.name,
      role: providerData.category === 'agency' ? 'Agence' as const : 'Agent' as const,
      city: providerData.city,
      country: providerData.country,
      avatar: providerData.avatar || 'https://i.pravatar.cc/150',
      cover: providerData.cover || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format',
      premium: providerData.badges?.includes('premium') || false,
      verified: providerData.badges?.includes('verified') || false,
      specialties: providerData.tags || [],
      languages: ['Français', 'English'],
      zones: ['Centre-ville', 'Résidentiel', 'Commercial'],
      rating: providerData.rating,
      ratingsCount: providerData.reviews,
      listings: [
        {
          id: 'l1',
          title: 'Villa moderne avec piscine',
          city: providerData.city,
          area: providerData.country,
          priceLabel: '$125,000',
          badge: 'À vendre',
          thumb: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=800&auto=format&fit=crop',
        },
        {
          id: 'l2',
          title: 'Appartement centre-ville',
          city: providerData.city,
          area: providerData.country,
          priceLabel: '$850/mois',
          badge: 'À louer',
          thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
        },
      ],
      reviews: [
        {
          id: 'r1',
          author: 'Client satisfait',
          dateLabel: '20/11/2024',
          rating: 5,
          text: 'Excellent service ! Très professionnel et à l\'écoute. M\'a aidé à trouver la propriété parfaite.',
        },
        {
          id: 'r2',
          author: 'Autre client',
          dateLabel: '15/10/2024',
          rating: 5,
          text: 'Service impeccable. Connaît très bien le marché local.',
        },
      ],
      phone: '+221771234567',
      whatsapp: '221771234567',
      email: `${providerData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    };
  }, [id]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Découvrez ${pro.name} (${pro.role}) sur ZIMA – ${pro.city}, ${pro.country}`,
      });
    } catch (err) {
      console.log('Share error', err);
    }
  };

  const openPhone = () => pro.phone && Linking.openURL(`tel:${pro.phone}`);
  const openMail = () => pro.email && Linking.openURL(`mailto:${pro.email}`);
  const openWhatsApp = () =>
    pro.whatsapp
      ? Linking.openURL(`https://wa.me/${pro.whatsapp}`)
      : Alert.alert('WhatsApp', 'Numéro indisponible');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} testID="provider-profile-screen">
      <View style={{ paddingHorizontal: 16, paddingTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          testID="back-btn"
        >
          <Ionicons name="chevron-back" size={22} color={palette.text} />
        </Pressable>

        <Text style={{ fontSize: 24, fontWeight: '800', color: palette.text }}>{pro.name.split(' ')[0]}</Text>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={() => setFaved((s) => !s)}
            style={styles.iconBtn}
            testID="fav-btn"
          >
            <Ionicons name={faved ? 'heart' : 'heart-outline'} size={22} color={faved ? '#E83D4A' : palette.text} />
          </Pressable>
          <Pressable onPress={onShare} style={styles.iconBtn} testID="share-btn">
            <Ionicons name="share-outline" size={20} color={palette.text} />
          </Pressable>
        </View>
      </View>

      <View style={{ margin: 16, backgroundColor: palette.card, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12 }}>
        <View style={{ height: 200 }}>
          <Image source={{ uri: pro.cover }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          <LinearGradient colors={["rgba(0,0,0,0)", 'rgba(0,0,0,0.25)']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 90 }} />
        </View>

        <View style={{ padding: 16, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ position: 'absolute', top: -56, left: 16 }}>
              <Image source={{ uri: pro.avatar }} style={{ width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: palette.card }} />
              <View style={{ position: 'absolute', right: -2, bottom: -2, width: 14, height: 14, borderRadius: 7, backgroundColor: palette.success, borderWidth: 2, borderColor: palette.card }} />
            </View>
            <View style={{ height: 0 }} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {pro.premium && (
              <Badge color={palette.gold} label="Premium" icon={<Ionicons name="star" size={14} color={palette.gold} />} />
            )}
            {pro.verified && (
              <Badge color={palette.violet} label="Vérifié" icon={<Ionicons name="shield-checkmark" as any size={14} color={palette.violet} />} />
            )}
            <Chip label={pro.role} />
          </View>
        </View>
      </View>

      <View style={{ marginHorizontal: 16, flexDirection: 'row', gap: 10 }}>
        {[
          { key: 'overview', label: 'Aperçu', icon: 'person-outline' },
          { key: 'listings', label: 'Annonces', icon: 'home-outline' },
          { key: 'reviews', label: 'Avis', icon: 'star-outline' },
        ].map((t) => {
          const active = tab === (t.key as 'overview' | 'listings' | 'reviews');
          return (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key as 'overview' | 'listings' | 'reviews')}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 12,
                borderRadius: 14,
                backgroundColor: active ? palette.teal : palette.card,
                borderWidth: 1,
                borderColor: active ? palette.teal : palette.border,
              }}
              testID={`tab-${t.key}`}
            >
              <Ionicons name={t.icon as any} size={18} color={active ? '#FFF' : palette.text} />
              <Text style={{ color: active ? '#FFF' : palette.text, fontWeight: '700' }}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {tab === 'overview' && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
          <View style={{ gap: 16 }}>
            <View style={styles.cardBlock}>
              <Text style={styles.cardTitle}>À propos</Text>
              <Text style={{ lineHeight: 22, color: palette.muted }}>
                {pro.role} immobilier expérimenté spécialisé dans les propriétés résidentielles et commerciales à {pro.city}. Passionné par l'accompagnement des clients dans leurs projets.
              </Text>
            </View>

            <View style={styles.cardBlock}>
              <Text style={styles.cardTitle}>Spécialités</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {pro.specialties.map((s) => (
                  <Chip key={s} label={s} tone="soft" />
                ))}
              </View>
            </View>

            <View style={styles.cardBlock}>
              <Text style={styles.cardTitle}>Langues parlées</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {pro.languages.map((s) => (
                  <Chip key={s} label={s} />
                ))}
              </View>
            </View>

            <View style={styles.cardBlock}>
              <Text style={styles.cardTitle}>Zones d'intervention</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {pro.zones.map((s) => (
                  <Chip key={s} label={s} tone="soft" />
                ))}
              </View>
            </View>

            <View style={[styles.cardBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
              {[
                { icon: <Feather name="phone" size={20} color={palette.teal} />, onPress: openPhone },
                { icon: <Ionicons name={"logo-whatsapp" as any} size={20} color={palette.teal} />, onPress: openWhatsApp },
                { icon: <Feather name="mail" size={20} color={palette.teal} />, onPress: openMail },
              ].map((b, i) => (
                <Pressable key={i} onPress={b.onPress} style={styles.actionIcon} testID={`contact-${i}`}>
                  <View>{b.icon}</View>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {tab === 'listings' && (
        <FlatList
          contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
          data={pro.listings}
          keyExtractor={(item) => item.id}
          renderItem={({ item: l }) => (
            <Pressable style={styles.listingRow} testID={`listing-${l.id}`}>
              <Image source={{ uri: l.thumb }} style={{ width: 84, height: 84, borderRadius: 12 }} contentFit="cover" />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ color: palette.text, fontWeight: '700', fontSize: 16 }} numberOfLines={1}>
                  {l.title}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name={"location-outline" as any} size={14} color={palette.muted} />
                  <Text style={{ color: palette.muted }}>
                    {l.city}, {l.area}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <Text style={{ color: palette.teal, fontWeight: '800' }}>{l.priceLabel}</Text>
                  {l.badge && (
                    <View style={{ backgroundColor: '#E9F8EF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 }}>
                      <Text style={{ color: palette.success, fontWeight: '700' }}>{l.badge}</Text>
                    </View>
                  )}
                </View>
              </View>
              <Ionicons name={"chevron-forward" as any} size={18} color={palette.muted} />
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ textAlign: 'center', color: palette.muted }}>Aucune annonce pour le moment.</Text>
            </View>
          }
        />
      )}

      {tab === 'reviews' && (
        <FlatList
          contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
          data={pro.reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item: r }) => (
            <View style={styles.reviewCard}>
              <Text style={{ fontWeight: '800', color: palette.text, fontSize: 16 }}>{r.author}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 6 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons key={i} name={"star" as any} size={16} color={i < r.rating ? '#F5B400' : '#E5E5E5'} />
                ))}
                <Text style={{ color: palette.muted, marginLeft: 6 }}>{r.dateLabel}</Text>
              </View>
              <Text style={{ color: palette.text, lineHeight: 22 }}>{r.text}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ textAlign: 'center', color: palette.muted }}>Pas encore d'avis.</Text>
            </View>
          }
        />
      )}

      {Platform.OS === 'web' ? (
        <View style={[styles.bottomBlur, styles.webBlur]} />
      ) : (
        <BlurView intensity={40} tint="light" style={styles.bottomBlur} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardBlock: {
    backgroundColor: palette.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.text,
    marginBottom: 12,
  },
  actionIcon: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: palette.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listingRow: {
    backgroundColor: palette.card,
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  reviewCard: {
    backgroundColor: palette.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: palette.border,
  },
  bottomBlur: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 12,
  },
  webBlur: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    // @ts-ignore web-only CSS
    backdropFilter: 'blur(12px)',
  },
});