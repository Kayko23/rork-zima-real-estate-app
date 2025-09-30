import React, { useEffect, useRef, useState } from 'react';
import { Modal, Animated, Pressable, View, StyleSheet, useWindowDimensions, Keyboard, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number; // px ou 0..1 si proportion
};

export default function BottomSheet({ visible, onClose, children, height = 0.82 }: Props) {
  const { height: screenH } = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const h = height <= 1 ? screenH * height : height;
  const y = useRef(new Animated.Value(screenH)).current;

  useEffect(() => {
    const showListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    const targetY = visible ? screenH - h - keyboardHeight : screenH;
    Animated.spring(y, {
      toValue: targetY,
      useNativeDriver: true,
      damping: 18,
      stiffness: 200,
      mass: 0.8,
    }).start();
  }, [visible, h, screenH, y, keyboardHeight]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <BlurView tint="light" intensity={20} style={StyleSheet.absoluteFill} />
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  grabber: {
    alignSelf: 'center',
    width: 48, height: 5, borderRadius: 999, backgroundColor: '#E6E8EC',
    marginVertical: 8,
  },
});