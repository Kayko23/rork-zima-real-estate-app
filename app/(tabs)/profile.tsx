import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Heart, 
  Globe, 
  User, 
  FileText, 
  ChevronRight,
  UserPlus,
  MessageCircle,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react-native';
import { router } from 'expo-router';
import NotificationBell from '@/components/ui/NotificationBell';
import LiquidGlassView from '@/components/ui/LiquidGlassView';
import ModeSwitchPill from '@/components/ui/ModeSwitchPill';
import { useApp } from '@/hooks/useAppStore';
import { useSession } from '@/hooks/useSession';
import Colors from '@/constants/colors';

export default function ProfileScreen() {
  const { user, userMode, hasUnreadNotifications, switchMode } = useApp();
  const { clearSession } = useSession();
  const insets = useSafeAreaInsets();



  const handleBecomeProvider = () => {
    console.log('Become provider pressed');
    router.push('/profile/switch-mode');
  };

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  type SettingItem = {
    id: string;
    title: string;
    subtitle?: string;
    icon: any;
    onPress: () => void;
  };

  const settingsItems: SettingItem[] = [
    {
      id: 'edit',
      title: 'Éditer le profil',
      icon: User,
      onPress: () => router.push('/profile/edit'),
    },
    {
      id: 'favorites',
      title: 'Mes favoris',
      icon: Heart,
      onPress: () => router.push('/profile/favorites-bridge'),
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: MessageCircle,
      onPress: () => router.push('/profile/messages-bridge'),
    },
    {
      id: 'payments',
      title: 'Paiements',
      icon: CreditCard,
      onPress: () => router.push('/profile/payments'),
    },
    {
      id: 'settings',
      title: 'Paramètres',
      icon: Settings,
      onPress: () => router.push('/profile/settings'),
    },
    {
      id: 'language',
      title: 'Langue',
      subtitle: user.preferences.language === 'fr' ? 'Français' : 'English',
      icon: Globe,
      onPress: () => router.push('/profile/language-currency'),
    },
    {
      id: 'mode',
      title: userMode === 'user' ? 'Passer en mode prestataire' : 'Revenir au mode utilisateur',
      icon: UserPlus,
      onPress: () => {
        if (userMode === 'user') {
          router.push('/profile/switch-mode');
        } else {
          switchMode('user');
          router.replace('/(tabs)/home');
        }
      },
    },
    {
      id: 'support',
      title: 'Aide & support',
      icon: HelpCircle,
      onPress: () => router.push('/profile/help'),
    },
    {
      id: 'legal',
      title: 'Légal & Confidentialité',
      icon: FileText,
      onPress: () => router.push('/legal'),
    },
    {
      id: 'logout',
      title: 'Déconnexion',
      icon: LogOut,
      onPress: async () => {
        console.log('Logout pressed');
        await clearSession();
        router.replace('/(auth)/login');
      },
    },
  ];

  // Add provider-specific items if in provider mode
  const providerItems: SettingItem[] = userMode === 'provider' ? [
    {
      id: 'listings',
      title: 'Mes annonces',
      icon: FileText,
      onPress: () => router.push('/(proTabs)/listings'),
    },
    {
      id: 'dashboard',
      title: 'Tableau de bord',
      icon: Settings,
      onPress: () => router.push('/(proTabs)/dashboard'),
    },
  ] : [];

  const allItems = [...settingsItems.slice(0, 7), ...providerItems, ...settingsItems.slice(7)];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
        <NotificationBell 
          hasUnread={hasUnreadNotifications}
          onPress={handleNotificationPress}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {userMode === 'user' ? 'Utilisateur' : 'Prestataire'}
            </Text>
          </View>
        </View>

        {userMode === 'user' && !user.isProvider && (
          <TouchableOpacity style={styles.becomeProviderCard} onPress={handleBecomeProvider}>
            <LiquidGlassView style={styles.becomeProviderGlass}>
              <View style={styles.becomeProviderContent}>
                <View style={styles.becomeProviderText}>
                  <Text style={styles.becomeProviderTitle}>Devenir prestataire</Text>
                  <Text style={styles.becomeProviderSubtitle}>
                    Rejoignez notre réseau de professionnels et développez votre activité
                  </Text>
                </View>
                <View style={styles.becomeProviderIcon}>
                  <UserPlus size={32} color={Colors.primary} />
                </View>
              </View>
            </LiquidGlassView>
          </TouchableOpacity>
        )}

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          
          {allItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingItem}
              onPress={item.onPress}
            >
              <View style={styles.settingIcon}>
                <item.icon size={20} color={Colors.primary} />
              </View>
              
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                )}
              </View>
              
              <ChevronRight size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      
      {/* Mode Switch Pill - Only shown on Profile screen */}
      <ModeSwitchPill />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: Colors.background.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  becomeProviderCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    height: 120,
  },
  becomeProviderGlass: {
    flex: 1,
  },
  becomeProviderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  becomeProviderText: {
    flex: 1,
  },
  becomeProviderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  becomeProviderSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  becomeProviderIcon: {
    marginLeft: 16,
  },
  settingsSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(14, 90, 69, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border.light,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: Colors.primary,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  switchThumbActive: {
    transform: [{ translateX: 20 }],
  },
  bottomSpacer: {
    height: 100,
  },
});