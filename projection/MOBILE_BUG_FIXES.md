# Phase 2 Bug Fixes: StyleSheet Type Issues

## Problem
Runtime error when running mobile app:
```
ERROR  [Error: Exception in HostFunction: TypeError: expected dynamic type 'boolean', but had type 'string']
```

## Root Cause
TypeScript type assertions (`as const`) in React Native StyleSheet definitions cause runtime type errors. The bundler/runtime expects proper types without const assertions.

## Fixes Applied

### 1. MonteCarloTab.tsx
**Before:**
```typescript
const styles = StyleSheet.create({
  resultText: {
    fontWeight: "bold" as const,  // ❌ Type assertion
  },
  switchContainer: {
    flexDirection: "row" as const,  // ❌ Type assertion
    alignItems: "center" as const,  // ❌ Type assertion
  },
});

const inputSpacing = { marginBottom: 12 } as const;  // ❌ Type assertion
```

**After:**
```typescript
const styles = StyleSheet.create({
  resultText: {
    fontWeight: '700',  // ✅ Plain string
  },
  switchContainer: {
    flexDirection: 'row',  // ✅ Plain string
    alignItems: 'center',  // ✅ Plain string
  },
});

const inputSpacing = { marginBottom: 12 };  // ✅ No type assertion
```

### 2. App.tsx
**Added explicit boolean prop:**
```typescript
<StatusBar barStyle="dark-content" translucent={true} backgroundColor="transparent" />
```

### 3. Package Version Fix
Downgraded `react-native-screens` from `4.17.1` to `~4.16.0` to match Expo 54 compatibility.

## Files Modified
1. ✅ `/apps/mobile/screens/MonteCarloTab.tsx` - Removed 4 `as const` assertions
2. ✅ `/apps/mobile/App.tsx` - Added `translucent={true}` boolean prop
3. ✅ `/apps/mobile/package.json` - Updated react-native-screens version

## Testing Instructions

### 1. Clear Cache and Restart
```bash
cd /Users/vinodhchandrakumar/Downloads/401K/401/projection
pnpm --filter mobile start -- --clear --reset-cache
```

### 2. Expected Behavior
✅ **App should load without errors**
✅ **See 4-tab bottom navigation:** Home, Calculator, What-If, Profile
✅ **Home tab:** Gradient hero, 3 feature cards, CTA button
✅ **Calculator tab:** 3 internal tabs (Monte Carlo, SS & Healthcare, Assumptions)
✅ **Monte Carlo tab:** Existing calculator functionality
✅ **SS & Healthcare tab:** Placeholder card showing Phase 3 features
✅ **Assumptions tab:** Placeholder card
✅ **What-If tab:** Placeholder showing Phase 4 features
✅ **Profile tab:** Settings cards (disabled buttons)

### 3. Interaction Tests
- [ ] Tap each bottom tab - should navigate
- [ ] In Calculator, swipe between 3 tabs - should work smoothly
- [ ] In Home, tap "Get Started" button - should navigate to Calculator
- [ ] Theme colors match web (green primary, teal secondary)

## Known Issues
- `apps/mobile/app/calculator.tsx` still has old `as const` assertions (but file is not used anymore)
- React Native Paper some components might have minor styling differences from web MUI

## Next Steps After Testing Passes
Once the app loads successfully without errors, proceed to **Phase 3**:
- Build SS & Healthcare mobile UI
- Import calculations from `@projection/shared`
- Implement Quick/Detailed mode switching
- Create charts with Victory

## Prevention
**Rule for future React Native code:**
- ❌ Never use `as const` in StyleSheet.create()
- ❌ Never use `as const` for inline styles
- ✅ Use plain string/number literals
- ✅ Let TypeScript infer types from StyleSheet.create()
- ✅ Use explicit boolean props (e.g., `translucent={true}` not `translucent="true"`)

## Additional Notes
- All new screen files (HomeScreen, CalculatorScreen, SSHealthcareTab, AssumptionsTab, WhatIfScreen, ProfileScreen) were created with correct StyleSheet syntax from the start
- The error was coming from the MonteCarloTab which was copied from the old calculator.tsx that had these type assertions
- BottomTabNavigator.tsx was created with correct syntax

---

**Status:** 🔧 Fixes applied, ready for testing
**Next Action:** Start mobile app and verify no runtime errors
