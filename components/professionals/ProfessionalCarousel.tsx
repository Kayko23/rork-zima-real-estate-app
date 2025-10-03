import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ProfessionalCard, { type Provider } from './ProfessionalCard';

type Props = {
  title: string;
  category: Provider['category'];
  data: Provider[];
};

export default function ProfessionalCarousel({ title, category, data }: Props) {
  const router = useRouter();

  const goSeeAll = () => {
    router.push({ pathname: '/professional/category', params: { category } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={goSeeAll} hitSlop={8}>
          <Text style={styles.seeAll}>Voir tout ›</Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        snapToAlignment="start"
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View style={{ width: 248 }}>
            <ProfessionalCard
              item={item}
              onPressProfile={(id) => {
                console.log('[ProfessionalCarousel] Navigating to profile:', id);
                router.push(`/professional/${id}`);
              }}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0E2F26',
  },
  seeAll: {
    fontWeight: '700',
    color: '#0B6B53',
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
