/**
 * Screen & Form Definitions
 * Platform-agnostic definitions of complete screens/calculators
 */

import { ScreenDefinition } from './types';

/**
 * Deterministic Calculator Screen
 * Single-scenario retirement projection
 * All slider styling is schema-driven with platform-specific variants
 */
export const DETERMINISTIC_SCREEN: ScreenDefinition = {
  id: 'deterministic',
  name: 'Deterministic Calculator',
  description: 'Single-scenario retirement projection based on fixed assumptions',
  icon: 'calculator',

  sections: [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Your age and retirement timeline',
      fields: ['age', 'retirementAge'],
      layout: 'horizontal',
      metadata: {
        sliderStyle: {
          showRangeIndicator: true,
          rangeIndicatorType: 'compact',
          showValue: true,
          showMin: true,
          showMax: true,
          displayFormat: 'inline',
        },
      },
    },
    {
      id: 'savings',
      title: 'Savings & Contributions',
      description: 'Current balance and annual contributions',
      fields: ['currentBalance', 'contribution'],
      layout: 'vertical',
      metadata: {
        sliderStyle: {
          showRangeIndicator: true,
          rangeIndicatorType: 'full',
          showValue: true,
          showMin: true,
          showMax: true,
          displayFormat: 'below',
          trackColor: {
            filled: '#69B47A',
            empty: 'rgba(105, 180, 122, 0.2)',
          },
          thumbStyle: {
            size: 'medium',
            color: '#69B47A',
            showLabel: true,
          },
        },
      },
    },
    {
      id: 'assumptions',
      title: 'Retirement Assumptions',
      description: 'Investment returns and inflation expectations',
      fields: ['expectedReturn', 'inflation'],
      layout: 'vertical',
      metadata: {
        // Note: expectedReturn and inflation are already defined as sliders in inputFields.ts
        sliderStyle: {
          showRangeIndicator: true,
          rangeIndicatorType: 'full',
          showValue: true,
          showMin: true,
          showMax: true,
          displayFormat: 'below',
          trackColor: {
            filled: '#4ABDAC',
            empty: 'rgba(74, 189, 172, 0.2)',
          },
          thumbStyle: {
            size: 'medium',
            color: '#4ABDAC',
            showLabel: true,
          },
        },
      },
    },
  ],

  buttons: [
    {
      id: 'calculate',
      label: 'Calculate',
      type: 'primary',
      action: 'submit',
    },
    {
      id: 'reset',
      label: 'Reset',
      type: 'secondary',
      action: 'reset',
    },
    {
      id: 'whatif',
      label: 'Open in What-If',
      type: 'tertiary',
      action: 'navigate',
      navigateTo: 'whatif',
    },
  ],

  submitButtonLabel: 'Calculate',
  resetButtonLabel: 'Reset',
  successMessage: 'Projection calculated successfully',

  platformVariants: {
    web: {
      layout: 'fullwidth',
      gridColumns: 2,
      maxWidth: '800px',
      sliderDefaults: {
        showRangeIndicator: true,
        rangeIndicatorType: 'full',
        showValue: true,
        showMin: true,
        showMax: true,
        displayFormat: 'below',
        heightPixels: 48,
        thumbSize: 24,
        trackHeight: 8,
      },
    },
    mobile: {
      layout: 'stacked',
      collapseSections: false,
      sliderDefaults: {
        showRangeIndicator: true,
        rangeIndicatorType: 'full',
        showValue: true,
        showMin: true,
        showMax: true,
        displayFormat: 'below',
        heightPixels: 64,
        thumbSize: 28,
        trackHeight: 10,
      },
    },
  },

  crossFieldValidation: [
    {
      fields: ['age', 'retirementAge'],
      validate: (state) => state.retirementAge > state.age,
      message: 'Retirement age must be greater than current age',
    },
  ],

  metadata: {
    description_long: 'Project your retirement balance based on a single set of assumptions. This calculator shows one scenario - use What-If for multiple scenarios.',
    helpCategory: 'retirement-planning',
    sliderConfiguration: {
      // Global slider settings for all sliders in this screen
      showRangeIndicator: true,
      indicators: {
        min: {
          show: true,
          label: 'min',
          position: 'left',
        },
        max: {
          show: true,
          label: 'max',
          position: 'right',
        },
        current: {
          show: true,
          position: 'center-top',
          format: 'value-unit',
        },
      },
      theme: {
        light: {
          trackFilledColor: '#69B47A',
          trackEmptyColor: 'rgba(105, 180, 122, 0.15)',
          thumbColor: '#69B47A',
          thumbBorderColor: '#FFFFFF',
          thumbBorderWidth: 2,
          textColor: '#30403A',
        },
      },
    },
  },
};

/**
 * What-If Calculator Screen
 * Multiple scenario comparison
 */
export const WHATIF_SCREEN: ScreenDefinition = {
  id: 'whatif',
  name: 'What-If Scenarios',
  description: 'Compare multiple retirement scenarios side by side',
  icon: 'compare',

  sections: [
    {
      id: 'baseline',
      title: 'Baseline Scenario',
      description: 'Your default assumptions',
      fields: ['scenarioName', 'age', 'savingsRate', 'expectedReturn', 'inflation', 'currentSavings'],
      layout: 'vertical',
      collapsible: true,
      defaultCollapsed: false,
      metadata: {
        scenarioType: 'baseline',
        scenarioFields: ['scenarioName', 'age', 'savingsRate', 'expectedReturn', 'inflation', 'currentSavings'],
      },
    },
    {
      id: 'scenarios',
      title: 'Alternative Scenarios',
      description: 'Create and compare different what-if scenarios',
      fields: ['scenarioName', 'age', 'savingsRate', 'expectedReturn', 'inflation', 'currentSavings'],
      layout: 'vertical',
      metadata: {
        dynamicContent: true,
        description: 'Add, edit, or delete scenarios to explore different outcomes',
        scenarioType: 'whatif',
        allowClone: true,
        allowDelete: true,
      },
    },
  ],

  buttons: [
    {
      id: 'addScenario',
      label: 'Add Scenario',
      type: 'primary',
      action: 'custom',
    },
    {
      id: 'back',
      label: 'Back',
      type: 'secondary',
      action: 'navigate',
      navigateTo: 'deterministic',
    },
  ],

  submitButtonLabel: 'Save Scenarios',
  successMessage: 'Scenarios saved successfully',

  platformVariants: {
    web: {
      layout: 'sidebar',
      gridColumns: 2,
    },
    mobile: {
      layout: 'stacked',
      collapseSections: true,
    },
  },

  metadata: {
    description_long: 'Build and compare multiple retirement scenarios to understand the impact of different assumptions.',
    helpCategory: 'what-if-analysis',
  },
};

/**
 * Monte Carlo Screen
 * Probability-based retirement analysis
 */
export const MONTE_CARLO_SCREEN: ScreenDefinition = {
  id: 'monteCarlo',
  name: 'Monte Carlo Analysis',
  description: 'Probability-based retirement outcome analysis with 10,000 simulations',
  icon: 'chart-distribution',

  sections: [
    {
      id: 'inputs',
      title: 'Simulation Inputs',
      description: 'Parameters for Monte Carlo simulation',
      fields: ['age', 'retirementAge', 'currentBalance', 'contribution', 'expectedReturn', 'inflation'],
      layout: 'vertical',
    },
    {
      id: 'results',
      title: 'Simulation Results',
      description: 'Probability distribution of outcomes',
      fields: [],
      layout: 'vertical',
      metadata: {
        isResultsSection: true,
        description: 'Shows success rate and distribution of retirement outcomes',
      },
    },
  ],

  buttons: [
    {
      id: 'simulate',
      label: 'Run Simulation',
      type: 'primary',
      action: 'submit',
    },
  ],

  submitButtonLabel: 'Run Simulation',
  successMessage: 'Simulation completed successfully',

  platformVariants: {
    web: {
      layout: 'fullwidth',
      gridColumns: 2,
    },
    mobile: {
      layout: 'stacked',
      collapseSections: true,
    },
  },

  crossFieldValidation: [
    {
      fields: ['age', 'retirementAge'],
      validate: (state) => state.retirementAge > state.age,
      message: 'Retirement age must be greater than current age',
    },
  ],

  metadata: {
    description_long: 'Run 10,000 simulations with varying market conditions to understand the probability of your retirement plan succeeding.',
    helpCategory: 'monte-carlo-analysis',
    simulationCount: 10000,
  },
};

/**
 * Landing Page Screen
 * Home page with quick start and feature overview
 */
export const LANDING_SCREEN: ScreenDefinition = {
  id: 'landing',
  name: 'Home',
  description: 'Welcome to Nestly Retirement Projection',
  icon: 'home',

  sections: [
    {
      id: 'hero',
      title: 'Plan Your Retirement with Confidence',
      description: 'Use data-driven calculators to understand your retirement readiness',
      fields: [],
      layout: 'vertical',
      metadata: {
        type: 'hero',
        description: 'Welcome message and value proposition',
        heroTitle: 'Nestly',
        heroTagline: 'Watch your future grow, one nest at a time.',
        heroDescription: 'Nestly helps you project your savings, 401(k), Social Security, Medicare costs, and investments over time — guiding you to build a secure financial future.',
        guestWelcome: '👋 Welcome, Guest! Explore Nestly with limited features.',
        primaryCTA: 'Start Planning Now',
        secondaryCTA: 'Sign In / Create Account',
        secondaryLink: '/auth',
      },
    },
    {
      id: 'quickStart',
      title: 'Quick Start',
      description: 'Enter a few details to see an instant projection',
      fields: [],
      layout: 'vertical',
      metadata: {
        type: 'custom',
        componentId: 'QuickStart',
        title: '⚡ Quick Start',
        subtitle: 'See Your Results in 8 Seconds',
        description:
          'Enter your age, current balance, and investment strategy to see your retirement projection instantly.',
        ctaLabel: 'Get Detailed Analysis →',
        footnote:
          '📊 These are estimates based on historical market averages.\nActual results will vary based on market conditions and personal circumstances.',
        inputLabels: {
          age: {
            label: 'Current Age',
            helper: 'You have {{yearsToRetirement}} years left before retirement age',
            placeholder: 'e.g., 35',
          },
          retirementAge: {
            label: 'Target Retirement Age',
            helper: 'When you want to retire',
            placeholder: 'e.g., 65',
          },
          balance: {
            label: 'Current 401(k) Balance',
            helper: "This is your starting amount. We'll add your contributions and growth from here.",
            placeholder: 'e.g., 100000',
          },
        },
        strategy: {
          heading: 'Investment Strategy',
          presetsLabel: 'Quick presets:',
          optionReturns: {
            LOW_RISK: '5% return',
            MID_RISK: '7% return',
            HIGH_RISK: '9% return',
          },
        },
        results: {
          strategySuffix: ' Strategy',
          retirementHeadline: 'Retirement in {{yearsToRetirement}} years',
          retirementHeadlineRetired: 'Already retired!',
          portfolioLabel: 'Portfolio at Age {{retirementAge}}',
          portfolioGrowth: '+{{growth}} from growth & contributions',
          portfolioBaseline: 'Starting amount',
          monthlyIncomeLabel: 'Monthly Income (4% Rule)',
          monthlyIncomeSuffix: '/month',
          retirementDurationLabel: 'Retirement Duration',
          retirementDurationSuffix: '({{retirementDuration}} years)',
          retirementReadyLabel: 'Retirement Confidence',
        },
        readinessMessages: {
          Comfortable: 'On track for comfortable retirement',
          Borderline: 'May need to adjust contributions or timeline',
          Low: 'Review your strategy and goals',
        },
      },
    },
    {
      id: 'features',
      title: 'Choose Your Analysis Method',
      description: 'Three ways to analyze your retirement',
      fields: [],
      layout: 'grid',
      metadata: {
        type: 'feature-cards',
        items: [
          {
            id: 'deterministic',
            title: 'Deterministic',
            description:
              'Project your retirement with a single set of fixed assumptions. See one clear scenario for your financial future based on conservative estimates.',
            cta: 'Get Started',
            navigateTo: 'deterministic',
          },
          {
            id: 'whatif',
            title: 'What-If Analysis',
            description:
              'Compare multiple retirement scenarios side-by-side to explore different strategies. Understand how changes in spending or savings affect your outcomes.',
            cta: 'Compare Scenarios',
            navigateTo: 'whatif',
          },
          {
            id: 'montecarlo',
            title: 'Monte Carlo',
            description:
              'Run 10,000+ simulations to see the probability of retirement success. Get a realistic range of outcomes with best, median, and worst-case scenarios.',
            cta: 'Run Simulations',
            navigateTo: 'monteCarlo',
            badge: 'PREMIUM',
          },
        ],
      },
    },
  ],

  buttons: [
    {
      id: 'profile',
      label: 'My Profile',
      type: 'secondary',
      action: 'navigate',
      navigateTo: 'profile',
    },
  ],

  platformVariants: {
    web: {
      layout: 'fullwidth',
      gridColumns: 3,
      maxWidth: '1200px',
    },
    mobile: {
      layout: 'stacked',
      collapseSections: false,
    },
  },

  metadata: {
    description_long: 'Welcome to Nestly. Start planning your retirement with our comprehensive analysis tools.',
    helpCategory: 'getting-started',
  },
};

/**
 * Registry of all screen definitions
 */
export const SCREEN_DEFINITIONS: Record<string, ScreenDefinition> = {
  landing: LANDING_SCREEN,
  deterministic: DETERMINISTIC_SCREEN,
  whatif: WHATIF_SCREEN,
  monteCarlo: MONTE_CARLO_SCREEN,
};
