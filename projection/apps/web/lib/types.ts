// Core types for Nestly app
export type UserTier = 'free' | 'standard' | 'premium';

export interface Scenario {
  id: string;
  name: string;
  createdAt: string;
  assumptions: {
    currentAge: number;
    retireAge: number;
    currentBalance: number;
    contribution: number;
    expReturn: number;
    inflation: number;
  };
  results?: {
    nominalBalances: number[];
    realBalances: number[];
  };
}

export interface User {
  id?: string;
  email?: string;
  tier: UserTier;
  isGuest: boolean;
}

export interface TierFeatures {
  maxScenarios: number;
  canExport: boolean;
  exportsPerMonth: number;
  hasMonteCarlo: boolean;
  hasAIInsights: boolean;
  hasUnlimitedWhatIf: boolean;
}

export const TIER_FEATURES: Record<UserTier, TierFeatures> = {
  free: {
    maxScenarios: 3,
    canExport: false,
    exportsPerMonth: 0,
    hasMonteCarlo: false,
    hasAIInsights: false,
    hasUnlimitedWhatIf: false,
  },
  standard: {
    maxScenarios: 5,
    canExport: true,
    exportsPerMonth: 1,
    hasMonteCarlo: false,
    hasAIInsights: false,
    hasUnlimitedWhatIf: false,
  },
  premium: {
    maxScenarios: Infinity,
    canExport: true,
    exportsPerMonth: Infinity,
    hasMonteCarlo: true,
    hasAIInsights: true,
    hasUnlimitedWhatIf: true,
  },
};
