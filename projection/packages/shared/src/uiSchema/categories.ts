/**
 * Category & Color Mapping Schema
 * Defines how numeric values map to categories and colors
 * Used for color-coded sliders and visual feedback
 */

import { CategoryDefinition, FieldCategoryMapping, ValueCategory } from './types';

/**
 * Global color palette for consistency across web and mobile
 */
export const COLOR_PALETTE: Record<ValueCategory, string> = {
  low: '#FF6B6B',           // Red
  average: '#FFB74D',       // Orange
  high: '#69B47A',          // Green
  good: '#69B47A',          // Green (low is good)
  normal: '#FFB74D',        // Orange
  'high-risk': '#FF6B6B',   // Red
  conservative: '#69B47A',  // Green
  moderate: '#FFB74D',      // Orange
  aggressive: '#FF6B6B',    // Red
};

/**
 * Category definitions with labels and descriptions
 */
export const CATEGORY_DEFINITIONS: Record<ValueCategory, CategoryDefinition> = {
  low: {
    id: 'low',
    label: 'Low',
    color: COLOR_PALETTE.low,
    description: 'Below average return',
  },
  average: {
    id: 'average',
    label: 'Average',
    color: COLOR_PALETTE.average,
    description: 'Average return',
  },
  high: {
    id: 'high',
    label: 'High',
    color: COLOR_PALETTE.high,
    description: 'Above average return',
  },
  good: {
    id: 'good',
    label: 'Good',
    color: COLOR_PALETTE.good,
    description: 'Favorable condition',
  },
  normal: {
    id: 'normal',
    label: 'Normal',
    color: COLOR_PALETTE.normal,
    description: 'Normal/typical condition',
  },
  'high-risk': {
    id: 'high-risk',
    label: 'High Risk',
    color: COLOR_PALETTE['high-risk'],
    description: 'High risk condition',
  },
  conservative: {
    id: 'conservative',
    label: 'Conservative',
    color: COLOR_PALETTE.conservative,
    description: 'Conservative approach',
  },
  moderate: {
    id: 'moderate',
    label: 'Moderate',
    color: COLOR_PALETTE.moderate,
    description: 'Moderate approach',
  },
  aggressive: {
    id: 'aggressive',
    label: 'Aggressive',
    color: COLOR_PALETTE.aggressive,
    description: 'Aggressive approach',
  },
};

/**
 * Expected Return: Higher is better (return rates)
 * 0-5% = Low (Red)
 * 5-8% = Average (Orange)
 * 8-15% = High (Green)
 */
export const RETURN_RATE_MAPPING: FieldCategoryMapping = {
  fieldId: 'expectedReturn',
  reverseLogic: false, // Higher is better
  breakpoints: [
    { min: 0, max: 5, category: 'low' },
    { min: 5, max: 8, category: 'average' },
    { min: 8, max: 15, category: 'high' },
  ],
};

/**
 * Inflation: Lower is better (inverse logic)
 * 0-2% = Good (Green)
 * 2-4% = Normal (Orange)
 * 4-6% = High Risk (Red)
 */
export const INFLATION_MAPPING: FieldCategoryMapping = {
  fieldId: 'inflation',
  reverseLogic: true, // Lower is better
  breakpoints: [
    { min: 0, max: 2, category: 'good' },
    { min: 2, max: 4, category: 'normal' },
    { min: 4, max: 6, category: 'high-risk' },
  ],
};

/**
 * Contribution Rate: Conservative is better
 * 0-25% = Conservative (Green)
 * 25-40% = Moderate (Orange)
 * 40-50% = Aggressive (Red)
 */
export const CONTRIBUTION_RATE_MAPPING: FieldCategoryMapping = {
  fieldId: 'contributionRate',
  reverseLogic: false,
  breakpoints: [
    { min: 0, max: 25, category: 'conservative' },
    { min: 25, max: 40, category: 'moderate' },
    { min: 40, max: 50, category: 'aggressive' },
  ],
};

/**
 * Savings Rate: Conservative is better
 * 0-15% = Conservative (Green)
 * 15-30% = Moderate (Orange)
 * 30-50% = Aggressive (Red)
 */
export const SAVINGS_RATE_MAPPING: FieldCategoryMapping = {
  fieldId: 'savingsRate',
  reverseLogic: false,
  breakpoints: [
    { min: 0, max: 15, category: 'conservative' },
    { min: 15, max: 30, category: 'moderate' },
    { min: 30, max: 50, category: 'aggressive' },
  ],
};

/**
 * Get category for a value based on field mapping
 */
export function getCategoryForValue(
  mapping: FieldCategoryMapping,
  value: number
): ValueCategory {
  const breakpoint = mapping.breakpoints.find((bp) => value >= bp.min && value <= bp.max);
  return breakpoint?.category || 'average';
}

/**
 * Get color for a value based on field mapping
 */
export function getColorForValue(mapping: FieldCategoryMapping, value: number): string {
  const category = getCategoryForValue(mapping, value);
  return COLOR_PALETTE[category];
}

/**
 * Get category label
 */
export function getCategoryLabel(category: ValueCategory): string {
  return CATEGORY_DEFINITIONS[category]?.label || category;
}

/**
 * Get all category mappings registry
 */
export const CATEGORY_MAPPINGS: Record<string, FieldCategoryMapping> = {
  expectedReturn: RETURN_RATE_MAPPING,
  inflation: INFLATION_MAPPING,
  contributionRate: CONTRIBUTION_RATE_MAPPING,
  savingsRate: SAVINGS_RATE_MAPPING,
};
