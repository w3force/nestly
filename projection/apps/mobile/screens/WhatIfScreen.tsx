import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  useTheme,
  FAB,
  Chip,
  Portal,
  Dialog,
  Button,
  Snackbar,
  Card,
} from 'react-native-paper';
import { COLORS, SPACING } from '@projection/shared';
import {
  WhatIfScenario,
  DEFAULT_BASELINE,
  createScenario,
  cloneScenario,
  compareScenarios,
  calculateDifference,
  getHelpTopic,
  getScreenDefinition,
  getFieldDefinition,
  ScreenDefinition,
  InputFieldDefinition,
} from '@projection/shared';
import { ScenarioCard, ComparisonChart, HelpIcon, UpgradeBanner } from '../components';
import { useFeatureLimit } from '../contexts/TierContext';

const normalizeScenario = (scenario: WhatIfScenario): WhatIfScenario => {
  const savingsRate = scenario.savingsRate ?? scenario.contribution ?? 0;
  return {
    ...scenario,
    savingsRate,
    contribution: savingsRate,
  };
};

export default function WhatIfScreen() {
  const theme = useTheme();
  const maxScenarios = useFeatureLimit('maxScenarios');
  const whatIfScreen = useMemo<ScreenDefinition>(() => getScreenDefinition('whatif'), []);
  const baselineFieldDefinitions = useMemo<InputFieldDefinition[]>(() => {
    const section = whatIfScreen.sections.find((s) => s.id === 'baseline');
    if (!section) {
      return [];
    }
    return section.fields.map((fieldId) => getFieldDefinition(fieldId));
  }, [whatIfScreen]);
  const scenarioFieldDefinitions = useMemo<InputFieldDefinition[]>(() => {
    const section = whatIfScreen.sections.find((s) => s.id === 'scenarios');
    if (!section || section.fields.length === 0) {
      return baselineFieldDefinitions;
    }
    return section.fields.map((fieldId) => getFieldDefinition(fieldId));
  }, [whatIfScreen, baselineFieldDefinitions]);
  
  const [baseline, setBaseline] = useState<WhatIfScenario>(() => normalizeScenario(DEFAULT_BASELINE));
  const [scenarios, setScenarios] = useState<WhatIfScenario[]>([
    normalizeScenario(createScenario(1)),
  ]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const normalizeUpdates = useCallback(
    (updates: Partial<WhatIfScenario>): Partial<WhatIfScenario> => {
      if (updates.savingsRate != null && updates.contribution == null) {
        return { ...updates, contribution: updates.savingsRate };
      }
      if (updates.contribution != null && updates.savingsRate == null) {
        return { ...updates, savingsRate: updates.contribution };
      }
      return updates;
    },
    [],
  );

  // Load scenarios from AsyncStorage on mount
  useEffect(() => {
    loadScenarios();
  }, []);

  // Save scenarios to AsyncStorage whenever they change
  useEffect(() => {
    saveScenarios();
  }, [scenarios]);

  const saveScenarios = async () => {
    try {
      await AsyncStorage.setItem('whatif_scenarios', JSON.stringify(scenarios));
    } catch (error) {
      console.error('Failed to save scenarios:', error);
    }
  };

  const loadScenarios = async () => {
    try {
      const saved = await AsyncStorage.getItem('whatif_scenarios');
      if (saved) {
        const parsed: WhatIfScenario[] = JSON.parse(saved);
        setScenarios(parsed.map(normalizeScenario));
      }
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    }
  };

  const handleAddScenario = () => {
    if (scenarios.length >= maxScenarios) {
      setSnackbar({ visible: true, message: `Maximum ${maxScenarios} scenarios reached` });
      return;
    }
    const newScenario = normalizeScenario(createScenario(scenarios.length + 1));
    setScenarios([...scenarios, newScenario]);
    setSnackbar({ visible: true, message: 'New scenario added' });
  };

  const handleCloneScenario = (scenario: WhatIfScenario) => {
    if (scenarios.length >= maxScenarios) {
      setSnackbar({ visible: true, message: `Maximum ${maxScenarios} scenarios reached` });
      return;
    }
    const cloned = normalizeScenario(cloneScenario(scenario, scenarios.length + 1));
    setScenarios([...scenarios, cloned]);
    setSnackbar({ visible: true, message: `Cloned ${scenario.name}` });
  };

  const handleDeleteScenario = (id: string) => {
    setSelectedScenario(id);
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedScenario) {
      setScenarios(scenarios.filter(s => s.id !== selectedScenario));
      setSnackbar({ visible: true, message: 'Scenario deleted' });
    }
    setDeleteDialog(false);
    setSelectedScenario(null);
  };

  const handleUpdateScenario = (id: string, updates: Partial<WhatIfScenario>) => {
    const normalizedUpdates = normalizeUpdates(updates);
    if (id === 'baseline') {
      setBaseline((prev) => normalizeScenario({ ...prev, ...normalizedUpdates }));
    } else {
      setScenarios((prev) =>
        prev.map((s) =>
          s.id === id ? normalizeScenario({ ...s, ...normalizedUpdates }) : s,
        ),
      );
    }
  };

  const comparison = compareScenarios(baseline, scenarios);
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Tier upgrade banner for scenario limit */}
        {scenarios.length >= maxScenarios && maxScenarios < 10 && (
          <UpgradeBanner
            feature="More What-If Scenarios"
            requiredTier={maxScenarios === 2 ? 'PRO' : 'PREMIUM'}
            icon="chart-box-multiple"
            compact
          />
        )}

        <View style={styles.header}>
          <View style={styles.headerWithHelp}>
            <View>
              <Text variant="headlineMedium" style={styles.title}>
                What-If Scenarios
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Compare different retirement strategies (max: {maxScenarios})
              </Text>
            </View>
            <HelpIcon topicId="whatIfScenarios" helpTopic={getHelpTopic('whatIfScenarios')} size={24} />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              🎯 Baseline
            </Text>
            <HelpIcon topicId="whatIfScenarios" helpTopic={getHelpTopic('whatIfScenarios')} />
            <Chip mode="flat">Reference</Chip>
          </View>
          <ScenarioCard
            scenario={baseline}
            fields={baselineFieldDefinitions}
            onUpdate={(updates: Partial<WhatIfScenario>) => handleUpdateScenario('baseline', updates)}
            isBaseline
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              🔮 What-If Scenarios
            </Text>
            <HelpIcon topicId="savingsRate" helpTopic={getHelpTopic('savingsRate')} />
            <Chip mode="flat">{scenarios.length}/{maxScenarios}</Chip>
          </View>

          {scenarios.map((scenario) => {
            const diff = calculateDifference(scenario, baseline);
            return (
              <View key={scenario.id} style={styles.scenarioContainer}>
                <ScenarioCard
                  scenario={scenario}
                  fields={scenarioFieldDefinitions}
                  onUpdate={(updates: Partial<WhatIfScenario>) => handleUpdateScenario(scenario.id, updates)}
                  onDelete={() => handleDeleteScenario(scenario.id)}
                  onClone={() => handleCloneScenario(scenario)}
                  difference={diff}
                />
              </View>
            );
          })}
        </View>

        {scenarios.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                📊 Comparison
              </Text>
              <HelpIcon topicId="compoundGrowth" helpTopic={getHelpTopic('compoundGrowth')} />
            </View>
            <ComparisonChart
              baseline={comparison.baseline}
              scenarios={comparison.scenarios}
              width={screenWidth - 32}
            />
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <FAB
        icon="plus"
        label="Add Scenario"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddScenario}
        disabled={scenarios.length >= maxScenarios}
      />

      <Portal>
        <Dialog visible={deleteDialog} onDismiss={() => setDeleteDialog(false)}>
          <Dialog.Title>Delete Scenario?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this scenario? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialog(false)}>Cancel</Button>
            <Button onPress={confirmDelete} textColor={theme.colors.error}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={2000}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  headerWithHelp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textSecondary,
  },
  section: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  scenarioContainer: {
    marginBottom: SPACING.lg,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
  },
});
