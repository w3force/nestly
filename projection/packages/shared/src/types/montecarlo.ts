/**
 * Monte Carlo Simulation Types
 * Shared between web and mobile platforms
 */

/**
 * Monte Carlo simulation input parameters
 */
export interface MonteCarloInput {
  current_age: number;
  retire_age: number;
  current_balance: number;
  annual_contrib: number;
  employer_match_rate?: number;
  expected_return: number;
  return_volatility: number;
  inflation?: number;
  salary_growth?: number;
  n_paths?: number;
  seed?: number | null;
  fees_annual?: number;
  glidepath?: boolean;
  rebalance_annually?: boolean;
  target_goal?: {
    retirement_spend?: number;
    horizon_years?: number;
  } | null;
}

/**
 * Monte Carlo simulation response
 */
export interface MonteCarloResponse {
  percentiles: Record<string, number[]>;
  final_balances_nominal: {
    mean: number;
    std: number;
  };
  final_balances_real: {
    mean: number;
    std: number;
  };
  success_probability?: number | null;
  sample_path: Array<{
    age: number;
    nominal: number;
    real: number;
  }>;
}

/**
 * Chart data point for Monte Carlo visualization
 */
export interface MonteCarloChartPoint {
  age: number;
  p5: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
}

/**
 * Risk level for portfolio strategy
 */
export type RiskLevel = 'conservative' | 'moderate' | 'aggressive';

/**
 * Risk profile configuration
 */
export interface RiskProfile {
  label: string;
  description: string;
  expectedReturn: number;
  returnVolatility: number;
  color: string;
}

/**
 * Default Monte Carlo input values
 */
export const DEFAULT_MONTE_CARLO_INPUT: MonteCarloInput = {
  current_age: 30,
  retire_age: 65,
  current_balance: 50000,
  annual_contrib: 10000,
  employer_match_rate: 0,
  expected_return: 0.07,
  return_volatility: 0.15,
  inflation: 0.02,
  salary_growth: 0.03,
  n_paths: 10000,
  seed: 42,
  fees_annual: 0.005,
  glidepath: false,
  rebalance_annually: true,
  target_goal: null,
};

/**
 * Risk profiles for different investment strategies
 */
export const RISK_PROFILES: Record<RiskLevel, RiskProfile> = {
  conservative: {
    label: 'Conservative',
    description: 'Lower returns with less volatility. Good for near-retirees.',
    expectedReturn: 0.05,
    returnVolatility: 0.08,
    color: '#69B47A',
  },
  moderate: {
    label: 'Moderate',
    description: 'Balanced approach with moderate risk and returns.',
    expectedReturn: 0.07,
    returnVolatility: 0.15,
    color: '#4ABDAC',
  },
  aggressive: {
    label: 'Aggressive',
    description: 'Higher returns with more volatility. Good for younger investors.',
    expectedReturn: 0.09,
    returnVolatility: 0.22,
    color: '#FF6B6B',
  },
};

/**
 * Percentile labels and colors for visualization
 */
export const PERCENTILE_CONFIG = {
  p5: { label: '5th percentile (worst case)', color: '#FF6B6B', opacity: 0.2 },
  p25: { label: '25th percentile', color: '#FFB74D', opacity: 0.3 },
  p50: { label: '50th percentile (median)', color: '#4ABDAC', opacity: 1 },
  p75: { label: '75th percentile', color: '#69B47A', opacity: 0.3 },
  p95: { label: '95th percentile (best case)', color: '#00C853', opacity: 0.2 },
} as const;
