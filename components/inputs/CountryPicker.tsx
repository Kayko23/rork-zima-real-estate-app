import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, FlatList, TextInput } from 'react-native';
import { X, ChevronDown, Search } from 'lucide-react-native';

const WORLD_COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'ZA', name: 'Afrique du Sud' },
  { code: 'AL', name: 'Albanie' },
  { code: 'DZ', name: 'Algérie' },
  { code: 'DE', name: 'Allemagne' },
  { code: 'AD', name: 'Andorre' },
  { code: 'AO', name: 'Angola' },
  { code: 'AG', name: 'Antigua-et-Barbuda' },
  { code: 'SA', name: 'Arabie saoudite' },
  { code: 'AR', name: 'Argentine' },
  { code: 'AM', name: 'Arménie' },
  { code: 'AU', name: 'Australie' },
  { code: 'AT', name: 'Autriche' },
  { code: 'AZ', name: 'Azerbaïdjan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahreïn' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbade' },
  { code: 'BE', name: 'Belgique' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Bénin' },
  { code: 'BT', name: 'Bhoutan' },
  { code: 'BY', name: 'Biélorussie' },
  { code: 'BO', name: 'Bolivie' },
  { code: 'BA', name: 'Bosnie-Herzégovine' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BR', name: 'Brésil' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgarie' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodge' },
  { code: 'CM', name: 'Cameroun' },
  { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cap-Vert' },
  { code: 'CF', name: 'République centrafricaine' },
  { code: 'CL', name: 'Chili' },
  { code: 'CN', name: 'Chine' },
  { code: 'CY', name: 'Chypre' },
  { code: 'CO', name: 'Colombie' },
  { code: 'KM', name: 'Comores' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Congo (RDC)' },
  { code: 'KR', name: 'Corée du Sud' },
  { code: 'KP', name: 'Corée du Nord' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'HR', name: 'Croatie' },
  { code: 'CU', name: 'Cuba' },
  { code: 'DK', name: 'Danemark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominique' },
  { code: 'EG', name: 'Égypte' },
  { code: 'AE', name: 'Émirats arabes unis' },
  { code: 'EC', name: 'Équateur' },
  { code: 'ER', name: 'Érythrée' },
  { code: 'ES', name: 'Espagne' },
  { code: 'EE', name: 'Estonie' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'US', name: 'États-Unis' },
  { code: 'ET', name: 'Éthiopie' },
  { code: 'FJ', name: 'Fidji' },
  { code: 'FI', name: 'Finlande' },
  { code: 'FR', name: 'France' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambie' },
  { code: 'GE', name: 'Géorgie' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Grèce' },
  { code: 'GD', name: 'Grenade' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GN', name: 'Guinée' },
  { code: 'GW', name: 'Guinée-Bissau' },
  { code: 'GQ', name: 'Guinée équatoriale' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haïti' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HU', name: 'Hongrie' },
  { code: 'IN', name: 'Inde' },
  { code: 'ID', name: 'Indonésie' },
  { code: 'IQ', name: 'Irak' },
  { code: 'IR', name: 'Iran' },
  { code: 'IE', name: 'Irlande' },
  { code: 'IS', name: 'Islande' },
  { code: 'IL', name: 'Israël' },
  { code: 'IT', name: 'Italie' },
  { code: 'JM', name: 'Jamaïque' },
  { code: 'JP', name: 'Japon' },
  { code: 'JO', name: 'Jordanie' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KG', name: 'Kirghizistan' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KW', name: 'Koweït' },
  { code: 'LA', name: 'Laos' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LV', name: 'Lettonie' },
  { code: 'LB', name: 'Liban' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libye' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lituanie' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MK', name: 'Macédoine du Nord' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MY', name: 'Malaisie' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malte' },
  { code: 'MA', name: 'Maroc' },
  { code: 'MH', name: 'Îles Marshall' },
  { code: 'MU', name: 'Maurice' },
  { code: 'MR', name: 'Mauritanie' },
  { code: 'MX', name: 'Mexique' },
  { code: 'FM', name: 'Micronésie' },
  { code: 'MD', name: 'Moldavie' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolie' },
  { code: 'ME', name: 'Monténégro' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibie' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Népal' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NO', name: 'Norvège' },
  { code: 'NZ', name: 'Nouvelle-Zélande' },
  { code: 'OM', name: 'Oman' },
  { code: 'UG', name: 'Ouganda' },
  { code: 'UZ', name: 'Ouzbékistan' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palaos' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papouasie-Nouvelle-Guinée' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'NL', name: 'Pays-Bas' },
  { code: 'PE', name: 'Pérou' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Pologne' },
  { code: 'PT', name: 'Portugal' },
  { code: 'QA', name: 'Qatar' },
  { code: 'DO', name: 'République dominicaine' },
  { code: 'CZ', name: 'République tchèque' },
  { code: 'RO', name: 'Roumanie' },
  { code: 'GB', name: 'Royaume-Uni' },
  { code: 'RU', name: 'Russie' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'KN', name: 'Saint-Christophe-et-Niévès' },
  { code: 'LC', name: 'Sainte-Lucie' },
  { code: 'SM', name: 'Saint-Marin' },
  { code: 'VC', name: 'Saint-Vincent-et-les-Grenadines' },
  { code: 'SB', name: 'Îles Salomon' },
  { code: 'SV', name: 'Salvador' },
  { code: 'WS', name: 'Samoa' },
  { code: 'ST', name: 'Sao Tomé-et-Principe' },
  { code: 'SN', name: 'Sénégal' },
  { code: 'RS', name: 'Serbie' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapour' },
  { code: 'SK', name: 'Slovaquie' },
  { code: 'SI', name: 'Slovénie' },
  { code: 'SO', name: 'Somalie' },
  { code: 'SD', name: 'Soudan' },
  { code: 'SS', name: 'Soudan du Sud' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SE', name: 'Suède' },
  { code: 'CH', name: 'Suisse' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SY', name: 'Syrie' },
  { code: 'TJ', name: 'Tadjikistan' },
  { code: 'TZ', name: 'Tanzanie' },
  { code: 'TD', name: 'Tchad' },
  { code: 'TH', name: 'Thaïlande' },
  { code: 'TL', name: 'Timor oriental' },
  { code: 'TG', name: 'Togo' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinité-et-Tobago' },
  { code: 'TN', name: 'Tunisie' },
  { code: 'TM', name: 'Turkménistan' },
  { code: 'TR', name: 'Turquie' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VA', name: 'Vatican' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Viêt Nam' },
  { code: 'YE', name: 'Yémen' },
  { code: 'ZM', name: 'Zambie' },
  { code: 'ZW', name: 'Zimbabwe' },
];

interface CountryPickerProps {
  value?: string;
  onChange: (country: string) => void;
  placeholder?: string;
}

export default function CountryPicker({ value, onChange, placeholder = 'Sélectionner un pays' }: CountryPickerProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCountries = WORLD_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (countryName: string) => {
    onChange(countryName);
    setVisible(false);
    setSearch('');
  };

  return (
    <>
      <Pressable
        style={styles.trigger}
        onPress={() => setVisible(true)}
        testID="country-picker-trigger"
      >
        <Text style={[styles.triggerText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Sélectionner un pays</Text>
              <Pressable onPress={() => setVisible(false)} style={styles.closeButton}>
                <X size={24} color="#111827" />
              </Pressable>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color="#6B7280" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Rechercher un pays..."
                autoFocus
                testID="country-search-input"
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.countryItem,
                    value === item.name && styles.countryItemSelected,
                  ]}
                  onPress={() => handleSelect(item.name)}
                  testID={`country-item-${item.code}`}
                >
                  <Text
                    style={[
                      styles.countryName,
                      value === item.name && styles.countryNameSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.listContent}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7EDF3',
    paddingHorizontal: 12,
    height: 48,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  countryItem: {
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  countryItemSelected: {
    backgroundColor: '#E8F8EE',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  countryName: {
    fontSize: 16,
    color: '#374151',
  },
  countryNameSelected: {
    color: '#0B3C2F',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});
