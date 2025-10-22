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
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "@projection/shared";
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
  getSliderMetadata,
  resolveSliderMilestones,
  resolveSliderRangeIndicators,
  resolveSliderState,
  SliderMilestoneConfig,
} from "@projection/shared";

const chartAxisTextStyle = { fontSize: 10, fill: COLORS.textSecondary };
const deterministicStrokeStyle = { stroke: COLORS.secondary, strokeWidth: 2 };

const deterministicScreen: ScreenDefinition = getScreenDefinition("deterministic");
const expectedReturnFieldDefinition = getFieldDefinition("expectedReturn");
const inflationFieldDefinition = getFieldDefinition("inflation");

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

type SliderMilestone = SliderMilestoneConfig;

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
    padding: SPACING.lg,
    gap: SPACING.sm,
    paddingBottom: 120,
  },
  card: {
    marginBottom: SPACING.md,
  },
  inputSpacing: {
    marginBottom: SPACING.md,
  },
  sectionContainer: {
    marginBottom: SPACING.xl,
  },
  fieldWrapper: {
    marginBottom: SPACING.md,
  },
  resultText: {
    marginTop: SPACING.lg,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  finalResultCard: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.resultHighlight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.resultBorder,
    borderRadius: BORDER_RADIUS.sm,
  },
  finalResultTitle: {
    fontWeight: "700",
    color: COLORS.resultText,
    marginBottom: SPACING.sm,
  },
  finalResultValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: "800",
    color: COLORS.resultValueText,
  },
  realBalanceText: {
    marginTop: SPACING.md,
    fontWeight: "600",
    color: COLORS.success,
  },
  realBalanceValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: "700",
    color: COLORS.resultValueText,
  },
  errorText: {
    marginTop: SPACING.md,
    color: COLORS.error,
  },
  chartContainer: {
    height: 220,
    flexDirection: "row",
  },
  sliderWithMarkers: {
    width: "100%",
    paddingTop: 40,
    paddingBottom: SPACING.xxl,
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
    borderColor: `${COLORS.secondary}66`, // 40% opacity
    backgroundColor: COLORS.surface,
  },
  sliderMarkerDotActive: {
    borderColor: COLORS.secondary,
    backgroundColor: `${COLORS.secondary}33`, // 20% opacity
  },
  sliderMarkerTooltip: {
    position: "absolute",
    bottom: TOOLTIP_BOTTOM_OFFSET,
    width: TOOLTIP_WIDTH,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    pointerEvents: "none",
  },
  sliderMarkerTooltipTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  sliderMarkerTooltipDescription: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sliderMarkerTooltipArrow: {
    position: "absolute",
    bottom: -6,
    left: "50%",
    marginLeft: -6,
    width: 12,
    height: 12,
    backgroundColor: COLORS.surface,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    transform: [{ rotate: "45deg" }],
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  calculateButton: {
    marginBottom: SPACING.sm,
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
  const formState = useMemo(
    () => ({
      age,
      retirementAge: retireAge,
      currentBalance: balance,
      contribution,
      expectedReturn: rate,
      inflation,
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

  const returnMilestones = useMemo<SliderMilestone[]>(() => {
    const metadata = getSliderMetadata(expectedReturnFieldDefinition);
    return resolveSliderMilestones(metadata);
  }, []);

  const inflationMilestones = useMemo<SliderMilestone[]>(() => {
    const metadata = getSliderMetadata(inflationFieldDefinition);
    return resolveSliderMilestones(metadata);
  }, []);

  const getSliderPresentation = useCallback(
    (
      field: InputFieldDefinition,
      value: number,
      options?: { dynamicMax?: number },
    ) => {
      const metadata = getSliderMetadata(field);
      const rangeIndicators = resolveSliderRangeIndicators(metadata, { formState });
      const sliderState = resolveSliderState(metadata, {
        value,
        formState,
        dynamicMax: options?.dynamicMax,
      });
      const trackColor =
        sliderState?.trackColor ??
        sliderState?.badgeColor ??
        metadata?.theme?.track?.defaultColor ??
        COLORS.secondary;

      const infoBox = sliderState?.info
        ? {
            title: sliderState.info.title ?? "",
            description: sliderState.info.description ?? "",
            backgroundColor:
              sliderState.backgroundColor ?? `${COLORS.secondary}1F`, // 12% opacity
          }
        : undefined;

      return {
        badge: sliderState
          ? {
              label: sliderState.label,
              color: sliderState.badgeColor,
            }
          : undefined,
        trackColor,
        infoBox,
        rangeIndicators,
        milestones: resolveSliderMilestones(metadata),
      };
    },
    [formState],
  );

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

  const handleRateChange = useCallback((value: number) => {
    setRate(value);
  }, []);

  const handleInflationChange = useCallback((value: number) => {
    setInflation(value);
  }, []);

  const renderField = useCallback(
    (field: InputFieldDefinition) => {
      const binding = (fieldBindings as Record<string, { value: number; set: React.Dispatch<React.SetStateAction<number>> } >)[field.id];
      if (!binding) {
        return null;
      }

      const helpTopicId = field.helpTopicId ? HELP_TOPIC_MAP_MOBILE[field.helpTopicId] : undefined;
      const helpIcon = helpTopicId ? <HelpIcon topicId={helpTopicId} /> : undefined;

      if (field.type === "slider") {
        const dynamicMax =
          typeof field.constraints.conditionalMax === "function"
            ? field.constraints.conditionalMax(formState)
            : undefined;
        const sliderPresentation = getSliderPresentation(field, binding.value, {
          dynamicMax,
        });
        const sliderValueFormatter =
          typeof field.constraints.format === "function"
            ? field.constraints.format
            : undefined;

        const milestoneThreshold =
          field.id === "expectedReturn"
            ? Math.max(
                (expectedReturnFieldDefinition.constraints.step ?? 0.5) * 1.2,
                0.3,
              )
            : field.id === "inflation"
            ? Math.max(
                (inflationFieldDefinition.constraints.step ?? 0.1) * 1.5,
                0.2,
              )
            : undefined;

        const onValueChange =
          field.id === "expectedReturn"
            ? handleRateChange
            : field.id === "inflation"
            ? handleInflationChange
            : binding.set;

        return (
          <SliderWithInfo
            key={field.id}
            title={`${field.label}:`}
            value={binding.value}
            min={field.constraints.min}
            max={dynamicMax ?? field.constraints.max}
            step={field.constraints.step}
            suffix={field.constraints.suffix ?? ""}
            valueFormatter={sliderValueFormatter}
            onValueChange={onValueChange}
            trackColor={sliderPresentation.trackColor}
            badge={sliderPresentation.badge}
            rangeIndicators={sliderPresentation.rangeIndicators}
            infoBox={sliderPresentation.infoBox}
            milestones={
              (field.id === "expectedReturn"
                ? returnMilestones
                : field.id === "inflation"
                ? inflationMilestones
                : sliderPresentation.milestones
              ).map(m => ({ ...m, description: m.description ?? "" }))
            }
            milestoneThreshold={milestoneThreshold}
          />
        );
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
      getSliderPresentation,
      handleRateChange,
      handleInflationChange,
      returnMilestones,
      inflationMilestones,
      rate,
      inflation,
      formState,
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
                title={section.title ?? ""}
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
