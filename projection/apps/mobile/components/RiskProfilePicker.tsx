import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Chip, useTheme } from 'react-native-paper';
import type { RiskLevel, RiskProfile } from '@projection/shared';
import { RISK_PROFILES } from '@projection/shared';

interface RiskProfilePickerProps {
  currentLevel: RiskLevel;
  onSelect: (level: RiskLevel, profile: RiskProfile) => void;
}

/**
 * Risk profile selector with preset investment strategies
 * Conservative, Moderate, Aggressive options
 */
export function RiskProfilePicker({ currentLevel, onSelect }: RiskProfilePickerProps) {
  const theme = useTheme();

  const renderProfileCard = (level: RiskLevel, profile: RiskProfile) => {
    const isSelected = currentLevel === level;

    return (
      <View key={level} style={styles.profileCard}>
        <Button
          mode={isSelected ? 'contained' : 'outlined'}
          onPress={() => onSelect(level, profile)}
          style={[
            styles.profileButton,
            isSelected && { backgroundColor: profile.color },
          ]}
          labelStyle={styles.buttonLabel}
        >
          {profile.label}
        </Button>
        <View style={styles.profileDetails}>
          <Text variant="bodySmall" style={styles.profileDescription}>
            {profile.description}
          </Text>
          <View style={styles.metricsRow}>
            <Chip mode="flat" style={styles.metric} textStyle={styles.metricText}>
              Return: {(profile.expectedReturn * 100).toFixed(1)}%
            </Chip>
            <Chip mode="flat" style={styles.metric} textStyle={styles.metricText}>
              Risk: {(profile.returnVolatility * 100).toFixed(1)}%
            </Chip>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Card>
      <Card.Title
        title="Risk Profile"
        subtitle="Choose your investment strategy"
      />
      <Card.Content>
        <View style={styles.container}>
          {Object.entries(RISK_PROFILES).map(([level, profile]) =>
            renderProfileCard(level as RiskLevel, profile)
          )}
        </View>

        <View style={styles.infoBox}>
          <Text variant="labelSmall" style={styles.infoTitle}>
            ℹ️ How to choose?
          </Text>
          <Text variant="bodySmall" style={styles.infoText}>
            • <Text style={styles.bold}>Conservative:</Text> Lower returns, less volatility. Good for near-retirees (5-10 years).
          </Text>
          <Text variant="bodySmall" style={styles.infoText}>
            • <Text style={styles.bold}>Moderate:</Text> Balanced risk/reward. Good for mid-career (10-20 years).
          </Text>
          <Text variant="bodySmall" style={styles.infoText}>
            • <Text style={styles.bold}>Aggressive:</Text> Higher returns, more volatility. Good for young investors (20+ years).
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  profileCard: {
    marginBottom: 8,
  },
  profileButton: {
    marginBottom: 8,
    minHeight: 48,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  profileDetails: {
    paddingHorizontal: 4,
  },
  profileDescription: {
    marginBottom: 8,
    color: '#666',
    lineHeight: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  metric: {
    height: 32,
    minWidth: 110,
    justifyContent: 'center',
  },
  metricText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  infoBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4ABDAC',
  },
  infoTitle: {
    fontWeight: '700',
    marginBottom: 8,
    color: '#30403A',
  },
  infoText: {
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 4,
    color: '#424242',
  },
  bold: {
    fontWeight: '600',
  },
});
