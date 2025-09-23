import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '@/components/home/HomeHeader';
import BiensFeed from '@/components/home/feeds/BiensFeed';
import ServicesFeed from '@/components/home/feeds/ServicesFeed';
import VoyagesFeed from '@/components/home/feeds/VoyagesFeed';

type TabKey = 'biens' | 'services' | 'voyages';

export default function HomeScreen() {
  const [tab, setTab] = useState<TabKey>('biens');

  const renderContent = () => {
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
});

