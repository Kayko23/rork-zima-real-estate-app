import { Stack } from 'expo-router';
import HeaderCountryButton from '@/components/HeaderCountryButton';

export default function VehiclesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: 'Véhicules',
          headerRight: () => <HeaderCountryButton />,
        }}
      />
      <Stack.Screen
        name="list"
        options={{
          headerShown: true,
          title: 'Véhicules',
          headerRight: () => <HeaderCountryButton />,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: 'Détails',
          headerRight: () => <HeaderCountryButton />,
        }}
      />
    </Stack>
  );
}
