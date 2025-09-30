import React from "react";
import { View, StyleSheet, LayoutChangeEvent, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

type Props = {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  step?: number;
  minGap?: number;
  renderLabel?: (val: number) => string;
};

function clamp(n:number, a:number, b:number){ 
  'worklet';
  return Math.min(Math.max(n,a), b); 
}

export default function RangeSliderAdvanced({
  min, max, value, onChange, step = 1000, minGap = 0, renderLabel,
}: Props) {
  const width = useSharedValue(0);
  const leftX = useSharedValue(0);
  const rightX = useSharedValue(0);

  const pxToVal = (x:number)=>{
    'worklet';
    if (!width.value || width.value === 0) return min;
    const ratio = x / width.value;
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    return clamp(stepped, min, max);
  };

  const valToPx = (v:number)=>{
    'worklet';
    if (!width.value || width.value === 0) return 0;
    const ratio = (v - min) / (max - min);
    return ratio * width.value;
  };

  const onLayout = (e: LayoutChangeEvent) => {
    width.value = e.nativeEvent.layout.width;
    leftX.value  = valToPx(value[0]);
    rightX.value = valToPx(value[1]);
  };

  const fireChange = (lx:number, rx:number)=>{
    const a = pxToVal(lx);
    const b = pxToVal(rx);
    onChange([Math.min(a,b), Math.max(a,b)]);
  };

  const bump = () => {
    if (typeof window === "undefined") return;
    // Haptics on native only (no-op on web)
    Haptics.selectionAsync().catch(()=>{});
  };

  const minPixelGap = minGap > 0 ? Math.max(0, (minGap / (max - min)) * (width.value || 0)) : 8;

  const panLeft = Gesture.Pan()
    .onChange((e)=> {
      if (!width.value || width.value === 0) return;
      const next = clamp(leftX.value + e.changeX, 0, rightX.value - minPixelGap);
      leftX.value = next;
      runOnJS(fireChange)(leftX.value, rightX.value);
    })
    .onEnd(()=> runOnJS(bump)());

  const panRight = Gesture.Pan()
    .onChange((e)=> {
      if (!width.value || width.value === 0) return;
      const next = clamp(rightX.value + e.changeX, leftX.value + minPixelGap, width.value);
      rightX.value = next;
      runOnJS(fireChange)(leftX.value, rightX.value);
    })
    .onEnd(()=> runOnJS(bump)());

  const aFill = useAnimatedStyle(()=>({
    left: leftX.value,
    right: (width.value || 0) - rightX.value,
  }));
  const aLeft = useAnimatedStyle(()=>({ transform:[{ translateX: leftX.value }] }));
  const aRight= useAnimatedStyle(()=>({ transform:[{ translateX: rightX.value }] }));

  const tap = Gesture.Tap().onStart((e)=>{
    const dx = e.x - leftX.value;
    const dy = rightX.value - e.x;
    if (Math.abs(dx) < Math.abs(dy)) {
      leftX.value = withTiming(clamp(e.x, 0, rightX.value));
    } else {
      rightX.value = withTiming(clamp(e.x, leftX.value, width.value));
    }
    runOnJS(fireChange)(leftX.value, rightX.value);
  });

  const [a,b] = value;
  return (
    <GestureDetector gesture={tap}>
      <View style={s.wrap} onLayout={onLayout} testID="range-slider-advanced">
        <View style={s.track}/>
        <Animated.View style={[s.fill, aFill]}/>
        <GestureDetector gesture={panLeft}>
          <Animated.View style={[s.knob, aLeft]} />
        </GestureDetector>
        <GestureDetector gesture={panRight}>
          <Animated.View style={[s.knob, aRight]} />
        </GestureDetector>

        <Animated.View style={[s.label, aLeft]}>
          <Text style={s.labelTxt}>{renderLabel ? renderLabel(a) : String(a)}</Text>
        </Animated.View>
        <Animated.View style={[s.label, aRight, { transform:[{ translateX: (rightX.value) }] }] }>
          <Text style={s.labelTxt}>{renderLabel ? renderLabel(b) : String(b)}</Text>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const s = StyleSheet.create({
  wrap:{ height: 54, justifyContent:"center" },
  track:{ position:"absolute", left:0, right:0, height:8, borderRadius:999, backgroundColor:"#E6EFEC" },
  fill:{ position:"absolute", height:8, borderRadius:999, backgroundColor:"#134E48" },
  knob:{
    position:"absolute", top:54/2-16, width:32, height:32, borderRadius:16,
    backgroundColor:"#fff", borderWidth:2, borderColor:"#134E48",
    shadowColor:"#000", shadowOpacity:.12, shadowRadius:6, shadowOffset:{width:0,height:2}, elevation:3
  },
  label:{ position:"absolute", bottom:36, width:120, alignItems:"center" },
  labelTxt:{ backgroundColor:"#0B3B36", color:"#fff", fontWeight:"800",
    paddingHorizontal:8, paddingVertical:4, borderRadius:8, overflow:"hidden", fontSize:12 },
});
