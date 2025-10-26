import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Card,
  Text,
  TextInput,
  IconButton,
  Chip,
  useTheme,
  Divider,
  Button,
} from 'react-native-paper';
import {
  InputFieldDefinition,
  WhatIfScenario,
  formatCurrency,
  getSliderMetadata,
  resolveSliderRangeIndicators,
  resolveSliderState,
  resolveSliderMilestones,
} from '@projection/shared';
import { SliderWithInfo } from './SliderWithInfo';
import { HelpIcon } from './HelpIcon';
import { helpContent } from '../lib/helpContent';

interface ScenarioGroup {
  id: string;
  title?: string;
  description?: string;
  fields: InputFieldDefinition[];
}

interface ScenarioCardProps {
  scenario: WhatIfScenario;
  fields: InputFieldDefinition[];
  groups?: ScenarioGroup[];
  onUpdate: (updates: Partial<WhatIfScenario>) => void;
  onDelete?: () => void;
  onClone?: () => void;
  isBaseline?: boolean;
  difference?: number;
  isActive?: boolean;
}

const formatNumber = (value: number, decimalPlaces?: number) => {
  if (decimalPlaces != null) {
    return Number(value.toFixed(decimalPlaces));
  }
  return value;
};

export function ScenarioCard({
  scenario,
  fields,
  groups,
  onUpdate,
  onDelete,
  onClone,
  isBaseline = false,
  difference,
  isActive = false,
}: ScenarioCardProps) {
  const theme = useTheme();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(scenario.name);

  const fieldMap = useMemo(() => {
    const map = new Map<string, InputFieldDefinition>();
    fields.forEach((field) => {
      map.set(field.id, field);
    });
    return map;
  }, [fields]);

  const resolveHelpTopic = useCallback((field: InputFieldDefinition) => {
    const rawKey = field.helpTopicId?.replace(/_help$/, '');
    if (!rawKey) {
      return undefined;
    }

    const calculatorTopics = helpContent.calculator as Record<string, { title: string; description: string }>;
    const remap: Record<string, string> = {
      age: 'currentAge',
      current_balance: 'currentBalance',
      annual_contribution: 'annualContribution',
      contribution_rate: 'contributionRate',
      expected_return: 'expectedReturn',
      inflation: 'inflation',
    };

    const normalizedKey = rawKey.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
    const candidateKeys = [rawKey, normalizedKey, remap[rawKey]];
    for (const key of candidateKeys) {
      if (key && calculatorTopics[key]) {
        return calculatorTopics[key];
      }
    }
    return undefined;
  }, []);

  const formState = useMemo(
    () => ({
      ...scenario,
      savingsRate: scenario.savingsRate ?? scenario.contribution ?? 0,
      targetAge: scenario.targetAge,
      income: scenario.income,
      targetIncome: scenario.targetIncome,
    }),
    [scenario],
  );

  const saveName = useCallback(() => {
    const trimmed = tempName.trim();
    if (trimmed) {
      onUpdate({ name: trimmed });
    }
    setIsEditingName(false);
  }, [tempName, onUpdate]);

  const handleFieldUpdate = useCallback(
    (fieldId: string, value: number | string) => {
      switch (fieldId) {
        case 'scenarioName':
          onUpdate({ name: String(value) });
          break;
        case 'age':
          onUpdate({ age: Number(value) });
          break;
        case 'savingsRate': {
          const numeric = Number(value);
          onUpdate({ savingsRate: numeric, contribution: numeric });
          break;
        }
        case 'expectedReturn':
          onUpdate({ returnRate: Number(value) });
          break;
        case 'inflation':
          onUpdate({ inflation: Number(value) });
          break;
        case 'currentSavings':
          onUpdate({ currentSavings: Number(value) });
          break;
        case 'income':
          onUpdate({ income: Number(value) });
          break;
        case 'targetAge':
          onUpdate({ targetAge: Number(value) });
          break;
        case 'targetIncome':
          onUpdate({ targetIncome: Number(value) });
          break;
        default:
          break;
      }
    },
    [onUpdate],
  );

  const renderSliderField = (field: InputFieldDefinition) => {
    const value =
      field.id === 'savingsRate'
        ? formState.savingsRate
        : field.id === 'expectedReturn'
        ? scenario.returnRate
        : field.id === 'inflation'
        ? scenario.inflation
        : field.id === 'age'
        ? scenario.age
        : field.id === 'targetAge'
        ? scenario.targetAge
        : 0;

    const metadata = getSliderMetadata(field);
    const rangeIndicators = resolveSliderRangeIndicators(metadata, { formState });
    const sliderState = resolveSliderState(metadata, {
      value,
      formState,
    });
    const milestones = resolveSliderMilestones(metadata);

    const trackColor =
      sliderState?.trackColor ?? sliderState?.badgeColor ?? '#69B47A';
    const badge = sliderState
      ? {
          label: sliderState.label,
          color: sliderState.badgeColor,
        }
      : undefined;
    const infoBox = sliderState?.info
      ? {
          title: sliderState.info.title ?? '',
          description: sliderState.info.description ?? '',
          backgroundColor:
            sliderState.backgroundColor ?? 'rgba(105, 180, 122, 0.1)',
        }
      : undefined;

    const step = field.constraints.step ?? 1;
    const decimalPlaces = field.constraints.decimalPlaces;
    const suffix =
      field.constraints.suffix ??
      (field.constraints.displayUnit === '%' ? '%' : '');
    const valueFormatter =
      typeof field.constraints.format === 'function'
        ? field.constraints.format
        : undefined;

    const milestoneThreshold = Math.max(step * 1.2, 0.25);
    const accessory = field.helpTopicId ? (
      <HelpIcon
        topicId={field.helpTopicId}
        helpTopic={resolveHelpTopic(field) as any}
        size={18}
      />
    ) : undefined;

    return (
      <View key={field.id} style={styles.sliderSection}>
        <SliderWithInfo
          title={field.label}
          titleAccessory={accessory}
          value={value}
          min={field.constraints.min}
          max={
            typeof field.constraints.conditionalMax === 'function'
              ? field.constraints.conditionalMax(formState)
              : field.constraints.max
          }
          step={step}
          suffix={suffix}
          onValueChange={(next) =>
            handleFieldUpdate(field.id, formatNumber(next, decimalPlaces))
          }
          trackColor={trackColor}
          badge={badge}
          rangeIndicators={rangeIndicators}
          infoBox={infoBox}
          milestones={milestones}
          milestoneThreshold={milestoneThreshold}
          valueFormatter={
            valueFormatter
              ? (val) => valueFormatter(Number(val))
              : undefined
          }
        />
      </View>
    );
  };

  const renderField = (field: InputFieldDefinition) => {
    switch (field.id) {
      case 'scenarioName':
        return (
          <View key={field.id} style={styles.nameSection}>
            {isEditingName ? (
              <View style={styles.nameEdit}>
                <TextInput
                  value={tempName}
                  onChangeText={setTempName}
                  mode="outlined"
                  dense
                  style={styles.nameInput}
                  onSubmitEditing={saveName}
                  autoFocus
                />
                <IconButton icon="check" size={20} onPress={saveName} />
              </View>
            ) : (
              <View style={styles.nameDisplay}>
                <Text variant="titleMedium" style={styles.name}>
                  {scenario.name}
                </Text>
                {!isBaseline && (
                  <IconButton
                    icon="pencil"
                    size={18}
                    onPress={() => {
                      setTempName(scenario.name);
                      setIsEditingName(true);
                    }}
                  />
                )}
              </View>
            )}
          </View>
        );
      case 'currentSavings':
      case 'income':
      case 'targetIncome':
        return (
          <View key={field.id} style={styles.inputSection}>
            <View style={styles.labelWithHelp}>
              <Text variant="bodyMedium" style={styles.label}>
                {field.label}
              </Text>
              {field.helpTopicId && (
                <HelpIcon
                  topicId={field.helpTopicId}
                  helpTopic={resolveHelpTopic(field) as any}
                  size={18}
                />
              )}
            </View>
            <TextInput
              value={String(
                field.id === 'currentSavings'
                  ? scenario.currentSavings
                  : field.id === 'income'
                  ? scenario.income
                  : scenario.targetIncome,
              )}
              onChangeText={(text) => {
                const numeric = parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
                handleFieldUpdate(field.id, numeric);
              }}
              keyboardType="numeric"
              mode="outlined"
              dense
              left={<TextInput.Affix text="$" />}
              style={styles.savingsInput}
            />
          </View>
        );
      case 'age':
      case 'savingsRate':
      case 'expectedReturn':
      case 'inflation':
      case 'targetAge':
        return renderSliderField(field);
      default:
        return null;
    }
  };

  const renderGroupedFields = () => {
    if (!groups || groups.length === 0) {
      return fields
        .filter((field) => field.id !== 'scenarioName')
        .map(renderField);
    }

    return groups.map((group) => (
      <View key={group.id} style={styles.groupSection}>
        {group.title ? (
          <Text variant="titleSmall" style={styles.groupTitle}>
            {group.title}
          </Text>
        ) : null}
        {group.description ? (
          <Text variant="bodySmall" style={styles.groupDescription}>
            {group.description}
          </Text>
        ) : null}
        {group.fields
          .filter((field) => field.id !== 'scenarioName')
          .map((field) => renderField(field))}
      </View>
    ));
  };

  return (
    <Card style={[styles.card, isActive && styles.activeCard]} elevation={isActive ? 4 : 2}>
      <Card.Content>
        <View style={styles.header}>
          {renderField(fields.find((f) => f.id === 'scenarioName')!)}
          {!isBaseline && difference !== undefined && (
            <Chip
              mode="flat"
              textStyle={{
                color: difference >= 0 ? '#69B47A' : '#FF6B6B',
                fontWeight: '600',
              }}
              style={{
                backgroundColor:
                  difference >= 0 ? 'rgba(105, 180, 122, 0.12)' : 'rgba(255, 107, 107, 0.12)',
              }}
            >
              {difference >= 0 ? '+' : ''}
              {formatCurrency(difference)}
            </Chip>
          )}
        </View>

        <Divider style={styles.divider} />

        {renderGroupedFields()}

        {!isBaseline && (
          <View style={styles.actions}>
            {onClone && (
              <Button
                mode="outlined"
                onPress={onClone}
                icon="content-copy"
                compact
                style={styles.actionButton}
              >
                Clone
              </Button>
            )}
            {onDelete && (
              <Button
                mode="text"
                onPress={onDelete}
                icon="delete"
                textColor={theme.colors.error}
                compact
                style={styles.actionButton}
              >
                Delete
              </Button>
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: '#4ABDAD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameSection: {
    flex: 1,
    marginRight: 8,
  },
  nameDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    fontWeight: '600',
  },
  nameEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nameInput: {
    flex: 1,
    marginRight: 8,
  },
  divider: {
    marginVertical: 8,
  },
  sliderSection: {
    marginBottom: 16,
  },
  labelWithHelp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontWeight: '500',
  },
  inputSection: {
    marginBottom: 16,
  },
  savingsInput: {
    marginTop: 8,
    backgroundColor: '#fff',
  },
  groupSection: {
    marginBottom: 16,
    gap: 8,
  },
  groupTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  groupDescription: {
    color: '#4F5D57',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
});
