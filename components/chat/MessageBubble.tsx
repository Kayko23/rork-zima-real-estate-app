import React from "react";
import { View, Text, StyleSheet, Pressable, Linking, Image } from "react-native";
import type { ChatMessage } from "@/lib/chat/types";

export default function MessageBubble({ msg, isMine }: { msg: ChatMessage; isMine: boolean }) {
  const bg = isMine ? "#DCFCE7" : "#FFFFFF";
  
  if (msg.type === "text") {
    return (
      <View style={[styles.wrap, { alignSelf: isMine ? "flex-end" : "flex-start" }]}>
        <View style={[styles.bubble, { backgroundColor: bg }]}>
          <Text style={styles.txt}>{msg.text}</Text>
        </View>
      </View>
    );
  }
  
  if (msg.type === "image") {
    return (
      <View style={[styles.wrap, { alignSelf: isMine ? "flex-end" : "flex-start" }]}>
        <Pressable 
          onPress={() => Linking.openURL(msg.file.url)} 
          style={[styles.bubble, { padding: 0, backgroundColor: "#0000" }]}
        >
          <Image 
            source={{ uri: msg.file.url }} 
            style={styles.image} 
          />
        </Pressable>
        <Text style={styles.meta} numberOfLines={1}>{msg.file.name}</Text>
      </View>
    );
  }
  
  // file generic
  return (
    <View style={[styles.wrap, { alignSelf: isMine ? "flex-end" : "flex-start" }]}>
      <Pressable 
        style={[styles.bubble, { backgroundColor: bg }]} 
        onPress={() => Linking.openURL(msg.file.url)}
      >
        <Text style={[styles.txt, { fontWeight: "700" }]} numberOfLines={1}>
          📎 {msg.file.name}
        </Text>
        {msg.file.size ? (
          <Text style={styles.meta}>
            {Math.round((msg.file.size / 1024 / 1024) * 10) / 10} Mo
          </Text>
        ) : null}
        <Text style={styles.meta}>Ouvrir</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { 
    marginVertical: 6, 
    maxWidth: "80%" 
  },
  bubble: { 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: "#E6ECE9" 
  },
  txt: { 
    fontSize: 16, 
    color: "#0B1F15" 
  },
  meta: { 
    color: "#65756D", 
    marginTop: 4, 
    fontSize: 12 
  },
  image: {
    width: 220,
    height: 160,
    borderRadius: 12
  },
});