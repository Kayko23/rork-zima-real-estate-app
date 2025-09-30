import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  subtitle?: string;
  avatar?: string;
  onBack: () => void;
};

export default function ChatHeader({ title, subtitle, avatar, onBack }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.wrap, { paddingTop: insets.top + 6 }]}>
      <Pressable onPress={onBack} style={s.back} hitSlop={10}>
        <ChevronLeft size={24} color="#0B1F17" />
      </Pressable>

      {avatar ? <Image source={{ uri: avatar }} style={s.avatar} /> : <View style={[s.avatar, s.avatarPh]} />}

      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={s.title}>{title}</Text>
        {!!subtitle && <Text numberOfLines={1} style={s.sub}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E9EC',
  },
  back: { padding: 6, marginRight: 6 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  avatarPh: { backgroundColor: '#DDE4E8' },
  title: { fontSize: 16, fontWeight: '700', color: '#0B1F17' },
  sub: { fontSize: 12, color: '#6A7A75' },
});
