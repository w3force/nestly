/**
 * SS & Healthcare Feature Exports
 */

// Main component
export { SSHealthcareTab } from './SSHealthcareTab';

// Sub-components (if needed elsewhere)
export { QuickForm } from './QuickForm';
export { DetailedForm } from './DetailedForm';
export { SSResultsPanel } from './SSResultsPanel';
export { NetByClaimAgeChart } from './NetByClaimAgeChart';

// Utilities
export * from './modeUtils';

// Computation logic
export { computeSSHealthcareResults } from './compute';
export * from './ssaMath';
export * from './medicareMath';

// Types
export * from './types';

// Config (for annual updates)
export * from './config';
