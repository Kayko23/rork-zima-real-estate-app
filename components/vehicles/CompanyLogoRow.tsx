import React, { memo, useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettings } from '@/hooks/useSettings';

export type CompanyItem = {
  id: string;
  name: string;
  logo?: string | null;
  countryCode: string;
};

const PLACEHOLDER_LOGO = 'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?q=80&w=256&auto=format&fit=crop';

function getLogoSource(uri?: string | null) {
  const safe = uri?.trim();
  return safe ? { uri: safe } : { uri: PLACEHOLDER_LOGO };
}

function CompanyLogoRowBase({
  data,
  onPress,
}: {
  data?: CompanyItem[];
  onPress?: (c: CompanyItem) => void;
}) {
  const router = useRouter();
  const { country } = useSettings();

  const list = useMemo<CompanyItem[]>(() => {
    if (data && data.length > 0) return data;
    const cc = country?.code ?? 'CI';
    return [
      { id: 'c1', name: 'Elite Cars', countryCode: cc, logo: 'https://images.unsplash.com/photo-1554473675-267a0b3b090f?q=80&w=256&auto=format&fit=crop' },
      { id: 'c2', name: 'VIP Vans', countryCode: cc, logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=256&auto=format&fit=crop' },
      { id: 'c3', name: 'Pro Drivers', countryCode: cc, logo: null },
      { id: 'c4', name: 'Auto Market', countryCode: cc, logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=256&auto=format&fit=crop' },
      { id: 'c5', name: 'Chauffeurs CI', countryCode: cc, logo: null },
    ];
  }, [data, country?.code]);

  return (
    <FlatList
      testID="companyLogoRow"
      data={list}
      keyExtractor={(c) => c.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <Pressable
          testID={`company-${item.id}`}
          onPress={() => {
            if (onPress) return onPress(item);
            try {
              router.push({ pathname: '/vehicles/list', params: { companyId: item.id } });
            } catch (e) {
              console.log('CompanyLogoRow navigation error', e);
            }
          }}
          style={styles.card}
        >
          <Image source={getLogoSource(item.logo)} style={styles.logo} />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 12 },
  card: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  logo: { width: 48, height: 48, resizeMode: 'contain' },
});

const CompanyLogoRow = memo(CompanyLogoRowBase);
export default CompanyLogoRow;
