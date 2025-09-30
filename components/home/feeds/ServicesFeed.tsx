import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Linking,
} from 'react-native';
import {
  ChevronRight,
} from 'lucide-react-native';
import { router } from 'expo-router';
import FusedSearch from '@/components/search/FusedSearch';
import ProviderCard, { Provider } from '@/components/professionals/ProviderCard';
import { CATEGORY_ORDER, providers } from '@/constants/professionals';



export default function ServicesFeed() {
  const grouped = useMemo(() => {
    const map: Record<string, Provider[]> = {};
    CATEGORY_ORDER.forEach(c => (map[c.key] = []));
    providers.forEach(p => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, []);

  const goProfile = (p: Provider) => {
    console.log('[ServicesFeed] goProfile called with:', p);
    
    if (!p?.id || String(p.id).trim().length === 0) {
      console.log('[ServicesFeed] Invalid provider ID:', p?.id);
      return;
    }
    
    console.log('[ServicesFeed] View profile:', p.id, 'Type:', typeof p.id, 'Provider:', p.name);
    
    try {
      const cleanId = String(p.id).trim();
      console.log('[ServicesFeed] Navigating to provider profile with ID:', cleanId);
      
      // Add a small delay to ensure any animations complete
      setTimeout(() => {
        router.push({
          pathname: '/provider/[id]',
          params: { id: cleanId }
        });
      }, 100);
      
    } catch (error) {
      console.error('[ServicesFeed] Navigation error:', error);
    }
  };
  
  const call = (p: Provider) => {
    if (p.id === '1') { // Aminata Diallo
      Linking.openURL('tel:+221771234567');
    } else {
      console.log('Call:', p.name);
    }
  };
  
  const wa = (p: Provider) => {
    if (p.id === '1') { // Aminata Diallo
      Linking.openURL('https://wa.me/221771234567');
    } else {
      console.log('WhatsApp:', p.name);
    }
  };
  
  const mail = (p: Provider) => {
    if (p.id === '1') { // Aminata Diallo
      Linking.openURL('mailto:aminata@zimarealty.com');
    } else {
      console.log('Email:', p.name);
    }
  };

  const handleSearchSubmit = (params: any) => {
    if (!params || typeof params !== 'object') return;
    if (typeof params === 'string' && params.trim().length === 0) return;
    console.log('Search params:', params);
  };

  return (
    <View style={styles.container}>
      <FusedSearch mode="services" onSubmit={handleSearchSubmit} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {CATEGORY_ORDER.map(({ key, title }) => {
          const data = grouped[key] || [];
          if (!data.length) return null;
          return (
            <View key={key} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>

                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/professionnels')}
                  style={styles.more}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.moreTxt}>Voir tout</Text>
                  <ChevronRight size={18} color="#0E5A46" />
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal
                data={data}
                keyExtractor={(i) => i.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => (
                  <ProviderCard
                    item={item}
                    onPressProfile={goProfile}
                    onPressCall={call}
                    onPressWhatsApp={wa}
                    onPressMail={mail}
                  />
                )}
              />
            </View>
          );
        })}

        <View style={styles.joinCTA}>
          <Text style={styles.joinTitle}>Vous êtes un professionnel de l&apos;immobilier ?</Text>
          <Text style={styles.joinSubtitle}>
            Rejoignez notre réseau de professionnels vérifiés et développez votre activité.
          </Text>
          <TouchableOpacity style={styles.joinButton} onPress={() => router.push('/(auth)/sign-up')}>
            <Text style={styles.joinButtonText}>Rejoindre ZIMA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 16,
    backgroundColor: '#F4F7F6',
    gap: 16,
  },
  section: { 
    marginTop: 18 
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#0F172A' 
  },
  more: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4 
  },
  moreTxt: { 
    color: '#0E5A46', 
    fontWeight: '700' 
  },
  joinCTA: {
    marginTop: 32,
    marginHorizontal: 16,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  joinTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0E1E1B',
    textAlign: 'center',
    marginBottom: 8,
  },
  joinSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  joinButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#0B5E55',
    borderRadius: 16,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  separator: {
    width: 4,
  },
});