import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, PanResponder, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Bell, MessageCircle, Calendar, Heart, TrendingUp, Check, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';

const SWIPE_THRESHOLD = 80;

interface Notification {
  id: string;
  type: 'message' | 'appointment' | 'favorite' | 'listing';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  chatId?: string;
  propertyId?: string;
  providerId?: string;
  appointmentId?: string;
}

interface SwipeableNotificationProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (notification: Notification) => void;
  getIcon: (type: string) => any;
  getColor: (type: string) => string;
  formatTime: (timestamp: string) => string;
}

function SwipeableNotification({
  notification,
  onMarkAsRead,
  onDelete,
  onPress,
  getIcon,
  getColor,
  formatTime,
}: SwipeableNotificationProps) {
  const { width: screenWidth } = useWindowDimensions();
  const translateX = useRef(new Animated.Value(0)).current;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return !isAnimating && Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 50;
    },
    onPanResponderMove: (_, gestureState) => {
      if (!isAnimating) {
        translateX.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > SWIPE_THRESHOLD) {
        // Swipe right - Mark as read
        if (!notification.isRead && !isAnimating) {
          setIsAnimating(true);
          Animated.timing(translateX, {
            toValue: screenWidth,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onMarkAsRead(notification.id);
            translateX.setValue(0);
            setIsAnimating(false);
          });
        } else {
          // Already read, just bounce back
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      } else if (gestureState.dx < -SWIPE_THRESHOLD) {
        // Swipe left - Delete
        if (!isAnimating) {
          setIsDeleting(true);
          setIsAnimating(true);
          Animated.timing(translateX, {
            toValue: -screenWidth,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onDelete(notification.id);
          });
        }
      } else {
        // Bounce back
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const IconComponent = getIcon(notification.type);
  const iconColor = getColor(notification.type);

  if (isDeleting) {
    return null;
  }

  return (
    <View style={styles.swipeContainer}>
      {/* Background actions */}
      <View style={styles.actionsContainer}>
        {/* Mark as read action (right side) */}
        <View style={[styles.actionLeft, { backgroundColor: Colors.success }]}>
          <Check size={24} color="white" />
          <Text style={styles.actionText}>Marquer comme lu</Text>
        </View>
        
        {/* Delete action (left side) */}
        <View style={[styles.actionRight, { backgroundColor: Colors.error }]}>
          <Trash2 size={24} color="white" />
          <Text style={styles.actionText}>Supprimer</Text>
        </View>
      </View>

      {/* Main notification content */}
      <Animated.View
        style={[{ transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={[
            styles.notificationItem,
            !notification.isRead && styles.unreadNotification
          ]}
          onPress={() => onPress(notification)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
            <IconComponent size={20} color={iconColor} />
          </View>
          
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.timestamp}>{formatTime(notification.timestamp)}</Text>
            </View>
            
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {notification.message}
            </Text>
          </View>
          
          {!notification.isRead && <View style={styles.unreadDot} />}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'Nouveau message',
      message: 'Kwame Asante vous a envoyé un message concernant la villa East Legon',
      timestamp: '2024-01-21T10:30:00Z',
      isRead: false,
      chatId: 'chat-1',
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Rendez-vous confirmé',
      message: 'Votre visite de demain à 14h00 a été confirmée',
      timestamp: '2024-01-21T09:15:00Z',
      isRead: false,
      appointmentId: 'appt-1',
    },
    {
      id: '3',
      type: 'favorite',
      title: 'Nouveau bien favori',
      message: 'Un nouveau bien correspondant à vos critères a été ajouté',
      timestamp: '2024-01-20T16:45:00Z',
      isRead: true,
      propertyId: '1',
    },
    {
      id: '4',
      type: 'listing',
      title: 'Baisse de prix',
      message: 'Le prix de l\'appartement Victoria Island a été réduit de 10%',
      timestamp: '2024-01-20T14:20:00Z',
      isRead: true,
      propertyId: '2',
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return MessageCircle;
      case 'appointment':
        return Calendar;
      case 'favorite':
        return Heart;
      case 'listing':
        return TrendingUp;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
        return Colors.blue;
      case 'appointment':
        return Colors.success;
      case 'favorite':
        return Colors.error;
      case 'listing':
        return Colors.warning;
      default:
        return Colors.text.secondary;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays}j`;
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (notification && notification.id && notification.id.trim()) {
      console.log('Notification pressed:', notification.id, notification);
      
      if (!notification.isRead) {
        markAsRead(notification.id);
      }
      
      switch (notification.type) {
        case 'message':
          if (notification.chatId) {
            router.push(`/chat/${notification.chatId}`);
          } else {
            router.push('/(tabs)/messages');
          }
          break;
        case 'appointment':
          if (notification.appointmentId) {
            router.push(`/appointment/book?id=${notification.appointmentId}`);
          } else {
            router.push('/(tabs)/profile');
          }
          break;
        case 'favorite':
          if (notification.propertyId) {
            router.push(`/property/${notification.propertyId}`);
          } else {
            router.push('/(tabs)/favorites');
          }
          break;
        case 'listing':
          if (notification.propertyId) {
            router.push(`/property/${notification.propertyId}`);
          } else {
            router.push('/(tabs)/home');
          }
          break;
        default:
          router.push('/(tabs)/home');
          break;
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Notifications',
          headerTransparent: false,
          headerStyle: { backgroundColor: Colors.background.primary },
          headerTitleStyle: { color: Colors.text.primary },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <SwipeableNotification
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              onPress={handleNotificationPress}
              getIcon={getNotificationIcon}
              getColor={getNotificationColor}
              formatTime={formatTime}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Bell size={48} color={Colors.text.secondary} />
            <Text style={styles.emptyTitle}>Aucune notification</Text>
            <Text style={styles.emptyText}>
              Vos notifications apparaîtront ici
            </Text>
          </View>
        )}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  content: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 8,
    marginTop: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
  swipeContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  actionLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  actionRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});