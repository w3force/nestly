import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme, Icon, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import QuickStartSection from '../components/QuickStartSection';

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  // Simple hero content (no LANDING_SCREEN dependency)
  const heroTitle = '401(k) Projections';
  const heroTagline = 'Plan Your Retirement';
  const heroDescription = 'See your retirement projection with just 3 inputs';
  
  // Feature items
  const featureItems = [
    {
      id: 'deterministic',
      title: 'Deterministic',
      description: 'Standard retirement calculations',
      cta: 'Calculate',
      navigateTo: 'Calculator',
    },
    {
      id: 'whatif',
      title: 'What-If',
      description: 'Explore different scenarios',
      cta: 'Explore',
      navigateTo: 'WhatIf',
    },
    {
      id: 'montecarlo',
      title: 'Monte Carlo',
      description: 'Probability-based projections',
      cta: 'Analyze',
      navigateTo: 'Calculator',
    },
  ];

  const getIcon = (id: string) => {
    if (id === 'deterministic') return 'calculator';
    if (id === 'whatif') return 'compare-arrows';
    if (id === 'montecarlo') return 'trending-up';
    return 'information';
  };

  const getIconColor = (id: string) => {
    if (id === 'deterministic') return '#69B47A';
    if (id === 'whatif') return '#4ABDAC';
    if (id === 'montecarlo') return '#FFD54F';
    return theme.colors.primary;
  };

  const getNavigationTarget = (id: string) => {
    if (id === 'deterministic') return 'Calculator';
    if (id === 'whatif') return 'WhatIf';
    if (id === 'montecarlo') return 'Calculator'; // Monte Carlo in calculator tab
    return 'Calculator';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Hero Section - from Schema */}
      <LinearGradient
        colors={['#D4F5E5', '#E8F5E9', '#F1F8F4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text variant="displaySmall" style={styles.heroTitle}>
          {heroTitle}
        </Text>
        <Text variant="headlineSmall" style={styles.heroTagline}>
          {heroTagline}
        </Text>
        <Text variant="bodyLarge" style={styles.heroDescription}>
          {heroDescription}
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Calculator' as never)}
          style={styles.heroButton}
          buttonColor="#69B47A"
          textColor="#FFFFFF"
        >
          Get Started
        </Button>
      </LinearGradient>

      {/* ⚡ QUICK START SECTION - Get Results in 8 Seconds */}
      <QuickStartSection onNavigateTo={(screen) => navigation.navigate(screen as never)} />

      {/* Feature Cards - from Schema */}
      <View style={styles.featuresSection}>
        <Text variant="headlineSmall" style={styles.featuresTitle}>
          Choose Your Analysis Method
        </Text>
        <View style={styles.featuresGrid}>
          {featureItems.map((item) => {
            const iconColor = getIconColor(item.id);

            return (
              <View key={item.id} style={styles.featureCardWrapper}>
                <View
                  style={[
                    styles.featureCard,
                    { backgroundColor: iconColor + '12' },
                  ]}
                >
                  <View style={styles.featureCardTop}>
                    <View
                      style={[
                        styles.featureIconContainer,
                        { backgroundColor: iconColor },
                      ]}
                    >
                      <Icon source={getIcon(item.id)} size={28} color="#FFFFFF" />
                    </View>
                    {/* Badge removed - no longer used */}
                  </View>

                  <Text variant="titleSmall" style={[styles.featureCardTitle, { color: iconColor }]}>
                    {item.title}
                  </Text>

                  <Text
                    variant="bodySmall"
                    style={styles.featureCardDescription}
                  >
                    {item.description}
                  </Text>

                  <Button
                    mode="text"
                    onPress={() =>
                      navigation.navigate(getNavigationTarget(item.id) as never)
                    }
                    style={styles.featureCardButton}
                    textColor={iconColor}
                    labelStyle={styles.featureButtonLabel}
                  >
                    {item.cta} →
                  </Button>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 36,
  },
  heroTagline: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4ABDAC',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  heroButton: {
    marginTop: 8,
    borderRadius: 24,
    paddingHorizontal: 32,
  },
  // Feature section styles
  featuresSection: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    paddingBottom: 48,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 24,
  },
  featuresGrid: {
    gap: 12,
  },
  featureCardWrapper: {
    marginBottom: 4,
  },
  featureCard: {
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    elevation: 0,
    borderWidth: 0,
  },
  featureCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    backgroundColor: '#FFD54F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  premiumBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  featureCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 22,
  },
  featureCardDescription: {
    fontSize: 13,
    color: '#555',
    lineHeight: 19,
    marginBottom: 14,
  },
  featureCardButton: {
    marginTop: 4,
    marginLeft: -8,
  },
  featureButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 2,
  },
});
