# Feature List & Implementation Order

## Overview
This document lists all features/screens in priority order for implementation using the new UI schema layer.

---

## 🔴 Phase 1: Landing Page (HIGH PRIORITY - Week 1)

### Features to Build
- [ ] Hero section with welcome message
- [ ] 3 Feature cards (Deterministic, What-If, Monte Carlo)
- [ ] Navigation CTA buttons
- [ ] Responsive layout (web: 3-column, mobile: 1-column)
- [ ] Platform detection & variant selection

### Schema Reference
- `SCREEN_DEFINITIONS['landing']` - Complete structure
- `LANDING_SCREEN.sections` - Hero + feature cards
- `LANDING_SCREEN.platformVariants` - Layout hints

### Implementation Tasks
1. **Web (Next.js)**
   - [ ] Create `pages/index.tsx` or `app/page.tsx`
   - [ ] Use `LANDING_SCREEN` from schema
   - [ ] Render 3 feature cards in grid (3 columns)
   - [ ] Add navigation to `/deterministic`, `/whatif`, `/montecarlo`

2. **Mobile (React Native)**
   - [ ] Create landing screen component
   - [ ] Use same `LANDING_SCREEN` schema
   - [ ] Render feature cards stacked vertically
   - [ ] Use bottom tab navigator for navigation

### Success Criteria
- ✅ Both platforms use `LANDING_SCREEN` definition
- ✅ Layout differs (web: 3-col, mobile: stacked)
- ✅ Navigation works to all calculators
- ✅ No hardcoded screen definitions in components
- ✅ Help text/descriptions from schema

**Estimated Time:** 1-2 days

---

## 🔴 Phase 2: Deterministic Calculator (HIGH PRIORITY - Week 1-2)

### Features to Build

#### Input Section
- [ ] Age (TextInput) - min 18, max 125
- [ ] Retirement Age (TextInput) - min 50, max 100
- [ ] Current Balance (TextInput) - formatted currency
- [ ] Annual Contribution (Slider) - $0 to $23.5k/$30.5k (age-based)
- [ ] Expected Return (Slider) - 0-15% with color badge
- [ ] Inflation (Slider) - 0-6% with color badge

#### Validation
- [ ] Age < Retirement Age validation
- [ ] Contribution max depends on age (50+ catch-up)
- [ ] Show validation errors inline

#### Results Section
- [ ] Display final balance (Nominal)
- [ ] Display final balance (Real - inflation-adjusted)
- [ ] Green highlighted result card
- [ ] Show year-by-year projection chart

#### Navigation
- [ ] "Calculate" button - runs projection
- [ ] "Reset" button - clears all fields
- [ ] "Open in What-If" button - navigates with data

### Schema References
- `DETERMINISTIC_SCREEN` - Complete structure
- `FIELD_DEFINITIONS['age']`, `['retirementAge']`, etc.
- `CATEGORY_MAPPINGS.expectedReturn` - Color logic
- `CATEGORY_MAPPINGS.inflation` - Color logic

### Implementation Tasks

1. **Mobile Refactor (React Native)**
   - [ ] Update `DeterministicTab.tsx` to import `FIELD_DEFINITIONS`
   - [ ] Remove all hardcoded min/max/step values
   - [ ] Use `validateField()` from schema for validation
   - [ ] Use `getColorForValue()` for slider colors
   - [ ] Remove duplicate validation messages
   - [ ] Test: All sliders work, validation messages correct, colors update

2. **Web Implementation (Next.js/React)**
   - [ ] Create `pages/deterministic.tsx` or `app/deterministic/page.tsx`
   - [ ] Use same `DETERMINISTIC_SCREEN` schema
   - [ ] Create `DeterministicForm.tsx` component
   - [ ] Import and use field definitions from schema
   - [ ] Use same validation and color logic
   - [ ] Responsive layout (2-column on web, 1-column on mobile)
   - [ ] Test: Identical behavior to mobile

### Success Criteria
- ✅ Mobile uses `FIELD_DEFINITIONS` (no hardcoded ranges)
- ✅ Web uses same field definitions
- ✅ Validation identical on both platforms
- ✅ Colors come from `CATEGORY_MAPPINGS`
- ✅ No duplicate code between web and mobile
- ✅ Cross-field validation works
- ✅ Dynamic contribution limit (age-based)
- ✅ Results display consistent

**Estimated Time:** 2-3 days refactor mobile + 2-3 days build web = 4-6 days

---

## 🔴 Phase 3: What-If Scenarios (HIGH PRIORITY - Week 2-3)

### Features to Build

#### Baseline Scenario
- [ ] Age (TextInput)
- [ ] Savings Rate (Slider) - 0-50% of $100k income
- [ ] Expected Return (Slider) - color-coded
- [ ] Inflation (Slider) - color-coded
- [ ] Current Balance (TextInput)

#### Scenario Management
- [ ] Add new scenario button
- [ ] Edit scenario name
- [ ] Delete scenario button
- [ ] Clone scenario button
- [ ] Show difference from baseline ($, %)

#### Persistence
- [ ] Save scenarios to AsyncStorage (mobile) / localStorage (web)
- [ ] Load scenarios on app start
- [ ] Export/import scenarios

#### Layout
- [ ] Web: Sidebar with baseline, main area with scenarios
- [ ] Mobile: Collapsible baseline, scrollable scenario list

### Schema References
- `WHATIF_SCREEN` - Complete structure
- `FIELD_DEFINITIONS['age']`, `['contributionRate']`, `['expectedReturn']`, `['inflation']`, `['currentBalance']`
- `CATEGORY_MAPPINGS.contributionRate` - Color logic
- `CATEGORY_MAPPINGS.expectedReturn` - Color logic
- `CATEGORY_MAPPINGS.inflation` - Color logic

### Implementation Tasks

1. **Mobile Refactor (React Native)**
   - [ ] Refactor `ScenarioCard.tsx` to use `FIELD_DEFINITIONS`
   - [ ] Remove hardcoded slider ranges
   - [ ] Use `getColorForValue()` for dynamic colors
   - [ ] Update `WhatIfScreen.tsx` to manage scenarios
   - [ ] Add scenario add/delete/clone buttons
   - [ ] Add persistence logic
   - [ ] Test: All features work, colors correct, persistence works

2. **Web Implementation (Next.js/React)**
   - [ ] Create `pages/whatif.tsx`
   - [ ] Create `WhatIfForm.tsx` component
   - [ ] Use same `FIELD_DEFINITIONS` from schema
   - [ ] Build scenario card component
   - [ ] Add scenario management UI
   - [ ] Implement persistence (localStorage)
   - [ ] Responsive layout (sidebar on web, drawer/tabs on mobile)
   - [ ] Test: Same functionality as mobile

### Success Criteria
- ✅ Mobile uses field definitions (no hardcoded values)
- ✅ Web uses same field definitions
- ✅ Contribution rate color logic consistent
- ✅ Scenarios persist correctly
- ✅ Add/edit/delete/clone all work
- ✅ Difference display works
- ✅ Responsive on both platforms
- ✅ No duplicate scenario logic

**Estimated Time:** 2-3 days refactor mobile + 3-4 days build web = 5-7 days

---

## 🟡 Phase 4: Monte Carlo Simulator (HIGH PRIORITY - Week 3-4)

### Features to Build

#### Input Section (same as Deterministic)
- [ ] Age, Retirement Age, Current Balance
- [ ] Annual Contribution, Expected Return, Inflation

#### Simulation Controls
- [ ] "Run Simulation" button (10,000 iterations)
- [ ] Progress indicator during simulation
- [ ] Cancel simulation button (if long-running)

#### Results Display
- [ ] Success rate % (retirement plan succeeds)
- [ ] Distribution chart (histogram or line chart)
- [ ] Min/max/average outcome
- [ ] Percentile breakdown (10th, 25th, 50th, 75th, 90th)
- [ ] Comparison with deterministic result

#### Platform-Specific
- [ ] Web: Side-by-side charts
- [ ] Mobile: Stacked charts with scrolling

### Schema References
- `MONTE_CARLO_SCREEN` - Complete structure
- `FIELD_DEFINITIONS['age']`, `['retirementAge']`, etc. - reuses from Deterministic
- Same validation and constraints as Deterministic

### Implementation Tasks

1. **Mobile (React Native)**
   - [ ] Optionally refactor `MonteCarloTab.tsx` to use field definitions
   - [ ] Ensure results display is clear on mobile
   - [ ] Test simulation performance

2. **Web Implementation (Next.js/React)**
   - [ ] Create `pages/montecarlo.tsx`
   - [ ] Create `MonteCarloForm.tsx` component
   - [ ] Use field definitions from schema (same as Deterministic)
   - [ ] Build results visualization
   - [ ] Add chart library (recharts, chart.js, etc.)
   - [ ] Responsive charts

### Success Criteria
- ✅ Web uses same field definitions as mobile
- ✅ Validation identical
- ✅ Results format consistent
- ✅ Charts work on both platforms
- ✅ Performance acceptable (10k simulations)

**Estimated Time:** 1-2 days refactor + 3-4 days build web = 4-6 days

---

## 🟡 Phase 5: Social Security Calculator (MEDIUM PRIORITY - Week 4-5)

### Features to Build

#### Input Section
- [ ] Birth Date or Current Age (TextInput)
- [ ] Filing Status (Picker: Single/Married/Widowed/Divorced)
- [ ] Estimated Annual Income (TextInput)
- [ ] Work Cessation Age (TextInput)

#### Calculations
- [ ] Calculate Primary Insurance Amount (PIA)
- [ ] Bend points calculation
- [ ] Earnings history averaging

#### Results
- [ ] Benefits at age 62 (early claim)
- [ ] Benefits at Full Retirement Age (FRA)
- [ ] Benefits at age 70 (delayed claim)
- [ ] Breakeven analysis (which age is best to claim?)
- [ ] Survivor benefits estimate
- [ ] Spousal benefits (if married)

### New Schema Required
- [ ] Add Social Security field definitions
- [ ] Add validation rules for SS fields
- [ ] Add `SOCIAL_SECURITY_SCREEN` definition
- [ ] Add color mappings for benefit levels

### Implementation Tasks
1. **Define Schema**
   - [ ] Add `ssFields.ts` with field definitions
   - [ ] Add `SOCIAL_SECURITY_SCREEN` to screens.ts
   - [ ] Add validation rules

2. **Web Implementation**
   - [ ] Create Social Security calculator page
   - [ ] Build calculation engine integration
   - [ ] Display results

3. **Mobile Implementation**
   - [ ] Create Social Security tab/screen
   - [ ] Use same schema
   - [ ] Responsive for mobile

### Success Criteria
- ✅ Schema defines all constraints
- ✅ Web and mobile use same field definitions
- ✅ Calculations correct (SSA formulas)
- ✅ Results displayed clearly

**Estimated Time:** 1 day schema + 3-4 days implementation = 4-5 days

---

## 🟢 Phase 6: Medicare Planning (MEDIUM PRIORITY - Week 5-6)

### Features to Build
Similar structure to Social Security:
- [ ] Input: Age, retirement age, income level
- [ ] Calculate: Medicare eligibility, costs, IRMAA
- [ ] Results: Coverage options, estimated costs

**New Schema Required:** Medicare field definitions and screen

**Estimated Time:** Similar to Social Security

---

## 🟢 Phase 7: Profile & Settings (LOW PRIORITY - Week 6+)

### Features
- [ ] Edit personal information
- [ ] Manage saved scenarios
- [ ] Export projections
- [ ] Settings (currency, decimal places)
- [ ] Help & about

**New Schema Required:** Profile field definitions

---

## Implementation Timeline

```
Week 1:  Landing Page (Days 1-2) + Start Deterministic (Days 3-5)
Week 2:  Finish Deterministic + Start What-If (Days 1-3)
Week 3:  Finish What-If (Days 1-3) + Start Monte Carlo (Days 4-5)
Week 4:  Finish Monte Carlo + Start Social Security Schema
Week 5:  Social Security + Medicare Planning Schema
Week 6+: Profile/Settings, Advanced Features
```

---

## Feature Dependencies

```
Landing Page (independent)
    ↓
    Deterministic (independent)
    ↓
    What-If (depends on Deterministic fields)
    ↓
    Monte Carlo (depends on Deterministic)
    ↓
    Social Security (independent)
    ↓
    Medicare (independent)
    ↓
    Profile (depends on all above)
```

---

## For Each Feature: Checklist

- [ ] Schema defined (fields, validation, categories)
- [ ] Mobile implementation using schema
- [ ] Web implementation using schema
- [ ] Validation rules identical on both
- [ ] Colors from central palette
- [ ] Help content centralized
- [ ] No hardcoded values in components
- [ ] Both platforms tested
- [ ] Documentation updated

---

## Questions Before Starting?

1. **Order:** Should we prioritize Social Security/Medicare before completing What-If?
2. **Mobile Tiers:** Are any features restricted to paid tier on mobile?
3. **Export:** What formats should we support for exporting scenarios?
4. **Charts:** Any preference for charting library (Recharts, Chart.js, D3)?
5. **Offline:** Should web version work offline like mobile?

Let me know and we'll start building! 🚀
