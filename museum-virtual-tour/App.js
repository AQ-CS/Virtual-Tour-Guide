// File: App.js - With updated context provider

import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import AppContextProvider
import { AppContext, AppContextProvider } from './src/AppContext';

// Import custom splash screen
import SplashScreen from './src/components/SplashScreen';

// Import screens
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import ExhibitsScreen from './src/screens/ExhibitsScreen';
import TourScreen from './src/screens/TourScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NavigationScreen from './src/screens/NavigationScreen';
import CrowdScreen from './src/screens/CrowdScreen';
import SmartAgentScreen from './src/screens/SmartAgentScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

// Custom tab bar icon component with gradient background
function TabBarIcon({ focused, name, color }) {
  return (
    <View style={styles.iconContainer}>
      {focused ? (
        <LinearGradient
          colors={['#8C52FF', '#A67FFB']}
          style={styles.iconBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={name} size={22} color="#fff" />
        </LinearGradient>
      ) : (
        <View style={styles.inactiveIconContainer}>
          <Ionicons name={name} size={22} color="#888" />
        </View>
      )}
    </View>
  );
}

// HomeStack to include SmartAgent Screen
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="SmartAgent" component={SmartAgentScreen} />
    </HomeStack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Exhibits') {
            iconName = focused ? 'image' : 'image-outline';
          } else if (route.name === 'Tours') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Navigate') {
            iconName = focused ? 'navigate' : 'navigate-outline';
          } else if (route.name === 'Crowd') {
            iconName = focused ? 'people' : 'people-outline';
          }
          
          return <TabBarIcon focused={focused} name={iconName} color={color} />;
        },
        tabBarActiveTintColor: '#8C52FF',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 0,
          backgroundColor: '#FFFFFF',
          height: 80,
          paddingTop: 10,
          paddingBottom: 15,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            android: {
              elevation: 15,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 6,
          marginBottom: 5,
        },
        tabBarItemStyle: {
          paddingTop: 5,
          paddingBottom: 5,
        },
        headerShown: false,
        tabBarShowLabel: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Exhibits" component={ExhibitsScreen} />
      <Tab.Screen name="Tours" component={TourScreen} />
      <Tab.Screen name="Navigate" component={NavigationScreen} />
      <Tab.Screen name="Crowd" component={CrowdScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isLoggedIn, isLoading } = useContext(AppContext);
  
  // Show splash screen while loading data
  if (isLoading) {
    return <SplashScreen />;
  }
  
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContextProvider>
        <AppNavigator />
      </AppContextProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    marginBottom: 4,
  },
  iconBackground: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8C52FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  inactiveIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
});