import React, { ReactNode, useMemo, useCallback } from 'react';
import { Pressable, ViewStyle, TextStyle, StyleProp, StyleSheet, Platform, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useApp } from '@/hooks/useAppStore';

export type Mode = 'user' | 'provider';

type AppButtonProps = {
  onPress?: () => void;
  onPressUser?: () => void;
  onPressProvider?: () => void;
  href?: string;
  userHref?: string;
  providerHref?: string;
  disabled?: boolean;
  children?: ReactNode;
  label?: string;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  testID?: string;
  hitSlop?: number | { top?: number; bottom?: number; left?: number; right?: number };
  requireAuth?: boolean;
};

export default function AppButton(props: AppButtonProps) {
  const {
    onPress,
    onPressUser,
    onPressProvider,
    href,
    userHref,
    providerHref,
    disabled,
    children,
    label,
    icon,
    style,
    contentStyle,
    textStyle,
    accessibilityLabel,
    testID,
    hitSlop,
  } = props;

  const { userMode } = useApp();
  const router = useRouter();

  const derivedDisabled = !!disabled;

  const handleNav = useCallback((target?: string) => {
    if (!target) return false;
    try {
      router.push(target as never);
      return true;
    } catch (e) {
      console.log('[AppButton] Navigation error', e);
      return false;
    }
  }, [router]);

  const handleHaptics = useCallback(async () => {
    if (Platform.OS !== 'web') {
      try { await Haptics.selectionAsync(); } catch {}
    }
  }, []);

  const handlePress = useCallback(() => {
    if (derivedDisabled) return;

    const modeSpecific = userMode === 'user' ? onPressUser : onPressProvider;
    const modeHref = userMode === 'user' ? userHref : providerHref;

    if (modeSpecific) {
      handleHaptics();
      modeSpecific();
      return;
    }

    if (modeHref || href) {
      handleHaptics();
      const ok = handleNav(modeHref ?? href);
      if (ok) return;
    }

    if (onPress) {
      handleHaptics();
      onPress();
      return;
    }

    console.log('[AppButton] No handler provided');
  }, [derivedDisabled, userMode, onPressUser, onPressProvider, userHref, providerHref, href, onPress, handleNav, handleHaptics]);

  const content = useMemo(() => {
    if (children) return children;
    return (
      <View style={[s.row, contentStyle]}>
        {icon ? <View style={s.icon}>{icon}</View> : null}
        {label ? <Text style={[s.label, textStyle]} numberOfLines={1}>{label}</Text> : null}
      </View>
    );
  }, [children, icon, label, contentStyle, textStyle]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof label === 'string' ? label : 'button')}
      disabled={derivedDisabled}
      style={({ pressed }) => [s.base, style, derivedDisabled && s.disabled, pressed && !derivedDisabled && s.pressed]}
      testID={testID ?? 'app-button'}
      hitSlop={hitSlop ?? 6}
    >
      {content}
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: {
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
});
