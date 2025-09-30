import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function SlotButton({
  label,
  disabled,
  selected,
  onPress,
}: {
  label: string;
  disabled?: boolean;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.item,
        disabled && s.disabled,
        selected && s.selected,
        pressed && !disabled && { opacity: 0.85 },
      ]}
      accessibilityState={{ disabled, selected }}
    >
      <Text style={[s.txt, disabled && s.txtDisabled, selected && s.txtSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  item: {
    height: 52,
    minWidth: 96,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCE4E0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  selected: { backgroundColor: '#0E5A44', borderColor: '#0E5A44' },
  disabled: { backgroundColor: '#F2F5F6', borderColor: '#E6ECEF' },
  txt: { fontSize: 16, color: '#0A1F17', fontWeight: '600' as const },
  txtSelected: { color: '#fff' },
  txtDisabled: { color: '#9AA6A1' },
});
