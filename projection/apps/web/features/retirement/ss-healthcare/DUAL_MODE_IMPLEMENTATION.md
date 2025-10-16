# SS & Healthcare Dual-Mode Implementation

## Overview
Successfully converted the SS & Healthcare tab from a single-mode interface to a **dual-mode system**:
- **Quick Estimate**: Minimal 5-question interface with smart defaults
- **Detailed Mode**: Full control with all 15 input parameters

## Architecture

### Type System (`types.ts`)
- `InputMode = 'QUICK' | 'DETAILED'`
- `QuickModeInputs`: 5 fields (birthYear, claimAge, incomeToday, yearsWorked, stateCode)
- `DetailedModeInputs`: 15 fields (all existing controls)
- `SSHealthcareInputs = DetailedModeInputs` (backward compatibility)

### Components

#### QuickForm (`QuickForm.tsx`)
- **Inputs**: Birth year, claim age, income today, years worked, state
- **Features**:
  - Dynamic FRA display
  - Claim age helper text (warnings for early/delayed)
  - Income and years validation
  - Smart Defaults info box listing assumptions
- **UX**: Single card, question-style labels, friendly interface

#### DetailedForm (`DetailedForm.tsx`)
- **Renamed from**: `SSInputsForm.tsx`
- **Inputs**: All 15 parameters in 4 organized cards
- **Cards**: Basic Info, Earnings History, Medicare/Medicaid, Premium Overrides
- **Features**: AIME vs CSV toggle, plan type selection, IRMAA overrides

#### SSHealthcareTab (`SSHealthcareTab.tsx`)
- **Mode Toggle**: ToggleButtonGroup at top-right ("Quick Estimate" | "Detailed")
- **State Management**: Separate state for Quick and Detailed inputs
- **Mode Migration**:
  - Quick → Detailed: Calls `quickToDetailed()` to populate with estimates
  - Detailed → Quick: Preserves birth year, claim age, and MAGI
- **Conditional Rendering**: Switches between QuickForm and DetailedForm

#### SSResultsPanel (`SSResultsPanel.tsx`)
- **Mode Awareness**: Accepts `mode` prop
- **Quick Mode Features**:
  - "Assumptions Used" accordion with 6 assumption bullets
  - "Switch to Detailed Mode" button with SettingsIcon
  - Educational messaging about customization options

### Computation Logic

#### Quick AIME Estimation (`ssaMath.ts`)
```typescript
estimateAIMEFromIncome(incomeToday, birthYear, yearsWorked)
```
- Projects current income backward with 3% wage growth
- Caps each year at SS wage base
- Returns estimated AIME using standard calculation

#### Compute Functions (`compute.ts`)
- `computeQuickResults()`: Estimates AIME, converts to Detailed, computes
- `computeDetailedResults()`: Standard calculation (unchanged logic)
- `computeSSHealthcareResults()`: Unified interface with type guard

### Utilities (`modeUtils.ts`)
- `quickToDetailed()`: Converts Quick inputs to Detailed with smart defaults
  - MAGI = 90% of income (capped at $80k)
  - Plan type = ADVANTAGE
  - Filing status = SINGLE
  - Advantage premium = $20
- `getDefaultQuickInputs()`: Default Quick state (45yo, FRA, $75k, 25yrs, CA)
- `getDefaultDetailedInputs()`: Default Detailed state (45yo, FRA, $5k AIME)
- `shouldShowIRMAAWarning()`: Checks income thresholds

## Smart Defaults (Quick Mode)

When users select Quick Estimate, the following assumptions are made:
1. **Medicare Plan**: Medicare Advantage (~$0-35/month typical)
2. **Part B Premium**: Standard 2025 premium ($185/month)
3. **IRMAA**: Based on 90% of current income as estimated MAGI
4. **SS Credits**: Assumed 40 credits (fully insured)
5. **Filing Status**: Single
6. **AIME**: Estimated from current income with 3% wage growth

## User Flow

### Quick Mode Flow
1. User enters 5 basic questions
2. Sees Smart Defaults box explaining assumptions
3. Clicks Compute
4. Views results with assumptions accordion
5. (Optional) Clicks "Switch to Detailed Mode" to customize

### Detailed Mode Flow
1. User toggles to Detailed mode
2. All 15 parameters available for customization
3. Full control over plan types, IRMAA, overrides
4. Same computation logic, more precise inputs

### Mode Switching
- **Quick → Detailed**: Preserves inputs, estimates AIME, fills in defaults
- **Detailed → Quick**: Preserves basic values, resets to assumptions
- **Data Migration**: Seamless with `quickToDetailed()` conversion

## Files Changed

### New Files
- `QuickForm.tsx` (154 lines)
- `modeUtils.ts` (74 lines)

### Updated Files
- `types.ts`: Added InputMode, QuickModeInputs, DetailedModeInputs
- `ssaMath.ts`: Added `estimateAIMEFromIncome()`
- `DetailedForm.tsx`: Renamed from SSInputsForm, updated types
- `SSHealthcareTab.tsx`: Mode state, toggle UI, conditional rendering
- `compute.ts`: Quick/Detailed compute functions, unified interface
- `SSResultsPanel.tsx`: Mode prop, assumptions accordion, switch button
- `medicareMath.ts`: Updated to use DetailedModeInputs, Override suffixes
- `index.ts`: Updated exports

## Testing Checklist

- [ ] Quick mode compute works
- [ ] Detailed mode compute works
- [ ] Mode toggle preserves data
- [ ] Quick → Detailed migration accurate
- [ ] Detailed → Quick preserves basics
- [ ] Assumptions accordion displays in Quick mode
- [ ] Switch to Detailed button works
- [ ] AIME estimation produces reasonable results
- [ ] All 5 Quick inputs validated
- [ ] Smart Defaults box displays correctly

## Future Enhancements

- Remember last mode selection in localStorage
- Add "Copy Quick Link" with pre-filled inputs
- Show estimated vs actual AIME comparison in Detailed
- Add "Why these defaults?" tooltips in Smart Defaults box
- Consider "Guided" mode between Quick and Detailed

## Design Principles

1. **Progressive Disclosure**: Start simple, expand on demand
2. **Data Preservation**: Never lose user input when switching modes
3. **Single Source of Truth**: One calculation path, UI controls exposure
4. **Educational**: Explain assumptions clearly in Quick mode
5. **Seamless Migration**: Mode switching feels natural and intuitive
