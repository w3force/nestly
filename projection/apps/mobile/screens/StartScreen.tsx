/**
 * Start Screen
 * Welcome and tier selection onboarding
 */
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TierLevel, TIER_CONFIGS } from '@projection/shared';

interface StartScreenProps {
  onContinue: (selectedTier: TierLevel) => void;
  onSkip?: () => void;
}

export default function StartScreen({ onContinue, onSkip }: StartScreenProps) {
  const theme = useTheme();
  const [selectedTier, setSelectedTier] = useState<TierLevel>('FREE');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
        {/* Welcome Header */}
        <View style={styles.header}>
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
            Welcome to Nestly! 👋
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Let's get you started with the right plan for your retirement goals
          </Text>
        </View>

        {/* Tier Selection */}
        <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Choose Your Plan
        </Text>

        <RadioButton.Group onValueChange={(value) => setSelectedTier(value as TierLevel)} value={selectedTier}>
          {/* Free Tier */}
          <Card
            style={[
              styles.tierCard,
              selectedTier === 'FREE' && {
                borderWidth: 2,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => setSelectedTier('FREE')}
          >
            <Card.Content style={styles.tierContent}>
              <View style={styles.tierHeader}>
                <View style={styles.tierTitleRow}>
                  <Text style={styles.tierBadge}>{TIER_CONFIGS.FREE.badge}</Text>
                  <View style={styles.tierInfo}>
                    <Text variant="titleLarge" style={[styles.tierName, { color: TIER_CONFIGS.FREE.color }]}>
                      {TIER_CONFIGS.FREE.name}
                    </Text>
                    <Text variant="headlineMedium" style={styles.tierPrice}>
                      Free
                    </Text>
                  </View>
                </View>
                <RadioButton value="FREE" />
              </View>

              <Text variant="bodyMedium" style={styles.tierDescription}>
                {TIER_CONFIGS.FREE.description}
              </Text>

              <View style={styles.tierFeatures}>
                <Text variant="bodySmall" style={styles.featureItem}>
                  ✓ Preview Monte Carlo simulations (1,000 paths)
                </Text>
                <Text variant="bodySmall" style={styles.featureItem}>
                  ✓ Up to 2 What-If scenarios
                </Text>
                <Text variant="bodySmall" style={styles.featureItem}>
                  ✓ Basic Social Security & Medicare estimates
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Pro Tier */}
          <Card
            style={[
              styles.tierCard,
              selectedTier === 'PRO' && {
                borderWidth: 2,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => setSelectedTier('PRO')}
          >
            <Card.Content style={styles.tierContent}>
              <View style={styles.tierHeader}>
                <View style={styles.tierTitleRow}>
                  <Text style={styles.tierBadge}>{TIER_CONFIGS.PRO.badge}</Text>
                  <View style={styles.tierInfo}>
                    <Text variant="titleLarge" style={[styles.tierName, { color: TIER_CONFIGS.PRO.color }]}>
                      {TIER_CONFIGS.PRO.name}
                    </Text>
                    <Text variant="headlineMedium" style={styles.tierPrice}>
                      $9.99/mo
                    </Text>
                  </View>
                </View>
                <RadioButton value="PRO" />
              </View>

              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>RECOMMENDED</Text>
              </View>

              <Text variant="bodyMedium" style={styles.tierDescription}>
                {TIER_CONFIGS.PRO.description}
              </Text>

              <View style={styles.tierFeatures}>
                <Text variant="bodySmall" style={styles.featureItem}>
                  ✓ Full Monte Carlo analysis (10,000 paths)
                </Text>
                <Text variant="bodySmall" style={styles.featureItem}>
                  ✓ Up to 5 What-If scenarios
                </Text>
                <Text variant="bodySmall" style={styles.featureItem}>
                  ✓ Detailed Social Security & Medicare analysis
                </Text>
                <Text variant="bodySmall" style={styles.featureItem}>
                  ✓ Export data & reports
                </Text>
                <Text variant="bodySmall" style={styles.featureItem}>
                  ✓ Ad-free experience
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Premium Tier */}
          <Card
            style={[
              styles.tierCard,
              selectedTier === 'PREMIUM' && {
                borderWidth: 2,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => setSelectedTier('PREMIUM')}
          >
            <Card.Content style={styles.tierContent}>
              <View style={styles.tierHeader}>
                <View style={styles.tierTitleRow}>
                  <Text style={styles.tierBadge}>{TIER_CONFIGS.PREMIUM.badge}</Text>
                  <View style={styles.tierInfo}>
                    <Text variant="titleLarge" style={[styles.tierName, { color: TIER_CONFIGS.PREMIUM.color }]}>
                      {TIER_CONFIGS.PREMIUM.name}
                    </Text>
                    <Text variant="headlineMedium" style={styles.tierPrice}>
                      $19.99/mo
                    </Text>
                  </View>
                </View>
                <RadioButton value="PREMIUM" />
              </View>

              <Text variant="bodyMedium" style={styles.tierDescription}>
                {TIER_CONFIGS.PREMIUM.description}
              </Text>

              <View style={styles.tierFeatures}>
                <Text variant="bodySmall" style={styles.featureItem}>
                  ✓ Ultimate Monte Carlo (50,000 paths)
                </Text>
                <Text variant="bodySmall" style={styles.featureItem}>
                  ✓ Up to 10 What-If scenarios
                </Text>
                <Text variant="bodySmall" style={styles.featureItem}>
                  ✓ All Pro features
                </Text>
                <Text variant="bodySmall" style={styles.featureItem}>
                  ✓ Priority support
                </Text>
              </View>
            </Card.Content>
          </Card>
        </RadioButton.Group>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => onContinue(selectedTier)}
            style={styles.continueButton}
            labelStyle={styles.continueButtonLabel}
            icon="arrow-right"
            contentStyle={styles.continueButtonContent}
          >
            {selectedTier === 'FREE' ? 'Get Started Free' : `Start ${TIER_CONFIGS[selectedTier].name} Trial`}
          </Button>

          {onSkip && (
            <Button
              mode="text"
              onPress={onSkip}
              style={styles.skipButton}
              labelStyle={styles.skipButtonLabel}
            >
              Continue as Guest
            </Button>
          )}

          <Text variant="bodySmall" style={styles.note}>
            {selectedTier === 'FREE'
              ? 'No credit card required'
              : '7-day free trial • Cancel anytime'}
          </Text>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  content: {
    padding: 24,
    paddingTop: 16,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  sectionTitle: {
    marginBottom: 20,
    fontWeight: '600',
  },
  tierCard: {
    marginBottom: 16,
    elevation: 3,
  },
  tierContent: {
    paddingVertical: 8,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tierTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tierBadge: {
    fontSize: 40,
    marginRight: 12,
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    fontWeight: '700',
  },
  tierPrice: {
    fontWeight: '600',
    marginTop: 4,
  },
  recommendedBadge: {
    backgroundColor: '#69B47A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  recommendedText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  tierDescription: {
    marginBottom: 16,
    opacity: 0.8,
    lineHeight: 22,
  },
  tierFeatures: {
    gap: 8,
  },
  featureItem: {
    opacity: 0.7,
    lineHeight: 18,
  },
  actions: {
    marginTop: 32,
    gap: 12,
    alignItems: 'center',
  },
  continueButton: {
    width: '100%',
  },
  continueButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 4,
  },
  continueButtonContent: {
    flexDirection: 'row-reverse',
  },
  skipButton: {
    marginTop: 8,
  },
  skipButtonLabel: {
    fontSize: 14,
  },
  note: {
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 8,
  },
});
