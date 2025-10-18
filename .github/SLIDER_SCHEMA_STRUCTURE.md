# DETERMINISTIC_SCREEN Complete Schema Structure

**Visualized**: October 17, 2025

---

## Full Schema Map

```
DETERMINISTIC_SCREEN {
  ├── id: "deterministic"
  ├── name: "Deterministic Calculator"
  ├── description: "Single-scenario retirement projection..."
  ├── icon: "calculator"
  │
  ├── sections: [
  │   ├── [0] Personal Information {
  │   │   ├── id: "personal"
  │   │   ├── title: "Personal Information"
  │   │   ├── fields: ["age", "retirementAge"]
  │   │   ├── layout: "horizontal"
  │   │   └── metadata: {
  │   │       └── sliderStyle: {
  │   │           ├── showRangeIndicator: true
  │   │           ├── rangeIndicatorType: "compact"
  │   │           ├── displayFormat: "inline"
  │   │           ├── showValue: true
  │   │           ├── showMin: true
  │   │           └── showMax: true
  │   │       }
  │   │   }
  │   │
  │   ├── [1] Savings & Contributions {
  │   │   ├── id: "savings"
  │   │   ├── title: "Savings & Contributions"
  │   │   ├── fields: ["currentBalance", "contribution"]
  │   │   ├── layout: "vertical"
  │   │   └── metadata: {
  │   │       └── sliderStyle: {
  │   │           ├── showRangeIndicator: true
  │   │           ├── rangeIndicatorType: "full"
  │   │           ├── showValue: true
  │   │           ├── showMin: true
  │   │           ├── showMax: true
  │   │           ├── displayFormat: "below"
  │   │           ├── trackColor: {
  │   │           │   ├── filled: "#69B47A" (Green)
  │   │           │   └── empty: "rgba(105, 180, 122, 0.2)"
  │   │           }
  │   │           └── thumbStyle: {
  │   │               ├── size: "medium"
  │   │               ├── color: "#69B47A"
  │   │               └── showLabel: true
  │   │           }
  │   │       }
  │   │   }
  │   │
  │   └── [2] Retirement Assumptions {
  │       ├── id: "assumptions"
  │       ├── title: "Retirement Assumptions"
  │       ├── fields: ["expectedReturn", "inflation"]
  │       ├── layout: "vertical"
  │       └── metadata: {
  │           └── sliderStyle: {
  │               ├── showRangeIndicator: true
  │               ├── rangeIndicatorType: "full"
  │               ├── showValue: true
  │               ├── showMin: true
  │               ├── showMax: true
  │               ├── displayFormat: "below"
  │               ├── trackColor: {
  │               │   ├── filled: "#4ABDAC" (Teal)
  │               │   └── empty: "rgba(74, 189, 172, 0.2)"
  │               }
  │               └── thumbStyle: {
  │                   ├── size: "medium"
  │                   ├── color: "#4ABDAC"
  │                   └── showLabel: true
  │               }
  │           }
  │       }
  │   }
  │
  ├── buttons: [
  │   ├── { id: "calculate", label: "Calculate", type: "primary" }
  │   ├── { id: "reset", label: "Reset", type: "secondary" }
  │   └── { id: "whatif", label: "Open in What-If", type: "tertiary" }
  │
  ├── platformVariants: {
  │   ├── web: {
  │   │   ├── layout: "fullwidth"
  │   │   ├── gridColumns: 2
  │   │   ├── maxWidth: "800px"
  │   │   └── sliderDefaults: {
  │   │       ├── showRangeIndicator: true
  │   │       ├── rangeIndicatorType: "full"
  │   │       ├── showValue: true
  │   │       ├── showMin: true
  │   │       ├── showMax: true
  │   │       ├── displayFormat: "below"
  │   │       ├── heightPixels: 48 ← Web is compact
  │   │       ├── thumbSize: 24
  │   │       └── trackHeight: 8
  │   │   }
  │   │
  │   └── mobile: {
  │       ├── layout: "stacked"
  │       ├── collapseSections: false
  │       └── sliderDefaults: {
  │           ├── showRangeIndicator: true
  │           ├── rangeIndicatorType: "full"
  │           ├── showValue: true
  │           ├── showMin: true
  │           ├── showMax: true
  │           ├── displayFormat: "below"
  │           ├── heightPixels: 64 ← Mobile is touch-friendly
  │           ├── thumbSize: 28
  │           └── trackHeight: 10
  │       }
  │   }
  │
  ├── crossFieldValidation: [
  │   ├── fields: ["age", "retirementAge"]
  │   └── validation: age < retirementAge
  │
  └── metadata: {
      ├── description_long: "Project your retirement..."
      ├── helpCategory: "retirement-planning"
      └── sliderConfiguration: {
          ├── showRangeIndicator: true
          ├── indicators: {
          │   ├── min: {
          │   │   ├── show: true
          │   │   ├── label: "min"
          │   │   └── position: "left"
          │   }
          │   ├── max: {
          │   │   ├── show: true
          │   │   ├── label: "max"
          │   │   └── position: "right"
          │   }
          │   └── current: {
          │       ├── show: true
          │       ├── position: "center-top"
          │       └── format: "value-unit"
          │   }
          }
          └── theme: {
              └── light: {
                  ├── trackFilledColor: "#69B47A"
                  ├── trackEmptyColor: "rgba(105, 180, 122, 0.15)"
                  ├── thumbColor: "#69B47A"
                  ├── thumbBorderColor: "#FFFFFF"
                  ├── thumbBorderWidth: 2
                  └── textColor: "#30403A"
              }
          }
      }
  }
}
```

---

## Configuration Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    DETERMINISTIC_SCREEN                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├── Platform Detection
                              │   ├─ Is Web?
                              │   │  └─ Use platformVariants.web.sliderDefaults
                              │   │     • heightPixels: 48
                              │   │     • thumbSize: 24
                              │   │     • trackHeight: 8
                              │   │
                              │   └─ Is Mobile?
                              │      └─ Use platformVariants.mobile.sliderDefaults
                              │         • heightPixels: 64
                              │         • thumbSize: 28
                              │         • trackHeight: 10
                              │
                              ├── Apply Global Theme
                              │   └─ metadata.sliderConfiguration.theme.light
                              │      • trackFilledColor: #69B47A
                              │      • trackEmptyColor: rgba(...)
                              │      • thumbColor: #69B47A
                              │      • textColor: #30403A
                              │
                              └── Section-Specific Overrides
                                  ├─ Section 1: Savings
                                  │  └─ sliderStyle: { rangeIndicatorType: 'full', trackColor: { filled: '#69B47A' } }
                                  │
                                  └─ Section 2: Assumptions
                                     └─ sliderStyle: { rangeIndicatorType: 'full', trackColor: { filled: '#4ABDAC' } }
```

---

## Slider Rendering Pipeline

### Step 1: Get Platform Defaults
```typescript
const platformDefaults = isPlatform === 'web' 
  ? DETERMINISTIC_SCREEN.platformVariants.web.sliderDefaults
  : DETERMINISTIC_SCREEN.platformVariants.mobile.sliderDefaults
```

### Step 2: Get Section Style
```typescript
const sectionStyle = DETERMINISTIC_SCREEN.sections[sectionIndex].metadata.sliderStyle
```

### Step 3: Get Global Theme
```typescript
const globalTheme = DETERMINISTIC_SCREEN.metadata.sliderConfiguration.theme.light
```

### Step 4: Merge (Section > Platform > Global)
```typescript
const finalConfig = {
  // From Platform (base)
  height: platformDefaults.heightPixels,
  thumbSize: platformDefaults.thumbSize,
  trackHeight: platformDefaults.trackHeight,
  
  // From Section (overrides)
  rangeIndicatorType: sectionStyle.rangeIndicatorType,
  trackColor: sectionStyle.trackColor.filled,
  thumbColor: sectionStyle.thumbStyle.color,
  
  // From Global (base colors)
  theme: globalTheme
}
```

### Step 5: Render
```tsx
<Slider {...finalConfig} />
```

---

## Data Location Examples

| Need | Location |
|------|----------|
| Web slider height | `platformVariants.web.sliderDefaults.heightPixels` |
| Mobile slider height | `platformVariants.mobile.sliderDefaults.heightPixels` |
| Savings section track color | `sections[1].metadata.sliderStyle.trackColor.filled` |
| Assumptions section track color | `sections[2].metadata.sliderStyle.trackColor.filled` |
| Personal section display format | `sections[0].metadata.sliderStyle.displayFormat` |
| Global thumb color | `metadata.sliderConfiguration.theme.light.thumbColor` |
| Global track filled color | `metadata.sliderConfiguration.theme.light.trackFilledColor` |
| Min indicator position | `metadata.sliderConfiguration.indicators.min.position` |
| Max indicator position | `metadata.sliderConfiguration.indicators.max.position` |
| Current value format | `metadata.sliderConfiguration.indicators.current.format` |

---

## Color Legend

| Color | Usage | Location |
|-------|-------|----------|
| `#69B47A` (Green) | Savings sliders, track fill | `sections[1].sliderStyle.trackColor.filled` |
| `#4ABDAC` (Teal) | Assumptions sliders, track fill | `sections[2].sliderStyle.trackColor.filled` |
| `#FFFFFF` (White) | Thumb border | `metadata.sliderConfiguration.theme.light.thumbBorderColor` |
| `#30403A` (Dark) | Text labels | `metadata.sliderConfiguration.theme.light.textColor` |

---

## Size Progression

### Heights
```
Compact (Web):     48px
Touch (Mobile):    64px
Difference:        +16px for easier mobile interaction
```

### Thumb Sizes
```
Compact (Web):     24px (click target)
Touch (Mobile):    28px (easier to grab)
Difference:        +4px for touch screens
```

### Track Heights
```
Compact (Web):     8px (thin, space-efficient)
Touch (Mobile):    10px (visible, easier to see)
Difference:        +2px for clarity
```

---

## Implementation Checklist

- [ ] Extract `platformDefaults` based on platform
- [ ] Extract `sectionStyle` based on current section
- [ ] Extract `globalTheme` from metadata
- [ ] Merge all configs with proper precedence
- [ ] Apply all styles from schema (no hardcoding!)
- [ ] Test web (should use 48px height)
- [ ] Test mobile (should use 64px height)
- [ ] Test color consistency
- [ ] Verify range indicators display correctly
- [ ] Verify value display below slider

---

**Last Updated**: October 17, 2025  
**Status**: ✅ Complete and accurate
