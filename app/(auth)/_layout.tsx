// app/(auth)/_layout.tsx
// Layout for auth screens - uses a Stack navigator so screens slide in/out.

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}