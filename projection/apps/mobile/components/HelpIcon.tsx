/**
 * HelpIcon Component
 * Displays a help icon that shows help content in a modal
 */
import React, { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { IconButton, Modal, Portal, Button, Text as PaperText } from 'react-native-paper';
import type { HelpTopic } from '@projection/shared';

interface HelpIconProps {
  topicId: string;
  helpTopic?: HelpTopic;
  size?: number;
  color?: string;
}

const styles = StyleSheet.create({
  iconButton: {
    margin: 0,
    padding: 4,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginHorizontal: 20,
    marginVertical: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#30403A',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
});

const fallbackContent: Record<string, { title: string; description: string }> = {
  deterministic_age: {
    title: 'Current Age',
    description: 'Your age today. The earlier you start, the more time for compound growth to work its magic. This helps calculate how many years until retirement.',
  },
  deterministic_retirement_age: {
    title: 'Retirement Age',
    description: 'The age when you plan to stop working. Common retirement ages are 62-67. Earlier = less time to save. Later = more contributions + growth.',
  },
  deterministic_current_balance: {
    title: 'Current 401(k) Balance',
    description: 'The total amount currently in your 401(k) or retirement account. Include all pre-tax contributions. This is your starting point.',
  },
  deterministic_annual_contribution: {
    title: 'Annual Contribution',
    description: 'How much you (and your employer) contribute each year. Include employer match. Higher contributions = bigger retirement nest egg.',
  },
  deterministic_expected_return: {
    title: 'Expected Return',
    description: 'Average annual growth rate. Conservative: 5-6%, Moderate: 7-8%, Aggressive: 9-10%. Historical stock market average is ~7% after inflation.',
  },
  deterministic_inflation: {
    title: 'Inflation Rate',
    description: 'Expected annual inflation. Historical average: 2-3%. This shows what your money will be worth in today\'s dollars (real vs nominal).',
  },
  monte_carlo_sims: {
    title: 'Number of Simulations',
    description: 'How many scenarios to run. More paths = more accurate results but slower. 1,000-5,000 is typical.',
  },
  monte_carlo_volatility: {
    title: 'Return Volatility',
    description: 'Standard deviation of returns. Stocks: 15-20%, Bonds: 3-5%, Balanced: 10-12%. Higher volatility = more uncertainty.',
  },
  sshealthcare_years: {
    title: 'Years in Retirement',
    description: 'How many years you expect to be in retirement.',
  },
  sshealthcare_spending: {
    title: 'Annual Healthcare Spending',
    description: 'Your expected annual healthcare spending in retirement.',
  },
};

/**
 * Help icon button that shows help content in a modal
 */
export function HelpIcon({ topicId, helpTopic, size = 18, color }: HelpIconProps) {
  const [visible, setVisible] = useState(false);
  
  // Use helpTopic shortDescription if provided, otherwise use fallback content
  const titleText = helpTopic?.title || fallbackContent[topicId]?.title || 'Help';
  const descriptionText = helpTopic?.shortDescription || fallbackContent[topicId]?.description || 'No help available.';

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        <IconButton
          icon="help-circle-outline"
          size={size}
          iconColor={color || '#4ABDAC'}
          style={styles.iconButton}
        />
      </Pressable>
      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <PaperText style={styles.title}>{titleText}</PaperText>
            <ScrollView style={{ maxHeight: '60%' }}>
              <PaperText style={styles.description}>{descriptionText}</PaperText>
            </ScrollView>
            <Button 
              mode="contained" 
              onPress={() => setVisible(false)} 
              style={{ marginTop: 16 }}
            >
              Close
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
}
