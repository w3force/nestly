/**
 * HelpTooltip Component
 * Inline tooltip for brief help text without opening a modal
 */
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon, useTheme } from 'react-native-paper';

interface HelpTooltipProps {
  text: string;
  iconSize?: number;
}

/**
 * Inline help tooltip that expands/collapses on tap
 */
export function HelpTooltip({ text, iconSize = 18 }: HelpTooltipProps) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpanded} style={styles.iconContainer}>
        <Icon source="information-outline" size={iconSize} color={theme.colors.primary} />
      </TouchableOpacity>
      {expanded && (
        <View style={[styles.tooltipContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text variant="bodySmall" style={styles.tooltipText}>
            {text}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  iconContainer: {
    padding: 4,
  },
  tooltipContainer: {
    position: 'absolute',
    top: 30,
    left: -100,
    right: -100,
    padding: 12,
    borderRadius: 8,
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tooltipText: {
    lineHeight: 18,
  },
});
