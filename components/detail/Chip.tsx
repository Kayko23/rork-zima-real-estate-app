import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function Chip({label}:{label:string}) {
  return <View style={s.chip}><Text style={s.txt}>{label}</Text></View>;
}
const s = StyleSheet.create({
  chip:{backgroundColor:'#F1F5F9', borderRadius:18, paddingHorizontal:12, paddingVertical:6, marginRight:8, marginBottom:8},
  txt:{color:'#0F172A', fontWeight:'700'}
});
