/**
 * Helper functions to compute complete SS & Healthcare results
 */

import { calculateSSA, estimateAIMEFromIncome } from './ssaMath';
import { calculateMedicarePremiums, checkMedicaidEligibility, calculateNetBenefit } from './medicareMath';
import { QuickModeInputs, DetailedModeInputs, SSHealthcareResults, ClaimAge } from './types';
import { quickToDetailed } from './modeUtils';

const CLAIM_AGES: ClaimAge[] = [62, 63, 64, 65, 66, 67, 68, 69, 70];

/**
 * Compute results from Quick mode inputs
 */
export function computeQuickResults(inputs: QuickModeInputs): SSHealthcareResults {
  // Estimate AIME from current income
  const aime = estimateAIMEFromIncome(inputs.incomeToday, inputs.birthYear, inputs.yearsWorked);
  
  // Convert to detailed inputs with smart defaults
  const detailedInputs = quickToDetailed(inputs);
  detailedInputs.aime = aime;
  detailedInputs.useAIME = true;
  
  // Use standard detailed computation
  return computeDetailedResults(detailedInputs);
}

/**
 * Compute complete SS & Healthcare results from Detailed inputs
 */
export function computeDetailedResults(inputs: DetailedModeInputs): SSHealthcareResults {
  // Calculate SSA at selected claim age
  const aimeOrEarnings = inputs.useAIME && inputs.aime 
    ? inputs.aime 
    : inputs.earningsHistory || [];
  
  const ssa = calculateSSA(aimeOrEarnings, inputs.birthYear, inputs.claimAge);
  
  // Calculate Medicare premiums
  const medicare = calculateMedicarePremiums(inputs);
  
  // Check Medicaid eligibility
  const medicaid = checkMedicaidEligibility(ssa.monthlyAtClaimAge, inputs.stateCode);
  
  // Calculate net benefit
  const net = calculateNetBenefit(
    ssa.monthlyAtClaimAge,
    medicare,
    medicaid,
    inputs.employerHealthcareOffset
  );
  
  // Sweep all claim ages to show chart
  const sweep = CLAIM_AGES.map((age) => {
    const ssaAtAge = calculateSSA(aimeOrEarnings, inputs.birthYear, age);
    const medicareAtAge = calculateMedicarePremiums({ ...inputs, claimAge: age });
    const medicaidAtAge = checkMedicaidEligibility(ssaAtAge.monthlyAtClaimAge, inputs.stateCode);
    const netAtAge = calculateNetBenefit(
      ssaAtAge.monthlyAtClaimAge,
      medicareAtAge,
      medicaidAtAge,
      inputs.employerHealthcareOffset
    );
    
    return {
      age,
      ssMonthly: ssaAtAge.monthlyAtClaimAge,
      netMonthly: netAtAge.netMonthly,
    };
  });
  
  return {
    ssa,
    medicare,
    medicaid,
    net,
    sweep,
  };
}

/**
 * Unified compute function that accepts Quick or Detailed mode inputs
 */
export function computeSSHealthcareResults(inputs: QuickModeInputs | DetailedModeInputs): SSHealthcareResults {
  // Type guard: Check if inputs are Quick mode
  if ('incomeToday' in inputs && 'yearsWorked' in inputs) {
    return computeQuickResults(inputs as QuickModeInputs);
  }
  
  // Otherwise treat as Detailed mode
  return computeDetailedResults(inputs as DetailedModeInputs);
}
