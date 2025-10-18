import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar, useTheme } from 'react-native-paper';
import { getProbabilityMessage } from '@projection/shared';

interface ProbabilityCardProps {
  probability: number | undefined | null;
  targetGoal?: {
    retirement_spend?: number;
    horizon_years?: number;
  } | null;
}

/**
 * Display success probability with visual indicator and interpretation
 */
export function ProbabilityCard({ probability, targetGoal }: ProbabilityCardProps) {
  const theme = useTheme();

  if (!targetGoal?.retirement_spend || !targetGoal?.horizon_years) {
    return null; // Don't show if no target goal is set
  }

  const probabilityPercent = probability != null ? probability * 100 : 0;
  const message = getProbabilityMessage(probability);

  // Determine color based on probability
  const getColor = () => {
    if (probabilityPercent >= 75) return '#69B47A'; // Green
    if (probabilityPercent >= 50) return '#FFB74D'; // Orange
    return '#FF6B6B'; // Red
  };

  const color = getColor();

  return (
    <Card style={[styles.card, { borderLeftWidth: 4, borderLeftColor: color }]}>
      <Card.Title
        title="Success Probability"
        titleVariant="titleMedium"
      />
      <Card.Content>
        <View style={styles.probabilityContainer}>
          <Text variant="displaySmall" style={[styles.probabilityText, { color }]}>
            {probabilityPercent.toFixed(0)}%
          </Text>
          <ProgressBar
            progress={probabilityPercent / 100}
            color={color}
            style={styles.progressBar}
          />
        </View>

        <Text variant="bodyMedium" style={styles.message}>
          {message}
        </Text>

        <View style={styles.goalContainer}>
          <Text variant="bodySmall" style={styles.goalLabel}>
            Target Goal:
          </Text>
          <Text variant="bodySmall" style={styles.goalText}>
            ${targetGoal.retirement_spend.toLocaleString()}/year for {targetGoal.horizon_years} years
          </Text>
        </View>

        <View style={styles.interpretationContainer}>
          <Text variant="labelSmall" style={styles.interpretationTitle}>
            What does this mean?
          </Text>
          <Text variant="bodySmall" style={styles.interpretationText}>
            Based on {probabilityPercent >= 50 ? 'historical market data' : 'your current plan'}, 
            there's a {probabilityPercent.toFixed(0)}% chance your retirement savings will meet your goal.
            {probabilityPercent < 75 && ' Consider increasing contributions or adjusting expectations.'}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
  },
  probabilityContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  probabilityText: {
    fontWeight: '700',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 12,
    borderRadius: 6,
  },
  message: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  goalContainer: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 12,
  },
  goalLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  goalText: {
    fontSize: 12,
  },
  interpretationContainer: {
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  interpretationTitle: {
    fontWeight: '700',
    marginBottom: 6,
    color: '#1976D2',
  },
  interpretationText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#424242',
  },
});
