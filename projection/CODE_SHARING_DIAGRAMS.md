# Code Sharing Visual Architecture

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MONOREPO ROOT                                │
│                    (pnpm workspace)                                  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │   apps/web   │  │ apps/mobile  │  │  packages/   │
        │              │  │              │  │   shared     │
        │  Next.js +   │  │ React Native │  │              │
        │     MUI      │  │  +  Paper    │  │  Platform-   │
        │              │  │              │  │  Agnostic    │
        └──────────────┘  └──────────────┘  └──────────────┘
                │                │                │
                │  workspace:*   │   workspace:*  │
                └────────────────┴────────────────┘
                                 │
                         imports from
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │  @projection/shared     │
                    │                         │
                    │  ✓ Types                │
                    │  ✓ Calculations         │
                    │  ✓ Config               │
                    │  ✓ Utils                │
                    │                         │
                    │  ~1,050 lines           │
                    │  100% shared            │
                    └─────────────────────────┘
```

---

## 🎯 Data Flow: SS & Healthcare Calculator

```
┌──────────────────────────────────────────────────────────────────────┐
│                            USER INPUT                                 │
│              (Birth Year, Claim Age, Income, etc.)                   │
└──────────────────────────────────────────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │  Web Form    │  │ Mobile Form  │  │  Both Use:   │
        │              │  │              │  │              │
        │  Material-UI │  │    Paper     │  │ QuickMode    │
        │  TextField   │  │  TextInput   │  │  Inputs      │
        │  Select      │  │    Picker    │  │              │
        │  Card        │  │    Card      │  │ (from shared)│
        └──────────────┘  └──────────────┘  └──────────────┘
                │                │
                │   onChange     │   onChange
                │                │
                ▼                ▼
        ┌──────────────────────────────────────┐
        │    setState(inputs)                  │
        │                                      │
        │  inputs: QuickModeInputs             │
        │  {                                   │
        │    birthYear: 1965,                  │
        │    claimAge: 67,                     │
        │    incomeToday: 75000,               │
        │    yearsWorked: 30,                  │
        │    stateCode: "CA"                   │
        │  }                                   │
        └──────────────────────────────────────┘
                                 │
                    User clicks "Compute"
                                 │
                                 ▼
        ┌────────────────────────────────────────────────┐
        │  computeSSHealthcareResults(inputs)            │
        │  ↑ FROM @projection/shared                     │
        │                                                │
        │  1. calculateSSA(inputs)                       │
        │     - Calculate AIME from income & years       │
        │     - Calculate PIA from AIME                  │
        │     - Apply age adjustment (67 = FRA)          │
        │     → monthlyAtClaimAge: $2,450                │
        │                                                │
        │  2. calculateMedicare(inputs)                  │
        │     - Base Part B: $185.00                     │
        │     - Check IRMAA (income < $103k)             │
        │     - Part D: $50.00                           │
        │     - Medigap: $150.00                         │
        │     → totalMonthly: $385.00                    │
        │                                                │
        │  3. calculateMedicaid(inputs, stateCode)       │
        │     - Check state eligibility                  │
        │     - Check income limits                      │
        │     → eligible: false                          │
        │                                                │
        │  4. calculateNet()                             │
        │     - SS Monthly: $2,450                       │
        │     - Medicare: -$385                          │
        │     → netMonthly: $2,065                       │
        │                                                │
        │  5. generateClaimAgeSweep()                    │
        │     - Loop ages 62-70                          │
        │     - Compute for each age                     │
        │     → sweep: ClaimAgeSweepPoint[]              │
        └────────────────────────────────────────────────┘
                                 │
                          Returns results
                                 │
                                 ▼
        ┌────────────────────────────────────────────────┐
        │    SSHealthcareResults                         │
        │    {                                           │
        │      ssa: {                                    │
        │        aime: 6250,                             │
        │        pia: 2450,                              │
        │        monthlyAtClaimAge: 2450,                │
        │        reductionOrCredit: 0%                   │
        │      },                                        │
        │      medicare: {                               │
        │        partBTotal: 185,                        │
        │        partDTotal: 50,                         │
        │        medigapPremium: 150,                    │
        │        totalMonthly: 385                       │
        │      },                                        │
        │      medicaid: { eligible: false },            │
        │      net: {                                    │
        │        ssMonthly: 2450,                        │
        │        medicarePremiums: 385,                  │
        │        netMonthly: 2065                        │
        │      },                                        │
        │      sweep: [                                  │
        │        { age: 62, ssMonthly: 1715, ... },      │
        │        { age: 67, ssMonthly: 2450, ... },      │
        │        { age: 70, ssMonthly: 3038, ... }       │
        │      ]                                         │
        │    }                                           │
        └────────────────────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │  Web Display │  │Mobile Display│  │  Both Use:   │
        │              │  │              │  │              │
        │  MUI Cards   │  │ Paper Cards  │  │ SSHealthcare │
        │  Typography  │  │    Text      │  │   Results    │
        │  ECharts     │  │   Victory    │  │              │
        │              │  │    Native    │  │ (from shared)│
        └──────────────┘  └──────────────┘  └──────────────┘
                │                │
                ▼                ▼
        ┌─────────────────────────────────────────────┐
        │           USER SEES RESULTS                  │
        │                                              │
        │  Net Monthly: $2,065                         │
        │  Social Security: $2,450                     │
        │  Medicare: -$385                             │
        │  Chart: Optimal claim age visualization      │
        └─────────────────────────────────────────────┘
```

---

## 🔄 Mode Conversion Flow

```
┌──────────────────────────────────────────────────────────────┐
│              Quick Mode (5 questions)                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  QuickModeInputs {                                     │  │
│  │    birthYear: 1965                                     │  │
│  │    claimAge: 67                                        │  │
│  │    incomeToday: 75000                                  │  │
│  │    yearsWorked: 30                                     │  │
│  │    stateCode: "CA"                                     │  │
│  │  }                                                     │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                                 │
                    User switches to Detailed
                                 │
                                 ▼
        ┌────────────────────────────────────────┐
        │  quickToDetailed(quickInputs)          │
        │  ↑ FROM @projection/shared             │
        │                                        │
        │  - Preserves: birthYear, claimAge      │
        │  - Maps: incomeToday → magi            │
        │  - Generates: 35-year earnings history │
        │  - Fills: default Medicare choices     │
        │  - Sets: filingStatus = "SINGLE"       │
        └────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────┐
│             Detailed Mode (15+ fields)                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  DetailedModeInputs {                                  │  │
│  │    birthYear: 1965                                     │  │
│  │    claimAge: 67                                        │  │
│  │    filingStatus: "SINGLE"                              │  │
│  │    magi: 75000                                         │  │
│  │    stateCode: "CA"                                     │  │
│  │    useAIME: false                                      │  │
│  │    earningsHistory: [                                  │  │
│  │      { year: 1990, amount: 30000 },                   │  │
│  │      { year: 1991, amount: 32000 },                   │  │
│  │      ... (35 years)                                    │  │
│  │    ],                                                  │  │
│  │    planType: "ORIGINAL"                                │  │
│  │    hasPartACoverage: true                              │  │
│  │    partDPremiumOverride: undefined                     │  │
│  │    medigapPremiumOverride: undefined                   │  │
│  │    employerHealthcareOffset: 0                         │  │
│  │  }                                                     │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 📦 Package Import Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Web Component (QuickForm.tsx)                              │
│  ─────────────────────────────────────────────────────────  │
│  import {                                                   │
│    QuickModeInputs,  ←──────┐                              │
│    ClaimAge,         ←──────┤                              │
│    getFRA,           ←──────┤  From @projection/shared     │
│    US_STATES         ←──────┤                              │
│  } from '@projection/shared'; │                            │
└─────────────────────────────────────────────────────────────┘
                               │
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  @projection/shared (index.ts)                              │
│  ─────────────────────────────────────────────────────────  │
│  export * from './types/retirement';                        │
│  export * from './calculations/ssaMath';                    │
│  export * from './config/retirement';                       │
│  export * from './utils/formatters';                        │
│  export * from './utils/modeUtils';                         │
└─────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│ types/       │    │ calculations/    │    │ config/      │
│ retirement   │    │ ssaMath          │    │ retirement   │
│              │    │ medicareMath     │    │              │
│ Interfaces   │    │ compute          │    │ Constants    │
│ Enums        │    │                  │    │ Data         │
│ Types        │    │ Functions        │    │ Mappings     │
└──────────────┘    └──────────────────┘    └──────────────┘
```

---

## 🎨 UI Layer Comparison

```
┌─────────────────────────────────────────────────────────────┐
│                        SAME INPUT                            │
│              inputs: QuickModeInputs                         │
└─────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│      WEB (MUI)           │    │   MOBILE (Paper)         │
├──────────────────────────┤    ├──────────────────────────┤
│ <TextField               │    │ <TextInput               │
│   label="Birth Year"     │    │   label="Birth Year"     │
│   value={birthYear}      │    │   value={birthYear}      │
│   onChange={...}         │    │   onChangeText={...}     │
│   type="number"          │    │   keyboardType="numeric" │
│ />                       │    │   mode="outlined"        │
│                          │    │ />                       │
│ <Select                  │    │                          │
│   label="Claim Age"      │    │ <Picker                  │
│   value={claimAge}       │    │   selectedValue={...}    │
│   onChange={...}         │    │   onValueChange={...}    │
│ >                        │    │ >                        │
│   <MenuItem value={62}>  │    │   <Picker.Item           │
│     Age 62               │    │     label="Age 62"       │
│   </MenuItem>            │    │     value={62}           │
│ </Select>                │    │   />                     │
│                          │    │ </Picker>                │
│ <Card>                   │    │                          │
│   <CardContent>          │    │ <Card>                   │
│     Results...           │    │   <Card.Content>         │
│   </CardContent>         │    │     Results...           │
│ </Card>                  │    │   </Card.Content>        │
│                          │    │ </Card>                  │
│ // Chart                 │    │                          │
│ <ReactECharts            │    │ // Chart                 │
│   option={chartOptions}  │    │ <VictoryChart>           │
│ />                       │    │   <VictoryLine />        │
│                          │    │ </VictoryChart>          │
└──────────────────────────┘    └──────────────────────────┘
                │                             │
                └──────────────┬──────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    SAME COMPUTATION                          │
│         computeSSHealthcareResults(inputs)                   │
│                                                              │
│                    SAME RESULTS                              │
│           results: SSHealthcareResults                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing Strategy

```
┌─────────────────────────────────────────────────────────────┐
│            Test @projection/shared (Once)                    │
│                                                              │
│  ✓ Unit tests for all calculations                          │
│  ✓ Type checking (tsc --noEmit)                             │
│  ✓ Edge cases (max earnings, IRMAA thresholds)              │
│  ✓ Constants validation                                     │
│                                                              │
│  Result: Business logic guaranteed correct                   │
└─────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│   Test Web UI (Minimal)  │    │ Test Mobile UI (Minimal) │
│                          │    │                          │
│  ✓ Form renders          │    │  ✓ Form renders          │
│  ✓ Inputs update         │    │  ✓ Inputs update         │
│  ✓ Compute triggers      │    │  ✓ Compute triggers      │
│  ✓ Results display       │    │  ✓ Results display       │
│  ✓ Chart renders         │    │  ✓ Chart renders         │
│                          │    │                          │
│  NO calculation testing  │    │  NO calculation testing  │
│  (already covered)       │    │  (already covered)       │
└──────────────────────────┘    └──────────────────────────┘
```

---

*Architecture established in Phase 1, proven in Phases 3.1-3.2*
