import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  Switch,
  Text,
  TextInput,
  Chip,
  useTheme,
} from "react-native-paper";
import { simulateDeterministic, useProjectionStore } from "@projection/core";
import {
  MonteCarloInput,
  MonteCarloResponse,
  DEFAULT_MONTE_CARLO_INPUT,
  transformMonteCarloData,
  getRiskLevel,
  getHelpTopic,
  type RiskLevel,
  type RiskProfile,
} from "@projection/shared";
import { PercentileChart, ProbabilityCard, RiskProfilePicker, HelpIcon, UpgradeBanner } from "../components";
import { useTier, useFeatureLimit } from "../contexts/TierContext";
import { API_BASE_URL } from "../config";

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

const MonteCarloTab: React.FC = () => {
  const theme = useTheme();
  const { input, setInput } = useProjectionStore();
  const { features, canAccessFeature } = useTier();
  const maxSimulations: number = useFeatureLimit('maxSimulations');
  const hasFullAccess = canAccessFeature('monteCarloFullAccess');

  // Basic parameters (synced with store)
  const [age, setAge] = useState(input?.age ?? 30);
  const [retireAge, setRetireAge] = useState(input?.retireAge ?? 65);
  const [balance, setBalance] = useState(input?.balance ?? 50000);
  const [contribution, setContribution] = useState(input?.contribution ?? 10000);

  // Monte Carlo specific parameters
  const [mcInput, setMcInput] = useState<MonteCarloInput>({
    ...DEFAULT_MONTE_CARLO_INPUT,
    current_age: age,
    retire_age: retireAge,
    current_balance: balance,
    annual_contrib: contribution,
  });

  // Results and UI state
  const [mcResult, setMcResult] = useState<MonteCarloResponse | null>(null);
  const [mcLoading, setMcLoading] = useState(false);
  const [mcError, setMcError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sync basic parameters with Monte Carlo input
  useEffect(() => {
    setMcInput((prev) => ({
      ...prev,
      current_age: age,
      retire_age: retireAge,
      current_balance: balance,
      annual_contrib: contribution,
    }));
  }, [age, retireAge, balance, contribution]);

  // Sync with store
  useEffect(() => {
    setInput({
      age,
      retireAge,
      balance,
      contribution,
      rate: (mcInput.expected_return ?? 0.07) * 100,
      inflation: 0,
    });
  }, [age, retireAge, balance, contribution, mcInput.expected_return, setInput]);

  const handleRiskProfileChange = (level: RiskLevel, profile: RiskProfile) => {
    setMcInput((prev) => ({
      ...prev,
      expected_return: profile.expectedReturn,
      return_volatility: profile.returnVolatility,
    }));
  };

  const handleMonteCarloCalculate = async () => {
    setMcError(null);
    setMcLoading(true);
    try {
      // Apply tier restrictions
      const defaultSims = DEFAULT_MONTE_CARLO_INPUT.n_paths;
      const requestedSims = mcInput.n_paths;
      const requestedSimulations = (requestedSims !== undefined ? requestedSims : defaultSims) as number;
      const tierLimit = (maxSimulations > 0 ? maxSimulations : 10000) as number;
      const simulationCount = Math.min(requestedSimulations, tierLimit);

      const payload: MonteCarloInput = {
        ...mcInput,
        n_paths: simulationCount, // Limit based on tier
        expected_return: mcInput.expected_return ?? DEFAULT_MONTE_CARLO_INPUT.expected_return,
        return_volatility: mcInput.return_volatility ?? DEFAULT_MONTE_CARLO_INPUT.return_volatility,
        fees_annual: mcInput.fees_annual ?? 0,
        glidepath: mcInput.glidepath ?? false,
        inflation: mcInput.inflation ?? DEFAULT_MONTE_CARLO_INPUT.inflation,
        salary_growth: mcInput.salary_growth ?? DEFAULT_MONTE_CARLO_INPUT.salary_growth,
        employer_match_rate: mcInput.employer_match_rate ?? 0,
        rebalance_annually: mcInput.rebalance_annually ?? true,
      };
      console.log('Monte Carlo Request:', { url: `${API_BASE_URL}/monte-carlo`, payload, maxSimulations: tierLimit });
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

  // Transform Monte Carlo result for chart
  const chartData = useMemo(() => {
    if (!mcResult) return [];
    return transformMonteCarloData(mcResult, mcInput.current_age);
  }, [mcResult, mcInput.current_age]);

  // Determine current risk level
  const currentRiskLevel = useMemo(() => {
    return getRiskLevel(mcInput.return_volatility ?? 0.15);
  }, [mcInput.return_volatility]);

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Tier Upgrade Banner for Free Users */}
      {!hasFullAccess && (
        <View style={{gap: 8}}>
          <UpgradeBanner
            feature="Full Monte Carlo Analysis"
            requiredTier="PRO"
            icon="chart-line"
            compact
          />
          <Card style={{backgroundColor: '#E8F5E9', borderRadius: 8}}>
            <Card.Content style={{paddingVertical: 8}}>
              <Text variant="bodySmall" style={{color: '#2E7D32'}}>
                💡 Preview with 1,000 simulations available. Upgrade to PRO for 50,000 simulations and advanced analysis.
              </Text>
            </Card.Content>
          </Card>
        </View>
      )}

      {/* Basic Parameters */}
      <Card>
        <Card.Title title="Basic Parameters" subtitle="Your retirement plan details" />
        <Card.Content>
          <View style={styles.inputWithHelp}>
            <TextInput
              label="Current Age"
              value={age.toString()}
              keyboardType="numeric"
              onChangeText={(value) => setAge(Number(value || 0))}
              style={[styles.inputSpacing, styles.flexInput]}
              mode="outlined"
              editable={hasFullAccess}
            />
            <HelpIcon topicId="compoundGrowth" helpTopic={getHelpTopic('compoundGrowth')} />
          </View>
          <View style={styles.inputWithHelp}>
            <TextInput
              label="Retirement Age"
              value={retireAge.toString()}
              keyboardType="numeric"
              onChangeText={(value) => setRetireAge(Number(value || 0))}
              style={[styles.inputSpacing, styles.flexInput]}
              mode="outlined"
              editable={hasFullAccess}
            />
            <HelpIcon topicId="fullRetirementAge" helpTopic={getHelpTopic('fullRetirementAge')} />
          </View>
          <View style={styles.inputWithHelp}>
            <TextInput
              label="Current Balance ($)"
              value={balance.toString()}
              keyboardType="numeric"
              onChangeText={(value) => setBalance(Number(value || 0))}
              style={[styles.inputSpacing, styles.flexInput]}
              mode="outlined"
              editable={hasFullAccess}
            />
            <HelpIcon topicId="compoundGrowth" helpTopic={getHelpTopic('compoundGrowth')} />
          </View>
          <View style={styles.inputWithHelp}>
            <TextInput
              label="Annual Contribution ($)"
              value={contribution.toString()}
              keyboardType="numeric"
              onChangeText={(value) => setContribution(Number(value || 0))}
              style={[styles.inputSpacing, styles.flexInput]}
              mode="outlined"
              editable={hasFullAccess}
            />
            <HelpIcon topicId="savingsRate" helpTopic={getHelpTopic('savingsRate')} />
          </View>
        </Card.Content>
      </Card>

      {/* Risk Profile Picker */}
      <Card style={styles.cardSpacing}>
        <Card.Title 
          title="Risk Profile"
          subtitle="Choose your investment strategy"
          right={() => <HelpIcon topicId="riskProfile" helpTopic={getHelpTopic('riskProfile')} />}
        />
        <Card.Content>
          <RiskProfilePicker
            currentLevel={currentRiskLevel}
            onSelect={handleRiskProfileChange}
          />
        </Card.Content>
      </Card>

      {/* Advanced Parameters */}
      <Card style={styles.cardSpacing}>
        <Card.Title
          title="Advanced Parameters"
          subtitle={showAdvanced ? "Hide details" : "Show details"}
          right={(props) => (
            <Button
              {...props}
              onPress={() => setShowAdvanced(!showAdvanced)}
              mode="text"
            >
              {showAdvanced ? "Hide" : "Show"}
            </Button>
          )}
        />
        {showAdvanced && (
          <Card.Content>
            <View style={styles.inputWithHelp}>
              <TextInput
                label="Expected Return (%)"
                value={((mcInput.expected_return ?? 0) * 100).toString()}
                keyboardType="numeric"
                onChangeText={(value) =>
                  setMcInput((prev) => ({
                    ...prev,
                    expected_return: Number(value || 0) / 100,
                  }))
                }
                style={[styles.inputSpacing, styles.flexInput]}
                mode="outlined"
              />
              <HelpIcon topicId="expectedReturn" helpTopic={getHelpTopic('expectedReturn')} />
            </View>
            <View style={styles.inputWithHelp}>
              <TextInput
                label="Return Volatility (%)"
                value={((mcInput.return_volatility ?? 0) * 100).toString()}
                keyboardType="numeric"
                onChangeText={(value) =>
                  setMcInput((prev) => ({
                    ...prev,
                    return_volatility: Number(value || 0) / 100,
                  }))
                }
                style={[styles.inputSpacing, styles.flexInput]}
                mode="outlined"
              />
              <HelpIcon topicId="volatility" helpTopic={getHelpTopic('volatility')} />
            </View>
            <View style={styles.inputWithHelp}>
              <TextInput
                label="Inflation (%)"
                value={((mcInput.inflation ?? 0) * 100).toString()}
                keyboardType="numeric"
                onChangeText={(value) =>
                  setMcInput((prev) => ({
                    ...prev,
                    inflation: Number(value || 0) / 100,
                  }))
                }
                style={[styles.inputSpacing, styles.flexInput]}
                mode="outlined"
              />
              <HelpIcon topicId="inflation" helpTopic={getHelpTopic('inflation')} />
            </View>
            <View style={styles.inputWithHelp}>
              <TextInput
                label="Salary Growth (%)"
                value={((mcInput.salary_growth ?? 0) * 100).toString()}
                keyboardType="numeric"
                onChangeText={(value) =>
                  setMcInput((prev) => ({
                    ...prev,
                    salary_growth: Number(value || 0) / 100,
                  }))
                }
                style={[styles.inputSpacing, styles.flexInput]}
                mode="outlined"
              />
              <HelpIcon topicId="savingsRate" helpTopic={getHelpTopic('savingsRate')} />
            </View>
            <View style={styles.inputWithHelp}>
              <TextInput
                label="Employer Match Rate (%)"
                value={((mcInput.employer_match_rate ?? 0) * 100).toString()}
                keyboardType="numeric"
                onChangeText={(value) =>
                  setMcInput((prev) => ({
                    ...prev,
                    employer_match_rate: Number(value || 0) / 100,
                  }))
                }
                style={[styles.inputSpacing, styles.flexInput]}
                mode="outlined"
              />
              <HelpIcon topicId="savingsRate" helpTopic={getHelpTopic('savingsRate')} />
            </View>
            <View style={styles.inputWithHelp}>
              <TextInput
                label="Annual Fees (%)"
                value={((mcInput.fees_annual ?? 0) * 100).toString()}
                keyboardType="numeric"
                onChangeText={(value) =>
                  setMcInput((prev) => ({
                    ...prev,
                    fees_annual: Number(value || 0) / 100,
                  }))
                }
                style={[styles.inputSpacing, styles.flexInput]}
                mode="outlined"
              />
              <HelpIcon topicId="compoundGrowth" helpTopic={getHelpTopic('compoundGrowth')} />
            </View>
            <View style={styles.inputWithHelp}>
              <TextInput
                label={`Number of Simulations (max: ${maxSimulations.toLocaleString()})`}
                value={(mcInput.n_paths ?? 10000).toString()}
                keyboardType="numeric"
                onChangeText={(value) =>
                  setMcInput((prev) => ({
                    ...prev,
                    n_paths: Math.min(Number(value || 10000), maxSimulations),
                  }))
                }
                style={[styles.inputSpacing, styles.flexInput]}
                mode="outlined"
                right={
                  !hasFullAccess ? (
                    <TextInput.Affix text={`⚠️ Free: ${maxSimulations} max`} />
                  ) : undefined
                }
              />
              <HelpIcon topicId="monteCarlo" helpTopic={getHelpTopic('monteCarlo')} />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Glidepath (Reduce risk over time)</Text>
              <HelpIcon topicId="glidepath" helpTopic={getHelpTopic('glidepath')} size={20} />
              <Switch
                value={!!mcInput.glidepath}
                onValueChange={(value) =>
                  setMcInput((prev) => ({
                    ...prev,
                    glidepath: value,
                  }))
                }
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Rebalance Annually</Text>
              <HelpIcon topicId="riskProfile" helpTopic={getHelpTopic('riskProfile')} size={20} />
              <Switch
                value={!!mcInput.rebalance_annually}
                onValueChange={(value) =>
                  setMcInput((prev) => ({
                    ...prev,
                    rebalance_annually: value,
                  }))
                }
              />
            </View>
          </Card.Content>
        )}
      </Card>

      {/* Target Goal (Optional) */}
      <Card style={styles.cardSpacing}>
        <Card.Title
          title="Retirement Goal (Optional)"
          subtitle="Set a target to calculate success probability"
          right={() => <HelpIcon topicId="successProbability" helpTopic={getHelpTopic('successProbability')} />}
        />
        <Card.Content>
          <View style={styles.inputWithHelp}>
            <TextInput
              label="Annual Retirement Spending ($)"
              value={mcInput.target_goal?.retirement_spend?.toString() || ""}
              keyboardType="numeric"
              onChangeText={(value) =>
                setMcInput((prev) => ({
                  ...prev,
                  target_goal: {
                    ...prev.target_goal,
                    retirement_spend: Number(value || 0),
                  },
                }))
              }
              style={[styles.inputSpacing, styles.flexInput]}
              mode="outlined"
              placeholder="e.g., 60000"
            />
            <HelpIcon topicId="realReturn" helpTopic={getHelpTopic('realReturn')} />
          </View>
          <View style={styles.inputWithHelp}>
            <TextInput
              label="Retirement Horizon (Years)"
              value={mcInput.target_goal?.horizon_years?.toString() || ""}
              keyboardType="numeric"
              onChangeText={(value) =>
                setMcInput((prev) => ({
                  ...prev,
                  target_goal: {
                    ...prev.target_goal,
                    horizon_years: Number(value || 0),
                  },
                }))
              }
              style={[styles.inputSpacing, styles.flexInput]}
              mode="outlined"
              placeholder="e.g., 30"
            />
            <HelpIcon topicId="compoundGrowth" helpTopic={getHelpTopic('compoundGrowth')} />
          </View>
        </Card.Content>
      </Card>

      {/* Run Simulation Button */}
      <Button
        mode="contained"
        onPress={handleMonteCarloCalculate}
        loading={mcLoading}
        disabled={mcLoading}
        style={styles.runButton}
        icon="chart-line"
      >
        {hasFullAccess ? "Run Monte Carlo Simulation" : "Preview (1,000 Simulations)"}
      </Button>

      {/* Loading Indicator */}
      {mcLoading && (
        <Card style={styles.cardSpacing}>
          <Card.Content style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text variant="bodyMedium" style={styles.loadingText}>
              Running {mcInput.n_paths?.toLocaleString()} simulations...
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Error Display */}
      {mcError && (
        <Card style={[styles.cardSpacing, styles.errorCard]}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.errorTitle}>
              ⚠️ Simulation Error
            </Text>
            <Text variant="bodySmall" style={styles.errorText}>
              {mcError}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Results - Percentile Chart */}
      {chartData.length > 0 && (
        <View style={styles.resultsContainer}>
          <Card style={styles.cardSpacing}>
            <Card.Title 
              title="Retirement Savings Projection"
              right={() => <HelpIcon topicId="percentiles" helpTopic={getHelpTopic('percentiles')} />}
            />
            <Card.Content>
              <PercentileChart
                data={chartData}
                width={screenWidth - 64}
                height={320}
              />
            </Card.Content>
          </Card>

          {/* Probability Card */}
          <ProbabilityCard
            probability={mcResult?.success_probability}
            targetGoal={mcInput.target_goal}
          />

          {/* Summary Stats */}
          <Card style={styles.cardSpacing}>
            <Card.Title 
              title="Final Balance Statistics"
              right={() => <HelpIcon topicId="realReturn" helpTopic={getHelpTopic('realReturn')} />}
            />
            <Card.Content>
              <View style={styles.statRow}>
                <Text variant="bodyMedium">Mean (Nominal):</Text>
                <Text variant="bodyMedium" style={styles.statValue}>
                  ${mcResult?.final_balances_nominal.mean.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text variant="bodyMedium">Mean (Real):</Text>
                <Text variant="bodyMedium" style={styles.statValue}>
                  ${mcResult?.final_balances_real.mean.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Standard Deviation:
                </Text>
                <Text variant="bodySmall" style={styles.statValue}>
                  ${mcResult?.final_balances_real.std.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Simulations Run:
                </Text>
                <Text variant="bodySmall" style={styles.statValue}>
                  {mcInput.n_paths?.toLocaleString()}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Risk Level Indicator */}
          <Card style={styles.cardSpacing}>
            <Card.Content>
              <View style={styles.riskLevelContainer}>
                <Text variant="titleSmall">Current Risk Level:</Text>
                <Chip
                  mode="flat"
                  style={styles.riskChip}
                  textStyle={styles.riskChipText}
                >
                  {currentRiskLevel.toUpperCase()}
                </Chip>
              </View>
              <Text variant="bodySmall" style={styles.riskDescription}>
                Based on {((mcInput.return_volatility ?? 0) * 100).toFixed(1)}% volatility
              </Text>
            </Card.Content>
          </Card>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  cardSpacing: {
    marginTop: 16,
  },
  inputSpacing: {
    marginBottom: 12,
  },
  inputWithHelp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flexInput: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  switchLabel: {
    flex: 1,
    fontSize: 14,
  },
  runButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    marginTop: 12,
  },
  errorCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#c62828',
  },
  errorTitle: {
    color: '#c62828',
    marginBottom: 8,
  },
  errorText: {
    color: '#666',
    lineHeight: 20,
  },
  resultsContainer: {
    marginTop: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    color: '#666',
  },
  statValue: {
    fontWeight: '600',
  },
  riskLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  riskChip: {
    height: 28,
  },
  riskChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  riskDescription: {
    color: '#666',
    fontSize: 12,
  },
});

export default MonteCarloTab;
