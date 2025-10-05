import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/colors';
import { Provider } from '@/types';
import { Phone, MessageCircle, Mail, Star } from 'lucide-react-native';

interface Props {
  pro: Provider;
  onViewProfile?: () => void;
  onCall?: () => void;
  onWhatsApp?: () => void;
  onEmail?: () => void;
}

const shadowSoft = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  android: { elevation: 4 },
  default: {},
});

export function FavoriteProCard({ pro, onViewProfile, onCall, onWhatsApp, onEmail }: Props) {
  return (
    <View style={styles.card} testID={`fav-pro-${pro.id}`}>
      <View style={styles.topRow}>
        <Image source={{ uri: pro.avatar && pro.avatar.trim() !== '' ? pro.avatar : 'https://i.pravatar.cc/100' }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.name}>{pro.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{pro.type === 'agency' ? 'Agence' : 'Agent'}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.meta}>{pro.location.city}, {pro.location.country}</Text>
          </View>
          <View style={styles.rateRow}>
            <Star size={14} color={'#fbbf24'} />
            <Text style={styles.rateTxt}>
              {pro.rating.toFixed(1)} <Text style={styles.reviewsTxt}>({pro.reviewCount} avis)</Text>
            </Text>
          </View>
        </View>
        <View style={styles.favoriBadge} testID={`fav-pro-${pro.id}-badge`}>
          <Text style={styles.favoriText}>Favori</Text>
        </View>
      </View>

      <View style={styles.tagsRow}>
        {pro.specialties.slice(0, 3).map((t) => (
          <View key={t} style={styles.tag}><Text style={styles.tagTxt}>{t}</Text></View>
        ))}
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={styles.cta} onPress={onViewProfile} testID={`fav-pro-${pro.id}-profile`}>
          <Text style={styles.ctaTxt}>Voir profil</Text>
        </Pressable>

        <IconBtn onPress={onCall} testID={`fav-pro-${pro.id}-call`}>
          <Phone size={18} color={Colors.text.primary} />
        </IconBtn>
        <IconBtn onPress={onWhatsApp} testID={`fav-pro-${pro.id}-wa`}>
          <MessageCircle size={18} color={Colors.text.primary} />
        </IconBtn>
        <IconBtn onPress={onEmail} testID={`fav-pro-${pro.id}-mail`}>
          <Mail size={18} color={Colors.text.primary} />
        </IconBtn>
      </View>
    </View>
  );
}

function IconBtn({ children, onPress, testID }: { children: React.ReactNode; onPress?: () => void; testID?: string }) {
  return (
    <Pressable onPress={onPress} style={styles.iconBtn} testID={testID} accessibilityRole="button">
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 14, gap: 10, ...(shadowSoft as object), marginBottom: 12 },
  topRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatar: { height: 48, width: 48, borderRadius: 24, backgroundColor: '#eef2f4' },
  name: { fontSize: 16, fontWeight: '800', color: Colors.text.primary },
  metaRow: { flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 2 },
  meta: { fontSize: 13, color: Colors.text.secondary },
  dot: { color: Colors.text.secondary },
  rateRow: { flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 2 },
  rateTxt: { fontSize: 13, fontWeight: '700', color: Colors.text.primary },
  reviewsTxt: { color: Colors.text.secondary },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#F6F7F8', paddingHorizontal: 10, height: 26, borderRadius: 13, justifyContent: 'center' },
  tagTxt: { fontSize: 12, fontWeight: '700', color: Colors.text.secondary },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  cta: { flex: 1, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 2, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  ctaTxt: { color: Colors.primary, fontWeight: '800' },
  iconBtn: { height: 44, width: 44, borderRadius: 22, backgroundColor: '#eef2f4', alignItems: 'center', justifyContent: 'center' },
  favoriBadge: { backgroundColor: '#0B1220', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  favoriText: { color: 'white', fontSize: 12, fontWeight: '700' },
});

export default FavoriteProCard;
