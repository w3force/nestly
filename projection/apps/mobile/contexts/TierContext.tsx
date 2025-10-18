/**
 * Tier Context Provider
 * Manages subscription tier state with AsyncStorage persistence
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TierLevel,
  TierConfig,
  TierFeatures,
  getTierConfig,
  getTierFeatures,
  hasFeatureAccess as checkFeatureAccess,
} from '@projection/shared';

const TIER_STORAGE_KEY = '@nestly_user_tier';

interface TierContextValue {
  currentTier: TierLevel;
  tierConfig: TierConfig;
  features: TierFeatures;
  isLoading: boolean;
  setTier: (tier: TierLevel) => Promise<void>;
  hasFeature: (feature: keyof TierFeatures) => boolean;
  canAccessFeature: (feature: keyof TierFeatures) => boolean;
  upgradeRequired: (feature: keyof TierFeatures) => boolean;
}

const TierContext = createContext<TierContextValue | undefined>(undefined);

interface TierProviderProps {
  children: ReactNode;
  defaultTier?: TierLevel;
}

export function TierProvider({ children, defaultTier = 'FREE' }: TierProviderProps) {
  const [currentTier, setCurrentTier] = useState<TierLevel>(defaultTier);
  const [isLoading, setIsLoading] = useState(true);

  // Load tier from AsyncStorage on mount
  useEffect(() => {
    loadTier();
  }, []);

  const loadTier = async () => {
    try {
      const stored = await AsyncStorage.getItem(TIER_STORAGE_KEY);
      if (stored && (stored === 'FREE' || stored === 'PRO' || stored === 'PREMIUM')) {
        setCurrentTier(stored as TierLevel);
      }
    } catch (error) {
      console.error('Failed to load tier from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTier = async (tier: TierLevel) => {
    try {
      await AsyncStorage.setItem(TIER_STORAGE_KEY, tier);
      setCurrentTier(tier);
    } catch (error) {
      console.error('Failed to save tier to storage:', error);
      throw error;
    }
  };

  const tierConfig = getTierConfig(currentTier);
  const features = getTierFeatures(currentTier);

  const hasFeature = (feature: keyof TierFeatures): boolean => {
    return checkFeatureAccess(currentTier, feature);
  };

  const canAccessFeature = (feature: keyof TierFeatures): boolean => {
    const value = features[feature];
    // For boolean features, check if true
    if (typeof value === 'boolean') return value;
    // For numeric features, check if greater than 0
    if (typeof value === 'number') return value > 0;
    return false;
  };

  const upgradeRequired = (feature: keyof TierFeatures): boolean => {
    return !canAccessFeature(feature);
  };

  const value: TierContextValue = {
    currentTier,
    tierConfig,
    features,
    isLoading,
    setTier,
    hasFeature,
    canAccessFeature,
    upgradeRequired,
  };

  return <TierContext.Provider value={value}>{children}</TierContext.Provider>;
}

export function useTier(): TierContextValue {
  const context = useContext(TierContext);
  if (context === undefined) {
    throw new Error('useTier must be used within a TierProvider');
  }
  return context;
}

/**
 * Hook to check feature access and get upgrade info
 */
export function useFeatureAccess(feature: keyof TierFeatures) {
  const { canAccessFeature, upgradeRequired, currentTier, tierConfig } = useTier();

  return {
    hasAccess: canAccessFeature(feature),
    needsUpgrade: upgradeRequired(feature),
    currentTier,
    tierName: tierConfig.name,
    tierBadge: tierConfig.badge,
  };
}

/**
 * Hook for numeric feature limits (e.g., max scenarios)
 */
export function useFeatureLimit(feature: keyof TierFeatures): number {
  const { features } = useTier();
  const value = features[feature];
  return typeof value === 'number' ? value : 0;
}
