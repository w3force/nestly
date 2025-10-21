import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  TextInput,
  List,
  Switch,
  SegmentedButtons,
  HelperText,
  Divider,
  Text,
  useTheme,
} from 'react-native-paper';
import { PickerSelect } from '../../../components';
import {
  DetailedModeInputs,
  ClaimAge,
  FilingStatus,
  PlanType,
  US_STATES,
  getFRA,
  getHelpTopic,
} from '@projection/shared';
import { HelpIcon } from '../../../components';

interface DetailedFormProps {
  inputs: DetailedModeInputs;
  onChange: (inputs: DetailedModeInputs) => void;
  disabled?: boolean;
}

const CLAIM_AGES: ClaimAge[] = [62, 63, 64, 65, 66, 67, 68, 69, 70];

export function DetailedForm({ inputs, onChange, disabled = false }: DetailedFormProps) {
  const theme = useTheme();
  const [expandedSection, setExpandedSection] = React.useState<string | null>('basic');

  const handleChange = (field: keyof DetailedModeInputs, value: any) => {
    onChange({ ...inputs, [field]: value });
  };

  const handleEarningsChange = (index: number, amount: string) => {
    const updated = [...(inputs.earningsHistory || [])];
    updated[index] = {
      ...updated[index],
      amount: parseFloat(amount) || 0,
    };
    handleChange('earningsHistory', updated);
  };

  // Generate years for earnings history (35 years from 1989-2024 by default)
  const generateEarningsYears = () => {
    const currentYear = new Date().getFullYear();
    const years: { year: number; amount: number }[] = [];
    for (let i = 34; i >= 0; i--) {
      const year = currentYear - i;
      const existing = inputs.earningsHistory?.find((e) => e.year === year);
      years.push(existing || { year, amount: 0 });
    }
    return years;
  };

  const earningsYears = generateEarningsYears();
  const fra = getFRA(inputs.birthYear);

  return (
    <ScrollView style={styles.container}>
      {/* Basic Information Accordion */}
      <List.Accordion
        title="Basic Information"
        expanded={expandedSection === 'basic'}
        onPress={() => setExpandedSection(expandedSection === 'basic' ? null : 'basic')}
        left={(props) => <List.Icon {...props} icon="account" />}
        right={() => <HelpIcon topicId="claimingAge" helpTopic={getHelpTopic('claimingAge')} />}
        style={styles.accordion}
      >
        <View style={styles.sectionContent}>
          <View style={styles.inputWithHelp}>
            <TextInput
              label="Birth Year"
              value={inputs.birthYear.toString()}
              onChangeText={(text) => handleChange('birthYear', parseInt(text) || 1960)}
              keyboardType="numeric"
              disabled={disabled}
              mode="outlined"
              style={[styles.input, styles.flexInput]}
            />
            <HelpIcon topicId="fullRetirementAge" helpTopic={getHelpTopic('fullRetirementAge')} />
          </View>
          <HelperText type="info">
            Year you were born (FRA: {fra})
          </HelperText>

          <View style={styles.pickerContainer}>
            <View style={styles.labelWithHelp}>
              <Text variant="labelLarge" style={styles.pickerLabel}>
                Claim Age
              </Text>
              <HelpIcon topicId="claimingAge" helpTopic={getHelpTopic('claimingAge')} />
            </View>
            <PickerSelect
              options={CLAIM_AGES.map((age) => ({
                label: `Age ${age}`,
                value: age,
              }))}
              selectedValue={inputs.claimAge}
              onValueChange={(value: any) => handleChange('claimAge', value)}
              disabled={disabled}
            />
            <HelperText type="info">
              Age when you plan to start Social Security
            </HelperText>
          </View>

          <View style={styles.pickerContainer}>
            <Text variant="labelLarge" style={styles.pickerLabel}>
              Filing Status
            </Text>
            <PickerSelect
              options={[
                { label: 'Single', value: 'SINGLE' },
                { label: 'Married Filing Jointly', value: 'MARRIED' },
              ]}
              selectedValue={inputs.filingStatus}
              onValueChange={(value: any) => handleChange('filingStatus', value)}
              disabled={disabled}
            />
            <HelperText type="info">
              Affects IRMAA bracket calculations
            </HelperText>
          </View>
        </View>
      </List.Accordion>

      {/* Earnings History Accordion */}
      <List.Accordion
        title="Earnings History"
        description={inputs.useAIME ? 'Using AIME directly' : '35-year earnings'}
        expanded={expandedSection === 'earnings'}
        onPress={() => setExpandedSection(expandedSection === 'earnings' ? null : 'earnings')}
        left={(props) => <List.Icon {...props} icon="cash" />}
        style={styles.accordion}
      >
        <View style={styles.sectionContent}>
          <View style={styles.switchRow}>
            <Text variant="bodyLarge">Use AIME Directly</Text>
            <Switch
              value={inputs.useAIME}
              onValueChange={(value) => handleChange('useAIME', value)}
              disabled={disabled}
            />
          </View>
          <HelperText type="info">
            Toggle on to enter AIME from SSA.gov, or off to input 35 years of earnings
          </HelperText>

          {inputs.useAIME ? (
            <>
              <TextInput
                label="AIME (Average Indexed Monthly Earnings)"
                value={inputs.aime?.toString() || ''}
                onChangeText={(text) => handleChange('aime', parseFloat(text) || 0)}
                keyboardType="numeric"
                disabled={disabled}
                mode="outlined"
                left={<TextInput.Affix text="$" />}
                style={[styles.input, styles.topMargin]}
              />
              <HelperText type="info">
                From SSA.gov (typical range: $1,000 - $15,000/month)
              </HelperText>
            </>
          ) : (
            <View style={styles.earningsHistoryContainer}>
              <HelperText type="info" style={styles.topMargin}>
                Enter your annual earnings for the last 35 years. Leave blank for years with no earnings.
              </HelperText>
              <ScrollView style={styles.earningsScroll} nestedScrollEnabled>
                {earningsYears.map((entry, index) => (
                  <View key={entry.year} style={styles.earningsRow}>
                    <Text variant="bodyMedium" style={styles.yearLabel}>
                      {entry.year}
                    </Text>
                    <TextInput
                      value={entry.amount > 0 ? entry.amount.toString() : ''}
                      onChangeText={(text) => handleEarningsChange(index, text)}
                      keyboardType="numeric"
                      disabled={disabled}
                      mode="outlined"
                      dense
                      left={<TextInput.Affix text="$" />}
                      style={styles.earningsInput}
                      placeholder="0"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </List.Accordion>

      {/* Medicare & Medicaid Accordion */}
      <List.Accordion
        title="Medicare & Medicaid"
        description={inputs.planType === 'ORIGINAL' ? 'Original Medicare' : 'Medicare Advantage'}
        expanded={expandedSection === 'medicare'}
        onPress={() => setExpandedSection(expandedSection === 'medicare' ? null : 'medicare')}
        left={(props) => <List.Icon {...props} icon="medical-bag" />}
        right={() => <HelpIcon topicId="irmaa" helpTopic={getHelpTopic('irmaa')} />}
        style={styles.accordion}
      >
        <View style={styles.sectionContent}>
          <View style={styles.inputWithHelp}>
            <TextInput
              label="MAGI (Modified Adjusted Gross Income)"
              value={inputs.magi.toString()}
              onChangeText={(text) => handleChange('magi', parseFloat(text) || 0)}
              keyboardType="numeric"
              disabled={disabled}
              mode="outlined"
              left={<TextInput.Affix text="$" />}
              style={[styles.input, styles.flexInput]}
            />
            <HelpIcon topicId="irmaa" helpTopic={getHelpTopic('irmaa')} />
          </View>
          <HelperText type="info">
            Annual income used to determine IRMAA surcharges
          </HelperText>

          <View style={[styles.pickerContainer, styles.topMargin]}>
            <View style={styles.labelWithHelp}>
              <Text variant="labelLarge" style={styles.pickerLabel}>
                State
              </Text>
              <HelpIcon topicId="medicarePartB" helpTopic={getHelpTopic('medicarePartB')} />
            </View>
            <PickerSelect
              options={Object.entries(US_STATES).map(([code, name]) => ({
                label: name,
                value: code,
              }))}
              selectedValue={inputs.stateCode}
              onValueChange={(value: any) => handleChange('stateCode', value)}
              disabled={disabled}
            />
            <HelperText type="info">
              Used for Medicaid eligibility check
            </HelperText>
          </View>

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.subsectionTitle}>
            Medicare Plan Type
          </Text>
          <HelperText type="info">
            Original Medicare requires separate Part D and Medigap. Medicare Advantage bundles everything.
          </HelperText>

          <SegmentedButtons
            value={inputs.planType}
            onValueChange={(value) => handleChange('planType', value as PlanType)}
            buttons={[
              {
                value: 'ORIGINAL',
                label: 'Original',
                disabled,
              },
              {
                value: 'ADVANTAGE',
                label: 'Advantage',
                disabled,
              },
            ]}
            style={styles.topMargin}
          />

          <View style={[styles.switchRow, styles.topMargin]}>
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium">Have Part A Coverage (40 Credits)</Text>
              <HelperText type="info">
                If unchecked, adds $505/month Part A premium
              </HelperText>
            </View>
            <Switch
              value={inputs.hasPartACoverage}
              onValueChange={(value) => handleChange('hasPartACoverage', value)}
              disabled={disabled}
            />
          </View>
        </View>
      </List.Accordion>

      {/* Premium Overrides Accordion */}
      <List.Accordion
        title="Premium Overrides (Optional)"
        description="Customize premium amounts"
        expanded={expandedSection === 'overrides'}
        onPress={() => setExpandedSection(expandedSection === 'overrides' ? null : 'overrides')}
        left={(props) => <List.Icon {...props} icon="tune" />}
        style={styles.accordion}
      >
        <View style={styles.sectionContent}>
          <HelperText type="info">
            Override default premium estimates with your actual plan costs. Leave blank to use 2025 national averages.
          </HelperText>

          {inputs.planType === 'ORIGINAL' ? (
            <>
              <TextInput
                label="Part D Premium"
                value={inputs.partDPremiumOverride?.toString() || ''}
                onChangeText={(text) =>
                  handleChange('partDPremiumOverride', text ? parseFloat(text) : undefined)
                }
                keyboardType="numeric"
                disabled={disabled}
                mode="outlined"
                left={<TextInput.Affix text="$" />}
                right={<TextInput.Affix text="/mo" />}
                placeholder="50.00"
                style={[styles.input, styles.topMargin]}
              />
              <HelperText type="info">
                Leave blank for default ($50/month)
              </HelperText>

              <TextInput
                label="Medigap Premium"
                value={inputs.medigapPremiumOverride?.toString() || ''}
                onChangeText={(text) =>
                  handleChange('medigapPremiumOverride', text ? parseFloat(text) : undefined)
                }
                keyboardType="numeric"
                disabled={disabled}
                mode="outlined"
                left={<TextInput.Affix text="$" />}
                right={<TextInput.Affix text="/mo" />}
                placeholder="150.00"
                style={[styles.input, styles.topMargin]}
              />
              <HelperText type="info">
                Leave blank for default ($150/month - avg Plan G)
              </HelperText>
            </>
          ) : (
            <>
              <TextInput
                label="Medicare Advantage Premium"
                value={inputs.advantagePremiumOverride?.toString() || ''}
                onChangeText={(text) =>
                  handleChange('advantagePremiumOverride', text ? parseFloat(text) : undefined)
                }
                keyboardType="numeric"
                disabled={disabled}
                mode="outlined"
                left={<TextInput.Affix text="$" />}
                right={<TextInput.Affix text="/mo" />}
                placeholder="0.00"
                style={[styles.input, styles.topMargin]}
              />
              <HelperText type="info">
                Leave blank for default ($0/month)
              </HelperText>
            </>
          )}

          <TextInput
            label="Employer/HSA Offset"
            value={inputs.employerHealthcareOffset?.toString() || '0'}
            onChangeText={(text) => handleChange('employerHealthcareOffset', parseFloat(text) || 0)}
            keyboardType="numeric"
            disabled={disabled}
            mode="outlined"
            left={<TextInput.Affix text="$" />}
            right={<TextInput.Affix text="/mo" />}
            style={[styles.input, styles.topMargin]}
          />
          <HelperText type="info">
            Amount employer covers or you withdraw from HSA
          </HelperText>
        </View>
      </List.Accordion>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accordion: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  sectionContent: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 4,
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
  topMargin: {
    marginTop: 16,
  },
  pickerContainer: {
    marginTop: 16,
    marginBottom: 4,
  },
  pickerLabel: {
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  subsectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  earningsHistoryContainer: {
    marginTop: 8,
  },
  earningsScroll: {
    maxHeight: 400,
    marginTop: 8,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  yearLabel: {
    width: 60,
    fontWeight: '600',
  },
  earningsInput: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
