// app/(app)/index.tsx
// The main authenticated screen. Only reachable if the user is logged in.

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // The root _layout.tsx detects session = null and redirects to sign-in automatically
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You're in! 🎉</Text>
      <Text style={styles.subtitle}>This screen is protected.</Text>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
