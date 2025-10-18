import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';

export default function AssumptionsTab() {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Assumptions & Help
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              This tab will display the assumptions used in calculations and provide help documentation.
            </Text>
            <Text variant="bodySmall" style={styles.note}>
              Coming soon
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.subtitle}>
              Will include:
            </Text>
            <Text variant="bodySmall" style={styles.feature}>
              • Current SSA assumptions (FRA, bend points, COLA)
            </Text>
            <Text variant="bodySmall" style={styles.feature}>
              • Medicare premium assumptions
            </Text>
            <Text variant="bodySmall" style={styles.feature}>
              • IRMAA brackets and thresholds
            </Text>
            <Text variant="bodySmall" style={styles.feature}>
              • Medicaid eligibility thresholds
            </Text>
            <Text variant="bodySmall" style={styles.feature}>
              • Help documentation and FAQs
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 12,
    fontWeight: '700',
  },
  subtitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  description: {
    marginBottom: 12,
    opacity: 0.8,
  },
  note: {
    opacity: 0.6,
    fontStyle: 'italic',
  },
  feature: {
    marginBottom: 6,
    opacity: 0.8,
    paddingLeft: 8,
  },
});
