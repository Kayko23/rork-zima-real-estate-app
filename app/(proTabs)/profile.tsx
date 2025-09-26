import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, User, Bell, HelpCircle, Shield, LogOut, Edit, Star, TrendingUp } from 'lucide-react-native';
import { useApp } from '@/hooks/useAppStore';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

export default function ProfileScreen() {
  const { userMode, toggleAppMode, user } = useApp();
  const insets = useSafeAreaInsets();

  const handleToggleMode = () => {
    toggleAppMode();
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleSettings = () => {
    router.push('/profile/settings');
  };

  const handleNotifications = () => {
    router.push('/notifications');
  };

  const handleSupport = () => {
    router.push('/support');
  };

  const handleLegal = () => {
    router.push('/legal');
  };

  const stats = [
    { label: 'Annonces actives', value: '12', icon: TrendingUp },
    { label: 'Note moyenne', value: '4.8', icon: Star },
    { label: 'Clients satisfaits', value: '89', icon: User },
  ];

  const menuItems = [
    { label: 'Modifier le profil', icon: Edit, onPress: handleEditProfile },
    { label: 'Paramètres', icon: Settings, onPress: handleSettings },
    { label: 'Notifications', icon: Bell, onPress: handleNotifications },
    { label: 'Aide & Support', icon: HelpCircle, onPress: handleSupport },
    { label: 'Mentions légales', icon: Shield, onPress: handleLegal },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil Prestataire</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userRole}>Prestataire immobilier</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <View key={stat.label} style={styles.statCard}>
                <IconComponent size={20} color={Colors.primary} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity key={item.label} style={styles.menuItem} onPress={item.onPress}>
                <View style={styles.menuItemLeft}>
                  <IconComponent size={20} color={Colors.text.secondary} />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Mode Switch */}
        <View style={styles.modeSection}>
          <Text style={styles.modeLabel}>Mode actuel: {userMode === 'provider' ? 'Prestataire' : 'Utilisateur'}</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={handleToggleMode}>
            <LogOut size={16} color={Colors.background.primary} />
            <Text style={styles.toggleButtonText}>
              Revenir au mode utilisateur
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
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
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  userRole: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  menuSection: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.secondary,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  modeSection: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modeLabel: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  toggleButtonText: {
    color: Colors.background.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 100,
  },
});