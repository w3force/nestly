import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryLegend, VictoryTheme } from 'victory-native';
import type { MonteCarloChartPoint } from '@projection/shared';
import { PERCENTILE_CONFIG } from '@projection/shared';

interface PercentileChartProps {
  data: MonteCarloChartPoint[];
  width?: number;
  height?: number;
  title?: string;
}

/**
 * Enhanced Monte Carlo chart showing percentile bands (p5, p25, p50, p75, p95)
 * Visualizes uncertainty with shaded risk ranges
 */
export function PercentileChart({
  data,
  width = Dimensions.get('window').width - 64,
  height = 300,
  title = 'Monte Carlo Projection',
}: PercentileChartProps) {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Card>
        <Card.Content>
          <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
            No data available. Run Monte Carlo simulation to see results.
          </Text>
        </Card.Content>
      </Card>
    );
  }

  // Transform data for Victory charts
  const p50Data = data.map((point) => ({ x: point.age, y: point.p50 }));
  const p25Data = data.map((point) => ({ x: point.age, y: point.p25 }));
  const p75Data = data.map((point) => ({ x: point.age, y: point.p75 }));
  const p5Data = data.map((point) => ({ x: point.age, y: point.p5 }));
  const p95Data = data.map((point) => ({ x: point.age, y: point.p95 }));

  // Find max value for Y-axis scaling
  const maxValue = Math.max(...data.map((point) => point.p95));
  const minValue = Math.min(...data.map((point) => point.p5));

  // Format currency for Y-axis
  const formatY = (value: number) => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  return (
    <Card>
      <Card.Title title={title} />
      <Card.Content>
        <View style={styles.chartContainer}>
          <VictoryChart
            theme={VictoryTheme.material}
            width={width}
            height={height}
            padding={{ top: 20, bottom: 50, left: 60, right: 20 }}
            domain={{ y: [minValue * 0.9, maxValue * 1.1] }}
          >
            {/* Grid and axes */}
            <VictoryAxis
              label="Age"
              style={{
                axisLabel: { padding: 35, fontSize: 12 },
                tickLabels: { fontSize: 10 },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={formatY}
              style={{
                axisLabel: { padding: 40, fontSize: 12 },
                tickLabels: { fontSize: 10 },
              }}
            />

            {/* Percentile bands (filled areas) */}
            {/* p5-p95 band (lightest - widest range) */}
            <VictoryArea
              data={p5Data.map((point, index) => ({ 
                x: point.x, 
                y: point.y, 
                y0: p95Data[index]?.y || 0 
              }))}
              style={{
                data: {
                  fill: PERCENTILE_CONFIG.p5.color,
                  fillOpacity: PERCENTILE_CONFIG.p5.opacity,
                  stroke: 'none',
                },
              }}
            />

            {/* p25-p75 band (medium shade) */}
            <VictoryArea
              data={p25Data.map((point, index) => ({ 
                x: point.x, 
                y: point.y, 
                y0: p75Data[index]?.y || 0 
              }))}
              style={{
                data: {
                  fill: PERCENTILE_CONFIG.p25.color,
                  fillOpacity: PERCENTILE_CONFIG.p25.opacity,
                  stroke: 'none',
                },
              }}
            />

            {/* Median line (p50 - most prominent) */}
            <VictoryLine
              data={p50Data}
              style={{
                data: {
                  stroke: PERCENTILE_CONFIG.p50.color,
                  strokeWidth: 3,
                },
              }}
            />

            {/* p5 and p95 boundary lines (dashed) */}
            <VictoryLine
              data={p5Data}
              style={{
                data: {
                  stroke: PERCENTILE_CONFIG.p5.color,
                  strokeWidth: 1,
                  strokeDasharray: '5,5',
                },
              }}
            />
            <VictoryLine
              data={p95Data}
              style={{
                data: {
                  stroke: PERCENTILE_CONFIG.p95.color,
                  strokeWidth: 1,
                  strokeDasharray: '5,5',
                },
              }}
            />
          </VictoryChart>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendRow}>
              <View style={[styles.legendBox, { backgroundColor: PERCENTILE_CONFIG.p95.color, opacity: 0.5 }]} />
              <Text variant="bodySmall" style={styles.legendText}>95th (best case)</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendBox, { backgroundColor: PERCENTILE_CONFIG.p50.color }]} />
              <Text variant="bodySmall" style={styles.legendText}>50th (median)</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendBox, { backgroundColor: PERCENTILE_CONFIG.p5.color, opacity: 0.5 }]} />
              <Text variant="bodySmall" style={styles.legendText}>5th (worst case)</Text>
            </View>
          </View>

          {/* Summary stats */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={styles.summaryLabel}>Best case (p95):</Text>
              <Text variant="bodySmall" style={styles.summaryValue}>
                {formatY(data[data.length - 1]?.p95 || 0)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={[styles.summaryLabel, styles.medianLabel]}>Median (p50):</Text>
              <Text variant="bodySmall" style={[styles.summaryValue, styles.medianValue]}>
                {formatY(data[data.length - 1]?.p50 || 0)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={styles.summaryLabel}>Worst case (p5):</Text>
              <Text variant="bodySmall" style={styles.summaryValue}>
                {formatY(data[data.length - 1]?.p5 || 0)}
              </Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 11,
  },
  summaryContainer: {
    width: '100%',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  medianLabel: {
    fontWeight: '700',
  },
  medianValue: {
    fontWeight: '700',
    color: '#4ABDAC',
  },
});
