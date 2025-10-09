import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { Home, Bed, Car } from 'lucide-react-native';
import { SECTOR_OPTIONS } from '@/constants/professionals';
import { Sector } from '@/types/pro';

const ICONS = {
  property: Home,
  travel: Bed,
  vehicles: Car,
};

export function Step0Sector() {
  const { control } = useFormContext<{ sectors: Sector[] }>();

  return (
    <View>
      <Text style={s.description}>
        Sélectionnez un ou plusieurs secteurs dans lesquels vous exercez votre activité professionnelle.
      </Text>

      <Controller
        control={control}
        name="sectors"
        defaultValue={[]}
        render={({ field: { value = [], onChange }, fieldState }) => (
          <View>
            <View style={s.sectorGrid}>
              {SECTOR_OPTIONS.map(sector => {
                const Icon = ICONS[sector.key];
                const isSelected = value.includes(sector.key);
                
                return (
                  <Pressable
                    key={sector.key}
                    style={[s.sectorCard, isSelected && s.sectorCardActive]}
                    onPress={() => {
                      const newValue = isSelected
                        ? value.filter(s => s !== sector.key)
                        : [...value, sector.key];
                      onChange(newValue);
                    }}
                  >
                    <View style={[s.iconCircle, isSelected && s.iconCircleActive]}>
                      <Icon size={28} color={isSelected ? '#059669' : '#6b7280'} />
                    </View>
                    <Text style={[s.sectorLabel, isSelected && s.sectorLabelActive]}>
                      {sector.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {fieldState.error && <Text style={s.error}>{fieldState.error.message}</Text>}
          </View>
        )}
      />

      <View style={s.infoBox}>
        <Text style={s.infoText}>
          💡 Vous pourrez publier des annonces dans tous les secteurs sélectionnés après validation de votre profil.
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  description: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 22,
    marginBottom: 24,
  },
  sectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sectorCard: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  sectorCardActive: {
    borderColor: '#059669',
    backgroundColor: '#ecfdf5',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconCircleActive: {
    backgroundColor: '#d1fae5',
  },
  sectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  sectorLabelActive: {
    color: '#059669',
  },
  infoBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  error: {
    marginTop: 12,
    fontSize: 13,
    color: '#ef4444',
  },
});
