import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';

export default function Section({title, children, style}:{title:string; children:any; style?:ViewStyle}) {
  return (
    <View style={[s.box, style]}>
      <Text style={s.h}>{title}</Text>
      <View style={{marginTop:8}}>{children}</View>
    </View>
  );
}
const s = StyleSheet.create({
  box:{paddingHorizontal:16, paddingVertical:12},
  h:{fontSize:18, fontWeight:'800', color:'#0F172A'}
});
