import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryScatter } from 'victory-native';
import { ClaimAgeSweepPoint } from '@projection/shared';

interface NetByClaimAgeChartProps {
  sweep: ClaimAgeSweepPoint[];
  selectedAge: number;
  loading?: boolean;
}

export function NetByClaimAgeChart({ sweep, selectedAge, loading = false }: NetByClaimAgeChartProps) {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32; // Account for card padding

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyMedium" style={styles.loadingText}>
            Computing claim age analysis...
          </Text>
        </Card.Content>
      </Card>
    );
  }

  if (!sweep || sweep.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Enter your information to see net benefit by claim age
          </Text>
        </Card.Content>
      </Card>
    );
  }

  // Prepare data for Victory
  const ssData = sweep.map((point) => ({
    x: point.age,
    y: point.ssMonthly,
  }));

  const netData = sweep.map((point) => ({
    x: point.age,
    y: point.netMonthly,
  }));

  // Find the selected point for highlighting
  const selectedPoint = sweep.find((p) => p.age === selectedAge);
  const selectedNetData = selectedPoint
    ? [{ x: selectedPoint.age, y: selectedPoint.netMonthly }]
    : [];

  // Calculate Y-axis domain with padding
  const allValues = sweep.flatMap((p) => [p.ssMonthly, p.netMonthly]);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Net Benefit by Claim Age
        </Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          Monthly benefit after Medicare costs
        </Text>

        <View style={styles.chartContainer}>
          <VictoryChart
            width={chartWidth}
            height={300}
            theme={VictoryTheme.material}
            padding={{ top: 20, bottom: 50, left: 60, right: 20 }}
            domain={{
              x: [62, 70],
              y: [minValue - padding, maxValue + padding],
            }}
          >
            {/* X Axis - Claim Age */}
            <VictoryAxis
              label="Claim Age"
              style={{
                axisLabel: { fontSize: 12, padding: 35, fill: '#666' },
                tickLabels: { fontSize: 10, fill: '#666' },
                grid: { stroke: '#e0e0e0', strokeDasharray: '4,4' },
              }}
              tickValues={[62, 63, 64, 65, 66, 67, 68, 69, 70]}
            />

            {/* Y Axis - Monthly Benefit */}
            <VictoryAxis
              dependentAxis
              label="Monthly Benefit"
              style={{
                axisLabel: { fontSize: 12, padding: 45, fill: '#666' },
                tickLabels: { fontSize: 10, fill: '#666' },
                grid: { stroke: '#e0e0e0', strokeDasharray: '4,4' },
              }}
              tickFormat={(value: number) => {
                if (value >= 1000) {
                  return `$${(value / 1000).toFixed(1)}k`;
                }
                return `$${value}`;
              }}
            />

            {/* Social Security Line */}
            <VictoryLine
              data={ssData}
              style={{
                data: {
                  stroke: '#4ABDAC',
                  strokeWidth: 3,
                },
              }}
            />

            {/* Net Benefit Line (Dashed) */}
            <VictoryLine
              data={netData}
              style={{
                data: {
                  stroke: '#69B47A',
                  strokeWidth: 3,
                  strokeDasharray: '5,5',
                },
              }}
            />

            {/* Highlight Selected Age */}
            {selectedNetData.length > 0 && (
              <VictoryScatter
                data={selectedNetData}
                size={8}
                style={{
                  data: {
                    fill: '#FF6B6B',
                    stroke: '#fff',
                    strokeWidth: 2,
                  },
                }}
              />
            )}
          </VictoryChart>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: '#4ABDAC' }]} />
            <Text variant="bodySmall">Social Security</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, styles.dashedLine, { backgroundColor: '#69B47A' }]} />
            <Text variant="bodySmall">Net (after Medicare)</Text>
          </View>
          {selectedPoint && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
              <Text variant="bodySmall">Selected: {formatCurrency(selectedPoint.netMonthly)}/mo</Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    elevation: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 24,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendLine: {
    width: 24,
    height: 3,
    borderRadius: 1.5,
  },
  dashedLine: {
    // Note: React Native doesn't support CSS dashes, so this is solid
    opacity: 0.8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },
});
