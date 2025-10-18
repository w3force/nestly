/**
 * Auth Screen
 * Sign in/up forms (placeholder for Phase 8)
 */
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Divider, useTheme } from 'react-native-paper';

interface AuthScreenProps {
  onSignIn?: (email: string, password: string) => void;
  onSignUp?: (email: string, password: string, name: string) => void;
  onGuest?: () => void;
}

export default function AuthScreen({ onSignIn, onSignUp, onGuest }: AuthScreenProps) {
  const theme = useTheme();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    // Placeholder - would integrate with auth service
    setTimeout(() => {
      if (mode === 'signin' && onSignIn) {
        onSignIn(email, password);
      } else if (mode === 'signup' && onSignUp) {
        onSignUp(email, password, name);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {mode === 'signin'
              ? 'Sign in to access your retirement plans'
              : 'Start planning your retirement today'}
          </Text>
        </View>

        {/* Auth Form */}
        <Card style={styles.card}>
          <Card.Content>
            {mode === 'signup' && (
              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                autoCapitalize="words"
                disabled={loading}
              />
            )}

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              disabled={loading}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              disabled={loading}
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              labelStyle={styles.submitButtonLabel}
              loading={loading}
              disabled={loading || !email || !password || (mode === 'signup' && !name)}
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>

            <Divider style={styles.divider} />

            <Button
              mode="text"
              onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              style={styles.switchButton}
              disabled={loading}
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </Button>
          </Card.Content>
        </Card>

        {/* Social Auth Placeholder */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleSmall" style={styles.socialTitle}>
              Or continue with
            </Text>

            <Button
              mode="outlined"
              icon="google"
              style={styles.socialButton}
              disabled
            >
              Google (Coming Soon)
            </Button>

            <Button
              mode="outlined"
              icon="apple"
              style={styles.socialButton}
              disabled
            >
              Apple (Coming Soon)
            </Button>
          </Card.Content>
        </Card>

        {/* Guest Access */}
        {onGuest && (
          <View style={styles.guestSection}>
            <Divider style={styles.divider} />
            <Text variant="bodyMedium" style={styles.guestText}>
              Want to explore first?
            </Text>
            <Button
              mode="text"
              onPress={onGuest}
              style={styles.guestButton}
              labelStyle={styles.guestButtonLabel}
              icon="account-question"
            >
              Continue as Guest
            </Button>
            <Text variant="bodySmall" style={styles.guestNote}>
              Your data won't be saved without an account
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 4,
  },
  divider: {
    marginVertical: 20,
  },
  switchButton: {
    marginTop: 8,
  },
  socialTitle: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  socialButton: {
    marginBottom: 12,
  },
  guestSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  guestText: {
    marginTop: 16,
    marginBottom: 12,
    opacity: 0.8,
  },
  guestButton: {
    marginBottom: 8,
  },
  guestButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  guestNote: {
    opacity: 0.6,
    textAlign: 'center',
  },
});
