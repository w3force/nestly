import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { useProjectionStore } from '@projection/core';
import {
  calculateDefaults,
  formatCurrency,
  StrategyType,
  getStrategyConfig,
  DEFAULT_VALUES,
} from '../lib/defaultValues';

export type ReadinessMessages = Partial<Record<'Low' | 'Borderline' | 'Comfortable', string>>;

interface QuickStartSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  footnote?: string;
  inputLabels?: QuickStartInputMetadata;
  strategyMetadata?: QuickStartStrategyMetadata;
  resultsMetadata?: QuickStartResultsMetadata;
  readinessMessages?: ReadinessMessages;
  onNavigateTo?: (route: string, params?: any) => void;
}

export interface QuickStartInputMetadata {
  age?: QuickStartCopy;
  retirementAge?: QuickStartCopy;
  balance?: QuickStartCopy;
}

export interface QuickStartCopy {
  label?: string;
  helper?: string;
  placeholder?: string;
}

export interface QuickStartStrategyMetadata {
  heading?: string;
  presetsLabel?: string;
  optionReturns?: Partial<Record<StrategyType, string>>;
}

export interface QuickStartResultsMetadata {
  strategySuffix?: string;
  retirementHeadline?: string;
  retirementHeadlineRetired?: string;
  portfolioLabel?: string;
  portfolioGrowth?: string;
  portfolioBaseline?: string;
  monthlyIncomeLabel?: string;
  monthlyIncomeSuffix?: string;
  retirementDurationLabel?: string;
  retirementDurationSuffix?: string;
  retirementReadyLabel?: string;
}

const renderTemplate = (
  template: string | undefined,
  context: Record<string, string | number | undefined>
): string | undefined => {
  if (!template) {
    return undefined;
  }
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key) => {
    const value = context[key];
    return value !== undefined && value !== null ? String(value) : '';
  });
};

export default function QuickStartSection({
  title = '⚡ Quick Start',
  subtitle = 'See Your Results in 8 Seconds',
  description = 'Enter your age, current balance, and investment strategy to see your retirement projection instantly.',
  ctaLabel = 'Get Detailed Analysis →',
  footnote,
  inputLabels,
  strategyMetadata,
  resultsMetadata,
  readinessMessages,
  onNavigateTo,
}: QuickStartSectionProps) {
  const theme = useTheme();
  const { setInput } = useProjectionStore();
  const [age, setAge] = useState('35');
  const [retirementAge, setRetirementAge] = useState('65');
  const [balance, setBalance] = useState('100000');
  const [strategy, setStrategy] = useState<StrategyType>('MID_RISK');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const ageNum = parseInt(age) || 35;
      const retireAgeNum = parseInt(retirementAge) || 65;
      const balanceNum = parseInt(balance) || 100000;
      
      setLoading(true);
      try {
        const calculated = calculateDefaults({
          age: ageNum,
          balance: balanceNum,
          strategy,
          retirementAge: retireAgeNum,
        });
        setResult(calculated);
      } catch (error) {
        console.error('❌ QuickStart error:', error);
        const retireAgeNum = parseInt(retirementAge) || 65;
        const ageNum = parseInt(age) || 35;
        setResult({
          retirementAge: retireAgeNum,
          yearsToRetirement: Math.max(1, retireAgeNum - ageNum),
          contribution: 15000,
          expectedReturn: 7,
          inflation: 2.5,
          portfolioAtRetirement: 1500000,
          monthlyIncome: 5000,
          strategy,
          age: ageNum,
          balance: balanceNum,
          retirementDuration: Math.max(20, Math.round((retireAgeNum - ageNum) * 1.5)),
          confidenceLevel: 'Comfortable',
          confidencePercentage: 85,
        });
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [age, retirementAge, balance, strategy]);

  const ageNum = parseInt(age, 10) || 35;
  const retireAgeNum = parseInt(retirementAge, 10) || 65;
  const balanceNum = parseInt(balance, 10) || 100000;
  const yearsToRetirement = Math.max(0, retireAgeNum - ageNum);

  const strategyConfig = useMemo(() => getStrategyConfig(strategy), [strategy]);

  const ageLabels = inputLabels?.age ?? {};
  const retireLabels = inputLabels?.retirementAge ?? {};
  const balanceLabels = inputLabels?.balance ?? {};

  const strategyHeading = strategyMetadata?.heading ?? 'Investment Strategy';
  const presetsLabel = strategyMetadata?.presetsLabel ?? 'Quick presets:';

  const ageHelperText = renderTemplate(ageLabels.helper, { yearsToRetirement });
  const retireHelperText = renderTemplate(retireLabels.helper, { yearsToRetirement });
  const balanceHelperText = renderTemplate(balanceLabels.helper, { yearsToRetirement });

  const resultContext = result
    ? {
        yearsToRetirement: result.yearsToRetirement,
        retirementAge: result.retirementAge,
        retirementDuration: result.retirementDuration,
        retirementEndAge: result.retirementAge + result.retirementDuration,
        strategyLabel: strategyConfig.label,
        growth:
          result.portfolioAtRetirement - result.balance > 0
            ? formatCurrency(result.portfolioAtRetirement - result.balance)
            : undefined,
        confidencePercentage: result.confidencePercentage,
      }
    : {
        yearsToRetirement,
        retirementAge: retireAgeNum,
        retirementDuration: Math.max(20, Math.round(yearsToRetirement * 1.5)),
        retirementEndAge: retireAgeNum + Math.max(20, Math.round(yearsToRetirement * 1.5)),
        strategyLabel: strategyConfig.label,
        confidencePercentage: undefined,
      };

  const headline =
    result && result.yearsToRetirement > 0
      ? renderTemplate(resultsMetadata?.retirementHeadline, resultContext) ??
        `Retirement in ${result.yearsToRetirement} years`
      : renderTemplate(resultsMetadata?.retirementHeadlineRetired, resultContext) ?? 'Already retired!';

  const portfolioLabel =
    renderTemplate(resultsMetadata?.portfolioLabel, resultContext) ??
    `Portfolio at Age ${result?.retirementAge ?? retireAgeNum}`;

  const growthDifference =
    result && typeof result.portfolioAtRetirement === 'number' && typeof result.balance === 'number'
      ? result.portfolioAtRetirement - result.balance
      : 0;

  const portfolioGrowthText =
    result && growthDifference > 0
      ? renderTemplate(resultsMetadata?.portfolioGrowth, {
          ...resultContext,
          growth: formatCurrency(growthDifference),
        }) ?? `+${formatCurrency(growthDifference)} from growth & contributions`
      : resultsMetadata?.portfolioBaseline ?? 'Starting amount';

  const monthlyIncomeLabel =
    resultsMetadata?.monthlyIncomeLabel ?? 'Monthly Income (4% Rule)';
  const monthlyIncomeSuffix = resultsMetadata?.monthlyIncomeSuffix ?? '/month';

  const retirementDurationLabel =
    resultsMetadata?.retirementDurationLabel ?? 'Retirement Duration';
  const retirementDurationSuffix =
    result && resultsMetadata?.retirementDurationSuffix
      ? renderTemplate(resultsMetadata.retirementDurationSuffix, resultContext)
      : result
      ? `(${result.retirementDuration} years)`
      : undefined;

  const retirementReadyLabel =
    resultsMetadata?.retirementReadyLabel ?? 'Retirement Readiness';

  const readinessMessage =
    (result && readinessMessages?.[result.confidenceLevel]) ??
    (result?.confidenceLevel === 'Comfortable'
      ? 'On track for comfortable retirement'
      : result?.confidenceLevel === 'Borderline'
      ? 'May need to adjust contributions or timeline'
      : 'Review your strategy and goals');

  const readinessColor =
    result?.confidenceLevel === 'Comfortable'
      ? '#4CAF50'
      : result?.confidenceLevel === 'Borderline'
      ? '#FF9800'
      : '#F44336';
  const readinessBackground = `${readinessColor}22`;

  const footnoteCopy =
    footnote ??
    '📊 These are estimates based on historical market averages.\nActual results will vary based on market conditions and personal circumstances.';

  const handleNavigate = () => {
    if (result && onNavigateTo) {
      setInput({
        age: ageNum,
        retireAge: result.retirementAge,
        balance: balanceNum,
        contribution: result.contribution,
        rate: result.expectedReturn,
        inflation: result.inflation,
      });
      onNavigateTo('Calculator', {
        age: ageNum,
        balance: balanceNum,
        contribution: result.contribution,
        rate: result.expectedReturn,
        inflation: result.inflation,
        retireAge: result.retirementAge,
        fromDefaults: true,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          {subtitle}
        </Text>
        <Text style={[styles.subtitleDescription, { color: theme.colors.onSurfaceVariant }]}>
          {description}
        </Text>
      </View>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.cardContent}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>{ageLabels.label ?? 'Current Age'}</Text>
              <Text style={[styles.value, { color: theme.colors.primary }]}>{ageNum}</Text>
            </View>
            <View style={[styles.inputContainer, { borderColor: theme.colors.outline }]}>
              <TextInput
                style={[styles.textInput, { color: theme.colors.onSurface }]}
                placeholder={ageLabels.placeholder ?? 'e.g., 35'}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={age}
                onChangeText={(text) => {
                  setAge(text);
                }}
                onEndEditing={() => {
                  const num = parseInt(age, 10) || 0;
                  const validated = Math.max(18, Math.min(100, num));
                  setAge(String(validated));
                }}
                keyboardType="decimal-pad"
              />
              {ageHelperText ? (
                <Text style={[styles.inputHint, { color: theme.colors.onSurfaceVariant }]}>{ageHelperText}</Text>
              ) : (
                <Text style={[styles.inputHint, { color: theme.colors.onSurfaceVariant }]}>
                  You have {yearsToRetirement} years until retirement age
                </Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                {retireLabels.label ?? 'Target Retirement Age'}
              </Text>
              <Text style={[styles.value, { color: theme.colors.primary }]}>{parseInt(retirementAge)}</Text>
            </View>
            <View style={[styles.inputContainer, { borderColor: theme.colors.outline }]}>
              <TextInput
                style={[styles.textInput, { color: theme.colors.onSurface }]}
                placeholder={retireLabels.placeholder ?? 'e.g., 65'}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={retirementAge}
                onChangeText={(text) => {
                  setRetirementAge(text);
                }}
                onEndEditing={() => {
                  const num = parseInt(retirementAge) || 0;
                  const validated = Math.max(40, Math.min(100, num));
                  setRetirementAge(String(validated));
                }}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.inputHint, { color: theme.colors.onSurfaceVariant }]}>
                {retireHelperText ?? 'When you want to retire'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                {balanceLabels.label ?? 'Current 401(k) Balance'}
              </Text>
              <Text style={[styles.value, { color: theme.colors.primary }]}>
                {formatCurrency(balanceNum)}
              </Text>
            </View>
            <View style={[styles.inputContainer, { borderColor: theme.colors.outline }]}>
              <TextInput
                style={[styles.textInput, { color: theme.colors.onSurface }]}
                placeholder={balanceLabels.placeholder ?? 'e.g., 100000'}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={balance}
                onChangeText={(text) => {
                  setBalance(text);
                }}
                onEndEditing={() => {
                  const num = parseInt(balance) || 0;
                  const validated = Math.max(0, num);
                  setBalance(String(validated));
                }}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.inputHint, { color: theme.colors.onSurfaceVariant }]}>
                {balanceHelperText ?? "This is your starting amount. We'll add your contributions and growth from here."}
              </Text>
            </View>
            
            <View style={styles.presetsLabel}>
              <Text style={[styles.smallLabel, { color: theme.colors.onSurfaceVariant }]}>
                {presetsLabel}
              </Text>
            </View>
            <View style={styles.presetRow}>
              {[25000, 50000, 100000, 250000].map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.presetButton,
                    {
                      borderColor: balanceNum === preset ? theme.colors.primary : theme.colors.outline,
                      backgroundColor:
                        balanceNum === preset ? theme.colors.primary + '20' : 'transparent',
                    },
                  ]}
                  onPress={() => setBalance(String(preset))}
                >
                  <Text
                    style={[
                      styles.presetText,
                      { color: balanceNum === preset ? theme.colors.primary : theme.colors.onSurfaceVariant },
                    ]}
                  >
                    ${(preset / 1000).toFixed(0)}k
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>{strategyHeading}</Text>
              <Text style={[styles.value, { color: strategyConfig.color }]}>{strategyConfig.label}</Text>
            </View>
            <View style={styles.strategyRow}>
              {(['LOW_RISK', 'MID_RISK', 'HIGH_RISK'] as StrategyType[]).map((option) => {
                const optionConfig = getStrategyConfig(option);
                const isSelected = strategy === option;
                const optionReturn =
                  strategyMetadata?.optionReturns?.[option] ??
                  `${Math.round(DEFAULT_VALUES[option].return * 100)}% return`;

                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.strategyButton,
                      {
                        borderColor: isSelected ? optionConfig.color : theme.colors.outline,
                        backgroundColor: isSelected ? `${optionConfig.color}26` : 'transparent',
                      },
                    ]}
                    onPress={() => setStrategy(option)}
                  >
                    <Text
                      style={[
                        styles.strategyLabel,
                        { color: isSelected ? optionConfig.color : theme.colors.onSurface },
                      ]}
                    >
                      {optionConfig.label}
                    </Text>
                    <Text
                      style={[
                        styles.strategyReturn,
                        { color: isSelected ? optionConfig.color : theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {optionReturn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={[styles.strategyDescription, { color: theme.colors.onSurfaceVariant }]}>
              {strategyConfig.description}
            </Text>
          </View>
        </View>
      </Card>

      {loading ? (
        <View style={[styles.loadingCard, { borderColor: theme.colors.outline + '33' }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
            Calculating...
          </Text>
        </View>
      ) : result ? (
        <Card
          style={[
            styles.resultsCard,
            {
              borderColor: `${strategyConfig.color}33`,
            },
          ]}
        >
          <View style={styles.resultsContent}>
            <View style={styles.resultsHeader}>
              <Text style={[styles.resultsOverline, { color: strategyConfig.color }]}>
                {`${strategyConfig.label.toUpperCase()}${resultsMetadata?.strategySuffix ?? ' STRATEGY'}`}
              </Text>
              <Text style={[styles.resultsHeadline, { color: theme.colors.onSurface }]}>{headline}</Text>
            </View>

            <View style={styles.resultsDivider} />

            <View style={styles.resultsBlock}>
              <Text style={[styles.resultLabel, { color: 'rgba(48,64,58,0.6)' }]}>{portfolioLabel}</Text>
              <Text style={[styles.resultValueHighlight, { color: strategyConfig.color }]}>
                {formatCurrency(result.portfolioAtRetirement)}
              </Text>
              <Text style={[styles.resultSubLabel, { color: 'rgba(48,64,58,0.5)' }]}>{portfolioGrowthText}</Text>
            </View>

            <View style={styles.resultsRow}>
              <View style={styles.resultsColumn}>
                <Text style={[styles.resultLabel, { color: 'rgba(48,64,58,0.6)' }]}>{monthlyIncomeLabel}</Text>
                <Text style={[styles.resultValue, { color: theme.colors.onSurface }]}>
                  {formatCurrency(result.monthlyIncome)}
                  <Text style={styles.resultSuffix}> {monthlyIncomeSuffix}</Text>
                </Text>
              </View>
              <View style={styles.resultsColumn}>
                <Text style={[styles.resultLabel, { color: 'rgba(48,64,58,0.6)' }]}>{retirementDurationLabel}</Text>
                <Text style={[styles.resultValue, { color: theme.colors.onSurface }]}>
                  {`Until Age ${result.retirementAge + result.retirementDuration}`}
                  {retirementDurationSuffix ? (
                    <Text style={styles.resultSuffix}> {retirementDurationSuffix}</Text>
                  ) : null}
                </Text>
              </View>
            </View>

            <View style={styles.resultsDivider} />

            <View style={styles.readinessSection}>
              <View style={styles.readinessHeader}>
                <Text style={[styles.resultLabel, { color: 'rgba(48,64,58,0.6)' }]}>{retirementReadyLabel}</Text>
                <View style={[styles.readinessChip, { backgroundColor: readinessBackground, borderColor: readinessColor }]}>
                  <Text style={[styles.readinessChipText, { color: readinessColor }]}>
                    {`${result.confidenceLevel} (${result.confidencePercentage}%)`}
                  </Text>
                </View>
              </View>
              <View style={styles.readinessBarTrack}>
                <View
                  style={[
                    styles.readinessBarFill,
                    {
                      width: `${result.confidencePercentage}%`,
                      backgroundColor: readinessColor,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.readinessMessage, { color: 'rgba(48,64,58,0.6)' }]}>
                {readinessMessage}
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handleNavigate}
              style={styles.analyzeButton}
              labelStyle={styles.buttonLabel}
              buttonColor={strategyConfig.color}
              textColor="#FFFFFF"
            >
              {ctaLabel}
            </Button>
          </View>
        </Card>
      ) : null}

      <Text style={[styles.footnote, { color: theme.colors.onSurfaceVariant }]}>{footnoteCopy}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitleDescription: {
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(48,64,58,0.08)',
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowColor: 'transparent',
  },
  cardContent: {
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
  },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    fontSize: 16,
    fontWeight: '600',
    padding: 0,
  },
  inputHint: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 6,
  },
  presetsLabel: {
    marginBottom: 10,
  },
  smallLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  presetButton: {
    flex: 1,
    minWidth: '22%',
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
  },
  strategyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  strategyButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  strategyLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  strategyReturn: {
    fontSize: 11,
    fontWeight: '500',
  },
  strategyDescription: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  loadingCard: {
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  resultsCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    elevation: 0,
    shadowColor: 'transparent',
  },
  resultsContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  resultsHeader: {
    gap: 4,
  },
  resultsOverline: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  resultsHeadline: {
    fontSize: 20,
    fontWeight: '700',
  },
  resultsDivider: {
    height: 1,
    backgroundColor: 'rgba(48,64,58,0.08)',
    marginVertical: 4,
  },
  resultsBlock: {
    gap: 6,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultValueHighlight: {
    fontSize: 28,
    fontWeight: '800',
  },
  resultSubLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  resultsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  resultsColumn: {
    flex: 1,
    gap: 6,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  resultSuffix: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(48,64,58,0.6)',
  },
  readinessSection: {
    gap: 8,
  },
  readinessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readinessChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  readinessChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  readinessBarTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(48,64,58,0.12)',
    overflow: 'hidden',
  },
  readinessBarFill: {
    height: 8,
    borderRadius: 999,
  },
  readinessMessage: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  analyzeButton: {
    marginTop: 4,
    borderRadius: 999,
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  footnote: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
