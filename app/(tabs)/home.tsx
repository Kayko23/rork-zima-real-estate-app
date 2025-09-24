import React, { useState, useEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '@/components/home/HomeHeader';
import BiensFeed from '@/components/home/feeds/BiensFeed';
import ServicesFeed from '@/components/home/feeds/ServicesFeed';
import VoyagesFeed from '@/components/home/feeds/VoyagesFeed';

type TabKey = 'biens' | 'services' | 'voyages';

export default function HomeScreen() {
  const [tab, setTab] = useState<TabKey>('biens');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderContent = () => {
    if (!mounted) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      );
    }
    
    if (tab === 'services') return <ServicesFeed />;
    if (tab === 'voyages') return <VoyagesFeed />;
    return <BiensFeed />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F6F6" />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader active={tab} onChange={setTab} />
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6F6',
  },
  contentContainer: {
    paddingBottom: 96,
    backgroundColor: '#F3F6F6',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#6B7280',
  },
});

