import React, { useState } from 'react';
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
import Slider from '@react-native-community/slider';
import { WhatIfScenario, getSliderColor, formatCurrency } from '@projection/shared';

interface ScenarioCardProps {
  scenario: WhatIfScenario;
  onUpdate: (updates: Partial<WhatIfScenario>) => void;
  onDelete?: () => void;
  onClone?: () => void;
  isBaseline?: boolean;
  difference?: number;
}

export function ScenarioCard({
  scenario,
  onUpdate,
  onDelete,
  onClone,
  isBaseline = false,
  difference,
}: ScenarioCardProps) {
  const theme = useTheme();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(scenario.name);

  const saveName = () => {
    if (tempName.trim()) {
      onUpdate({ name: tempName.trim() });
    }
    setIsEditingName(false);
  };

  const returnColor = getSliderColor('return', scenario.returnRate);
  const inflationColor = getSliderColor('inflation', scenario.inflation);

  return (
    <Card style={styles.card} elevation={2}>
      <Card.Content>
        {/* Header with name */}
        <View style={styles.header}>
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

          {/* Difference chip */}
          {!isBaseline && difference !== undefined && (
            <Chip
              mode="flat"
              textStyle={{
                color: difference >= 0 ? '#69B47A' : '#FF6B6B',
                fontWeight: '600',
              }}
            >
              {difference >= 0 ? '+' : ''}
              {formatCurrency(difference)}
            </Chip>
          )}
        </View>

        <Divider style={styles.divider} />

        {/* Current Age Slider */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Text variant="bodyMedium" style={styles.label}>
              Current Age
            </Text>
            <Text variant="titleMedium" style={styles.value}>
              {scenario.age}
            </Text>
          </View>
          <Slider
            value={scenario.age}
            onValueChange={(value) => onUpdate({ age: Math.round(value) })}
            minimumValue={18}
            maximumValue={64}
            step={1}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor={theme.colors.primary}
          />
        </View>

        {/* Contribution Slider - Color Coded */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text variant="bodyMedium" style={styles.label}>
                Savings Rate
              </Text>
              <View style={{
                backgroundColor: scenario.contribution <= 25 ? '#69B47A' : scenario.contribution <= 40 ? '#FFB74D' : '#FF6B6B',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
              }}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>
                  {scenario.contribution <= 25 ? 'Conservative' : scenario.contribution <= 40 ? 'Moderate' : 'Aggressive'}
                </Text>
              </View>
            </View>
            <Text variant="titleMedium" style={styles.value}>
              {scenario.contribution}%
            </Text>
          </View>
          <Slider
            value={scenario.contribution}
            onValueChange={(value) => onUpdate({ contribution: Math.round(value) })}
            minimumValue={0}
            maximumValue={50}
            step={1}
            minimumTrackTintColor="#69B47A"
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor="#69B47A"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ fontSize: 10, color: '#999' }}>0%</Text>
            <Text style={{ fontSize: 10, color: '#999' }}>25% (Conservative)</Text>
            <Text style={{ fontSize: 10, color: '#999' }}>50%</Text>
          </View>
          <Text variant="bodySmall" style={styles.helperText}>
            % of $100k annual income
          </Text>
        </View>

        {/* Return Rate Slider - Color Coded */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text variant="bodyMedium" style={styles.label}>
                Expected Return
              </Text>
              <View style={{
                backgroundColor: scenario.returnRate < 5 ? '#FF6B6B' : scenario.returnRate <= 8 ? '#FFB74D' : '#69B47A',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
              }}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>
                  {scenario.returnRate < 5 ? 'Low' : scenario.returnRate <= 8 ? 'Average' : 'High'}
                </Text>
              </View>
            </View>
            <Text variant="titleMedium" style={[styles.value, { color: returnColor }]}>
              {scenario.returnRate}%
            </Text>
          </View>
          <Slider
            value={scenario.returnRate}
            onValueChange={(value) => onUpdate({ returnRate: Math.round(value * 2) / 2 })}
            minimumValue={0}
            maximumValue={15}
            step={0.5}
            minimumTrackTintColor={returnColor}
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor={returnColor}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ fontSize: 10, color: '#999' }}>0%</Text>
            <Text style={{ fontSize: 10, color: '#999' }}>5% (Low)</Text>
            <Text style={{ fontSize: 10, color: '#999' }}>8% (Avg)</Text>
            <Text style={{ fontSize: 10, color: '#999' }}>15%</Text>
          </View>
          <Text variant="bodySmall" style={styles.helperText}>
            Annual growth rate
          </Text>
        </View>

        {/* Inflation Slider - Color Coded */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text variant="bodyMedium" style={styles.label}>
                Inflation
              </Text>
              <View style={{
                backgroundColor: scenario.inflation < 2 ? '#69B47A' : scenario.inflation <= 4 ? '#FFB74D' : '#FF6B6B',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
              }}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>
                  {scenario.inflation < 2 ? 'Good' : scenario.inflation <= 4 ? 'Normal' : 'High'}
                </Text>
              </View>
            </View>
            <Text variant="titleMedium" style={[styles.value, { color: inflationColor }]}>
              {scenario.inflation}%
            </Text>
          </View>
          <Slider
            value={scenario.inflation}
            onValueChange={(value) => onUpdate({ inflation: Math.round(value * 10) / 10 })}
            minimumValue={0}
            maximumValue={6}
            step={0.1}
            minimumTrackTintColor={inflationColor}
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor={inflationColor}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ fontSize: 10, color: '#999' }}>0%</Text>
            <Text style={{ fontSize: 10, color: '#999' }}>2% (Good)</Text>
            <Text style={{ fontSize: 10, color: '#999' }}>4% (Normal)</Text>
            <Text style={{ fontSize: 10, color: '#999' }}>6%</Text>
          </View>
          <Text variant="bodySmall" style={styles.helperText}>
            Annual price increases
          </Text>
        </View>

        {/* Current Savings */}
        <View style={styles.sliderSection}>
          <Text variant="bodyMedium" style={styles.label}>
            Current Savings
          </Text>
          <TextInput
            value={scenario.currentSavings.toString()}
            onChangeText={(text) => {
              const value = parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
              onUpdate({ currentSavings: value });
            }}
            keyboardType="numeric"
            mode="outlined"
            left={<TextInput.Affix text="$" />}
            dense
            style={styles.savingsInput}
          />
        </View>

        {/* Actions */}
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
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    marginVertical: 12,
  },
  sliderSection: {
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: '500',
  },
  value: {
    fontWeight: '700',
  },
  helperText: {
    color: '#666',
    marginTop: 4,
  },
  savingsInput: {
    marginTop: 8,
    backgroundColor: '#fff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
});
