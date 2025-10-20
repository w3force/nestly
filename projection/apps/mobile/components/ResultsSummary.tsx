/**
 * ResultsSummary Component
 * Enhanced results display with key metrics and visual hierarchy
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

interface ResultsSummaryProps {
  projectedBalance?: number;
  nominalBalance?: number;
  yearsToRetirement: number;
  totalContributions?: number;
  averageGrowth?: number;
  loading?: boolean;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  mainCard: {
    marginBottom: 0,
    backgroundColor: '#E8F5E9',
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#558B2F',
    fontWeight: '500',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
  },
  mainValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 4,
  },
  mainLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    marginVertical: 12,
  },
  nominalText: {
    marginTop: 8,
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  nominalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B5E20',
    marginTop: 2,
  },
});

function formatCurrency(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return '—';
  }
  return `$${Math.round(value).toLocaleString()}`;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  projectedBalance,
  nominalBalance,
  yearsToRetirement,
  totalContributions,
  averageGrowth,
  loading,
}) => {
  if (!projectedBalance || loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Card style={styles.mainCard}>
        <Card.Content style={styles.cardContent}>
          {/* Main projected balance */}
          <Text style={styles.mainLabel}>Inflation-Adjusted Balance at Retirement</Text>
          <Text style={styles.mainValue}>{formatCurrency(projectedBalance)}</Text>

          {/* Metrics row */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Years to Retire</Text>
              <Text style={styles.metricValue}>{yearsToRetirement}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Your Contributions</Text>
              <Text style={styles.metricValue}>{formatCurrency(totalContributions)}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Investment Growth</Text>
              <Text style={styles.metricValue}>{formatCurrency((projectedBalance ?? 0) - (totalContributions ?? 0))}</Text>
            </View>
          </View>

          {/* Nominal reference */}
          {nominalBalance && (
            <>
              <View style={styles.divider} />
              <Text style={styles.nominalText}>Nominal Balance (Future Dollars)</Text>
              <Text style={styles.nominalValue}>{formatCurrency(nominalBalance)}</Text>
            </>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};
