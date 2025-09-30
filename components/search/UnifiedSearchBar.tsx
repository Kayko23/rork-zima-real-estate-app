import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MapPin, Flag, Building2, BedDouble } from 'lucide-react-native';

type Props = {
  countryLabel: string;
  cityLabel: string;
  onPressCountry: () => void;
  onPressCity: () => void;
  mode: 'property' | 'trip';
  onChangeMode: (m: 'property' | 'trip') => void;
};

export default function UnifiedSearchBar(p: Props) {
  return (
    <View style={s.wrap}>
      <View style={s.row}>
        <Pressable style={s.chip} onPress={p.onPressCountry}>
          <Flag size={16} color="#163E2E" />
          <Text style={s.txt}>{p.countryLabel || 'Pays'}</Text>
        </Pressable>
        <Pressable style={s.chip} onPress={p.onPressCity}>
          <MapPin size={16} color="#163E2E" />
          <Text style={s.txt}>{p.cityLabel || 'Ville'}</Text>
        </Pressable>
      </View>

      <View style={s.tabs}>
        <Pressable 
          onPress={() => p.onChangeMode('property')} 
          style={[s.tab, p.mode === 'property' && s.tabActive]}>
          <Building2 size={16} color={p.mode === 'property' ? '#163E2E' : '#6B7280'} />
          <Text style={[s.tabTxt, p.mode === 'property' && s.tabTxtActive]}>Propriétés</Text>
        </Pressable>
        <Pressable 
          onPress={() => p.onChangeMode('trip')} 
          style={[s.tab, p.mode === 'trip' && s.tabActive]}>
          <BedDouble size={16} color={p.mode === 'trip' ? '#163E2E' : '#6B7280'} />
          <Text style={[s.tabTxt, p.mode === 'trip' && s.tabTxtActive]}>Voyages</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { 
    gap: 12,
    paddingHorizontal: 16,
  },
  row: { 
    flexDirection: 'row', 
    gap: 10,
  },
  chip: { 
    flexDirection: 'row', 
    gap: 8, 
    backgroundColor: '#F3F5F6', 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    borderRadius: 18,
    alignItems: 'center',
  },
  txt: { 
    fontWeight: '600' as const,
    fontSize: 14,
    color: '#163E2E',
  },
  tabs: { 
    flexDirection: 'row', 
    gap: 10,
  },
  tab: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    paddingVertical: 12, 
    borderRadius: 14, 
    backgroundColor: '#EEF1F2',
  },
  tabActive: { 
    backgroundColor: '#163E2E10', 
    borderWidth: 1, 
    borderColor: '#163E2E',
  },
  tabTxt: { 
    fontWeight: '600' as const, 
    color: '#6B7280',
    fontSize: 14,
  },
  tabTxtActive: { 
    color: '#163E2E',
  },
});
