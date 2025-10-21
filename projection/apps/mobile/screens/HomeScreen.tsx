import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import LandingScreen from './LandingScreen';

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleGetStarted = useCallback(() => {
    navigation.navigate('Calculator' as never);
  }, [navigation]);

  const handleNavigateTo = useCallback(
    (screen: string) => {
      navigation.navigate(screen as never);
    },
    [navigation]
  );

  return <LandingScreen onGetStarted={handleGetStarted} onNavigateTo={handleNavigateTo} />;
}
