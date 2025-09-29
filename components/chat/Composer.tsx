import React, { useState } from "react";
import { View, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Text } from "react-native";

export default function ChatComposer({ onSend, onPickDocs }:{ onSend:(t:string)=>void; onPickDocs:()=>void; }) {
  const [v, setV] = useState("");
  
  function submit() { 
    const t = v.trim(); 
    if (!t) return; 
    onSend(t); 
    setV(""); 
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={s.wrap}>
        <Pressable onPress={onPickDocs} style={s.icon}>
          <Text style={s.iconText}>📎</Text>
        </Pressable>
        <TextInput
          style={s.input}
          placeholder="Tapez votre message…"
          value={v}
          onChangeText={setV}
          multiline
        />
        <Pressable onPress={submit} style={s.send}>
          <Text style={s.sendText}>Envoyer</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { 
    flexDirection: "row", 
    alignItems: "flex-end", 
    gap: 8, 
    padding: 10, 
    backgroundColor: "#fff", 
    borderTopWidth: 1, 
    borderColor: "#E6ECE9" 
  },
  icon: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "#F1F6F4" 
  },
  iconText: { 
    fontSize: 18 
  },
  input: { 
    flex: 1, 
    minHeight: 40, 
    maxHeight: 120, 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    backgroundColor: "#F7F9F8" 
  },
  send: { 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    borderRadius: 12, 
    backgroundColor: "#1F2937" 
  },
  sendText: { 
    color: "#fff", 
    fontWeight: "700" 
  },
});