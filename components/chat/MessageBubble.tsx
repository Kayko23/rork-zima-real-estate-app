import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type BubbleMessage = {
  id: string;
  text: string;
  createdAt: Date;
  side: 'left' | 'right';
};

export default function MessageBubble({ message }: { message: BubbleMessage }) {
  const isRight = message.side === 'right';
  return (
    <View style={[s.row, isRight ? s.right : s.left]}>
      <View style={[s.bubble, isRight ? s.bubbleRight : s.bubbleLeft]}>
        <Text style={[s.text, isRight && s.textRight]}>{message.text}</Text>
        <Text style={[s.time, isRight && s.timeRight]}>
          {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

const GREEN = '#165D47' as const;
const s = StyleSheet.create({
  row: { paddingHorizontal: 12, marginVertical: 4, width: '100%' },
  left: { alignItems: 'flex-start' },
  right: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleLeft: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E4E8EB' },
  bubbleRight: { backgroundColor: GREEN },
  text: { fontSize: 16, color: '#0B1F17' },
  textRight: { color: '#fff' },
  time: { marginTop: 6, fontSize: 11, color: '#7B8A86', alignSelf: 'flex-end' },
  timeRight: { color: 'rgba(255,255,255,0.8)' },
});