import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { User, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface AvatarInputProps {
  value?: string;
  onChange: (uri: string) => void;
  error?: string;
}

export function AvatarInput({ value, onChange, error }: AvatarInputProps) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    onChange('');
  };

  return (
    <View style={s.container}>
      <Text style={s.label}>Photo de profil</Text>
      <Text style={s.description}>
        Portrait centré, fond neutre, visage bien visible
      </Text>
      
      <View style={s.avatarContainer}>
        {value ? (
          <View style={s.avatarWrapper}>
            <Image source={{ uri: value }} style={s.avatar} />
            <Pressable style={s.removeBtn} onPress={removeImage}>
              <X size={16} color="#fff" />
            </Pressable>
          </View>
        ) : (
          <Pressable style={[s.avatarPlaceholder, error && s.avatarError]} onPress={pickImage}>
            <User size={48} color="#9ca3af" />
          </Pressable>
        )}
        
        <Pressable style={s.changeBtn} onPress={pickImage}>
          <Text style={s.changeBtnText}>
            {value ? 'Changer' : 'Ajouter'}
          </Text>
        </Pressable>
      </View>
      
      {error && <Text style={s.error}>{error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 6, color: '#111827' },
  description: { fontSize: 13, color: '#6b7280', marginBottom: 16 },
  avatarContainer: { alignItems: 'center' },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#e5e7eb',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarError: { borderColor: '#ef4444' },
  removeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  changeBtnText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  error: { marginTop: 8, fontSize: 13, color: '#ef4444', textAlign: 'center' },
});
