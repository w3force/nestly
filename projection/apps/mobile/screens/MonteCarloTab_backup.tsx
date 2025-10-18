import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";
import { LineChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
import * as scale from "d3-scale";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";
import { simulateDeterministic, useProjectionStore } from "@projection/core";
import type { MonteCarloInput, MonteCarloResponse } from "@projection/api-client";
import { API_BASE_URL } from "../config";

const styles = StyleSheet.create({
  inputSpacing: {
    marginBottom: 12,
  },
  resultText: {
    marginTop: 16,
    fontWeight: '700',
    color: "#30403A",
  },
  errorText: {
    marginTop: 12,
    color: "#c62828",
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    flex: 1,
    color: "#30403A",
  },
  successText: {
    color: "#30403A",
  },
  medianText: {
    marginTop: 4,
    color: "#30403A",
  },
});

// SVG-specific styles (not in StyleSheet)
const chartAxisTextStyle = { fontSize: 10, fill: "rgba(48, 64, 58, 0.8)" };
const deterministicStrokeStyle = { stroke: "#69B47A", strokeWidth: 2 };

const defaultMonteCarloInput: MonteCarloInput = {
  current_age: 30,
  retire_age: 65,
  current_balance: 50000,
  annual_contrib: 10000,
  employer_match_rate: 0,
  expected_return: 0.07,
  return_volatility: 0.15,
  inflation: 0.02,
  salary_growth: 0.03,
  n_paths: 5000,
  seed: 42,
  fees_annual: 0.005,
  glidepath: false,
  rebalance_annually: true,
  target_goal: undefined,
};

async function runMonteCarlo(input: MonteCarloInput): Promise<MonteCarloResponse> {
  const response = await fetch(`${API_BASE_URL}/monte-carlo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Monte Carlo request failed");
  }

  return response.json() as Promise<MonteCarloResponse>;
}

const inputSpacing = { marginBottom: 12 };

function formatCurrency(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  return `$${Math.round(value).toLocaleString()}`;
}

const CalculatorScreen: React.FC = () => {
  const { input, setInput, result, setResult, loading, setLoading } = useProjectionStore();

  const [age, setAge] = useState(input?.age ?? 30);
  const [retireAge, setRetireAge] = useState(input?.retireAge ?? 65);
  const [balance, setBalance] = useState(input?.balance ?? 50000);
  const [contribution, setContribution] = useState(input?.contribution ?? 10000);
  const [rate, setRate] = useState(input?.rate ?? 7);

  const [mcInput, setMcInput] = useState<MonteCarloInput>({
    ...defaultMonteCarloInput,
    current_age: input?.age ?? defaultMonteCarloInput.current_age,
    retire_age: input?.retireAge ?? defaultMonteCarloInput.retire_age,
    current_balance: input?.balance ?? defaultMonteCarloInput.current_balance,
    annual_contrib: input?.contribution ?? defaultMonteCarloInput.annual_contrib,
  });
  const [mcResult, setMcResult] = useState<MonteCarloResponse | null>(null);
  const [mcLoading, setMcLoading] = useState(false);
  const [mcError, setMcError] = useState<string | null>(null);

  useEffect(() => {
    setMcInput((prev: MonteCarloInput) => ({
      ...prev,
      current_age: age,
      retire_age: retireAge,
      current_balance: balance,
      annual_contrib: contribution,
    }));
  }, [age, retireAge, balance, contribution]);

  useEffect(() => {
    setMcInput((prev: MonteCarloInput) => ({
      ...prev,
      expected_return: rate / 100,
    }));
  }, [rate]);

  const handleCalculate = () => {
    setLoading(true);
    const years = retireAge - age;
    const deterministicInput = {
      age,
      retireAge,
      balance,
      contribution,
      rate,
      inflation: 0,
    };
    setInput(deterministicInput);
    const projection = simulateDeterministic({
      initialBalance: balance,
      annualContribution: contribution,
      years,
      annualReturn: rate / 100,
      inflation: 0,
    });
    setResult(projection);
    setLoading(false);
  };

  const handleMonteCarloCalculate = async () => {
    setMcError(null);
    setMcLoading(true);
    try {
      const payload: MonteCarloInput = {
        ...mcInput,
        expected_return: (mcInput.expected_return ?? defaultMonteCarloInput.expected_return),
        return_volatility: mcInput.return_volatility ?? defaultMonteCarloInput.return_volatility,
        fees_annual: mcInput.fees_annual ?? 0,
        n_paths: mcInput.n_paths ?? defaultMonteCarloInput.n_paths,
        glidepath: mcInput.glidepath ?? false,
        inflation: mcInput.inflation ?? defaultMonteCarloInput.inflation,
        salary_growth: mcInput.salary_growth ?? defaultMonteCarloInput.salary_growth,
        employer_match_rate: mcInput.employer_match_rate ?? 0,
        rebalance_annually: mcInput.rebalance_annually ?? true,
      };
      console.log('Monte Carlo Request:', { url: `${API_BASE_URL}/monte-carlo`, payload });
      const response = await runMonteCarlo(payload);
      console.log('Monte Carlo Response:', response);
      setMcResult(response);
    } catch (error) {
      console.error('Monte Carlo Error:', error);
      const errorMessage = error instanceof Error ? error.message : "Monte Carlo failed";
      setMcError(`${errorMessage}\n\nAPI URL: ${API_BASE_URL}/monte-carlo\n\nTip: If testing on a physical device, change localhost to your computer's IP address in apps/mobile/config.ts`);
    } finally {
      setMcLoading(false);
    }
  };

  const medianPoints = useMemo(() => {
    const percentiles = mcResult?.percentiles as Record<string, unknown> | undefined;
    const rawMedian = percentiles?.["p50"];
    if (!Array.isArray(rawMedian)) {
      return [];
    }
    return rawMedian
      .filter((value): value is number => typeof value === "number" && !Number.isNaN(value))
      .map((value, index) => ({ x: mcInput.current_age + index, y: value }));
  }, [mcResult, mcInput.current_age]);

  const finalMedian = useMemo(() => {
    const percentiles = mcResult?.percentiles as Record<string, unknown> | undefined;
    const rawMedian = percentiles?.["p50"];
    if (!Array.isArray(rawMedian) || rawMedian.length === 0) {
      return undefined;
    }
    const last = rawMedian[rawMedian.length - 1];
    return typeof last === "number" && !Number.isNaN(last) ? last : undefined;
  }, [mcResult]);

  const formatYAxisLabel = (value: number) => `$${Math.round(value)}`;
  const formatXAxisLabel = (_value: number, index: number) =>
    index % 5 === 0 ? String(age + index) : "";

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Card>
        <Card.Title title="401(k) Calculator" subtitle="Deterministic projection" />
        <Card.Content>
          <TextInput
            label="Current Age"
            value={age.toString()}
            keyboardType="numeric"
            onChangeText={value => setAge(Number(value || 0))}
            style={styles.inputSpacing}
            mode="outlined"
            outlineColor="#4ABDAC"
            activeOutlineColor="#69B47A"
          />
          <TextInput
            label="Retirement Age"
            value={retireAge.toString()}
            keyboardType="numeric"
            onChangeText={value => setRetireAge(Number(value || 0))}
            style={styles.inputSpacing}
            mode="outlined"
            outlineColor="#4ABDAC"
            activeOutlineColor="#69B47A"
          />
          <TextInput
            label="Current Balance ($)"
            value={balance.toString()}
            keyboardType="numeric"
            onChangeText={value => setBalance(Number(value || 0))}
            style={styles.inputSpacing}
            mode="outlined"
            outlineColor="#4ABDAC"
            activeOutlineColor="#69B47A"
          />
          <TextInput
            label="Annual Contribution ($)"
            value={contribution.toString()}
            keyboardType="numeric"
            onChangeText={value => setContribution(Number(value || 0))}
            style={styles.inputSpacing}
            mode="outlined"
            outlineColor="#4ABDAC"
            activeOutlineColor="#69B47A"
          />
          <TextInput
            label="Expected Return (%)"
            value={rate.toString()}
            keyboardType="numeric"
            onChangeText={value => setRate(Number(value || 0))}
            style={styles.inputSpacing}
            mode="outlined"
            outlineColor="#4ABDAC"
            activeOutlineColor="#69B47A"
          />
          <Button mode="contained" onPress={handleCalculate} loading={loading} disabled={loading}>
            Calculate
          </Button>
        </Card.Content>
      </Card>

      {result && (
        <Card>
          <Card.Title title="Deterministic Projection" />
          <Card.Content>
            <View style={{ height: 220, flexDirection: "row" }}>
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
            <Text style={styles.resultText}>
              Final Balance: {formatCurrency(result.nominalBalances.at(-1))}
            </Text>
          </Card.Content>
        </Card>
      )}

      <Card>
        <Card.Title title="Monte Carlo" subtitle="Simulated percentile outcomes" />
        <Card.Content>
          <TextInput
            label="Return Volatility (%)"
            value={((mcInput.return_volatility ?? 0) * 100).toString()}
            keyboardType="numeric"
            onChangeText={value =>
              setMcInput((prev: MonteCarloInput) => ({
                ...prev,
                return_volatility: Number(value || 0) / 100,
              }))
            }
            style={styles.inputSpacing}
            mode="outlined"
            outlineColor="#4ABDAC"
            activeOutlineColor="#69B47A"
          />
          <TextInput
            label="Inflation (%)"
            value={((mcInput.inflation ?? 0) * 100).toString()}
            keyboardType="numeric"
            onChangeText={value =>
              setMcInput((prev: MonteCarloInput) => ({
                ...prev,
                inflation: Number(value || 0) / 100,
              }))
            }
            style={styles.inputSpacing}
            mode="outlined"
            outlineColor="#4ABDAC"
            activeOutlineColor="#69B47A"
          />
          <TextInput
            label="Salary Growth (%)"
            value={((mcInput.salary_growth ?? 0) * 100).toString()}
            keyboardType="numeric"
            onChangeText={value =>
              setMcInput((prev: MonteCarloInput) => ({
                ...prev,
                salary_growth: Number(value || 0) / 100,
              }))
            }
            style={styles.inputSpacing}
            mode="outlined"
            outlineColor="#4ABDAC"
            activeOutlineColor="#69B47A"
          />
          <TextInput
            label="Employer Match Rate (%)"
            value={((mcInput.employer_match_rate ?? 0) * 100).toString()}
            keyboardType="numeric"
            onChangeText={value =>
              setMcInput((prev: MonteCarloInput) => ({
                ...prev,
                employer_match_rate: Number(value || 0) / 100,
              }))
            }
            style={styles.inputSpacing}
            mode="outlined"
            outlineColor="#4ABDAC"
            activeOutlineColor="#69B47A"
          />
          <TextInput
            label="# Paths"
            value={(mcInput.n_paths ?? 0).toString()}
            keyboardType="numeric"
            onChangeText={value =>
              setMcInput((prev: MonteCarloInput) => ({
                ...prev,
                n_paths: Number(value || 0),
              }))
            }
            style={styles.inputSpacing}
            mode="outlined"
            outlineColor="#4ABDAC"
            activeOutlineColor="#69B47A"
          />
          <TextInput
            label="Annual Fee (%)"
            value={((mcInput.fees_annual ?? 0) * 100).toString()}
            keyboardType="numeric"
            onChangeText={value =>
              setMcInput((prev: MonteCarloInput) => ({
                ...prev,
                fees_annual: Number(value || 0) / 100,
              }))
            }
            style={styles.inputSpacing}
            mode="outlined"
            outlineColor="#4ABDAC"
            activeOutlineColor="#69B47A"
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Glidepath</Text>
            <Switch
              value={!!mcInput.glidepath}
              onValueChange={value =>
                setMcInput((prev: MonteCarloInput) => ({
                  ...prev,
                  glidepath: value,
                }))
              }
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Rebalance Annually</Text>
            <Switch
              value={!!mcInput.rebalance_annually}
              onValueChange={value =>
                setMcInput((prev: MonteCarloInput) => ({
                  ...prev,
                  rebalance_annually: value,
                }))
              }
            />
          </View>

          <Button
            mode="contained"
            onPress={handleMonteCarloCalculate}
            loading={mcLoading}
            disabled={mcLoading}
          >
            Run Monte Carlo
          </Button>

          {mcLoading && (
            <View style={{ marginTop: 16, alignItems: "center" }}>
              <ActivityIndicator />
            </View>
          )}

          {mcError && (
            <Text style={styles.errorText}>{mcError}</Text>
          )}

          {medianPoints.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <View style={{ height: 240 }}>
                <VictoryChart theme={VictoryTheme.material}>
                  <VictoryLine
                    data={medianPoints}
                    interpolation="natural"
                    style={{ data: { stroke: "#69B47A", strokeWidth: 3 } }}
                  />
                </VictoryChart>
              </View>
              <Divider style={{ marginVertical: 12 }} />
              <Text style={styles.successText}>
                Success Probability: {mcResult?.success_probability != null
                  ? `${(mcResult.success_probability * 100).toFixed(1)}%`
                  : "—"}
              </Text>
              <Text style={styles.medianText}>
                Final Median (p50) Balance: {formatCurrency(finalMedian)}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default CalculatorScreen;
