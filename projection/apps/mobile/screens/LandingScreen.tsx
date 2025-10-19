/**
 * Landing Screen
 * Hero section with value proposition and key features
 */
import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Text, Card, Button, useTheme, Icon } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import QuickStartSection from '../components/QuickStartSection';

interface LandingScreenProps {
  onGetStarted: () => void;
  onNavigateTo?: (screen: string) => void;
}

const { width } = Dimensions.get('window');

export default function LandingScreen({ onGetStarted, onNavigateTo }: LandingScreenProps) {
  const theme = useTheme();

  // Simple feature items (no schema dependency)
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

  const handleNavigate = (screen: string) => {
    if (onNavigateTo) {
      onNavigateTo(screen);
    } else {
      onGetStarted?.();
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#D4F5E5', '#E8F5E9', '#F1F8F4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text variant="displayMedium" style={styles.heroTitle}>
            Nestly
          </Text>
          <Text variant="headlineSmall" style={styles.heroSubtitle}>
            Watch your future grow, one nest at a time.
          </Text>
          <Text variant="bodyLarge" style={styles.heroDescription}>
            Nestly helps you project your savings, 401(k), Social Security, Medicare costs, and investments over time — guiding you to build a secure financial future.
          </Text>
        </View>
      </LinearGradient>

      {/* ⚡ QUICK START SECTION - Get Results in 8 Seconds */}
      <QuickStartSection onNavigateTo={handleNavigate} />

      {/* Feature Cards Section */}
      <View style={styles.featuresSection}>
        <Text variant="headlineSmall" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Choose Your Analysis Method
        </Text>

        {/* Feature Cards from Schema */}
        {featureItems.map((item, index) => {
          const getIcon = () => {
            if (item.id === 'deterministic') return 'calculator';
            if (item.id === 'whatif') return 'compare-arrows';
            if (item.id === 'montecarlo') return 'trending-up';
            return 'information';
          };

          const getIconColor = () => {
            if (item.id === 'deterministic') return '#69B47A';
            if (item.id === 'whatif') return '#4ABDAC';
            if (item.id === 'montecarlo') return '#FFD54F';
            return theme.colors.primary;
          };

          const isPremium = item.id === 'montecarlo';

          return (
            <Card key={item.id} style={styles.featureCard}>
              <Card.Content style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: getIconColor() + '20' }]}>
                  <Icon source={getIcon()} size={32} color={getIconColor()} />
                </View>
                <View style={styles.featureText}>
                  <View style={styles.featureTitleRow}>
                    <Text variant="titleMedium" style={styles.featureTitle}>
                      {item.title}
                    </Text>
                    {isPremium && (
                      <View style={styles.premiumBadge}>
                        <Text style={styles.premiumText}>PREMIUM</Text>
                      </View>
                    )}
                  </View>
                  <Text variant="bodyMedium" style={styles.featureDescription}>
                    {item.description}
                  </Text>
                  <Button
                    mode="outlined"
                    onPress={() => handleNavigate(item.navigateTo)}
                    style={styles.featureCta}
                    labelStyle={styles.featureCtaLabel}
                  >
                    {item.cta}
                  </Button>
                </View>
              </Card.Content>
            </Card>
          );
        })}

        {/* Bottom CTA */}
        <View style={styles.bottomCta}>
          <Text variant="bodyLarge" style={[styles.bottomCtaTitle, { color: theme.colors.onBackground }]}>
            Start Planning Now
          </Text>
          <Text variant="bodySmall" style={styles.bottomCtaNote}>
            No credit card required • Free tier includes all calculators
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: 600,
    alignItems: 'center',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  heroSubtitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  heroDescription: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
    opacity: 0.95,
  },
  ctaButton: {
    marginTop: 8,
    elevation: 4,
  },
  ctaButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 6,
  },
  ctaButtonContent: {
    flexDirection: 'row-reverse',
  },
  featuresSection: {
    padding: 24,
  },
  sectionTitle: {
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '700',
  },
  featureCard: {
    marginBottom: 16,
    elevation: 2,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    marginBottom: 0,
    fontWeight: '600',
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: '#FFD54F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#30403A',
  },
  featureDescription: {
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: 12,
  },
  featureCta: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  featureCtaLabel: {
    fontSize: 12,
  },
  bottomCta: {
    marginTop: 32,
    alignItems: 'center',
    paddingVertical: 24,
  },
  bottomCtaTitle: {
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '700',
  },
  bottomButton: {
    marginBottom: 16,
  },
  bottomButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 4,
  },
  bottomCtaNote: {
    textAlign: 'center',
    opacity: 0.6,
  },
});
