// File: src/screens/SmartAgentScreen.js - Screen that uses your existing SmartAgentChat component

import React from 'react';
import { 
  View, 
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../components/AppHeader';
import SmartAgentChat from '../components/SmartAgentChat';

const SmartAgentScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Purple-white gradient background */}
      <LinearGradient
        colors={['#8C52FF', '#A67FFB', '#F0EBFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />
      
      <StatusBar barStyle="light-content" />
      
      <AppHeader 
        title="Smart Agent" 
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.chatContainer}>
        <SmartAgentChat />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  }
});

export default SmartAgentScreen;