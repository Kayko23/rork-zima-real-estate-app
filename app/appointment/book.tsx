import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Calendar, Clock, User, MessageSquare } from 'lucide-react-native';
import Colors from '@/constants/colors';

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

const timeSlots: TimeSlot[] = [
  { id: '1', time: '09:00', available: true },
  { id: '2', time: '10:00', available: true },
  { id: '3', time: '11:00', available: false },
  { id: '4', time: '14:00', available: true },
  { id: '5', time: '15:00', available: true },
  { id: '6', time: '16:00', available: true },
];

export default function BookAppointmentScreen() {
  const router = useRouter();
  const { agent, property } = useLocalSearchParams<{
    agent?: string;
    property?: string;
  }>();
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Erreur', 'Veuillez sélectionner une date et une heure');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Rendez-vous demandé',
        `Votre demande de rendez-vous avec ${agent || 'l\'agent'} a été envoyée. Vous recevrez une confirmation prochainement.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch {
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const year = tomorrow.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Prendre rendez-vous',
          headerStyle: {
            backgroundColor: Colors.background.primary,
          },
          headerTitleStyle: {
            color: Colors.text.primary,
          },
        }}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Agent</Text>
          </View>
          <Text style={styles.agentName}>{agent || 'Agent immobilier'}</Text>
          {property && (
            <Text style={styles.propertyInfo}>Bien: #{property}</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Date</Text>
          </View>
          <Pressable
            style={styles.dateInput}
            onPress={() => setCalendarVisible(true)}
          >
            <Text style={selectedDate ? styles.dateText : styles.datePlaceholder}>
              {selectedDate || "JJ-MM-AAAA"}
            </Text>
            <Calendar size={18} color={Colors.text.secondary} />
          </Pressable>
          <Pressable
            style={styles.quickDateButton}
            onPress={() => setSelectedDate(getTomorrowDate())}
          >
            <Text style={styles.quickDateText}>Demain</Text>
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Heure</Text>
          </View>
          <View style={styles.timeSlotsGrid}>
            {timeSlots.map((slot) => (
              <Pressable
                key={slot.id}
                style={[
                  styles.timeSlot,
                  !slot.available && styles.timeSlotDisabled,
                  selectedTime === slot.time && styles.timeSlotSelected,
                ]}
                onPress={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    !slot.available && styles.timeSlotTextDisabled,
                    selectedTime === slot.time && styles.timeSlotTextSelected,
                  ]}
                >
                  {slot.time}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MessageSquare size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Message (optionnel)</Text>
          </View>
          <TextInput
            style={styles.messageInput}
            placeholder="Ajoutez un message pour l'agent..."
            placeholderTextColor={Colors.text.secondary}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.submitButton,
            (!selectedDate || !selectedTime || isSubmitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!selectedDate || !selectedTime || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Envoi en cours...' : 'Demander le rendez-vous'}
          </Text>
        </Pressable>
      </View>

      <Modal visible={calendarVisible} transparent animationType="slide" onRequestClose={() => setCalendarVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner une date</Text>
              <TouchableOpacity onPress={() => setCalendarVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.calendarContainer}>
              <View style={styles.calendarRow}>
                <View style={styles.calendarColumn}>
                  <Text style={styles.calendarLabel}>Jour</Text>
                  <ScrollView style={styles.calendarScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <TouchableOpacity
                        key={day}
                        style={[styles.calendarItem, selectedDay === day && styles.calendarItemActive]}
                        onPress={() => setSelectedDay(day)}
                      >
                        <Text style={[styles.calendarItemText, selectedDay === day && styles.calendarItemTextActive]}>
                          {String(day).padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.calendarColumn}>
                  <Text style={styles.calendarLabel}>Mois</Text>
                  <ScrollView style={styles.calendarScroll} showsVerticalScrollIndicator={false}>
                    {[
                      { num: 1, name: 'Janvier' },
                      { num: 2, name: 'Février' },
                      { num: 3, name: 'Mars' },
                      { num: 4, name: 'Avril' },
                      { num: 5, name: 'Mai' },
                      { num: 6, name: 'Juin' },
                      { num: 7, name: 'Juillet' },
                      { num: 8, name: 'Août' },
                      { num: 9, name: 'Septembre' },
                      { num: 10, name: 'Octobre' },
                      { num: 11, name: 'Novembre' },
                      { num: 12, name: 'Décembre' },
                    ].map(month => (
                      <TouchableOpacity
                        key={month.num}
                        style={[styles.calendarItem, selectedMonth === month.num && styles.calendarItemActive]}
                        onPress={() => setSelectedMonth(month.num)}
                      >
                        <Text style={[styles.calendarItemText, selectedMonth === month.num && styles.calendarItemTextActive]}>
                          {month.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.calendarColumn}>
                  <Text style={styles.calendarLabel}>Année</Text>
                  <ScrollView style={styles.calendarScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <TouchableOpacity
                        key={year}
                        style={[styles.calendarItem, selectedYear === year && styles.calendarItemActive]}
                        onPress={() => setSelectedYear(year)}
                      >
                        <Text style={[styles.calendarItemText, selectedYear === year && styles.calendarItemTextActive]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              <TouchableOpacity
                style={styles.calendarConfirm}
                onPress={() => {
                  const formatted = `${String(selectedDay).padStart(2, '0')}-${String(selectedMonth).padStart(2, '0')}-${selectedYear}`;
                  setSelectedDate(formatted);
                  setCalendarVisible(false);
                }}
              >
                <Text style={styles.calendarConfirmText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  propertyInfo: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  dateInput: {
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    color: Colors.text.primary,
    fontSize: 16,
  },
  datePlaceholder: {
    color: Colors.text.secondary,
    fontSize: 16,
  },
  quickDateButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  quickDateText: {
    color: Colors.background.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    minWidth: 80,
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeSlotDisabled: {
    backgroundColor: Colors.background.secondary,
    borderColor: Colors.border.light,
    opacity: 0.5,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  timeSlotTextSelected: {
    color: Colors.background.primary,
  },
  timeSlotTextDisabled: {
    color: Colors.text.secondary,
  },
  messageInput: {
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.text.secondary,
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.background.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalClose: {
    fontSize: 24,
    color: '#6b7280',
  },
  calendarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  calendarRow: {
    flexDirection: 'row',
    gap: 12,
    height: 300,
  },
  calendarColumn: {
    flex: 1,
  },
  calendarLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  calendarScroll: {
    flex: 1,
  },
  calendarItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  calendarItemActive: {
    backgroundColor: '#f0fdf4',
  },
  calendarItemText: {
    fontSize: 15,
    color: '#1f2937',
  },
  calendarItemTextActive: {
    fontWeight: '700',
    color: '#065f46',
  },
  calendarConfirm: {
    marginTop: 16,
    height: 48,
    backgroundColor: '#065f46',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarConfirmText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});