import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Paperclip } from 'lucide-react-native';
import Colors from '@/constants/colors';

type Message = {
  id: string;
  text: string;
  isMe: boolean;
  timestamp: string;
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string; ctx?: string }>();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [message, setMessage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis intéressé par vos services.',
      isMe: true,
      timestamp: '14:30',
    },
    {
      id: '2',
      text: 'Bonjour ! Merci pour votre intérêt. Comment puis-je vous aider ?',
      isMe: false,
      timestamp: '14:32',
    },
    {
      id: '3',
      text: 'Je cherche des informations sur vos tarifs et disponibilités.',
      isMe: true,
      timestamp: '14:35',
    },
    {
      id: '4',
      text: 'Bien sûr ! Nos tarifs varient selon le type de service. Pouvez-vous me dire quel service vous intéresse exactement ?',
      isMe: false,
      timestamp: '14:37',
    },
  ]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new message is added
    if (messages.length > 0) {
      const scrollTimeout = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      return () => clearTimeout(scrollTimeout);
    }
  }, [messages]);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      isMe: true,
      timestamp: new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simulate response after a delay
    timeoutRef.current = setTimeout(() => {
      const responses = [
        'Merci pour votre message !',
        'Je vais vérifier cela pour vous.',
        'Pouvez-vous me donner plus de détails ?',
        'C\'est noté, je reviens vers vous rapidement.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isMe: false,
        timestamp: new Date().toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      };
      
      setMessages(prev => [...prev, responseMessage]);
      timeoutRef.current = null;
    }, 1000 + Math.random() * 2000);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isMe ? styles.myMessage : styles.theirMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.isMe ? styles.myMessageText : styles.theirMessageText
      ]}>
        {item.text}
      </Text>
      <Text style={[
        styles.timestamp,
        item.isMe ? styles.myTimestamp : styles.theirTimestamp
      ]}>
        {item.timestamp}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: `Chat avec ${id}`,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={[
          styles.messagesContent,
          { paddingBottom: Math.max(insets.bottom, 16) }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[
          styles.inputContainer,
          Platform.OS === 'android' && keyboardHeight > 0 && {
            marginBottom: keyboardHeight - insets.bottom
          }
        ]}>
          <SafeAreaView edges={['bottom']} style={styles.inputSafeArea}>
            <View style={styles.inputRow}>
              <TouchableOpacity style={styles.attachButton}>
                <Paperclip size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.textInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Tapez votre message..."
                placeholderTextColor={Colors.text.secondary}
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={sendMessage}
                blurOnSubmit={false}
              />
              
              <TouchableOpacity 
                style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!message.trim()}
              >
                <Send size={20} color={message.trim() ? '#fff' : Colors.text.secondary} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingTop: 8,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    maxWidth: '85%',
    marginVertical: 3,
    padding: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 6,
    marginLeft: '15%',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 6,
    marginRight: '15%',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: Colors.text.primary,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '500',
  },
  myTimestamp: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
  },
  theirTimestamp: {
    color: Colors.text.secondary,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  inputSafeArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  attachButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background.secondary,
    borderRadius: 21,
    fontSize: 16,
    textAlignVertical: 'top',
    color: Colors.text.primary,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.background.secondary,
    shadowOpacity: 0,
    elevation: 0,
  },
});