import React from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from "react-native-reanimated";

type Props = {
  min: number; max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
};

export default function RangeSlider({ min, max, value, onChange }: Props) {
  const width = useSharedValue<number>(0);
  const left = useSharedValue<number>(0);
  const right = useSharedValue<number>(0);

  const clamp = (n: number, a: number, b: number) => {
    'worklet';
    return Math.min(Math.max(n, a), b);
  };

  const onLayout = (e: LayoutChangeEvent) => {
    width.value = e.nativeEvent.layout.width;
    const toX = (v: number) => ((v - min) / (max - min)) * (width.value || 1);
    left.value = toX(value[0]);
    right.value = toX(value[1]);
  };

  const toVal = (x: number) => {
    'worklet';
    if (!width.value || width.value === 0) return min;
    const ratio = clamp(x, 0, width.value) / width.value;
    const v = min + ratio * (max - min);
    const step = 1000;
    return Math.round(v / step) * step;
  };

  const panLeft = Gesture.Pan()
    .onChange((e) => {
      if (!width.value || width.value === 0) return;
      left.value = clamp(left.value + e.changeX, 0, right.value - 8);
      runOnJS(onChange)([toVal(left.value), toVal(right.value)]);
    });

  const panRight = Gesture.Pan()
    .onChange((e) => {
      if (!width.value || width.value === 0) return;
      right.value = clamp(right.value + e.changeX, left.value + 8, width.value);
      runOnJS(onChange)([toVal(left.value), toVal(right.value)]);
    });

  const aLeft = useAnimatedStyle(() => ({ transform: [{ translateX: left.value }] }));
  const aRight = useAnimatedStyle(() => ({ transform: [{ translateX: right.value }] }));
  const aFill = useAnimatedStyle(() => ({ left: left.value, right: (width.value || 0) - right.value }));

  return (
    <View style={s.wrap} onLayout={onLayout} testID="range-slider">
      <View style={s.track} />
      <Animated.View style={[s.fill, aFill]} />
      <GestureDetector gesture={panLeft}>
        <Animated.View style={[s.knob, aLeft]} />
      </GestureDetector>
      <GestureDetector gesture={panRight}>
        <Animated.View style={[s.knob, aRight]} />
      </GestureDetector>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { height: 36, justifyContent: "center" },
  track: { position: "absolute", left: 0, right: 0, height: 6, borderRadius: 999, backgroundColor: "#E6EFEC" },
  fill: { position: "absolute", height: 6, borderRadius: 999, backgroundColor: "#134E48" },
  knob: {
    position: "absolute", top: 36 / 2 - 14, width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#fff", borderWidth: 2, borderColor: "#134E48", elevation: 2,
    shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
});