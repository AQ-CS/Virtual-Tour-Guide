// File: src/components/AppHeader.js - Updated header component with gradient compatibility

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AppHeader = ({ title, onBackPress, rightIcon, onRightPress }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholderView} />
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
          <Ionicons name={rightIcon} size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholderView} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 15,
    backgroundColor: 'transparent', // Changed to transparent to show gradient behind
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)', // Subtle white border
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
  },
  rightButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
  },
  placeholderView: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff', // Changed to white for better visibility on gradient
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default AppHeader;