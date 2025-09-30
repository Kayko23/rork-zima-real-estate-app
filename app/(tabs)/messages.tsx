import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Filter } from 'lucide-react-native';
import NotificationBell from '@/components/ui/NotificationBell';
import { mockConversations } from '@/constants/data';
import { useApp } from '@/hooks/useAppStore';
import Colors from '@/constants/colors';

type MessageTab = 'all' | 'properties' | 'services' | 'support';

export default function MessagesScreen() {
  const { hasUnreadNotifications, markNotificationsAsRead } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<MessageTab>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = React.useState<boolean>(false);

  const tabs = React.useMemo(() => {
    const propertiesCount = mockConversations.filter(c => c.category === 'properties').length;
    const servicesCount = mockConversations.filter(c => c.category === 'services').length;
    const supportCount = mockConversations.filter(c => c.category === 'support').length;
    const totalCount = mockConversations.length;
    
    return [
      { id: 'all' as MessageTab, label: 'Tout', count: totalCount },
      { id: 'properties' as MessageTab, label: 'Logements', count: propertiesCount },
      { id: 'services' as MessageTab, label: 'Services', count: servicesCount },
      { id: 'support' as MessageTab, label: 'Support ZIMA', count: supportCount },
    ];
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const handleConversationPress = (conversation: { id: string; participants: Array<{ name: string; avatar: string }> }) => {
    if (conversation && conversation.id && conversation.id.trim()) {
      console.log('Opening conversation:', conversation.id);
      const participant = conversation.participants[0];
      router.push({
        pathname: `/chat/${conversation.id}`,
        params: {
          name: participant.name,
          avatar: participant.avatar,
        }
      } as any);
    }
  };

  const handleNotificationPress = () => {
    markNotificationsAsRead();
    router.push('/notifications');
  };

  const handleFilterPress = () => {
    Alert.alert(
      'Filtres',
      'Choisissez vos filtres de conversation',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Non lus', onPress: () => console.log('Filter: Unread') },
        { text: 'Récents', onPress: () => console.log('Filter: Recent') },
        { text: 'Tous', onPress: () => console.log('Filter: All') }
      ]
    );
  };

  const filteredConversations = React.useMemo(() => {
    let filtered = mockConversations;
    
    // Filter by active tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(conv => conv.category === activeTab);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(conv => 
        conv.participants[0]?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [activeTab, searchQuery]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <NotificationBell 
          hasUnread={hasUnreadNotifications}
          onPress={handleNotificationPress}
        />
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.label}
                {tab.count > 0 && ` (${tab.count})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}>
          <Search size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une conversation..."
            placeholderTextColor={Colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
          <Filter size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              style={styles.conversationItem}
              onPress={() => handleConversationPress(conversation)}
            >
              <Image 
                source={{ uri: conversation.participants[0].avatar }} 
                style={styles.avatar} 
              />
              
              <View style={styles.conversationInfo}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.participantName} numberOfLines={1}>
                    {conversation.participants[0].name}
                  </Text>
                  <Text style={styles.timestamp}>
                    {formatTime(conversation.lastMessage.timestamp)}
                  </Text>
                </View>
                
                <View style={styles.messagePreview}>
                  <Text style={styles.lastMessage} numberOfLines={2}>
                    {conversation.lastMessage.content}
                  </Text>
                  {conversation.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>
                        {conversation.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {searchQuery.trim() ? 'Aucun résultat' : 'Aucune conversation'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery.trim() 
                ? `Aucune conversation trouvée pour "${searchQuery}"`
                : 'Vos conversations apparaîtront ici'
              }
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
  tabContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: Colors.background.primary,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.background.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    paddingVertical: 0,
  },
  searchBarFocused: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background.primary,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
    lineHeight: 18,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: Colors.background.primary,
    fontSize: 12,
    fontWeight: '600',
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
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
});