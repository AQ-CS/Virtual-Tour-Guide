// app/_layout.js

import { Stack } from 'expo-router';
import { View, StatusBar } from 'react-native';
import { COLORS } from '../constants/theme';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from 'expo-font';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;
  }

  return (
    <>
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
    </>
  );
}