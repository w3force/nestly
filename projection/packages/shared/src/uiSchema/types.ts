/**
 * UI Schema Type Definitions
 * Core types for unified UI definitions
 */

export type InputFieldType =
  | 'number'
  | 'slider'
  | 'textInput'
  | 'picker'
  | 'toggle'
  | 'multiSelect'
  | 'button'
  | 'link'
  | 'display';

export type ValueCategory = 'low' | 'average' | 'high' | 'good' | 'normal' | 'high-risk' | 'conservative' | 'moderate' | 'aggressive';

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom' | 'integer' | 'decimal';
  message: string;
  validate?: (value: any, formState?: Record<string, any>) => boolean;
  params?: Record<string, any>; // For min, max, pattern values
}

export interface InputFieldConstraints {
  // Numeric constraints
  min: number;
  max: number;
  step: number;

  // Display constraints
  decimalPlaces?: number;
  displayUnit?: string; // '%', '$', 'years', etc.
  suffix?: string;
  prefix?: string;

  // Conditional constraints (evaluated at runtime)
  conditionalMin?: (formState: Record<string, any>) => number;
  conditionalMax?: (formState: Record<string, any>) => number;

  // Formatting function
  format?: (value: number) => string;
  parse?: (value: string) => number; // Parse user input
}

export interface InputFieldDefinition {
  id: string;
  label: string;
  description: string;
  helpTopicId?: string;

  type: InputFieldType;
  constraints: InputFieldConstraints;

  // Default value
  defaultValue?: any;

  // UI Rendering hints
  renderHints: {
    platform?: 'web' | 'mobile' | 'both';
    layout?: 'full' | 'half' | 'inline' | 'compact';
    priority?: number; // for responsive layout prioritization
    hidden?: boolean;
  };

  // Validation
  validationRules: ValidationRule[];

  // Help and context
  examples?: string[];
  relatedFields?: string[];
  category?: string;

  // Metadata
  metadata?: Record<string, any>;
}

export interface FieldGroup {
  id: string;
  title?: string;
  description?: string;
  fields: string[]; // Field IDs
  layout?: 'vertical' | 'horizontal' | 'grid' | 'compact';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  metadata?: Record<string, any>;
}

export interface ScreenDefinition {
  id: string;
  name: string;
  description: string;
  icon?: string;

  // Content structure
  sections: FieldGroup[];

  // Buttons and actions
  buttons?: Array<{
    id: string;
    label: string;
    type: 'primary' | 'secondary' | 'tertiary' | 'danger';
    action?: string; // e.g., 'submit', 'reset', 'navigate'
    navigateTo?: string; // screen ID or URL
  }>;

  // Platform-specific variants
  platformVariants?: {
    web?: {
      layout?: 'sidebar' | 'fullwidth' | 'modal' | 'inline';
      gridColumns?: number;
      maxWidth?: string;
      sliderDefaults?: Record<string, any>;
    };
    mobile?: {
      layout?: 'stacked' | 'tabbed' | 'modal' | 'drawer';
      collapseSections?: boolean;
      sliderDefaults?: Record<string, any>;
    };
  };

  // Validation
  crossFieldValidation?: Array<{
    fields: string[];
    validate: (values: Record<string, any>) => boolean;
    message: string;
  }>;

  // Behavior
  submitButtonLabel?: string;
  resetButtonLabel?: string;
  successMessage?: string;
  errorMessage?: string;

  // Metadata
  metadata?: Record<string, any>;
}

export interface FieldContent {
  fieldId: string;
  label: string;
  placeholder?: string;
  hint?: string;
  tooltip?: string;

  validationMessages: Record<string, string>;
  errorMessages: Record<string, string>;

  metadata?: Record<string, any>;
}

export interface CategoryDefinition {
  id: ValueCategory;
  label: string;
  color: string;
  backgroundColor?: string;
  textColor?: string;
  description: string;
}

export interface FieldCategoryMapping {
  fieldId: string;
  breakpoints: Array<{
    min: number;
    max: number;
    category: ValueCategory;
  }>;
  reverseLogic?: boolean; // For fields where lower is better
}
