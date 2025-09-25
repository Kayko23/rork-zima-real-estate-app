import React, { useMemo, useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AllSearchBar from '@/components/browse/AllSearchBar';
import FilterSheet from '@/components/sheets/FilterSheet';
import SearchSheet from '@/components/sheets/SearchSheet';
import { useAllFeed } from '@/hooks/useAllFeed';
import GroupedList from '@/components/browse/GroupedList';
import { groupItems, type GroupMode } from '@/lib/grouping';
import { PanelsTopLeft, List as ListIcon } from 'lucide-react-native';
import type { Kind } from '@/lib/all-api';

export default function BrowseTab() {
  const insets = useSafeAreaInsets();
  const feed = useAllFeed();
  const [searchVisible, setSearchVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [mode, setMode] = useState<GroupMode>('category');

  const sections = useMemo(() => groupItems(feed.items, mode), [feed.items, mode]);

  return (
    <View style={[s.container, { paddingBottom: insets.bottom }]}>
      <AllSearchBar
        scope={feed.query.only as Kind | undefined}
        onScope={(k) => feed.setQuery({ only: k, page: 1 })}
        onOpenSearch={() => setSearchVisible(true)}
        onOpenFilters={() => setFiltersVisible(true)}
      />

      <View style={s.toolbar}>
        <Pressable onPress={() => setMode('category')} style={[s.btn, mode==='category' && s.btnActive]} testID="group-toggle-category">
          <PanelsTopLeft size={16} color={mode==='category' ? '#fff' : '#0F172A'} />
          <Text style={[s.btnLabel, mode==='category' && s.btnLabelActive]}>Par catégorie</Text>
        </Pressable>
        <Pressable onPress={() => setMode('location')} style={[s.btn, mode==='location' && s.btnActive]} testID="group-toggle-location">
          <ListIcon size={16} color={mode==='location' ? '#fff' : '#0F172A'} />
          <Text style={[s.btnLabel, mode==='location' && s.btnLabelActive]}>Par ville/pays</Text>
        </Pressable>
      </View>

      <GroupedList
        sections={sections}
        loading={feed.loading}
        onEndReached={feed.loadMore}
        onRefresh={feed.refresh}
      />

      <SearchSheet
        section={'trips'}
        visible={searchVisible}
        onClose={()=>setSearchVisible(false)}
        initial={{ destination: feed.query.q, startDate: feed.query.startDate, endDate: feed.query.endDate, guests: feed.query.guests }}
        onApply={(q)=>{ feed.setQuery({ q: q.destination, startDate: q.startDate, endDate: q.endDate, guests: q.guests, page: 1 }); }}
      />
      <FilterSheet
        visible={filtersVisible}
        onClose={()=>setFiltersVisible(false)}
        value={{}}
        onChange={(f)=>{}}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  toolbar: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 6, paddingBottom: 8 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EEF2F7', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  btnActive: { backgroundColor: '#0B3B2E' },
  btnLabel: { fontWeight: '800', color: '#0F172A' },
  btnLabelActive: { color: '#fff' },
});
