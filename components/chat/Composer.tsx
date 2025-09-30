import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Paperclip, Send } from 'lucide-react-native';

export default function ChatInput({
  placeholder,
  onSend,
  disabled,
  bottomInset = 0,
}: {
  placeholder?: string;
  onSend: (text: string) => void;
  disabled?: boolean;
  bottomInset?: number;
}) {
  const [text, setText] = useState('');

  function submit() {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText('');
  }

  return (
    <View style={[s.wrap, { paddingBottom: bottomInset || 6 }]}>
      <Pressable style={s.btn} hitSlop={10}>
        <Paperclip size={20} color="#3A4A45" />
      </Pressable>

      <TextInput
        style={s.input}
        placeholder={placeholder}
        value={text}
        onChangeText={setText}
        multiline
        returnKeyType="send"
        onSubmitEditing={submit}
      />

      <Pressable style={[s.btn, s.send]} onPress={submit} disabled={disabled} hitSlop={10}>
        <Send size={20} color="#fff" />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E9EC',
  },
  btn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#EEF3F1', marginRight: 8,
  },
  input: {
    flex: 1,
    maxHeight: 140,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F2F5F6',
    fontSize: 16,
  },
  send: { backgroundColor: '#165D47' },
});