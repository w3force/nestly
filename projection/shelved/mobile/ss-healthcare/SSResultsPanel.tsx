import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Chip, Divider, useTheme, ActivityIndicator } from 'react-native-paper';
import { SSHealthcareResults, InputMode, formatCurrency } from '@projection/shared';

interface SSResultsPanelProps {
  results: SSHealthcareResults | null;
  loading?: boolean;
  mode?: InputMode;
}

export function SSResultsPanel({ results, loading = false, mode = 'DETAILED' }: SSResultsPanelProps) {
  const theme = useTheme();

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Computing...
          </Text>
        </Card.Content>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card style={[styles.card, { backgroundColor: 'rgba(74, 189, 172, 0.05)' }]}>
        <Card.Content>
          <Text variant="bodyLarge" style={styles.emptyText}>
            Enter your information and tap Compute to see results.
          </Text>
        </Card.Content>
      </Card>
    );
  }

  const { ssa: ssaCalc, medicare: medicareCalc, medicaid, net: netBenefit } = results;

  return (
    <ScrollView style={styles.container}>
      {/* Net Benefit Summary */}
      <Card style={[styles.card, styles.summaryCard]}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.summaryLabel}>
            Net Monthly Benefit
          </Text>
          <Text variant="displaySmall" style={styles.summaryAmount}>
            {formatCurrency(netBenefit.netMonthly)}
          </Text>
          <Text variant="bodySmall" style={styles.summarySubtext}>
            Social Security minus Medicare costs
          </Text>
        </Card.Content>
      </Card>

      {/* Social Security Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            💰 Social Security
          </Text>

          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>
              Monthly Benefit at Claim Age
            </Text>
            <Text variant="titleMedium" style={styles.value}>
              {formatCurrency(ssaCalc.monthlyAtClaimAge)}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.detailLabel}>
              AIME (Average Indexed Monthly Earnings)
            </Text>
            <Text variant="bodyMedium" style={styles.detailValue}>
              {formatCurrency(ssaCalc.aime)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.detailLabel}>
              PIA at Full Retirement Age ({ssaCalc.fra})
            </Text>
            <Text variant="bodyMedium" style={styles.detailValue}>
              {formatCurrency(ssaCalc.pia)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.detailLabel}>
              Adjustment Factor
            </Text>
            <Text variant="bodyMedium" style={[styles.detailValue, 
              ssaCalc.reductionOrCredit > 0 ? styles.positive : styles.negative]}>
              {ssaCalc.reductionOrCredit > 0 ? '+' : ''}
              {(ssaCalc.reductionOrCredit * 100).toFixed(1)}%
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Medicare Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            🏥 Medicare Costs
          </Text>

          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>
              Total Monthly Premiums
            </Text>
            <Text variant="titleMedium" style={[styles.value, styles.negative]}>
              {formatCurrency(medicareCalc.totalMonthly)}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.detailLabel}>
              Part A (Hospital)
            </Text>
            <Text variant="bodyMedium" style={styles.detailValue}>
              {formatCurrency(medicareCalc.partAPremium)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.detailLabel}>
              Part B (Medical) + IRMAA
            </Text>
            <Text variant="bodyMedium" style={styles.detailValue}>
              {formatCurrency(medicareCalc.partBTotal)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text variant="bodySmall" style={styles.detailLabel}>
              Part D (Drugs) + IRMAA
            </Text>
            <Text variant="bodyMedium" style={styles.detailValue}>
              {formatCurrency(medicareCalc.partDTotal)}
            </Text>
          </View>

          {medicareCalc.medigapPremium > 0 && (
            <View style={styles.row}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Medigap Supplement
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {formatCurrency(medicareCalc.medigapPremium)}
              </Text>
            </View>
          )}

          {medicareCalc.advantagePremium > 0 && (
            <View style={styles.row}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Medicare Advantage
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {formatCurrency(medicareCalc.advantagePremium)}
              </Text>
            </View>
          )}

          {medicareCalc.irmaApplied && (
            <Chip
              icon="alert-circle"
              style={styles.warningChip}
              textStyle={styles.chipText}
            >
              IRMAA surcharges applied
            </Chip>
          )}
        </Card.Content>
      </Card>

      {/* Medicaid Section */}
      {medicaid.eligible && (
        <Card style={[styles.card, styles.successCard]}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.successTitle}>
              ✓ Medicaid Eligible
            </Text>
            <Text variant="bodyMedium" style={styles.successText}>
              {medicaid.reason}
            </Text>
            <View style={styles.row}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Adjusted Premiums
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {formatCurrency(medicaid.adjustedPremiums)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  summaryCard: {
    backgroundColor: 'rgba(105, 180, 122, 0.1)',
  },
  successCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  summaryLabel: {
    marginBottom: 8,
    opacity: 0.8,
  },
  summaryAmount: {
    fontWeight: '700',
    color: '#69B47A',
    marginBottom: 4,
  },
  summarySubtext: {
    opacity: 0.6,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    flex: 1,
    fontWeight: '600',
  },
  value: {
    fontWeight: '700',
  },
  detailLabel: {
    flex: 1,
    opacity: 0.7,
  },
  detailValue: {
    fontWeight: '600',
  },
  divider: {
    marginVertical: 12,
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
  warningChip: {
    marginTop: 12,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  chipText: {
    fontSize: 12,
  },
  successTitle: {
    color: '#4CAF50',
    fontWeight: '700',
    marginBottom: 8,
  },
  successText: {
    marginBottom: 12,
  },
});
