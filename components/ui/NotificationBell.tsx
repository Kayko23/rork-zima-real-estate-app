import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface NotificationBellProps {
  hasUnread?: boolean;
  onPress: () => void;
  color?: string;
}

export default function NotificationBell({ 
  hasUnread = false, 
  onPress, 
  color = Colors.text.primary 
}: NotificationBellProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      testID="notification-bell"
    >
      <Bell size={24} color={color} />
      {hasUnread && <View style={styles.badge} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.pink,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});