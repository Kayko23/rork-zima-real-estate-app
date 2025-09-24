import React from 'react';
import { Stack } from 'expo-router';

export default function ProfessionnelsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="profile/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
