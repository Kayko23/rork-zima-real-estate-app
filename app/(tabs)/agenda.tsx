import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, Phone, CheckCircle, RotateCcw, Plus } from 'lucide-react-native';
import NotificationBell from '@/components/ui/NotificationBell';
import { useApp } from '@/hooks/useAppStore';
import Colors from '@/constants/colors';

export default function AgendaScreen() {
  const { hasUnreadNotifications, markNotificationsAsRead } = useApp();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const appointments = [
    {
      id: '1',
      title: 'Visite Villa East Legon',
      time: '14:00 - 15:00',
      client: 'John Doe',
      phone: '+233244123456',
      location: 'East Legon, Accra',
      status: 'confirmed',
      type: 'visit',
    },
    {
      id: '2',
      title: 'Rendez-vous client',
      time: '16:30 - 17:30',
      client: 'Marie Kouassi',
      phone: '+225070123456',
      location: 'Bureau Cocody',
      status: 'pending',
      type: 'meeting',
    },
  ];

  const handleAppointmentAction = (appointmentId: string, action: 'confirm' | 'reschedule') => {
    console.log(`Appointment ${appointmentId} - ${action}`);
  };

  const handleCreateAppointment = () => {
    console.log('Create new appointment');
  };

  const handleNotificationPress = () => {
    markNotificationsAsRead();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Agenda</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleCreateAppointment}
          >
            <Plus size={20} color={Colors.background.primary} />
          </TouchableOpacity>
          <NotificationBell 
            hasUnread={hasUnreadNotifications}
            onPress={handleNotificationPress}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.calendarSection}>
          <View style={styles.monthHeader}>
            <Text style={styles.monthTitle}>Janvier 2024</Text>
          </View>
          
          <View style={styles.calendarGrid}>
            {/* Simplified calendar - in real app, use a proper calendar component */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.calendarDay,
                  day === selectedDate.getDate() && styles.selectedDay
                ]}
                onPress={() => setSelectedDate(new Date(2024, 0, day))}
              >
                <Text style={[
                  styles.calendarDayText,
                  day === selectedDate.getDate() && styles.selectedDayText
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.appointmentsSection}>
          <Text style={styles.sectionTitle}>
            {formatDate(selectedDate)}
          </Text>
          
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                    <View style={styles.appointmentMeta}>
                      <View style={styles.metaItem}>
                        <Clock size={14} color={Colors.text.secondary} />
                        <Text style={styles.metaText}>{appointment.time}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Phone size={14} color={Colors.text.secondary} />
                        <Text style={styles.metaText}>{appointment.client}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <MapPin size={14} color={Colors.text.secondary} />
                        <Text style={styles.metaText}>{appointment.location}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: appointment.status === 'confirmed' ? Colors.success : Colors.warning }
                  ]}>
                    <Text style={styles.statusText}>
                      {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.appointmentActions}>
                  {appointment.status === 'pending' && (
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={() => handleAppointmentAction(appointment.id, 'confirm')}
                    >
                      <CheckCircle size={16} color={Colors.success} />
                      <Text style={styles.confirmButtonText}>Confirmer</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={styles.rescheduleButton}
                    onPress={() => handleAppointmentAction(appointment.id, 'reschedule')}
                  >
                    <RotateCcw size={16} color={Colors.primary} />
                    <Text style={styles.rescheduleButtonText}>Reprogrammer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={48} color={Colors.text.secondary} />
              <Text style={styles.emptyTitle}>Aucun rendez-vous</Text>
              <Text style={styles.emptyText}>
                Vous n&apos;avez pas de rendez-vous prévu pour cette date
              </Text>
            </View>
          )}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarSection: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  monthHeader: {
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  calendarDay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: Colors.primary,
  },
  calendarDayText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  selectedDayText: {
    color: Colors.background.primary,
    fontWeight: '600',
  },
  appointmentsSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  appointmentMeta: {
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    height: 'fit-content' as any,
  },
  statusText: {
    color: Colors.background.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  confirmButtonText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
  },
  rescheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 90, 69, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  rescheduleButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 100,
  },
});