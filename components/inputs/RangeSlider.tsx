import React, { useMemo, useRef, useState } from 'react';
import { View, Pressable, PanResponder, LayoutChangeEvent, StyleSheet } from 'react-native';

type Props = {
  min: number; max: number;
  values: [number, number];
  onChange: (v: [number, number]) => void;
};

export default function RangeSlider({ min, max, values, onChange }: Props) {
  const trackRef = useRef<View>(null);
  const [width, setWidth] = useState<number>(0);
  const [trackLeft, setTrackLeft] = useState<number | null>(null);

  const l = Math.max(min, Math.min(values[0], values[1]));
  const r = Math.min(max, Math.max(values[0], values[1]));

  const px = (v: number) => width * ((v - min) / Math.max(1, (max - min)));
  const val = (x: number) => Math.round(min + (x / Math.max(1, width)) * (max - min));

  const [drag, setDrag] = useState<'left'|'right'|null>(null);

  const pan = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, g) => {
      if (!width) return;
      const x = g.x0 - (trackLeft ?? 0);
      const distL = Math.abs(x - px(l));
      const distR = Math.abs(x - px(r));
      setDrag(distL <= distR ? 'left' : 'right');
    },
    onPanResponderMove: (_, g) => {
      if (!width) return;
      const x = (g.moveX - (trackLeft ?? 0));
      const clamped = Math.max(0, Math.min(width, x));
      const v = val(clamped);
      if (drag === 'left') onChange([Math.min(v, r), r]);
      if (drag === 'right') onChange([l, Math.max(v, l)]);
    },
    onPanResponderRelease: () => setDrag(null),
  }), [width, l, r, drag, trackLeft]);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
    requestAnimationFrame(() => {
      trackRef.current?.measure((_x,_y,_w,_h, left) => setTrackLeft(left));
    });
  };

  return (
    <View style={styles.wrap}>
      <View ref={trackRef} onLayout={onLayout} style={styles.track}>
        <View style={[styles.fill, { left: px(l), right: Math.max(0, width - px(r)) }]} />
        <Thumb x={px(l)} testID="thumb-left" {...pan.panHandlers} />
        <Thumb x={px(r)} testID="thumb-right" {...pan.panHandlers} />
      </View>
    </View>
  );
}

function Thumb({ x, ...rest }: { x: number } & any) {
  return (
    <Pressable {...rest} style={[styles.thumb, { left: Math.max(0, x - 10) }]} />
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 10 },
  track: { height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, position: 'relative' as const },
  fill: { position: 'absolute', top: 0, bottom: 0, backgroundColor: '#0B6B53', borderRadius: 2 },
  thumb: { position: 'absolute', top: -8, width: 20, height: 20, borderRadius: 10, backgroundColor: '#0B6B53' },
});