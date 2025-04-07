// app/auth/login.js

import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { COLORS, SIZES } from '../../constants/theme';

import AuthForm from '../../components/auth/AuthForm';
import Typography from '../../components/ui/Typography';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (userData) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Navigate to main app after successful login
      router.replace('/tours');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={require('../../assets/images/museum-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Typography variant="h1">Welcome Back</Typography>
          <Typography variant="body" color="light" style={styles.subtitle}>
            Sign in to continue your museum journey
          </Typography>
        </View>
        
        <View style={styles.formContainer}>
          <AuthForm 
            type="login"
            onSubmit={handleLogin}
            loading={loading}
          />
          
          <View style={styles.footer}>
            <Typography variant="body" style={styles.footerText}>
              Don't have an account?
            </Typography>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Typography variant="body" color="primary" style={styles.link}>
                  Register
                </Typography>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: SIZES.md,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: SIZES.xs,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.xl,
  },
  footerText: {
    marginRight: SIZES.xs,
  },
  link: {
    fontWeight: '500',
  },
});