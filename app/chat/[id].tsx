import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, Send, Paperclip, Smile } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { mockConversations } from '@/constants/data';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  type: 'text' | 'image' | 'file';
}

interface QuickMessage {
  id: string;
  text: string;
}

const quickMessages: QuickMessage[] = [
  { id: '1', text: 'Puis-je voir la documentation ?' },
  { id: '2', text: 'Puis-je avoir un rendez-vous ?' },
  { id: '3', text: 'Quel est le prix ?' },
  { id: '4', text: 'Est-ce disponible ?' },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showQuickMessages, setShowQuickMessages] = useState<boolean>(true);
  
  // Find the conversation
  const conversation = mockConversations.find(conv => conv.id === id);
  
  useEffect(() => {
    if (conversation) {
      // Initialize with existing messages from conversation
      const initialMessages: Message[] = [
        {
          id: '1',
          content: conversation.lastMessage.content,
          timestamp: conversation.lastMessage.timestamp,
          senderId: conversation.lastMessage.senderId,
          type: 'text',
        },
      ];
      setMessages(initialMessages);
    }
  }, [conversation]);
  
  if (!conversation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Conversation non trouvée</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const participant = conversation.participants[0];
  
  const sendMessage = (messageText: string) => {
    if (!messageText.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
      senderId: 'current-user', // This would be the current user's ID
      type: 'text',
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setShowQuickMessages(false);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // Simulate response (in real app, this would be handled by your messaging system)
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Merci pour votre message. Je vous réponds dès que possible.',
        timestamp: new Date().toISOString(),
        senderId: participant.id,
        type: 'text',
      };
      setMessages(prev => [...prev, responseMessage]);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };
  
  const handleQuickMessage = (quickMessage: QuickMessage) => {
    if (!quickMessage.text.trim()) return;
    if (quickMessage.text.length > 1000) return;
    const sanitizedText = quickMessage.text.trim();
    sendMessage(sanitizedText);
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };
  
  const isMyMessage = (senderId: string) => senderId === 'current-user';
  
  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen 
        options={{
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Image 
                source={{ uri: participant.avatar }} 
                style={styles.headerAvatar}
              />
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerName}>{participant.name}</Text>
                <Text style={styles.headerStatus}>
                  {participant.isOnline ? 'En ligne' : 'Hors ligne'}
                </Text>
              </View>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
              <ArrowLeft size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.background.primary,
          },
        }} 
      />
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageContainer,
              isMyMessage(msg.senderId) ? styles.myMessageContainer : styles.theirMessageContainer,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                isMyMessage(msg.senderId) ? styles.myMessageBubble : styles.theirMessageBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isMyMessage(msg.senderId) ? styles.myMessageText : styles.theirMessageText,
                ]}
              >
                {msg.content}
              </Text>
            </View>
            <Text style={styles.messageTime}>{formatTime(msg.timestamp)}</Text>
          </View>
        ))}
        
        {showQuickMessages && messages.length <= 1 && (
          <View style={styles.quickMessagesContainer}>
            <Text style={styles.quickMessagesTitle}>Messages rapides :</Text>
            {quickMessages.map((quickMsg) => (
              <TouchableOpacity
                key={quickMsg.id}
                style={styles.quickMessageButton}
                onPress={() => handleQuickMessage(quickMsg)}
              >
                <Text style={styles.quickMessageText}>{quickMsg.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Tapez votre message..."
            placeholderTextColor={Colors.text.secondary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity style={styles.emojiButton}>
            <Smile size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sendButton, message.trim() && styles.sendButtonActive]}
            onPress={() => sendMessage(message)}
            disabled={!message.trim()}
          >
            <Send size={20} color={message.trim() ? Colors.background.primary : Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
  },
  errorText: {
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.background.primary,
    fontWeight: '600',
  },
  headerBackButton: {
    padding: 8,
    marginLeft: -8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  theirMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  myMessageBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: Colors.background.primary,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: Colors.background.primary,
  },
  theirMessageText: {
    color: Colors.text.primary,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginHorizontal: 16,
  },
  quickMessagesContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
  },
  quickMessagesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  quickMessageButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    marginBottom: 8,
  },
  quickMessageText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  inputContainer: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.background.secondary,
    borderRadius: 20,
    fontSize: 16,
    color: Colors.text.primary,
    textAlignVertical: 'center',
  },
  emojiButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    lineHeight: 20,
  },
  headerStatus: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
});