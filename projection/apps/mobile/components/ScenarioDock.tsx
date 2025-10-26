import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, IconButton, Icon } from 'react-native-paper';
import { COLORS, SPACING } from '@projection/shared';

export interface ScenarioSummary {
  id: string;
  name: string;
}

interface ScenarioDockProps {
  currentScenario: ScenarioSummary;
  scenarios: ScenarioSummary[];
  onCycle: (direction: -1 | 1) => void;
  onOpenPicker: () => void;
  onAddScenario: () => void;
  canAddScenario: boolean;
}

export const ScenarioDock: React.FC<ScenarioDockProps> = ({
  currentScenario,
  scenarios,
  onCycle,
  onOpenPicker,
  onAddScenario,
  canAddScenario,
}) => {
  const hasMultiple = scenarios.length > 1;

  return (
    <Surface style={styles.container} elevation={4}>
      <View style={styles.controlsRow}>
        <IconButton
          icon="chevron-left"
          disabled={!hasMultiple}
          onPress={() => onCycle(-1)}
          style={styles.navButton}
          iconColor={COLORS.primary}
          containerColor="rgba(74, 189, 172, 0.08)"
        />

        <TouchableOpacity style={styles.currentChip} onPress={onOpenPicker} activeOpacity={0.8}>
          <Text variant="labelLarge" style={styles.currentLabel} numberOfLines={1}>
            {currentScenario.name}
          </Text>
          <Icon source="chevron-up" size={18} color={COLORS.primary} style={styles.chevronIcon} />
        </TouchableOpacity>

        <IconButton
          icon="chevron-right"
          disabled={!hasMultiple}
          onPress={() => onCycle(1)}
          style={styles.navButton}
          iconColor={COLORS.primary}
          containerColor="rgba(74, 189, 172, 0.08)"
        />

        <IconButton
          icon="plus"
          onPress={onAddScenario}
          disabled={!canAddScenario}
          style={styles.addButton}
          iconColor="#FFFFFF"
          containerColor={COLORS.primary}
        />
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SPACING.lg,
    right: SPACING.lg,
    bottom: SPACING.xxxl + SPACING.sm,
    borderRadius: 24,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: '#FFFFFF',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  navButton: {
    margin: 0,
  },
  addButton: {
    margin: 0,
    backgroundColor: COLORS.primary,
  },
  currentChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    backgroundColor: 'rgba(74, 189, 172, 0.12)',
  },
  currentLabel: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  chevronIcon: {
    marginLeft: SPACING.xs,
  },
});

export default ScenarioDock;
