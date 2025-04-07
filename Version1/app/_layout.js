// app/_layout.js

import { Stack } from 'expo-router';
import { View, StatusBar } from 'react-native';
import { COLORS } from '../constants/theme';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from 'expo-font';
import { createContext, useState, useContext } from 'react';

// Create the Auth Context
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });
  
  // Auth state
  const [user, setUser] = useState(null);
  
  const authContext = {
    user,
    login: (userData) => setUser(userData),
    logout: () => setUser(null),
  };

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Stack 
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: COLORS.background,
          }
        }}
      />
    </AuthContext.Provider>
  );
}