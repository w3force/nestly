# UI Schema Implementation - Feature List & Roadmap

## Overview
This document outlines all features/screens that need unified UI schema definitions and the implementation sequence.

---

## Phase 1: Landing Page (IN PROGRESS ✅)

### Landing Page Features
- [ ] Hero section with welcome message
- [ ] Feature cards (Deterministic, What-If, Monte Carlo)
- [ ] Navigation to main calculators
- [ ] Quick stats display (optional)
- [ ] CTA buttons

**Status:** ✅ Schema defined in `LANDING_SCREEN`
**Files:** 
- `packages/shared/src/uiSchema/screens.ts` - Definition complete
- Ready for web and mobile implementation

**Next Step:** Build web and mobile landing pages using shared schema

---

## Phase 2: Deterministic Calculator (READY)

### Input Fields
- [x] Age (TextInput) - Shared in schema
- [x] Retirement Age (TextInput) - Shared in schema
- [x] Current Balance (TextInput) - Shared in schema
- [x] Annual Contribution (Slider) - Shared in schema
- [x] Expected Return (Slider) - Shared in schema
- [x] Inflation (Slider) - Shared in schema

### Features
- [ ] Cross-field validation (age < retirement age)
- [ ] Dynamic contribution limit (23.5k or 30.5k based on age)
- [ ] Calculate button
- [ ] Results display (nominal + real balance)
- [ ] Reset button
- [ ] Navigation to What-If

**Status:** 🔄 Partially implemented on mobile
**Current Implementation:** 
- Mobile: apps/mobile/screens/DeterministicTab.tsx (has all features)
- Web: apps/web/components/... (needs verification)

**Shared Schema Status:** ✅ Complete
- Field definitions: All 6 fields
- Screen definition: Complete validation & structure
- Category mappings: Return (0-15%), Inflation (0-6%)
- Validation rules: All rules defined

**Next Step:** Refactor both to use schema from @projection/shared

---

## Phase 3: What-If Scenarios (READY)

### Input Fields (Per Scenario)
- [x] Age (TextInput)
- [x] Savings Rate (Slider, %) - % of $100k income
- [x] Expected Return (Slider)
- [x] Inflation (Slider)
- [x] Current Savings (TextInput, $)

### Features
- [ ] Baseline scenario (default assumptions)
- [ ] Add new scenario
- [ ] Edit scenario name
- [ ] Delete scenario
- [ ] Clone scenario
- [ ] Compare scenarios side-by-side
- [ ] Show difference from baseline ($, %)
- [ ] Persist scenarios to storage

**Status:** 🔄 Partially implemented on mobile
**Current Implementation:**
- Mobile: apps/mobile/components/ScenarioCard.tsx (scenario UI)
- Mobile: apps/mobile/screens/WhatIfScreen.tsx (main screen)
- Web: apps/web/... (needs verification)

**Shared Schema Status:** ✅ Complete
- Field definitions: All 5 fields (age, contributionRate, expectedReturn, inflation, currentBalance)
- Screen definition: Complete
- Category mappings: Contribution Rate, Return, Inflation
- Validation rules: All defined

**Next Step:** Refactor ScenarioCard to use field definitions

---

## Phase 4: Monte Carlo Simulator (READY)

### Input Fields
- [x] Age
- [x] Retirement Age
- [x] Current Balance
- [x] Annual Contribution
- [x] Expected Return
- [x] Inflation

### Features
- [ ] Simulation parameters (number of runs = 10,000 fixed)
- [ ] Run simulation button
- [ ] Progress indicator
- [ ] Results display:
  - Success rate %
  - Distribution chart
  - Min/max/average outcome
  - Percentile breakdown (10th, 25th, 50th, 75th, 90th)
- [ ] Export results
- [ ] Compare with deterministic

**Status:** 🟡 Partially implemented
**Current Implementation:**
- Mobile: apps/mobile/screens/MonteCarloTab.tsx
- Web: apps/web/... (needs verification)

**Shared Schema Status:** ✅ Complete
- Field definitions: All 6 fields (reuses from Deterministic)
- Screen definition: Complete
- Validation rules: Shared from Deterministic

**Next Step:** Refactor to use shared field definitions

---

## Phase 5: Social Security Calculator (NOT STARTED)

### Input Fields
- [ ] Birth date or age
- [ ] Filing status
- [ ] Estimated earnings history
- [ ] Work cessation date

### Features
- [ ] Calculate Primary Insurance Amount (PIA)
- [ ] Show benefits at different ages (62, FRA, 70)
- [ ] Survivor benefits
- [ ] Spousal benefits
- [ ] Government Pension Offset info

**Status:** ❌ Not yet in schema
**Priority:** Medium
**Next Step:** Define fields and screen

---

## Phase 6: Medicare Planning (NOT STARTED)

### Input Fields
- [ ] Age
- [ ] Retirement age
- [ ] Income level
- [ ] Health status indicators

### Features
- [ ] Medicare eligibility age
- [ ] Coverage types (A, B, D, Advantage)
- [ ] Estimated costs
- [ ] IRMAA (Income-Related Monthly Adjustment Amount) calculator
- [ ] Drug plan selection

**Status:** ❌ Not yet in schema
**Priority:** Medium
**Next Step:** Define fields and screen

---

## Phase 7: Profile & Settings (NOT STARTED)

### Features
- [ ] Edit personal information (name, age, etc.)
- [ ] Manage scenarios
- [ ] Export projections
- [ ] Settings (currency, decimal places, etc.)
- [ ] About & help

**Status:** ❌ Not yet in schema
**Priority:** Low
**Next Step:** Define fields and screen

---

## Phase 8: Plans Comparison (NOT STARTED)

### Input Fields
- [ ] Plan A parameters
- [ ] Plan B parameters

### Features
- [ ] Side-by-side comparison
- [ ] Difference highlighting
- [ ] Recommendation engine

**Status:** ❌ Not yet in schema
**Priority:** Low
**Next Step:** Define fields and screen

---

## Summary Table

| Phase | Feature | Fields | Schema | Mobile | Web | Priority |
|-------|---------|--------|--------|--------|-----|----------|
| 1 | Landing | - | ✅ | ❌ | ❌ | HIGH |
| 2 | Deterministic | 6 | ✅ | 🟡 | 🟡 | HIGH |
| 3 | What-If | 5 | ✅ | 🟡 | 🟡 | HIGH |
| 4 | Monte Carlo | 6 | ✅ | 🟡 | 🟡 | HIGH |
| 5 | Social Security | 4 | ❌ | ❌ | ❌ | MED |
| 6 | Medicare | 5 | ❌ | ❌ | ❌ | MED |
| 7 | Profile | N/A | ❌ | ❌ | ❌ | LOW |
| 8 | Comparisons | N/A | ❌ | ❌ | ❌ | LOW |

**Legend:**
- ✅ = Complete/Done
- 🟡 = Partial/In Progress
- ❌ = Not Started
- 🔄 = Ready for Migration

---

## Current Implementation Status

### What's Already Done (Mobile)
✅ DeterministicTab.tsx has all features + color-coded sliders  
✅ WhatIfScreen.tsx with ScenarioCard has all features  
✅ MonteCarloTab.tsx has all features  
✅ Help content in HelpIcon modal  
✅ Color-coded feedback (green/orange/red)  
✅ Validation logic  
✅ AsyncStorage persistence  

### What Needs to Happen
1. **Extract shared schema** → DONE ✅
2. **Update mobile to import from schema** → NEXT
3. **Create web landing page** → NEXT
4. **Create web deterministic** → NEXT
5. **Create web what-if** → NEXT
6. **Create web monte carlo** → NEXT
7. **Add Social Security fields** → LATER
8. **Add Medicare fields** → LATER

---

## Implementation Sequence (Recommended)

### Week 1: Infrastructure ✅
- [x] Create uiSchema directory structure
- [x] Define core types and validation
- [x] Define categories and color mappings
- [x] Define input fields for Deterministic/What-If/MC
- [x] Define screen definitions

### Week 2: Landing Page
- [ ] Create web landing page using LANDING_SCREEN schema
- [ ] Create mobile landing page using LANDING_SCREEN schema
- [ ] Test navigation to all calculators

### Week 3: Deterministic Refactor
- [ ] Refactor mobile DeterministicTab to import field definitions
- [ ] Remove duplicate constraints/validation from component
- [ ] Create web Deterministic using same field definitions
- [ ] Ensure identical behavior on both platforms

### Week 4: What-If Refactor
- [ ] Refactor mobile ScenarioCard to use field definitions
- [ ] Refactor mobile WhatIfScreen
- [ ] Create web What-If screen
- [ ] Ensure scenario persistence works identically

### Week 5: Monte Carlo & Testing
- [ ] Refactor mobile MonteCarloTab
- [ ] Create web Monte Carlo
- [ ] Cross-platform testing
- [ ] Performance optimization

### Week 6: Additional Screens
- [ ] Social Security field definitions
- [ ] Medicare field definitions
- [ ] Profile screen
- [ ] Plans comparison

---

## Key Rules for Implementation

### Rule 1: Single Source of Truth
- **Any field constraint defined in schema MUST be used by both platforms**
- Example: `ANNUAL_CONTRIBUTION_FIELD.constraints.max` or `conditionalMax`
- No hardcoded ranges in components

### Rule 2: Validation Consistency
- **All validation must use shared `validateField()` or `validateForm()`**
- Example: Don't repeat "age < retireAge" in two places
- Defined once in `DETERMINISTIC_SCREEN.crossFieldValidation`

### Rule 3: Content Centralization
- **All help text, labels, placeholders defined in schema**
- Consumed via `getFieldContent()` utility
- No copy-paste of field labels

### Rule 4: Category Mappings
- **All color logic defined in `categories.ts`**
- Example: Use `getColorForValue('expectedReturn', 7)` not hardcoded colors
- Ensures consistency across platforms

### Rule 5: Platform-Specific UI Only
- **Platforms can differ in RENDERING, not LOGIC**
- Valid: "Web uses sidebar layout, mobile uses stacked"
- Invalid: "Web validates return as 0-12%, mobile as 0-15%"

---

## Checking Alignment

**To verify platforms stay aligned, check:**

1. **Same field IDs used in schema and components?**
   ```ts
   // ✅ Good: Using schema field ID
   const fieldDef = FIELD_DEFINITIONS['contribution'];
   
   // ❌ Bad: Hardcoding limits
   <Slider max={23500} />
   ```

2. **Validation rules defined once?**
   ```ts
   // ✅ Good: Defined in schema
   validationRules: [createMinRule(18, 'Age')]
   
   // ❌ Bad: Repeated in components
   if (age < 18) setError('Age must be 18+');
   ```

3. **Colors from central palette?**
   ```ts
   // ✅ Good: Using mapping
   color={getColorForValue(RETURN_MAPPING, returnValue)}
   
   // ❌ Bad: Hardcoded
   color={returnValue < 5 ? '#FF6B6B' : '#69B47A'}
   ```

---

## Next Immediate Action

**TODAY:** 
1. Verify all schema files compile without errors
2. Create utility functions to consume schema (hooks for React)
3. Create landing page on web using LANDING_SCREEN schema

**TOMORROW:**
1. Create landing page on mobile
2. Start refactoring DeterministicTab to use FIELD_DEFINITIONS

---

## Questions to Discuss

1. **Social Security & Medicare:** Should these be separate calculators or integrated?
2. **Platform-specific features:** Are there any features web should have that mobile shouldn't?
3. **Mobile tier restrictions:** Should certain fields be hidden for free tier users?
4. **Validation timing:** Should validation be real-time (as user types) or on submit?
5. **Error handling:** Should validation errors appear inline or in a summary?
