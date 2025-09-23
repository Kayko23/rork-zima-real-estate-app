import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopTabsControlled from './TopTabsControlled';
import Colors from '@/constants/colors';

type TabKey = 'biens' | 'services' | 'voyages';

type Props = {
  active: TabKey;
  onChange: (v: TabKey) => void;
};

export default function HomeHeader({ active, onChange }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <Text style={styles.brand}>ZIMA</Text>
      <TopTabsControlled active={active} onChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F6F6',
    paddingBottom: 12,
  },
  brand: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.text.primary,
    marginBottom: 8,
  },
});