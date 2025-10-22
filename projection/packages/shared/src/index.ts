/**
 * @projection/shared
 * 
 * Shared business logic, calculations, types, and utilities
 * for both web and mobile Nestly Projection apps.
 * 
 * Platform-agnostic code only - no UI components.
 */

// Types (safe for browser)
export * from './types/retirement';
export * from './types/whatif';
export * from './types/montecarlo';
export * from './types/tiers';

// Config (safe for browser - contains constants only)
export * from './config/retirement';

// Browser-safe utils
export * from './utils/modeUtils';
export * from './utils/formatters';

// Browser-safe calculations (utilities, not heavy computations)
export { parseEarningsCSV } from './calculations/ssaMath';
export {
  getRiskLevel,
  applyRiskProfile,
  transformMonteCarloData,
  formatMonteCarloValue,
  formatPercentage,
  calculateYearsToRetirement,
  getPercentileAtAge,
  getProbabilityMessage,
  calculatePercentileRange,
  validateMonteCarloInput,
  calculateContributionGrowth,
  calculateTotalContributions,
  estimateRequiredSavings,
} from './calculations/montecarlo';

// Content
export * from './content/helpContent';

// Theme - Design tokens and constants
export * from './theme';

// UI Schema Layer - Unified UI Definitions
export * from './uiSchema/types';
export * from './uiSchema/validation';
export * from './uiSchema/categories';
export * from './uiSchema/inputFields';
export * from './uiSchema/screens';
export * from './uiSchema/navigation';
export * from './uiSchema/registry';
export * from './uiSchema/utils';

// What-if calculations - safe for browser/mobile (lightweight calculations)
export * from './calculations/whatif';

// Server-side only exports (commented out for client builds)
// export * from './calculations/ssaMath';      // Use for server actions
// export * from './calculations/medicareMath';  // Use for server actions
// export * from './calculations/compute';       // Use for server actions
// export * from './calculations/montecarlo';    // Use for server actions
