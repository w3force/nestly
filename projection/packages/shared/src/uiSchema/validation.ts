/**
 * Validation Rule Builders
 * Helper functions to create validation rules
 */

import { ValidationRule } from './types';

export function createRequiredRule(fieldName: string = 'Field'): ValidationRule {
  return {
    type: 'required',
    message: `${fieldName} is required`,
    validate: (value) => value !== null && value !== undefined && value !== '',
  };
}

export function createMinRule(min: number, fieldName: string = 'Value'): ValidationRule {
  return {
    type: 'min',
    message: `${fieldName} ${min}`,
    validate: (value) => typeof value === 'number' && value >= min,
    params: { min },
  };
}

export function createMaxRule(max: number, fieldName: string = 'Value'): ValidationRule {
  return {
    type: 'max',
    message: `${fieldName} ${max}`,
    validate: (value) => typeof value === 'number' && value <= max,
    params: { max },
  };
}

export function createIntegerRule(): ValidationRule {
  return {
    type: 'integer',
    message: 'Must be a whole number',
    validate: (value) => typeof value === 'number' && Number.isInteger(value),
  };
}

export function createDecimalRule(places: number = 2): ValidationRule {
  return {
    type: 'decimal',
    message: `Must have at most ${places} decimal places`,
    validate: (value) => {
      if (typeof value !== 'number') return false;
      const regex = new RegExp(`^-?\\d+(\\.\\d{1,${places}})?$`);
      return regex.test(value.toString());
    },
    params: { places },
  };
}

export function createPatternRule(pattern: string | RegExp, message: string): ValidationRule {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  return {
    type: 'pattern',
    message,
    validate: (value) => regex.test(String(value)),
  };
}

export function createCustomRule(
  name: string,
  message: string,
  validate: (value: any, formState?: Record<string, any>) => boolean
): ValidationRule {
  return {
    type: 'custom',
    message,
    validate,
  };
}

/**
 * Validate a field against its definition
 */
export function validateField(
  value: any,
  rules: ValidationRule[],
  formState?: Record<string, any>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const rule of rules) {
    if (rule.validate && !rule.validate(value, formState)) {
      errors.push(rule.message);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate entire form
 */
export function validateForm(
  formState: Record<string, any>,
  fieldValidations: Record<string, ValidationRule[]>
): { valid: boolean; fieldErrors: Record<string, string[]> } {
  const fieldErrors: Record<string, string[]> = {};
  let valid = true;

  for (const [fieldId, rules] of Object.entries(fieldValidations)) {
    const value = formState[fieldId];
    const result = validateField(value, rules, formState);

    if (!result.valid) {
      fieldErrors[fieldId] = result.errors;
      valid = false;
    }
  }

  return { valid, fieldErrors };
}
