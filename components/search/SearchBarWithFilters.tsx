import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';

export default function SearchBarWithFilters({ 
  placeholder = "Rechercher...", 
  onFilterPress, 
  onChangeText, 
  value 
}: {
  placeholder?: string;
  onFilterPress?: () => void;
  onChangeText?: (text: string) => void;
  value?: string;
}) {
  return (
    <View style={s.wrap}>
      <Search size={18} color="#64748B" />
      <TextInput
        style={s.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9AA0A6"
        returnKeyType="search"
      />
      {onFilterPress && (
        <Pressable onPress={onFilterPress} hitSlop={12}>
          <SlidersHorizontal size={20} color="#1F2937" />
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12, 
    height: 44,
    borderRadius: 12, 
    gap: 10,
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 8, 
    elevation: 2,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  input: { 
    flex: 1, 
    paddingVertical: 0, 
    fontSize: 16,
    color: '#0F172A',
  },
});
