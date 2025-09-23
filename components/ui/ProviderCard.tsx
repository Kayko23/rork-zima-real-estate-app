import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, Phone, Mail, MessageCircle, Shield, Crown, List } from 'lucide-react-native';
import { Provider } from '@/types';
import Colors from '@/constants/colors';

interface ProviderCardProps {
  provider: Provider;
  onViewProfile: () => void;
  onCall: () => void;
  onWhatsApp: () => void;
  onEmail: () => void;
}

export default function ProviderCard({ 
  provider, 
  onViewProfile, 
  onCall, 
  onWhatsApp, 
  onEmail 
}: ProviderCardProps) {
  return (
    <View style={styles.container} testID="provider-card">
      <View style={styles.header}>
        <Image source={{ uri: provider.avatar }} style={styles.avatar} />
        
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{provider.name}</Text>
            <View style={styles.badges}>
              {provider.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Shield size={12} color={Colors.blue} />
                </View>
              )}
              {provider.isPremium && (
                <View style={styles.premiumBadge}>
                  <Crown size={12} color={Colors.gold} />
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.ratingRow}>
            <Star size={14} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.rating}>{provider.rating}</Text>
            <Text style={styles.reviewCount}>({provider.reviewCount} avis)</Text>
          </View>
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={styles.type}>
          {provider.type === 'agency' ? 'Agence' : 'Agent'}
        </Text>
        <Text style={styles.location}>
          {provider.location.city}, {provider.location.country}
        </Text>
      </View>

      <View style={styles.specialties}>
        {provider.specialties.slice(0, 3).map((specialty, index) => (
          <View key={`specialty-${specialty}-${index}`} style={styles.specialtyChip}>
            <Text style={styles.specialtyText}>{specialty}</Text>
          </View>
        ))}
      </View>

      {provider.images.length > 0 && (
        <View style={styles.mediaContainer}>
          {provider.images.slice(0, 3).map((image, index) => (
            <Image key={`image-${image}-${index}`} source={{ uri: image }} style={styles.mediaImage} />
          ))}
          {provider.images.length > 3 && (
            <View style={styles.moreMedia}>
              <Text style={styles.moreMediaText}>+{provider.images.length - 3}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.listingCount}>
        <List size={16} color={Colors.text.secondary} />
        <Text style={styles.listingCountText}>{provider.listingCount} annonces</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={onViewProfile}
          testID="view-profile-button"
        >
          <Text style={styles.primaryButtonText}>Voir profil</Text>
        </TouchableOpacity>
        
        <View style={styles.secondaryActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onCall}
            testID="call-button"
          >
            <Phone size={20} color={Colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onWhatsApp}
            testID="whatsapp-button"
          >
            <MessageCircle size={20} color={Colors.success} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onEmail}
            testID="email-button"
          >
            <Mail size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(138, 102, 32, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  reviewCount: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  type: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  location: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  specialtyChip: {
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  mediaContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  mediaImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  moreMedia: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreMediaText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  listingCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  listingCountText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 9999,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.background.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});