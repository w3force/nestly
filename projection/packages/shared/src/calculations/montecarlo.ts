/**
 * Monte Carlo Simulation Utility Functions
 * Shared calculation logic between web and mobile platforms
 */

import type {
  MonteCarloResponse,
  MonteCarloChartPoint,
  MonteCarloInput,
  RiskLevel,
} from '../types/montecarlo';
import { RISK_PROFILES } from '../types/montecarlo';

/**
 * Transform Monte Carlo API response into chart data points
 * Converts percentile arrays into structured chart points by age
 */
export function transformMonteCarloData(
  response: MonteCarloResponse,
  startAge: number
): MonteCarloChartPoint[] {
  const { percentiles } = response;
  
  const p5Array = percentiles.p5 || [];
  const p25Array = percentiles.p25 || [];
  const p50Array = percentiles.p50 || [];
  const p75Array = percentiles.p75 || [];
  const p95Array = percentiles.p95 || [];

  const length = Math.max(
    p5Array.length,
    p25Array.length,
    p50Array.length,
    p75Array.length,
    p95Array.length
  );

  const chartData: MonteCarloChartPoint[] = [];

  for (let i = 0; i < length; i++) {
    chartData.push({
      age: startAge + i,
      p5: p5Array[i] || 0,
      p25: p25Array[i] || 0,
      p50: p50Array[i] || 0,
      p75: p75Array[i] || 0,
      p95: p95Array[i] || 0,
    });
  }

  return chartData;
}

/**
 * Format currency for display in Monte Carlo charts
 * Handles millions, thousands, and whole numbers with abbreviated format
 */
export function formatMonteCarloValue(value: number | undefined | null): string {
  if (value == null || Number.isNaN(value)) {
    return '—';
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}k`;
  }

  return `$${Math.round(value).toLocaleString()}`;
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number | undefined | null): string {
  if (value == null || Number.isNaN(value)) {
    return '—';
  }
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Calculate years until retirement
 */
export function calculateYearsToRetirement(currentAge: number, retireAge: number): number {
  return Math.max(0, retireAge - currentAge);
}

/**
 * Get percentile value at a specific age
 */
export function getPercentileAtAge(
  chartData: MonteCarloChartPoint[],
  age: number,
  percentile: 'p5' | 'p25' | 'p50' | 'p75' | 'p95'
): number | undefined {
  const point = chartData.find((p) => p.age === age);
  return point?.[percentile];
}

/**
 * Calculate probability range message
 * Interprets success probability for user
 */
export function getProbabilityMessage(probability: number | undefined | null): string {
  if (probability == null || Number.isNaN(probability)) {
    return 'Unable to calculate probability';
  }

  const percent = probability * 100;

  if (percent >= 90) {
    return `Excellent! ${percent.toFixed(0)}% chance of meeting your retirement goal.`;
  }
  if (percent >= 75) {
    return `Good! ${percent.toFixed(0)}% chance of meeting your retirement goal.`;
  }
  if (percent >= 50) {
    return `Fair. ${percent.toFixed(0)}% chance of meeting your retirement goal. Consider increasing contributions.`;
  }
  if (percent >= 25) {
    return `Concerning. Only ${percent.toFixed(0)}% chance of meeting your retirement goal. Significant changes needed.`;
  }
  return `High risk. Only ${percent.toFixed(0)}% chance of meeting your retirement goal. Major adjustments required.`;
}

/**
 * Calculate range between percentiles
 * Useful for showing uncertainty/risk
 */
export function calculatePercentileRange(
  chartData: MonteCarloChartPoint[],
  age: number
): {
  median: number;
  best: number;
  worst: number;
  range: number;
} {
  const point = chartData.find((p) => p.age === age);
  
  if (!point) {
    return { median: 0, best: 0, worst: 0, range: 0 };
  }

  return {
    median: point.p50,
    best: point.p95,
    worst: point.p5,
    range: point.p95 - point.p5,
  };
}

/**
 * Get risk level based on volatility
 */
export function getRiskLevel(volatility: number): RiskLevel {
  if (volatility <= 0.10) return 'conservative';
  if (volatility <= 0.18) return 'moderate';
  return 'aggressive';
}

/**
 * Apply risk profile to Monte Carlo input
 */
export function applyRiskProfile(
  input: MonteCarloInput,
  riskLevel: RiskLevel
): MonteCarloInput {
  const profile = RISK_PROFILES[riskLevel];
  
  return {
    ...input,
    expected_return: profile.expectedReturn,
    return_volatility: profile.returnVolatility,
  };
}

/**
 * Validate Monte Carlo input parameters
 */
export function validateMonteCarloInput(input: MonteCarloInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (input.current_age <= 0 || input.current_age >= 100) {
    errors.push('Current age must be between 1 and 99');
  }

  if (input.retire_age <= input.current_age) {
    errors.push('Retirement age must be greater than current age');
  }

  if (input.retire_age > 100) {
    errors.push('Retirement age cannot exceed 100');
  }

  if (input.current_balance < 0) {
    errors.push('Current balance cannot be negative');
  }

  if (input.annual_contrib < 0) {
    errors.push('Annual contribution cannot be negative');
  }

  if (input.expected_return <= -0.9) {
    errors.push('Expected return must be greater than -90%');
  }

  if (input.return_volatility < 0) {
    errors.push('Return volatility cannot be negative');
  }

  if (input.inflation && input.inflation < 0) {
    errors.push('Inflation cannot be negative');
  }

  if (input.n_paths && (input.n_paths < 100 || input.n_paths > 200000)) {
    errors.push('Number of paths must be between 100 and 200,000');
  }

  if (input.fees_annual && (input.fees_annual < 0 || input.fees_annual > 0.05)) {
    errors.push('Annual fees must be between 0% and 5%');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate contribution growth over time
 */
export function calculateContributionGrowth(
  initialContribution: number,
  salaryGrowth: number,
  years: number
): number[] {
  const contributions: number[] = [];
  let currentContribution = initialContribution;

  for (let i = 0; i < years; i++) {
    contributions.push(currentContribution);
    currentContribution *= 1 + salaryGrowth;
  }

  return contributions;
}

/**
 * Calculate total contributions over time
 */
export function calculateTotalContributions(
  initialContribution: number,
  salaryGrowth: number,
  employerMatchRate: number,
  years: number
): number {
  const contributions = calculateContributionGrowth(initialContribution, salaryGrowth, years);
  const totalEmployee = contributions.reduce((sum, contrib) => sum + contrib, 0);
  const totalEmployer = totalEmployee * employerMatchRate;
  
  return totalEmployee + totalEmployer;
}

/**
 * Estimate required savings for retirement goal
 * Uses simple present value calculation
 */
export function estimateRequiredSavings(
  retirementSpend: number,
  horizonYears: number,
  inflationRate: number,
  expectedReturn: number
): number {
  const realReturn = (1 + expectedReturn) / (1 + inflationRate) - 1;
  
  if (Math.abs(realReturn) < 0.0001) {
    // If real return is near zero, use simple multiplication
    return retirementSpend * horizonYears;
  }

  // Present value of annuity formula
  const pv = retirementSpend * (1 - Math.pow(1 + realReturn, -horizonYears)) / realReturn;
  return pv;
}
