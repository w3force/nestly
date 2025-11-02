import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  Card,
  Button,
  Divider,
  Portal,
  Modal,
  IconButton,
  Chip,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTier } from '../contexts/TierContext';
import { COLORS, SPACING, BORDER_RADIUS } from '@projection/shared';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PAGE_ICON_NAME = 'account-circle-outline';
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { tierConfig, features } = useTier();
  const displayMaxScenarios = Math.max(features.maxScenarios || 0, 10);
  const [showSavedScenarios, setShowSavedScenarios] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);

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

  const scenariosAvailableText = displayMaxScenarios === Infinity ? '∞' : displayMaxScenarios;
  const insets = useSafeAreaInsets();
  const topContentPadding = useMemo(
    () => SPACING.lg + Math.max(insets.top - SPACING.md, 0),
    [insets.top],
  );
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [40, 120],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );
  const headerTranslate = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, 120],
        outputRange: [-16, 0],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.collapsedHeader,
          {
            paddingTop: insets.top,
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }],
          },
        ]}
      >
        <View style={styles.collapsedHeaderContent}>
          <View style={styles.collapsedHeaderIcon}>
            <MaterialCommunityIcons
              name={PAGE_ICON_NAME}
              size={18}
              color="#30403A"
            />
          </View>
          <Text variant="titleMedium" style={styles.collapsedHeaderTitle}>
            Profile
          </Text>
        </View>
      </Animated.View>
      <AnimatedScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topContentPadding },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        <LinearGradient
          colors={['#E9F7EF', '#D9F1E6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.brandHeader}
        >
          <View style={styles.brandHeaderContent}>
            <View style={styles.brandHeaderLeft}>
              <View style={styles.brandIconBadge}>
                <MaterialCommunityIcons
                  name={PAGE_ICON_NAME}
                  size={28}
                  color="#30403A"
                />
              </View>
              <View>
                <Text variant="titleLarge" style={styles.brandTitle}>
                  Nestly Planner
                </Text>
              </View>
            </View>
            <Chip
              icon="crown"
              compact
              style={styles.tierChip}
              textStyle={styles.tierChipText}
            >
              {tierConfig.name} Tier
            </Chip>
          </View>
        </LinearGradient>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Account Overview
                </Text>
                <Text variant="bodySmall" style={styles.sectionDescription}>
                  Track your access and usage details
                </Text>
              </View>
            </View>

            <View style={styles.accountInfo}>
              <View style={styles.accountRow}>
                <Text variant="bodyMedium" style={styles.accountLabel}>
                  Current Tier
                </Text>
                <Text
                  variant="bodyMedium"
                  style={[styles.accountValue, { color: tierConfig.color }]}
                >
                  {tierConfig.name}
                </Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.accountRow}>
                <Text variant="bodyMedium" style={styles.accountLabel}>
                  Scenarios Used
                </Text>
                <Text variant="bodyMedium" style={styles.accountValue}>
                  0 / {scenariosAvailableText}
                </Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.accountRow}>
                <Text variant="bodyMedium" style={styles.accountLabel}>
                  Status
                </Text>
                <Text variant="bodyMedium" style={[styles.accountValue, styles.accountActive]}>
                  Active
                </Text>
              </View>
            </View>

            <View style={styles.highlights}>
              <Text variant="labelSmall" style={styles.highlightsTitle}>
                Highlights
              </Text>
              <Text variant="bodySmall" style={styles.highlightItem}>
                • Monte Carlo upgrades — coming soon
              </Text>
              <Text variant="bodySmall" style={styles.highlightItem}>
                • Social Security & Healthcare planner — coming soon
              </Text>
              <Text variant="bodySmall" style={styles.highlightItem}>
                • Up to {scenariosAvailableText} What-If scenarios
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Saved Scenarios
                </Text>
                <Text variant="bodySmall" style={styles.sectionDescription}>
                  Manage your personalized what-if plans
                </Text>
              </View>
              <Button
                compact
                mode="contained"
                onPress={() => setShowSavedScenarios(true)}
                style={styles.sectionButton}
              >
                View
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <View>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  About
                </Text>
                <Text variant="bodySmall" style={styles.sectionDescription}>
                  Nestly Planner mobile preview
                </Text>
              </View>
            </View>
            <Text variant="bodySmall" style={styles.aboutText}>
              Retirement Planning App v0.1.0
            </Text>
          </Card.Content>
        </Card>
      </AnimatedScrollView>

      <Portal>
        <Modal
          visible={showSavedScenarios}
          onDismiss={() => setShowSavedScenarios(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text variant="titleMedium" style={styles.modalTitle}>
                Saved Scenarios ({savedScenarios.length})
              </Text>
              <IconButton
                icon="close"
                size={20}
                onPress={() => setShowSavedScenarios(false)}
                accessibilityLabel="Close saved scenarios"
              />
            </View>
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {savedScenarios.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text variant="bodyMedium" style={styles.emptyStateTitle}>
                    No saved scenarios yet
                  </Text>
                  <Text variant="bodySmall" style={styles.emptyStateDescription}>
                    Create and save scenarios from the What-If tab to access them here.
                  </Text>
                </View>
              ) : (
                savedScenarios.map((scenario, index) => (
                  <Card key={scenario.id || index} style={styles.scenarioCard}>
                    <Card.Content>
                      <View style={styles.scenarioHeader}>
                        <View style={styles.scenarioDetails}>
                          <Text variant="titleSmall" style={styles.scenarioTitle}>
                            {scenario.name}
                          </Text>
                          <Text variant="bodySmall" style={styles.scenarioMeta}>
                            Savings Rate: {scenario.savingsRate ?? scenario.contribution ?? 0}%
                          </Text>
                          <Text variant="bodySmall" style={styles.scenarioMeta}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2FBF5',
  },
  collapsedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(48, 64, 58, 0.08)',
    backgroundColor: '#F2FBF5',
    zIndex: 20,
  },
  collapsedHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  collapsedHeaderIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 125, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(73, 101, 210, 0.22)',
  },
  collapsedHeaderTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#264336',
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl * 2,
    backgroundColor: '#F2FBF5',
  },
  brandHeader: {
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  brandHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  brandHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  brandIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(73, 101, 210, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(73, 101, 210, 0.2)',
  },
  brandTitle: {
    fontWeight: '700',
    color: '#264336',
  },
  tierChip: {
    backgroundColor: 'rgba(105, 180, 122, 0.16)',
  },
  tierChipText: {
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  card: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionDescription: {
    marginTop: SPACING.xs,
    color: COLORS.textSecondary,
  },
  sectionButton: {
    marginLeft: SPACING.md,
  },
  accountInfo: {
    marginTop: SPACING.md,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  accountLabel: {
    color: COLORS.textSecondary,
  },
  accountValue: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  accountActive: {
    color: COLORS.success,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.divider,
  },
  highlights: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.borderLight,
  },
  highlightsTitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  highlightItem: {
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  aboutText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '90%',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  modalHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.borderLight,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalScrollContent: {
    paddingBottom: SPACING.xxl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  emptyStateTitle: {
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateDescription: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  scenarioCard: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  scenarioDetails: {
    flex: 1,
  },
  scenarioTitle: {
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  scenarioMeta: {
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
  },
});
