// File: App.js - With fixed navbar icon spacing

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { AppContext } from './src/AppContext';

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

// Import initial data
import usersData from './src/data/users.json';
import exhibitsData from './src/data/exhibits.json';
import toursData from './src/data/tours.json';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
          height: 80, // Increased height to accommodate icons and labels
          paddingTop: 10,
          paddingBottom: 15,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          // Removed position: 'absolute' so tab bar doesn't overlay content
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
          marginTop: 6, // Add more space above the label
          marginBottom: 5,
        },
        tabBarItemStyle: {
          paddingTop: 5, // Add padding to the entire tab item
          paddingBottom: 5,
        },
        headerShown: false,
        tabBarShowLabel: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Exhibits" component={ExhibitsScreen} />
      <Tab.Screen name="Tours" component={TourScreen} />
      <Tab.Screen name="Navigate" component={NavigationScreen} />
      <Tab.Screen name="Crowd" component={CrowdScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(usersData);
  const [exhibits, setExhibits] = useState(exhibitsData);
  const [tours, setTours] = useState(toursData);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate app initialization with our splash screen
  useEffect(() => {
    // This simulates loading data or performing initial setup
    // In a real app, you might load data from AsyncStorage here
    setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Give a little delay to ensure splash animations can complete
  }, []);
  
  // App context values to be shared across the app
  const contextValue = {
    isLoggedIn,
    setIsLoggedIn,
    currentUser,
    setCurrentUser,
    users,
    setUsers,
    exhibits,
    setExhibits,
    tours,
    setTours,
  };

  // Show splash screen while loading
  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <AppContext.Provider value={contextValue}>
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
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    marginBottom: 4, // Add bottom margin to the container for better spacing
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