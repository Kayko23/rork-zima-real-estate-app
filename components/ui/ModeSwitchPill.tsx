import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Platform,
  Alert,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeftRight } from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';
import Colors from '@/constants/colors';

export default function ModeSwitchPill() {
  const { userMode, toggleAppMode } = useApp();
  const insets = useSafeAreaInsets();

  const label = userMode === 'user' 
    ? 'Passer en mode prestataire' 
    : 'Passer en mode voyageur';

  const handlePress = async () => {
    const isDirty = false;
    if (isDirty) {
      Alert.alert(
        'Modifications non enregistrées',
        'Vous avez des modifications non enregistrées. Changer de mode maintenant ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Changer de mode', style: 'destructive', onPress: () => void toggleAppMode() }
        ]
      );
      return;
    }
    await toggleAppMode();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { bottom: Math.max(insets.bottom, 12) + 64 + 120 }
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Basculer entre les modes utilisateur et prestataire"
    >
      <View style={styles.wrapper}>
        <View style={styles.webGlass}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <ArrowLeftRight size={18} color={Colors.text.primary} />
            </View>
            <Text style={styles.label}>{label}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '50%',
    marginLeft: -100,
    zIndex: 1000,
  },
  wrapper: {
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  glass: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  webGlass: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    backdropFilter: 'blur(30px)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },
});