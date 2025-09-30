import React from 'react';
import { View, ScrollView, ViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT = 72;

type Props = ViewProps & {
  scroll?: boolean;
  children: React.ReactNode;
  withTabBarPadding?: boolean;
  stickyHeaderIndices?: number[];
};

export default function Screen({ 
  scroll, 
  withTabBarPadding = true, 
  style, 
  children, 
  stickyHeaderIndices,
  ...rest 
}: Props) {
  const insets = useSafeAreaInsets();
  const padBottom = (withTabBarPadding ? TAB_BAR_HEIGHT : 0) + insets.bottom + 16;

  if (scroll) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="always"
        style={[styles.scrollView, { paddingTop: insets.top + 8 }, style]}
        contentContainerStyle={{ paddingBottom: padBottom }}
        stickyHeaderIndices={stickyHeaderIndices}
        showsVerticalScrollIndicator={false}
        {...rest}>
        {children}
      </ScrollView>
    );
  }
  
  return (
    <View 
      style={[
        styles.view, 
        { paddingTop: insets.top + 8, paddingBottom: padBottom }, 
        style
      ]} 
      {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  view: {
    flex: 1,
  },
});
