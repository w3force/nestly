import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, TextInput, Card, SegmentedButtons, useTheme } from 'react-native-paper';
import { QuickModeInputs, ClaimAge, getFRA, US_STATES, getHelpTopic } from '@projection/shared';
import { HelpIcon, PickerSelect } from '../../../components';

interface QuickFormProps {
  inputs: QuickModeInputs;
  onChange: (inputs: QuickModeInputs) => void;
  disabled?: boolean;
}

const CLAIM_AGES: ClaimAge[] = [62, 63, 64, 65, 66, 67, 68, 69, 70];

export function QuickForm({ inputs, onChange, disabled = false }: QuickFormProps) {
  const theme = useTheme();

  const handleChange = (field: keyof QuickModeInputs, value: any) => {
    onChange({ ...inputs, [field]: value });
  };

  const fra = getFRA(inputs.birthYear);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Quick Estimate - Just 5 Questions
          </Text>
          <Text variant="bodySmall" style={styles.subtitle}>
            Provide minimal information for a fast estimate. Switch to Detailed mode for full control.
          </Text>

          <View style={styles.form}>
            {/* Birth Year */}
            <View style={styles.field}>
              <View style={styles.inputWithHelp}>
                <TextInput
                  label="What year were you born?"
                  value={inputs.birthYear.toString()}
                  onChangeText={(text) => handleChange('birthYear', parseInt(text) || 1960)}
                  keyboardType="numeric"
                  disabled={disabled}
                  mode="outlined"
                  style={[styles.input, styles.flexInput]}
                  outlineColor={theme.colors.outlineVariant}
                  activeOutlineColor={theme.colors.primary}
                />
                <HelpIcon topicId="fullRetirementAge" helpTopic={getHelpTopic('fullRetirementAge')} />
              </View>
              <Text variant="bodySmall" style={styles.helperText}>
                Your Full Retirement Age: {fra}
              </Text>
            </View>

            {/* Claim Age */}
            <View style={styles.field}>
              <View style={styles.labelWithHelp}>
                <Text variant="bodyMedium" style={styles.label}>
                  When do you plan to start benefits?
                </Text>
                <HelpIcon topicId="claimingAge" helpTopic={getHelpTopic('claimingAge')} />
              </View>
              <PickerSelect
                options={CLAIM_AGES.map((age) => ({
                  label: `Age ${age}${age === fra ? ' (Full Retirement Age)' : ''}`,
                  value: age,
                }))}
                selectedValue={inputs.claimAge}
                onValueChange={(value: any) => handleChange('claimAge', value)}
                disabled={disabled}
              />
              <Text variant="bodySmall" style={styles.helperText}>
                Age 67 is the full retirement age for most people born after 1960
              </Text>
            </View>

            {/* Annual Income */}
            <View style={styles.field}>
              <View style={styles.inputWithHelp}>
                <TextInput
                  label="What's your typical annual income?"
                  value={inputs.incomeToday.toString()}
                  onChangeText={(text) => handleChange('incomeToday', parseInt(text) || 0)}
                  keyboardType="numeric"
                  disabled={disabled}
                  mode="outlined"
                  style={[styles.input, styles.flexInput]}
                  outlineColor={theme.colors.outlineVariant}
                  activeOutlineColor={theme.colors.primary}
                  left={<TextInput.Affix text="$" />}
                />
                <HelpIcon topicId="primaryInsuranceAmount" helpTopic={getHelpTopic('primaryInsuranceAmount')} />
              </View>
              <Text variant="bodySmall" style={styles.helperText}>
                Your average salary over your working career
              </Text>
            </View>

            {/* Years Worked */}
            <View style={styles.field}>
              <View style={styles.inputWithHelp}>
                <TextInput
                  label="How many years have you worked?"
                  value={inputs.yearsWorked.toString()}
                  onChangeText={(text) => handleChange('yearsWorked', parseInt(text) || 0)}
                  keyboardType="numeric"
                  disabled={disabled}
                  mode="outlined"
                  style={[styles.input, styles.flexInput]}
                  outlineColor={theme.colors.outlineVariant}
                  activeOutlineColor={theme.colors.primary}
                />
                <HelpIcon topicId="primaryInsuranceAmount" helpTopic={getHelpTopic('primaryInsuranceAmount')} />
              </View>
              <Text variant="bodySmall" style={styles.helperText}>
                Total years with Social Security earnings
              </Text>
            </View>

            {/* State */}
            <View style={styles.field}>
              <View style={styles.labelWithHelp}>
                <Text variant="bodyMedium" style={styles.label}>
                  What state do you live in?
                </Text>
                <HelpIcon topicId="irmaa" helpTopic={getHelpTopic('irmaa')} />
              </View>
              <PickerSelect
                options={Object.entries(US_STATES).map(([code, name]) => ({
                  label: name as string,
                  value: code,
                }))}
                selectedValue={inputs.stateCode}
                onValueChange={(value: any) => handleChange('stateCode', value)}
                disabled={disabled}
              />
              <Text variant="bodySmall" style={styles.helperText}>
                Used for Medicaid eligibility calculations
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  title: {
    marginBottom: 8,
    fontWeight: '700',
  },
  subtitle: {
    marginBottom: 24,
    opacity: 0.7,
  },
  form: {
    gap: 20,
  },
  field: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  inputWithHelp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flexInput: {
    flex: 1,
  },
  labelWithHelp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontWeight: '600',
    marginBottom: 0,
  },
  helperText: {
    marginTop: 4,
    opacity: 0.7,
  },
  pickerDisplayContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(74, 189, 172, 0.35)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    position: 'relative',
  },
  pickerDisplay: {
    fontWeight: '600',
    color: '#1F4D47',
    fontSize: 16,
  },
});
