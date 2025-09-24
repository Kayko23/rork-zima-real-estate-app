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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export type ProItem = {
  id: string;
  name: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  role: 'Agence' | 'Agent';
  city: string;
  country: string;
  rating: number;          // 4.8
  reviews: number;         // 67
  listings: number;        // 34
  specialties?: string[];  // ['Résidentiel','Commercial','Conseil']
  gallery?: string[];      // urls d'images
  phone?: string;          // +2250700000000
  email?: string;          // pro@exemple.com
  whatsapp?: string;       // 2250700000000 (sans +)
  online?: boolean;
};

type Props = {
  item: ProItem;
  onPressProfile?: (item: ProItem) => void;
  onPressCard?: (item: ProItem, e: GestureResponderEvent) => void;
};

const COLORS = {
  bg: '#FFFFFF',
  text: '#0F172A',            // slate-900
  sub: '#475569',             // slate-600
  line: '#E2E8F0',            // slate-200
  brand: '#0C5B47',           // vert ZIMA
  brandSoft: '#E8F2EF',
  gold: '#B58835',
  green: '#1B9E6A',
  chipBg: '#F1F5F9',
};

const RADIUS = 18;
const GAP = 12;

const ProCard = memo<Props>(function ProCard({ item, onPressProfile, onPressCard }) {
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
    <Pressable
      onPress={(e) => onPressCard?.(item, e)}
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.998 }], opacity: 0.98 },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.avatarWrap}>
          <Image
            source={{
              uri: item.avatarUrl || 'https://via.placeholder.com/56x56/E2E8F0/475569?text=?'
            }}
            style={styles.avatar}
          />
          {item.online && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.contentWrap}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={styles.name}>
              {item.name}
            </Text>
            <View style={styles.badgesRow}>
              {item.isPremium && (
                <Badge label="Premium" color={COLORS.gold} textColor="#fff" />
              )}
              {item.isVerified && (
                <Badge label="Vérifié" color={COLORS.green} textColor="#fff" />
              )}
            </View>
          </View>

          <View style={styles.metaRow}>
            <MaterialCommunityIcons
              name={item.role === 'Agence' ? 'office-building' : 'account-tie'}
              size={16}
              color={COLORS.sub}
              style={styles.roleIcon}
            />
            <Text style={styles.metaText}>{item.role}</Text>
            <Text style={styles.dot}> • </Text>
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
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text style={styles.rating}>
              {item.rating.toFixed(1)}{' '}
              <Text style={styles.subText}>({item.reviews} avis)</Text>
            </Text>
            <Text style={styles.dot}> • </Text>
            <Text style={styles.subText}>{item.listings} annonces</Text>
          </View>
        </View>
      </View>

      {/* Chips */}
      {!!item.specialties?.length && (
        <View style={styles.chipsRow}>
          {item.specialties.slice(0, 3).map((ch) => (
            <Chip key={ch} label={ch} />
          ))}
        </View>
      )}

      {/* Mini-galerie */}
      {!!item.gallery?.length && (
        <FlatList
          data={item.gallery.slice(0, 3)}
          keyExtractor={(u, idx) => `${item.id}-g-${idx}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.galleryContainer}
          style={styles.gallery}
          renderItem={({ item: img }) => (
            <Image source={{ uri: img }} style={styles.thumb} />
          )}
        />
      )}

      {/* CTA */}
      <Pressable
        onPress={() => onPressProfile?.(item)}
        style={({ pressed }) => [
          styles.cta,
          pressed && { opacity: 0.9, transform: [{ translateY: 1 }] },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Voir le profil de ${item.name}`}
      >
        <Text style={styles.ctaText}>Voir profil</Text>
      </Pressable>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <RoundAction
          icon="call"
          label="Appeler"
          onPress={openTel}
          disabled={!item.phone}
        />
        <RoundAction
          icon="logo-whatsapp"
          label="WhatsApp"
          onPress={openWhatsApp}
          disabled={!item.whatsapp}
        />
        <RoundAction
          icon="mail"
          label="Email"
          onPress={openMail}
          disabled={!item.email}
        />
      </View>
    </Pressable>
  );
});

const Badge = ({ label, color, textColor }: { label: string; color: string; textColor: string }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
  </View>
);

Badge.displayName = 'Badge';

const Chip = ({ label }: { label: string }) => (
  <View style={styles.chip}>
    <Text style={styles.chipText}>{label}</Text>
  </View>
);

Chip.displayName = 'Chip';

const RoundAction = ({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      styles.actionBtn,
      disabled && styles.actionBtnDisabled,
      pressed && styles.actionBtnPressed,
    ]}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <Ionicons name={icon} size={20} color={COLORS.brand} />
  </Pressable>
);

RoundAction.displayName = 'RoundAction';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS,
    padding: 16,
    gap: GAP,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  avatarWrap: { width: 56, height: 56 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.line,
  },
  onlineDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  badgesRow: { flexDirection: 'row', gap: 6 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  metaRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 6,
  },
  metaText: { color: COLORS.sub, fontSize: 13, fontWeight: '500' },
  dot: { color: COLORS.sub, fontSize: 13 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { color: COLORS.text, fontWeight: '700', fontSize: 14 },
  subText: { color: COLORS.sub, fontWeight: '500' },
  chipsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.chipBg,
    borderRadius: 999,
  },
  chipText: { fontSize: 12, color: COLORS.text, fontWeight: '600' },
  thumb: {
    width: 110,
    height: 74,
    borderRadius: 12,
    backgroundColor: COLORS.line,
  },
  cta: {
    marginTop: 4,
    backgroundColor: COLORS.bg,
    borderColor: COLORS.brand,
    borderWidth: 1.5,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  ctaText: { color: COLORS.brand, fontWeight: '800', fontSize: 16 },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 2,
  },
  contentWrap: {
    flex: 1,
    marginLeft: 12,
  },
  locationText: {
    color: COLORS.sub,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  galleryContainer: {
    gap: 10,
  },
  gallery: {
    marginTop: 8,
  },
  roleIcon: {
    marginRight: 6,
  },
  locationIcon: {
    marginRight: 2,
  },
  actionBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnDisabled: {
    opacity: 0.4,
  },
  actionBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});

export default ProCard;