import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import { TierProvider } from './contexts/TierContext';

// Match web theme colors
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#69B47A", // Primary green from web
    primaryContainer: "#5AA468", // Hover green from web
    secondary: "#4ABDAC", // Accent teal from web
    secondaryContainer: "#4ABDAC",
    tertiary: "#30403A", // Dark text from web
    tertiaryContainer: "#2F5140",
    background: "#F5F5F5", // Light background from web
    surface: "#FFFFFF",
    surfaceVariant: "#F5F5F5",
    error: "#c62828",
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onTertiary: "#FFFFFF",
    onSurface: "#30403A",
    onSurfaceVariant: "rgba(48, 64, 58, 0.8)",
    onBackground: "#30403A",
    outline: "#4ABDAC",
    outlineVariant: "rgba(74, 189, 172, 0.3)",
    shadow: "rgba(105, 180, 122, 0.15)",
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <TierProvider defaultTier="FREE">
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" translucent={true} backgroundColor="transparent" />
            <RootNavigator />
          </NavigationContainer>
        </PaperProvider>
      </TierProvider>
    </SafeAreaProvider>
  );
}
