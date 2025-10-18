/**
 * Input Field Definitions
 * Platform-agnostic field definitions with constraints, validation, and defaults
 */

import { InputFieldDefinition } from './types';
import {
  createRequiredRule,
  createMinRule,
  createMaxRule,
  createDecimalRule,
} from './validation';

/**
 * Age Input Field
 * Used in both Deterministic and What-If calculators
 */
export const AGE_FIELD: InputFieldDefinition = {
  id: 'age',
  label: 'Current Age',
  description: 'Your age today',
  helpTopicId: 'age_help',
  type: 'textInput',
  defaultValue: 30,
  constraints: {
    min: 18,
    max: 125,
    step: 1,
    decimalPlaces: 0,
    displayUnit: 'years',
    format: (v) => `${v} years`,
    parse: (v) => parseInt(v, 10),
  },
  renderHints: {
    platform: 'both',
    layout: 'half',
    priority: 1,
  },
  validationRules: [
    createRequiredRule('Age'),
    createMinRule(18, 'Age must be at least'),
    createMaxRule(125, 'Age cannot exceed'),
  ],
  examples: ['25', '35', '50'],
  category: 'personal-info',
};

/**
 * Retirement Age Input Field
 */
export const RETIREMENT_AGE_FIELD: InputFieldDefinition = {
  id: 'retirementAge',
  label: 'Retirement Age',
  description: 'Age when you plan to retire',
  helpTopicId: 'retirement_age_help',
  type: 'textInput',
  defaultValue: 65,
  constraints: {
    min: 50,
    max: 100,
    step: 1,
    decimalPlaces: 0,
    displayUnit: 'years',
    format: (v) => `${v} years`,
    parse: (v) => parseInt(v, 10),
  },
  renderHints: {
    platform: 'both',
    layout: 'half',
    priority: 2,
  },
  validationRules: [
    createRequiredRule('Retirement age'),
    createMinRule(50, 'Retirement age must be at least'),
    createMaxRule(100, 'Retirement age cannot exceed'),
  ],
  examples: ['60', '65', '70'],
  category: 'personal-info',
};

/**
 * Current Balance / Current Savings
 */
export const CURRENT_BALANCE_FIELD: InputFieldDefinition = {
  id: 'currentBalance',
  label: 'Current Balance',
  description: 'Total retirement savings currently invested',
  helpTopicId: 'current_balance_help',
  type: 'textInput',
  defaultValue: 50000,
  constraints: {
    min: 0,
    max: 10000000,
    step: 1000,
    decimalPlaces: 0,
    displayUnit: '$',
    prefix: '$',
    format: (v) => `$${v.toLocaleString()}`,
    parse: (v) => parseFloat(v.replace(/[^0-9.]/g, '')),
  },
  renderHints: {
    platform: 'both',
    layout: 'full',
    priority: 3,
  },
  validationRules: [
    createRequiredRule('Current balance'),
    createMinRule(0, 'Balance must be at least'),
  ],
  examples: ['$50,000', '$100,000', '$500,000'],
  category: 'savings',
};

/**
 * Annual Contribution (Deterministic Tab)
 * Uses 2025 401(k) limits
 */
export const ANNUAL_CONTRIBUTION_FIELD: InputFieldDefinition = {
  id: 'contribution',
  label: 'Annual Contribution',
  description: '401(k) annual contribution amount',
  helpTopicId: 'annual_contribution_help',
  type: 'slider',
  defaultValue: 10000,
  constraints: {
    min: 0,
    max: 30500, // Will be limited by conditional max
    step: 500,
    decimalPlaces: 0,
    displayUnit: '$',
    prefix: '$',
    suffix: '',
    format: (v) => `$${(v / 1000).toFixed(1)}k`,
    parse: (v) => parseFloat(v.replace(/[^0-9.]/g, '')),
    // Dynamically set max based on age
    conditionalMax: (state) => {
      return state.age >= 50 ? 30500 : 23500;
    },
  },
  renderHints: {
    platform: 'both',
    layout: 'full',
    priority: 4,
  },
  validationRules: [
    createRequiredRule('Annual contribution'),
    createMinRule(0, 'Contribution must be at least'),
  ],
  examples: ['$0', '$10,000', '$23,500'],
  relatedFields: ['age'],
  category: 'savings',
};

/**
 * Contribution Rate (What-If Tab)
 * Percentage of income to contribute
 */
export const CONTRIBUTION_RATE_FIELD: InputFieldDefinition = {
  id: 'contributionRate',
  label: 'Savings Rate',
  description: 'Percentage of $100k annual income to contribute',
  helpTopicId: 'contribution_rate_help',
  type: 'slider',
  defaultValue: 10,
  constraints: {
    min: 0,
    max: 50,
    step: 1,
    decimalPlaces: 0,
    displayUnit: '%',
    suffix: '%',
    format: (v) => `${v}%`,
    parse: (v) => parseFloat(v.replace(/[^0-9.]/g, '')),
  },
  renderHints: {
    platform: 'both',
    layout: 'full',
    priority: 5,
  },
  validationRules: [
    createRequiredRule('Savings rate'),
    createMinRule(0, 'Rate must be at least'),
    createMaxRule(50, 'Rate cannot exceed'),
  ],
  examples: ['5%', '15%', '25%'],
  category: 'savings',
};

/**
 * Expected Return Rate
 * Annual investment return percentage
 */
export const EXPECTED_RETURN_FIELD: InputFieldDefinition = {
  id: 'expectedReturn',
  label: 'Expected Return',
  description: 'Annual investment return percentage',
  helpTopicId: 'expected_return_help',
  type: 'slider',
  defaultValue: 7,
  constraints: {
    min: 0,
    max: 15,
    step: 0.5,
    decimalPlaces: 1,
    displayUnit: '%',
    suffix: '%',
    format: (v) => `${v.toFixed(1)}%`,
    parse: (v) => parseFloat(v.replace(/[^0-9.]/g, '')),
  },
  renderHints: {
    platform: 'both',
    layout: 'full',
    priority: 6,
  },
  validationRules: [
    createRequiredRule('Expected return'),
    createMinRule(0, 'Return must be at least'),
    createMaxRule(15, 'Return cannot exceed'),
    createDecimalRule(1),
  ],
  examples: ['5%', '7%', '10%'],
  category: 'assumptions',
};

/**
 * Inflation Rate
 * Annual inflation percentage
 */
export const INFLATION_FIELD: InputFieldDefinition = {
  id: 'inflation',
  label: 'Inflation',
  description: 'Annual inflation rate',
  helpTopicId: 'inflation_help',
  type: 'slider',
  defaultValue: 2.5,
  constraints: {
    min: 0,
    max: 6,
    step: 0.1,
    decimalPlaces: 1,
    displayUnit: '%',
    suffix: '%',
    format: (v) => `${v.toFixed(1)}%`,
    parse: (v) => parseFloat(v.replace(/[^0-9.]/g, '')),
  },
  renderHints: {
    platform: 'both',
    layout: 'full',
    priority: 7,
  },
  validationRules: [
    createRequiredRule('Inflation'),
    createMinRule(0, 'Inflation must be at least'),
    createMaxRule(6, 'Inflation cannot exceed'),
    createDecimalRule(1),
  ],
  examples: ['2%', '2.5%', '3%'],
  category: 'assumptions',
};

/**
 * Registry of all field definitions
 * Used for lookup and validation
 */
export const FIELD_DEFINITIONS: Record<string, InputFieldDefinition> = {
  age: AGE_FIELD,
  retirementAge: RETIREMENT_AGE_FIELD,
  currentBalance: CURRENT_BALANCE_FIELD,
  contribution: ANNUAL_CONTRIBUTION_FIELD,
  contributionRate: CONTRIBUTION_RATE_FIELD,
  expectedReturn: EXPECTED_RETURN_FIELD,
  inflation: INFLATION_FIELD,
};
