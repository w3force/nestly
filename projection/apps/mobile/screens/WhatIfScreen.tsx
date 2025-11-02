import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Animated, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  useTheme,
  Chip,
  Portal,
  Dialog,
  Button,
  Snackbar,
  Modal,
  Divider,
} from 'react-native-paper';
import { COLORS, SPACING, BORDER_RADIUS } from '@projection/shared';
import {
  WhatIfScenario,
  DEFAULT_BASELINE,
  createScenario,
  compareScenarios,
  calculateDifference,
  formatCurrency,
  getHelpTopic,
  getScreenDefinition,
  getFieldDefinition,
  ScreenDefinition,
  InputFieldDefinition,
} from '@projection/shared';
import { ScenarioCard, ComparisonChart, HelpIcon } from '../components';
import ScenarioDock, { ScenarioSummary } from '../components/ScenarioDock';
import { useFeatureLimit } from '../contexts/TierContext';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const normalizeScenario = (scenario: WhatIfScenario): WhatIfScenario => {
  const savingsRate = scenario.savingsRate ?? scenario.contribution ?? 0;
  const income = scenario.income ?? 100000;
  const targetAge = scenario.targetAge ?? 65;
  const targetIncome = scenario.targetIncome ?? 70000;
  return {
    ...scenario,
    savingsRate,
    contribution: savingsRate,
    income,
    targetAge,
    targetIncome,
  };
};

const PAGE_ICON_NAME = 'chart-line-variant';
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function WhatIfScreen() {
  const theme = useTheme();
  const tierMaxScenarios = useFeatureLimit('maxScenarios');
  const maxScenarios = Math.max(tierMaxScenarios || 0, 10);
  const whatIfScreen = useMemo<ScreenDefinition>(() => getScreenDefinition('whatif'), []);
  const scenarioGroups = useMemo<Array<{
    id: string;
    title?: string;
    description?: string;
    fields: InputFieldDefinition[];
  }>>(() => {
    const groups = (whatIfScreen.metadata?.scenarioGroups as Array<{
      id: string;
      title?: string;
      description?: string;
      fields: string[];
    }>) || [];

    if (groups.length === 0) {
      const section = whatIfScreen.sections.find((s) => s.id === 'baseline');
      if (!section) {
        return [];
      }
      return [
        {
          id: 'default',
          title: undefined,
          description: undefined,
          fields: section.fields.map((fieldId) => getFieldDefinition(fieldId)),
        },
      ];
    }

    return groups.map((group) => ({
      ...group,
      fields: group.fields.map((fieldId) => getFieldDefinition(fieldId)),
    }));
  }, [whatIfScreen]);

  const scenarioFieldDefinitions = useMemo(() => {
    if (!scenarioGroups || scenarioGroups.length === 0) {
      return [];
    }
    return scenarioGroups.flatMap((group) => group.fields);
  }, [scenarioGroups]);
  
  const [baseline, setBaseline] = useState<WhatIfScenario>(() => normalizeScenario(DEFAULT_BASELINE));
  const [scenarios, setScenarios] = useState<WhatIfScenario[]>([
    normalizeScenario(createScenario(1)),
  ]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [activeScenarioId, setActiveScenarioId] = useState<string>('baseline');
  const [scenarioPickerVisible, setScenarioPickerVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'balance' | 'breakdown'>('balance');
  const [showAllScenarios, setShowAllScenarios] = useState(true);

  const scrollViewRef = useRef<ScrollView | null>(null);
  const scenarioPositions = useRef<Record<string, number>>({});
  const scenarioSectionOffset = useRef<number>(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const topContentPadding = useMemo(
    () => SPACING.lg + Math.max(insets.top - SPACING.md, 0),
    [insets.top],
  );
  const headerOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [40, 120],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );
  const headerTranslate = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, 120],
        outputRange: [-16, 0],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );

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

  useEffect(() => {
    if (
      activeScenarioId !== 'baseline' &&
      activeScenarioId !== 'results' &&
      !scenarios.some((s) => s.id === activeScenarioId)
    ) {
      setActiveScenarioId('baseline');
    }
  }, [scenarios, activeScenarioId]);

  const scenarioSummaries = useMemo<ScenarioSummary[]>(
    () => [
      { id: 'baseline', name: baseline.name || 'Baseline' },
      ...scenarios.map((scenario) => ({ id: scenario.id, name: scenario.name || scenario.id })),
    ],
    [baseline.name, scenarios],
  );

  const dockEntries = useMemo(
    () =>
      scenarios.length > 0
        ? [...scenarioSummaries, { id: 'results', name: 'Results' }]
        : [...scenarioSummaries],
    [scenarioSummaries, scenarios.length],
  );

  const scenarioOrder = useMemo(() => {
    const order = ['baseline', ...scenarios.map((s) => s.id)];
    if (scenarios.length > 0) {
      order.push('results');
    }
    return order;
  }, [scenarios]);

  const activeScenario = useMemo(() => {
    if (activeScenarioId === 'baseline') {
      return null;
    }
    return scenarios.find((scenario) => scenario.id === activeScenarioId) ?? null;
  }, [activeScenarioId, scenarios]);

  const visibleScenarios = useMemo(() => {
    if (showAllScenarios) {
      return scenarios;
    }
    if (activeScenarioId === 'baseline') {
      return scenarios.slice(0, 1);
    }
    const selected = scenarios.find((scenario) => scenario.id === activeScenarioId);
    return selected ? [selected] : scenarios.slice(0, 1);
  }, [scenarios, showAllScenarios, activeScenarioId]);

  const currentDockItem = useMemo(() => {
    const resolved = dockEntries.find((entry) => entry.id === activeScenarioId);
    return resolved ?? dockEntries[0];
  }, [activeScenarioId, dockEntries]);

  const dockResultLabel = useMemo(() => {
    if (!activeScenario) {
      return null;
    }
    const diff = calculateDifference(activeScenario, baseline);
    if (!Number.isFinite(diff)) {
      return null;
    }
    const formatted = formatCurrency(Math.abs(diff));
    if (diff === 0) {
      return `±${formatted}`;
    }
    return `${diff > 0 ? '+' : '-'}${formatted}`;
  }, [activeScenario, baseline]);

  const canAddScenario = scenarios.length < maxScenarios;

  const scrollToScenario = useCallback(
    (id: string) => {
      const attemptScroll = (remainingTries: number) => {
        const position = scenarioPositions.current[id];
        if (position != null) {
          const buffer = Math.max(topContentPadding + SPACING.xxxl + 12, 0);
          const target = Math.max(position - buffer, 0);
          scrollViewRef.current?.scrollTo({ y: target, animated: true });
        } else if (remainingTries > 0) {
          requestAnimationFrame(() => attemptScroll(remainingTries - 1));
        } else if (id === 'baseline') {
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        } else if (id === 'results') {
          scrollViewRef.current?.scrollToEnd?.({ animated: true });
        }
      };

      requestAnimationFrame(() => attemptScroll(4));
    },
    [topContentPadding],
  );

  const handleSelectScenario = useCallback(
    (id: string, options?: { closePicker?: boolean }) => {
      setActiveScenarioId(id);
      if (options?.closePicker !== false) {
        setScenarioPickerVisible(false);
      }
      // Scroll to scenario after state update
      requestAnimationFrame(() => scrollToScenario(id));
    },
    [scrollToScenario],
  );

  const handleCycleScenario = useCallback(
    (direction: -1 | 1) => {
      if (scenarioOrder.length === 0) {
        return;
      }
      const currentIndex = scenarioOrder.indexOf(activeScenarioId);
      const nextIndex = (currentIndex + direction + scenarioOrder.length) % scenarioOrder.length;
      const nextId = scenarioOrder[nextIndex];
      handleSelectScenario(nextId, { closePicker: false });
    },
    [activeScenarioId, handleSelectScenario, scenarioOrder],
  );

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
        setActiveScenarioId('baseline');
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
    setScenarios((prev) => [...prev, newScenario]);
    setActiveScenarioId(newScenario.id);
    setSnackbar({ visible: true, message: 'New scenario added' });
    setTimeout(() => scrollToScenario(newScenario.id), 300);
  };

  const handleDeleteScenario = (id: string) => {
    setSelectedScenario(id);
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedScenario) {
      setScenarios((prev) => prev.filter((s) => s.id !== selectedScenario));
      setSnackbar({ visible: true, message: 'Scenario deleted' });
      if (activeScenarioId === selectedScenario) {
        setActiveScenarioId('baseline');
        requestAnimationFrame(() => scrollToScenario('baseline'));
      }
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F2FBF5' }]} edges={['left', 'right']}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.collapsedHeader,
          {
            paddingTop: insets.top,
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }],
          },
        ]}
      >
        <View style={styles.collapsedHeaderContent}>
          <View style={styles.collapsedHeaderIcon}>
            <MaterialCommunityIcons
              name={PAGE_ICON_NAME}
              size={18}
              color="#264336"
            />
          </View>
          <Text variant="titleMedium" style={styles.collapsedHeaderTitle}>
            What-If Planner
          </Text>
        </View>
      </Animated.View>
      <AnimatedScrollView
        ref={scrollViewRef as any}
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topContentPadding },
        ]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <LinearGradient
          colors={["#E9F7EF", "#D9F1E6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.brandHeader}
        >
          <View style={styles.brandHeaderContent}>
            <View style={styles.brandIconBadge}>
              <MaterialCommunityIcons
                name={PAGE_ICON_NAME}
                size={26}
                color="#2E7D32"
              />
            </View>
            <View>
              <Text variant="titleLarge" style={styles.brandTitle}>
                Nestly Planner
              </Text>
              <Text variant="bodySmall" style={styles.brandSubtitle}>
                What-If Scenarios
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View
          style={styles.section}
          onLayout={(event) => {
            scenarioPositions.current['baseline'] = event.nativeEvent.layout.y;
          }}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                🎯 Baseline
              </Text>
              <View style={styles.inlineHelpIcon}>
                <HelpIcon topicId="whatIfScenarios" helpTopic={getHelpTopic('whatIfScenarios')} />
              </View>
            </View>
            <Chip
              mode="flat"
              style={{ backgroundColor: 'rgba(105, 180, 122, 0.14)' }}
              textStyle={{ color: '#2E7D32', fontWeight: '600' }}
            >
              Reference
            </Chip>
          </View>
          <ScenarioCard
            scenario={baseline}
            fields={scenarioFieldDefinitions}
            groups={scenarioGroups}
            onUpdate={(updates: Partial<WhatIfScenario>) => handleUpdateScenario('baseline', updates)}
            isBaseline
            isActive={activeScenarioId === 'baseline'}
          />
        </View>

        <View
          style={styles.section}
          onLayout={(event) => {
            scenarioSectionOffset.current = event.nativeEvent.layout.y;
          }}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                🔮 What-If Scenarios
              </Text>
              <View style={styles.inlineHelpIcon}>
                <HelpIcon topicId="savingsRate" helpTopic={getHelpTopic('savingsRate')} />
              </View>
            </View>
            <Chip
              mode="flat"
              style={{ backgroundColor: 'rgba(74, 189, 172, 0.12)' }}
              textStyle={{ color: COLORS.primary, fontWeight: '600' }}
            >
              {scenarios.length}/{maxScenarios}
            </Chip>
          </View>

          {visibleScenarios.map((scenario) => {
            const diff = calculateDifference(scenario, baseline);
            return (
              <View
                key={scenario.id}
                style={styles.scenarioContainer}
                onLayout={(event) => {
                  scenarioPositions.current[scenario.id] =
                    scenarioSectionOffset.current + event.nativeEvent.layout.y;
                }}
              >
                <ScenarioCard
                  scenario={scenario}
                  fields={scenarioFieldDefinitions}
                  groups={scenarioGroups}
                  onUpdate={(updates: Partial<WhatIfScenario>) => handleUpdateScenario(scenario.id, updates)}
                  onDelete={() => handleDeleteScenario(scenario.id)}
                  difference={diff}
                  isActive={activeScenarioId === scenario.id}
                />
              </View>
            );
          })}
        </View>

        {scenarios.length > 0 && (
          <View
            style={styles.section}
            onLayout={(event) => {
              scenarioPositions.current['results'] = event.nativeEvent.layout.y;
            }}
          >
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                {viewMode === 'balance' ? '📊 Balance Comparison' : '🧾 Breakdown'}
              </Text>
              <HelpIcon topicId="compoundGrowth" helpTopic={getHelpTopic('compoundGrowth')} />
            </View>
            <View style={styles.resultsToolbar}>
              <View style={styles.modeToggleRow}>
                <TouchableOpacity
                  style={[styles.modePill, viewMode === 'balance' && styles.modePillActive]}
                  onPress={() => setViewMode('balance')}
                  activeOpacity={0.85}
                >
                  <Text
                    variant="labelMedium"
                    style={[styles.modePillLabel, viewMode === 'balance' && styles.modePillLabelActive]}
                  >
                    Balance
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modePill, viewMode === 'breakdown' && styles.modePillActive]}
                  onPress={() => setViewMode('breakdown')}
                  activeOpacity={0.85}
                >
                  <Text
                    variant="labelMedium"
                    style={[styles.modePillLabel, viewMode === 'breakdown' && styles.modePillLabelActive]}
                  >
                    Breakdown
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.resultsToggleGroup}>
                <Text variant="labelMedium" style={styles.toggleLabel}>Show All</Text>
                <Switch
                  value={showAllScenarios}
                  onValueChange={setShowAllScenarios}
                  thumbColor={showAllScenarios ? '#FFFFFF' : '#F4F4F4'}
                  trackColor={{ false: 'rgba(48,64,58,0.25)', true: '#69B47A' }}
                  ios_backgroundColor="rgba(48,64,58,0.25)"
                  style={styles.toggleSwitch}
                />
              </View>
            </View>
            {viewMode === 'balance' ? (
              <ComparisonChart
                baseline={comparison.baseline}
                scenarios={comparison.scenarios}
                width={screenWidth - 32}
              />
            ) : (
              <View style={styles.breakdownPlaceholder}>
                <Text variant="bodyMedium" style={styles.breakdownTitle}>
                  Scenario Breakdown Coming Soon
                </Text>
                <Text variant="bodySmall" style={styles.breakdownDescription}>
                  Toggle back to Balance to compare projected portfolio growth while we finish
                  the detailed breakdown view.
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </AnimatedScrollView>

      {currentDockItem && (
        <ScenarioDock
          currentScenario={currentDockItem}
          scenarios={dockEntries}
          onCycle={handleCycleScenario}
          onOpenPicker={() => setScenarioPickerVisible(true)}
          onAddScenario={handleAddScenario}
          canAddScenario={canAddScenario}
          resultLabel={dockResultLabel}
          onRemoveScenario={
            activeScenario ? () => handleDeleteScenario(activeScenario.id) : undefined
          }
          canRemoveScenario={Boolean(activeScenario)}
        />
      )}

      <Portal>
        <Modal
          visible={scenarioPickerVisible}
          onDismiss={() => setScenarioPickerVisible(false)}
          contentContainerStyle={[styles.pickerContainer, { backgroundColor: theme.colors.background }]}
        >
          <Text variant="titleMedium" style={styles.pickerTitle}>
            Switch Scenario
          </Text>
          <Divider />
          <View style={styles.pickerList}>
            {dockEntries.map((summary) => {
              const isActive = summary.id === activeScenarioId;
              return (
                <TouchableOpacity
                  key={summary.id}
                  style={[styles.pickerRow, isActive && styles.pickerRowActive]}
                  onPress={() => handleSelectScenario(summary.id)}
                  activeOpacity={0.85}
                >
                  <View style={{ flex: 1 }}>
                    <Text variant="titleMedium" style={styles.pickerRowTitle} numberOfLines={1}>
                      {summary.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.pickerRowSubtitle}>
                      {summary.id === 'baseline'
                        ? 'Reference scenario'
                        : summary.id === 'results'
                        ? 'Results overview'
                        : 'What-if scenario'}
                    </Text>
                  </View>
                  {isActive ? (
                    <Chip mode="flat" compact style={styles.activeChip} textStyle={styles.activeChipText}>
                      Active
                    </Chip>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
          <Button onPress={() => setScenarioPickerVisible(false)} style={styles.pickerCloseButton}>
            Close
          </Button>
        </Modal>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  collapsedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(48, 64, 58, 0.08)',
    backgroundColor: '#F2FBF5',
    zIndex: 20,
  },
  collapsedHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  collapsedHeaderIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(74, 189, 172, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 189, 172, 0.24)',
  },
  collapsedHeaderTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#264336',
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl * 3,
    backgroundColor: '#F2FBF5',
  },
  resultsToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  modeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modePill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(48, 64, 58, 0.08)',
    marginRight: SPACING.xs,
  },
  modePillActive: {
    backgroundColor: '#2E7D32',
  },
  modePillLabel: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  modePillLabelActive: {
    color: '#FFFFFF',
  },
  resultsToggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  toggleLabel: {
    color: '#30403A',
    fontWeight: '600',
  },
  toggleSwitch: {
    marginLeft: SPACING.xs,
  },
  breakdownPlaceholder: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: 'rgba(74, 189, 172, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(74, 189, 172, 0.18)',
  },
  breakdownTitle: {
    fontWeight: '600',
    color: '#264336',
    marginBottom: SPACING.xs,
  },
  breakdownDescription: {
    color: 'rgba(48, 64, 58, 0.75)',
    lineHeight: 18,
  },
  brandHeader: {
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  brandHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  brandIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(74, 189, 172, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 189, 172, 0.25)',
  },
  brandTitle: {
    fontWeight: '700',
    color: '#264336',
  },
  brandSubtitle: {
    color: '#3F6B59',
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineHelpIcon: {
    marginLeft: SPACING.sm,
  },
  sectionTitle: {
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontSize: 18,
    lineHeight: 24,
  },
  scenarioContainer: {
    marginBottom: SPACING.md,
  },
  bottomSpacer: {
    height: 160,
  },
  pickerContainer: {
    marginHorizontal: SPACING.lg,
    borderRadius: 24,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  pickerTitle: {
    fontWeight: '700',
    marginBottom: SPACING.sm,
    color: COLORS.textPrimary,
  },
  pickerList: {
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 16,
  },
  pickerRowActive: {
    backgroundColor: 'rgba(74, 189, 172, 0.1)',
  },
  pickerRowTitle: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  pickerRowSubtitle: {
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  pickerCloseButton: {
    marginTop: SPACING.md,
  },
  activeChip: {
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
