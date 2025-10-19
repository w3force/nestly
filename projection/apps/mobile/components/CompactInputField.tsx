/**
 * CompactInputField Component
 * Improved mobile input with better spacing and visual hierarchy
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from 'react-native-paper';

interface CompactInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'numeric' | 'default';
  min?: number;
  max?: number;
  helpIcon?: React.ReactNode;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontWeight: '500',
    fontSize: 14,
    color: '#30403A',
  },
  inputField: {
    backgroundColor: '#fff',
  },
});

export const CompactInputField: React.FC<CompactInputFieldProps> = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  min,
  max,
  helpIcon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {helpIcon}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        mode="outlined"
        dense
        style={styles.inputField}
      />
    </View>
  );
};
