// app/ _layout.tsx
// Root layout - checks for an existing Supabase session on launch
// and redirects the user to the correct area of the application.

import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // 1. Check if a session already exists (from AsyncStorage)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for future auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // 3. Cleanup the listener when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return; // Don't redirect while still checking

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Not logged in → go to sign-in
      router.replace('/(auth)/sign-in');
    } else if (session && inAuthGroup) {
      // Logged in but still on auth screen → go to app
      router.replace('/(app)');
    }
  }, [session, loading, segments]);

  // Show a spinner while we check for an existing session
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />
}

