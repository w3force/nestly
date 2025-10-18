/**
 * PlansComparison Component
 * Side-by-side tier comparison table with pricing and features
 */
import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Card, Text, Button, DataTable, Chip, useTheme } from 'react-native-paper';
import {
  TierLevel,
  TIER_CONFIGS,
  TIER_COMPARISON,
  formatPrice,
  getYearlySavings,
} from '@projection/shared';
import { useTier } from '../contexts/TierContext';

interface PlansComparisonProps {
  onSelectPlan?: (tier: TierLevel) => void;
  showCurrentPlan?: boolean;
}

export function PlansComparison({
  onSelectPlan,
  showCurrentPlan = true,
}: PlansComparisonProps) {
  const theme = useTheme();
  const { currentTier, setTier } = useTier();

  const handleSelectPlan = async (tier: TierLevel) => {
    if (onSelectPlan) {
      onSelectPlan(tier);
    } else {
      // Default: update tier locally (in real app, would handle payment)
      try {
        await setTier(tier);
        console.log('Tier updated to:', tier);
      } catch (error) {
        console.error('Failed to update tier:', error);
      }
    }
  };

  const renderTierCard = (tier: TierLevel) => {
    const config = TIER_CONFIGS[tier];
    const isCurrentPlan = currentTier === tier;
    const isRecommended = tier === 'PRO';
    const yearlySavings = getYearlySavings(tier);

    return (
      <Card
        key={tier}
        style={[
          styles.tierCard,
          isRecommended && { borderWidth: 2, borderColor: theme.colors.primary },
        ]}
      >
        <Card.Content>
          {/* Header */}
          <View style={styles.tierHeader}>
            <Text variant="headlineSmall" style={styles.tierBadge}>
              {config.badge}
            </Text>
            <Text variant="titleLarge" style={[styles.tierName, { color: config.color }]}>
              {config.name}
            </Text>
            {isRecommended && (
              <Chip
                mode="flat"
                style={[styles.recommendedChip, { backgroundColor: theme.colors.primaryContainer }]}
                textStyle={{ fontSize: 11, fontWeight: '600' }}
              >
                RECOMMENDED
              </Chip>
            )}
            {isCurrentPlan && showCurrentPlan && (
              <Chip
                mode="flat"
                style={[styles.currentChip, { backgroundColor: theme.colors.secondaryContainer }]}
                textStyle={{ fontSize: 11, fontWeight: '600' }}
              >
                CURRENT PLAN
              </Chip>
            )}
          </View>

          {/* Pricing */}
          <View style={styles.pricingContainer}>
            <Text variant="displaySmall" style={styles.price}>
              {formatPrice(config.monthlyPrice, 'month').split('/')[0]}
            </Text>
            {tier !== 'FREE' && (
              <Text variant="bodySmall" style={styles.pricePeriod}>
                per month
              </Text>
            )}
            {yearlySavings > 0 && (
              <Text variant="bodySmall" style={[styles.savings, { color: theme.colors.primary }]}>
                Save ${yearlySavings}/year with annual
              </Text>
            )}
          </View>

          {/* Description */}
          <Text variant="bodyMedium" style={styles.description}>
            {config.description}
          </Text>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {TIER_COMPARISON.map((comparison) => {
              const value = comparison[tier.toLowerCase() as 'free' | 'pro' | 'premium'];
              const hasFeature = value !== false && value !== 'Preview Only' && value !== 'Quick Mode';

              return (
                <View key={comparison.feature} style={styles.featureRow}>
                  <Text
                    variant="bodySmall"
                    style={[styles.featureIcon, hasFeature && { color: theme.colors.primary }]}
                  >
                    {hasFeature ? '✓' : '–'}
                  </Text>
                  <View style={styles.featureTextContainer}>
                    <Text variant="bodySmall" style={styles.featureText}>
                      {comparison.feature}
                    </Text>
                    {typeof value === 'string' && value !== 'false' && (
                      <Text variant="bodySmall" style={styles.featureValue}>
                        {value}
                      </Text>
                    )}
                    {typeof value === 'number' && (
                      <Text variant="bodySmall" style={styles.featureValue}>
                        {value}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* CTA Button */}
          <Button
            mode={isCurrentPlan ? 'outlined' : 'contained'}
            onPress={() => !isCurrentPlan && handleSelectPlan(tier)}
            disabled={isCurrentPlan}
            style={styles.ctaButton}
            labelStyle={styles.ctaButtonLabel}
          >
            {isCurrentPlan ? 'Current Plan' : tier === 'FREE' ? 'Start Free' : 'Upgrade'}
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollView}
    >
      {renderTierCard('FREE')}
      {renderTierCard('PRO')}
      {renderTierCard('PREMIUM')}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  tierCard: {
    width: 280,
    marginRight: 16,
    elevation: 4,
  },
  tierHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  tierBadge: {
    fontSize: 48,
    marginBottom: 8,
  },
  tierName: {
    fontWeight: '700',
    marginBottom: 8,
  },
  recommendedChip: {
    marginTop: 8,
  },
  currentChip: {
    marginTop: 8,
  },
  pricingContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  price: {
    fontWeight: '700',
    lineHeight: 48,
  },
  pricePeriod: {
    color: 'rgba(0,0,0,0.6)',
    marginTop: 4,
  },
  savings: {
    fontWeight: '600',
    marginTop: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    color: 'rgba(0,0,0,0.7)',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 16,
    fontWeight: '700',
    width: 24,
    marginRight: 8,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureText: {
    fontSize: 13,
    lineHeight: 18,
  },
  featureValue: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
    marginTop: 2,
  },
  ctaButton: {
    marginTop: 8,
  },
  ctaButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
