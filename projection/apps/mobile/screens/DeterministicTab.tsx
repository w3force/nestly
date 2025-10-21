import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import {
  Button,
  Card,
  Text,
  useTheme,
  Snackbar,
} from "react-native-paper";
import { LineChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
import * as scale from "d3-scale";
import { simulateDeterministic, useProjectionStore } from "@projection/core";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HelpIcon } from "../components";
import { useDeterministicBaseline } from "../contexts/DeterministicContext";
import { SliderWithInfo } from "../components/SliderWithInfo";
import { CompactInputField } from "../components/CompactInputField";
import { SectionHeader } from "../components/SectionHeader";
import { ResultsSummary } from "../components/ResultsSummary";
import {
  getFieldDefinition,
  getScreenDefinition,
  InputFieldDefinition,
  ScreenDefinition,
} from "@projection/shared";

const chartAxisTextStyle = { fontSize: 10, fill: "rgba(48, 64, 58, 0.8)" };
const deterministicStrokeStyle = { stroke: "#69B47A", strokeWidth: 2 };

const deterministicScreen: ScreenDefinition = getScreenDefinition("deterministic");

const HELP_TOPIC_MAP_MOBILE: Record<string, string> = {
  age_help: "deterministic_age",
  retirement_age_help: "deterministic_retirement_age",
  current_balance_help: "deterministic_current_balance",
  annual_contribution_help: "deterministic_annual_contribution",
  expected_return_help: "deterministic_expected_return",
  inflation_help: "deterministic_inflation",
};

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

type SliderMilestone = {
  value: number;
  label: string;
  description: string;
};

const MARKER_DOT_DIAMETER = 12;
const TOOLTIP_WIDTH = 180;
const TOOLTIP_HALF = TOOLTIP_WIDTH / 2;
const SLIDER_HEIGHT = 40;
const TRACK_CENTER_OFFSET = SLIDER_HEIGHT / 2 - 8; // closer alignment with track center
const TOOLTIP_BOTTOM_OFFSET = TRACK_CENTER_OFFSET + MARKER_DOT_DIAMETER / 2 - 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 8,
    paddingBottom: 120,
  },
  card: {
    marginBottom: 12,
  },
  inputSpacing: {
    marginBottom: 12,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  fieldWrapper: {
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
  sliderWithMarkers: {
    width: "100%",
    paddingTop: 40,
    paddingBottom: 24,
    position: "relative",
  },
  sliderBase: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: SLIDER_HEIGHT,
  },
  sliderMarkerOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  sliderMarkerItem: {
    position: "absolute",
    alignItems: "center",
    bottom: TRACK_CENTER_OFFSET + MARKER_DOT_DIAMETER / 2,
  },
  sliderMarkerDot: {
    width: MARKER_DOT_DIAMETER,
    height: MARKER_DOT_DIAMETER,
    borderRadius: MARKER_DOT_DIAMETER / 2,
    borderWidth: 2,
    borderColor: "rgba(105, 180, 122, 0.4)",
    backgroundColor: "#ffffff",
  },
  sliderMarkerDotActive: {
    borderColor: "#69B47A",
    backgroundColor: "rgba(105, 180, 122, 0.2)",
  },
  sliderMarkerTooltip: {
    position: "absolute",
    bottom: TOOLTIP_BOTTOM_OFFSET,
    width: TOOLTIP_WIDTH,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(48, 64, 58, 0.18)",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    pointerEvents: "none",
  },
  sliderMarkerTooltipTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#30403A",
  },
  sliderMarkerTooltipDescription: {
    fontSize: 11,
    color: "#60706A",
    marginTop: 2,
  },
  sliderMarkerTooltipArrow: {
    position: "absolute",
    bottom: -6,
    left: "50%",
    marginLeft: -6,
    width: 12,
    height: 12,
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(48, 64, 58, 0.18)",
    transform: [{ rotate: "45deg" }],
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  calculateButton: {
    marginBottom: 8,
  },
});

const DeterministicTab: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
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
  const [activeReturnMilestone, setActiveReturnMilestone] = useState<SliderMilestone | null>(null);
  const [activeInflationMilestone, setActiveInflationMilestone] = useState<SliderMilestone | null>(null);
  const [returnSliderWidth, setReturnSliderWidth] = useState(0);
  const [inflationSliderWidth, setInflationSliderWidth] = useState(0);
  const [showResults, setShowResults] = useState(false); // Only show results when Calculate is clicked
  const fieldBindings = useMemo(
    () => ({
      age: { value: age, set: setAge },
      retirementAge: { value: retireAge, set: setRetireAge },
      currentBalance: { value: balance, set: setBalance },
      contribution: { value: contribution, set: setContribution },
      expectedReturn: { value: rate, set: setRate },
      inflation: { value: inflation, set: setInflation },
    }),
    [age, retireAge, balance, contribution, rate, inflation],
  );

  // Initialize from route parameters (from Quick Start defaults)
  useEffect(() => {
    const params = route.params as any;
    if (params?.age || params?.balance || params?.contribution) {
      const paramAge = params.age ?? input?.age ?? 30;
      const paramRetireAge = params.retireAge ?? input?.retireAge ?? 65;
      const paramBalance = params.balance ?? input?.balance ?? 50000;
      const paramContribution = params.contribution ?? input?.contribution ?? 10000;
      const paramRate = params.rate ?? input?.rate ?? 7;
      const paramInflation = params.inflation ?? input?.inflation ?? 2.5;

      setAge(paramAge);
      setRetireAge(paramRetireAge);
      setBalance(paramBalance);
      setContribution(paramContribution);
      setRate(paramRate);
      setInflation(paramInflation);

      // If coming from Quick Start defaults, auto-calculate
      if (params.fromDefaults === true || params.fromDefaults === 'true') {
        setLoading(true);
        setError(null);

        try {
          const years = paramRetireAge - paramAge;
          const calculationResult = simulateDeterministic({
            initialBalance: paramBalance,
            annualContribution: paramContribution,
            years,
            annualReturn: paramRate / 100,
            inflation: paramInflation / 100,
          });
          setResult(calculationResult);
        } catch (err) {
          setError("Calculation failed");
        } finally {
          setLoading(false);
        }
      }
    }
  }, [route.params, setInput, setResult, setLoading]);

  const returnMilestones = useMemo<SliderMilestone[]>(() => [
    {
      value: 5,
      label: "5% • Low",
      description: "Conservative assumption; aligns with cautious portfolio mix.",
    },
    {
      value: 8,
      label: "8% • Average",
      description: "Historic long-term market average for balanced portfolios.",
    },
    {
      value: 12,
      label: "12% • High",
      description: "Aggressive expectation; assumes strong equity performance.",
    },
  ], []);

  const inflationMilestones = useMemo<SliderMilestone[]>(() => [
    {
      value: 2,
      label: "2% • Target",
      description: "Matches Federal Reserve long-term target inflation.",
    },
    {
      value: 3.5,
      label: "3.5% • Elevated",
      description: "Reflects periods of moderate inflation pressure.",
    },
    {
      value: 5,
      label: "5% • High",
      description: "High inflation environment; plan for higher expenses.",
    },
  ], []);

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
    setShowResults(true); // Show results when user clicks Calculate

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
      // Update the ref to track what was just submitted
      lastSubmittedRef.current = {
        age, retireAge, balance, contribution, rate, inflation
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Calculation failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateReturnMilestone = useCallback(
    (value: number) => {
      const proximity = 0.4;
      const match = returnMilestones.find((milestone) => Math.abs(milestone.value - value) <= proximity);
      setActiveReturnMilestone(match ?? null);
    },
    [returnMilestones],
  );

  const updateInflationMilestone = useCallback(
    (value: number) => {
      const proximity = 0.25;
      const match = inflationMilestones.find((milestone) => Math.abs(milestone.value - value) <= proximity);
      setActiveInflationMilestone(match ?? null);
    },
    [inflationMilestones],
  );

  const handleRateChange = useCallback(
    (value: number) => {
      setRate(value);
      updateReturnMilestone(value);
    },
    [updateReturnMilestone],
  );

  const handleInflationChange = useCallback(
    (value: number) => {
      setInflation(value);
      updateInflationMilestone(value);
    },
    [updateInflationMilestone],
  );

  useEffect(() => {
    updateReturnMilestone(rate);
  }, [rate, updateReturnMilestone]);

  useEffect(() => {
    updateInflationMilestone(inflation);
  }, [inflation, updateInflationMilestone]);

  const renderField = useCallback(
    (field: InputFieldDefinition) => {
      const binding = fieldBindings[field.id];
      if (!binding) {
        return null;
      }

      const helpTopicId = field.helpTopicId ? HELP_TOPIC_MAP_MOBILE[field.helpTopicId] : undefined;
      const helpIcon = helpTopicId ? <HelpIcon topicId={helpTopicId} /> : undefined;

      if (field.type === "slider") {
        if (field.id === "contribution") {
          const standardLimit = 23500;
          const catchUpLimit = 30500;
          const dynamicMax = age >= 50 ? catchUpLimit : standardLimit;
          const status =
            contribution <= standardLimit
              ? {
                  badge: "2025 Limit",
                  color: "#69B47A",
                  infoTitle: "✓ Within 2025 Limit",
                  infoDescription: "You can contribute up to $23,500 in 2025 (standard limit).",
                  background: "rgba(105, 180, 122, 0.1)",
                }
              : age >= 50 && contribution <= catchUpLimit
              ? {
                  badge: "Catch-up (50+)",
                  color: "#FFB74D",
                  infoTitle: "✓ Catch-up Eligible",
                  infoDescription: "You're 50+, so you can contribute up to $30,500 ($23.5k + $7k catch-up).",
                  background: "rgba(255, 183, 77, 0.1)",
                }
              : {
                  badge: "Over Limit",
                  color: "#FF6B6B",
                  infoTitle: "⚠ Over Contribution Limit",
                  infoDescription: "Your contribution exceeds the IRS limit. Consider reducing it.",
                  background: "rgba(255, 107, 107, 0.1)",
                };

          return (
            <SliderWithInfo
              key={field.id}
              title={`${field.label}:`}
              value={binding.value}
              min={field.constraints.min}
              max={dynamicMax}
              step={field.constraints.step}
              suffix=" ($)"
              onValueChange={binding.set}
              trackColor={status.color}
              badge={{
                label: status.badge,
                color: status.color,
              }}
              rangeIndicators={[
                { label: "$0", value: 0 },
                { label: "$23.5k (2025)", value: standardLimit },
                ...(age >= 50 ? [{ label: "$30.5k (50+)", value: catchUpLimit }] : []),
              ]}
              infoBox={{
                title: status.infoTitle,
                description: status.infoDescription,
                backgroundColor: status.background,
              }}
            />
          );
        }

        if (field.id === "expectedReturn") {
          return (
            <SliderWithInfo
              key={field.id}
              title={`${field.label}:`}
              value={binding.value}
              min={field.constraints.min}
              max={field.constraints.max}
              step={field.constraints.step}
              suffix="%"
              onValueChange={handleRateChange}
              trackColor={rate < 5 ? "#FF6B6B" : rate <= 8 ? "#FFB74D" : "#69B47A"}
              badge={{
                label: rate < 5 ? "Conservative" : rate <= 8 ? "Balanced" : "Aggressive",
                color: rate < 5 ? "#FF6B6B" : rate <= 8 ? "#FFB74D" : "#69B47A",
              }}
              rangeIndicators={[
                { label: "0%", value: 0 },
                { label: "5% (Low)", value: 5 },
                { label: "8% (Avg)", value: 8 },
                { label: "15%", value: 15 },
              ]}
              milestones={returnMilestones}
              infoBox={{
                title:
                  rate < 5
                    ? "🛡️ Conservative Strategy"
                    : rate <= 8
                    ? "⚖️ Balanced Approach"
                    : "📈 Aggressive Growth",
                description:
                  rate < 5
                    ? "Lower expected returns; suitable for risk-averse investors or near retirement."
                    : rate <= 8
                    ? "Moderate returns reflecting historical market averages; suitable for most investors."
                    : "Higher expected returns; assumes strong equity performance and higher risk tolerance.",
                backgroundColor:
                  rate < 5
                    ? "rgba(255, 107, 107, 0.1)"
                    : rate <= 8
                    ? "rgba(255, 183, 77, 0.1)"
                    : "rgba(105, 180, 122, 0.1)",
              }}
            />
          );
        }

        if (field.id === "inflation") {
          return (
            <SliderWithInfo
              key={field.id}
              title={`${field.label}:`}
              value={binding.value}
              min={field.constraints.min}
              max={field.constraints.max}
              step={field.constraints.step}
              suffix="%"
              onValueChange={handleInflationChange}
              trackColor={inflation < 2 ? "#69B47A" : inflation <= 4 ? "#FFB74D" : "#FF6B6B"}
              badge={{
                label: inflation < 2 ? "Low" : inflation <= 4 ? "Moderate" : "High",
                color: inflation < 2 ? "#69B47A" : inflation <= 4 ? "#FFB74D" : "#FF6B6B",
              }}
              rangeIndicators={[
                { label: "0%", value: 0 },
                { label: "2% (Target)", value: 2 },
                { label: "4% (Moderate)", value: 4 },
                { label: "6%", value: 6 },
              ]}
              milestones={inflationMilestones}
              infoBox={{
                title:
                  inflation < 2
                    ? "✓ Low Inflation"
                    : inflation <= 4
                    ? "⚠ Moderate Inflation"
                    : "🔴 High Inflation",
                description:
                  inflation < 2
                    ? "Strong purchasing power preservation; your $1 today buys nearly as much in the future."
                    : inflation <= 4
                    ? "Normal inflation range; your purchasing power will gradually decline."
                    : "High inflation environment; plan for significantly higher expenses in the future.",
                backgroundColor:
                  inflation < 2
                    ? "rgba(105, 180, 122, 0.1)"
                    : inflation <= 4
                    ? "rgba(255, 183, 77, 0.1)"
                    : "rgba(255, 107, 107, 0.1)",
              }}
            />
          );
        }
      }

      return (
        <CompactInputField
          key={field.id}
          label={field.label}
          value={String(binding.value)}
          onChangeText={(value) => binding.set(Number(value || 0))}
          keyboardType="numeric"
          helpIcon={helpIcon}
        />
      );
    },
    [
      fieldBindings,
      age,
      contribution,
      rate,
      inflation,
      handleRateChange,
      handleInflationChange,
      returnMilestones,
      inflationMilestones,
    ],
  );

  // Auto-recalculate when parameters change (only if result already exists)
  const lastSubmittedRef = useRef<{
    age: number;
    retireAge: number;
    balance: number;
    contribution: number;
    rate: number;
    inflation: number;
  } | null>(null);

  useEffect(() => {
    if (!result || !lastSubmittedRef.current) {
      return; // Don't recalculate until we have initial results
    }

    // Debounce to avoid excessive recalculations while sliding
    const debounceTimer = setTimeout(() => {
      const last = lastSubmittedRef.current!;
      
      // Check if ANY parameter changed
      const paramsChanged = 
        rate !== last.rate || 
        inflation !== last.inflation ||
        age !== last.age || 
        retireAge !== last.retireAge ||
        balance !== last.balance || 
        contribution !== last.contribution;

      if (paramsChanged) {
        try {
          const years = retireAge - age;
          console.log("Auto-recalculating with inflation:", inflation); // Debug log
          const calculationResult = simulateDeterministic({
            initialBalance: balance,
            annualContribution: contribution,
            years,
            annualReturn: rate / 100,
            inflation: inflation / 100,
          });
          console.log("New result with inflation", inflation, ":", calculationResult); // Debug log
          setResult(calculationResult);
          // Update the ref to the new values
          lastSubmittedRef.current = {
            age, retireAge, balance, contribution, rate, inflation
          };
        } catch (err) {
          // Silently fail on auto-recalculation to avoid disrupting the UI
          console.error("Auto-recalculation failed:", err);
        }
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(debounceTimer);
  }, [rate, inflation, age, retireAge, balance, contribution, result]);

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
          {deterministicScreen.sections.map((section) => (
            <View key={section.id} style={styles.sectionContainer}>
              <SectionHeader
                title={section.title}
                subtitle={section.description ?? ""}
              />
              {section.fields.map((fieldId) => {
                const fieldDefinition = getFieldDefinition(fieldId);
                const element = renderField(fieldDefinition);
                if (!element) {
                  return null;
                }
                return (
                  <View key={`${section.id}-${fieldDefinition.id}`} style={styles.fieldWrapper}>
                    {element}
                  </View>
                );
              })}
            </View>
          ))}

          {/* Buttons */}
          <Button
            mode="contained"
            onPress={handleCalculate}
            loading={loading}
            disabled={loading}
            style={styles.calculateButton}
          >
            Calculate Projection
          </Button>

          {result && (
            <View style={styles.actionButtons}>
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

      {showResults && result && (
        <>
          <ResultsSummary
            projectedBalance={result.realBalances[result.realBalances.length - 1]}
            nominalBalance={result.nominalBalances[result.nominalBalances.length - 1]}
            yearsToRetirement={retireAge - age}
            totalContributions={contribution * (retireAge - age)}
          />

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
                <Text style={styles.finalResultTitle}>Inflation-Adjusted Balance (Today's Dollars)</Text>
                <Text style={styles.realBalanceValue}>
                  {formatCurrency(result.realBalances[result.realBalances.length - 1])}
                </Text>
                <Text style={styles.realBalanceText}>Nominal Balance (Future Dollars):</Text>
                <Text style={styles.finalResultValue}>
                  {formatCurrency(result.nominalBalances[result.nominalBalances.length - 1])}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </>
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
