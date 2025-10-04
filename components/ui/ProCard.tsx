import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Heart } from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';

export type ProItem = {
  id: string;
  name: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  role: 'Agence' | 'Agent';
  city: string;
  country: string;
  rating: number;
  reviews: number;
  listings: number;
  specialties?: string[];
  gallery?: string[];
  phone?: string;
  email?: string;
  whatsapp?: string;
  online?: boolean;
};

type Props = {
  item: ProItem;
  onPressProfile?: (item: ProItem) => void;
  onPressCard?: (item: ProItem, e: GestureResponderEvent) => void;
};

const COLORS = {
  bg: '#FFFFFF',
  text: '#1F2937',
  sub: '#6B7280',
  line: '#E5E7EB',
  brand: '#1F2937',
  brandSoft: '#F3F4F6',
  premium: '#D4AF37',
  premiumBg: '#FEF9E7',
  verified: '#10B981',
  verifiedBg: '#D1FAE5',
  chipBg: '#F3F4F6',
  star: '#F59E0B',
};

const ProCard = memo<Props>(function ProCard({ item, onPressProfile, onPressCard }) {
  const { isFavoriteProvider, toggleFavoriteProvider } = useApp();
  const isFav = isFavoriteProvider(item.id);
  
  const openTel = () => {
    if (item.phone) Linking.openURL(`tel:${item.phone}`);
  };
  const openMail = () => {
    if (item.email) Linking.openURL(`mailto:${item.email}`);
  };
  const openWhatsApp = () => {
    if (item.whatsapp) {
      const url = `whatsapp://send?phone=${item.whatsapp}`;
      Linking.openURL(url).catch(() =>
        Linking.openURL(`https://wa.me/${item.whatsapp}`)
      );
    }
  };

  return (
    <View style={styles.card}>
      {/* Header avec avatar et infos */}
      <View style={styles.headerRow}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: item.avatarUrl || 'https://via.placeholder.com/60x60/E5E7EB/6B7280?text=?'
            }}
            style={styles.avatar}
          />
          {item.online && <View style={styles.onlineDot} />}
        </View>
        
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={() => toggleFavoriteProvider(item.id)}
          activeOpacity={0.8}
        >
          <Heart 
            size={18} 
            color={isFav ? '#EF4444' : COLORS.sub}
            fill={isFav ? '#EF4444' : 'transparent'}
          />
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <View style={styles.nameAndBadges}>
            <Text numberOfLines={1} style={styles.name}>
              {item.name}
            </Text>
            <View style={styles.badges}>
              {item.isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>Premium</Text>
                </View>
              )}
              {item.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Vérifié</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.roleAndLocation}>
            <MaterialCommunityIcons
              name={item.role === 'Agence' ? 'office-building' : 'account-tie'}
              size={16}
              color={COLORS.sub}
            />
            <Text style={styles.roleText}>{item.role}</Text>
            <Ionicons
              name="location-sharp"
              size={14}
              color={COLORS.sub}
              style={styles.locationIcon}
            />
            <Text numberOfLines={1} style={styles.locationText}>
              {item.city}, {item.country}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={COLORS.star} />
            <Text style={styles.rating}>
              {item.rating.toFixed(1)} <Text style={styles.reviewsText}>({item.reviews} avis)</Text>
            </Text>
            <Text style={styles.separator}> • </Text>
            <Text style={styles.listingsText}>{item.listings} annonces</Text>
          </View>
        </View>
      </View>

      {/* Spécialités */}
      {!!item.specialties?.length && (
        <View style={styles.specialtiesRow}>
          {item.specialties.map((specialty) => (
            <View key={specialty} style={styles.specialtyChip}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Galerie d'images */}
      {!!item.gallery?.length && (
        <FlatList
          data={item.gallery}
          keyExtractor={(url, idx) => `${item.id}-img-${idx}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.galleryContent}
          renderItem={({ item: imageUrl }) => (
            <Image source={{ uri: imageUrl }} style={styles.galleryImage} />
          )}
        />
      )}

      {/* Bouton Voir profil */}
      <Pressable
        onPress={() => onPressProfile?.(item)}
        style={({ pressed }) => [
          styles.profileButton,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={styles.profileButtonText}>Voir profil</Text>
      </Pressable>

      {/* Actions de contact */}
      <View style={styles.contactActions}>
        <Pressable
          onPress={openTel}
          disabled={!item.phone}
          style={[styles.contactButton, !item.phone && styles.contactButtonDisabled]}
        >
          <Ionicons name="call" size={20} color={!item.phone ? COLORS.sub : COLORS.text} />
        </Pressable>
        
        <Pressable
          onPress={openWhatsApp}
          disabled={!item.whatsapp}
          style={[styles.contactButton, !item.whatsapp && styles.contactButtonDisabled]}
        >
          <Ionicons name="logo-whatsapp" size={20} color={!item.whatsapp ? COLORS.sub : '#25D366'} />
        </Pressable>
        
        <Pressable
          onPress={openMail}
          disabled={!item.email}
          style={[styles.contactButton, !item.email && styles.contactButtonDisabled]}
        >
          <Ionicons name="mail" size={20} color={!item.email ? COLORS.sub : COLORS.text} />
        </Pressable>
      </View>
    </View>
  );
});



const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bg,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.line,
  },
  onlineDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  nameAndBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  premiumBadge: {
    backgroundColor: COLORS.premiumBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.premium,
  },
  verifiedBadge: {
    backgroundColor: COLORS.verifiedBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.verified,
  },
  roleAndLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    color: COLORS.sub,
    marginLeft: 4,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.sub,
    marginLeft: 4,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 4,
  },
  reviewsText: {
    fontWeight: '400',
    color: COLORS.sub,
  },
  separator: {
    fontSize: 14,
    color: COLORS.sub,
    marginHorizontal: 6,
  },
  listingsText: {
    fontSize: 14,
    color: COLORS.sub,
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  specialtyChip: {
    backgroundColor: COLORS.chipBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  galleryContent: {
    gap: 8,
    paddingBottom: 12,
  },
  galleryImage: {
    width: 120,
    height: 80,
    borderRadius: 12,
    backgroundColor: COLORS.line,
  },
  profileButton: {
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.text,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  profileButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  contactButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonDisabled: {
    opacity: 0.4,
  },
  locationIcon: {
    marginLeft: 8,
  },
});

export default ProCard;