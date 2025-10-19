/**
 * SectionHeader Component
 * Improved section headers with visual hierarchy and subtle background
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(48, 64, 58, 0.08)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#30403A',
  },
  subtitle: {
    fontWeight: '400',
    fontSize: 13,
    color: 'rgba(48, 64, 58, 0.7)',
    marginTop: 4,
  },
});

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.headerRow}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};
