/**
 * UpgradeBanner Component
 * Shows premium feature messaging with upgrade CTA
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Button, useTheme, Icon } from 'react-native-paper';
import { TierLevel, getUpgradeMessage } from '@projection/shared';
import { useTier } from '../contexts/TierContext';

interface UpgradeBannerProps {
  feature: string;
  requiredTier: TierLevel;
  icon?: string;
  compact?: boolean;
  onUpgrade?: () => void;
}

export function UpgradeBanner({
  feature,
  requiredTier,
  icon = 'star',
  compact = false,
  onUpgrade,
}: UpgradeBannerProps) {
  const theme = useTheme();
  const { currentTier, tierConfig } = useTier();

  // Don't show if user already has access
  if (currentTier === requiredTier || 
      (requiredTier === 'PRO' && currentTier === 'PREMIUM') ||
      (requiredTier === 'FREE')) {
    return null;
  }

  const message = getUpgradeMessage(feature, currentTier, requiredTier);
  const requiredTierBadge = requiredTier === 'PRO' ? '⭐' : '💎';
  const requiredTierName = requiredTier === 'PRO' ? 'Pro' : 'Premium';

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default behavior: navigate to plans comparison
      console.log('Navigate to plans comparison for', requiredTier);
    }
  };

  if (compact) {
    return (
      <Card style={[styles.compactCard, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Card.Content style={styles.compactContent}>
          <View style={styles.compactIconContainer}>
            <Text style={styles.compactEmoji}>{requiredTierBadge}</Text>
          </View>
          <View style={styles.compactTextContainer}>
            <Text variant="bodySmall" style={styles.compactText}>
              <Text style={{ fontWeight: '600' }}>{requiredTierName}</Text> feature
            </Text>
          </View>
          <Button
            mode="contained"
            compact
            onPress={handleUpgrade}
            style={styles.compactButton}
            labelStyle={styles.compactButtonLabel}
          >
            Upgrade
          </Button>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.secondaryContainer }]}>
      <Card.Content style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon source={icon} size={48} color={theme.colors.onSecondary} />
        </View>

        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSecondary }]}>
          {requiredTierBadge} {requiredTierName} Feature
        </Text>

        <Text variant="bodyMedium" style={[styles.message, { color: theme.colors.onSecondary }]}>
          {message}
        </Text>

        <Button
          mode="contained"
          onPress={handleUpgrade}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={styles.buttonLabel}
          icon="arrow-right"
          contentStyle={styles.buttonContent}
        >
          Upgrade to {requiredTierName}
        </Button>

        <Text variant="bodySmall" style={[styles.currentTier, { color: theme.colors.onSecondary }]}>
          Current plan: {tierConfig.badge} {tierConfig.name}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContent: {
    flexDirection: 'row-reverse',
  },
  currentTier: {
    marginTop: 16,
    opacity: 0.8,
  },
  
  // Compact styles
  compactCard: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  compactIconContainer: {
    marginRight: 12,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactEmoji: {
    fontSize: 20,
  },
  compactTextContainer: {
    flex: 1,
  },
  compactText: {
    fontSize: 13,
  },
  compactButton: {
    marginLeft: 12,
  },
  compactButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
