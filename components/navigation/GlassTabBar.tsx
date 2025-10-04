import React from "react";
import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GlassTabBar({ state, descriptors, navigation }: any) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(bottom, 12) }]}>
      {(state.routes as any[]).map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? (options.tabBarLabel as string)
            : (options.title as string) ?? route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        const Icon = options.tabBarIcon as any;
        const isCenter = route.name === "properties";

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            style={[styles.item, isCenter && styles.center]}
            testID={`tab-${route.name}`}
         >
            {Icon ? (
              <Icon color={isFocused ? "#0e5a43" : "#6b7280"} size={isCenter ? 24 : 22} />
            ) : null}
            <Text style={[styles.label, isFocused && styles.labelActive]} numberOfLines={1} testID={`tab-label-${route.name}`}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.6)",
    ...(Platform.OS === "ios"
      ? { backdropFilter: "blur(16px)" as any }
      : {}),
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  item: {
    flex: 1,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    gap: 4,
  },
  center: {
    transform: [{ translateY: -8 }],
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  label: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "600",
  },
  labelActive: {
    color: "#0e5a43",
  },
});