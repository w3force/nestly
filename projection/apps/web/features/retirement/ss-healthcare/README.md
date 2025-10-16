# Social Security & Healthcare Calculator

## 📋 Overview

This feature adds a **"SS & Healthcare" tab** to the Nestly Calculator that estimates Social Security benefits and nets out Medicare/Medicaid costs.

## 🏗️ Architecture

### Core Files

- **`types.ts`** - TypeScript interfaces and types
- **`config.ts`** - SSA/CMS constants (bend points, FRA, IRMAA, etc.)
- **`ssaMath.ts`** - Social Security calculations (AIME, PIA, claim-age adjustments)
- **`medicareMath.ts`** - Medicare premiums, IRMAA, Medicaid eligibility
- **`SSHealthcareTab.tsx`** - Main tab component (TO BE CREATED)
- **`SSInputsForm.tsx`** - Input form component (TO BE CREATED)
- **`SSResultsPanel.tsx`** - Results display component (TO BE CREATED)
- **`NetByClaimAgeChart.tsx`** - ECharts sweep chart (TO BE CREATED)

### Directory Structure

```
features/retirement/ss-healthcare/
├── types.ts                 ✅ Complete
├── config.ts                ✅ Complete
├── ssaMath.ts               ✅ Complete
├── medicareMath.ts          ✅ Complete
├── SSHealthcareTab.tsx      ⏳ To be created
├── SSInputsForm.tsx         ⏳ To be created
├── SSResultsPanel.tsx       ⏳ To be created
├── NetByClaimAgeChart.tsx   ⏳ To be created
├── README.md                ✅ This file
└── __tests__/
    ├── ssaMath.spec.ts      ⏳ To be created
    ├── medicareMath.spec.ts ⏳ To be created
    └── integration.spec.tsx ⏳ To be created
```

## 🧮 Calculations Implemented

### Social Security (SSA)

#### AIME (Average Indexed Monthly Earnings)
1. **Index earnings** to wage levels 2 years before age 62
2. **Select top 35 years** (pad with zeros if <35 years)
3. **Average and divide by 420 months**

```typescript
calculateAIME(earnings: EarningsRecord[], birthYear: number): number
```

#### PIA (Primary Insurance Amount)
Uses SSA bend point formula:
- **90%** of first bend point
- **32%** of amount between first and second bend points  
- **15%** of amount over second bend point

```typescript
calculatePIA(aime: number, birthYear: number): number
```

#### Claim Age Adjustments
- **Early (62-FRA)**: Reduction of 5/9% per month (first 36 months), 5/12% thereafter
- **FRA**: No adjustment (monthly = PIA)
- **Delayed (FRA-70)**: Credit of 8% per year (2/3% per month)

```typescript
calculateClaimAgeAdjustment(pia: number, claimAge: ClaimAge, birthYear: number)
```

### Medicare

#### Premium Calculation
- **Part A**: Usually $0 (with 40 credits), or $505/month
- **Part B**: Base $185/month (2025) + IRMAA surcharges
- **Part D**: ~$50/month + IRMAA surcharges
- **Medigap**: ~$150/month (Original Medicare supplement)
- **Medicare Advantage**: $0-$40/month (replaces B+D+Medigap)

```typescript
calculateMedicarePremiums(inputs: SSHealthcareInputs): MedicareCalculation
```

#### IRMAA (Income-Related Monthly Adjustment Amount)
Based on MAGI and filing status:
- **Single**: $0 surcharge up to $103k MAGI
- **Married**: $0 surcharge up to $206k MAGI
- Surcharges increase in 5 brackets up to $443.90/month

```typescript
getIRMAABracket(magi: number, filingStatus: FilingStatus): IRMAABracket
```

#### Medicaid Eligibility (Dual Eligible)
Simplified check:
- **Income**: Below state threshold (~$1,255-$1,732/month)
- **Assets**: Below $2,000 (single) or $3,000 (married)
- If eligible, **Medicaid covers all Medicare premiums**

```typescript
checkMedicaidEligibility(monthlyIncome: number, stateCode: string): MedicaidEligibility
```

### Net Benefit

```
Net Monthly = SS Monthly Benefit 
            - (Medicare Premiums - Employer/HSA Offset)
            
If Dual Eligible:
Net Monthly = SS Monthly Benefit - $0 (Medicaid covers premiums)
```

## 📊 Configuration Data

### ⚠️ Annual Updates Required

The following config values must be updated annually (typically announced in October/November):

#### Social Security (from SSA.gov)
- **Bend points** (`BEND_POINTS`) - Usually increase with wage growth
- **Wage index factors** (`WAGE_INDEX_FACTORS`) - Add new year
- **SS wage base** (`SS_WAGE_BASE`) - Maximum taxable earnings

#### Medicare (from CMS/Medicare.gov)
- **Part B base premium** (`PART_B_BASE_2025`)
- **Part D typical premium** (`PART_D_BASE_2025`)
- **IRMAA brackets** (`IRMAA_BRACKETS_2025`) - Income thresholds and surcharges
- **Part A premium** for those without 40 credits

#### Medicaid (by state)
- **Income thresholds** (`MEDICAID_INCOME_THRESHOLDS`)
- **Asset limits** (less frequent changes)

### 2025 Values (Current)

```typescript
PART_B_BASE_2025 = $185.00/month
PART_D_BASE_2025 = $50.00/month (typical)
MEDIGAP_DEFAULT = $150.00/month (avg Plan G)

IRMAA Single Brackets:
  $0-$103k: $0 surcharge
  $103k-$129k: +$74 Part B, +$12.90 Part D
  $129k-$161k: +$185 Part B, +$33.30 Part D
  ... (5 more brackets)
```

## 🔧 API Reference

### Main Functions

#### calculateSSA
Complete Social Security calculation from AIME or earnings history.

```typescript
calculateSSA(
  aimeOrEarnings: number | EarningsRecord[],
  birthYear: number,
  claimAge: ClaimAge
): SSACalculation

// Returns:
{
  aime: number;
  pia: number;
  monthlyAtFRA: number;
  monthlyAtClaimAge: number;
  reductionOrCredit: number; // percentage
  fra: number;
}
```

#### calculateMedicarePremiums
Calculate total Medicare premiums with IRMAA.

```typescript
calculateMedicarePremiums(inputs: SSHealthcareInputs): MedicareCalculation

// Returns breakdown of Part A, B, D, Medigap/Advantage + IRMAA
```

#### calculateNetBenefit
Calculate net monthly benefit after Medicare costs.

```typescript
calculateNetBenefit(
  ssMonthly: number,
  medicare: MedicareCalculation,
  medicaid: MedicaidEligibility,
  employerOffset: number
): NetBenefit
```

### Helper Functions

```typescript
// Parse CSV earnings: "year,amount" per line
parseEarningsCSV(csv: string): EarningsRecord[]

// Get bend points for year user turns 62
getBendPoints(year: number): { first: number; second: number }

// Get Full Retirement Age by birth year
getFRA(birthYear: number): number

// Get IRMAA bracket
getIRMAABracket(magi: number, filingStatus: FilingStatus): IRMAABracket

// Get Medicaid threshold
getMedicaidThreshold(stateCode: string): number

// Format premium breakdown for display
formatPremiumBreakdown(medicare: MedicareCalculation, planType: PlanType)
```

## 📝 Example Usage

### Calculate SS benefit

```typescript
import { calculateSSA, parseEarningsCSV } from './ssaMath';

// Using AIME directly
const result1 = calculateSSA(5000, 1960, 67);
// { aime: 5000, pia: 2234.10, monthlyAtFRA: 2234.10, ... }

// Using earnings history
const csv = `
2015,65000
2016,68000
2017,72000
...
`;
const earnings = parseEarningsCSV(csv);
const result2 = calculateSSA(earnings, 1960, 62);
// { monthlyAtClaimAge: 1560.87 (reduced for early claim) }
```

### Calculate Medicare premiums

```typescript
import { calculateMedicarePremiums } from './medicareMath';

const inputs: SSHealthcareInputs = {
  birthYear: 1960,
  claimAge: 67,
  useAIME: true,
  aime: 5000,
  filingStatus: 'SINGLE',
  magi: 120000, // Triggers IRMAA
  stateCode: 'CA',
  planType: 'ORIGINAL',
  hasPartACoverage: true,
  assumptionsYear: 2025,
};

const medicare = calculateMedicarePremiums(inputs);
// {
//   partBTotal: 259.00, // $185 base + $74 IRMAA
//   partDTotal: 62.90,  // $50 base + $12.90 IRMAA
//   medigapPremium: 150.00,
//   totalMonthly: 471.90,
//   irmaApplied: true
// }
```

### Check Medicaid eligibility

```typescript
import { checkMedicaidEligibility } from './medicareMath';

const medicaid = checkMedicaidEligibility(1500, 'CA');
// {
//   eligible: true,
//   reason: "Monthly income $1500 is below CA threshold",
//   adjustedPremiums: 0
// }
```

## 🧪 Testing (To Be Implemented)

### Unit Tests (`ssaMath.spec.ts`)
- ✅ AIME calculation with various earnings histories
- ✅ PIA calculation with known bend points
- ✅ Claim-age adjustments (62, FRA, 70)
- ✅ Earnings CSV parsing

### Unit Tests (`medicareMath.spec.ts`)
- ✅ Premium calculations for Original Medicare vs Advantage
- ✅ IRMAA bracket detection (Single vs Married)
- ✅ Medicaid eligibility by state
- ✅ Net benefit calculation

### Integration Tests
- ✅ Full flow: inputs → SSA calc → Medicare calc → Net benefit
- ✅ Dual eligible scenario (premiums = $0)
- ✅ IRMAA tiers trigger correctly

## 🎨 UI Components (To Be Created)

### SSHealthcareTab
- Main layout with MUI Grid (2 columns: inputs left, results right)
- Disclaimer banner at top
- Compute button to trigger calculations

### SSInputsForm
- Birth year, claim age selectors
- AIME input OR earnings textarea (toggle)
- Filing status, MAGI, state dropdowns
- Plan type radio buttons
- Premium overrides (optional fields)
- Part A coverage checkbox

### SSResultsPanel
- **SS Estimate Card**: PIA @ FRA, monthly @ claim age
- **Medicare Premiums Card**: Breakdown by part + IRMAA
- **Net Monthly Benefit Card**: SS - premiums
- **Dual Eligible Card** (conditional): Shows $0 premiums
- Copy summary button

### NetByClaimAgeChart
- ECharts line chart
- X-axis: Claim age 62-70
- Y-axis: Net monthly benefit
- Highlights selected claim age
- Sweeps all ages using current inputs

## 🔌 Integration

### State Management
Add to Zustand store:

```typescript
interface RetirementState {
  // ... existing deterministic/MC state
  ssnAndHealthcare: {
    inputs: SSHealthcareInputs;
    results?: SSHealthcareResults;
    ssnNetMonthly?: number; // Export for other calculators
  };
}
```

### Routing
- Add tab to Calculator: `/calculator/ss-healthcare`
- Tab index: 2 (after Deterministic and Monte Carlo)

### Integration Toggle
Checkbox: "Use in Retirement Model"
- When enabled, exposes `ssnNetMonthly` to Deterministic/MC tabs
- Can subtract from required savings or add to income

## 📚 Resources

### Official Sources
- **SSA.gov**: Bend points, FRA table, AIME/PIA formulas
- **SSA.gov/OACT/COLA**: Annual COLA and wage base updates
- **Medicare.gov**: Part B/D premiums, IRMAA brackets
- **Medicaid.gov**: State-specific eligibility thresholds

### Update Schedule
- **October/November**: SSA announces next year's COLA, bend points, wage base
- **November**: CMS announces Medicare premiums and IRMAA brackets
- **January 1**: New values take effect

### Formulas
- [SSA PIA Calculation](https://www.ssa.gov/oact/cola/piaformula.html)
- [Early/Delayed Retirement](https://www.ssa.gov/oact/quickcalc/early_late.html)
- [IRMAA](https://www.medicare.gov/your-medicare-costs/part-b-costs)

## ⚡ Performance Notes

- All calculations are pure functions (no side effects)
- AIME/PIA calculated on-demand (not cached)
- Sweep chart computes 9 data points (62-70) - fast enough
- Config objects are static imports (no re-creation)

## 🚧 Known Limitations

1. **Simplified wage indexing**: Uses approximation for years not in config
2. **Asset limits**: Medicaid check uses placeholder (user can't input assets)
3. **State variations**: Medicaid thresholds are simplified baselines
4. **Premium estimates**: Part D and Medigap vary widely by location/plan
5. **Employer coverage**: Simple offset, doesn't model HSA or detailed employer plans

## 🔮 Future Enhancements

- [ ] Allow user to input asset values for Medicaid check
- [ ] Add spousal benefits calculation
- [ ] Model widow/widower benefits
- [ ] Add detailed state-by-state Medicaid rules
- [ ] Historical earnings import from SSA (via file upload)
- [ ] Sensitivity analysis (e.g., "what if COLA is higher?")
- [ ] Integrate with Monte Carlo (probabilistic COLA/IRMAA)

## 📄 License

Part of the Nestly project. See main LICENSE file.

---

**Last Updated**: 2025-10-16  
**Next Required Update**: November 2025 (for 2026 values)
