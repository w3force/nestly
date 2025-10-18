# Mobile Parity: Execution Roadmap

## 🎯 Goal
Bring ALL web features to mobile with 60-70% code sharing through shared packages.

## 📋 Current Status

### Web App (Complete ✅)
- 6 pages: Landing, Start, Calculator (3 tabs), What-If, Profile, Auth
- SS & Healthcare: Dual-mode (Quick/Detailed), 11 files
- Monte Carlo: Deterministic + simulation with preview mode
- What-If: Editable scenarios, color-coded sliders
- Help System: Tooltips + InfoCards everywhere
- Tier System: Free/Pro/Premium with restrictions
- Navigation: BottomNav (4 tabs)

### Mobile App (Minimal ❌)
- Only calculator.tsx (basic deterministic + MC stub)
- No navigation, no other features

### Gap: ~90% of features missing from mobile

## 🏗️ Architecture Strategy

### Shared Packages
1. `@projection/shared` - Business logic, calculations, types, config
2. `@projection/ui-shared` - Hooks, contexts (platform-agnostic)

### Platform-Specific
- Web: MUI + Next.js + recharts
- Mobile: React Native Paper + React Navigation + victory-native

## ⚡ Quick Start Implementation

I've created the comprehensive plan in `MOBILE_FEATURE_PARITY_PLAN.md`. Here's how to execute it:

### Phase 1: Foundation (START HERE) 🚀

#### Step 1: Create Shared Packages
```bash
cd /Users/vinodhchandrakumar/Downloads/401K/401/projection

# Already created:
# - packages/shared/package.json
# - packages/shared/tsconfig.json
# - packages/shared/src/{calculations,types,config,utils}/

# Add to pnpm-workspace.yaml
# Update package dependencies
```

#### Step 2: Move SS & Healthcare Logic
Copy these files to `@projection/shared`:
- `apps/web/features/retirement/ss-healthcare/types.ts` → `packages/shared/src/types/retirement.ts`
- `apps/web/features/retirement/ss-healthcare/ssaMath.ts` → `packages/shared/src/calculations/ssaMath.ts`
- `apps/web/features/retirement/ss-healthcare/medicareMath.ts` → `packages/shared/src/calculations/medicareMath.ts`
- `apps/web/features/retirement/ss-healthcare/compute.ts` → `packages/shared/src/calculations/compute.ts`
- `apps/web/features/retirement/ss-healthcare/config.ts` → `packages/shared/src/config/retirement.ts`
- `apps/web/features/retirement/ss-healthcare/modeUtils.ts` → `packages/shared/src/utils/modeUtils.ts`

#### Step 3: Update Web Imports
Change all web imports from relative paths to `@projection/shared`:
```typescript
// Before
import { calculateSSA } from './ssaMath';

// After
import { calculateSSA } from '@projection/shared';
```

#### Step 4: Test Web Still Works
```bash
pnpm --filter web build
pnpm --filter web dev
# Navigate to /calculator, test SS & Healthcare tab
```

### Phase 2: Mobile Navigation

#### Step 1: Install Dependencies
```bash
pnpm --filter mobile add @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
pnpm --filter mobile add react-native-screens react-native-safe-area-context
pnpm --filter mobile add @react-native-community/slider
pnpm --filter mobile add expo-linear-gradient
```

#### Step 2: Create Screen Files
```bash
mkdir -p apps/mobile/screens
mkdir -p apps/mobile/navigation

# Will create:
# - screens/LandingScreen.tsx
# - screens/StartScreen.tsx
# - screens/CalculatorScreen.tsx
# - screens/WhatIfScreen.tsx
# - screens/ProfileScreen.tsx
# - screens/AuthScreen.tsx
# - navigation/BottomTabNavigator.tsx
# - navigation/RootNavigator.tsx
```

#### Step 3: Update App.tsx
Replace with navigation container and bottom tabs.

### Phase 3: SS & Healthcare (Mobile)

This is the BIGGEST feature to port. Priority because it's most complex.

#### Strategy:
1. Reuse ALL calculation logic from `@projection/shared` ✅
2. Build mobile UI components using React Native Paper
3. Match web's dual-mode architecture
4. Use victory-native for charts (already installed)

#### Files to Create:
```
apps/mobile/features/retirement/
├── SSHealthcareTab.tsx          # Main container with mode toggle
├── QuickForm.tsx                # 5 questions (Paper components)
├── DetailedForm.tsx             # 15 inputs (Accordion sections)
├── ResultsPanel.tsx             # Results display (Cards)
├── NetByClaimAgeChart.tsx       # Victory chart
└── index.ts
```

#### Component Mapping:
| Web (MUI) | Mobile (Paper) |
|-----------|----------------|
| TextField | TextInput |
| Select | Menu / Picker |
| Button | Button |
| Card | Card |
| Accordion | Accordion (or List.Accordion) |
| ToggleButtonGroup | SegmentedButtons |

### Phase 4: What-If Scenarios

Easier than SS & Healthcare. Build after navigation is working.

### Phase 5+: Monte Carlo, Help, Tiers, Landing

Incremental additions after core features work.

## 🎨 Design System Alignment

### Colors (Nestly Brand)
```typescript
const theme = {
  primary: '#4ABDAC',      // Teal
  secondary: '#30403A',    // Dark green
  success: '#4ABDAC',
  warning: '#FC6432',      // Orange
  error: '#E74C3C',
  background: '#FFFFFF',
  surface: '#F8F9FA',
};
```

### Typography
- Match web's font weights and sizes
- Use Paper's theme configuration

### Spacing
- Match web's spacing scale (8px base)
- Consistent padding/margins

## 📊 Progress Tracking

I've created a detailed todo list. Update as you complete each phase.

## 🚀 Recommended Execution Order

1. **Phase 1** (2 days) - Create shared packages, refactor web
2. **Phase 2** (0.5 day) - Mobile navigation structure
3. **Phase 3** (3 days) - SS & Healthcare mobile implementation
4. **Test Milestone** - Verify SS & Healthcare works on mobile
5. **Phase 4** (2 days) - What-If scenarios
6. **Phase 5** (1 day) - Monte Carlo enhancements
7. **Phase 6-8** (2-3 days) - Help, Tiers, Landing
8. **Phase 9** (2 days) - Polish and testing

**Total: ~12-14 days of focused work**

## ✅ Success Metrics

- [ ] Mobile app has all 6 screens
- [ ] SS & Healthcare dual-mode works identically on web and mobile
- [ ] What-If scenarios work on mobile
- [ ] Monte Carlo works on mobile
- [ ] Help system accessible on mobile
- [ ] Tier restrictions enforced on mobile
- [ ] No regressions on web
- [ ] 60%+ code shared between platforms

## 🔧 Tools & Commands

### Development
```bash
# Web dev server
pnpm --filter web dev

# Mobile dev server (iOS)
pnpm --filter mobile start
pnpm --filter mobile ios

# Mobile dev server (Android)
pnpm --filter mobile android

# Type checking (all packages)
pnpm -r typecheck

# Build web
pnpm --filter web build
```

### Testing
```bash
# Test calculations match
# Create test suite in packages/shared/__tests__/

# Manual testing checklist in MOBILE_FEATURE_PARITY_PLAN.md
```

## 📚 Key Documents

1. **MOBILE_FEATURE_PARITY_PLAN.md** - Comprehensive plan (this is the bible)
2. **DUAL_MODE_IMPLEMENTATION.md** - SS & Healthcare dual-mode docs
3. **QUICK_START.md** - Web app overview
4. **HELP_SYSTEM_IMPLEMENTATION.md** - Help system details
5. **PLANS_COMPARISON_IMPLEMENTATION.md** - Tier system

## 💡 Pro Tips

1. **Start small**: Get navigation working first, then add one feature at a time
2. **Test early**: Verify calculations match between web and mobile immediately
3. **Reuse aggressively**: Every line of business logic should be in shared packages
4. **Match patterns**: Mobile UI should feel like web UI, just with different components
5. **Document as you go**: Update this doc with any deviations or lessons learned

## 🐛 Common Pitfalls to Avoid

1. ❌ Don't duplicate calculation logic - always import from shared
2. ❌ Don't skip navigation setup - you'll regret it later
3. ❌ Don't try to share UI components - different libraries, different patterns
4. ❌ Don't ignore platform differences - touch vs click, gestures vs hover
5. ❌ Don't forget to test on both iOS and Android

## 📞 Support

If you get stuck:
1. Check the detailed plan in MOBILE_FEATURE_PARITY_PLAN.md
2. Review web implementation for reference
3. Consult React Native Paper docs for mobile components
4. Test incrementally - don't build everything at once

---

**Ready to start?** Begin with Phase 1 in MOBILE_FEATURE_PARITY_PLAN.md!
