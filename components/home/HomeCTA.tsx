import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useAppStore } from '@/hooks/useAppStore';
import CreateMenu from '@/components/pro/CreateMenu';
import { colors, radius } from '@/theme/tokens';

export default function HomeCTA() {
  const { isPro } = useAppStore();
  const [showMenu, setShowMenu] = useState(false);

  if (!isPro) {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        <Pressable
          onPress={() => setShowMenu(true)}
          style={({ pressed }) => [
            styles.button,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
          testID="cta-publish-pro"
        >
          <Text style={styles.icon}>＋</Text>
          <Text style={styles.text}>Publier</Text>
        </Pressable>
      </View>

      <CreateMenu visible={showMenu} onClose={() => setShowMenu(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    color: '#fff',
    fontWeight: '900' as const,
    fontSize: 20,
  },
  text: {
    color: '#fff',
    fontWeight: '800' as const,
    fontSize: 16,
  },
});
