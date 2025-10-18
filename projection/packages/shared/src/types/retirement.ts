/**
 * Social Security & Healthcare Types
 */

export type ClaimAge = 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70;

export type FilingStatus = 'SINGLE' | 'MARRIED';

export type PlanType = 'ORIGINAL' | 'ADVANTAGE';

export type InputMode = 'QUICK' | 'DETAILED';

export interface EarningsRecord {
  year: number;
  amount: number;
}

// Quick mode inputs (minimal)
export interface QuickModeInputs {
  birthYear: number;
  claimAge: ClaimAge;
  incomeToday: number; // Annual income (used to estimate AIME)
  yearsWorked: number; // Default 35
  stateCode: string; // For Medicaid threshold
}

// Detailed mode inputs (full control)
export interface DetailedModeInputs {
  birthYear: number;
  claimAge: ClaimAge;
  aime?: number;
  earningsHistory?: EarningsRecord[];
  useAIME: boolean;
  filingStatus: FilingStatus;
  magi: number; // For IRMAA
  stateCode: string;
  planType: PlanType;
  medigapPremiumOverride?: number;
  partDPremiumOverride?: number;
  advantagePremiumOverride?: number;
  employerHealthcareOffset: number;
  assumptionsYear: number;
  hasPartACoverage: boolean;
  partAPremium?: number;
}

// Legacy type for backward compatibility
export type SSHealthcareInputs = DetailedModeInputs;

export interface SSACalculation {
  aime: number;
  pia: number; // PIA at FRA
  monthlyAtFRA: number;
  monthlyAtClaimAge: number;
  reductionOrCredit: number; // percentage adjustment
  fra: number; // Full retirement age (e.g., 67)
}

export interface MedicareCalculation {
  partAPremium: number;
  partBBase: number;
  partBIRMAA: number;
  partBTotal: number;
  partDBase: number;
  partDIRMAA: number;
  partDTotal: number;
  medigapPremium: number;
  advantagePremium: number;
  totalMonthly: number;
  irmaApplied: boolean;
}

export interface MedicaidEligibility {
  eligible: boolean;
  reason?: string;
  adjustedPremiums: number; // If dual eligible, premiums are $0
}

export interface NetBenefit {
  ssMonthly: number;
  medicarePremiums: number;
  employerOffset: number;
  netMonthly: number;
  dualEligible: boolean;
  dualNetMonthly?: number;
}

export interface ClaimAgeSweepPoint {
  age: ClaimAge;
  ssMonthly: number;
  netMonthly: number;
}

export interface SSHealthcareResults {
  ssa: SSACalculation;
  medicare: MedicareCalculation;
  medicaid: MedicaidEligibility;
  net: NetBenefit;
  sweep: ClaimAgeSweepPoint[];
}
