import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import { router } from 'expo-router';

interface PublicationGuardModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  action?: {
    label: string;
    route: string;
  };
}

export function PublicationGuardModal({
  visible,
  onClose,
  message,
  action,
}: PublicationGuardModalProps) {
  const handleAction = () => {
    onClose();
    if (action?.route) {
      router.push(action.route as any);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable style={s.modal} onPress={(e) => e.stopPropagation()}>
          <Pressable style={s.closeBtn} onPress={onClose}>
            <X size={24} color="#6b7280" />
          </Pressable>

          <View style={s.iconBox}>
            <AlertCircle size={48} color="#f59e0b" />
          </View>

          <Text style={s.title}>Action requise</Text>
          <Text style={s.message}>{message}</Text>

          <View style={s.actions}>
            {action && (
              <Pressable style={s.primaryBtn} onPress={handleAction}>
                <Text style={s.primaryBtnText}>{action.label}</Text>
              </Pressable>
            )}
            <Pressable style={s.secondaryBtn} onPress={onClose}>
              <Text style={s.secondaryBtnText}>Annuler</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fffbeb',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: { gap: 12 },
  primaryBtn: {
    height: 48,
    backgroundColor: '#059669',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  secondaryBtn: {
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 16, fontWeight: '600', color: '#374151' },
});
