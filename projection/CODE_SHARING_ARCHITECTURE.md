6.5 # Code Sharing Architecture: Web ↔️ Mobile

## 🎯 Overview

We achieve **100% business logic sharing** between web and mobile apps through the `@projection/shared` package. This monorepo architecture ensures:

- ✅ **Zero code duplication** for calculations and business logic
- ✅ **Single source of truth** for types, constants, and utilities
- ✅ **Platform-agnostic code** - works on React (web) and React Native (mobile)
- ✅ **Type safety** across both platforms with shared TypeScript interfaces
- ✅ **Consistent calculations** - same results on web and mobile guaranteed

---

## 📦 Shared Package Structure

```
packages/shared/src/
├── calculations/          # ~680 lines - Core business logic
│   ├── ssaMath.ts        # Social Security calculations (330 lines)
│   ├── medicareMath.ts   # Medicare/Medicaid calculations (231 lines)
│   └── compute.ts        # Main computation orchestration (93 lines)
│
├── types/                 # ~100 lines - TypeScript interfaces
│   └── retirement.ts     # All data structures
│
├── config/                # ~150 lines - Constants & data
│   └── retirement.ts     # SSA rules, Medicare brackets, US states
│
├── utils/                 # ~120 lines - Helper functions
│   ├── modeUtils.ts      # Quick ↔️ Detailed mode conversion
│   └── formatters.ts     # Currency, percentage formatting
│
└── index.ts              # Public API exports
```

**Total Shared Code: ~1,050 lines** of platform-agnostic TypeScript

---

## 🔄 What's Shared vs Platform-Specific

### ✅ 100% Shared (Business Logic Layer)

| Category | What's Shared | Files |
|----------|---------------|-------|
| **Types** | All TypeScript interfaces | `QuickModeInputs`, `DetailedModeInputs`, `SSHealthcareResults`, `SSACalculation`, `MedicareCalculation`, `MedicaidEligibility`, `NetBenefit`, `ClaimAgeSweepPoint`, enums (`ClaimAge`, `FilingStatus`, `PlanType`, `InputMode`) |
| **Calculations** | Social Security math | `calculateAIME()`, `calculatePIA()`, `calculateSSA()`, `getFRA()`, wage indexing |
| | Medicare/Medicaid | `calculateMedicare()`, `calculateMedicaid()`, IRMAA brackets, Part A/B/D/Medigap |
| | Main compute | `computeSSHealthcareResults()` - orchestrates all calculations |
| | Claim age sweep | Generates comparison data for ages 62-70 |
| **Config** | SSA constants | FRA tables, bend points, wage index factors, max earnings caps |
| | Medicare data | 2025 Part B premium ($185.00), IRMAA thresholds, Part D/Medigap averages |
| | US States | All 50 states + DC + territories (Record<string, string>) |
| **Utils** | Mode conversion | `quickToDetailed()`, `getDefaultQuickInputs()`, `getDefaultDetailedInputs()` |
| | Formatters | `formatCurrency()`, `formatPercent()` |

### 🎨 Platform-Specific (UI Layer Only)

| Platform | UI Framework | Components | Lines of Code |
|----------|-------------|------------|---------------|
| **Web** | Next.js + MUI | QuickForm, DetailedForm, SSResultsPanel, NetByClaimAgeChart, SSHealthcareTab | ~1,200 lines |
| **Mobile** | React Native + Paper | QuickForm, DetailedForm, SSResultsPanel, NetByClaimAgeChart, SSHealthcareTab | ~1,210 lines |

**Note:** UI components have similar structure but use different component libraries:
- **Web**: Material-UI (`TextField`, `Select`, `Card`, `Typography`, ECharts)
- **Mobile**: React Native Paper (`TextInput`, `List.Accordion`, `Card`, `Text`, Victory Native)

---

## 📊 Code Sharing Metrics

### By Feature: SS & Healthcare Calculator

| Layer | Shared Code | Web-Specific | Mobile-Specific | Sharing % |
|-------|-------------|--------------|-----------------|-----------|
| **Business Logic** | 1,050 lines | 0 lines | 0 lines | **100%** |
| **Types/Interfaces** | 100 lines | 0 lines | 0 lines | **100%** |
| **Constants/Config** | 150 lines | 0 lines | 0 lines | **100%** |
| **UI Components** | 0 lines | ~1,200 lines | ~1,210 lines | **0%** |
| **Total** | 1,200 lines | 1,200 lines | 1,210 lines | **~33%** |

**Effective Sharing**: We share 100% of the code that matters most (business logic), while keeping UI flexible for platform best practices.

### Calculation Examples (Both Platforms Use Same Code)

```typescript
// 🌐 WEB: apps/web/features/retirement/ss-healthcare/SSHealthcareTab.tsx
import { computeSSHealthcareResults } from '@projection/shared';

const handleCompute = () => {
  const results = computeSSHealthcareResults(inputs);
  setResults(results);
};
```

```typescript
// 📱 MOBILE: apps/mobile/features/retirement/ss-healthcare/SSHealthcareTab.tsx
import { computeSSHealthcareResults } from '@projection/shared';

const handleCompute = () => {
  const results = computeSSHealthcareResults(inputs);
  setResults(results);
};
```

**Identical function calls → Guaranteed identical results** ✅

---

## 🔧 Technical Implementation

### 1. Monorepo Setup (pnpm workspaces)

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 2. Package Dependencies

**Web (`apps/web/package.json`):**
```json
{
  "dependencies": {
    "@projection/shared": "workspace:*",
    "next": "^15.1.5",
    "@mui/material": "^6.3.1"
  }
}
```

**Mobile (`apps/mobile/package.json`):**
```json
{
  "dependencies": {
    "@projection/shared": "workspace:*",
    "react-native": "~0.81.4",
    "react-native-paper": "^5.14.5"
  }
}
```

### 3. Metro Config (Mobile Bundler)

```javascript
// apps/mobile/metro.config.js
config.resolver.alias = {
  '@projection/shared': path.resolve(workspaceRoot, 'packages/shared/src'),
};
```

This tells Metro where to find the shared package in the monorepo.

### 4. TypeScript Config

**Shared package (`packages/shared/tsconfig.json`):**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

**Web tsconfig:**
```json
{
  "compilerOptions": {
    "paths": {
      "@projection/shared": ["../../packages/shared/src"]
    }
  }
}
```

---

## 🎯 Benefits of This Architecture

### 1. **Single Source of Truth**
- Fix a bug once → Fixed on both platforms
- Update SSA rules once → Both platforms updated
- Add new feature → Business logic shared automatically

### 2. **Type Safety Across Platforms**
```typescript
// Shared type guarantees web and mobile have same data structure
interface SSHealthcareResults {
  ssa: SSACalculation;
  medicare: MedicareCalculation;
  medicaid: MedicaidEligibility;
  net: NetBenefit;
  sweep: ClaimAgeSweepPoint[];
}
```

### 3. **Testability**
- Test business logic once in `@projection/shared`
- Unit tests run independently of UI framework
- Mock-free testing (pure functions)

### 4. **Maintainability**
- Clear separation of concerns (business logic vs UI)
- Easy to refactor without breaking both platforms
- New developers understand what's shared vs platform-specific

### 5. **Consistency**
- Identical calculations guarantee same results
- Same constants (2025 Medicare premiums, IRMAA thresholds)
- Same validation rules

---

## 📝 Real-World Example: Quick Mode

### Shared Code (One Implementation)

```typescript
// packages/shared/src/types/retirement.ts
export interface QuickModeInputs {
  birthYear: number;
  claimAge: ClaimAge;
  incomeToday: number;
  yearsWorked: number;
  stateCode: string;
}

// packages/shared/src/calculations/compute.ts
export function computeSSHealthcareResults(
  inputs: QuickModeInputs | DetailedModeInputs
): SSHealthcareResults {
  // 680 lines of calculation logic...
  const ssa = calculateSSA(inputs);
  const medicare = calculateMedicare(inputs);
  const medicaid = calculateMedicaid(inputs);
  const net = calculateNet(ssa, medicare, medicaid);
  const sweep = generateClaimAgeSweep(inputs);
  
  return { ssa, medicare, medicaid, net, sweep };
}
```

### Web Implementation (UI Only)

```typescript
// apps/web/features/retirement/ss-healthcare/QuickForm.tsx
import { QuickModeInputs, getFRA, US_STATES } from '@projection/shared';

// Material-UI components
<TextField label="Birth Year" />
<Select label="Claim Age" />
<TextField label="Annual Income" />
```

**Lines of code: ~80 lines** (just UI rendering)

### Mobile Implementation (UI Only)

```typescript
// apps/mobile/features/retirement/ss-healthcare/QuickForm.tsx
import { QuickModeInputs, getFRA, US_STATES } from '@projection/shared';

// React Native Paper components
<TextInput label="Birth Year" />
<Picker label="Claim Age" />
<TextInput label="Annual Income" />
```

**Lines of code: ~170 lines** (more verbose due to mobile styling)

### Result
- **Shared**: 1 implementation of business logic (680 lines)
- **Web**: UI only (80 lines)
- **Mobile**: UI only (170 lines)
- **Total savings**: ~510 lines not duplicated + guaranteed consistency

---

## 🚀 Future Shared Features

As we continue building mobile parity, these will also be 100% shared:

1. **Monte Carlo Simulations** (`packages/shared/src/calculations/monteCarlo.ts`)
   - Portfolio projections
   - Success rate calculations
   - Historical data analysis

2. **What-If Scenarios** (`packages/shared/src/calculations/whatIf.ts`)
   - Scenario comparison logic
   - Delta calculations
   - Ranking algorithms

3. **Help Content** (`packages/shared/src/content/help.ts`)
   - Help text definitions
   - Tooltip content
   - Educational content

4. **User Settings** (`packages/shared/src/types/user.ts`)
   - Tier system rules
   - Feature flags
   - Preferences

---

## 🎓 Key Takeaways

1. **We share 100% of business logic** - Every calculation, type, and constant lives in `@projection/shared`

2. **Platform-agnostic design** - Shared code has zero dependencies on UI frameworks

3. **Monorepo + pnpm workspaces** - Enables seamless package sharing with `workspace:*` protocol

4. **Type-safe imports** - TypeScript ensures both platforms use shared APIs correctly

5. **Best of both worlds** - Shared logic + platform-optimized UI = maximum efficiency

6. **Proven architecture** - SS & Healthcare calculator successfully implemented with this pattern

---

## 📚 Files Using Shared Package

### Web (5 components)
- `apps/web/features/retirement/ss-healthcare/QuickForm.tsx`
- `apps/web/features/retirement/ss-healthcare/DetailedForm.tsx`
- `apps/web/features/retirement/ss-healthcare/SSResultsPanel.tsx`
- `apps/web/features/retirement/ss-healthcare/NetByClaimAgeChart.tsx`
- `apps/web/features/retirement/ss-healthcare/SSHealthcareTab.tsx`

### Mobile (5 components)
- `apps/mobile/features/retirement/ss-healthcare/QuickForm.tsx`
- `apps/mobile/features/retirement/ss-healthcare/DetailedForm.tsx`
- `apps/mobile/features/retirement/ss-healthcare/SSResultsPanel.tsx`
- `apps/mobile/features/retirement/ss-healthcare/NetByClaimAgeChart.tsx`
- `apps/mobile/features/retirement/ss-healthcare/SSHealthcareTab.tsx`

**10 components → 1 shared package → 0 duplicated business logic** ✅

---

*Last Updated: Phase 3.2 Complete (SS & Healthcare Detailed Mode)*
