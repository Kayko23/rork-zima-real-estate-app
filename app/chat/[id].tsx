import React, { useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import { uploadToBackendAsync, isImageMime } from "@/lib/upload";
import type { ChatMessage } from "@/lib/chat/types";
import QuickReplies from "@/components/chat/QuickReplies";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatComposer from "@/components/chat/Composer";
import Colors from "@/constants/colors";
import { mockConversations } from "@/constants/data";

export default function ChatThread() {
  const { id, ctx = "property", providerName } = useLocalSearchParams<{ 
    id: string; 
    ctx?: "property" | "service" | "trip";
    providerName?: string;
  }>();
  const router = useRouter();
  const me = { id: "current-user" };
  const [items, setItems] = useState<ChatMessage[]>([]);

  // Find the conversation or create a mock one for new chats
  const conversation = mockConversations.find(conv => conv.id === id) || {
    id: id || 'new-chat',
    participants: [{
      id: 'provider-1',
      name: providerName || 'Prestataire',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
      isOnline: true,
    }],
    lastMessage: {
      content: 'Bonjour ! Comment puis-je vous aider ?',
      timestamp: new Date().toISOString(),
      senderId: 'provider-1',
    },
    unreadCount: 0,
    category: 'services' as const,
  };

  const participant = conversation.participants[0];

  function add(m: ChatMessage) { 
    setItems(prev => [m, ...prev]); 
  }

  function sendText(text: string) {
    if (!text.trim()) return;
    add({ 
      id: Date.now().toString(), 
      type: "text", 
      text: text.trim(), 
      createdAt: Date.now(), 
      senderId: me.id 
    });
  }

  async function pickAndSendDocs() {
    try {
      const res = await DocumentPicker.getDocumentAsync({ 
        multiple: true, 
        copyToCacheDirectory: true 
      });
      
      if (res.canceled) return;
      
      for (const asset of res.assets) {
        const uploaded = await uploadToBackendAsync({ 
          uri: asset.uri, 
          name: asset.name ?? "document", 
          mimeType: asset.mimeType ?? undefined, 
          size: asset.size 
        });
        
        const type = isImageMime(uploaded.mime) ? "image" : "file";
        add({ 
          id: Date.now().toString() + Math.random(), 
          type, 
          file: { ...uploaded }, 
          createdAt: Date.now(), 
          senderId: me.id 
        } as ChatMessage);
      }
    } catch (error) {
      console.error("Error picking documents:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
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

      <FlatList
        inverted
        data={items}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.messagesContent}
        renderItem={({ item }) => (
          <MessageBubble msg={item} isMine={item.senderId === me.id} />
        )}
      />

      <QuickReplies
        role={"provider"}
        ctx={ctx as any}
        hasDocs={true}
        onSelect={(text, id) => {
          if (id === "shareDocs" || id === "docs") return pickAndSendDocs();
          sendText(text);
        }}
      />

      <ChatComposer
        onSend={sendText}
        onPickDocs={pickAndSendDocs}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  messagesContent: {
    padding: 12,
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
  headerBackButton: {
    padding: 8,
    marginLeft: -8,
  },
});