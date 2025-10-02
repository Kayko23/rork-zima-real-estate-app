import React from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { Home, Briefcase, BedDouble } from "lucide-react-native";
import { colors, radius } from "@/theme/tokens";

type TabKey = "props" | "pros" | "trips";
const tabs: { key: TabKey; label: string; Icon: any }[] = [
  { key: "props", label: "Propriétés", Icon: Home },
  { key: "pros",  label: "Professionnels", Icon: Briefcase },
  { key: "trips", label: "Voyages", Icon: BedDouble },
];

export default function SegmentedTabs({ value, onChange }: { value: TabKey; onChange: (k:TabKey)=>void }) {
  const [w, setW] = React.useState<number>(0);
  const x = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const idx = tabs.findIndex(t => t.key === value);
    Animated.spring(x, { toValue: (w / 3) * idx, useNativeDriver: true, bounciness: 8 }).start();
  }, [value, w, x]);

  return (
    <View style={styles.wrap} onLayout={e => setW(e.nativeEvent.layout.width)}>
      <Animated.View style={[styles.indicator, { width: w/3, transform: [{ translateX: x }] }]} />
      {tabs.map(({key,label,Icon}) => (
        <Pressable
          key={key}
          android_ripple={{ color: colors.primarySoft }}
          onPress={() => onChange(key)}
          style={({pressed})=>[styles.item, pressed && { opacity: .7 }]}
          accessibilityRole="button"
          accessibilityState={{ selected: value===key }}
          testID={`segmented-${key}`}
        >
          <Icon size={18} color={value===key ? colors.primary : colors.sub} />
          <Text style={[styles.txt, value===key && { color: colors.primary, fontWeight: "700" }]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap:{ flexDirection:"row", backgroundColor: colors.panel, borderRadius: radius.xl, padding:6 },
  indicator:{ position:"absolute", top:6, bottom:6, left:6, backgroundColor: "#F0FAF7", borderRadius: radius.lg },
  item:{ flex:1, height:44, borderRadius: radius.lg, alignItems:"center", justifyContent:"center", gap:6, flexDirection:"row" },
  txt:{ color: colors.sub, fontSize:15 }
});
