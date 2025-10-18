# Slider Schema Quick Reference

**Use this to find slider configuration values quickly**

---

## Color Scheme

### Global Theme (`metadata.sliderConfiguration.theme.light`)
```typescript
trackFilledColor: '#69B47A'                    // Green (completed portion)
trackEmptyColor: 'rgba(105, 180, 122, 0.15)'  // Light green (remaining)
thumbColor: '#69B47A'                          // Green
thumbBorderColor: '#FFFFFF'                    // White
thumbBorderWidth: 2                            // 2px
textColor: '#30403A'                           // Dark green
```

### Section Overrides
**Savings**: Green (#69B47A)
```typescript
trackColor: { filled: '#69B47A', empty: 'rgba(105, 180, 122, 0.2)' }
thumbStyle: { color: '#69B47A' }
```

**Assumptions**: Teal (#4ABDAC)
```typescript
trackColor: { filled: '#4ABDAC', empty: 'rgba(74, 189, 172, 0.2)' }
thumbStyle: { color: '#4ABDAC' }
```

---

## Dimensions

### Web Defaults
```typescript
heightPixels: 48        // Total slider height
thumbSize: 24          // Thumb diameter (px)
trackHeight: 8         // Bar thickness (px)
```

### Mobile Defaults
```typescript
heightPixels: 64       // Touch-optimized (taller)
thumbSize: 28          // Easier to grab (larger)
trackHeight: 10        // More visible (thicker)
```

---

## Display Options

### Range Indicator Type
- `'full'` → Shows "min" and "max" labels
- `'compact'` → Shorter labels
- `'minimal'` → Just range markers

### Display Format
- `'inline'` → Value on the thumb
- `'tooltip'` → Hover to see value
- `'below'` → Value below slider (most common)

### Indicator Positions
```typescript
min: { position: 'left' }      // Min label on left
max: { position: 'right' }     // Max label on right
current: { position: 'center-top', format: 'value-unit' }
```

---

## Field Ranges (from inputFields.ts)

| Field | Type | Min | Max | Step | Default |
|-------|------|-----|-----|------|---------|
| age | textInput | 18 | 125 | 1 | 30 |
| retirementAge | textInput | 50 | 100 | 1 | 65 |
| currentBalance | textInput | $0 | $10M | $1k | $50k |
| contribution | slider | $0 | $30.5k | $500 | $10k |
| expectedReturn | slider | 0% | 15% | 0.5% | 7% |
| inflation | slider | 0% | 6% | 0.1% | 2.5% |

---

## Section Mapping

### Section 0: Personal Information
```typescript
fields: ['age', 'retirementAge']
layout: 'horizontal'
rangeIndicatorType: 'compact'
displayFormat: 'inline'
```

### Section 1: Savings & Contributions
```typescript
fields: ['currentBalance', 'contribution']
layout: 'vertical'
rangeIndicatorType: 'full'
displayFormat: 'below'
trackColor: green (#69B47A)
```

### Section 2: Retirement Assumptions
```typescript
fields: ['expectedReturn', 'inflation']
layout: 'vertical'
rangeIndicatorType: 'full'
displayFormat: 'below'
trackColor: teal (#4ABDAC)
```

---

## Usage Examples

### Get Web Slider Height
```typescript
DETERMINISTIC_SCREEN.platformVariants.web.sliderDefaults.heightPixels
→ 48
```

### Get Savings Track Color
```typescript
DETERMINISTIC_SCREEN.sections[1].metadata.sliderStyle.trackColor.filled
→ '#69B47A'
```

### Get All Global Colors
```typescript
DETERMINISTIC_SCREEN.metadata.sliderConfiguration.theme.light
→ { trackFilledColor, trackEmptyColor, thumbColor, ... }
```

### Get Mobile Thumb Size
```typescript
DETERMINISTIC_SCREEN.platformVariants.mobile.sliderDefaults.thumbSize
→ 28
```

### Check if Show Range Indicator
```typescript
DETERMINISTIC_SCREEN.sections[2].metadata.sliderStyle.showRangeIndicator
→ true
```

---

## Key Principles

1. ✅ **No hardcoding** - Everything comes from schema
2. ✅ **Platform-aware** - Web/mobile have different sizes
3. ✅ **Hierarchical** - Global → Platform → Section overrides
4. ✅ **Consistent** - Same colors across related sliders
5. ✅ **Themeable** - Colors defined in one place
6. ✅ **Type-safe** - TypeScript validates structure

---

## Common Customizations

### Make All Sliders Taller
```typescript
platformVariants.web.sliderDefaults.heightPixels = 56
platformVariants.mobile.sliderDefaults.heightPixels = 72
```

### Change All Track Colors
```typescript
metadata.sliderConfiguration.theme.light.trackFilledColor = '#FF6B6B'
```

### Make Savings Sliders Red
```typescript
sections[1].metadata.sliderStyle.trackColor.filled = '#FF6B6B'
sections[1].metadata.sliderStyle.thumbStyle.color = '#FF6B6B'
```

### Hide Range Indicators
```typescript
sections[1].metadata.sliderStyle.showRangeIndicator = false
```

---

**Last Updated**: October 17, 2025  
**Status**: ✅ Current and complete
