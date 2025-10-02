import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Upload, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface FileUploadInputProps {
  label: string;
  value?: string;
  onChange: (uri: string) => void;
  error?: string;
  description?: string;
  aspectRatio?: [number, number];
}

export function FileUploadInput({
  label,
  value,
  onChange,
  error,
  description,
  aspectRatio,
}: FileUploadInputProps) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: aspectRatio,
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
      <Text style={s.label}>{label}</Text>
      {description && <Text style={s.description}>{description}</Text>}
      
      {value ? (
        <View style={s.preview}>
          <Image source={{ uri: value }} style={s.previewImage} />
          <Pressable style={s.removeBtn} onPress={removeImage}>
            <X size={16} color="#fff" />
          </Pressable>
        </View>
      ) : (
        <Pressable style={[s.uploadBox, error && s.uploadBoxError]} onPress={pickImage}>
          <Upload size={32} color="#9ca3af" />
          <Text style={s.uploadText}>Appuyez pour sélectionner</Text>
        </Pressable>
      )}
      
      {error && <Text style={s.error}>{error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 6, color: '#111827' },
  description: { fontSize: 13, color: '#6b7280', marginBottom: 10 },
  uploadBox: {
    height: 160,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  uploadBoxError: { borderColor: '#ef4444' },
  uploadText: { marginTop: 8, color: '#6b7280', fontSize: 14 },
  preview: { position: 'relative', height: 160, borderRadius: 12, overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: { marginTop: 6, fontSize: 13, color: '#ef4444' },
});
