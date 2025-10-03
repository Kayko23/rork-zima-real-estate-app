import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import {
  CommercialSubKey,
  ACCESSIBILITY_OPTIONS,
  FOOT_TRAFFIC_OPTIONS,
  KITCHEN_TYPE_OPTIONS,
  GAS_TYPE_OPTIONS,
  TRUCK_ACCESS_OPTIONS,
} from '@/constants/commercial';

type CommonFieldsProps = {
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
};

function CommonFields({ values, onChange }: CommonFieldsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Caractéristiques communes</Text>

      <Field label="Surface (m²)">
        <NumberInput
          value={values.floorAreaM2}
          onChange={(v) => onChange('floorAreaM2', v)}
          placeholder="Ex: 120"
        />
      </Field>

      <Field label="Puissance électrique (kVA)">
        <NumberInput
          value={values.powerKva}
          onChange={(v) => onChange('powerKva', v)}
          placeholder="Ex: 36"
        />
      </Field>

      <Field label="Nombre de sanitaires">
        <NumberInput
          value={values.restrooms}
          onChange={(v) => onChange('restrooms', v)}
          placeholder="Ex: 2"
        />
      </Field>

      <Field label="Places de parking">
        <NumberInput
          value={values.parkingSpaces}
          onChange={(v) => onChange('parkingSpaces', v)}
          placeholder="Ex: 5"
        />
      </Field>

      <Field label="Accessibilité">
        <SelectField
          value={values.accessibility}
          options={ACCESSIBILITY_OPTIONS as unknown as string[]}
          onChange={(v) => onChange('accessibility', v)}
          placeholder="Sélectionner"
        />
      </Field>
    </View>
  );
}

type RetailFieldsProps = CommonFieldsProps;

function RetailFields({ values, onChange }: RetailFieldsProps) {
  return (
    <View>
      <CommonFields values={values} onChange={onChange} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spécifique Boutiques</Text>

        <Field label="Largeur façade (m)">
          <NumberInput
            value={values.frontageM}
            onChange={(v) => onChange('frontageM', v)}
            placeholder="Ex: 8"
          />
        </Field>

        <Field label="Longueur vitrine (m)">
          <NumberInput
            value={values.windowLengthM}
            onChange={(v) => onChange('windowLengthM', v)}
            placeholder="Ex: 6"
          />
        </Field>

        <Field label="Flux piéton">
          <SelectField
            value={values.footTraffic}
            options={FOOT_TRAFFIC_OPTIONS as unknown as string[]}
            onChange={(v) => onChange('footTraffic', v)}
            placeholder="Sélectionner"
          />
        </Field>

        <Field label="Surface réserve (m²)">
          <NumberInput
            value={values.storageRoomM2}
            onChange={(v) => onChange('storageRoomM2', v)}
            placeholder="Ex: 20"
          />
        </Field>

        <Field label="Centre commercial / Galerie">
          <TextInput
            value={values.mallName || ''}
            onChangeText={(v) => onChange('mallName', v)}
            placeholder="Ex: Cap Sud"
            style={styles.input}
          />
        </Field>

        <SwitchField
          label="Cabines d'essayage"
          value={values.hasChangingRooms}
          onChange={(v) => onChange('hasChangingRooms', v)}
        />

        <SwitchField
          label="Signalétique autorisée"
          value={values.signageAllowed}
          onChange={(v) => onChange('signageAllowed', v)}
        />
      </View>
    </View>
  );
}

type RestaurantFieldsProps = CommonFieldsProps;

function RestaurantFields({ values, onChange }: RestaurantFieldsProps) {
  return (
    <View>
      <CommonFields values={values} onChange={onChange} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spécifique Restaurants</Text>

        <Field label="Type de cuisine">
          <SelectField
            value={values.kitchenType}
            options={KITCHEN_TYPE_OPTIONS as unknown as string[]}
            onChange={(v) => onChange('kitchenType', v)}
            placeholder="Sélectionner"
          />
        </Field>

        <Field label="Énergie cuisine">
          <SelectField
            value={values.gasType}
            options={GAS_TYPE_OPTIONS as unknown as string[]}
            onChange={(v) => onChange('gasType', v)}
            placeholder="Sélectionner"
          />
        </Field>

        <Field label="Volume chambre froide (m³)">
          <NumberInput
            value={values.coldRoomM3}
            onChange={(v) => onChange('coldRoomM3', v)}
            placeholder="Ex: 15"
          />
        </Field>

        <Field label="Places intérieures">
          <NumberInput
            value={values.indoorSeats}
            onChange={(v) => onChange('indoorSeats', v)}
            placeholder="Ex: 42"
          />
        </Field>

        <Field label="Places terrasse">
          <NumberInput
            value={values.terraceSeats}
            onChange={(v) => onChange('terraceSeats', v)}
            placeholder="Ex: 16"
          />
        </Field>

        <SwitchField
          label="Hotte / Extraction"
          value={values.hasExtraction}
          onChange={(v) => onChange('hasExtraction', v)}
        />

        <SwitchField
          label="Bac à graisses"
          value={values.hasGreaseTrap}
          onChange={(v) => onChange('hasGreaseTrap', v)}
        />

        <SwitchField
          label="Licence alcool"
          value={values.liquorLicense}
          onChange={(v) => onChange('liquorLicense', v)}
        />

        <SwitchField
          label="Autorisation nuisances sonores"
          value={values.noisePermit}
          onChange={(v) => onChange('noisePermit', v)}
        />

        <SwitchField
          label="Zone click & collect / livraison"
          value={values.deliveryArea}
          onChange={(v) => onChange('deliveryArea', v)}
        />
      </View>
    </View>
  );
}

type WarehouseFieldsProps = CommonFieldsProps;

function WarehouseFields({ values, onChange }: WarehouseFieldsProps) {
  return (
    <View>
      <CommonFields values={values} onChange={onChange} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spécifique Entrepôts</Text>

        <Field label="Hauteur sous plafond (m)">
          <NumberInput
            value={values.clearHeightM}
            onChange={(v) => onChange('clearHeightM', v)}
            placeholder="Ex: 8"
          />
        </Field>

        <Field label="Nombre de quais">
          <NumberInput
            value={values.loadingDocks}
            onChange={(v) => onChange('loadingDocks', v)}
            placeholder="Ex: 3"
          />
        </Field>

        <Field label="Portes plain-pied">
          <NumberInput
            value={values.driveInDoors}
            onChange={(v) => onChange('driveInDoors', v)}
            placeholder="Ex: 2"
          />
        </Field>

        <Field label="Charge au sol (kN/m²)">
          <NumberInput
            value={values.floorLoadKnM2}
            onChange={(v) => onChange('floorLoadKnM2', v)}
            placeholder="Ex: 5"
          />
        </Field>

        <Field label="Aire de manœuvre (m²)">
          <NumberInput
            value={values.yardAreaM2}
            onChange={(v) => onChange('yardAreaM2', v)}
            placeholder="Ex: 500"
          />
        </Field>

        <Field label="Surface bureaux intégrés (m²)">
          <NumberInput
            value={values.officeAreaM2}
            onChange={(v) => onChange('officeAreaM2', v)}
            placeholder="Ex: 80"
          />
        </Field>

        <Field label="Accès poids lourds">
          <SelectField
            value={values.truckAccess}
            options={TRUCK_ACCESS_OPTIONS as unknown as string[]}
            onChange={(v) => onChange('truckAccess', v)}
            placeholder="Sélectionner"
          />
        </Field>

        <SwitchField
          label="Système sprinklers"
          value={values.sprinklerSystem}
          onChange={(v) => onChange('sprinklerSystem', v)}
        />

        <SwitchField
          label="Racks inclus"
          value={values.rackingIncluded}
          onChange={(v) => onChange('rackingIncluded', v)}
        />
      </View>
    </View>
  );
}

type Props = {
  subCategory?: CommercialSubKey;
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
};

export default function CommercialFields({ subCategory, values, onChange }: Props) {
  if (!subCategory) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>Sélectionnez un type de commerce ci-dessus</Text>
      </View>
    );
  }

  if (subCategory === 'retail') {
    return <RetailFields values={values} onChange={onChange} />;
  }

  if (subCategory === 'restaurant') {
    return <RestaurantFields values={values} onChange={onChange} />;
  }

  if (subCategory === 'warehouse') {
    return <WarehouseFields values={values} onChange={onChange} />;
  }

  return null;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function NumberInput({
  value,
  onChange,
  placeholder,
}: {
  value?: number;
  onChange: (v: number | undefined) => void;
  placeholder: string;
}) {
  return (
    <TextInput
      value={value != null ? String(value) : ''}
      onChangeText={(t) => {
        const num = t ? Number(t.replace(/[^\d.]/g, '')) : undefined;
        onChange(num);
      }}
      placeholder={placeholder}
      keyboardType="numeric"
      style={styles.input}
      placeholderTextColor="#9ca3af"
    />
  );
}

function SelectField({
  value,
  options,
  onChange,
  placeholder,
}: {
  value?: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <View>
      <Pressable
        onPress={() => setOpen(true)}
        style={styles.selectButton}
        testID="select-field"
      >
        <Text style={value ? styles.selectText : styles.selectPlaceholder}>
          {value || placeholder}
        </Text>
      </Pressable>

      {open && (
        <View style={styles.selectDropdown}>
          <ScrollView style={styles.selectScroll}>
            {options.map((opt) => (
              <Pressable
                key={opt}
                onPress={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                style={[
                  styles.selectOption,
                  value === opt && styles.selectOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.selectOptionText,
                    value === opt && styles.selectOptionTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable
            onPress={() => setOpen(false)}
            style={styles.selectClose}
          >
            <Text style={styles.selectCloseText}>Fermer</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function SwitchField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={styles.switchRow}
      testID={`switch-${label}`}
    >
      <Text style={styles.switchLabel}>{label}</Text>
      <View style={[styles.switchTrack, value && styles.switchTrackActive]}>
        <View
          style={[
            styles.switchThumb,
            value && styles.switchThumbActive,
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#1f2937',
  },
  selectButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  selectText: {
    fontSize: 15,
    color: '#1f2937',
  },
  selectPlaceholder: {
    fontSize: 15,
    color: '#9ca3af',
  },
  selectDropdown: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    zIndex: 1000,
    maxHeight: 240,
  },
  selectScroll: {
    maxHeight: 200,
  },
  selectOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectOptionActive: {
    backgroundColor: '#f0fdf4',
  },
  selectOptionText: {
    fontSize: 15,
    color: '#1f2937',
  },
  selectOptionTextActive: {
    fontWeight: '700',
    color: '#065f46',
  },
  selectClose: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  selectCloseText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065f46',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#d1d5db',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchTrackActive: {
    backgroundColor: '#065f46',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
  },
});
