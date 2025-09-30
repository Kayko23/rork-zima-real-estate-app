import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';

export default function DateField({
  value,
  onChange,
}: {
  value: Date;
  onChange: (d: Date) => void;
}) {
  const [open, setOpen] = useState(false);

  function format(d: Date) {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  }

  function setTomorrow() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(12, 0, 0, 0);
    onChange(d);
  }

  return (
    <View>
      <Text style={s.label}>Date</Text>
      <View style={s.row}>
        <Pressable
          onPress={() => setOpen(true)}
          style={s.input}
          accessibilityRole="button"
        >
          <Text style={s.inputText}>{format(value)}</Text>
          <Calendar size={20} color="#0A1F17" />
        </Pressable>
        <Pressable onPress={setTomorrow} style={s.tomorrow}>
          <Text style={s.tomTxt}>Demain</Text>
        </Pressable>
      </View>

      {open && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.select({ ios: 'inline', android: 'calendar' })}
          onChange={(_, d) => {
            if (d) onChange(d);
            setOpen(false);
          }}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#0A1F17',
    marginBottom: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCE4E0',
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: { fontSize: 16, color: '#0A1F17', fontWeight: '600' as const },
  tomorrow: {
    marginLeft: 12,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E5A44',
  },
  tomTxt: { color: '#fff', fontWeight: '700' as const },
});
