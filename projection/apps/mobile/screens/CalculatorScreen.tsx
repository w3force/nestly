import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme } from 'react-native-paper';
import { useTier } from '../contexts/TierContext';
import { DeterministicProvider } from '../contexts/DeterministicContext';
import MonteCarloTab from './MonteCarloTab';
import SSHealthcareTab from './SSHealthcareTab';
import DeterministicTab from './DeterministicTab';

const renderScene = SceneMap({
  deterministic: DeterministicTab as any,
  monteCarlo: MonteCarloTab as any,
  ssHealthcare: SSHealthcareTab as any,
});

export default function CalculatorScreen() {
  const layout = useWindowDimensions();
  const theme = useTheme();
  const { canAccessFeature } = useTier();
  const [index, setIndex] = useState(0);
  
  const canAccessMonteCarlo = canAccessFeature("monteCarloFullAccess");
  
  const [routes] = useState([
    { key: 'deterministic', title: 'Deterministic' },
    { key: 'monteCarlo', title: 'Monte Carlo' },
    { key: 'ssHealthcare', title: 'SS & Healthcare' },
  ]);

  return (
    <DeterministicProvider>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
            style={{ backgroundColor: theme.colors.surface }}
            activeColor={theme.colors.primary}
            inactiveColor={theme.colors.onSurfaceVariant}
          />
        )}
      />
    </DeterministicProvider>
  );
}
