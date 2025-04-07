// components/auth/AuthForm.js

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SIZES } from '../../constants/theme';

import Input from '../ui/Input';
import Button from '../ui/Button';
import Typography from '../ui/Typography';

const AuthForm = ({
  type = 'login', // login or register
  onSubmit,
  loading = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // For registration
    if (type === 'register') {
      if (!name) {
        newErrors.name = 'Name is required';
      }
      
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const userData = { email, password };
      
      if (type === 'register') {
        userData.name = name;
      }
      
      onSubmit(userData);
    }
  };

  return (
    <View style={styles.container}>
      {type === 'register' && (
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          error={errors.name}
          autoCapitalize="words"
        />
      )}
      
      <Input
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        error={errors.email}
      />
      
      <Input
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
      />
      
      {type === 'register' && (
        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={errors.confirmPassword}
        />
      )}
      
      <Button
        title={type === 'login' ? 'Log In' : 'Sign Up'}
        onPress={handleSubmit}
        loading={loading}
        style={styles.button}
      />
      
      {type === 'login' && (
        <Typography 
          variant="caption" 
          align="center" 
          style={styles.forgotPassword}
          onPress={() => {/* Handle forgot password */}}
        >
          Forgot Password?
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    marginTop: SIZES.md,
  },
  forgotPassword: {
    marginTop: SIZES.lg,
  },
});

export default AuthForm;