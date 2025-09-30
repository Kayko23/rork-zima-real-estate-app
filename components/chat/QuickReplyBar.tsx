import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

export type QuickReply = { id: string; text: string };

export default function QuickReplyBar({
  replies,
  onPick,
  visible = true,
}: {
  replies: QuickReply[];
  onPick: (text: string) => void;
  visible?: boolean;
}) {
  if (!visible || replies.length === 0) return null;

  return (
    <View style={s.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {replies.map((r) => (
          <Pressable key={r.id} onPress={() => onPick(r.text)} style={s.chip}>
            <Text numberOfLines={1} style={s.chipTxt}>
              {r.text}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E9EC',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F2F5F6',
    borderRadius: 18,
    marginRight: 8,
  },
  chipTxt: { fontSize: 14, color: '#0B1F17', fontWeight: '600' },
});
