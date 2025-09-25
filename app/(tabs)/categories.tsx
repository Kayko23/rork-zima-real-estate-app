import React, { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AllSearchBar from '@/components/browse/AllSearchBar';
import AllCard, { AllCardSkeleton } from '@/components/browse/AllCards';
import FilterSheet from '@/components/sheets/FilterSheet';
import SearchSheet from '@/components/sheets/SearchSheet';
import { useAllFeed } from '@/hooks/useAllFeed';
import type { Kind } from '@/lib/all-api';

export default function BrowseTab() {
  const insets = useSafeAreaInsets();
  const feed = useAllFeed();
  const [searchVisible, setSearchVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const header = (
    <AllSearchBar
      scope={feed.query.only as Kind | undefined}
      onScope={(k) => feed.setQuery({ only: k, page: 1 })}
      onOpenSearch={() => setSearchVisible(true)}
      onOpenFilters={() => setFiltersVisible(true)}
    />
  );

  return (
    <View style={{ flex:1, paddingBottom: insets.bottom }}>
      <FlatList
        data={feed.loading && feed.items.length===0 ? Array.from({length:8}).map((_,i)=>({id:`sk_${i}`} as any)) : feed.items}
        keyExtractor={(it:any, idx)=> it.id ? String(it.id) : `sk_${idx}`}
        renderItem={({item}:any)=> item.kind ? <AllCard item={item} /> : <AllCardSkeleton/>}
        ListHeaderComponent={header}
        onEndReachedThreshold={0.3}
        onEndReached={feed.loadMore}
        refreshControl={<RefreshControl refreshing={feed.loading && feed.items.length>0} onRefresh={feed.refresh}/>}        
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
        onChange={(f)=>{ /* map filters to query if needed */ }}
      />
    </View>
  );
}
