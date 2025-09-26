import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { pickPdfOrImage } from "./PickFile";

type DocItemProps = {
  label: string; 
  value: any; 
  onChange: (file: any) => void;
};

export default function DocItem({ label, value, onChange }: DocItemProps) {
  const handlePress = async () => {
    const file = await pickPdfOrImage();
    if (file) {
      onChange(file);
    }
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.btn} onPress={handlePress}>
        <Text style={styles.btnTxt}>{value ? "Remplacer" : "Ajouter"}</Text>
      </Pressable>
      {!!value && <Text style={styles.file}>{value.name}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    padding: 12, 
    borderWidth: 1, 
    borderColor: "#E7EDF3", 
    marginBottom: 10 
  },
  label: { 
    fontWeight: "800", 
    color: "#0B3C2F", 
    marginBottom: 8 
  },
  btn: { 
    alignSelf: "flex-start", 
    backgroundColor: "#0B3C2F", 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 8 
  },
  btnTxt: { 
    color: "#fff", 
    fontWeight: "800" 
  },
  file: { 
    marginTop: 8, 
    color: "#51626F" 
  },
});