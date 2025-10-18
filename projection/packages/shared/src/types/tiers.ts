/**
 * Tier System Types and Configuration
 * Defines subscription tiers and feature access control
 */

/**
 * Available subscription tiers
 */
export type TierLevel = 'FREE' | 'PRO' | 'PREMIUM';

/**
 * Feature access configuration for each tier
 */
export interface TierFeatures {
  // Monte Carlo
  monteCarloEnabled: boolean;
  monteCarloFullAccess: boolean; // false = preview mode only
  maxSimulations: number;

  // What-If Scenarios
  whatIfEnabled: boolean;
  maxScenarios: number;

  // Social Security & Healthcare
  ssHealthcareEnabled: boolean;
  ssDetailedMode: boolean; // false = quick mode only

  // General
  exportData: boolean;
  prioritySupport: boolean;
  adFree: boolean;
}

/**
 * Tier definition with features and pricing
 */
export interface TierConfig {
  level: TierLevel;
  name: string;
  description: string;
  monthlyPrice: number; // in USD, 0 for free
  yearlyPrice: number; // in USD, 0 for free
  features: TierFeatures;
  badge: string; // emoji or icon identifier
  color: string; // brand color for tier
}

/**
 * Tier configurations for all levels
 * Web pricing: Free (Free) | Standard (Free) | Premium ($5.98/mo or $49.99/yr)
 * Mobile matches web pricing
 */
export const TIER_CONFIGS: Record<TierLevel, TierConfig> = {
  FREE: {
    level: 'FREE',
    name: 'Free',
    description: 'Get started with basic retirement planning tools',
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: '🪴',
    color: '#69B47A', // green (matches web)
    features: {
      monteCarloEnabled: true,
      monteCarloFullAccess: false, // preview only
      maxSimulations: 1000,
      whatIfEnabled: true,
      maxScenarios: 2,
      ssHealthcareEnabled: true,
      ssDetailedMode: false, // quick mode only
      exportData: false,
      prioritySupport: false,
      adFree: false,
    },
  },
  PRO: {
    level: 'PRO',
    name: 'Standard',
    description: 'Unlock advanced features with free sign-in',
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: '🌱',
    color: '#4ABDAC', // teal (matches web)
    features: {
      monteCarloEnabled: true,
      monteCarloFullAccess: false, // preview only (based on web)
      maxSimulations: 3000,
      whatIfEnabled: true,
      maxScenarios: 3,
      ssHealthcareEnabled: true,
      ssDetailedMode: true, // detailed mode for Standard (from web)
      exportData: true, // 1 report/month based on web
      prioritySupport: false,
      adFree: false,
    },
  },
  PREMIUM: {
    level: 'PREMIUM',
    name: 'Premium',
    description: 'Ultimate retirement planning with full access',
    monthlyPrice: 5.98,
    yearlyPrice: 49.99,
    badge: '💎',
    color: '#FFD54F', // gold (matches web)
    features: {
      monteCarloEnabled: true,
      monteCarloFullAccess: true, // full access
      maxSimulations: 50000,
      whatIfEnabled: true,
      maxScenarios: 10,
      ssHealthcareEnabled: true,
      ssDetailedMode: true,
      exportData: true,
      prioritySupport: true,
      adFree: true,
    },
  },
};

/**
 * Get tier configuration by level
 */
export function getTierConfig(level: TierLevel): TierConfig {
  return TIER_CONFIGS[level];
}

/**
 * Get features for a specific tier
 */
export function getTierFeatures(level: TierLevel): TierFeatures {
  return TIER_CONFIGS[level].features;
}

/**
 * Check if a feature is available for a tier
 */
export function hasFeatureAccess(
  level: TierLevel,
  feature: keyof TierFeatures
): boolean {
  return TIER_CONFIGS[level].features[feature] as boolean;
}

/**
 * Get upgrade message for feature restriction
 */
export function getUpgradeMessage(
  feature: string,
  currentTier: TierLevel,
  requiredTier: TierLevel
): string {
  const current = TIER_CONFIGS[currentTier];
  const required = TIER_CONFIGS[requiredTier];

  return `${feature} requires ${required.badge} ${required.name} (${
    required.monthlyPrice > 0
      ? `$${required.monthlyPrice}/month`
      : 'free upgrade'
  }). You're currently on ${current.badge} ${current.name}.`;
}

/**
 * Compare features between tiers for comparison table
 */
export interface TierComparison {
  feature: string;
  free: boolean | string | number;
  pro: boolean | string | number;
  premium: boolean | string | number;
}

/**
 * Feature comparison data for plans table
 * Matches web PlansComparison with all 12 features
 */
export const TIER_COMPARISON: TierComparison[] = [
  {
    feature: 'Quick Start (No Setup Needed)',
    free: true,
    pro: true,
    premium: true,
  },
  {
    feature: 'Smart 401(k) & Savings Calculator',
    free: true,
    pro: true,
    premium: 'Advanced with tax & inflation',
  },
  {
    feature: 'Projection Graphs & Growth Curve',
    free: 'Static',
    pro: 'Up to 3',
    premium: 'Advanced with custom metrics',
  },
  {
    feature: 'Save Your Scenarios',
    free: false,
    pro: 'Up to 3',
    premium: 'Unlimited',
  },
  {
    feature: '"What-If" Simulator',
    free: 'One parameter',
    pro: 'Multi-parameter',
    premium: 'Unlimited + side-by-side compare',
  },
  {
    feature: 'Goal Tracker',
    free: false,
    pro: 'Basic goals',
    premium: 'Full goal dashboard & milestones',
  },
  {
    feature: 'AI Insights & Tips',
    free: false,
    pro: 'Basic',
    premium: 'Personalized Advisor Mode',
  },
  {
    feature: 'Portfolio & Account Sync (Plaid/API)',
    free: false,
    pro: false,
    premium: 'Real-time updates',
  },
  {
    feature: 'Data Export (PDF / CSV)',
    free: false,
    pro: '1 report/month',
    premium: 'Unlimited exports',
  },
  {
    feature: 'Visual Themes (Light / Dark Mode)',
    free: false,
    pro: false,
    premium: 'Yes',
  },
  {
    feature: 'Email / Push Notifications',
    free: false,
    pro: 'Monthly summary',
    premium: 'Smart reminders + insights',
  },
  {
    feature: 'Secure Cloud Backup',
    free: false,
    pro: 'Basic',
    premium: 'Encrypted + Priority sync',
  },
];

/**
 * Format price for display
 */
export function formatPrice(price: number, period: 'month' | 'year' = 'month'): string {
  if (price === 0) return 'Free';
  return `$${price.toFixed(2)}/${period}`;
}

/**
 * Calculate savings for yearly vs monthly
 */
export function getYearlySavings(tier: TierLevel): number {
  const config = TIER_CONFIGS[tier];
  const monthlyAnnual = config.monthlyPrice * 12;
  return monthlyAnnual - config.yearlyPrice;
}

/**
 * Get recommended tier based on user needs
 */
export function getRecommendedTier(
  needsDetailed: boolean,
  needsMultipleScenarios: boolean,
  needsExport: boolean
): TierLevel {
  if (needsExport || needsDetailed) return 'PRO';
  if (needsMultipleScenarios) return 'PRO';
  return 'FREE';
}
