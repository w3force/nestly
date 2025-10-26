/**
 * Landing Screen (Mobile)
 * Schema-driven rendering with reusable section renderers.
 */
import React, { useMemo, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Card, Icon, Text, useTheme } from 'react-native-paper';
import QuickStartSection, {
  QuickStartInputMetadata,
  QuickStartResultsMetadata,
  QuickStartStrategyMetadata,
  ReadinessMessages,
} from '../components/QuickStartSection';
import { ScreenRenderer, SectionRendererMap, CustomComponentRendererMap } from '../components/ScreenRenderer';
import { getScreenDefinition, ScreenDefinition } from '@projection/shared';

interface LandingScreenProps {
  onGetStarted: () => void;
  onNavigateTo?: (screen: string) => void;
}

const landingScreen: ScreenDefinition = getScreenDefinition('landing');

const HERO_ICON_MAP = {
  'nestly-default': require('../assets/icon3.png'),
  favicon: require('../assets/favicon.png'),
} as const;

const DEFAULT_HERO_ICON = HERO_ICON_MAP['nestly-default'];

const routeMap: Record<string, string> = {
  deterministic: 'Deterministic',
  whatif: 'WhatIf',
  monteCarlo: 'Calculator',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export default function LandingScreen({ onGetStarted, onNavigateTo }: LandingScreenProps) {
  const theme = useTheme();
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        delay: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslate, {
        toValue: 0,
        duration: 600,
        delay: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoScale, contentOpacity, contentTranslate]);

  const heroSection = landingScreen.sections.find((section) => section.id === 'hero');
  const heroMetadata = (heroSection?.metadata as Record<string, unknown>) ?? {};
  const metaHeroIcon = heroMetadata['heroIcon'];
  const heroIconKey =
    typeof metaHeroIcon === 'string' && metaHeroIcon.trim().length > 0 ? metaHeroIcon.trim() : undefined;
  const heroIconSource =
    (heroIconKey && HERO_ICON_MAP[heroIconKey as keyof typeof HERO_ICON_MAP]) ?? DEFAULT_HERO_ICON;

  const heroRenderer = useMemo(() => {
    const metaHeroTitle = heroMetadata['heroTitle'];
    const heroTitle =
      (typeof metaHeroTitle === 'string' && metaHeroTitle.trim().length > 0 ? metaHeroTitle : undefined) ??
      'Nestly';
    const metaHeroTagline = heroMetadata['heroTagline'];
    const heroTagline =
      (typeof metaHeroTagline === 'string' && metaHeroTagline.trim().length > 0 ? metaHeroTagline : undefined) ??
      heroSection?.description ??
      landingScreen.description;
    const metaHeroDescription = heroMetadata['heroDescription'];
    const heroDescription =
      (typeof metaHeroDescription === 'string' && metaHeroDescription.trim().length > 0
        ? metaHeroDescription
        : undefined) ??
      'Nestly helps you project your savings, 401(k), Social Security, Medicare costs, and investments over time — guiding you to build a secure financial future.';
    const metaPrimaryCta = heroMetadata['primaryCTA'];
    const primaryCTA =
      (typeof metaPrimaryCta === 'string' && metaPrimaryCta.trim().length > 0 ? metaPrimaryCta : undefined) ??
      'Start Planning Now';
    return () => (
      <LinearGradient colors={['#F5F5F5', '#E8F5E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroSection}>
        <Animated.View style={[styles.heroContent, { opacity: contentOpacity, transform: [{ translateY: contentTranslate }] }]}>
          <Animated.Image source={heroIconSource} style={[styles.logoIcon, { transform: [{ scale: logoScale }] }]} />
          <Text variant="displayLarge" style={styles.heroTitle}>
            {heroTitle}
          </Text>
          <Text variant="titleLarge" style={styles.heroSubtitle}>
            {heroTagline}
          </Text>
          <Text variant="bodyLarge" style={styles.heroDescription}>
            {heroDescription}
          </Text>
          <Button
            mode="contained"
            onPress={() => onGetStarted?.()}
            style={styles.ctaButton}
            labelStyle={styles.ctaButtonLabel}
            contentStyle={styles.ctaButtonContent}
            buttonColor="#69B47A"
          >
            {primaryCTA}
          </Button>
        </Animated.View>
      </LinearGradient>
    );
  }, [heroMetadata, heroSection, onGetStarted, onNavigateTo, heroIconSource, contentOpacity, contentTranslate, logoScale]);

  const featureRenderer = useMemo<SectionRendererMap['feature-cards']>(
    () => ({ section }) => {
      const items: Array<Record<string, any>> = Array.isArray(section.metadata?.items)
        ? (section.metadata?.items as Array<Record<string, any>>)
        : [];

      return (
        <View style={styles.featuresSection}>
          <Text variant="headlineSmall" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            {section.title ?? 'Choose Your Analysis Method'}
          </Text>
          {section.description && (
            <Text variant="bodyMedium" style={styles.sectionSubtitle}>
              {section.description}
            </Text>
          )}

          {items.map((item) => {
            const badgeLabel =
              typeof item.badge === 'string' && item.badge.trim().length > 0
                ? (item.badge as string)
                : undefined;
            const normalizedStatus =
              typeof item.status === 'string' ? item.status.toLowerCase() : undefined;
            const isComingSoon =
              normalizedStatus === 'comingsoon' ||
              normalizedStatus === 'coming_soon' ||
              badgeLabel === 'COMING SOON';
            const badgeBackground = isComingSoon ? 'rgba(48, 64, 58, 0.12)' : '#FFD54F';
            const badgeTextColor = isComingSoon ? '#30403A' : '#1A1A1A';
            const iconName =
              item.icon ??
              (item.id === 'deterministic'
                ? 'calculator'
                : item.id === 'whatif'
                ? 'compare-horizontal'
                : 'chart-line');
            const themeColor =
              item.themeColor ??
              (item.id === 'deterministic'
                ? '#69B47A'
                : item.id === 'whatif'
                ? '#4ABDAC'
                : '#FFD54F');

            const handleNavigate = () => {
              if (isComingSoon) {
                return;
              }
              const target = item.navigateTo ? routeMap[item.navigateTo] ?? item.navigateTo : undefined;
              if (target && onNavigateTo) {
                onNavigateTo(target);
              } else {
                onGetStarted();
              }
            };

            return (
              <Card key={item.id} style={styles.featureCard}>
                <Card.Content style={styles.featureContent}>
                  <View style={[styles.featureIcon, { backgroundColor: `${themeColor}25` }]}>
                    <Icon source={iconName} size={32} color={themeColor} />
                  </View>
                  <View style={styles.featureText}>
                    <View style={styles.featureTitleRow}>
                      <Text variant="titleMedium" style={styles.featureTitle}>
                        {item.title}
                      </Text>
                      {badgeLabel && (
                        <View style={[styles.featureBadge, { backgroundColor: badgeBackground }]}>
                          <Text style={[styles.featureBadgeText, { color: badgeTextColor }]}>
                            {badgeLabel}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text variant="bodyMedium" style={styles.featureDescription}>
                      {item.description}
                    </Text>
                    <Button
                      mode="outlined"
                      onPress={handleNavigate}
                      disabled={isComingSoon}
                      style={[styles.featureCta, isComingSoon && styles.featureCtaDisabled]}
                      labelStyle={[styles.featureCtaLabel, isComingSoon && styles.featureCtaLabelDisabled]}
                    >
                      {item.cta ?? (isComingSoon ? 'Coming Soon' : 'Open')}
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            );
          })}
        </View>
      );
    },
    [onGetStarted, onNavigateTo, theme.colors.onBackground]
  );

  const sectionRenderers: SectionRendererMap = useMemo(
    () => ({
      hero: () => heroRenderer(),
      'feature-cards': featureRenderer,
    }),
    [featureRenderer, heroRenderer]
  );

  const customComponentRenderers: CustomComponentRendererMap = useMemo(
    () => ({
      QuickStart: (_context, metadata) => (
        <QuickStartSection
          title={typeof metadata['title'] === 'string' ? (metadata['title'] as string) : undefined}
          subtitle={typeof metadata['subtitle'] === 'string' ? (metadata['subtitle'] as string) : undefined}
          description={typeof metadata['description'] === 'string' ? (metadata['description'] as string) : undefined}
          ctaLabel={typeof metadata['ctaLabel'] === 'string' ? (metadata['ctaLabel'] as string) : undefined}
          footnote={typeof metadata['footnote'] === 'string' ? (metadata['footnote'] as string) : undefined}
          inputLabels={
            isRecord(metadata['inputLabels'])
              ? (metadata['inputLabels'] as QuickStartInputMetadata)
              : undefined
          }
          strategyMetadata={
            isRecord(metadata['strategy'])
              ? (metadata['strategy'] as QuickStartStrategyMetadata)
              : undefined
          }
          resultsMetadata={
            isRecord(metadata['results'])
              ? (metadata['results'] as QuickStartResultsMetadata)
              : undefined
          }
          readinessMessages={
            isRecord(metadata['readinessMessages'])
              ? (metadata['readinessMessages'] as ReadinessMessages)
              : undefined
          }
          onNavigateTo={(route, params) => {
            const target = routeMap[route] ?? route;
            if (onNavigateTo) {
              onNavigateTo(target);
            } else {
              onGetStarted();
            }
          }}
        />
      ),
    }),
    [onGetStarted, onNavigateTo]
  );

  const heroFooter =
    typeof heroMetadata['footerNote'] === 'string' && (heroMetadata['footerNote'] as string).trim().length > 0
      ? (heroMetadata['footerNote'] as string)
      : undefined;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <ScreenRenderer
          screen={landingScreen}
          sectionRenderers={sectionRenderers}
          customComponentRenderers={customComponentRenderers}
        />

        <Text variant="bodySmall" style={styles.note}>
          {heroFooter ?? 'Free forever • No credit card required'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  heroSection: {
    paddingTop: 40,
    paddingBottom: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 28,
    marginBottom: 12,
    width: '100%',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  heroContent: {
    maxWidth: 620,
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 68,
    height: 68,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#264336',
    fontWeight: '800',
    fontSize: 42,
    marginBottom: 6,
    textAlign: 'center',
  },
  heroSubtitle: {
    color: '#2FBAA0',
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroDescription: {
    color: 'rgba(38, 67, 54, 0.75)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 4,
  },
  ctaButton: {
    marginTop: 8,
    borderRadius: 999,
    paddingHorizontal: 32,
  },
  ctaButtonLabel: {
    fontSize: 17,
    fontWeight: '700',
    paddingVertical: 6,
  },
  ctaButtonContent: {
    flexDirection: 'row',
  },
  featuresSection: {
    paddingVertical: 8,
  },
  sectionTitle: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionSubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  featureCard: {
    marginBottom: 16,
    elevation: 3,
  },
  featureContent: {
    flexDirection: 'row',
    gap: 12,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureTitle: {
    fontWeight: '700',
  },
  featureBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  featureBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  featureDescription: {
    opacity: 0.75,
    marginTop: 8,
    marginBottom: 12,
  },
  featureCta: {
    alignSelf: 'flex-start',
  },
  featureCtaLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  featureCtaDisabled: {
    borderColor: 'rgba(48, 64, 58, 0.3)',
  },
  featureCtaLabelDisabled: {
    color: 'rgba(48, 64, 58, 0.6)',
  },
  note: {
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 8,
  },
});
