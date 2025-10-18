# DETERMINISTIC_SCREEN - Exact Schema Definition

**File**: `packages/shared/src/uiSchema/screens.ts` (Lines 9-195)  
**Date**: October 17, 2025

---

## Complete Schema (Copy-Paste Ready)

```typescript
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
          rangeIndicatorType: 'compact', // 'full' | 'compact' | 'minimal'
          showValue: true,
          showMin: true,
          showMax: true,
          displayFormat: 'inline', // 'inline' | 'tooltip' | 'below'
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
          rangeIndicatorType: 'full', // Full range for contribution slider
          showValue: true,
          showMin: true,
          showMax: true,
          displayFormat: 'below', // Show value below slider
          trackColor: {
            filled: '#69B47A',
            empty: 'rgba(105, 180, 122, 0.2)',
          },
          thumbStyle: {
            size: 'medium', // 'small' | 'medium' | 'large'
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
```

---

## Key Additions Explained

### 1. Section-Level `metadata.sliderStyle`

Added to all three sections for fine-grained control:

**Personal Section** (Compact style):
```typescript
metadata: {
  sliderStyle: {
    rangeIndicatorType: 'compact',     // Shorter labels
    displayFormat: 'inline',            // Value on thumb
  }
}
```

**Savings Section** (Full style, green):
```typescript
metadata: {
  sliderStyle: {
    rangeIndicatorType: 'full',         // Min/max visible
    displayFormat: 'below',             // Value below
    trackColor: {
      filled: '#69B47A',                // Green
      empty: 'rgba(105, 180, 122, 0.2)'
    },
    thumbStyle: {
      size: 'medium',
      color: '#69B47A',
      showLabel: true
    }
  }
}
```

**Assumptions Section** (Full style, teal):
```typescript
metadata: {
  sliderStyle: {
    rangeIndicatorType: 'full',
    displayFormat: 'below',
    trackColor: {
      filled: '#4ABDAC',                // Teal
      empty: 'rgba(74, 189, 172, 0.2)'
    },
    thumbStyle: {
      size: 'medium',
      color: '#4ABDAC',
      showLabel: true
    }
  }
}
```

### 2. Platform-Specific `sliderDefaults`

Added to both `web` and `mobile` variants:

**Web** (Compact, click-optimized):
```typescript
web: {
  layout: 'fullwidth',
  gridColumns: 2,
  maxWidth: '800px',
  sliderDefaults: {
    heightPixels: 48,      // Compact
    thumbSize: 24,         // Click target
    trackHeight: 8,        // Thin
  }
}
```

**Mobile** (Touch-optimized):
```typescript
mobile: {
  layout: 'stacked',
  collapseSections: false,
  sliderDefaults: {
    heightPixels: 64,      // Taller for touch
    thumbSize: 28,         // Larger grab area
    trackHeight: 10,       // Thicker
  }
}
```

### 3. Global `metadata.sliderConfiguration`

New global settings for consistency:

```typescript
metadata: {
  sliderConfiguration: {
    // Indicator positioning
    indicators: {
      min: {
        show: true,
        label: 'min',
        position: 'left'
      },
      max: {
        show: true,
        label: 'max',
        position: 'right'
      },
      current: {
        show: true,
        position: 'center-top',
        format: 'value-unit'
      }
    },
    // Theme colors
    theme: {
      light: {
        trackFilledColor: '#69B47A',
        trackEmptyColor: 'rgba(105, 180, 122, 0.15)',
        thumbColor: '#69B47A',
        thumbBorderColor: '#FFFFFF',
        thumbBorderWidth: 2,
        textColor: '#30403A'
      }
    }
  }
}
```

---

## What Each Section Contains

### Personal Information Section
- **Fields**: `age`, `retirementAge` (textInput type, not sliders)
- **Slider Style**: Compact indicators, value inline
- **Use Case**: Quick range selection

### Savings & Contributions Section
- **Fields**: `currentBalance` (textInput), `contribution` (slider)
- **Slider Style**: Full range, green color, value below
- **Use Case**: Main input area with emphasis on contribution

### Retirement Assumptions Section
- **Fields**: `expectedReturn` (slider), `inflation` (slider)
- **Slider Style**: Full range, teal color, value below
- **Use Case**: Fine-tuning assumptions with visual feedback

---

## Color Scheme Details

### Green Track (#69B47A)
Used for savings-related content:
- Conveys growth, money, safety
- Applied to Savings section sliders
- Track filled: `#69B47A`
- Track empty: `rgba(105, 180, 122, 0.2)`

### Teal Track (#4ABDAC)
Used for assumptions/analysis content:
- Conveys analysis, data, planning
- Applied to Assumptions section sliders
- Track filled: `#4ABDAC`
- Track empty: `rgba(74, 189, 172, 0.2)`

### Universal
- Thumb border: White (#FFFFFF)
- Text: Dark (#30403A)
- Border width: 2px

---

## Size Progression

```
Web:                Mobile:            Difference:
heightPixels: 48    heightPixels: 64   +16px (33% taller)
thumbSize: 24       thumbSize: 28      +4px (17% larger)
trackHeight: 8      trackHeight: 10    +2px (25% thicker)
```

Rationale: Mobile needs larger touch targets and better visibility

---

## Configuration Options by Type

### `rangeIndicatorType`
- `'compact'`: Shows "min" and "max" with short form (best for small ranges)
- `'full'`: Shows "min" and "max" with full values (best for large ranges)
- `'minimal'`: Just shows the markers without text (most compact)

### `displayFormat`
- `'inline'`: Value appears on/in the thumb (compact, inline)
- `'tooltip'`: Value shows on hover (doesn't clutter)
- `'below'`: Value appears below slider (clear, readable)

### `thumbStyle.size`
- `'small'`: ~20px diameter
- `'medium'`: ~28px diameter (best for general use)
- `'large'`: ~36px diameter (for touch-heavy mobile)

---

## How to Access These Values

### In Components (TypeScript)

```typescript
import { DETERMINISTIC_SCREEN } from '@projection/shared';

// Get web slider height
const webHeight = DETERMINISTIC_SCREEN.platformVariants.web.sliderDefaults.heightPixels;
// → 48

// Get mobile thumb size
const mobileThumb = DETERMINISTIC_SCREEN.platformVariants.mobile.sliderDefaults.thumbSize;
// → 28

// Get savings track color
const savingsColor = DETERMINISTIC_SCREEN.sections[1].metadata.sliderStyle.trackColor.filled;
// → '#69B47A'

// Get global theme
const theme = DETERMINISTIC_SCREEN.metadata.sliderConfiguration.theme.light;
// → { trackFilledColor: '#69B47A', ... }
```

---

## Validation & Type Safety

All values are defined with proper types in `types.ts`:

```typescript
export interface ScreenDefinition {
  id: string;
  name: string;
  description: string;
  sections: FieldGroup[];
  platformVariants: {
    web: { /* ... */ };
    mobile: { /* ... */ };
  };
  metadata?: Record<string, any>;
  // ... more fields
}
```

TypeScript ensures all required fields are present and correct type ✅

---

## Integration Summary

| Component Layer | Schema Source | Value |
|-----------------|---------------|-------|
| Platform Layer | `platformVariants.web.sliderDefaults` | height, thumbSize, trackHeight |
| Section Layer | `sections[i].metadata.sliderStyle` | rangeIndicatorType, displayFormat, colors |
| Global Layer | `metadata.sliderConfiguration.theme` | all colors, indicators |

---

**This schema enables 100% schema-driven slider rendering across web and mobile!**
