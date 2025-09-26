import React from "react";
import { View, Image, FlatList, Text, StyleSheet, useWindowDimensions } from "react-native";

export default function Gallery({ photos, countBadge }:{ photos:{uri:string}[]; countBadge?:boolean }) {
  const [idx, setIdx] = React.useState(0);
  const { width } = useWindowDimensions();
  return (
    <View style={s.wrap}>
      <FlatList
        data={photos}
        keyExtractor={(_,i)=>String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e)=>{
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIdx(i);
        }}
        renderItem={({item})=>(
          <Image source={item} style={[s.img, { width }]} />
        )}
      />
      {countBadge && (
        <View style={s.counter}><Text style={s.counterTxt}>{idx+1} / {photos.length}</Text></View>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  wrap:{},
  img:{ height: 260 },
  counter:{ position:"absolute", right:14, bottom:10, backgroundColor:"rgba(0,0,0,.45)", borderRadius:999, paddingHorizontal:10, paddingVertical:6 },
  counterTxt:{ color:"#fff", fontWeight:"900" }
});