import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PublishTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  useFocusEffect(
    React.useCallback(() => {
      router.push('/property/new');
    }, [router])
  );
  return (
    <SafeAreaView style={[s.wrap, { paddingTop: Math.max(insets.top, 8) }]} edges={['top']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} testID="publish-placeholder">
        <Text style={s.tx}>Chargement…</Text>
      </View>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  wrap: { flex: 1 },
  tx: { fontWeight: '600' },
});