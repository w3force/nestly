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
 * What-If Scenario Name
 */
export const SCENARIO_NAME_FIELD: InputFieldDefinition = {
  id: 'scenarioName',
  label: 'Scenario Name',
  description: 'Friendly label for this scenario',
  type: 'textInput',
  defaultValue: 'What-If Scenario',
  constraints: {
    min: 0,
    max: 0,
    step: 1,
    format: (v) => String(v),
    parse: (v) => v,
  },
  renderHints: {
    platform: 'both',
    layout: 'full',
    priority: 1,
  },
  validationRules: [
    createRequiredRule('Scenario name'),
  ],
  examples: ['Aggressive Growth', 'Early Retirement'],
  category: 'metadata',
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
  metadata: {
    slider: {
      rangeIndicators: [
        { label: '$0', value: 0 },
        { label: '$23.5k (2025)', value: 23500 },
        { label: '$30.5k (50+)', value: 30500, minAge: 50 },
      ],
      states: [
        {
          id: 'standardLimit',
          label: '2025 Limit',
          badgeColor: '#69B47A',
          trackColor: '#69B47A',
          backgroundColor: 'rgba(105, 180, 122, 0.1)',
          info: {
            title: '✓ Within 2025 Limit',
            description: 'You can contribute up to $23,500 in 2025 (standard limit).',
          },
          thresholds: {
            max: 23500,
          },
        },
        {
          id: 'catchUp',
          label: 'Catch-up (50+)',
          badgeColor: '#FFB74D',
          trackColor: '#FFB74D',
          backgroundColor: 'rgba(255, 183, 77, 0.1)',
          info: {
            title: '✓ Catch-up Eligible',
            description: "You're 50+, so you can contribute up to $30,500 ($23.5k + $7k catch-up).",
          },
          thresholds: {
            max: 30500,
            minAge: 50,
          },
        },
        {
          id: 'overLimit',
          label: 'Over Limit',
          badgeColor: '#FF6B6B',
          trackColor: '#FF6B6B',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          info: {
            title: '⚠ Over Contribution Limit',
            description: 'Your contribution exceeds the IRS limit. Consider reducing it.',
          },
          thresholds: {
            aboveDynamicMax: true,
          },
        },
      ],
    },
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
 * What-If Savings Rate Slider
 * Percentage of income contributed annually
 */
export const WHATIF_SAVINGS_RATE_FIELD: InputFieldDefinition = {
  id: 'savingsRate',
  label: 'Savings Rate',
  description: 'Percentage of annual income you plan to contribute',
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
    priority: 4,
  },
  metadata: {
    slider: {
      rangeIndicators: [
        { label: '0%', value: 0 },
        { label: '25% (Conservative)', value: 25 },
        { label: '40% (Stretch)', value: 40 },
        { label: '50%', value: 50 },
      ],
      states: [
        {
          id: 'conservative',
          label: 'Conservative',
          badgeColor: '#69B47A',
          trackColor: '#69B47A',
          backgroundColor: 'rgba(105, 180, 122, 0.1)',
          info: {
            title: 'Steady Contributions',
            description: 'Balanced savings rate that keeps contributions manageable.',
          },
          thresholds: {
            max: 25,
          },
        },
        {
          id: 'moderate',
          label: 'Moderate',
          badgeColor: '#FFB74D',
          trackColor: '#FFB74D',
          backgroundColor: 'rgba(255, 183, 77, 0.1)',
          info: {
            title: 'Ambitious Savings',
            description: 'Increased savings rate for faster growth; monitor cash flow.',
          },
          thresholds: {
            min: 26,
            max: 40,
          },
        },
        {
          id: 'aggressive',
          label: 'Aggressive',
          badgeColor: '#FF6B6B',
          trackColor: '#FF6B6B',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          info: {
            title: 'Stretch Goal',
            description: 'Very high savings rate; ensure it fits your budget.',
          },
          thresholds: {
            min: 41,
          },
        },
      ],
    },
  },
  validationRules: [
    createRequiredRule('Savings rate'),
    createMinRule(0, 'Savings rate must be at least'),
    createMaxRule(50, 'Savings rate cannot exceed'),
  ],
  examples: ['10%', '20%', '35%'],
  category: 'savings',
};

/**
 * What-If Current Savings
 */
export const CURRENT_SAVINGS_FIELD: InputFieldDefinition = {
  id: 'currentSavings',
  label: 'Current Savings',
  description: 'Total amount you have saved today',
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
    priority: 5,
  },
  validationRules: [
    createRequiredRule('Current savings'),
    createMinRule(0, 'Current savings must be at least'),
  ],
  examples: ['$25,000', '$100,000', '$350,000'],
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
  metadata: {
    slider: {
      rangeIndicators: [
        { label: '0%', value: 0 },
        { label: '5% (Low)', value: 5 },
        { label: '8% (Avg)', value: 8 },
        { label: '15%', value: 15 },
      ],
      milestones: [
        {
          value: 5,
          label: '5% • Low',
          description: 'Conservative assumption; aligns with cautious portfolio mix.',
        },
        {
          value: 8,
          label: '8% • Average',
          description: 'Historic long-term market average for balanced portfolios.',
        },
        {
          value: 12,
          label: '12% • High',
          description: 'Aggressive expectation; assumes strong equity performance.',
        },
      ],
      suggestions: [
        { label: '5-yr avg', value: 8.5 },
        { label: '10-yr avg', value: 7.5 },
        { label: '15-yr avg', value: 7.0 },
      ],
      states: [
        {
          id: 'conservative',
          label: 'Conservative',
          badgeColor: '#FF6B6B',
          trackColor: '#FF6B6B',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          info: {
            title: '🛡️ Conservative Strategy',
            description:
              'Lower expected returns; suitable for risk-averse investors or near retirement.',
          },
          thresholds: {
            max: 4.99,
          },
        },
        {
          id: 'balanced',
          label: 'Balanced',
          badgeColor: '#FFB74D',
          trackColor: '#FFB74D',
          backgroundColor: 'rgba(255, 183, 77, 0.1)',
          info: {
            title: '⚖️ Balanced Approach',
            description:
              'Moderate returns reflecting historical market averages; suitable for most investors.',
          },
          thresholds: {
            min: 5,
            max: 8,
          },
        },
        {
          id: 'aggressive',
          label: 'Aggressive',
          badgeColor: '#69B47A',
          trackColor: '#69B47A',
          backgroundColor: 'rgba(105, 180, 122, 0.1)',
          info: {
            title: '📈 Aggressive Growth',
            description:
              'Higher expected returns; assumes strong equity performance and higher risk tolerance.',
          },
          thresholds: {
            min: 8,
          },
        },
      ],
    },
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
  metadata: {
    slider: {
      rangeIndicators: [
        { label: '0%', value: 0 },
        { label: '2% (Target)', value: 2 },
        { label: '4% (Moderate)', value: 4 },
        { label: '6%', value: 6 },
      ],
      milestones: [
        {
          value: 2,
          label: '2% • Target',
          description: 'Matches Federal Reserve long-term target inflation.',
        },
        {
          value: 3.5,
          label: '3.5% • Elevated',
          description: 'Reflects periods of moderate inflation pressure.',
        },
        {
          value: 5,
          label: '5% • High',
          description: 'High inflation environment; plan for higher expenses.',
        },
      ],
      suggestions: [
        { label: '5-yr avg', value: 3.6 },
        { label: '10-yr avg', value: 2.6 },
        { label: '15-yr avg', value: 2.2 },
      ],
      states: [
        {
          id: 'low',
          label: 'Low Inflation',
          badgeColor: '#69B47A',
          trackColor: '#69B47A',
          backgroundColor: 'rgba(105, 180, 122, 0.1)',
          info: {
            title: '✓ Low Inflation',
            description:
              'Strong purchasing power preservation; your $1 today buys nearly as much in the future.',
          },
          thresholds: {
            max: 1.99,
          },
        },
        {
          id: 'moderate',
          label: 'Moderate Inflation',
          badgeColor: '#FFB74D',
          trackColor: '#FFB74D',
          backgroundColor: 'rgba(255, 183, 77, 0.1)',
          info: {
            title: '⚠ Moderate Inflation',
            description:
              'Normal inflation range; your purchasing power will gradually decline.',
          },
          thresholds: {
            min: 2,
            max: 4,
          },
        },
        {
          id: 'high',
          label: 'High Inflation',
          badgeColor: '#FF6B6B',
          trackColor: '#FF6B6B',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          info: {
            title: '🔴 High Inflation',
            description:
              'High inflation environment; plan for significantly higher expenses in the future.',
          },
          thresholds: {
            min: 4,
          },
        },
      ],
    },
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
  scenarioName: SCENARIO_NAME_FIELD,
  savingsRate: WHATIF_SAVINGS_RATE_FIELD,
  currentSavings: CURRENT_SAVINGS_FIELD,
  expectedReturn: EXPECTED_RETURN_FIELD,
  inflation: INFLATION_FIELD,
};
