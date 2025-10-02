import React from "react";
import { Animated, Easing, StyleSheet, ViewStyle } from "react-native";

export default function Shimmer({ style }: { style?: ViewStyle }) {
  const v = React.useRef(new Animated.Value(0.3)).current;
  React.useEffect(() => {
    console.log("Shimmer: mount");
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
        Animated.timing(v, { toValue: 0.3, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
      ])
    );
    loop.start();
    return () => {
      console.log("Shimmer: unmount");
      loop.stop();
    };
  }, [v]);
  return <Animated.View testID="shimmer" style={[styles.shimmer, style, { opacity: v }]} />;
}
const styles = StyleSheet.create({
  shimmer: { backgroundColor: "#E9EEEC", borderRadius: 12 },
});
