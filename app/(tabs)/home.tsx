import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, View, Text } from 'react-native';
import Screen from '@/components/layout/Screen';
import HomeHeader from '@/components/home/HomeHeader';
import BiensFeed from '@/components/home/feeds/BiensFeed';
import ServicesFeed from '@/components/home/feeds/ServicesFeed';
import VoyagesFeed from '@/components/home/feeds/VoyagesFeed';
import { useApp } from '@/hooks/useAppStore';

export default function HomeScreen() {
  const { activeHomeTab, setHomeTab } = useApp();
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
    
    if (activeHomeTab === 'services') return <ServicesFeed />;
    if (activeHomeTab === 'voyages') return <VoyagesFeed />;
    return <BiensFeed />;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F6F6" />
      <Screen scroll>
        <HomeHeader active={activeHomeTab} onChange={setHomeTab} />
        {renderContent()}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

