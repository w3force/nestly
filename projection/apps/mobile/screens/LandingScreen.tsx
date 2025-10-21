/**
 * Landing Screen (Mobile)
 * Schema-driven rendering with reusable section renderers.
 */
import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
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

const routeMap: Record<string, string> = {
  deterministic: 'Deterministic',
  whatif: 'WhatIf',
  monteCarlo: 'Calculator',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export default function LandingScreen({ onGetStarted, onNavigateTo }: LandingScreenProps) {
  const theme = useTheme();

  const heroRenderer = useMemo(() => {
    const heroSection = landingScreen.sections.find((section) => section.id === 'hero');
    const metadata = (heroSection?.metadata as Record<string, unknown>) ?? {};
    const metaHeroTitle = metadata['heroTitle'];
    const heroTitle =
      (typeof metaHeroTitle === 'string' && metaHeroTitle.trim().length > 0 ? metaHeroTitle : undefined) ??
      'Nestly';
    const metaHeroTagline = metadata['heroTagline'];
    const heroTagline =
      (typeof metaHeroTagline === 'string' && metaHeroTagline.trim().length > 0 ? metaHeroTagline : undefined) ??
      heroSection?.description ??
      landingScreen.description;
    const metaHeroDescription = metadata['heroDescription'];
    const heroDescription =
      (typeof metaHeroDescription === 'string' && metaHeroDescription.trim().length > 0
        ? metaHeroDescription
        : undefined) ??
      'Nestly helps you project your savings, 401(k), Social Security, Medicare costs, and investments over time — guiding you to build a secure financial future.';
    const metaPrimaryCta = metadata['primaryCTA'];
    const primaryCTA =
      (typeof metaPrimaryCta === 'string' && metaPrimaryCta.trim().length > 0 ? metaPrimaryCta : undefined) ??
      'Start Planning Now';
    const metaSecondaryCta = metadata['secondaryCTA'];
    const secondaryCTA = typeof metaSecondaryCta === 'string' && metaSecondaryCta.trim().length > 0
      ? metaSecondaryCta
      : undefined;

    return () => (
      <LinearGradient
        colors={['#E9F7EF', '#D9F1E6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
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
          {secondaryCTA ? (
            <Button
              mode="outlined"
              onPress={() => onNavigateTo?.('Auth')}
              style={styles.secondaryButton}
              labelStyle={styles.secondaryButtonLabel}
            >
              {secondaryCTA}
            </Button>
          ) : null}
        </View>
      </LinearGradient>
    );
  }, [onGetStarted, onNavigateTo]);

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
            const isPremium = item.badge === 'PREMIUM';
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
                      {isPremium && (
                        <View style={styles.premiumBadge}>
                          <Text style={styles.premiumText}>{item.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text variant="bodyMedium" style={styles.featureDescription}>
                      {item.description}
                    </Text>
                    <Button
                      mode="outlined"
                      onPress={handleNavigate}
                      style={styles.featureCta}
                      labelStyle={styles.featureCtaLabel}
                    >
                      {item.cta ?? 'Open'}
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

  const heroFooter = landingScreen.sections.find((section) => section.id === 'hero')?.metadata?.footerNote as string | undefined;

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
    padding: 24,
    gap: 24,
  },
  heroSection: {
    paddingTop: 88,
    paddingBottom: 64,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderRadius: 24,
    marginBottom: 16,
  },
  heroContent: {
    maxWidth: 620,
    alignItems: 'center',
  },
  heroTitle: {
    color: '#264336',
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    color: '#2FBAA0',
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroDescription: {
    color: 'rgba(38, 67, 54, 0.75)',
    textAlign: 'center',
    marginBottom: 36,
    lineHeight: 26,
    paddingHorizontal: 8,
  },
  ctaButton: {
    marginTop: 12,
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
  secondaryButton: {
    marginTop: 12,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#69B47A',
  },
  secondaryButtonLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#69B47A',
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
  premiumBadge: {
    backgroundColor: '#FFD54F',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  premiumText: {
    color: '#1A1A1A',
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
  note: {
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 8,
  },
});
