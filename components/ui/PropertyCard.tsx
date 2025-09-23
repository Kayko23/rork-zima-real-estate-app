import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Heart, Star, Bed, Bath, Square } from 'lucide-react-native';
import { Property } from '@/types';
import Colors from '@/constants/colors';

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  onToggleFavorite: () => void;
  width?: number;
}

export default function PropertyCard({ property, onPress, onToggleFavorite, width }: PropertyCardProps) {
  const formatPrice = (price: number, currency: string) => {
    if (!price || !currency || typeof price !== 'number' || typeof currency !== 'string') {
      return '0';
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const cardWidth = width || '100%';
  
  return (
    <TouchableOpacity 
      style={[styles.container, { width: cardWidth }]} 
      onPress={onPress} 
      testID="property-card"
      activeOpacity={0.95}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: property.images[0] }} style={styles.image} />
        
        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {property.type === 'sale' ? 'À VENDRE' : 'À LOUER'}
          </Text>
        </View>
        
        {/* Premium Badge */}
        {property.isPremium && (
          <View style={styles.premiumBadge}>
            <Star size={12} color="white" fill="white" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
        
        {/* Favorite Button */}
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={onToggleFavorite}
          testID="favorite-button"
          activeOpacity={0.8}
        >
          <Heart 
            size={18} 
            color={property.isFavorite ? Colors.error : 'white'}
            fill={property.isFavorite ? Colors.error : 'transparent'}
          />
        </TouchableOpacity>
        
        {/* Bottom Info Overlay */}
        <View style={styles.bottomOverlay}>
          <View style={styles.titleSection}>
            <Text style={styles.title} numberOfLines={1}>
              {`${property.category} • ${property.location.city}`}
            </Text>
            <View style={styles.priceChip}>
              <Text style={styles.price}>
                {`${formatPrice(property.price, property.currency)}${property.type === 'rent' ? '/mois' : ''}`}
              </Text>
            </View>
          </View>
          
          <View style={styles.bottomRow}>
            <View style={styles.features}>
              {property.bedrooms && (
                <View style={styles.feature}>
                  <Bed size={12} color="white" />
                  <Text style={styles.featureText}>{property.bedrooms}</Text>
                </View>
              )}
              {property.bathrooms && (
                <View style={styles.feature}>
                  <Bath size={12} color="white" />
                  <Text style={styles.featureText}>{property.bathrooms}</Text>
                </View>
              )}
              {property.area && (
                <View style={styles.feature}>
                  <Square size={12} color="white" />
                  <Text style={styles.featureText}>{property.area}m²</Text>
                </View>
              )}
            </View>
            
            <View style={styles.badges}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>⭐ 4.8</Text>
              </View>
              <View style={styles.cameraBadge}>
                <Text style={styles.cameraText}>{`📷 ${property.images.length}`}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 340,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.2s ease',
    }),
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    // Removed backdropFilter for web compatibility
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
    // Removed backdropFilter for web compatibility
  },
  premiumText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
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
    // Removed backdropFilter for web compatibility
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    // Removed backdropFilter for web compatibility
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
    // Removed backdropFilter for web compatibility
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
    // Removed backdropFilter for web compatibility
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
    // Removed backdropFilter for web compatibility
  },
  cameraText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
});