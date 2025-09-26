import React, { useEffect } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: number;
};

export default function BottomSheet({ visible, onClose, children, maxHeight = 0.86 }: Props) {
  const insets = useSafeAreaInsets();
  const screenH = typeof window !== "undefined" ? window.innerHeight : 800;
  const openY = screenH * (1 - maxHeight);
  const y = useSharedValue<number>(screenH);

  useEffect(() => {
    console.log("[BottomSheet] visible:", visible);
    y.value = withTiming(visible ? openY : screenH, { duration: 280 });
  }, [visible, openY, screenH, y]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      // translationY is the total translation; compute delta on UI thread
      const dy = ((e as any).changeY ?? (e.translationY - ((e as any).prevTranslationY ?? 0))) || 0;
      (e as any).prevTranslationY = e.translationY;
      y.value = Math.max(openY, y.value + dy);
    })
    .onEnd(() => {
      const shouldClose = y.value > openY + 120;
      y.value = shouldClose
        ? withTiming(screenH, { duration: 220 }, (finished) => {
            if (finished) runOnJS(onClose)();
          })
        : withSpring(openY, { damping: 18 });
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  if (!visible) return null;

  return (
    <View style={s.wrap} pointerEvents="box-none" testID="bottom-sheet-root">
      <Pressable style={s.backdrop} onPress={onClose} testID="bottom-sheet-backdrop" />

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            s.sheet,
            sheetStyle,
            { paddingBottom: insets.bottom + 12, borderTopLeftRadius: 22, borderTopRightRadius: 22 },
          ]}
        >
          <View style={s.handle} />
          <View
            style={[
              s.inner,
              Platform.OS === "ios" && { backgroundColor: "rgba(255,255,255,0.82)" },
            ]}
          >
            {children}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { position: "absolute", inset: 0, zIndex: 1000, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,.35)" },
  sheet: { width: "100%", backgroundColor: "rgba(255,255,255,.9)" },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,.15)",
    marginVertical: 8,
  },
  inner: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },
});