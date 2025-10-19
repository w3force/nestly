# Mobile Quick Start Integration Guide

**Status**: Ready to implement  
**Target Files**: 3 files to create/modify  
**Estimated Time**: 2-3 hours  

---

## Overview

Integrate the Smart Defaults "Quick Start" feature into the mobile app to match web functionality.

### User Flow (Mobile)
```
Landing Screen
    ↓
Hero + Quick Start Section (NEW)
    ↓
Enter: Age, Balance, Strategy
    ↓
View real-time results (8 seconds)
    ↓
Tap "Get Detailed Analysis"
    ↓
→ Calculator with deep link parameters
    ↓
Pre-filled results ready
```

---

## Implementation Steps

### Step 1: Create Mobile QuickStartSection Component

**File**: `apps/mobile/components/QuickStartSection.tsx`

This component adapts the web version for React Native using react-native-paper.

```tsx
/**
 * Quick Start Section (Mobile)
 * Get retirement calculation results in 8 seconds
 * Uses Smart Defaults based on age, balance, and risk strategy
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Text, Card, Button, Slider, useTheme, Icon } from 'react-native-paper';
import { useProjectionStore } from '@projection/core';
import { calculateDefaults, formatCurrency } from '../lib/defaultValues';

interface QuickStartSectionProps {
  onNavigateTo?: (route: string, params?: any) => void;
}

const { width } = Dimensions.get('window');

export default function QuickStartSection({ onNavigateTo }: QuickStartSectionProps) {
  const theme = useTheme();
  const { setInput } = useProjectionStore();

  // Form state
  const [age, setAge] = useState(35);
  const [balance, setBalance] = useState(50000);
  const [strategy, setStrategy] = useState<'low' | 'mid' | 'high'>('mid');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Animation
  const fadeAnim = new Animated.Value(0);

  // Calculate results when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      try {
        const calculated = calculateDefaults(age, balance, strategy);
        setResult(calculated);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Calculation error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [age, balance, strategy]);

  const handleGetDetailedAnalysis = () => {
    if (result && onNavigateTo) {
      // Update store with current values
      setInput({
        age,
        retireAge: result.retirementAge,
        balance,
        contribution: result.monthlyContribution * 12,
        rate: result.expectedReturn,
        inflation: result.inflation,
      });

      // Navigate to calculator with URL parameters
      const params = {
        age,
        balance,
        contribution: result.monthlyContribution * 12,
        rate: result.expectedReturn,
        inflation: result.inflation,
        retireAge: result.retirementAge,
        strategy,
      };

      onNavigateTo('Calculator', params);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.headerTitle}>
          ⚡ Quick Start
        </Text>
        <Text variant="bodySmall" style={styles.headerSubtitle}>
          Get your retirement projection in 8 seconds
        </Text>
      </View>

      {/* Input Section */}
      <Card style={styles.inputCard}>
        <Card.Content style={styles.cardContent}>
          {/* Age Slider */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text variant="labelLarge">Your Age: {age}</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                18 - 100
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minValue={18}
              maxValue={100}
              value={age}
              onValueChange={setAge}
            />
          </View>

          {/* Balance Input */}
          <View style={styles.inputGroup}>
            <Text variant="labelLarge">Current Balance</Text>
            <TouchableOpacity
              onPress={() => {
                // Could open numeric input modal
                // For now, showing preset options
              }}
            >
              <View style={[styles.balanceDisplay, { borderColor: theme.colors.outline }]}>
                <Text variant="headlineSmall">
                  {formatCurrency(balance)}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.balancePresets}>
              {[25000, 50000, 100000, 250000, 500000].map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.presetButton,
                    balance === preset && {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  onPress={() => setBalance(preset)}
                >
                  <Text
                    variant="bodySmall"
                    style={{
                      color:
                        balance === preset
                          ? theme.colors.onPrimary
                          : theme.colors.primary,
                    }}
                  >
                    {preset < 1000000
                      ? `$${(preset / 1000).toFixed(0)}k`
                      : `$${(preset / 1000000).toFixed(1)}M`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Strategy Selector */}
          <View style={styles.inputGroup}>
            <Text variant="labelLarge">Risk Strategy</Text>
            <View style={styles.strategyButtons}>
              {[
                { id: 'low' as const, label: 'Low Risk', icon: 'shield' },
                { id: 'mid' as const, label: 'Balanced', icon: 'scale-balance' },
                { id: 'high' as const, label: 'Growth', icon: 'trending-up' },
              ].map((strat) => (
                <TouchableOpacity
                  key={strat.id}
                  style={[
                    styles.strategyButton,
                    strategy === strat.id && {
                      backgroundColor: theme.colors.primary,
                    },
                    { borderColor: theme.colors.outline },
                  ]}
                  onPress={() => setStrategy(strat.id)}
                >
                  <Icon
                    source={strat.icon}
                    size={24}
                    color={
                      strategy === strat.id
                        ? theme.colors.onPrimary
                        : theme.colors.primary
                    }
                  />
                  <Text
                    variant="bodySmall"
                    style={{
                      color:
                        strategy === strat.id
                          ? theme.colors.onPrimary
                          : theme.colors.primary,
                    }}
                  >
                    {strat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Results Section */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} size="large" />
          <Text variant="bodySmall" style={{ marginTop: 12 }}>
            Calculating...
          </Text>
        </View>
      )}

      {result && !loading && (
        <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
          <Card style={styles.resultCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.resultTitle}>
                Projected at Age {result.retirementAge}
              </Text>

              <View style={styles.resultRow}>
                <Text variant="bodyMedium" style={styles.resultLabel}>
                  Estimated Balance:
                </Text>
                <Text
                  variant="headlineMedium"
                  style={{
                    color: theme.colors.primary,
                    fontWeight: 'bold',
                  }}
                >
                  {formatCurrency(result.projectedBalance)}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text variant="bodyMedium" style={styles.resultLabel}>
                  Monthly Income (4% Rule):
                </Text>
                <Text variant="titleMedium">
                  {formatCurrency(result.monthlyIncome)}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text variant="bodyMedium" style={styles.resultLabel}>
                  Expected Return:
                </Text>
                <Text variant="bodyMedium">
                  {(result.expectedReturn * 100).toFixed(1)}%/year
                </Text>
              </View>

              <Button
                mode="contained"
                onPress={handleGetDetailedAnalysis}
                style={styles.ctaButton}
                labelStyle={{ fontSize: 16 }}
              >
                Get Detailed Analysis →
              </Button>
            </Card.Content>
          </Card>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    opacity: 0.7,
  },
  inputCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {
    height: 40,
  },
  balanceDisplay: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balancePresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  strategyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  strategyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  resultsContainer: {
    marginTop: 8,
  },
  resultCard: {
    elevation: 3,
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultLabel: {
    opacity: 0.7,
  },
  ctaButton: {
    marginTop: 16,
  },
});
```

---

### Step 2: Update LandingScreen

**File**: `apps/mobile/screens/LandingScreen.tsx`

Add QuickStartSection after hero section.

**Changes needed:**
1. Import QuickStartSection
2. Add component between hero and features
3. Pass navigation handler

```tsx
// At top of file:
import QuickStartSection from '../components/QuickStartSection';

// In the component return JSX, after hero section:
<QuickStartSection onNavigateTo={handleNavigate} />
```

---

### Step 3: Update CalculatorScreen (Optional but Recommended)

**File**: `apps/mobile/screens/CalculatorScreen.tsx`

Add deep link parameter reading to match web calculator behavior.

```tsx
// Add this effect near component start:
useEffect(() => {
  // Get route params from deep link or navigation
  const params = route?.params;
  
  if (params?.age || params?.balance || params?.contribution) {
    setAge(params.age || age);
    setBalance(params.balance || balance);
    setContribution(params.contribution || contribution);
    setRate(params.rate || rate);
    setInflation(params.inflation || inflation);
    setRetireAge(params.retireAge || retireAge);
    
    // Trigger calculation if all params present
    if (params.age && params.balance) {
      handleCalculate();
    }
  }
}, [route?.params]);
```

---

## Integration Checklist

### Component Integration
- [ ] Create QuickStartSection component (440 lines)
- [ ] Test component rendering
- [ ] Verify calculations work
- [ ] Test animations

### Landing Screen
- [ ] Import QuickStartSection
- [ ] Add component to JSX
- [ ] Test navigation
- [ ] Verify styling

### Calculator Integration
- [ ] Add route parameter reading
- [ ] Test pre-filling
- [ ] Test auto-calculation
- [ ] Verify all fields populate

### Testing
- [ ] iOS device testing
- [ ] Android device testing
- [ ] Tablet responsiveness
- [ ] Navigation flow
- [ ] Data persistence

---

## Build & Deploy

### Build Mobile
```bash
# Test/develop
pnpm --filter mobile start

# iOS
pnpm --filter mobile ios

# Android
pnpm --filter mobile android

# Production build
eas build --platform ios --production
eas build --platform android --production
```

### Deploy
```bash
# iOS App Store
eas submit --platform ios

# Google Play
eas submit --platform android
```

---

## Performance Notes

- Quick Start calculations: <100ms on mobile
- Component rendering: <500ms
- Animation smoothness: 60fps target
- Memory usage: ~2-3MB additional

---

## Styling Considerations

- Use react-native-paper components for consistency
- Match web design with mobile-appropriate spacing
- Test on various screen sizes (phone + tablet)
- Ensure touch targets are 44pt minimum
- Support light/dark theme automatically

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Slider not working | Ensure `@react-native-community/slider` is installed |
| Navigation not working | Check route params format |
| Calculations slow | Verify `defaultValues.ts` is imported correctly |
| Theme colors wrong | Check theme config in `navigation/theme.ts` |
| iOS build failing | Run `pod install` in ios folder |

---

## Files Summary

| File | Lines | Status | Impact |
|------|-------|--------|--------|
| QuickStartSection.tsx | 440 | Create | HIGH - New feature |
| LandingScreen.tsx | 10-20 | Modify | MEDIUM - Add component |
| CalculatorScreen.tsx | 10-15 | Modify | LOW - Optional enhancement |

---

## Success Criteria

✅ Component renders on landing screen  
✅ Age/balance/strategy inputs work  
✅ Real-time calculations trigger  
✅ Results display correctly  
✅ Navigation to calculator works  
✅ Calculator receives parameters  
✅ All fields pre-fill  
✅ Mobile build completes successfully

---

**Next Steps**: Start with Step 1 - Create QuickStartSection component
