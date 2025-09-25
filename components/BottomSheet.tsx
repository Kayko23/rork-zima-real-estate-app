import React, { useEffect, useRef } from 'react';
import { Modal, Animated, Pressable, View, StyleSheet, useWindowDimensions, Platform } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number; // px ou 0..1 si proportion
};

export default function BottomSheet({ visible, onClose, children, height = 0.82 }: Props) {
  const { height: screenH } = useWindowDimensions();
  const h = height <= 1 ? screenH * height : height;
  const y = useRef(new Animated.Value(screenH)).current;

  useEffect(() => {
    Animated.spring(y, {
      toValue: visible ? screenH - h : screenH,
      useNativeDriver: true,
      damping: 18,
      stiffness: 200,
      mass: 0.8,
    }).start();
  }, [visible, h, screenH, y]);

  const Backdrop = Platform.OS === 'web' ? View : (require('expo-blur').BlurView);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      {Platform.OS === 'web' ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(17,24,39,0.18)', backdropFilter: 'blur(6px)' as unknown as number }]} />
      ) : (
        <Backdrop tint="light" intensity={20} style={StyleSheet.absoluteFill} />
      )}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <Animated.View
        style={[
          styles.sheet,
          { height: h, transform: [{ translateY: y }] },
        ]}
      >
        <View style={styles.grabber} />
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  grabber: {
    alignSelf: 'center',
    width: 48, height: 5, borderRadius: 999, backgroundColor: '#E6E8EC',
    marginVertical: 8,
  },
});