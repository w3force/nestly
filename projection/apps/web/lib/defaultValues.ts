/**
 * Smart Defaults System for Landing Page Quick Start
 * Provides instant retirement projections based on age, balance, and investment strategy
 */

export const DEFAULT_VALUES = {
  LOW_RISK: {
    contribution: 12000,      // Conservative annual contribution
    return: 0.05,            // 5% - Conservative portfolio (40/60 bonds/stocks)
    inflation: 0.025,        // 2.5% - Fed target
  },
  MID_RISK: {
    contribution: 15000,      // Balanced annual contribution
    return: 0.07,            // 7% - Balanced portfolio (60/40 stocks/bonds)
    inflation: 0.025,        // 2.5% - Fed target
  },
  HIGH_RISK: {
    contribution: 18000,      // Aggressive annual contribution
    return: 0.09,            // 9% - Aggressive portfolio (80/20 stocks/bonds)
    inflation: 0.025,        // 2.5% - Fed target
  },
};

export type StrategyType = 'LOW_RISK' | 'MID_RISK' | 'HIGH_RISK';

export interface DefaultsInput {
  age: number;
  balance: number;
  strategy: StrategyType;
  retirementAge?: number;
}

export interface DefaultsResult {
  age: number;
  balance: number;
  retirementAge: number;
  yearsToRetirement: number;
  contribution: number;
  expectedReturn: number;
  inflation: number;
  strategy: StrategyType;
  portfolioAtRetirement: number;
  monthlyIncome: number;
  retirementDuration: number;
  confidenceLevel: 'Low' | 'Borderline' | 'Comfortable';
  confidencePercentage: number;
}

/**
 * Calculate retirement projections based on age, current balance, and strategy
 * Uses compound interest formula for both current balance and contributions
 * 
 * FV = PV * (1 + r)^n + PMT * [((1 + r)^n - 1) / r]
 * where:
 *   FV = Future Value (portfolio at retirement)
 *   PV = Present Value (current balance)
 *   PMT = Periodic Payment (annual contribution)
 *   r = Interest rate per period
 *   n = Number of periods
 */
export function calculateDefaults(input: DefaultsInput): DefaultsResult {
  const { age, balance, strategy, retirementAge = 65 } = input;
  
  const yearsToRetirement = Math.max(0, retirementAge - age);
  const strategyValues = DEFAULT_VALUES[strategy];
  
  // Handle edge case: already at/past retirement age
  if (yearsToRetirement === 0) {
    return {
      age,
      balance,
      retirementAge,
      yearsToRetirement: 0,
      contribution: strategyValues.contribution,
      expectedReturn: strategyValues.return * 100,
      inflation: strategyValues.inflation * 100,
      strategy,
      portfolioAtRetirement: balance,
      monthlyIncome: Math.round((balance * 0.04) / 12),
      retirementDuration: 40,
      confidenceLevel: 'Comfortable',
      confidencePercentage: 95,
    };
  }

  // Use annual compounding to match the Deterministic calculator
  // Formula: simulate year-by-year growth with annual contributions
  let nominalBalance = balance;
  for (let year = 0; year < yearsToRetirement; year++) {
    nominalBalance = nominalBalance * (1 + strategyValues.return) + strategyValues.contribution;
  }
  const portfolioAtRetirement = nominalBalance;

  // Safe withdrawal rate: 4% annually (25x rule)
  // This is a conservative estimate used by financial advisors
  const yearlyIncome = portfolioAtRetirement * 0.04;
  const monthlyIncome = yearlyIncome / 12;

  // Calculate how long retirement lasts using the 4% rule
  // Rough approximation: portfolio / annual_spend
  // Capped at 40 years for practical purposes
  const yearsRetirementCanSupport = Math.min(40, Math.round(yearsToRetirement * 1.5)); // Heuristic
  const retirementDuration = Math.max(20, yearsRetirementCanSupport);

  // Determine confidence level based on portfolio multiple
  // Rule of thumb: 25x annual expenses = 100% confidence
  let confidencePercentage = 0;
  let confidenceLevel: 'Low' | 'Borderline' | 'Comfortable' = 'Low';

  const portfolioMultiple = portfolioAtRetirement / balance;

  if (portfolioMultiple >= 15) {
    confidencePercentage = 85;
    confidenceLevel = 'Comfortable';
  } else if (portfolioMultiple >= 8) {
    confidencePercentage = 65;
    confidenceLevel = 'Borderline';
  } else if (portfolioMultiple >= 4) {
    confidencePercentage = 45;
    confidenceLevel = 'Borderline';
  } else {
    confidencePercentage = 30;
    confidenceLevel = 'Low';
  }

  return {
    age,
    balance,
    retirementAge,
    yearsToRetirement,
    contribution: strategyValues.contribution,
    expectedReturn: strategyValues.return * 100, // Convert to percentage
    inflation: strategyValues.inflation * 100,
    strategy,
    portfolioAtRetirement: Math.round(portfolioAtRetirement),
    monthlyIncome: Math.round(monthlyIncome),
    retirementDuration,
    confidenceLevel,
    confidencePercentage,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Get strategy display name and metadata
 */
export function getStrategyConfig(strategy: StrategyType) {
  const config: Record<StrategyType, { label: string; color: string; description: string }> = {
    LOW_RISK: {
      label: 'Conservative',
      color: '#4ABDAC',
      description: 'Lower risk, steady growth (40% stocks / 60% bonds)',
    },
    MID_RISK: {
      label: 'Balanced',
      color: '#69B47A',
      description: 'Moderate risk and returns (60% stocks / 40% bonds)',
    },
    HIGH_RISK: {
      label: 'Aggressive',
      color: '#FFD54F',
      description: 'Higher risk, higher potential (80% stocks / 20% bonds)',
    },
  };
  return config[strategy];
}

/**
 * Create URL query parameters from default values result
 * These are passed to the calculator page to pre-populate all fields
 */
export function createCalculatorParams(result: DefaultsResult): Record<string, string> {
  return {
    age: String(result.age),
    balance: String(result.balance),
    contribution: String(result.contribution),
    rate: String(result.expectedReturn),
    inflation: String(result.inflation),
    retireAge: String(result.retirementAge),
    strategy: result.strategy,
    fromDefaults: 'true',
  };
}
