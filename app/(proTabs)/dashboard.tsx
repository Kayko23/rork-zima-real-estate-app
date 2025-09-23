import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, Eye, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react-native';
import NotificationBell from '@/components/ui/NotificationBell';
import { useApp } from '@/hooks/useAppStore';
import Colors from '@/constants/colors';

type DashboardTab = 'today' | 'upcoming';

export default function DashboardScreen() {
  const { hasUnreadNotifications, markNotificationsAsRead } = useApp();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<DashboardTab>('today');

  const stats = [
    { label: 'Tâches en attente', value: 5, color: Colors.warning },
    { label: 'Terminées aujourd\'hui', value: 3, color: Colors.success },
    { label: 'Annonces actives', value: 12, color: Colors.primary },
  ];

  const todayTasks = [
    {
      id: '1',
      type: 'visit',
      title: 'Visite - Villa East Legon',
      time: '14:00',
      client: 'John Doe',
      status: 'pending',
      urgent: true,
    },
    {
      id: '2',
      type: 'request',
      title: 'Demande d&apos;information',
      time: '10:30',
      client: 'Marie Kouassi',
      status: 'pending',
      urgent: false,
    },
    {
      id: '3',
      type: 'visit',
      title: 'Visite - Appartement Cocody',
      time: '16:30',
      client: 'Paul Mensah',
      status: 'completed',
      urgent: false,
    },
  ];

  const handleTaskAction = (taskId: string, action: 'complete' | 'view') => {
    console.log(`Task ${taskId} - ${action}`);
  };

  const handleNotificationPress = () => {
    markNotificationsAsRead();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Tableau de bord</Text>
        <NotificationBell 
          hasUnread={hasUnreadNotifications}
          onPress={handleNotificationPress}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'today' && styles.activeTab]}
          onPress={() => setActiveTab('today')}
        >
          <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>
            Aujourd&apos;hui
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            À venir
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={`stat-${stat.label}-${index}`} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <View style={[styles.statIndicator, { backgroundColor: stat.color }]} />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'today' ? 'Tâches du jour' : 'Tâches à venir'}
          </Text>
          
          {todayTasks.map((task, index) => (
            <View key={`${task.id}-${index}`} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <View style={styles.taskInfo}>
                  <View style={styles.taskTitleRow}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    {task.urgent && (
                      <View style={styles.urgentBadge}>
                        <AlertCircle size={12} color={Colors.warning} />
                        <Text style={styles.urgentText}>Urgent</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.taskMeta}>
                    <View style={styles.taskMetaItem}>
                      <Clock size={14} color={Colors.text.secondary} />
                      <Text style={styles.taskMetaText}>{task.time}</Text>
                    </View>
                    <View style={styles.taskMetaItem}>
                      <MessageCircle size={14} color={Colors.text.secondary} />
                      <Text style={styles.taskMetaText}>{task.client}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: task.status === 'completed' ? Colors.success : Colors.warning }
                ]} />
              </View>
              
              <View style={styles.taskActions}>
                {task.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => handleTaskAction(task.id, 'complete')}
                  >
                    <CheckCircle size={16} color={Colors.success} />
                    <Text style={styles.completeButtonText}>Marquer terminé</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => handleTaskAction(task.id, 'view')}
                >
                  <Eye size={16} color={Colors.primary} />
                  <Text style={styles.viewButtonText}>
                    {task.type === 'visit' ? 'Voir le bien' : 'Voir la demande'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  statIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  urgentText: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '600',
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  taskMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskMetaText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 12,
  },
  taskActions: {
    flexDirection: 'row',
    gap: 12,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  completeButtonText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 90, 69, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  viewButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 100,
  },
});