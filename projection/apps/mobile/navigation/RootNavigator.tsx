/**
 * Root Navigator
 * Handles onboarding flow and main app navigation
 */
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import LandingScreen from '../screens/LandingScreen';
import StartScreen from '../screens/StartScreen';
import AuthScreen from '../screens/AuthScreen';
import BottomTabNavigator from './BottomTabNavigator';
import { TierLevel } from '@projection/shared';
import { useTier } from '../contexts/TierContext';

const Stack = createStackNavigator();

const ONBOARDING_KEY = '@nestly_onboarding_complete';

type TabRouteName = 'Home' | 'Calculator' | 'WhatIf' | 'Profile';

const TAB_ROUTES: Record<string, TabRouteName> = {
  Home: 'Home',
  Calculator: 'Calculator',
  WhatIf: 'WhatIf',
  Profile: 'Profile',
  Deterministic: 'Calculator',
};

export default function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [initialTab, setInitialTab] = useState<TabRouteName>('Home');
  const { setTier } = useTier();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasCompletedOnboarding(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async (selectedTier: TierLevel) => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      await setTier(selectedTier);
      setInitialTab('Home');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const skipOnboarding = async (targetTab: TabRouteName = 'Home') => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setInitialTab(targetTab);
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!hasCompletedOnboarding ? (
        <>
          <Stack.Screen name="Landing">
            {(props) => (
              <LandingScreen
                {...props}
                onGetStarted={async () => {
                  await skipOnboarding('Calculator');
                }}
                onNavigateTo={async (screen) => {
                  const targetTab = TAB_ROUTES[screen];
                  if (targetTab) {
                    await skipOnboarding(targetTab);
                    return;
                  }
                  props.navigation.navigate(screen);
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Start">
            {(props) => (
              <StartScreen
                {...props}
                onContinue={completeOnboarding}
                onSkip={() => skipOnboarding()}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Auth">
            {(props) => (
              <AuthScreen
                {...props}
                onGuest={() => skipOnboarding()}
                onSignIn={() => skipOnboarding()}
                onSignUp={() => skipOnboarding()}
              />
            )}
          </Stack.Screen>
        </>
      ) : (
        <>
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {() => <BottomTabNavigator key={initialTab} initialRouteName={initialTab} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}
