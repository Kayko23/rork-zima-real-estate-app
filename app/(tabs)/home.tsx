import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeHeader from '@/components/home/HomeHeader';
import BiensFeed from '@/components/home/feeds/BiensFeed';
import ServicesFeed from '@/components/home/feeds/ServicesFeed';
import VoyagesFeed from '@/components/home/feeds/VoyagesFeed';

type TabKey = "biens" | "services" | "voyages";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabKey>("biens");

  const Content = useMemo(() => {
    if (tab === "services") return <ServicesFeed />;
    if (tab === "voyages") return <VoyagesFeed />;
    return <BiensFeed />;
  }, [tab]);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader active={tab} onChange={setTab} />
      {Content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3F6F6",
  },
  contentContainer: {
    paddingBottom: 96,
  },
});

