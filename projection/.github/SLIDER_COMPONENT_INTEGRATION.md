# SliderField Component Integration Guide

## Overview

Two new `SliderField` components have been created to consume the schema-driven slider configuration from `DETERMINISTIC_SCREEN`:

- **Web**: `apps/web/components/SliderField.tsx` (Material-UI based)
- **Mobile**: `apps/mobile/components/SliderField.tsx` (React Native based)

## What These Components Do

Both components:
- ✅ Read slider styling from section metadata (`sliderStyle`)
- ✅ Read platform defaults from schema (`web/mobile.sliderDefaults`)
- ✅ Read global theme from metadata (`sliderConfiguration.theme`)
- ✅ Render beautiful range indicators (min/max/current)
- ✅ Format values as currency or percentages automatically
- ✅ Support multiple display formats (inline, tooltip, below)
- ✅ Platform-optimized sizing (web: 48px, mobile: 64px)
- ✅ No hardcoding - 100% schema-driven

## Component Props

Both components accept the same props interface:

```typescript
interface SliderFieldProps {
  field: InputFieldDefinition;           // From INPUT_FIELDS
  value: number;                         // Current slider value
  onChange: (value: number) => void;     // Change handler
  sliderStyle?: {                        // From section.metadata.sliderStyle
    showRangeIndicator?: boolean;
    rangeIndicatorType?: 'compact' | 'full' | 'minimal';
    showValue?: boolean;
    showMin?: boolean;
    showMax?: boolean;
    displayFormat?: 'inline' | 'tooltip' | 'below';
    trackColor?: { filled?: string; empty?: string };
    thumbStyle?: { size?: 'small' | 'medium' | 'large'; color?: string; showLabel?: boolean };
  };
  platformDefaults?: {                   // From platform variant sliderDefaults
    heightPixels?: number;
    thumbSize?: number;
    trackHeight?: number;
  };
  theme?: {                              // From metadata.sliderConfiguration.theme
    light?: {
      trackFilledColor?: string;
      trackEmptyColor?: string;
      thumbColor?: string;
      thumbBorderColor?: string;
      thumbBorderWidth?: number;
      textColor?: string;
    };
  };
}
```

## Usage Example

### Step 1: Import the component

**Web**:
```typescript
import { SliderField } from '../components/SliderField';
import { DETERMINISTIC_SCREEN, CONTRIBUTION_FIELD } from '@projection/shared';
```

**Mobile**:
```typescript
import { SliderField } from '../components';
import { DETERMINISTIC_SCREEN, CONTRIBUTION_FIELD } from '@projection/shared';
```

### Step 2: Get schema configuration

```typescript
// Get the savings section (index 1 in sections array)
const savingsSection = DETERMINISTIC_SCREEN.sections[1];

// Get platform-specific defaults
const webDefaults = DETERMINISTIC_SCREEN.platformVariants.web.sliderDefaults;
const mobileDefaults = DETERMINISTIC_SCREEN.platformVariants.mobile.sliderDefaults;

// Get global theme configuration
const theme = DETERMINISTIC_SCREEN.metadata?.sliderConfiguration?.theme;
```

### Step 3: Render the slider

**Web Example**:
```tsx
<SliderField
  field={CONTRIBUTION_FIELD}
  value={contributionValue}
  onChange={setContributionValue}
  sliderStyle={savingsSection.metadata?.sliderStyle}
  platformDefaults={webDefaults}
  theme={theme}
/>
```

**Mobile Example**:
```tsx
<SliderField
  field={CONTRIBUTION_FIELD}
  value={contributionValue}
  onChange={setContributionValue}
  sliderStyle={savingsSection.metadata?.sliderStyle}
  platformDefaults={mobileDefaults}
  theme={theme}
/>
```

## Complete Implementation Example

### Web Calculator Page

File: `apps/web/pages/calculator.tsx` (or similar)

```typescript
'use client';
import React, { useState } from 'react';
import { Box, Card, CardContent, Stack } from '@mui/material';
import { SliderField } from '../components/SliderField';
import {
  DETERMINISTIC_SCREEN,
  CONTRIBUTION_FIELD,
  EXPECTED_RETURN_FIELD,
  INFLATION_FIELD,
} from '@projection/shared';

export default function CalculatorPage() {
  // State
  const [contribution, setContribution] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [inflation, setInflation] = useState(3);

  // Schema configuration
  const savingsSection = DETERMINISTIC_SCREEN.sections[1];
  const assumptionsSection = DETERMINISTIC_SCREEN.sections[2];
  const webDefaults = DETERMINISTIC_SCREEN.platformVariants.web.sliderDefaults;
  const theme = DETERMINISTIC_SCREEN.metadata?.sliderConfiguration?.theme;

  return (
    <Box sx={{ padding: 2 }}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            {/* Savings & Contributions Section */}
            <Box>
              <SliderField
                field={CONTRIBUTION_FIELD}
                value={contribution}
                onChange={setContribution}
                sliderStyle={savingsSection.metadata?.sliderStyle}
                platformDefaults={webDefaults}
                theme={theme}
              />
            </Box>

            {/* Retirement Assumptions Section */}
            <Box>
              <SliderField
                field={EXPECTED_RETURN_FIELD}
                value={expectedReturn}
                onChange={setExpectedReturn}
                sliderStyle={assumptionsSection.metadata?.sliderStyle}
                platformDefaults={webDefaults}
                theme={theme}
              />
            </Box>

            <Box>
              <SliderField
                field={INFLATION_FIELD}
                value={inflation}
                onChange={setInflation}
                sliderStyle={assumptionsSection.metadata?.sliderStyle}
                platformDefaults={webDefaults}
                theme={theme}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
```

### Mobile Deterministic Tab

File: `apps/mobile/screens/DeterministicTab.tsx`

```typescript
import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { SliderField } from '../components';
import {
  DETERMINISTIC_SCREEN,
  CONTRIBUTION_FIELD,
  EXPECTED_RETURN_FIELD,
  INFLATION_FIELD,
} from '@projection/shared';

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },
  section: { marginBottom: 20 },
});

export default function DeterministicTab() {
  // State
  const [contribution, setContribution] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [inflation, setInflation] = useState(3);

  // Schema configuration
  const savingsSection = DETERMINISTIC_SCREEN.sections[1];
  const assumptionsSection = DETERMINISTIC_SCREEN.sections[2];
  const mobileDefaults = DETERMINISTIC_SCREEN.platformVariants.mobile.sliderDefaults;
  const theme = DETERMINISTIC_SCREEN.metadata?.sliderConfiguration?.theme;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Savings & Contributions Section */}
        <View style={styles.section}>
          <SliderField
            field={CONTRIBUTION_FIELD}
            value={contribution}
            onChange={setContribution}
            sliderStyle={savingsSection.metadata?.sliderStyle}
            platformDefaults={mobileDefaults}
            theme={theme}
          />
        </View>

        {/* Retirement Assumptions Section */}
        <View style={styles.section}>
          <SliderField
            field={EXPECTED_RETURN_FIELD}
            value={expectedReturn}
            onChange={setExpectedReturn}
            sliderStyle={assumptionsSection.metadata?.sliderStyle}
            platformDefaults={mobileDefaults}
            theme={theme}
          />
        </View>

        <View style={styles.section}>
          <SliderField
            field={INFLATION_FIELD}
            value={inflation}
            onChange={setInflation}
            sliderStyle={assumptionsSection.metadata?.sliderStyle}
            platformDefaults={mobileDefaults}
            theme={theme}
          />
        </View>

        <Button mode="contained" onPress={() => handleCalculate()}>
          Calculate
        </Button>
      </View>
    </ScrollView>
  );
}
```

## Key Features

### 1. Platform-Specific Sizing

**Web** (Desktop):
- Container height: 48px
- Thumb size: 24px
- Track height: 8px
- Optimized for mouse interaction

**Mobile** (Touch):
- Container height: 64px
- Thumb size: 28px  
- Track height: 10px
- Optimized for touch interaction

### 2. Beautiful Range Indicators

All sliders show:
- **Min label** (left): Minimum allowed value
- **Max label** (right): Maximum allowed value
- **Current value** (below): Currently selected value

Examples:
- Contribution: Shows "$5,000" to "$100,000" range with current value
- Expected Return: Shows "0.00%" to "15.00%" range with current value
- Inflation: Shows "0.00%" to "10.00%" range with current value

### 3. Color Coding

**Savings Section** (Green):
- Track filled: `#69B47A`
- Track empty: `rgba(105, 180, 122, 0.2)`
- Thumb: `#69B47A`

**Assumptions Section** (Teal):
- Track filled: `#4ABDAC`
- Track empty: `rgba(74, 189, 172, 0.2)`
- Thumb: `#4ABDAC`

### 4. Automatic Value Formatting

The component automatically detects field type and formats values:

```typescript
// Currency (for 'balance', 'contribution', 'return' fields)
$10,000
$15,500

// Percentage (for 'rate', 'inflation', 'expectedReturn' fields)
3.00%
7.50%

// Number (for 'age', 'years', etc.)
65
42
```

## Testing Checklist

### Web Platform

- [ ] Visit calculator page
- [ ] Verify contribution slider is **48px tall**
- [ ] Verify contribution slider is **GREEN** (#69B47A)
- [ ] Verify expected return slider is **TEAL** (#4ABDAC)
- [ ] Verify inflation slider is **TEAL** (#4ABDAC)
- [ ] Verify range indicators show min/max values
- [ ] Verify current value displays below slider
- [ ] Verify thumbs are 24px and have white border
- [ ] Verify smooth interaction on desktop

### Mobile Platform

- [ ] Launch mobile app on deterministic tab
- [ ] Verify contribution slider is **64px tall** (taller than web)
- [ ] Verify contribution slider is **GREEN** (#69B47A)
- [ ] Verify expected return slider is **TEAL** (#4ABDAC)
- [ ] Verify inflation slider is **TEAL** (#4ABDAC)
- [ ] Verify range indicators show min/max values
- [ ] Verify current value displays below slider
- [ ] Verify thumbs are 28px and larger than web
- [ ] Verify touch interaction is smooth
- [ ] Verify accessibility labels work with screen readers

## Values Read from Schema

### From `DETERMINISTIC_SCREEN.platformVariants.web.sliderDefaults`

```typescript
{
  heightPixels: 48,
  thumbSize: 24,
  trackHeight: 8,
  showRangeIndicator: true,
  rangeIndicatorType: 'full',
  displayFormat: 'below',
  showValue: true,
  showMin: true,
  showMax: true,
}
```

### From `DETERMINISTIC_SCREEN.platformVariants.mobile.sliderDefaults`

```typescript
{
  heightPixels: 64,
  thumbSize: 28,
  trackHeight: 10,
  showRangeIndicator: true,
  rangeIndicatorType: 'full',
  displayFormat: 'below',
  showValue: true,
  showMin: true,
  showMax: true,
}
```

### From `DETERMINISTIC_SCREEN.sections[1].metadata.sliderStyle` (Savings)

```typescript
{
  showRangeIndicator: true,
  rangeIndicatorType: 'full',
  showValue: true,
  showMin: true,
  showMax: true,
  displayFormat: 'below',
  trackColor: { filled: '#69B47A', empty: 'rgba(105, 180, 122, 0.2)' },
  thumbStyle: { size: 'medium', color: '#69B47A', showLabel: true },
}
```

### From `DETERMINISTIC_SCREEN.sections[2].metadata.sliderStyle` (Assumptions)

```typescript
{
  showRangeIndicator: true,
  rangeIndicatorType: 'full',
  showValue: true,
  showMin: true,
  showMax: true,
  displayFormat: 'below',
  trackColor: { filled: '#4ABDAC', empty: 'rgba(74, 189, 172, 0.2)' },
  thumbStyle: { size: 'medium', color: '#4ABDAC', showLabel: true },
}
```

### From `DETERMINISTIC_SCREEN.metadata.sliderConfiguration.theme.light`

```typescript
{
  trackFilledColor: '#69B47A',
  trackEmptyColor: 'rgba(105, 180, 122, 0.15)',
  thumbColor: '#69B47A',
  thumbBorderColor: '#FFFFFF',
  thumbBorderWidth: 2,
  textColor: '#30403A',
}
```

## File Locations

- **Web Component**: `apps/web/components/SliderField.tsx`
- **Mobile Component**: `apps/mobile/components/SliderField.tsx`
- **Mobile Export**: `apps/mobile/components/index.ts`

## Next Steps

1. Update web calculator to import and use `SliderField` component
2. Update mobile deterministic tab to import and use `SliderField` component
3. Test both platforms render with correct styling and sizing
4. Verify no hardcoded values remain in component files
5. (Optional) Apply same pattern to WHATIF_SCREEN and MONTE_CARLO_SCREEN
