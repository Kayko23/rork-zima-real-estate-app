import React, { useState, useRef, useMemo } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageBubble, { BubbleMessage } from '@/components/chat/MessageBubble';
import ChatInput from '@/components/chat/Composer';

type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
};

export default function ChatScreen() {
  const { id, name, avatar } = useLocalSearchParams<{ id: string; name?: string; avatar?: string }>();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<BubbleMessage>>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const contactName = name || `Contact ${id}`;
  const contactAvatar = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contactName)}&background=065f46&color=fff&size=128`;
  
  const myId = 'u_me' as const;
  const peerId = id || 'u_2' as const;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis intéressé par vos services.',
      senderId: myId,
      createdAt: '2025-09-26T14:30:00Z',
    },
    {
      id: '2',
      text: 'Bonjour ! Merci pour votre intérêt. Comment puis-je vous aider ?',
      senderId: peerId,
      createdAt: '2025-09-26T14:32:00Z',
    },
    {
      id: '3',
      text: 'Je cherche des informations sur vos tarifs et disponibilités.',
      senderId: myId,
      createdAt: '2025-09-26T14:35:00Z',
    },
    {
      id: '4',
      text: 'Bien sûr ! Nos tarifs varient selon le type de service. Pouvez-vous me dire quel service vous intéresse exactement ?',
      senderId: peerId,
      createdAt: '2025-09-26T14:37:00Z',
    },
  ]);

  const data = useMemo<BubbleMessage[]>(
    () =>
      messages.map((m) => ({
        id: m.id,
        text: m.text,
        createdAt: new Date(m.createdAt),
        side: m.senderId === myId ? 'right' : 'left',
      })),
    [messages, myId]
  );

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      senderId: myId,
      createdAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
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
        senderId: peerId,
        createdAt: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, responseMessage]);
      timeoutRef.current = null;
    }, 1000 + Math.random() * 2000);
  };



  return (
    <View style={styles.container}>
      <ChatHeader
        title={contactName}
        avatar={contactAvatar}
        onBack={() => router.back()}
        subtitle="En ligne"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 56}
      >
        <FlatList
          ref={listRef}
          data={[...data].reverse()}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={{
            paddingTop: 8,
            paddingBottom: insets.bottom + 12,
            backgroundColor: '#F7F9FA',
          }}
          renderItem={({ item }) => <MessageBubble message={item} />}
        />

        <ChatInput
          placeholder="Tapez votre message…"
          onSend={sendMessage}
          disabled={false}
          bottomInset={insets.bottom}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});