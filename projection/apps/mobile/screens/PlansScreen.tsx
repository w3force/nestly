import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, Divider, useTheme, Chip } from 'react-native-paper';
import { TIER_CONFIGS, TIER_COMPARISON } from '@projection/shared';
import { useTier } from '../contexts/TierContext';
import { useNavigation } from '@react-navigation/native';

export default function PlansScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { currentTier, setTier, features } = useTier();
  const [selectedTier, setSelectedTier] = useState<'FREE' | 'PRO' | 'PREMIUM'>(currentTier);

  const handleSelectPlan = async (tier: 'FREE' | 'PRO' | 'PREMIUM') => {
    try {
      await setTier(tier);
      setSelectedTier(tier);
    } catch (error) {
      console.error('Failed to select plan:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <Button
          mode="text"
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Back
        </Button>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Choose Your Plan
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tier Selection Cards */}
        <View style={styles.tierCardsContainer}>
          {(['FREE', 'PRO', 'PREMIUM'] as const).map((tier) => {
            const config = TIER_CONFIGS[tier];
            const isCurrentPlan = currentTier === tier;
            const isSelected = selectedTier === tier;

            return (
              <Card
                key={tier}
                style={[
                  styles.tierCard,
                  isCurrentPlan && styles.tierCardCurrent,
                  isSelected && styles.tierCardSelected,
                ]}
                onPress={() => setSelectedTier(tier)}
              >
                <Card.Content style={styles.tierCardContent}>
                  <View style={styles.tierHeader}>
                    <Text style={styles.tierBadge}>{config.badge}</Text>
                    <View style={styles.tierInfo}>
                      <Text variant="titleLarge" style={[styles.tierName, { color: config.color }]}>
                        {config.name}
                      </Text>
                      <Text variant="bodySmall" style={styles.tierDescription}>
                        {config.description}
                      </Text>
                    </View>
                  </View>

                  {/* Pricing */}
                  <View style={styles.pricingSection}>
                    <Text variant="displayMedium" style={styles.price}>
                      {tier === 'FREE' ? 'Free' : `$${config.monthlyPrice}`}
                    </Text>
                    {tier !== 'FREE' && (
                      <Text variant="bodySmall" style={styles.pricePeriod}>
                        per month
                      </Text>
                    )}
                  </View>

                  {/* Status Chip */}
                  <View style={styles.statusChip}>
                    {isCurrentPlan && (
                      <Chip icon="check" mode="flat">
                        Current Plan
                      </Chip>
                    )}
                    {!isCurrentPlan && isSelected && (
                      <Chip icon="star" mode="flat" style={{ backgroundColor: config.color }}>
                        Selected
                      </Chip>
                    )}
                  </View>

                  {/* Quick Features */}
                  <View style={styles.quickFeatures}>
                    <Text variant="bodySmall" style={styles.quickFeaturesLabel}>
                      Includes:
                    </Text>
                    <Text variant="bodySmall" style={styles.quickFeature}>
                      • {tier === 'FREE' ? 'Preview' : 'Full'} Monte Carlo
                    </Text>
                    <Text variant="bodySmall" style={styles.quickFeature}>
                      • Up to {config.features?.maxScenarios || 2} scenarios
                    </Text>
                    {tier !== 'FREE' && (
                      <Text variant="bodySmall" style={styles.quickFeature}>
                        • Priority support
                      </Text>
                    )}
                  </View>

                  {/* Select Button */}
                  {!isCurrentPlan && (
                    <Button
                      mode="contained"
                      onPress={() => handleSelectPlan(tier)}
                      style={[styles.selectButton, { backgroundColor: config.color }]}
                    >
                      {tier === 'FREE' ? 'Downgrade' : 'Upgrade'}
                    </Button>
                  )}
                </Card.Content>
              </Card>
            );
          })}
        </View>

        {/* Full Feature Comparison */}
        <View style={styles.comparisonSection}>
          <Text variant="titleLarge" style={styles.comparisonTitle}>
            Feature Comparison
          </Text>

          {/* Header Row */}
          <View style={styles.comparisonHeader}>
            <View style={styles.featureNameCol}>
              <Text variant="bodySmall" style={styles.headerText}>
                Features
              </Text>
            </View>
            {(['FREE', 'PRO', 'PREMIUM'] as const).map((tier) => (
              <View key={tier} style={styles.featureValueCol}>
                <Text
                  variant="bodySmall"
                  style={[styles.headerText, styles.tierColumnHeader]}
                  numberOfLines={2}
                >
                  {TIER_CONFIGS[tier].name}
                </Text>
              </View>
            ))}
          </View>

          <Divider />

          {/* Feature Rows */}
          {TIER_COMPARISON.map((comparison, index) => {
            const freeValue = comparison.free;
            const proValue = comparison.pro;
            const premiumValue = comparison.premium;

            const getDisplay = (value: any) => {
              if (value === true || value === 'Yes') return '✓';
              if (value === false || value === 'No') return '–';
              return value || '–';
            };

            const hasFeature = (value: any) => {
              return value !== false && value !== 'No' && value !== 'Preview Only';
            };

            return (
              <View key={index}>
                <View style={styles.comparisonRow}>
                  <View style={styles.featureNameCol}>
                    <Text variant="bodySmall" style={styles.featureName}>
                      {comparison.feature}
                    </Text>
                  </View>
                  {/* Free */}
                  <View style={styles.featureValueCol}>
                    <Text
                      variant="bodySmall"
                      style={[
                        styles.featureValue,
                        hasFeature(freeValue) ? styles.available : styles.unavailable,
                      ]}
                    >
                      {getDisplay(freeValue)}
                    </Text>
                  </View>
                  {/* Pro */}
                  <View style={styles.featureValueCol}>
                    <Text
                      variant="bodySmall"
                      style={[
                        styles.featureValue,
                        hasFeature(proValue) ? styles.available : styles.unavailable,
                      ]}
                    >
                      {getDisplay(proValue)}
                    </Text>
                  </View>
                  {/* Premium */}
                  <View style={styles.featureValueCol}>
                    <Text
                      variant="bodySmall"
                      style={[
                        styles.featureValue,
                        hasFeature(premiumValue) ? styles.available : styles.unavailable,
                      ]}
                    >
                      {getDisplay(premiumValue)}
                    </Text>
                  </View>
                </View>
                {index < TIER_COMPARISON.length - 1 && (
                  <Divider style={styles.rowDivider} />
                )}
              </View>
            );
          })}
        </View>

        {/* Footer Info */}
        <Card style={styles.footerCard}>
          <Card.Content>
            <Text variant="bodySmall" style={styles.footerText}>
              💡 All plans include access to the Retirement Calculator and What-If scenarios. Premium tier unlocks full Monte Carlo analysis and advanced features.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    margin: -8,
  },
  headerTitle: {
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tierCardsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  tierCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
    elevation: 2,
  },
  tierCardCurrent: {
    borderColor: '#69B47A',
    borderWidth: 2,
    backgroundColor: 'rgba(105, 180, 122, 0.05)',
  },
  tierCardSelected: {
    borderColor: '#4ABDAC',
    borderWidth: 2,
    backgroundColor: 'rgba(74, 189, 172, 0.05)',
  },
  tierCardContent: {
    paddingVertical: 12,
  },
  tierHeader: {
    marginBottom: 8,
  },
  tierBadge: {
    fontSize: 32,
    marginBottom: 4,
  },
  tierInfo: {
    marginLeft: 0,
  },
  tierName: {
    fontWeight: '700',
  },
  tierDescription: {
    opacity: 0.7,
    marginTop: 2,
  },
  pricingSection: {
    marginVertical: 12,
    alignItems: 'center',
  },
  price: {
    fontWeight: '700',
  },
  pricePeriod: {
    opacity: 0.6,
  },
  statusChip: {
    marginVertical: 8,
  },
  quickFeatures: {
    marginVertical: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  quickFeaturesLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  quickFeature: {
    opacity: 0.7,
    marginBottom: 2,
    fontSize: 11,
  },
  selectButton: {
    marginTop: 8,
  },
  comparisonSection: {
    marginVertical: 24,
  },
  comparisonTitle: {
    fontWeight: '700',
    marginBottom: 16,
  },
  comparisonHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 8,
    marginBottom: 0,
  },
  headerText: {
    fontWeight: '700',
  },
  tierColumnHeader: {
    textAlign: 'center',
  },
  featureNameCol: {
    flex: 1.8,
  },
  featureValueCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  featureName: {
    fontWeight: '500',
    lineHeight: 16,
  },
  featureValue: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13,
  },
  available: {
    color: '#4CAF50',
  },
  unavailable: {
    color: '#999',
  },
  rowDivider: {
    marginHorizontal: 12,
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  footerCard: {
    marginBottom: 24,
  },
  footerText: {
    opacity: 0.7,
    lineHeight: 18,
  },
});
