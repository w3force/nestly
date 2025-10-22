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
  metadata?: {
    slider?: SliderMetadata;
    [key: string]: any;
  };
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

export type NavLinkPlacement = 'primary' | 'secondary' | 'cta';
export type NavLinkVisibility = 'all' | 'web' | 'mobile';
export type NavCtaStyle = 'outlined' | 'contained' | 'text';

export interface NavigationLink {
  id: string;
  label: string;
  href: string;
  icon?: string;
  placement?: NavLinkPlacement;
  visibility?: NavLinkVisibility;
  style?: NavCtaStyle;
  metadata?: Record<string, any>;
}

export interface NavigationDefinition {
  id: string;
  brand: {
    title: string;
    logo?: string;
    subtitle?: string;
    href?: string;
  };
  links: NavigationLink[];
  metadata?: Record<string, any>;
}

export interface SliderInfoContent {
  title?: string;
  description?: string;
}

export interface SliderStateThresholds {
  min?: number;
  max?: number;
  minAge?: number;
  maxAge?: number;
  aboveDynamicMax?: boolean;
}

export interface SliderStateDisplay {
  id: string;
  label: string;
  badgeColor: string;
  textColor?: string;
  trackColor?: string;
  backgroundColor?: string;
  info?: SliderInfoContent;
  thresholds?: SliderStateThresholds;
}

export interface SliderRangeIndicatorConfig {
  label: string;
  value: number;
  minAge?: number;
  maxAge?: number;
}

export interface SliderMilestoneConfig {
  value: number;
  label: string;
  description?: string;
}

export interface SliderSuggestionConfig {
  label: string;
  value: number;
}

export interface SliderMetadata {
  rangeIndicators?: SliderRangeIndicatorConfig[];
  milestones?: SliderMilestoneConfig[];
  states?: SliderStateDisplay[];
  suggestions?: SliderSuggestionConfig[];
  theme?: {
    track?: {
      defaultColor?: string;
      emptyColor?: string;
    };
    thumb?: {
      color?: string;
    };
  };
}
