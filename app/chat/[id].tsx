import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Paperclip } from 'lucide-react-native';
import Colors from '@/constants/colors';

type Message = {
  id: string;
  text: string;
  isMe: boolean;
  timestamp: string;
};

export default function ChatScreen() {
  const { id, ctx } = useLocalSearchParams<{ id: string; ctx?: string }>();
  const [message, setMessage] = useState('');
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
  ]);

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
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        inverted={false}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
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
              multiline
              maxLength={500}
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
    paddingBottom: 8,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: Colors.text.primary,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  myTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  theirTimestamp: {
    color: Colors.text.secondary,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  inputSafeArea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.background.secondary,
  },
});