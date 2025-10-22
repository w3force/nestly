import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Card, List, Button, Divider, useTheme, Portal, Modal } from 'react-native-paper';
import { TIER_CONFIGS, TIER_COMPARISON } from '@projection/shared';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { PlansComparison } from '../components';
import { useTier } from '../contexts/TierContext';

export default function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { currentTier, tierConfig, features } = useTier();
  const [showSavedScenarios, setShowSavedScenarios] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);

  // Load scenarios when modal is opened
  useEffect(() => {
    if (showSavedScenarios) {
      loadScenarios();
    }
  }, [showSavedScenarios]);

  const loadScenarios = async () => {
    try {
      const saved = await AsyncStorage.getItem('whatif_scenarios');
      if (saved) {
        setSavedScenarios(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Tier Badge Card */}
        <Card style={[styles.card, { backgroundColor: tierConfig.color }]}>
          <Card.Content>
            <View style={styles.tierHeader}>
              <Text style={styles.tierBadge}>{tierConfig.badge}</Text>
              <View style={styles.tierInfo}>
                <Text variant="headlineSmall" style={[styles.tierName, { color: '#fff' }]}>
                  {tierConfig.name}
                </Text>
                <Text variant="bodyMedium" style={[styles.tierDescription, { color: 'rgba(255,255,255,0.9)' }]}>
                  {tierConfig.description}
                </Text>
              </View>
            </View>

            {/* Feature Summary */}
            <View style={styles.featuresSummary}>
              <Text variant="bodySmall" style={[styles.featuresTitle, { color: 'rgba(255,255,255,0.95)' }]}>
                Your Plan Includes:
              </Text>
              <Text variant="bodySmall" style={[styles.featureItem, { color: 'rgba(255,255,255,0.9)' }]}>
                • {features.monteCarloFullAccess ? 'Full' : 'Preview'} Monte Carlo Analysis ({features.maxSimulations.toLocaleString()} simulations)
              </Text>
              <Text variant="bodySmall" style={[styles.featureItem, { color: 'rgba(255,255,255,0.9)' }]}>
                • Up to {features.maxScenarios} What-If Scenarios
              </Text>
              <Text variant="bodySmall" style={[styles.featureItem, { color: 'rgba(255,255,255,0.9)' }]}>
                • SS & Healthcare {features.ssDetailedMode ? 'Detailed' : 'Quick'} Mode
              </Text>
            </View>

            {currentTier === 'FREE' && (
              <Button
                mode="contained"
                onPress={() => (navigation as any).navigate('Plans')}
                style={[styles.upgradeButton, { backgroundColor: '#fff' }]}
                labelStyle={{ color: tierConfig.color }}
                icon="star"
              >
                Upgrade to Pro or Premium
              </Button>
            )}
            {currentTier !== 'FREE' && (
              <Button
                mode="contained"
                onPress={() => (navigation as any).navigate('Plans')}
                style={[styles.upgradeButton, { backgroundColor: 'rgba(255,255,255,0.3)' }]}
                labelStyle={{ color: '#fff' }}
              >
                View All Plans
              </Button>
            )}
          </Card.Content>
        </Card>

        {/* User Info Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Account
            </Text>
            <View style={styles.accountInfo}>
              <View style={styles.accountRow}>
                <Text variant="bodyMedium" style={styles.accountLabel}>Current Tier:</Text>
                <Text variant="bodyMedium" style={[styles.accountValue, { color: tierConfig.color }]}>
                  {tierConfig.name}
                </Text>
              </View>
              <Divider style={styles.accountDivider} />
              <View style={styles.accountRow}>
                <Text variant="bodyMedium" style={styles.accountLabel}>Scenarios Used:</Text>
                <Text variant="bodyMedium" style={styles.accountValue}>
                  0 / {features.maxScenarios === Infinity ? '∞' : features.maxScenarios}
                </Text>
              </View>
              <Divider style={styles.accountDivider} />
              <View style={styles.accountRow}>
                <Text variant="bodyMedium" style={styles.accountLabel}>Status:</Text>
                <Text variant="bodyMedium" style={[styles.accountValue, { color: '#69B47A' }]}>
                  Active
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.subtitle}>
              Settings & Scenarios
            </Text>
          </Card.Content>
          <List.Item
            title="Saved Scenarios"
            description="Manage your saved what-if scenarios"
            left={(props) => <List.Icon {...props} icon="content-save" />}
            onPress={() => setShowSavedScenarios(true)}
          />
        </Card>

        {/* Tier Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.subtitle}>
              Plan: {tierConfig.name} Tier
            </Text>
            <Text variant="bodySmall" style={styles.tierNote}>
              {currentTier === 'FREE' ? 'Upgrade to Premium for advanced features' : 'You have access to all premium features'}
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => (navigation as any).navigate('Plans')}>
              View Plans
            </Button>
          </Card.Actions>
        </Card>

        {/* About */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.subtitle}>
              About
            </Text>
            <Text variant="bodySmall" style={styles.aboutText}>
              Retirement Planning App v0.1.0
            </Text>
            <Text variant="bodySmall" style={styles.aboutText}>
              Built with React Native & Expo
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Saved Scenarios Modal */}
      <Portal>
        <Modal
          visible={showSavedScenarios}
          onDismiss={() => setShowSavedScenarios(false)}
          contentContainerStyle={styles.planModalContainer}
        >
          <View style={styles.planModalContent}>
            <View style={styles.planModalHeader}>
              <Text variant="headlineSmall" style={styles.planModalTitle}>
                Saved Scenarios ({savedScenarios.length})
              </Text>
              <Button
                mode="text"
                onPress={() => setShowSavedScenarios(false)}
                style={styles.closeButton}
              >
                ✕
              </Button>
            </View>

            <ScrollView style={styles.plansList} showsVerticalScrollIndicator={false}>
              {savedScenarios.length === 0 ? (
                <Card style={styles.planCard}>
                  <Card.Content>
                    <Text variant="bodyMedium" style={{ textAlign: 'center', opacity: 0.6, marginVertical: 32 }}>
                      No saved scenarios yet
                    </Text>
                    <Text variant="bodySmall" style={{ textAlign: 'center', opacity: 0.5 }}>
                      Create and save scenarios from the What-If tab to access them here
                    </Text>
                  </Card.Content>
                </Card>
              ) : (
                savedScenarios.map((scenario, index) => (
                  <Card key={scenario.id || index} style={styles.scenarioCard}>
                    <Card.Content>
                      <View style={styles.scenarioHeader}>
                        <View style={{ flex: 1 }}>
                          <Text variant="titleMedium" style={{ fontWeight: '700', marginBottom: 4 }}>
                            {scenario.name}
                          </Text>
                          <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                            Savings Rate: {scenario.savingsRate ?? scenario.contribution ?? 0}%
                          </Text>
                          <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                            Return: {scenario.return}%
                          </Text>
                        </View>
                        <Button
                          mode="outlined"
                          onPress={() => {
                            setShowSavedScenarios(false);
                            (navigation as any).navigate('Main', { screen: 'What-If' });
                          }}
                        >
                          Open
                        </Button>
                      </View>
                    </Card.Content>
                  </Card>
                ))
              )}
            </ScrollView>
          </View>
        </Modal>
      </Portal>
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
    marginBottom: 8,
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
  tierNote: {
    opacity: 0.7,
    marginTop: 4,
  },
  aboutText: {
    opacity: 0.7,
    marginTop: 4,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tierBadge: {
    fontSize: 56,
    marginRight: 16,
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    fontWeight: '700',
    marginBottom: 4,
  },
  tierDescription: {
    opacity: 0.8,
  },
  featuresSummary: {
    marginVertical: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  featuresTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: 'rgba(255,255,255,0.95)',
  },
  featureItem: {
    marginBottom: 4,
    color: 'rgba(255,255,255,0.9)',
  },
  upgradeButton: {
    marginTop: 8,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 0,
    height: '100%',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: '700',
  },
  accountInfo: {
    marginTop: 12,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  accountLabel: {
    flex: 1,
    opacity: 0.7,
  },
  accountValue: {
    flex: 1,
    textAlign: 'right',
    fontWeight: '600',
  },
  accountDivider: {
    marginVertical: 0,
  },
  planModalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    margin: 0,
  },
  planModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 16,
  },
  planModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  planModalTitle: {
    fontWeight: '700',
  },
  closeButton: {
    margin: -8,
  },
  plansList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  planCard: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  planCardActive: {
    borderWidth: 2,
    borderColor: '#69B47A',
    backgroundColor: 'rgba(105, 180, 122, 0.05)',
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planCardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  planDescription: {
    opacity: 0.7,
    marginTop: 2,
  },
  planPricing: {
    marginVertical: 12,
    paddingVertical: 8,
  },
  planButton: {
    marginTop: 8,
  },
  tierCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
    gap: 8,
  },
  comparisonTierCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  comparisonTierCardActive: {
    borderWidth: 2,
    borderColor: '#69B47A',
    backgroundColor: 'rgba(105, 180, 122, 0.08)',
  },
  comparisonTierName: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  comparisonPrice: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  comparisonTable: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  featureNameCol: {
    flex: 2,
    marginRight: 8,
  },
  featureName: {
    fontWeight: '500',
    lineHeight: 18,
  },
  featureValueCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureValue: {
    fontWeight: '600',
    textAlign: 'center',
  },
  featureAvailable: {
    color: '#4CAF50',
  },
  featureUnavailable: {
    color: '#999',
  },
  comparisonRowDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  plansCtaContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  planCtaButton: {
    flex: 1,
  },
  scenarioCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
});
