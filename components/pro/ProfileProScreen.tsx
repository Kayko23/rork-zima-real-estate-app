import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Phone,
  MessageCircle,
  Star,
  CheckCircle,
  Crown,
  Calendar,
  Heart,
  Share,
  ChevronLeft,
} from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ProProfile {
  id: string;
  fullName: string;
  role: 'AGENT' | 'AGENCE' | 'GESTIONNAIRE' | 'CONSEIL' | 'HOTELLERIE';
  avatarUrl?: string;
  coverUrl?: string;

  location: { city: string; country: string };
  isVerified: boolean;
  isPremium: boolean;
  yearsActive?: number;

  rating: { avg: number; count: number } | null;
  listingsCount: number;
  specialties: string[];
  languages?: string[];

  bio?: string;
  phones: { mobile?: string; whatsapp?: string };
  email: string;

  kyc?: { idType?: string; idMasked?: string; status: string };
  serviceAreas?: { city?: string; country: string }[];
  
  listings?: any[];
  reviews?: any[];
  images?: string[];
}

interface Props {
  profile: ProProfile;
}

function labelRole(role: ProProfile['role']): string {
  const map: Record<ProProfile['role'], string> = {
    AGENT: 'Agent immobilier',
    AGENCE: 'Agence immobilière',
    GESTIONNAIRE: 'Gestionnaire de biens',
    CONSEIL: 'Conseiller immobilier',
    HOTELLERIE: 'Hôtellerie & Tourisme',
  };
  return map[role] || role;
}

function Badge({ text, kind }: { text: string; kind: 'success' | 'premium' }) {
  const bg = kind === 'success' ? '#E8F8EE' : '#FFF3D6';
  const fg = kind === 'success' ? '#0F8A4B' : '#946200';
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {kind === 'success' ? (
        <CheckCircle size={12} color={fg} />
      ) : (
        <Crown size={12} color={fg} />
      )}
      <Text style={[styles.badgeText, { color: fg }]}>{text}</Text>
    </View>
  );
}

function HeaderPro({ profile }: { profile: ProProfile }) {
  return (
    <View style={styles.headerPro}>
      <Image
        source={{ uri: profile.avatarUrl || 'https://i.pravatar.cc/150' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{profile.fullName}</Text>
      <Text style={styles.roleText}>
        {labelRole(profile.role)} · 📍 {profile.location.city}, {profile.location.country}
      </Text>

      <View style={styles.badgesRow}>
        {profile.isVerified && <Badge text="Vérifié" kind="success" />}
        {profile.isPremium && <Badge text="Premium" kind="premium" />}
      </View>
    </View>
  );
}

function StatsStrip({ profile }: { profile: ProProfile }) {
  const items = [
    profile.rating
      ? { icon: '⭐', text: `${profile.rating.avg.toFixed(1)} (${profile.rating.count})` }
      : null,
    { icon: '🏷️', text: `${profile.listingsCount} annonces` },
    profile.yearsActive ? { icon: '⏳', text: `${profile.yearsActive} ans` } : null,
  ].filter(Boolean) as { icon: string; text: string }[];

  return (
    <View style={styles.stats}>
      {items.map((it, i) => (
        <View key={i} style={styles.statItem}>
          <Text style={styles.statIcon}>{it.icon}</Text>
          <Text style={styles.statText}>{it.text}</Text>
        </View>
      ))}
    </View>
  );
}

function ChipsRow({ title, chips }: { title: string; chips: string[] }) {
  if (!chips.length) return null;
  return (
    <View style={styles.chipsSection}>
      <Text style={styles.h6}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {chips.map((c, i) => (
          <View key={i} style={styles.chip}>
            <Text style={styles.chipText}>{c}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function ActionBar({
  onMessage,
  onCall,
  onWhatsApp,
  onBook,
}: {
  onMessage: () => void;
  onCall: () => void;
  onWhatsApp: () => void;
  onBook: () => void;
}) {
  return (
    <View style={styles.actions}>
      <TouchableOpacity onPress={onMessage} style={styles.roundAction}>
        <MessageCircle size={24} color="#0F4C3A" />
        <Text style={styles.roundActionText}>Message</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onCall} style={styles.roundAction}>
        <Phone size={24} color="#0F4C3A" />
        <Text style={styles.roundActionText}>Appeler</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onWhatsApp} style={styles.roundAction}>
        <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
        <Text style={[styles.roundActionText, { color: '#25D366' }]}>WhatsApp</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onBook} style={[styles.roundAction, { backgroundColor: '#0F4C3A' }]}>
        <Calendar size={24} color="#fff" />
        <Text style={[styles.roundActionText, { color: 'white' }]}>RDV</Text>
      </TouchableOpacity>
    </View>
  );
}

function Section({
  title,
  cta,
  children,
}: {
  title: string;
  cta?: { label: string; onPress: () => void };
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {cta && (
          <TouchableOpacity onPress={cta.onPress}>
            <Text style={styles.ctaText}>{cta.label}</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function HorizontalListings({ listings }: { listings?: any[] }) {
  if (!listings || listings.length === 0) {
    return <Text style={styles.emptyText}>Aucune annonce disponible.</Text>;
  }

  return (
    <FlatList
      data={listings}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ gap: 12 }}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.listingCard}>
          <Image
            source={{ uri: item.thumbnail || 'https://picsum.photos/200' }}
            style={styles.listingImage}
          />
          <View style={styles.listingInfo}>
            <Text style={styles.listingTitle} numberOfLines={1}>
              {item.title || 'Annonce'}
            </Text>
            <Text style={styles.listingLocation}>
              {item.city}, {item.country}
            </Text>
            <Text style={styles.listingPrice}>{item.price || '—'}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

function ReviewsPreview({ reviews }: { reviews?: any[] }) {
  if (!reviews || reviews.length === 0) {
    return <Text style={styles.emptyText}>Aucun avis pour le moment.</Text>;
  }

  return (
    <View style={{ gap: 12 }}>
      {reviews.slice(0, 2).map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewAuthor}>{review.author}</Text>
            <View style={styles.reviewRating}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  color={i < review.rating ? '#F59E0B' : '#E5E7EB'}
                  fill={i < review.rating ? '#F59E0B' : '#E5E7EB'}
                />
              ))}
            </View>
          </View>
          <Text style={styles.reviewText}>{review.text}</Text>
          <Text style={styles.reviewDate}>{review.date}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ProfileProScreen({ profile }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const openPhone = () => {
    if (profile.phones.mobile) {
      Linking.openURL(`tel:${profile.phones.mobile}`).catch(console.error);
    }
  };

  const openWhatsApp = () => {
    const phone = profile.phones.whatsapp || profile.phones.mobile;
    if (phone) {
      const cleanPhone = phone.replace(/[^0-9+]/g, '');
      Linking.openURL(`whatsapp://send?phone=${cleanPhone}`).catch(() =>
        Linking.openURL(`https://wa.me/${cleanPhone}`)
      );
    }
  };

  const openMessage = () => {
    router.push({ pathname: '/chat/[id]', params: { id: `pro_${profile.id}` } });
  };

  const openBook = () => {
    router.push('/appointment/book');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil professionnel</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Heart size={20} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Share size={20} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {profile.coverUrl && (
          <Image source={{ uri: profile.coverUrl }} style={styles.cover} />
        )}

        <HeaderPro profile={profile} />

        <StatsStrip profile={profile} />

        <ChipsRow title="Spécialités" chips={profile.specialties} />
        {profile.languages && profile.languages.length > 0 && (
          <ChipsRow title="Langues" chips={profile.languages} />
        )}

        <ActionBar
          onMessage={openMessage}
          onCall={openPhone}
          onWhatsApp={openWhatsApp}
          onBook={openBook}
        />

        <Section title="À propos">
          <Text style={styles.p}>{profile.bio || 'Aucune description disponible.'}</Text>
        </Section>

        <Section
          title={`Annonces (${profile.listingsCount})`}
          cta={{
            label: 'Voir tout',
            onPress: () => console.log('Navigate to all listings'),
          }}
        >
          <HorizontalListings listings={profile.listings} />
        </Section>

        <Section
          title={`Avis ${profile.rating ? `• ${profile.rating.count}` : ''}`}
          cta={{
            label: 'Tous les avis',
            onPress: () => console.log('Navigate to all reviews'),
          }}
        >
          <ReviewsPreview reviews={profile.reviews} />
        </Section>

        <Section title="Infos & vérifications">
          <InfoRow
            label="Localisation"
            value={`${profile.location.city}, ${profile.location.country}`}
          />
          {profile.serviceAreas && profile.serviceAreas.length > 0 && (
            <InfoRow
              label="Zones"
              value={profile.serviceAreas
                .map((a) => (a.city ? `${a.city}` : `${a.country}`))
                .join(' • ')}
            />
          )}
          <InfoRow label="Statut" value={profile.isVerified ? 'Vérifié' : 'En vérification'} />
          <InfoRow label="Contact" value={profile.email} />
        </Section>

        {profile.images && profile.images.length > 0 && (
          <Section title="Galerie">
            <FlatList
              data={profile.images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `gallery-${index}`}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <Image source={{ uri: item }} style={styles.galleryImage} />
                </TouchableOpacity>
              )}
            />
          </Section>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: {
    width: '100%',
    height: 160,
    backgroundColor: '#E5E7EB',
  },
  headerPro: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E9ECEF',
    borderWidth: 4,
    borderColor: '#fff',
    marginTop: -48,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
    color: '#111827',
  },
  roleText: {
    color: '#4B5563',
    marginTop: 4,
    fontSize: 14,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 4,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
  stats: {
    marginTop: 12,
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#111827',
  },
  chipsSection: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  h6: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 14,
    color: '#111827',
  },
  chipsContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#EEF3EF',
  },
  chipText: {
    fontWeight: '600',
    color: '#114B3D',
    fontSize: 13,
  },
  actions: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    gap: 8,
  },
  roundAction: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundActionText: {
    color: '#0F4C3A',
    fontWeight: '700',
    fontSize: 12,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  ctaText: {
    color: '#0F6B5E',
    fontSize: 14,
    fontWeight: '700',
  },
  p: {
    color: '#374151',
    lineHeight: 20,
    fontSize: 14,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontWeight: '600',
    color: '#6B7280',
    fontSize: 14,
    minWidth: 100,
  },
  infoValue: {
    color: '#111827',
    fontSize: 14,
    flex: 1,
  },
  listingCard: {
    width: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listingImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E5E7EB',
  },
  listingInfo: {
    padding: 10,
  },
  listingTitle: {
    fontWeight: '700',
    fontSize: 14,
    color: '#111827',
  },
  listingLocation: {
    color: '#6B7280',
    marginTop: 2,
    fontSize: 12,
  },
  listingPrice: {
    marginTop: 6,
    fontWeight: '700',
    fontSize: 14,
    color: '#0F6B5E',
  },
  reviewCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewAuthor: {
    fontWeight: '700',
    fontSize: 14,
    color: '#111827',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    color: '#374151',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  galleryImage: {
    width: 160,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
});
