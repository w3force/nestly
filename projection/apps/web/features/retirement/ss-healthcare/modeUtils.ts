/**
 * Utility functions for mode conversion and defaults
 */

import { QuickModeInputs, DetailedModeInputs } from './types';
import { getFRA } from './config';

/**
 * Convert Quick mode inputs to Detailed mode inputs
 * Applies smart defaults for all unspecified fields
 */
export function quickToDetailed(quick: QuickModeInputs): DetailedModeInputs {
  return {
    birthYear: quick.birthYear,
    claimAge: quick.claimAge,
    aime: undefined, // Will be estimated from incomeToday
    earningsHistory: undefined,
    useAIME: false, // Will use income estimation
    filingStatus: 'SINGLE', // Default assumption
    magi: Math.min(quick.incomeToday * 0.9, 80000), // Conservative estimate (90% of income, capped)
    stateCode: quick.stateCode,
    planType: 'ADVANTAGE', // Quick mode default
    medigapPremiumOverride: undefined,
    partDPremiumOverride: undefined,
    advantagePremiumOverride: 20, // Typical Advantage premium
    employerHealthcareOffset: 0,
    assumptionsYear: 2025,
    hasPartACoverage: true, // Assume 40 credits
    partAPremium: undefined,
  };
}

/**
 * Get default Quick mode inputs
 */
export function getDefaultQuickInputs(): QuickModeInputs {
  const birthYear = new Date().getFullYear() - 45; // 45 years old
  const fra = getFRA(birthYear);
  
  return {
    birthYear,
    claimAge: Math.floor(fra) as any, // FRA as default claim age
    incomeToday: 75000,
    yearsWorked: 25,
    stateCode: 'CA',
  };
}

/**
 * Get default Detailed mode inputs
 */
export function getDefaultDetailedInputs(): DetailedModeInputs {
  const birthYear = new Date().getFullYear() - 45;
  const fra = getFRA(birthYear);
  
  return {
    birthYear,
    claimAge: Math.floor(fra) as any,
    useAIME: true,
    aime: 5000,
    filingStatus: 'SINGLE',
    magi: 75000,
    stateCode: 'CA',
    planType: 'ORIGINAL',
    hasPartACoverage: true,
    employerHealthcareOffset: 0,
    assumptionsYear: 2025,
  };
}

/**
 * Check if Quick mode should show IRMAA warning
 */
export function shouldShowIRMAAWarning(income: number, filingStatus: 'SINGLE' | 'MARRIED' = 'SINGLE'): boolean {
  const threshold = filingStatus === 'SINGLE' ? 103000 : 206000;
  return income * 0.9 > threshold; // 90% of income as MAGI estimate
}
