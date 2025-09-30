import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageCircle, Phone, Video, MoreHorizontal, Search } from 'lucide-react-native';
import NotificationBell from '@/components/ui/NotificationBell';
import { useApp } from '@/hooks/useAppStore';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

type MessageTab = 'all' | 'unread' | 'archived';

interface Conversation {
  id: string;
  clientName: string;
  clientAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  propertyTitle?: string;
  isOnline: boolean;
}

export default function MessagesScreen() {
  const { hasUnreadNotifications, markNotificationsAsRead } = useApp();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<MessageTab>('all');

  const conversations: Conversation[] = [
    {
      id: '1',
      clientName: 'John Doe',
      clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      lastMessage: 'Bonjour, je suis intéressé par la villa à East Legon',
      timestamp: '14:30',
      unreadCount: 2,
      propertyTitle: 'Villa East Legon',
      isOnline: true,
    },
    {
      id: '2',
      clientName: 'Marie Kouassi',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      lastMessage: 'Merci pour les informations. Quand peut-on visiter ?',
      timestamp: '12:15',
      unreadCount: 0,
      propertyTitle: 'Appartement Cocody',
      isOnline: false,
    },
    {
      id: '3',
      clientName: 'Paul Mensah',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      lastMessage: 'Le prix est-il négociable ?',
      timestamp: 'Hier',
      unreadCount: 1,
      propertyTitle: 'Bureau Plateau',
      isOnline: true,
    },
  ];

  const filteredConversations = conversations.filter(conv => {
    if (activeTab === 'unread') return conv.unreadCount > 0;
    if (activeTab === 'archived') return false; // No archived messages in demo
    return true;
  });

  const handleConversationPress = (conversation: Conversation) => {
    router.push({
      pathname: `/chat/${conversation.id}`,
      params: {
        name: conversation.clientName,
        avatar: conversation.clientAvatar,
      }
    } as any);
  };

  const handleCallPress = (conversationId: string) => {
    console.log('Call conversation:', conversationId);
  };

  const handleVideoPress = (conversationId: string) => {
    console.log('Video call conversation:', conversationId);
  };

  const handleNotificationPress = () => {
    markNotificationsAsRead();
  };

  const tabs = [
    { id: 'all' as MessageTab, label: 'Tous', count: conversations.length },
    { id: 'unread' as MessageTab, label: 'Non lus', count: conversations.filter(c => c.unreadCount > 0).length },
    { id: 'archived' as MessageTab, label: 'Archivés', count: 0 },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
          <NotificationBell 
            hasUnread={hasUnreadNotifications}
            onPress={handleNotificationPress}
          />
        </View>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              style={styles.conversationCard}
              onPress={() => handleConversationPress(conversation)}
            >
              <View style={styles.conversationHeader}>
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: conversation.clientAvatar }} style={styles.avatar} />
                  {conversation.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                
                <View style={styles.conversationInfo}>
                  <View style={styles.conversationTitleRow}>
                    <Text style={styles.clientName}>{conversation.clientName}</Text>
                    <Text style={styles.timestamp}>{conversation.timestamp}</Text>
                  </View>
                  
                  {conversation.propertyTitle && (
                    <Text style={styles.propertyTitle}>{conversation.propertyTitle}</Text>
                  )}
                  
                  <Text style={styles.lastMessage} numberOfLines={2}>
                    {conversation.lastMessage}
                  </Text>
                </View>
                
                {conversation.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.conversationActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleCallPress(conversation.id)}
                >
                  <Phone size={16} color={Colors.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleVideoPress(conversation.id)}
                >
                  <Video size={16} color={Colors.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <MoreHorizontal size={16} color={Colors.text.secondary} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MessageCircle size={48} color={Colors.text.secondary} />
            <Text style={styles.emptyTitle}>
              {activeTab === 'all' && 'Aucun message'}
              {activeTab === 'unread' && 'Aucun message non lu'}
              {activeTab === 'archived' && 'Aucun message archivé'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'all' && 'Les conversations avec vos clients apparaîtront ici'}
              {activeTab === 'unread' && 'Tous vos messages sont lus'}
              {activeTab === 'archived' && 'Les messages archivés apparaîtront ici'}
            </Text>
          </View>
        )}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  conversationCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  conversationHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  propertyTitle: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: Colors.background.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  conversationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(14, 90, 69, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 100,
  },
});