import { Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '@/hooks/useSettings';
import { t, type Locale } from '@/lib/i18n';
import { useRouter } from 'expo-router';

export default function LanguageScreen() {
  const { locale, setLocale } = useSettings();
  const router = useRouter();
  const L = t(locale ?? 'fr');

  const pick = async (lng: Locale) => {
    await setLocale(lng);
    router.replace('/(onboarding)/country');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{L.chooseLanguage}</Text>
      <Pressable onPress={() => pick('fr')} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>{L.french}</Text>
      </Pressable>
      <Pressable onPress={() => pick('en')} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>{L.english}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  primaryButton: {
    borderRadius: 16,
    padding: 18,
    backgroundColor: '#0e5a43',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 16,
    padding: 18,
    backgroundColor: '#e8f1ee',
  },
  secondaryButtonText: {
    color: '#0e5a43',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
});
