import React, { useEffect } from 'react';
import { Modal, Pressable, View, StyleSheet, Dimensions, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { useContentInsets } from '@/hooks/useContentInsets';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

export default function FilterSheet({ visible, onClose, children }: Props) {
  const { top, bottom } = useContentInsets();
  const H = Dimensions.get('window').height;
  const maxHeight = H - top - 24;
  const minY = 24;
  const sheetY = useSharedValue(H);

  useEffect(() => {
    sheetY.value = withTiming(visible ? minY : H, { duration: 250, easing: Easing.out(Easing.cubic) });
  }, [visible, minY, H, sheetY]);

  const rStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sheetY.value }] }));

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={StyleSheet.absoluteFill}>
        <Pressable onPress={onClose} style={styles.backdrop} />
        <Animated.View style={[styles.sheet, rStyle, { maxHeight, paddingBottom: bottom }]}>
          <View style={styles.handle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.35)' 
  },
  sheet: {
    position: 'absolute',
    left: 0, 
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    zIndex: 1000,
    elevation: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 44, 
    height: 5, 
    borderRadius: 3, 
    backgroundColor: '#E6E8EB', 
    marginVertical: 8,
  },
});
