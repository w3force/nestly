# Unified UI Content & Configuration Architecture

## Problem Statement
Currently, web and mobile applications maintain separate UI definitions, help content, and feature configurations, leading to:
- ❌ Feature parity drift between platforms
- ❌ Duplicate content maintenance
- ❌ Context loss requiring continuous rework
- ❌ Inconsistent UX across platforms
- ❌ Difficulty scaling to new features

## Proposed Solution: Centralized UI Schema Layer

Create a **platform-agnostic UI definition layer** in `@projection/shared` that defines UI structure, content, and constraints. Web and mobile then consume these definitions and apply platform-specific rendering.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     @projection/shared                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. UI SCHEMA LAYER (uiSchema/)                      │    │
│  │    - Input Field Definitions                        │    │
│  │    - Form Structures                                │    │
│  │    - Component Specifications                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓↑                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 2. CONTENT & RULES (content/)                       │    │
│  │    - Help Content                                   │    │
│  │    - Validation Rules                               │    │
│  │    - Error Messages                                 │    │
│  │    - UI Strings & Labels                            │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓↑                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 3. CONSTRAINTS & CONFIG (config/)                   │    │
│  │    - Min/Max Ranges                                 │    │
│  │    - Default Values                                 │    │
│  │    - Color/Category Breakpoints                     │    │
│  │    - Platform Feature Flags                         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
         ↓                           ↓
    ┌──────────────┐         ┌──────────────┐
    │ WEB APP      │         │ MOBILE APP   │
    │ (React/Next) │         │ (RN/Expo)    │
    │              │         │              │
    │ Renders      │         │ Renders      │
    │ Components   │         │ Components   │
    └──────────────┘         └──────────────┘
```

---

## Detailed Implementation Plan

### 1. **Input Field Definition Schema** (`packages/shared/src/uiSchema/inputFields.ts`)

**Purpose:** Define once, render on both platforms

```typescript
/**
 * Unified input field definition schema
 * Describes structure, validation, and content for any input field
 */

export type InputFieldType = 
  | 'number' 
  | 'slider' 
  | 'textInput' 
  | 'picker' 
  | 'toggle' 
  | 'multiSelect';

export interface InputFieldConstraints {
  // Numeric constraints
  min: number;
  max: number;
  step: number;
  
  // Display constraints
  decimalPlaces?: number;
  displayUnit?: string; // '%', '$', 'years', etc.
  
  // Conditional constraints
  conditionalMin?: (formState: any) => number;
  conditionalMax?: (formState: any) => number;
  
  // Formatting
  prefix?: string; // '$'
  suffix?: string; // '%'
  format?: (value: number) => string;
}

export interface InputFieldDefinition {
  id: string;
  label: string;
  description: string;
  helpTopicId: string;
  
  type: InputFieldType;
  constraints: InputFieldConstraints;
  
  // UI Rendering hints
  renderHints: {
    platform?: 'web' | 'mobile' | 'both';
    layout?: 'full' | 'half' | 'inline';
    priority?: number; // for mobile responsive layout
  };
  
  // Validation
  validationRules: ValidationRule[];
  
  // Help and context
  examples?: string[];
  relatedFields?: string[];
  category?: string;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  message: string;
  validate: (value: any) => boolean;
}

/**
 * Example: Contribution Input Field
 */
export const CONTRIBUTION_FIELD: InputFieldDefinition = {
  id: 'contribution',
  label: 'Annual Contribution',
  description: '401(k) annual contribution amount',
  helpTopicId: 'contribution_help',
  
  type: 'slider',
  
  constraints: {
    min: 0,
    max: 30500, // 2025 catch-up max
    step: 500,
    decimalPlaces: 0,
    displayUnit: '$',
    prefix: '$',
    suffix: '',
    conditionalMax: (state) => {
      // Catch-up logic
      return state.age >= 50 ? 30500 : 23500;
    },
    format: (value) => `$${(value / 1000).toFixed(1)}k`,
  },
  
  renderHints: {
    platform: 'both',
    layout: 'full',
    priority: 2,
  },
  
  validationRules: [
    {
      type: 'required',
      message: 'Contribution is required',
      validate: (v) => v !== null && v !== undefined,
    },
    {
      type: 'min',
      message: 'Contribution must be at least $0',
      validate: (v) => v >= 0,
    },
  ],
  
  examples: ['$0', '$10,000', '$23,500'],
  relatedFields: ['age', 'balance'],
  category: 'retirement-planning',
};

/**
 * Example: Expected Return Slider
 */
export const RETURN_FIELD: InputFieldDefinition = {
  id: 'expectedReturn',
  label: 'Expected Return',
  description: 'Annual investment return percentage',
  helpTopicId: 'expected_return_help',
  
  type: 'slider',
  
  constraints: {
    min: 0,
    max: 15,
    step: 0.5,
    decimalPlaces: 1,
    displayUnit: '%',
    suffix: '%',
    format: (value) => `${value.toFixed(1)}%`,
  },
  
  renderHints: {
    platform: 'both',
    layout: 'full',
    priority: 3,
  },
  
  examples: ['5%', '7%', '10%'],
  category: 'retirement-planning',
};
```

### 2. **Category & Color Mapping Schema** (`packages/shared/src/uiSchema/categories.ts`)

**Purpose:** Define how values map to categories and colors

```typescript
/**
 * Value-to-category mappings for color-coded sliders
 * Used by both web and mobile for consistent visual feedback
 */

export type ValueCategory = 'low' | 'average' | 'high' | 'good' | 'normal' | 'high-risk';

export interface CategoryDefinition {
  id: ValueCategory;
  label: string;
  color: string; // Hex color code
  backgroundColor?: string;
  description: string;
}

export interface FieldCategoryMapping {
  fieldId: string;
  breakpoints: Array<{
    min: number;
    max: number;
    category: ValueCategory;
  }>;
  reverseLogic?: boolean; // For inflation (lower is better)
}

/**
 * Global color palette for consistency
 */
export const COLOR_PALETTE = {
  low: '#FF6B6B',        // Red
  average: '#FFB74D',    // Orange
  high: '#69B47A',       // Green
  good: '#69B47A',       // Green
  normal: '#FFB74D',     // Orange
  highRisk: '#FF6B6B',   // Red
};

/**
 * Expected Return categories: High return is good
 */
export const RETURN_CATEGORIES: FieldCategoryMapping = {
  fieldId: 'expectedReturn',
  reverseLogic: false,
  breakpoints: [
    { min: 0, max: 5, category: 'low' },      // Red
    { min: 5, max: 8, category: 'average' },  // Orange
    { min: 8, max: 15, category: 'high' },    // Green
  ],
};

/**
 * Inflation categories: Low inflation is good
 */
export const INFLATION_CATEGORIES: FieldCategoryMapping = {
  fieldId: 'inflation',
  reverseLogic: true, // Lower is better
  breakpoints: [
    { min: 0, max: 2, category: 'good' },      // Green
    { min: 2, max: 4, category: 'normal' },    // Orange
    { min: 4, max: 6, category: 'highRisk' },  // Red
  ],
};

/**
 * Utility function to get category for a value
 */
export function getCategoryForValue(
  mapping: FieldCategoryMapping,
  value: number
): ValueCategory {
  const breakpoint = mapping.breakpoints.find(
    (bp) => value >= bp.min && value <= bp.max
  );
  return breakpoint?.category || 'average';
}

/**
 * Utility function to get color for a value
 */
export function getColorForValue(
  mapping: FieldCategoryMapping,
  value: number
): string {
  const category = getCategoryForValue(mapping, value);
  return COLOR_PALETTE[category];
}
```

### 3. **Form/Screen Definition Schema** (`packages/shared/src/uiSchema/screens.ts`)

**Purpose:** Define complete screens/forms without rendering details

```typescript
/**
 * Complete screen/form definitions
 * Describes which fields, their order, grouping, and validation
 */

export interface FieldGroup {
  id: string;
  title?: string;
  description?: string;
  fields: string[]; // Field IDs from input field definitions
  layout?: 'vertical' | 'horizontal' | 'grid';
  collapsible?: boolean;
}

export interface ScreenDefinition {
  id: string;
  name: string;
  description: string;
  
  // Content
  sections: FieldGroup[];
  
  // Form behavior
  submitButtonLabel: string;
  resetButtonLabel?: string;
  successMessage?: string;
  
  // Platform-specific variants
  platformVariants?: {
    web?: {
      layout?: 'sidebar' | 'fullwidth' | 'modal';
      gridColumns?: number;
    };
    mobile?: {
      layout?: 'stacked' | 'tabbed' | 'modal';
    };
  };
  
  // Validation
  crossFieldValidation?: Array<{
    fields: string[];
    validate: (values: Record<string, any>) => boolean;
    message: string;
  }>;
}

/**
 * Example: Deterministic Calculator Screen
 */
export const DETERMINISTIC_SCREEN: ScreenDefinition = {
  id: 'deterministic',
  name: 'Deterministic Calculator',
  description: 'Single-scenario retirement projection',
  
  sections: [
    {
      id: 'personal',
      title: 'Personal Information',
      fields: ['age', 'retirementAge'],
      layout: 'horizontal',
    },
    {
      id: 'savings',
      title: 'Savings & Contributions',
      fields: ['currentBalance', 'contribution'],
      layout: 'vertical',
    },
    {
      id: 'assumptions',
      title: 'Retirement Assumptions',
      fields: ['expectedReturn', 'inflation'],
      layout: 'vertical',
    },
  ],
  
  submitButtonLabel: 'Calculate',
  resetButtonLabel: 'Reset',
  successMessage: 'Projection calculated successfully',
  
  platformVariants: {
    web: {
      layout: 'fullwidth',
      gridColumns: 2,
    },
    mobile: {
      layout: 'stacked',
    },
  },
  
  crossFieldValidation: [
    {
      fields: ['age', 'retirementAge'],
      validate: (v) => v.retirementAge > v.age,
      message: 'Retirement age must be greater than current age',
    },
  ],
};
```

### 4. **Help Content Schema Enhancement** (`packages/shared/src/content/uiContent.ts`)

**Purpose:** Extend existing help content with field-specific guidance

```typescript
/**
 * Extended content definitions for UI elements
 * Includes validation messages, placeholders, examples
 */

export interface FieldContent {
  helpTopicId: string;
  
  // Help & guidance
  help: HelpTopic;
  
  // UI text
  label: string;
  placeholder?: string;
  hint?: string;
  
  // Validation messages
  validationMessages: Record<string, string>;
  
  // Error handling
  errorMessages: Record<string, string>;
  
  // Tooltips (short form)
  tooltip?: string;
}

/**
 * Example: Contribution field content
 */
export const CONTRIBUTION_CONTENT: FieldContent = {
  helpTopicId: 'contribution',
  
  label: 'Annual Contribution',
  placeholder: 'Enter amount',
  hint: '2025 limit: $23,500 ($30,500 if 50+)',
  tooltip: 'Annual 401(k) contribution amount',
  
  help: HELP_TOPICS['contribution'],
  
  validationMessages: {
    required: 'Contribution amount is required',
    min: 'Contribution must be at least $0',
    max_standard: 'Exceeds 2025 limit of $23,500',
    max_catchup: 'Exceeds 2025 catch-up limit of $30,500',
  },
  
  errorMessages: {
    invalid_number: 'Please enter a valid number',
    out_of_range: 'Value is outside allowed range',
  },
};

/**
 * Central content registry
 */
export const UI_CONTENT: Record<string, FieldContent> = {
  contribution: CONTRIBUTION_CONTENT,
  expectedReturn: {
    helpTopicId: 'expectedReturn',
    label: 'Expected Return',
    placeholder: '7',
    hint: 'Historical average: ~7%',
    tooltip: 'Annual investment return (percent)',
    help: HELP_TOPICS['expectedReturn'],
    validationMessages: {
      required: 'Expected return is required',
      min: 'Return must be at least 0%',
      max: 'Return cannot exceed 15%',
    },
    errorMessages: {
      invalid_number: 'Please enter a valid percentage',
    },
  },
  // ... more fields
};
```

### 5. **Platform-Agnostic Hooks/Utilities** (`packages/shared/src/hooks/useFieldDefinition.ts`)

**Purpose:** Provide ready-to-use utilities for both platforms

```typescript
/**
 * Platform-agnostic utilities for working with unified UI definitions
 */

export function getFieldDefinition(fieldId: string): InputFieldDefinition {
  return FIELD_DEFINITIONS[fieldId];
}

export function getFieldContent(fieldId: string): FieldContent {
  return UI_CONTENT[fieldId];
}

export function getFieldCategory(fieldId: string, value: number): ValueCategory {
  const mapping = CATEGORY_MAPPINGS[fieldId];
  return getCategoryForValue(mapping, value);
}

export function getFieldColor(fieldId: string, value: number): string {
  const mapping = CATEGORY_MAPPINGS[fieldId];
  return getColorForValue(mapping, value);
}

export function validateField(
  fieldId: string,
  value: any,
  formState?: Record<string, any>
): { valid: boolean; errors: string[] } {
  const definition = getFieldDefinition(fieldId);
  const errors: string[] = [];
  
  // Apply validation rules
  for (const rule of definition.validationRules) {
    if (!rule.validate(value)) {
      errors.push(rule.message);
    }
  }
  
  // Apply conditional constraints
  if (definition.constraints.conditionalMin) {
    const min = definition.constraints.conditionalMin(formState || {});
    if (value < min) {
      errors.push(`Value must be at least ${min}`);
    }
  }
  
  if (definition.constraints.conditionalMax) {
    const max = definition.constraints.conditionalMax(formState || {});
    if (value > max) {
      errors.push(`Value cannot exceed ${max}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function getFieldDisplayValue(
  fieldId: string,
  value: number
): string {
  const definition = getFieldDefinition(fieldId);
  const formatter = definition.constraints.format;
  return formatter ? formatter(value) : value.toString();
}
```

---

## Migration Path

### Phase 1: Core Infrastructure (Week 1)
- [ ] Create `packages/shared/src/uiSchema/` directory
- [ ] Define `inputFields.ts` with base types and examples
- [ ] Define `categories.ts` with color mappings
- [ ] Export from `packages/shared/src/index.ts`
- [ ] Create `useFieldDefinition` utility functions

### Phase 2: Deterministic Tab (Week 2)
- [ ] Define all Deterministic fields in `inputFields.ts`
- [ ] Create `DETERMINISTIC_SCREEN` definition
- [ ] Update Deterministic Mobile to use field definitions
- [ ] Update Deterministic Web to use field definitions
- [ ] Remove duplicate constraints from component code

### Phase 3: What-If Tab (Week 3)
- [ ] Define What-If specific fields
- [ ] Create `WHATIF_SCREEN` definition
- [ ] Update What-If Mobile (ScenarioCard) to use definitions
- [ ] Update What-If Web to use definitions

### Phase 4: Other Screens (Week 4)
- [ ] Monte Carlo, Social Security, Medicare screens
- [ ] Profile/Settings screens
- [ ] Plans comparison

### Phase 5: Help Content Sync (Week 5)
- [ ] Consolidate all help content in `uiContent.ts`
- [ ] Remove duplicate help text from components
- [ ] Create content distribution system

---

## Implementation Example: Using Unified Schema

### Before (Current - Duplicated)
```tsx
// Mobile: DeterministicTab.tsx
const [contribution, setContribution] = useState(10000);
<Slider
  minimumValue={0}
  maximumValue={age >= 50 ? 30500 : 23500}
  step={500}
  value={contribution}
/>
<Text>{formatCurrency(contribution)}</Text>

// Web: DeterministicForm.tsx
const [contribution, setContribution] = useState(10000);
<Slider
  min={0}
  max={age >= 50 ? 30500 : 23500}
  step={500}
  value={contribution}
/>
<span>{formatCurrency(contribution)}</span>
```

### After (Unified)
```tsx
// Mobile: DeterministicTab.tsx
import { getFieldDefinition, getFieldColor } from '@projection/shared';

const fieldDef = getFieldDefinition('contribution');
const [contribution, setContribution] = useState(fieldDef.constraints.min);

<Slider
  minimumValue={fieldDef.constraints.min}
  maximumValue={fieldDef.constraints.conditionalMax?.({ age }) || fieldDef.constraints.max}
  step={fieldDef.constraints.step}
  value={contribution}
/>

// Web: DeterministicForm.tsx
import { getFieldDefinition, getFieldDisplayValue } from '@projection/shared';

const fieldDef = getFieldDefinition('contribution');
const [contribution, setContribution] = useState(fieldDef.constraints.min);

<Slider
  min={fieldDef.constraints.min}
  max={fieldDef.constraints.conditionalMax?.({ age }) || fieldDef.constraints.max}
  step={fieldDef.constraints.step}
  value={contribution}
/>
```

---

## Benefits

| Aspect | Current | Unified |
|--------|---------|---------|
| **Maintenance** | Duplicate changes needed | Single source of truth |
| **Feature Parity** | Manual sync required | Automatic across platforms |
| **Onboarding** | Learn each codebase | Read schema definitions |
| **New Features** | 2x implementation | 1x definition + 2x UI rendering |
| **Consistency** | Best effort | Enforced by schema |
| **Validation** | Repeated logic | Centralized |
| **Context Loss** | Frequent | Minimal |

---

## File Structure

```
packages/shared/src/
├── uiSchema/
│   ├── index.ts                 # Export all schema definitions
│   ├── inputFields.ts           # Field definitions (Deterministic, What-If, MC, etc.)
│   ├── categories.ts            # Value-to-category mappings & colors
│   ├── screens.ts               # Full screen/form definitions
│   └── validation.ts            # Validation rule builders
├── content/
│   ├── helpContent.ts           # Existing help topics
│   ├── uiContent.ts             # NEW: Field-specific content
│   └── errorMessages.ts         # NEW: Centralized error messages
├── hooks/                       # NEW: Platform-agnostic utilities
│   ├── useFieldDefinition.ts
│   ├── useFormValidation.ts
│   └── useCategoryMapping.ts
├── utils/
│   └── fieldFormatters.ts       # Value formatting utilities
├── types/
└── config/
```

---

## Next Steps

1. **Review & Align:** Discuss schema design with team
2. **Prototype:** Implement Phase 1 (infrastructure)
3. **Pilot:** Apply to Deterministic tab on both platforms
4. **Iterate:** Refine based on real usage
5. **Scale:** Apply to remaining features

This architecture eliminates context loss by keeping all UI decisions, constraints, and content definitions in one place that both platforms can reference.
