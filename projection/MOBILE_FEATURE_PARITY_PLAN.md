# Mobile Feature Parity Plan

## Current State Analysis

### Web App Features (6 Pages)
1. **Landing Page** (`/`) - Marketing, value prop, CTA
2. **Start Page** (`/start`) - Onboarding, tier selection
3. **Calculator Page** (`/calculator`) - 3 tabs:
   - Tab 1: Deterministic + Monte Carlo simulation
   - Tab 2: SS & Healthcare (Dual mode: Quick/Detailed)
   - Tab 3: (Future expansion)
4. **What-If Page** (`/what-if`) - Editable scenarios with color-coded sliders
5. **Profile Page** (`/profile`) - User settings, tier badge
6. **Auth Page** (`/auth`) - Sign in/up

### Web App Components
- ✅ BottomNav - 4 tabs navigation
- ✅ FeatureCard - Landing page cards
- ✅ UpgradeBanner - Premium restrictions
- ✅ PlansComparison - Nestly table
- ✅ HelpTooltip - Question mark icons with popovers
- ✅ InfoCard - Colored info boxes
- ✅ DiffPill - Value change indicators
- ✅ Gradient Sliders - Color-coded inputs
- ✅ SS & Healthcare (11 files, dual-mode architecture)

### Mobile App Current State
- ❌ Only has basic calculator.tsx (deterministic + MC stub)
- ❌ No navigation structure
- ❌ No SS & Healthcare feature
- ❌ No What-If scenarios
- ❌ No help system
- ❌ No tier/upgrade system
- ❌ No landing/start pages

## Strategy: Maximum Code Sharing

### Architecture Changes

#### 1. Create Shared Package (`@projection/shared`)
**Purpose**: Platform-agnostic business logic and utilities

**Contents**:
```
packages/shared/
├── src/
│   ├── calculations/
│   │   ├── deterministic.ts      # From web calculator
│   │   ├── monteCarlo.ts         # From web calculator
│   │   ├── ssaMath.ts            # SS calculations (move from web)
│   │   ├── medicareMath.ts       # Medicare calcs (move from web)
│   │   └── index.ts
│   ├── utils/
│   │   ├── modeUtils.ts          # Quick/Detailed conversion
│   │   ├── formatters.ts         # Currency, dates, etc.
│   │   └── validators.ts
│   ├── types/
│   │   ├── retirement.ts         # SS & Healthcare types
│   │   ├── simulation.ts         # MC types
│   │   └── index.ts
│   ├── config/
│   │   ├── constants.ts          # SSA, Medicare constants
│   │   └── tiers.ts              # Free/Pro/Premium features
│   └── index.ts
└── package.json
```

**Benefits**:
- ✅ Single source of truth for all calculations
- ✅ Type safety across web and mobile
- ✅ Easier to test business logic
- ✅ No platform-specific code

#### 2. Create Shared UI Package (`@projection/ui-shared`)
**Purpose**: Platform-agnostic presentational logic

**Contents**:
```
packages/ui-shared/
├── src/
│   ├── hooks/
│   │   ├── useSSHealthcare.ts    # SS state management
│   │   ├── useWhatIf.ts          # Scenario management
│   │   ├── useMonteCarlo.ts      # Simulation state
│   │   └── index.ts
│   ├── contexts/
│   │   ├── TierContext.ts        # Free/Pro/Premium
│   │   └── index.ts
│   └── index.ts
└── package.json
```

#### 3. Platform-Specific UI

**Web**: Continue using MUI (Material-UI)
- Components: Card, Button, TextField, Slider, etc.
- Navigation: Next.js routing + BottomNav
- Charts: recharts

**Mobile**: Use React Native Paper + Expo
- Components: Card, Button, TextInput, Slider (custom or library)
- Navigation: React Navigation (bottom tabs + stack)
- Charts: victory-native (already installed)

### Implementation Plan

## Phase 1: Foundation (Shared Packages)

### Step 1.1: Create @projection/shared Package
- [ ] Create package structure
- [ ] Move SS & Healthcare calculations (ssaMath, medicareMath, compute)
- [ ] Move types (retirement types, simulation types)
- [ ] Move config (SSA constants, Medicare brackets, state codes)
- [ ] Move utilities (modeUtils, formatters)
- [ ] Update web to import from @projection/shared
- [ ] Test web still works

### Step 1.2: Create @projection/ui-shared Package
- [ ] Create hooks for SS & Healthcare (useSSHealthcare)
- [ ] Create hooks for What-If (useWhatIf, useScenarios)
- [ ] Create hooks for Monte Carlo (useMonteCarlo)
- [ ] Create TierContext for Free/Pro/Premium
- [ ] Update web to use shared hooks
- [ ] Test web still works

## Phase 2: Mobile Navigation Structure

### Step 2.1: Install React Navigation
```bash
pnpm --filter mobile add @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
pnpm --filter mobile add react-native-screens react-native-safe-area-context
```

### Step 2.2: Create Screen Structure
```
apps/mobile/
├── screens/
│   ├── LandingScreen.tsx        # Marketing
│   ├── StartScreen.tsx          # Onboarding
│   ├── CalculatorScreen.tsx     # 3 tabs (Det, MC, SS)
│   ├── WhatIfScreen.tsx         # Scenarios
│   ├── ProfileScreen.tsx        # User settings
│   └── AuthScreen.tsx           # Sign in/up
├── navigation/
│   ├── BottomTabNavigator.tsx   # Main 4 tabs
│   └── RootNavigator.tsx        # Stack with auth
└── App.tsx                      # Updated with navigation
```

### Step 2.3: Implement Bottom Tabs
- [ ] Create BottomTabNavigator with 4 tabs (Home, Calculator, What-If, Profile)
- [ ] Add icons using @expo/vector-icons
- [ ] Match web's color scheme (#4ABDAC primary)
- [ ] Test navigation flow

## Phase 3: SS & Healthcare Feature (Mobile)

### Step 3.1: Create Mobile Components
```
apps/mobile/
├── features/
│   └── retirement/
│       ├── SSHealthcareTab.tsx           # Main container
│       ├── QuickForm.tsx                 # 5 questions (Paper TextInput)
│       ├── DetailedForm.tsx              # 15 inputs (Accordion sections)
│       ├── ResultsPanel.tsx              # Results display (Paper Cards)
│       ├── NetByClaimAgeChart.tsx        # Victory chart
│       └── index.ts
```

### Step 3.2: Build QuickForm (Mobile)
- [ ] Use React Native Paper components
- [ ] 5 TextInput fields with labels
- [ ] Picker for state selection
- [ ] Smart Defaults info card
- [ ] FRA calculation display
- [ ] Import from @projection/shared for calculations

### Step 3.3: Build DetailedForm (Mobile)
- [ ] Use Paper Accordion for 4 sections
- [ ] TextInput for all numeric inputs
- [ ] Switch for useAIME toggle
- [ ] Radio buttons for plan type
- [ ] State picker
- [ ] Import from @projection/shared

### Step 3.4: Build ResultsPanel (Mobile)
- [ ] Paper Cards for results sections
- [ ] Format currency using shared formatters
- [ ] Collapsible assumptions (Accordion)
- [ ] "Switch to Detailed" button
- [ ] Share button (copy to clipboard)

### Step 3.5: Build Chart (Mobile)
- [ ] Use VictoryChart (already installed)
- [ ] Net benefit by claim age
- [ ] Touch interactions
- [ ] Responsive sizing

### Step 3.6: Integrate into Calculator Screen
- [ ] Add tab navigation (Det, MC, SS & Healthcare)
- [ ] Use react-native-tab-view or custom tabs
- [ ] Match web's 3-tab layout
- [ ] Test all modes work

## Phase 4: What-If Scenarios (Mobile)

### Step 4.1: Create What-If Screen
```
apps/mobile/
├── screens/
│   └── WhatIfScreen.tsx
├── components/
│   ├── ScenarioCard.tsx          # Editable scenario
│   ├── ColorSlider.tsx           # Gradient slider (custom)
│   └── ComparisonChart.tsx       # Victory comparison
```

### Step 4.2: Build Editable Scenarios
- [ ] Use @projection/ui-shared hooks (useWhatIf)
- [ ] Paper Cards for each scenario
- [ ] TextInput for scenario names
- [ ] Custom gradient sliders (or use @react-native-community/slider)
- [ ] Add/delete scenario buttons

### Step 4.3: Build Color-Coded Sliders
- [ ] Create ColorSlider component
- [ ] Gradient backgrounds (LinearGradient from expo)
- [ ] Return rate: red (low) → yellow → green (high)
- [ ] Inflation: green (low) → yellow → red (high)
- [ ] Match web's color logic

### Step 4.4: Build Comparison Chart
- [ ] VictoryChart with multiple lines
- [ ] Color-coded by scenario
- [ ] Touch interactions
- [ ] Legend

## Phase 5: Monte Carlo (Mobile)

### Step 5.1: Enhance Calculator Screen MC Tab
- [ ] Use @projection/ui-shared hooks (useMonteCarlo)
- [ ] Match web's input form (Paper components)
- [ ] Add "Preview Mode" toggle
- [ ] Sample results for Free tier

### Step 5.2: Build MC Charts (Mobile)
- [ ] Percentile distribution chart (Victory)
- [ ] Probability of success gauge
- [ ] Year-by-year projection
- [ ] Match web's visualizations

## Phase 6: Help System (Mobile)

### Step 6.1: Create HelpTooltip (Mobile)
- [ ] Use React Native Paper Tooltip or Dialog
- [ ] Question mark icon buttons
- [ ] Popup with help text
- [ ] Import help content from shared package

### Step 6.2: Create InfoCard (Mobile)
- [ ] Paper Card with colored border
- [ ] Icon + title + description
- [ ] Match web's design (blue, yellow, green variants)

### Step 6.3: Add Help Icons
- [ ] Calculator inputs
- [ ] What-If sliders
- [ ] SS & Healthcare forms
- [ ] Match web's comprehensive system

## Phase 7: Tier System & Upgrade Flow (Mobile)

### Step 7.1: Implement Tier Context
- [ ] Use @projection/ui-shared TierContext
- [ ] AsyncStorage for tier persistence
- [ ] Free/Pro/Premium badge in Profile

### Step 7.2: Create UpgradeBanner (Mobile)
- [ ] Paper Card with premium messaging
- [ ] "Upgrade" button → external link or in-app purchase
- [ ] Conditional rendering based on tier

### Step 7.3: Create PlansComparison (Mobile)
- [ ] ScrollView + DataTable (Paper)
- [ ] 3 columns (Free, Pro, Premium)
- [ ] Feature checkmarks
- [ ] Pricing
- [ ] CTA buttons

### Step 7.4: Add Restrictions
- [ ] MC: Preview mode only for Free
- [ ] What-If: Max 2 scenarios for Free, 5 for Pro
- [ ] SS & Healthcare: Quick mode only for Free?
- [ ] Match web's tier logic

## Phase 8: Landing & Onboarding (Mobile)

### Step 8.1: Create Landing Screen
- [ ] Hero section with value prop
- [ ] Feature cards (3-4 key features)
- [ ] CTA button → Start screen
- [ ] Match web's messaging

### Step 8.2: Create Start Screen
- [ ] Welcome message
- [ ] Tier selection cards
- [ ] "Get Started Free" button
- [ ] Match web's onboarding

### Step 8.3: Create Auth Screen
- [ ] Sign in form (email/password)
- [ ] Sign up form
- [ ] Social auth buttons (future)
- [ ] "Continue as Guest" option

## Phase 9: Polish & Testing

### Step 9.1: Styling Consistency
- [ ] Create shared theme (colors, fonts, spacing)
- [ ] Use Paper theme configuration
- [ ] Match web's Nestly brand colors (#4ABDAC, #30403A, etc.)
- [ ] Dark mode support?

### Step 9.2: Cross-Platform Testing
- [ ] Test all calculations match web
- [ ] Test tier restrictions work
- [ ] Test navigation flows
- [ ] Test form validations
- [ ] iOS and Android testing

### Step 9.3: Performance
- [ ] Optimize charts for mobile
- [ ] Lazy load heavy components
- [ ] Test on low-end devices
- [ ] Bundle size optimization

## Component Mapping: Web → Mobile

| Web Component | Mobile Equivalent | Strategy |
|---------------|-------------------|----------|
| MUI Card | Paper Card | Direct replacement |
| MUI TextField | Paper TextInput | Direct replacement |
| MUI Button | Paper Button | Direct replacement |
| MUI Slider | Custom or @react-native-community/slider | Custom styling needed |
| MUI Select | Paper Menu or Picker | Adapt UX |
| MUI Accordion | Paper Accordion (or custom) | Similar component |
| MUI Tooltip | Paper Tooltip/Dialog | Adapt for touch |
| MUI Tabs | react-native-tab-view | Custom implementation |
| recharts | victory-native | Already installed |
| Next.js routing | React Navigation | Different pattern |
| BottomNav (web) | BottomTabNavigator | Similar concept |

## Code Sharing Breakdown

### Shared (100%)
- ✅ All calculation logic (SS, Medicare, Monte Carlo, deterministic)
- ✅ All types and interfaces
- ✅ All constants and config
- ✅ All utilities (formatters, validators, converters)
- ✅ All business logic hooks

### Platform-Specific
- ❌ UI components (MUI vs Paper)
- ❌ Navigation (Next.js vs React Navigation)
- ❌ Charts (recharts vs victory-native)
- ❌ Forms (web inputs vs mobile inputs)
- ❌ Styling (CSS vs StyleSheet)

### Estimated Code Sharing: ~60-70%
- All business logic is shared
- UI follows same patterns but uses different libraries
- State management is shared (hooks)

## Timeline Estimate

| Phase | Estimated Time | Complexity |
|-------|----------------|------------|
| Phase 1: Foundation | 1-2 days | Medium (refactoring) |
| Phase 2: Navigation | 0.5 day | Low |
| Phase 3: SS & Healthcare | 2-3 days | High (lots of UI) |
| Phase 4: What-If | 1-2 days | Medium (custom sliders) |
| Phase 5: Monte Carlo | 1 day | Low (charts exist) |
| Phase 6: Help System | 0.5 day | Low |
| Phase 7: Tier System | 1 day | Medium |
| Phase 8: Landing/Auth | 1 day | Low |
| Phase 9: Polish | 1-2 days | Medium |
| **Total** | **9-14 days** | |

## Success Criteria

- [ ] All 6 web pages have mobile equivalents
- [ ] All calculations produce identical results on web and mobile
- [ ] Navigation flows are intuitive on mobile
- [ ] Tier restrictions work consistently
- [ ] Help system is accessible on mobile
- [ ] No regressions on web after refactoring
- [ ] Mobile app works on iOS and Android
- [ ] Performance is acceptable on mid-range devices

## Next Steps

1. **Start with Phase 1**: Create shared packages and refactor web
2. **Validate**: Ensure web still works after moving code
3. **Build navigation**: Set up mobile screen structure
4. **Feature-by-feature**: Implement SS & Healthcare first (most complex)
5. **Iterate**: Build remaining features incrementally
6. **Test continuously**: Ensure calculations match between platforms
