import React from "react";
import { View, Image, FlatList, Text, StyleSheet, useWindowDimensions } from "react-native";

export default function Gallery({ photos, countBadge }:{ photos:{uri:string}[]; countBadge?:boolean }) {
  const [idx, setIdx] = React.useState<number>(0);
  const { width } = useWindowDimensions();
  return (
    <View testID="gallery-root">
      <FlatList
        data={photos}
        keyExtractor={(item, i)=>String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e)=>{
          const i = Math.round(e.nativeEvent.contentOffset.x / Math.max(1, width));
          setIdx(i);
          console.log("Gallery scrolled to", i);
        }}
        renderItem={({item})=> (
          <Image source={item} style={styles.slide(width)} />
        )}
      />
      {countBadge && (
        <View style={s.counter}><Text style={s.counterTxt}>{idx+1} / {photos.length}</Text></View>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  counter:{ position:"absolute", right:14, bottom:10, backgroundColor:"rgba(0,0,0,.45)", borderRadius:999, paddingHorizontal:10, paddingVertical:6 },
  counterTxt:{ color:"#fff", fontWeight:"900" }
});
const styles = { slide: (w:number) => ({ width: w, height: 260 }) };
