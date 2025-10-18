# UI Schema Implementation - Getting Started Guide

## What We Just Built ✅

We've created a **unified UI schema layer** in `@projection/shared/src/uiSchema/` that defines:

### 1. **Core Types** (`types.ts`)
- `InputFieldDefinition` - Complete field specification
- `ValidationRule` - Reusable validation rules
- `ScreenDefinition` - Complete screen/form layout
- `FieldCategoryMapping` - Value-to-category color mappings

### 2. **Validation** (`validation.ts`)
- `createRequiredRule()` - Required field validation
- `createMinRule()` - Minimum value validation
- `createMaxRule()` - Maximum value validation
- `createDecimalRule()` - Decimal place validation
- `validateField()` - Validate single field
- `validateForm()` - Validate entire form

### 3. **Color Mappings** (`categories.ts`)
- `RETURN_RATE_MAPPING` - Expected return (0-15%)
- `INFLATION_MAPPING` - Inflation rate (0-6%, inverse logic)
- `CONTRIBUTION_RATE_MAPPING` - Savings rate %
- `getColorForValue()` - Get color for any value
- `getCategoryForValue()` - Get category label

### 4. **Input Fields** (`inputFields.ts`)
- Age
- Retirement Age
- Current Balance
- Annual Contribution (with 50+ catch-up logic)
- Contribution Rate
- Expected Return
- Inflation

### 5. **Screen Definitions** (`screens.ts`)
- Landing Page
- Deterministic Calculator
- What-If Scenarios
- Monte Carlo Analysis

---

## Files Created

```
packages/shared/src/uiSchema/
├── index.ts              # Export all schema definitions
├── types.ts              # Core type definitions
├── validation.ts         # Validation rule builders
├── categories.ts         # Color mappings & categories
├── inputFields.ts        # Field definitions (7 fields)
└── screens.ts            # Screen definitions (4 screens)
```

All exported from `packages/shared/src/index.ts` for easy importing.

---

## How to Use (Quick Examples)

### Example 1: Get Field Constraints
```typescript
import { FIELD_DEFINITIONS } from '@projection/shared';

const fieldDef = FIELD_DEFINITIONS['contribution'];
console.log(fieldDef.constraints.min);        // 0
console.log(fieldDef.constraints.max);        // 30500
console.log(fieldDef.constraints.step);       // 500
console.log(fieldDef.constraints.format(15000)); // "$15.0k"
```

### Example 2: Get Category Color
```typescript
import { 
  CATEGORY_MAPPINGS, 
  getColorForValue 
} from '@projection/shared';

const returnValue = 7;
const color = getColorForValue(CATEGORY_MAPPINGS.expectedReturn, returnValue);
console.log(color); // "#FFB74D" (Orange - Average)
```

### Example 3: Validate a Field
```typescript
import { FIELD_DEFINITIONS, validateField } from '@projection/shared';

const fieldDef = FIELD_DEFINITIONS['age'];
const result = validateField(15, fieldDef.validationRules);
console.log(result); // { valid: false, errors: ['Age must be at least 18'] }
```

### Example 4: Get Conditional Max
```typescript
import { FIELD_DEFINITIONS } from '@projection/shared';

const fieldDef = FIELD_DEFINITIONS['contribution'];
const state = { age: 52 };

// Dynamic max based on age
const max = fieldDef.constraints.conditionalMax?.(state) || fieldDef.constraints.max;
console.log(max); // 30500 (because age >= 50)
```

### Example 5: Screen Definition
```typescript
import { SCREEN_DEFINITIONS } from '@projection/shared';

const screen = SCREEN_DEFINITIONS['deterministic'];
console.log(screen.name);           // "Deterministic Calculator"
console.log(screen.sections);       // Array of field groups
console.log(screen.buttons);        // Calculate, Reset, Open in What-If
console.log(screen.platformVariants); // Web/mobile specific layout
```

---

## Features to Implement (Priority Order)

### 🔴 Phase 1: Landing Page (THIS WEEK)
**Status:** Schema defined, ready to build  
**What to build:**
1. Web landing page using `LANDING_SCREEN`
2. Mobile landing page using `LANDING_SCREEN`
3. Navigation to Deterministic/What-If/Monte Carlo

**Key functions to use:**
- `SCREEN_DEFINITIONS['landing']` - Get landing page structure
- `screen.platformVariants.web/mobile` - Platform-specific layout hints

---

### 🔴 Phase 2: Deterministic Calculator (THIS WEEK+NEXT)
**Status:** Schema complete, mobile partially done, web needs work  
**What to refactor:**
1. Mobile: Remove hardcoded limits, use `FIELD_DEFINITIONS`
2. Web: Create deterministic form using field definitions
3. Both: Use `validateField()` for validation

**Key functions to use:**
- `FIELD_DEFINITIONS['age']`, `['retirementAge']`, etc.
- `validateField(value, rules, formState)` for validation
- `DETERMINISTIC_SCREEN.crossFieldValidation` for age < retireAge check

**Fields involved:**
- Age (TextInput)
- Retirement Age (TextInput)
- Current Balance (TextInput)
- Annual Contribution (Slider with dynamic max)
- Expected Return (Slider, color-coded)
- Inflation (Slider, color-coded)

---

### 🟡 Phase 3: What-If Scenarios (NEXT WEEK)
**Status:** Schema complete, mobile partially done  
**What to refactor:**
1. Mobile ScenarioCard: Use field definitions instead of hardcoded values
2. Web: Create What-If scenario builder
3. Both: Use category mappings for colors

**Key functions to use:**
- `FIELD_DEFINITIONS['contributionRate']` - % of income
- `getColorForValue(CATEGORY_MAPPINGS.expectedReturn, value)` - Dynamic colors
- `WHATIF_SCREEN` - Screen structure

---

### 🟡 Phase 4: Monte Carlo (WEEK 3)
**Status:** Schema complete, mobile done  
**What to do:**
1. Mobile: Optionally refactor to use field definitions
2. Web: Create Monte Carlo using field definitions
3. Both: Ensure results display consistent

**Key functions to use:**
- `FIELD_DEFINITIONS['age']` etc - Same as Deterministic
- `MONTE_CARLO_SCREEN` - Screen structure

---

### 🟢 Phase 5: Advanced Screens (NOT YET)
- Social Security (needs field definitions)
- Medicare (needs field definitions)
- Profile/Settings (needs field definitions)

---

## Implementation Checklist

For each screen/feature, ensure:

- [ ] Use `FIELD_DEFINITIONS` for all constraints (min, max, step)
- [ ] Use `validateField()` for validation
- [ ] Use `getColorForValue()` for colors, not hardcoded values
- [ ] Use `SCREEN_DEFINITIONS` for structure
- [ ] Check `platformVariants` for layout differences
- [ ] No duplicate validation logic between web and mobile
- [ ] All limits/ranges come from schema, not component code
- [ ] Test on both web and mobile

---

## Example: Refactoring DeterministicTab

### BEFORE (Current - Hardcoded)
```tsx
const [contribution, setContribution] = useState(10000);

<Slider
  minimumValue={0}
  maximumValue={age >= 50 ? 30500 : 23500}  // ❌ Hardcoded
  step={500}                                 // ❌ Hardcoded
  value={contribution}
/>

if (age < 18) setError('Age must be 18+');  // ❌ Duplicate logic
```

### AFTER (Using Schema)
```tsx
import { FIELD_DEFINITIONS, validateField } from '@projection/shared';

const fieldDef = FIELD_DEFINITIONS['contribution'];
const [contribution, setContribution] = useState(fieldDef.defaultValue);

const maxContribution = fieldDef.constraints.conditionalMax?.({ age }) 
  || fieldDef.constraints.max;

<Slider
  minimumValue={fieldDef.constraints.min}      // ✅ From schema
  maximumValue={maxContribution}                // ✅ From schema
  step={fieldDef.constraints.step}             // ✅ From schema
  value={contribution}
/>

const ageFieldDef = FIELD_DEFINITIONS['age'];
const validation = validateField(age, ageFieldDef.validationRules);
if (!validation.valid) setError(validation.errors[0]);  // ✅ Shared logic
```

---

## Current Compilation Status

✅ All schema files compile without errors:
- `types.ts` - ✅
- `validation.ts` - ✅
- `categories.ts` - ✅
- `inputFields.ts` - ✅
- `screens.ts` - ✅
- `index.ts` - ✅

Ready to import and use in web and mobile!

---

## Key Principles

### 1. Single Source of Truth
Define each constraint/rule/color **once** in the schema.  
Both platforms import and use it.

### 2. Platform-Specific UI Only
**Allowed differences:**
- Web uses sidebar layout, mobile uses stacked
- Web shows charts inline, mobile in modal
- Button positions different

**NOT allowed:**
- Web validates age 18-65, mobile validates 20-70
- Web shows $0-$69k contribution, mobile shows $0-$100k
- Different help text or descriptions

### 3. Extensible
Adding a new field? Just add it to `inputFields.ts`:
```ts
export const NEW_FIELD: InputFieldDefinition = { ... };
export const FIELD_DEFINITIONS: Record<...> = {
  ...
  newField: NEW_FIELD,  // ✅ Instantly available to both platforms
};
```

### 4. Testable
Schema is pure data - easy to test:
```ts
test('contribution max is 30.5k for 50+', () => {
  const max = FIELD_DEFINITIONS['contribution']
    .constraints.conditionalMax?.({ age: 52 });
  expect(max).toBe(30500);
});
```

---

## Next Steps

1. **Today:** Review this setup, ask questions
2. **Tomorrow:** Build landing page (web + mobile) using `LANDING_SCREEN`
3. **This week:** Start refactoring Deterministic to use field definitions
4. **Next week:** Do the same for What-If and Monte Carlo
5. **Following:** Add Social Security and Medicare screens

---

## Questions?

This is a new pattern for the project. Let me know:

- Any fields missing from definitions?
- Any validation rules we forgot?
- Any platform-specific behavior needed?
- Should we add more helper functions?
- Any naming changes needed?

All feedback welcome - this is the foundation for maintaining feature parity going forward! 🎯
