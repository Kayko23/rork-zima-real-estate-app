import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Heart } from 'lucide-react-native';
import { formatPrice, VoyageItem } from './helpers';

export function VoyageCard({ item, onPress }: { item: VoyageItem; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={c.wrap} testID={`voyage-card-${item.id}`}>
      <View style={c.photoWrap}>
        <Image source={{ uri: item.photos[0] }} style={c.photo} />
        <Pressable style={c.fav} onPress={() => {}} testID={`fav-${item.id}`}>
          <Heart size={18} color="#fff" />
        </Pressable>
        {item.badges?.[0] ? (
          <View style={c.badge}>
            <Text style={c.badgeTxt}>{item.badges[0]}</Text>
          </View>
        ) : null}
      </View>
      <Text numberOfLines={1} style={c.title}>
        {item.title}
      </Text>
      <Text style={c.place}>
        {item.city}, {item.country}
      </Text>
      <Text style={c.price}>
        {formatPrice(item.price)} <Text style={c.unit}>/ {item.unit === 'night' ? 'nuit' : 'jour'}</Text>
      </Text>
      <Text style={c.rating}>★ {item.rating} · {item.reviews}</Text>
    </Pressable>
  );
}

const c = StyleSheet.create({
  wrap: { width: 220, marginRight: 12 },
  photoWrap: { height: 150, borderRadius: 16, overflow: 'hidden', backgroundColor: '#eee' },
  photo: { width: '100%', height: '100%' },
  fav: { position: 'absolute', right: 8, top: 8, height: 32, width: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', left: 8, top: 8, backgroundColor: '#2f855a', paddingHorizontal: 8, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  badgeTxt: { color: '#fff', fontWeight: '800' },
  title: { fontWeight: '800', fontSize: 15, marginTop: 6 },
  place: { color: '#6B7280', marginTop: 2 },
  price: { fontWeight: '800', marginTop: 2 },
  unit: { color: '#6B7280', fontWeight: '700' },
  rating: { color: '#374151', marginTop: 2, fontWeight: '700' },
});
