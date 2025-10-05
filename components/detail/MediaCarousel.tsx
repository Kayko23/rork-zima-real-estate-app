import React from 'react';
import {View, Image, FlatList, Dimensions, StyleSheet, Text} from 'react-native';

export default function MediaCarousel({images}:{images?: string[]}) {
  const width = Dimensions.get('window').width;
  const safe = (uri?: string) => (uri && uri.trim().length>0 ? {uri} : null);

  return (
    <FlatList
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      data={images && images.length ? images : ['']}
      keyExtractor={(_,i)=>String(i)}
      renderItem={({item}) => {
        const src = safe(item);
        return (
          <View style={{width}}>
            {src ? (
              <Image source={src} style={{width, height: 260}} resizeMode="cover" />
            ) : (
              <View style={[styles.ph, {width, height:260}]}><Text style={styles.phTxt}>Aucune image</Text></View>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  ph:{backgroundColor:'#E5E7EB', alignItems:'center', justifyContent:'center'},
  phTxt:{color:'#9CA3AF', fontWeight:'600'}
});
