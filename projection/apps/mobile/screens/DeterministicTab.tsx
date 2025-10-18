import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import Slider from '@react-native-community/slider';
import {
  Button,
  Card,
  Text,
  TextInput,
  useTheme,
  Snackbar,
  Chip,
} from "react-native-paper";
import { LineChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
import * as scale from "d3-scale";
import { simulateDeterministic, useProjectionStore } from "@projection/core";
import { useNavigation } from "@react-navigation/native";
import { HelpIcon } from "../components";
import { useDeterministicBaseline } from "../contexts/DeterministicContext";

const chartAxisTextStyle = { fontSize: 10, fill: "rgba(48, 64, 58, 0.8)" };
const deterministicStrokeStyle = { stroke: "#69B47A", strokeWidth: 2 };

const formatYAxisLabel = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(0)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

const formatXAxisLabel = (value: number, index: number, values: any[]) => {
  return `${value}`;
};

function formatCurrency(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  return `$${Math.round(value).toLocaleString()}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    marginBottom: 0,
  },
  inputSpacing: {
    marginBottom: 12,
  },
  resultText: {
    marginTop: 16,
    fontWeight: "700",
    color: "#30403A",
  },
  finalResultCard: {
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: "#E8F5E9",
    borderLeftWidth: 4,
    borderLeftColor: "#69B47A",
    borderRadius: 4,
  },
  finalResultTitle: {
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 8,
  },
  finalResultValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1B5E20",
  },
  realBalanceText: {
    marginTop: 12,
    fontWeight: "600",
    color: "#558B2F",
  },
  realBalanceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#33691E",
  },
  errorText: {
    marginTop: 12,
    color: "#c62828",
  },
  chartContainer: {
    height: 220,
    flexDirection: "row",
  },
});

const DeterministicTab: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { input, setInput, result, setResult, loading, setLoading } = useProjectionStore();
  const { baseline, setBaseline } = useDeterministicBaseline();

  const [age, setAge] = useState(input?.age ?? 30);
  const [retireAge, setRetireAge] = useState(input?.retireAge ?? 65);
  const [balance, setBalance] = useState(input?.balance ?? 50000);
  const [contribution, setContribution] = useState(input?.contribution ?? 10000);
  const [rate, setRate] = useState(input?.rate ?? 7);
  const [inflation, setInflation] = useState(input?.inflation ?? 2.5);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  useEffect(() => {
    setInput({ age, retireAge, balance, contribution, rate, inflation });
  }, [age, retireAge, balance, contribution, rate, inflation, setInput]);

  const handleCalculate = () => {
    if (age >= retireAge) {
      setError("Current age must be less than retirement age");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const years = retireAge - age;
      const calculationResult = simulateDeterministic({
        initialBalance: balance,
        annualContribution: contribution,
        years,
        annualReturn: rate / 100,
        inflation: inflation / 100,
      });
      setResult(calculationResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Calculation failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsBaseline = () => {
    setBaseline({ age, retireAge, balance, contribution, rate });
    setSnackbar({ visible: true, message: '✓ Saved as baseline' });
  };

  const handleOpenInWhatIf = () => {
    setBaseline({ age, retireAge, balance, contribution, rate });
    setSnackbar({ visible: true, message: '✓ Opening in What-If...' });
    // Navigate to What-If tab using the bottom tab navigator
    (navigation as any).jumpTo('WhatIf');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={styles.content}
      >
      <Card style={styles.card}>
        <Card.Title 
          title="401(k) Calculator" 
          subtitle="Deterministic projection"
        />
        <Card.Content>
          {/* Age Input */}
          <View style={styles.inputSpacing}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text variant="bodyMedium" style={{ fontWeight: '500' }}>Current Age</Text>
              <HelpIcon topicId="deterministic_age" />
            </View>
            <TextInput
              label="Age"
              value={age.toString()}
              keyboardType="numeric"
              onChangeText={value => setAge(Number(value || 0))}
              mode="outlined"
              outlineColor={theme.colors.secondary}
              activeOutlineColor={theme.colors.primary}
            />
          </View>

          {/* Retirement Age Input */}
          <View style={styles.inputSpacing}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text variant="bodyMedium" style={{ fontWeight: '500' }}>Retirement Age</Text>
              <HelpIcon topicId="deterministic_retirement_age" />
            </View>
            <TextInput
              label="Retirement Age"
              value={retireAge.toString()}
              keyboardType="numeric"
              onChangeText={value => setRetireAge(Number(value || 0))}
              mode="outlined"
              outlineColor={theme.colors.secondary}
              activeOutlineColor={theme.colors.primary}
            />
          </View>

          {/* Balance Input */}
          <View style={styles.inputSpacing}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text variant="bodyMedium" style={{ fontWeight: '500' }}>Current Balance</Text>
              <HelpIcon topicId="deterministic_current_balance" />
            </View>
            <TextInput
              label="Current Balance ($)"
              value={balance.toString()}
              keyboardType="numeric"
              onChangeText={value => setBalance(Number(value || 0))}
              mode="outlined"
              outlineColor={theme.colors.secondary}
              activeOutlineColor={theme.colors.primary}
            />
          </View>

          {/* Contribution Slider - 2025 Limits with Color Coding */}
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text variant="bodyMedium" style={{ fontWeight: '500' }}>Annual Contribution: ${(contribution / 1000).toFixed(1)}k</Text>
                <View style={{
                  backgroundColor: contribution <= 23500 ? '#69B47A' : age >= 50 && contribution <= 30500 ? '#FFB74D' : contribution > 30500 || (age < 50 && contribution > 23500) ? '#FF6B6B' : '#69B47A',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>
                    {contribution <= 23500 ? '2025 Limit' : age >= 50 && contribution <= 30500 ? 'Catch-up' : 'Over Limit'}
                  </Text>
                </View>
              </View>
              <HelpIcon topicId="deterministic_annual_contribution" />
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={age >= 50 ? 30500 : 23500}
              step={500}
              value={contribution}
              onValueChange={setContribution}
              minimumTrackTintColor="#69B47A"
              maximumTrackTintColor="#E0E0E0"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
              <Text style={{ fontSize: 10, color: '#999' }}>$0</Text>
              <Text style={{ fontSize: 10, color: '#999' }}>$23.5k (2025)</Text>
              {age >= 50 && <Text style={{ fontSize: 10, color: '#999' }}>$30.5k (50+)</Text>}
            </View>
          </View>

          {/* Return Rate Slider - Color Coded */}
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text variant="bodyMedium" style={{ fontWeight: '500' }}>Expected Return: {rate.toFixed(1)}%</Text>
                <View style={{
                  backgroundColor: rate < 5 ? '#FF6B6B' : rate <= 8 ? '#FFB74D' : '#69B47A',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>
                    {rate < 5 ? 'Low' : rate <= 8 ? 'Average' : 'High'}
                  </Text>
                </View>
              </View>
              <HelpIcon topicId="deterministic_expected_return" />
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={15}
              step={0.5}
              value={rate}
              onValueChange={setRate}
              minimumTrackTintColor={rate < 5 ? '#FF6B6B' : rate <= 8 ? '#FFB74D' : '#69B47A'}
              maximumTrackTintColor="#E0E0E0"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
              <Text style={{ fontSize: 10, color: '#999' }}>0%</Text>
              <Text style={{ fontSize: 10, color: '#999' }}>5% (Low)</Text>
              <Text style={{ fontSize: 10, color: '#999' }}>8% (Avg)</Text>
              <Text style={{ fontSize: 10, color: '#999' }}>15%</Text>
            </View>
          </View>

          {/* Inflation Slider - Color Coded */}
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text variant="bodyMedium" style={{ fontWeight: '500' }}>Inflation: {inflation.toFixed(1)}%</Text>
                <View style={{
                  backgroundColor: inflation < 2 ? '#69B47A' : inflation <= 4 ? '#FFB74D' : '#FF6B6B',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>
                    {inflation < 2 ? 'Good' : inflation <= 4 ? 'Normal' : 'High'}
                  </Text>
                </View>
              </View>
              <HelpIcon topicId="deterministic_inflation" />
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={6}
              step={0.1}
              value={inflation}
              onValueChange={setInflation}
              minimumTrackTintColor={inflation < 2 ? '#69B47A' : inflation <= 4 ? '#FFB74D' : '#FF6B6B'}
              maximumTrackTintColor="#E0E0E0"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
              <Text style={{ fontSize: 10, color: '#999' }}>0%</Text>
              <Text style={{ fontSize: 10, color: '#999' }}>2% (Good)</Text>
              <Text style={{ fontSize: 10, color: '#999' }}>4% (Normal)</Text>
              <Text style={{ fontSize: 10, color: '#999' }}>6%</Text>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleCalculate}
            loading={loading}
            disabled={loading}
          >
            Calculate
          </Button>

          {result && (
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <Button
                mode="outlined"
                onPress={handleSaveAsBaseline}
                style={{ flex: 1 }}
                icon="content-save"
              >
                Save
              </Button>
              <Button
                mode="contained"
                onPress={handleOpenInWhatIf}
                style={{ flex: 1 }}
                icon="arrow-right"
              >
                What-If
              </Button>
            </View>
          )}

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </Card.Content>
      </Card>

      {result && (
        <Card style={styles.card}>
          <Card.Title title="Deterministic Projection" />
          <Card.Content>
            <View style={styles.chartContainer}>
              <YAxis
                data={result.nominalBalances}
                contentInset={{ top: 20, bottom: 20 }}
                svg={chartAxisTextStyle}
                numberOfTicks={6}
                formatLabel={formatYAxisLabel}
              />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <LineChart
                  style={{ flex: 1 }}
                  data={result.nominalBalances}
                  svg={deterministicStrokeStyle}
                  contentInset={{ top: 20, bottom: 20 }}
                >
                  <Grid />
                </LineChart>
                <XAxis
                  style={{ marginTop: 8 }}
                  data={result.nominalBalances}
                  scale={scale.scaleLinear}
                  formatLabel={formatXAxisLabel}
                  contentInset={{ left: 10, right: 10 }}
                  svg={chartAxisTextStyle}
                />
              </View>
            </View>
            <View style={styles.finalResultCard}>
              <Text style={styles.finalResultTitle}>Final Balance at Retirement</Text>
              <Text style={styles.finalResultValue}>
                {formatCurrency(result.nominalBalances.at(-1))}
              </Text>
              <Text style={styles.realBalanceText}>Inflation-Adjusted (Real Value):</Text>
              <Text style={styles.realBalanceValue}>
                {formatCurrency((result.nominalBalances.at(-1) || 0) / Math.pow(1 + inflation / 100, retireAge - age))}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}
      </ScrollView>
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={2000}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
};

export default DeterministicTab;
