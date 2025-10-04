import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="language" />
      <Stack.Screen name="country" />
      <Stack.Screen name="currency" />
    </Stack>
  );
}