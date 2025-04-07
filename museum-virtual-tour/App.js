// File: App.js - Modified to include custom splash screen

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
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
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8C52FF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 0,
          backgroundColor: '#FFFFFF',
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false,
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
        <StatusBar style="auto" />
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