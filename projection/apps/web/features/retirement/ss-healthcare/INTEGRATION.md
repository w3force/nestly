# SS & Healthcare Tab - Integration Guide

## ✅ Completed (70% of feature)

### Core Files Created
1. **types.ts** - TypeScript interfaces (86 lines)
2. **config.ts** - SSA/CMS constants with US states dropdown (210+ lines)
3. **ssaMath.ts** - Social Security calculations (290 lines)
4. **medicareMath.ts** - Medicare/Medicaid calculations (180 lines)
5. **compute.ts** - Results computation helper (59 lines)
6. **SSInputsForm.tsx** - Input form component with MUI/help tooltips (380 lines)
7. **SSResultsPanel.tsx** - Results display cards (330 lines)
8. **NetByClaimAgeChart.tsx** - ECharts line chart (165 lines)
9. **SSHealthcareTab.tsx** - Main tab component (165 lines)
10. **index.ts** - Clean exports (18 lines)
11. **README.md** - Comprehensive documentation

**Total: ~1,900 lines of production code**

### Features Implemented
- ✅ AIME calculation with wage indexing
- ✅ PIA calculation with bend points formula
- ✅ Claim-age adjustments (early reduction/delayed credits)
- ✅ Medicare premium calculations (Original vs Advantage)
- ✅ IRMAA surcharges (6 tiers by filing status)
- ✅ Medicaid eligibility check (dual eligible support)
- ✅ Net benefit calculation
- ✅ Claim age sweep chart (62-70)
- ✅ Premium overrides (Part D, Medigap, Advantage)
- ✅ Employer/HSA offset
- ✅ Help tooltips on all inputs
- ✅ Copy summary to clipboard
- ✅ Form validation
- ✅ Loading states

## ⏳ Remaining Work (30%)

### 1. State Management Integration (1-2 hours)
**File to edit:** `/packages/core/src/store.ts`

Add to Zustand store:
```typescript
interface RetirementState {
  // ... existing deterministic/MC state
  ssnAndHealthcare: {
    inputs: SSHealthcareInputs | null;
    results: SSHealthcareResults | null;
    useInModel: boolean; // Integration toggle
  };
  setSSNHealthcare: (data: { inputs: SSHealthcareInputs; results: SSHealthcareResults }) => void;
  setUseInModel: (use: boolean) => void;
  // Selector: compute net monthly for other calculators
  getSSNNetMonthly: () => number | null;
}
```

**Steps:**
1. Open `/packages/core/src/store.ts`
2. Add `ssnAndHealthcare` state slice
3. Add setter actions
4. Add selector for net monthly benefit
5. Persist to localStorage (optional)

### 2. Calculator Routing (30 min)
**File to edit:** `/app/calculator/page.tsx`

**Steps:**
1. Import `SSHealthcareTab` component
2. Add tab to `<Tabs>` component (after "Monte Carlo" tab):
   ```tsx
   <Tab label="SS & Healthcare" />
   ```
3. Add conditional render in tab panel:
   ```tsx
   {tab === 2 && <SSHealthcareTab />}
   ```
4. Update tab index state handling

### 3. Testing (2-3 hours)

#### Unit Tests - ssaMath.spec.ts
```typescript
describe('calculateAIME', () => {
  it('should index earnings and select top 35 years', () => { ... });
  it('should handle fewer than 35 years with zeros', () => { ... });
});

describe('calculatePIA', () => {
  it('should apply bend points correctly for 2025', () => { ... });
});

describe('calculateClaimAgeAdjustment', () => {
  it('should reduce benefits for early claim (age 62)', () => { ... });
  it('should add delayed credits for late claim (age 70)', () => { ... });
});
```

#### Unit Tests - medicareMath.spec.ts
```typescript
describe('calculateMedicarePremiums', () => {
  it('should calculate Original Medicare with IRMAA', () => { ... });
  it('should calculate Medicare Advantage', () => { ... });
});

describe('checkMedicaidEligibility', () => {
  it('should detect eligibility for low income', () => { ... });
  it('should respect state thresholds', () => { ... });
});
```

#### Integration Test - integration.spec.tsx
```typescript
describe('SSHealthcareTab', () => {
  it('should compute results when form is filled', () => { ... });
  it('should show chart with 9 sweep points', () => { ... });
  it('should handle dual eligible scenario', () => { ... });
});
```

## 🚀 Quick Start (After Integration)

1. **Navigate to Calculator page**
2. **Click "SS & Healthcare" tab**
3. **Fill in birth year, claim age, and AIME (or earnings history)**
4. **Enter MAGI, state, and Medicare plan type**
5. **Click "Compute"**
6. **Review:**
   - Social Security estimate
   - Medicare premiums breakdown
   - Net monthly benefit
   - Claim age comparison chart
7. **Optional:** Toggle "Use in Retirement Model" to integrate with Deterministic/MC

## 📦 Files Created

```
features/retirement/ss-healthcare/
├── types.ts                  ✅ 86 lines
├── config.ts                 ✅ 210 lines (includes US_STATES)
├── ssaMath.ts                ✅ 290 lines
├── medicareMath.ts           ✅ 180 lines
├── compute.ts                ✅ 59 lines
├── SSInputsForm.tsx          ✅ 380 lines
├── SSResultsPanel.tsx        ✅ 330 lines
├── NetByClaimAgeChart.tsx    ✅ 165 lines
├── SSHealthcareTab.tsx       ✅ 165 lines
├── index.ts                  ✅ 18 lines
├── README.md                 ✅ Full documentation
└── __tests__/
    ├── ssaMath.spec.ts       ⏳ To be created
    ├── medicareMath.spec.ts  ⏳ To be created
    └── integration.spec.tsx  ⏳ To be created
```

## 🔧 Configuration Maintenance

### Annual Updates Required (November-December)

**File:** `config.ts`

1. **Social Security (from SSA.gov)**
   - `BEND_POINTS` - Add new year when announced
   - `WAGE_INDEX_FACTORS` - Add latest year
   - `SS_WAGE_BASE` - Update maximum taxable earnings

2. **Medicare (from CMS/Medicare.gov)**
   - `PART_B_BASE_2025` → Update to `PART_B_BASE_2026`
   - `PART_D_BASE_2025` → Update accordingly
   - `IRMAA_BRACKETS_2025` → Update to `IRMAA_BRACKETS_2026` with new thresholds/surcharges

3. **Medicaid (less frequent)**
   - `MEDICAID_INCOME_THRESHOLDS` - Update if state policies change

**TODO markers in code:**
```typescript
// TODO: update annually
```

## 🎯 Next Steps

1. **Integrate with Zustand store** (see section 1 above)
2. **Add tab to Calculator page** (see section 2 above)
3. **Write tests** (see section 3 above)
4. **Test end-to-end** (fill form, compute, verify results)
5. **Deploy** (merge to main after testing)

## 💡 Future Enhancements

- [ ] Spousal benefits calculation
- [ ] Widow/widower benefits
- [ ] Detailed asset input for Medicaid
- [ ] Historical earnings import from SSA (file upload)
- [ ] Sensitivity analysis (COLA variations)
- [ ] Monte Carlo integration (probabilistic premiums)

---

**Status:** Feature is **70% complete** and ready for integration testing. UI components are fully functional in isolation. Remaining work is wiring to existing Nestly infrastructure (state management, routing, tests).
