import React, { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import HomeHeader from "@/components/home/HomeHeader";
import BiensFeed from "@/components/home/feeds/BiensFeed";
import ServicesFeed from "@/components/home/feeds/ServicesFeed";
import VoyagesFeed from "@/components/home/feeds/VoyagesFeed";

type TabKey = "biens" | "services" | "voyages";

export default function HomeScreen() {
  const [tab, setTab] = useState<TabKey>("biens");
  const insets = useSafeAreaInsets();

  const renderContent = () => {
    if (tab === "services") return <ServicesFeed />;
    if (tab === "voyages") return <VoyagesFeed />;
    return <BiensFeed />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F6F6" />
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top }]}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSpacer} />
        <HomeHeader active={tab} onChange={setTab} />
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6F6",
  },
  contentContainer: {
    paddingBottom: 96,
    backgroundColor: "#F3F6F6",
  },
  topSpacer: {
    backgroundColor: "#F3F6F6",
  },
});

