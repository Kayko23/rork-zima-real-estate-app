import React from 'react';
import { View, Text, Pressable, Image, StyleSheet, Alert } from 'react-native';
import { Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface SelfieInputProps {
  label: string;
  value?: string;
  onChange: (uri: string) => void;
  error?: string;
  description?: string;
}

export function SelfieInput({
  label,
  value,
  onChange,
  error,
  description,
}: SelfieInputProps) {
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permission.granted) {
      Alert.alert(
        'Permission requise',
        'Veuillez autoriser l\'accès à la caméra pour prendre une photo.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  const removePhoto = () => {
    onChange('');
  };

  return (
    <View style={s.container}>
      <Text style={s.label}>{label}</Text>
      {description && <Text style={s.description}>{description}</Text>}
      
      {value ? (
        <View style={s.preview}>
          <Image source={{ uri: value }} style={s.previewImage} />
          <Pressable style={s.removeBtn} onPress={removePhoto}>
            <X size={16} color="#fff" />
          </Pressable>
        </View>
      ) : (
        <Pressable style={[s.cameraBox, error && s.cameraBoxError]} onPress={takePhoto}>
          <Camera size={32} color="#9ca3af" />
          <Text style={s.cameraText}>Prendre une photo</Text>
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
  cameraBox: {
    height: 200,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  cameraBoxError: { borderColor: '#ef4444' },
  cameraText: { marginTop: 8, color: '#6b7280', fontSize: 14 },
  preview: { position: 'relative', height: 200, borderRadius: 12, overflow: 'hidden' },
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
