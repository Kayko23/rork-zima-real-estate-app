import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Heart, Star, Bed, Bath, Square } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Property } from '@/types';

interface Props {
  item: Property;
  layout: 'grid' | 'list';
  onPress?: () => void;
}

const shadowSoft = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  android: { elevation: 4 },
  default: {},
});

export function FavoritePropertyCard({ item, layout, onPress }: Props) {
  const formatPrice = (price: number, currency: string) => {
    if (!price || !currency || typeof price !== 'number' || typeof currency !== 'string') {
      return '0';
    }
    if (typeof currency !== 'string' || currency.length > 10) {
      return '0';
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <TouchableOpacity 
      style={[styles.card(layout), layout === 'grid' && { flex: 1, maxWidth: '49%' }]} 
      onPress={onPress} 
      testID={`fav-prop-${item.id}`}
      activeOpacity={0.95}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.images?.[0] && item.images[0].trim() !== '' ? item.images[0] : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' }} style={styles.cover} />
        
        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {item.type === 'sale' ? 'À VENDRE' : 'À LOUER'}
          </Text>
        </View>

        {/* Favori Badge */}
        {item.isFavorite && (
          <View style={styles.favoriBadge} testID={`fav-prop-${item.id}-badge`}>
            <Text style={styles.favoriText}>Favori</Text>
          </View>
        )}
        
        {/* Premium Badge */}
        {item.isPremium && (
          <View style={styles.premiumBadge}>
            <Star size={12} color="white" fill="white" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
        
        {/* Favorite Button */}
        <TouchableOpacity 
          style={styles.like} 
          accessibilityLabel={item.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          activeOpacity={0.8}
        >
          <Heart 
            size={18} 
            color={item.isFavorite ? Colors.error : 'white'}
            fill={item.isFavorite ? Colors.error : 'transparent'}
          />
        </TouchableOpacity>
        
        {/* Bottom Info Overlay */}
        <View style={styles.bottomOverlay}>
          <View style={styles.titleSection}>
            <Text style={styles.title} numberOfLines={1}>
              {`${item.category} • ${item.location.city}`}
            </Text>
            <View style={styles.priceChip}>
              <Text style={styles.price}>
                {`${formatPrice(item.price, item.currency)}${item.type === 'rent' ? '/mois' : ''}`}
              </Text>
            </View>
          </View>
          
          <View style={styles.bottomRow}>
            <View style={styles.features}>
              {item.bedrooms && (
                <View style={styles.feature}>
                  <Bed size={12} color="white" />
                  <Text style={styles.featureText}>{item.bedrooms}</Text>
                </View>
              )}
              {item.bathrooms && (
                <View style={styles.feature}>
                  <Bath size={12} color="white" />
                  <Text style={styles.featureText}>{item.bathrooms}</Text>
                </View>
              )}
              {item.area && (
                <View style={styles.feature}>
                  <Square size={12} color="white" />
                  <Text style={styles.featureText}>{item.area}m²</Text>
                </View>
              )}
            </View>
            
            <View style={styles.badges}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>⭐ {(item.provider?.rating ?? 4.6).toFixed(1)}</Text>
              </View>
              <View style={styles.cameraBadge}>
                <Text style={styles.cameraText}>{`📷 ${item.images.length}`}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: (layout: 'grid' | 'list') => ({
    height: layout === 'grid' ? 280 : 340,
    borderRadius: 24,
    overflow: 'hidden',
    ...(shadowSoft as object),
    marginBottom: 12,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.2s ease',
    }),
  }),
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#e5e7eb',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  premiumBadge: {
    position: 'absolute',
    top: 16,
    right: 60,
    backgroundColor: Colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  favoriBadge: {
    position: 'absolute',
    top: 56,
    left: 16,
    backgroundColor: '#0B1220',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)'
  },
  favoriText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  premiumText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  like: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  titleSection: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  priceChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  features: {
    flexDirection: 'row',
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  ratingText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  cameraBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  cameraText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
});

export default FavoritePropertyCard;
