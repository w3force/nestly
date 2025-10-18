/**
 * Social Security Administration Calculations
 * 
 * Implements AIME (Average Indexed Monthly Earnings), PIA (Primary Insurance Amount),
 * and claim-age adjustments based on SSA formulas.
 */

import {
  ClaimAge,
  EarningsRecord,
  SSACalculation,
  QuickModeInputs,
} from '../types/retirement';
import {
  getBendPoints,
  getFRA,
  EARLY_REDUCTION,
  DELAYED_CREDIT_PER_MONTH,
  WAGE_INDEX_FACTORS,
  SS_WAGE_BASE,
} from '../config/retirement';

/**
 * Estimate AIME from current income (Quick mode heuristic)
 * 
 * Approximates lifetime earnings by:
 * 1. Projecting incomeToday backward with wage indexing
 * 2. Assuming yearsWorked (default 35) with zero-padding
 * 3. Capping at SS wage base per year
 * 4. Computing AIME from top 35 years
 */
export function estimateAIMEFromIncome(
  incomeToday: number,
  birthYear: number,
  yearsWorked: number = 35
): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  const year62 = birthYear + 62;
  const indexYear = year62 - 2;
  
  // Build approximate earnings history
  const earnings: EarningsRecord[] = [];
  const startYear = Math.max(birthYear + 22, currentYear - yearsWorked); // Assume work starts at 22
  
  for (let year = startYear; year <= currentYear; year++) {
    // Simple approximation: assume constant real income with wage growth
    const yearsAgo = currentYear - year;
    const growthFactor = Math.pow(1.03, -yearsAgo); // ~3% annual wage growth
    const estimatedIncome = Math.min(
      incomeToday * growthFactor,
      SS_WAGE_BASE[year] || 200000
    );
    
    earnings.push({ year, amount: estimatedIncome });
  }
  
  // Use standard AIME calculation
  return calculateAIME(earnings, birthYear);
}

/**
 * Calculate AIME from earnings history
 * 
 * Steps:
 * 1. Index each year's earnings to current wage levels
 * 2. Select highest 35 years (pad with zeros if less)
 * 3. Sum and divide by 420 (35 years × 12 months)
 */
export function calculateAIME(
  earnings: EarningsRecord[],
  birthYear: number
): number {
  const year62 = birthYear + 62;
  const indexYear = year62 - 2; // Index to 2 years before age 62
  
  // Index earnings
  const indexedEarnings = earnings.map((record) => {
    // Don't index earnings from age 60+ (use actual amounts)
    if (record.year >= year62 - 2) {
      return { year: record.year, indexed: record.amount };
    }
    
    // Get wage index factors
    const recordFactor = WAGE_INDEX_FACTORS[record.year] || estimateWageFactor(record.year);
    const indexYearFactor = WAGE_INDEX_FACTORS[indexYear] || 1.0;
    
    // Apply wage base cap
    const cappedWages = Math.min(
      record.amount,
      SS_WAGE_BASE[record.year] || 200000 // Fallback cap
    );
    
    // Index the wages
    const indexed = cappedWages * (indexYearFactor / recordFactor);
    
    return { year: record.year, indexed };
  });
  
  // Sort by indexed amount (descending) and take top 35
  const sortedEarnings = indexedEarnings
    .map(e => e.indexed)
    .sort((a, b) => b - a);
  
  const top35 = sortedEarnings.slice(0, 35);
  
  // Pad with zeros if less than 35 years
  while (top35.length < 35) {
    top35.push(0);
  }
  
  // Calculate AIME: sum of top 35 years divided by 420 months
  const sumTop35 = top35.reduce((sum, val) => sum + val, 0);
  const aime = sumTop35 / 420; // 35 years × 12 months
  
  return Math.round(aime); // Round to nearest dollar
}

/**
 * Estimate wage index factor for years not in config
 * Uses simple approximation: ~3% annual growth
 */
function estimateWageFactor(year: number): number {
  const knownYears = Object.keys(WAGE_INDEX_FACTORS).map(Number).sort();
  const latestYear = Math.max(...knownYears);
  const latestFactor = WAGE_INDEX_FACTORS[latestYear];
  
  if (year > latestYear) {
    // Future year: grow by ~3% per year
    const yearsDiff = year - latestYear;
    return latestFactor * Math.pow(1.03, yearsDiff);
  } else {
    // Past year: shrink by ~3% per year
    const yearsDiff = latestYear - year;
    return latestFactor / Math.pow(1.03, yearsDiff);
  }
}

/**
 * Calculate PIA (Primary Insurance Amount) from AIME
 * 
 * Formula (2025 example):
 * PIA = 90% of first $1,226 +
 *       32% of amount between $1,226 and $7,391 +
 *       15% of amount over $7,391
 */
export function calculatePIA(aime: number, birthYear: number): number {
  const year62 = birthYear + 62;
  const bendPoints = getBendPoints(year62);
  
  let pia = 0;
  
  // First bend point: 90%
  const firstPortion = Math.min(aime, bendPoints.first);
  pia += firstPortion * 0.90;
  
  // Second bend point: 32%
  if (aime > bendPoints.first) {
    const secondPortion = Math.min(aime, bendPoints.second) - bendPoints.first;
    pia += secondPortion * 0.32;
  }
  
  // Third portion: 15%
  if (aime > bendPoints.second) {
    const thirdPortion = aime - bendPoints.second;
    pia += thirdPortion * 0.15;
  }
  
  // Round down to nearest $0.10
  return Math.floor(pia * 10) / 10;
}

/**
 * Calculate monthly benefit at claim age
 * 
 * Applies early retirement reduction or delayed retirement credits
 */
export function calculateClaimAgeAdjustment(
  pia: number,
  claimAge: ClaimAge,
  birthYear: number
): {
  monthlyBenefit: number;
  adjustmentPercent: number;
  monthsEarlyOrLate: number;
} {
  const fra = getFRA(birthYear);
  const fraMonths = Math.round(fra * 12);
  const claimMonths = claimAge * 12;
  const monthsDiff = claimMonths - fraMonths;
  
  if (monthsDiff === 0) {
    // Claiming at FRA
    return {
      monthlyBenefit: pia,
      adjustmentPercent: 0,
      monthsEarlyOrLate: 0,
    };
  }
  
  if (monthsDiff < 0) {
    // Early retirement (before FRA)
    return calculateEarlyReduction(pia, Math.abs(monthsDiff));
  } else {
    // Delayed retirement (after FRA)
    return calculateDelayedCredit(pia, monthsDiff);
  }
}

/**
 * Calculate early retirement reduction
 * 
 * First 36 months: 5/9% per month (0.5556%)
 * Additional months: 5/12% per month (0.4167%)
 */
function calculateEarlyReduction(
  pia: number,
  monthsEarly: number
): {
  monthlyBenefit: number;
  adjustmentPercent: number;
  monthsEarlyOrLate: number;
} {
  let reductionPercent = 0;
  
  // First 36 months
  const first36 = Math.min(monthsEarly, 36);
  reductionPercent += first36 * EARLY_REDUCTION.first36Months;
  
  // Additional months beyond 36
  if (monthsEarly > 36) {
    const additional = monthsEarly - 36;
    reductionPercent += additional * EARLY_REDUCTION.additionalMonths;
  }
  
  const adjustedBenefit = pia * (1 - reductionPercent);
  
  return {
    monthlyBenefit: Math.round(adjustedBenefit * 100) / 100,
    adjustmentPercent: -reductionPercent * 100, // Negative for reduction
    monthsEarlyOrLate: -monthsEarly,
  };
}

/**
 * Calculate delayed retirement credits
 * 
 * 8% per year = 2/3% per month (0.6667%)
 */
function calculateDelayedCredit(
  pia: number,
  monthsDelayed: number
): {
  monthlyBenefit: number;
  adjustmentPercent: number;
  monthsEarlyOrLate: number;
} {
  const creditPercent = monthsDelayed * DELAYED_CREDIT_PER_MONTH;
  const adjustedBenefit = pia * (1 + creditPercent);
  
  return {
    monthlyBenefit: Math.round(adjustedBenefit * 100) / 100,
    adjustmentPercent: creditPercent * 100, // Positive for credit
    monthsEarlyOrLate: monthsDelayed,
  };
}

/**
 * Complete SSA calculation
 * 
 * Calculates AIME, PIA, and monthly benefit at claim age
 */
export function calculateSSA(
  aimeOrEarnings: number | EarningsRecord[],
  birthYear: number,
  claimAge: ClaimAge
): SSACalculation {
  // Calculate AIME
  const aime = typeof aimeOrEarnings === 'number'
    ? aimeOrEarnings
    : calculateAIME(aimeOrEarnings, birthYear);
  
  // Calculate PIA
  const pia = calculatePIA(aime, birthYear);
  
  // Get FRA
  const fra = getFRA(birthYear);
  
  // Calculate benefit at FRA (equals PIA)
  const monthlyAtFRA = pia;
  
  // Calculate benefit at claim age
  const claimAdjustment = calculateClaimAgeAdjustment(pia, claimAge, birthYear);
  
  return {
    aime,
    pia,
    monthlyAtFRA,
    monthlyAtClaimAge: claimAdjustment.monthlyBenefit,
    reductionOrCredit: claimAdjustment.adjustmentPercent,
    fra,
  };
}

/**
 * Parse CSV earnings history
 * 
 * Expected format: "year,amount" per line
 * Example:
 *   2020,75000
 *   2021,80000
 *   2022,85000
 */
export function parseEarningsCSV(csv: string): EarningsRecord[] {
  const lines = csv.trim().split('\n');
  const earnings: EarningsRecord[] = [];
  
  for (const line of lines) {
    const [yearStr, amountStr] = line.split(',').map(s => s.trim());
    const year = parseInt(yearStr, 10);
    const amount = parseFloat(amountStr);
    
    if (!isNaN(year) && !isNaN(amount) && year > 1900 && year < 2100) {
      earnings.push({ year, amount });
    }
  }
  
  return earnings;
}
