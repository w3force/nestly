# 🚀 Mobile Feature Parity - Quick Summary

## What We're Building

Bringing **ALL** web app features to the mobile app with maximum code sharing:

### Web Features to Port (6 Pages)
1. ✅ Landing - Marketing page
2. ✅ Start - Onboarding & tier selection
3. ✅ Calculator - 3 tabs:
   - Deterministic + Monte Carlo simulation
   - **SS & Healthcare (Dual-mode: Quick + Detailed)** ⭐ Most complex
   - Future expansion
4. ✅ What-If - Editable scenarios with color-coded sliders
5. ✅ Profile - User settings, tier badge
6. ✅ Auth - Sign in/up

### Current Mobile Status
- ❌ Only has basic calculator (no SS & Healthcare, no What-If, no navigation)
- **Gap: ~90% of features missing**

## Strategy: Shared Packages

### Architecture
```
┌─────────────────────────────────────────┐
│     @projection/shared (NEW)            │
│  - All calculations (SS, Medicare, MC)  │
│  - All types & interfaces               │
│  - All config & constants               │
│  - All utilities                        │
└─────────────────────────────────────────┘
           ↓              ↓
    ┌──────────┐    ┌──────────┐
    │   WEB    │    │  MOBILE  │
    │   MUI    │    │  Paper   │
    │  Next.js │    │   RN     │
    │ recharts │    │ victory  │
    └──────────┘    └──────────┘
```

**Code Sharing: 60-70%**
- ✅ 100% of business logic shared
- ✅ 100% of types shared
- ❌ UI components platform-specific (MUI vs Paper)

## 📋 Implementation Plan

### Phase 1: Foundation (START HERE) 🔥
**Status**: In Progress  
**Duration**: 1-2 days

**Tasks**:
1. ✅ Create `@projection/shared` package structure
2. ⏳ Copy SS & Healthcare files to shared package:
   - `types.ts` → `packages/shared/src/types/retirement.ts`
   - `ssaMath.ts` → `packages/shared/src/calculations/ssaMath.ts`
   - `medicareMath.ts` → `packages/shared/src/calculations/medicareMath.ts`
   - `compute.ts` → `packages/shared/src/calculations/compute.ts`
   - `config.ts` → `packages/shared/src/config/retirement.ts`
   - `modeUtils.ts` → `packages/shared/src/utils/modeUtils.ts`
3. ⏳ Update pnpm-workspace.yaml to include packages/shared
4. ⏳ Update web to import from `@projection/shared`
5. ⏳ Test web still works (no regressions)

**Commands**:
```bash
# 1. Update workspace
# Edit pnpm-workspace.yaml to add 'packages/shared'

# 2. Install dependencies
pnpm install

# 3. Copy files (manual or script)
# See MOBILE_FEATURE_PARITY_PLAN.md for file list

# 4. Update web imports
# Replace relative imports with @projection/shared

# 5. Test web
pnpm --filter web build
pnpm --filter web dev
```

### Phase 2: Mobile Navigation
**Status**: Not Started  
**Duration**: 0.5 day

**Tasks**:
1. Install React Navigation + dependencies
2. Create screen files (6 screens)
3. Build BottomTabNavigator (4 tabs: Home, Calculator, What-If, Profile)
4. Update App.tsx with navigation

**Commands**:
```bash
pnpm --filter mobile add @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
pnpm --filter mobile add react-native-screens react-native-safe-area-context
pnpm --filter mobile add @react-native-community/slider expo-linear-gradient
```

### Phase 3: SS & Healthcare (Mobile)
**Status**: Not Started  
**Duration**: 2-3 days  
**Priority**: HIGHEST (most complex feature)

**Tasks**:
1. Create mobile feature folder structure
2. Build QuickForm (5 questions - Paper TextInput/Select)
3. Build DetailedForm (15 inputs - Paper Accordion sections)
4. Build ResultsPanel (Paper Cards + formatters)
5. Build NetByClaimAgeChart (VictoryChart)
6. Integrate into CalculatorScreen as Tab 2

**Key**: Reuse 100% of calculations from `@projection/shared`

### Phase 4-9: Remaining Features
- Phase 4: What-If scenarios (1-2 days)
- Phase 5: Monte Carlo enhancements (1 day)
- Phase 6: Help system (0.5 day)
- Phase 7: Tier system (1 day)
- Phase 8: Landing & Auth (1 day)
- Phase 9: Testing & Polish (1-2 days)

**Total Time**: 9-14 days

## 🎯 Success Criteria

- [ ] Mobile has all 6 screens matching web
- [ ] SS & Healthcare works identically on both platforms
- [ ] What-If scenarios work on mobile
- [ ] Monte Carlo works on mobile
- [ ] All calculations produce same results (web vs mobile)
- [ ] No regressions on web after refactoring
- [ ] Works on iOS and Android

## 📁 Key Files Created

1. **MOBILE_FEATURE_PARITY_PLAN.md** - Comprehensive 400+ line plan
2. **MOBILE_EXECUTION_ROADMAP.md** - Quick start guide
3. **This file** - TL;DR summary
4. `packages/shared/` - New shared package (in progress)

## 🔄 Next Steps (RIGHT NOW)

1. **Update `pnpm-workspace.yaml`**:
   ```yaml
   packages:
     - 'apps/*'
     - 'packages/*'
     - 'packages/shared'  # ADD THIS
   ```

2. **Copy SS & Healthcare files to shared package** (see file list in Phase 1)

3. **Update web imports** to use `@projection/shared`

4. **Test web still works**:
   ```bash
   pnpm --filter web build
   pnpm --filter web dev
   # Navigate to /calculator, click SS & Healthcare tab, test both modes
   ```

5. **Then move to Phase 2** (mobile navigation)

## 💡 Why This Approach Works

1. **Single Source of Truth**: All calculations in one place
2. **Type Safety**: Shared types prevent web/mobile divergence
3. **Easier Testing**: Test calculations once, use everywhere
4. **Faster Development**: UI only, business logic already done
5. **Consistent Results**: Same math = same numbers
6. **Maintainability**: Fix bugs once, benefits both platforms

## 📊 Component Mapping Cheat Sheet

| Feature | Web Library | Mobile Library | Shared Logic |
|---------|-------------|----------------|--------------|
| SS Calculations | MUI forms | Paper forms | ✅ @projection/shared |
| Monte Carlo | recharts | victory-native | ✅ @projection/shared |
| What-If | MUI Slider | RN Slider | ✅ @projection/shared |
| Navigation | Next.js | React Nav | ❌ Platform-specific |
| Tooltips | MUI Tooltip | Paper Tooltip | ❌ Platform-specific |
| Charts | recharts | victory-native | ❌ Different libraries |

## 🚨 Common Mistakes to Avoid

1. ❌ **Don't** copy-paste calculations into mobile - import from shared!
2. ❌ **Don't** try to share UI components - use platform-specific libraries
3. ❌ **Don't** skip Phase 1 - foundation is critical
4. ❌ **Don't** build everything at once - test incrementally
5. ❌ **Don't** forget to update pnpm-workspace.yaml

## 🎓 Learning Resources

- **React Native Paper**: https://reactnativepaper.com/
- **React Navigation**: https://reactnavigation.org/
- **Victory Native**: https://commerce.nearform.com/open-source/victory-native/
- **Expo**: https://docs.expo.dev/

## 📞 Questions?

Refer to:
1. **MOBILE_FEATURE_PARITY_PLAN.md** for details
2. **MOBILE_EXECUTION_ROADMAP.md** for step-by-step
3. **Web implementation** for reference patterns
4. **DUAL_MODE_IMPLEMENTATION.md** for SS & Healthcare architecture

---

**Status**: Ready to execute Phase 1! 🚀

**Estimated Completion**: 9-14 days from start

**Current Focus**: Create shared package and refactor web (Phase 1)
