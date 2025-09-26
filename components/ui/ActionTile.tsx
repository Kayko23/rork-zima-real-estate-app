import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import AppButton from '@/components/ui/AppButton';

interface ActionTileProps {
  title: string;
  icon: React.ReactNode;
  onPress?: () => void;
  onPressUser?: () => void;
  onPressProvider?: () => void;
  href?: string;
  userHref?: string;
  providerHref?: string;
  variant?: 'primary' | 'secondary';
  testID?: string;
}

export default function ActionTile({ title, icon, onPress, onPressUser, onPressProvider, href, userHref, providerHref, variant = 'primary', testID }: ActionTileProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <AppButton
      onPress={onPress}
      onPressUser={onPressUser}
      onPressProvider={onPressProvider}
      href={href}
      userHref={userHref}
      providerHref={providerHref}
      accessibilityLabel={title}
      style={[
        styles.container,
        isPrimary ? styles.primaryContainer : styles.secondaryContainer
      ]}
      testID={testID ?? 'action-tile'}
      contentStyle={{ flexDirection: 'column', alignItems: 'center' }}
    >
      <View style={styles.iconContainer}>
        {React.isValidElement(icon) ? icon : null}
      </View>
      <Text style={[
        styles.title,
        isPrimary ? styles.primaryTitle : styles.secondaryTitle
      ]} numberOfLines={2}>
        {title}
      </Text>
    </AppButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  primaryContainer: {
    backgroundColor: 'rgba(14, 90, 69, 0.1)',
    borderColor: 'rgba(14, 90, 69, 0.2)',
  },
  secondaryContainer: {
    backgroundColor: 'rgba(158, 122, 43, 0.1)',
    borderColor: 'rgba(158, 122, 43, 0.2)',
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryTitle: {
    color: Colors.primary,
  },
  secondaryTitle: {
    color: Colors.gold,
  },
});