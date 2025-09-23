import React, { useState } from 'react';
import { Text, TouchableOpacity, ScrollView, StyleSheet, View, Modal, Platform } from 'react-native';
import { ChevronDown, X, Check } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/colors';
import { FilterState } from '@/types';

interface FilterChip {
  id: string;
  label: string;
  value?: string;
  isActive?: boolean;
  options?: string[];
}

interface FilterChipsProps {
  chips: FilterChip[];
  onChipPress: (chipId: string) => void;
  onFilterChange: (filters: Partial<FilterState>) => void;
  filters?: FilterState;
}

const COUNTRIES = ['Ghana', 'Nigeria', 'Kenya', 'South Africa', 'Morocco', 'Egypt', 'Senegal', 'Ivory Coast'];
const CITIES = ['Accra', 'Lagos', 'Nairobi', 'Cape Town', 'Casablanca', 'Cairo', 'Dakar', 'Abidjan'];
const CATEGORIES = ['Résidences', 'Bureaux', 'Commerces', 'Terrains', 'Entrepôts'];
const PRICE_RANGES = [
  { label: 'Moins de 50k', value: [0, 50000] as [number, number] },
  { label: '50k - 100k', value: [50000, 100000] as [number, number] },
  { label: '100k - 250k', value: [100000, 250000] as [number, number] },
  { label: '250k - 500k', value: [250000, 500000] as [number, number] },
  { label: '500k+', value: [500000, 10000000] as [number, number] },
];

export default function FilterChips({ chips, onChipPress, onFilterChange, filters }: FilterChipsProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleOptionSelect = (chipId: string, option: string | [number, number]) => {
    let updates: Partial<FilterState> = {};
    
    switch (chipId) {
      case 'country':
        updates.country = option as string;
        break;
      case 'city':
        updates.city = option as string;
        break;
      case 'category':
        updates.category = option as string;
        break;
      case 'price':
        updates.priceRange = option as [number, number];
        break;
      case 'type':
        updates.type = option as 'sale' | 'rent';
        break;
    }
    
    onFilterChange(updates);
    setActiveModal(null);
  };

  const getChipValue = (chipId: string) => {
    if (!filters) {
      switch (chipId) {
        case 'country':
          return 'Tous les pays';
        case 'city':
          return 'Toutes les villes';
        case 'category':
          return 'Toutes catégories';
        case 'price':
          return 'Tous les prix';
        case 'type':
          return 'Tous types';
        default:
          return chipId;
      }
    }
    
    switch (chipId) {
      case 'country':
        return filters.country || 'Tous les pays';
      case 'city':
        return filters.city || 'Toutes les villes';
      case 'category':
        return filters.category || 'Toutes catégories';
      case 'price':
        if (filters.priceRange) {
          const range = PRICE_RANGES.find(r => 
            r.value[0] === filters.priceRange![0] && r.value[1] === filters.priceRange![1]
          );
          return range?.label || 'Prix personnalisé';
        }
        return 'Tous les prix';
      case 'type':
        return filters.type === 'sale' ? 'À vendre' : filters.type === 'rent' ? 'À louer' : 'Tous types';
      default:
        return chipId;
    }
  };

  const getOptions = (chipId: string) => {
    switch (chipId) {
      case 'country':
        return COUNTRIES;
      case 'city':
        return CITIES;
      case 'category':
        return CATEGORIES;
      case 'price':
        return PRICE_RANGES.map(r => r.label);
      case 'type':
        return ['À vendre', 'À louer'];
      default:
        return [];
    }
  };

  const renderModal = () => {
    if (!activeModal) return null;

    const options = getOptions(activeModal);
    
    return (
      <Modal
        visible={true}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <View style={styles.modalContainer}>
            {Platform.OS === 'web' ? (
              <View style={[styles.modalContent, styles.webModalContent]} />
            ) : (
              <BlurView intensity={20} tint="light" style={styles.modalContent} />
            )}
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {activeModal === 'country' && 'Choisir un pays'}
                {activeModal === 'city' && 'Choisir une ville'}
                {activeModal === 'category' && 'Choisir une catégorie'}
                {activeModal === 'price' && 'Choisir une gamme de prix'}
                {activeModal === 'type' && 'Type de transaction'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setActiveModal(null)}
              >
                <X size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.optionsList}>
              {activeModal === 'price' ? (
                PRICE_RANGES.map((range) => (
                  <TouchableOpacity
                    key={`${range.value[0]}-${range.value[1]}`}
                    style={styles.option}
                    onPress={() => handleOptionSelect(activeModal, range.value)}
                  >
                    <Text style={styles.optionText}>{range.label}</Text>
                    {filters && filters.priceRange && 
                     filters.priceRange[0] === range.value[0] && 
                     filters.priceRange[1] === range.value[1] && (
                      <Check size={16} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))
              ) : activeModal === 'type' ? (
                ['À vendre', 'À louer'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.option}
                    onPress={() => {
                      if (type.trim()) {
                        handleOptionSelect(activeModal, type === 'À vendre' ? 'sale' : 'rent');
                      }
                    }}
                  >
                    <Text style={styles.optionText}>{type}</Text>
                    {filters && ((type === 'À vendre' && filters.type === 'sale') || 
                      (type === 'À louer' && filters.type === 'rent')) && (
                      <Check size={16} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.option}
                    onPress={() => {
                      if (option.trim()) {
                        handleOptionSelect(activeModal, option);
                      }
                    }}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                    {filters && ((activeModal === 'country' && filters.country === option) ||
                      (activeModal === 'city' && filters.city === option) ||
                      (activeModal === 'category' && filters.category === option)) && (
                      <Check size={16} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {chips.map((chip) => {
          const isActive = filters ? (
            (chip.id === 'country' && filters.country) ||
            (chip.id === 'city' && filters.city) ||
            (chip.id === 'category' && filters.category) ||
            (chip.id === 'price' && filters.priceRange) ||
            (chip.id === 'type' && filters.type)
          ) : false;
          
          return (
            <TouchableOpacity
              key={chip.id}
              style={[
                styles.chip,
                isActive && styles.activeChip
              ]}
              onPress={() => setActiveModal(chip.id)}
              testID={`filter-chip-${chip.id}`}
            >
              <Text style={[
                styles.chipText,
                isActive && styles.activeChipText
              ]}>
                {getChipValue(chip.id)}
              </Text>
              <ChevronDown 
                size={16} 
                color={isActive ? Colors.background.primary : Colors.text.secondary} 
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {renderModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 8,
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(26px)',
    }),
  },
  activeChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowOpacity: 0.12,
  },
  chipText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  activeChipText: {
    color: Colors.background.primary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '70%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  webModalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  optionText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
});