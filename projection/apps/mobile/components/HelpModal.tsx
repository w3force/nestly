/**
 * HelpModal Component
 * Full-screen modal displaying detailed help content
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Modal, Portal, Text, Button, Divider, Chip, useTheme } from 'react-native-paper';
import type { HelpTopic } from '@projection/shared';

interface HelpModalProps {
  visible: boolean;
  onDismiss: () => void;
  helpTopic: HelpTopic;
}

/**
 * Modal displaying comprehensive help content
 */
export function HelpModal({ visible, onDismiss, helpTopic }: HelpModalProps) {
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
      >
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.title}>
              {helpTopic.title}
            </Text>
            <Chip mode="outlined" style={styles.categoryChip}>
              {helpTopic.category}
            </Chip>
          </View>

          <Divider style={styles.divider} />

          {/* Short Description */}
          <Text variant="titleMedium" style={styles.shortDescription}>
            {helpTopic.shortDescription}
          </Text>

          {/* Full Description */}
          <Text variant="bodyMedium" style={styles.fullDescription}>
            {helpTopic.fullDescription}
          </Text>

          {/* Examples */}
          {helpTopic.examples && helpTopic.examples.length > 0 && (
            <>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Examples
              </Text>
              <View style={[styles.examplesContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                {helpTopic.examples.map((example, index) => (
                  <View key={index} style={styles.exampleItem}>
                    <Text variant="bodyMedium" style={styles.exampleBullet}>
                      •
                    </Text>
                    <Text variant="bodyMedium" style={styles.exampleText}>
                      {example}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Related Topics */}
          {helpTopic.relatedTopics && helpTopic.relatedTopics.length > 0 && (
            <>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Related Topics
              </Text>
              <View style={styles.relatedTopicsContainer}>
                {helpTopic.relatedTopics.map((topicId, index) => (
                  <Chip key={index} mode="outlined" style={styles.relatedChip}>
                    {topicId}
                  </Chip>
                ))}
              </View>
            </>
          )}

          {/* Close Button */}
          <Button mode="contained" onPress={onDismiss} style={styles.closeButton}>
            Got it!
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 16,
    marginVertical: 60,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 12,
    minHeight: 300,
    maxHeight: '80%',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryChip: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 16,
  },
  shortDescription: {
    fontWeight: '600',
    marginBottom: 12,
    color: '#2E7D32',
  },
  fullDescription: {
    marginBottom: 20,
    lineHeight: 22,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  examplesContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  exampleItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  exampleBullet: {
    marginRight: 8,
    fontWeight: 'bold',
  },
  exampleText: {
    flex: 1,
    lineHeight: 20,
  },
  relatedTopicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  relatedChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  closeButton: {
    marginTop: 16,
    marginBottom: 20,
  },
});
