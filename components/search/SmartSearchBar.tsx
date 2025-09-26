import React from 'react';
import { View, TextInput, StyleSheet, Text, Pressable, ViewStyle, NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native';

export interface Chip {
  key: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function SmartSearchBar({
  placeholder,
  leftIcon,
  chips,
  style,
  onSubmit,
}: {
  placeholder?: string;
  leftIcon?: React.ReactElement | null;
  chips: Chip[];
  style?: ViewStyle;
  onSubmit?: (q: string) => void;
}): React.ReactElement {
  const handleSubmit = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const q = e?.nativeEvent?.text ?? '';
    console.log('[SmartSearchBar] submit', q);
    onSubmit?.(q);
  };

  return (
    <View style={[st.wrap, style]} testID="smart-search-bar">
      <View style={st.inputRow}>
        {!!leftIcon && <View style={st.iconWrap}>{leftIcon}</View>}
        <TextInput
          style={st.input}
          placeholder={placeholder}
          placeholderTextColor="#8C989F"
          testID="smart-search-input"
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
        />
      </View>
      <View style={st.chips}>
        {chips.map((c) => (
          <Pressable
            key={c.key}
            onPress={c.onPress}
            disabled={c.disabled}
            style={[st.chip, c.disabled ? st.chipDisabled : null]}
            testID={`smart-chip-${c.key}`}
          >
            <Text style={st.chipTxt}>{c.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { gap: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  input: { flex: 1, paddingVertical: 8, color: '#0B1D17' },
  iconWrap: { justifyContent: 'center', alignItems: 'center' },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' as const },
  chip: {
    backgroundColor: '#E8EFF1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  chipDisabled: { opacity: 0.4 },
  chipTxt: { color: '#0B1D17', fontWeight: '600' },
});
