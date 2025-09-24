import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Platform } from 'react-native';
import { Heart, Star } from 'lucide-react-native';
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
  return (
    <Pressable style={[styles.card, layout === 'grid' && { flex: 1, maxWidth: '49%' }]} onPress={onPress} testID={`fav-prop-${item.id}`}>
      <Image source={{ uri: item.images[0] }} style={styles.cover} />
      <Pressable style={styles.like} accessibilityLabel={item.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
        <Heart size={18} color={item.isFavorite ? Colors.primary : '#fff'} fill={item.isFavorite ? 'rgba(14,90,70,0.15)' : 'transparent'} />
      </Pressable>

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
        <Text style={styles.sub}>{item.location.city} • {item.location.country}</Text>

        <View style={styles.row}>
          <View style={styles.chip}><Text style={styles.chipTxt}>{item.type === 'rent' ? 'À LOUER' : 'À VENDRE'}</Text></View>
          <View style={styles.rate}>
            <Star size={14} color={'#fbbf24'} />
            <Text style={styles.rateTxt}>{(item.provider?.rating ?? 4.6).toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{Intl.NumberFormat('fr-FR', { style: 'currency', currency: item.currency }).format(item.price)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', ...(shadowSoft as object), marginBottom: 12 },
  cover: { height: 160, width: '100%', backgroundColor: '#e5e7eb' },
  like: { position: 'absolute', top: 10, right: 10, height: 34, width: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  info: { padding: 12, gap: 6 },
  title: { fontSize: 16, fontWeight: '700', color: Colors.text.primary },
  sub: { fontSize: 13, color: Colors.text.secondary },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  chip: { backgroundColor: '#F6F7F8', paddingHorizontal: 10, height: 24, borderRadius: 12, justifyContent: 'center' },
  chipTxt: { fontSize: 12, fontWeight: '700', color: Colors.text.secondary },
  rate: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto' },
  rateTxt: { fontWeight: '700', color: Colors.text.primary },
  priceRow: { marginTop: 4 },
  price: { fontSize: 16, fontWeight: '800', color: Colors.primary },
});

export default FavoritePropertyCard;
