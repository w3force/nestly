/**
 * Medicare & Medicaid Calculations
 * 
 * Calculates Medicare premiums (Parts A, B, D, Medigap, Advantage),
 * IRMAA surcharges, and Medicaid eligibility.
 */

import {
  FilingStatus,
  PlanType,
  MedicareCalculation,
  MedicaidEligibility,
  NetBenefit,
  DetailedModeInputs,
} from './types';
import {
  PART_A_PREMIUM_2025,
  PART_A_PREMIUM_NO_CREDITS_2025,
  PART_B_BASE_2025,
  PART_D_BASE_2025,
  MEDIGAP_DEFAULT_2025,
  ADVANTAGE_DEFAULT_2025,
  getIRMAABracket,
  getMedicaidThreshold,
  MEDICAID_ASSET_LIMIT_SINGLE,
} from './config';

/**
 * Calculate Medicare premiums
 */
export function calculateMedicarePremiums(
  inputs: DetailedModeInputs
): MedicareCalculation {
  const {
    planType,
    magi,
    filingStatus,
    hasPartACoverage,
    partAPremium,
    medigapPremiumOverride,
    partDPremiumOverride,
    advantagePremiumOverride,
  } = inputs;
  
  // Part A Premium
  const partA = hasPartACoverage
    ? (partAPremium ?? PART_A_PREMIUM_2025)
    : PART_A_PREMIUM_NO_CREDITS_2025;
  
  // Get IRMAA bracket if MAGI provided
  let partBSurcharge = 0;
  let partDSurcharge = 0;
  let irmaApplied = false;
  
  if (magi !== undefined && magi > 0) {
    const bracket = getIRMAABracket(magi, filingStatus);
    partBSurcharge = bracket.partBSurcharge;
    partDSurcharge = bracket.partDSurcharge;
    irmaApplied = partBSurcharge > 0 || partDSurcharge > 0;
  }
  
  if (planType === 'ORIGINAL') {
    // Original Medicare: Parts A, B, D, and optional Medigap
    const partBTotal = PART_B_BASE_2025 + partBSurcharge;
    const partDTotal = (partDPremiumOverride ?? PART_D_BASE_2025) + partDSurcharge;
    const medigap = medigapPremiumOverride ?? MEDIGAP_DEFAULT_2025;
    
    return {
      partAPremium: partA,
      partBBase: PART_B_BASE_2025,
      partBIRMAA: partBSurcharge,
      partBTotal,
      partDBase: partDPremiumOverride ?? PART_D_BASE_2025,
      partDIRMAA: partDSurcharge,
      partDTotal,
      medigapPremium: medigap,
      advantagePremium: 0,
      totalMonthly: partA + partBTotal + partDTotal + medigap,
      irmaApplied,
    };
  } else {
    // Medicare Advantage (Part C)
    // Includes Part A, B, and typically D coverage
    const partBTotal = PART_B_BASE_2025 + partBSurcharge;
    const advantage = advantagePremiumOverride ?? ADVANTAGE_DEFAULT_2025;
    
    return {
      partAPremium: partA,
      partBBase: PART_B_BASE_2025,
      partBIRMAA: partBSurcharge,
      partBTotal,
      partDBase: 0, // Included in Advantage plan
      partDIRMAA: partDSurcharge, // IRMAA still applies
      partDTotal: partDSurcharge,
      medigapPremium: 0,
      advantagePremium: advantage,
      totalMonthly: partA + partBTotal + partDSurcharge + advantage,
      irmaApplied,
    };
  }
}

/**
 * Check Medicaid eligibility (simplified)
 * 
 * Dual eligible = qualifies for both Medicare and Medicaid
 * When dual eligible, Medicaid covers Medicare premiums
 */
export function checkMedicaidEligibility(
  monthlyIncome: number,
  stateCode: string,
  assets: number = 0 // Simplified: assume no assets unless specified
): MedicaidEligibility {
  const incomeThreshold = getMedicaidThreshold(stateCode);
  const assetLimit = MEDICAID_ASSET_LIMIT_SINGLE;
  
  const incomeEligible = monthlyIncome <= (incomeThreshold / 12);
  const assetEligible = assets <= assetLimit;
  
  if (incomeEligible && assetEligible) {
    return {
      eligible: true,
      reason: `Monthly income $${monthlyIncome.toFixed(0)} is below ${stateCode} threshold`,
      adjustedPremiums: 0, // Medicaid covers premiums
    };
  }
  
  if (!incomeEligible) {
    return {
      eligible: false,
      reason: `Income exceeds ${stateCode} Medicaid threshold ($${(incomeThreshold / 12).toFixed(0)}/mo)`,
      adjustedPremiums: 0,
    };
  }
  
  return {
    eligible: false,
    reason: 'Assets exceed Medicaid limit',
    adjustedPremiums: 0,
  };
}

/**
 * Calculate net monthly benefit
 * 
 * Net = SS benefit - (Medicare premiums - employer offset)
 */
export function calculateNetBenefit(
  ssMonthly: number,
  medicare: MedicareCalculation,
  medicaid: MedicaidEligibility,
  employerOffset: number = 0
): NetBenefit {
  const premiums = medicare.totalMonthly;
  const offset = Math.max(0, employerOffset);
  
  // Standard calculation
  const netMonthly = ssMonthly - Math.max(0, premiums - offset);
  
  // Dual eligible calculation (Medicaid covers premiums)
  const dualEligible = medicaid.eligible;
  const dualNetMonthly = dualEligible
    ? ssMonthly - Math.max(0, medicaid.adjustedPremiums - offset)
    : undefined;
  
  return {
    ssMonthly,
    medicarePremiums: premiums,
    employerOffset: offset,
    netMonthly,
    dualEligible,
    dualNetMonthly,
  };
}

/**
 * Calculate premium breakdown for display
 */
export function formatPremiumBreakdown(
  medicare: MedicareCalculation,
  planType: PlanType
): Array<{ label: string; amount: number }> {
  const breakdown: Array<{ label: string; amount: number }> = [];
  
  if (medicare.partAPremium > 0) {
    breakdown.push({ label: 'Part A (Hospital)', amount: medicare.partAPremium });
  }
  
  breakdown.push({
    label: medicare.irmaApplied
      ? `Part B (Medical + IRMAA $${medicare.partBIRMAA.toFixed(2)})`
      : 'Part B (Medical)',
    amount: medicare.partBTotal,
  });
  
  if (planType === 'ORIGINAL') {
    if (medicare.partDTotal > 0) {
      breakdown.push({
        label: medicare.irmaApplied
          ? `Part D (Drugs + IRMAA $${medicare.partDIRMAA.toFixed(2)})`
          : 'Part D (Prescription Drugs)',
        amount: medicare.partDTotal,
      });
    }
    
    if (medicare.medigapPremium > 0) {
      breakdown.push({
        label: 'Medigap Supplement',
        amount: medicare.medigapPremium,
      });
    }
  } else {
    // Advantage plan
    if (medicare.advantagePremium > 0) {
      breakdown.push({
        label: 'Medicare Advantage (Part C)',
        amount: medicare.advantagePremium,
      });
    }
    
    if (medicare.partDIRMAA > 0) {
      breakdown.push({
        label: 'Part D IRMAA',
        amount: medicare.partDIRMAA,
      });
    }
  }
  
  return breakdown;
}
