import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryLegend, VictoryTheme } from 'victory-native';
import { ScenarioProjection } from '@projection/shared';

interface ComparisonChartProps {
  baseline: ScenarioProjection;
  scenarios: ScenarioProjection[];
  width: number;
}

const COLORS = ['#4ABDAC', '#69B47A', '#FFB74D', '#FF6B6B', '#9B59B6'];

export function ComparisonChart({ baseline, scenarios, width }: ComparisonChartProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  // Prepare data for Victory
  const baselineData = baseline.data.map((point) => ({
    x: point.age,
    y: point.balance,
  }));

  const scenarioDataSets = scenarios.map((scenario) =>
    scenario.data.map((point) => ({
      x: point.age,
      y: point.balance,
    }))
  );

  // Calculate Y-axis domain
  const allBalances = [
    ...baseline.data.map((p) => p.balance),
    ...scenarios.flatMap((s) => s.data.map((p) => p.balance)),
  ];
  const maxBalance = Math.max(...allBalances);
  const minBalance = Math.min(...allBalances);
  const padding = (maxBalance - minBalance) * 0.1;

  // Legend data
  const legendData = [
    { name: `🎯 ${baseline.scenario.name}`, symbol: { fill: '#666', type: 'minus' } },
    ...scenarios.map((s, i) => ({
      name: `🔮 ${s.scenario.name}`,
      symbol: { fill: COLORS[i % COLORS.length], type: 'minus' },
    })),
  ];

  return (
    <Card style={styles.card} elevation={2}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Portfolio Projection to Age 65
        </Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          Final balances shown in legend
        </Text>

        <View style={styles.chartContainer}>
          <VictoryChart
            width={width - 32}
            height={300}
            theme={VictoryTheme.material}
            padding={{ top: 20, bottom: 50, left: 60, right: 20 }}
            domain={{
              y: [Math.max(0, minBalance - padding), maxBalance + padding],
            }}
          >
            {/* X Axis - Age */}
            <VictoryAxis
              label="Age"
              style={{
                axisLabel: { fontSize: 12, padding: 35, fill: '#666' },
                tickLabels: { fontSize: 10, fill: '#666' },
                grid: { stroke: '#e0e0e0', strokeDasharray: '4,4' },
              }}
            />

            {/* Y Axis - Balance */}
            <VictoryAxis
              dependentAxis
              label="Portfolio Balance"
              style={{
                axisLabel: { fontSize: 12, padding: 45, fill: '#666' },
                tickLabels: { fontSize: 10, fill: '#666' },
                grid: { stroke: '#e0e0e0', strokeDasharray: '4,4' },
              }}
              tickFormat={formatCurrency}
            />

            {/* Baseline Line (dashed) */}
            <VictoryLine
              data={baselineData}
              style={{
                data: {
                  stroke: '#666',
                  strokeWidth: 2,
                  strokeDasharray: '5,5',
                },
              }}
            />

            {/* Scenario Lines (solid, colored) */}
            {scenarioDataSets.map((data, index) => (
              <VictoryLine
                key={index}
                data={data}
                style={{
                  data: {
                    stroke: COLORS[index % COLORS.length],
                    strokeWidth: 3,
                  },
                }}
              />
            ))}

            {/* Legend */}
            <VictoryLegend
              x={20}
              y={10}
              orientation="horizontal"
              gutter={20}
              style={{
                labels: { fontSize: 10, fill: '#666' },
              }}
              data={legendData}
              symbolSpacer={5}
            />
          </VictoryChart>
        </View>

        {/* Final Balances Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text variant="bodySmall" style={styles.summaryLabel}>
              🎯 {baseline.scenario.name}:
            </Text>
            <Text variant="bodySmall" style={styles.summaryValue}>
              {formatCurrency(baseline.finalBalance)}
            </Text>
          </View>
          {scenarios.map((s, i) => (
            <View key={s.scenario.id} style={styles.summaryRow}>
              <Text
                variant="bodySmall"
                style={[styles.summaryLabel, { color: COLORS[i % COLORS.length] }]}
              >
                🔮 {s.scenario.name}:
              </Text>
              <Text
                variant="bodySmall"
                style={[styles.summaryValue, { color: COLORS[i % COLORS.length], fontWeight: '600' }]}
              >
                {formatCurrency(s.finalBalance)}
              </Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
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
  summary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    flex: 1,
  },
  summaryValue: {
    fontWeight: '600',
  },
});
