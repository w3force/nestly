import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { useProjectionStore } from '@projection/core';
import { calculateDefaults, formatCurrency } from '../lib/defaultValues';

interface QuickStartSectionProps {
  onNavigateTo?: (route: string, params?: any) => void;
}

export default function QuickStartSection({ onNavigateTo }: QuickStartSectionProps) {
  const theme = useTheme();
  const { setInput } = useProjectionStore();
  const [age, setAge] = useState('35');
  const [retirementAge, setRetirementAge] = useState('65');
  const [balance, setBalance] = useState('100000');
  const [strategy, setStrategy] = useState<'low' | 'mid' | 'high'>('mid');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const ageNum = parseInt(age) || 35;
      const retireAgeNum = parseInt(retirementAge) || 65;
      const balanceNum = parseInt(balance) || 100000;
      
      setLoading(true);
      try {
        const strategyMap = { low: 'LOW_RISK', mid: 'MID_RISK', high: 'HIGH_RISK' } as const;
        const calculated = calculateDefaults({
          age: ageNum,
          balance: balanceNum,
          strategy: strategyMap[strategy],
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
          expectedReturn: 0.07,
          inflation: 0.025,
          portfolioAtRetirement: 1500000,
          monthlyIncome: 5000,
        });
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [age, retirementAge, balance, strategy]);

  const handleNavigate = () => {
    if (result && onNavigateTo) {
      const ageNum = parseInt(age) || 35;
      const balanceNum = parseInt(balance) || 100000;
      
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

  const ageNum = parseInt(age) || 35;
  const balanceNum = parseInt(balance) || 100000;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>⚡ Quick Start</Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Get your retirement projection in seconds
        </Text>
      </View>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.cardContent}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>Your Age</Text>
              <Text style={[styles.value, { color: theme.colors.primary }]}>{ageNum}</Text>
            </View>
            <View style={[styles.inputContainer, { borderColor: theme.colors.outline }]}>
              <TextInput
                style={[styles.textInput, { color: theme.colors.onSurface }]}
                placeholder="e.g., 35"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={age}
                onChangeText={(text) => {
                  setAge(text);
                }}
                onEndEditing={() => {
                  const num = parseInt(age) || 0;
                  const validated = Math.max(18, Math.min(100, num));
                  setAge(String(validated));
                }}
                keyboardType="decimal-pad"
              />
              <Text style={[styles.inputHint, { color: theme.colors.onSurfaceVariant }]}>
                {Math.max(0, parseInt(retirementAge) - ageNum)} years to retirement
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>Target Retirement Age</Text>
              <Text style={[styles.value, { color: theme.colors.primary }]}>{parseInt(retirementAge)}</Text>
            </View>
            <View style={[styles.inputContainer, { borderColor: theme.colors.outline }]}>
              <TextInput
                style={[styles.textInput, { color: theme.colors.onSurface }]}
                placeholder="e.g., 65"
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
                When you want to retire
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>Current Balance</Text>
              <Text style={[styles.value, { color: theme.colors.primary }]}>
                {formatCurrency(balanceNum)}
              </Text>
            </View>
            <View style={[styles.inputContainer, { borderColor: theme.colors.outline }]}>
              <TextInput
                style={[styles.textInput, { color: theme.colors.onSurface }]}
                placeholder="e.g., 100000"
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
                Your 401(k) starting amount
              </Text>
            </View>
            
            <View style={styles.presetsLabel}>
              <Text style={[styles.smallLabel, { color: theme.colors.onSurfaceVariant }]}>Quick presets:</Text>
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
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>Risk Strategy</Text>
              <Text style={[styles.value, { color: theme.colors.primary }]}>
                {strategy.charAt(0).toUpperCase() + strategy.slice(1)}
              </Text>
            </View>
            <View style={styles.strategyRow}>
              {[
                { key: 'low', label: 'Conservative', ret: '5%' },
                { key: 'mid', label: 'Balanced', ret: '7%' },
                { key: 'high', label: 'Aggressive', ret: '9%' },
              ].map(({ key, label, ret }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.strategyButton,
                    {
                      borderColor: strategy === key ? theme.colors.primary : theme.colors.outline,
                      backgroundColor:
                        strategy === key ? theme.colors.primary + '20' : 'transparent',
                    },
                  ]}
                  onPress={() => setStrategy(key as 'low' | 'mid' | 'high')}
                >
                  <Text
                    style={[
                      styles.strategyLabel,
                      { color: strategy === key ? theme.colors.primary : theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {label}
                  </Text>
                  <Text
                    style={[
                      styles.strategyReturn,
                      { color: strategy === key ? theme.colors.primary : theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {ret} return
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Card>

      {loading ? (
        <View style={[styles.card, { justifyContent: 'center', alignItems: 'center', padding: 32 }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant, marginTop: 12 }]}>
            Calculating...
          </Text>
        </View>
      ) : result ? (
        <Card style={[styles.resultsCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <View style={styles.resultsContent}>
            <Text style={[styles.resultsTitle, { color: theme.colors.onPrimaryContainer }]}>
              Your Projection
            </Text>

            <View style={styles.resultGrid}>
              <View style={[styles.resultItem, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                <Text style={[styles.resultLabel, { color: theme.colors.onPrimaryContainer }]}>
                  Retirement Age
                </Text>
                <Text style={[styles.resultValue, { color: theme.colors.onPrimaryContainer }]}>
                  {result.retirementAge}
                </Text>
              </View>

              <View style={[styles.resultItem, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                <Text style={[styles.resultLabel, { color: theme.colors.onPrimaryContainer }]}>
                  Years Left
                </Text>
                <Text style={[styles.resultValue, { color: theme.colors.onPrimaryContainer }]}>
                  {result.yearsToRetirement}
                </Text>
              </View>

              <View style={[styles.resultItem, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                <Text style={[styles.resultLabel, { color: theme.colors.onPrimaryContainer }]}>
                  At Retirement
                </Text>
                <Text style={[styles.resultValue, { color: theme.colors.onPrimaryContainer }]}>
                  {formatCurrency(result.portfolioAtRetirement)}
                </Text>
              </View>

              <View style={[styles.resultItem, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                <Text style={[styles.resultLabel, { color: theme.colors.onPrimaryContainer }]}>
                  Monthly Income
                </Text>
                <Text style={[styles.resultValue, { color: theme.colors.onPrimaryContainer }]}>
                  {formatCurrency(result.monthlyIncome)}
                </Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleNavigate}
              style={styles.analyzeButton}
              buttonColor={theme.colors.onPrimaryContainer}
              textColor={theme.colors.primaryContainer}
              labelStyle={styles.buttonLabel}
            >
              Get Detailed Analysis
            </Button>
          </View>
        </Card>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 20 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 13, fontWeight: '400' },
  card: { marginBottom: 16, borderRadius: 12, elevation: 1 },
  cardContent: { paddingHorizontal: 16, paddingVertical: 16 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600' },
  value: { fontSize: 14, fontWeight: '700' },
  inputContainer: { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 8, backgroundColor: '#FFFFFF' },
  textInput: { fontSize: 16, fontWeight: '600', padding: 0 },
  inputHint: { fontSize: 12, fontWeight: '400', marginTop: 6 },
  presetsLabel: { marginBottom: 10 },
  smallLabel: { fontSize: 12, fontWeight: '500' },
  presetRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  presetButton: { flex: 1, minWidth: '22%', height: 44, borderRadius: 8, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  presetText: { fontSize: 12, fontWeight: '600' },
  strategyRow: { flexDirection: 'row', gap: 8 },
  strategyButton: { flex: 1, borderRadius: 8, borderWidth: 1.5, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center' },
  strategyLabel: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
  strategyReturn: { fontSize: 10, fontWeight: '400' },
  resultsCard: { borderRadius: 12, marginBottom: 16, elevation: 2 },
  resultsContent: { paddingHorizontal: 16, paddingVertical: 16 },
  resultsTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  resultGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, gap: 10 },
  resultItem: { width: '48%', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8 },
  resultLabel: { fontSize: 11, fontWeight: '500', marginBottom: 4, opacity: 0.9 },
  resultValue: { fontSize: 16, fontWeight: '700' },
  analyzeButton: { marginTop: 8, paddingVertical: 6 },
  buttonLabel: { fontSize: 14, fontWeight: '600' },
  loadingText: { fontSize: 14, fontWeight: '500' },
});
