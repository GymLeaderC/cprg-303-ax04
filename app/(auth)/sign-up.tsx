// app/(auth)/sign-up.tsx
// Sign-Up screen - validates user input with Zod, then calls Supabase Auth

import { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  StyleSheet, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

// --- ZOD SCHEMA  ---
// Defines the shape and rules for valid sign-up data
const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'], 
});

// TypeScript type inferred from the schema
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const {
    control,                              // Connects React Hook Form to inputs
    handleSubmit,                         // Wraps the submit function with validation
    formState: { errors },                // Contains any validation errors
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),  // Tells RHF to use Zod for validation
    defaultValues: { email: '', password: '', confirmPassword: ''},
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    setAuthError(null);

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    setLoading(false);

    if (error) {
      // Map Supabase error messages to user-friendly text
      if (error.message.includes('already registered')) {
        setAuthError('An account with this email already exists.');
      } else if (error.message.includes('weak')) {
        setAuthError('Password is too weak. Please choose a stronger one.');
      } else {
        setAuthError(error.message);
      }
      return;
    }

    // Supabase may require email confirmation - handle both cases
    Alert.alert(
      'Account Created!',
      'Check your email for a confirmation link, then sign in.',
      [{ text: 'OK', onPress: () => router.replace('/(auth)/sign-in') }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Create Account</Text>

      {/* EMAIL FIELD */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      {/* PASSWORD FIELD */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      {/* CONFIRM PASSWORD FIELD */}
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="Confirm Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
      )}

      {/* SUPABASE-LEVEL ERROR (e.g. email already exists) */}
      {authError && <Text style={styles.errorText}>{authError}</Text>}

      {/* SUBMIT BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* NAVIGATE TO SIGN IN */}
      <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cccccc50',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    color: '#4f46e5',
    fontSize: 14,
  },
});
