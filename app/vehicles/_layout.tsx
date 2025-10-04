import { Stack } from 'expo-router';

export default function VehiclesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="list" options={{ headerShown: true, title: 'Véhicules' }} />
      <Stack.Screen name="[id]" options={{ headerShown: true, title: 'Détails' }} />
    </Stack>
  );
}
