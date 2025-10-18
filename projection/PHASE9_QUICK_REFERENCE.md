# Phase 9 Quick Reference Guide

## 🚀 What to Test

### 1. **Deterministic Tab**
- Navigate to Calculator → Deterministic tab
- Enter values: Age, Retirement Age, Balance, Contribution, Return Rate
- Click "Calculate" → Should show projection chart
- Click "Save as Baseline" → Snackbar should show ✓
- Click "What-If" → Should navigate to What-If tab with data pre-filled

### 2. **Monte Carlo Tab**
**As Free User:**
- Inputs should be DISABLED (grayed out)
- "Run Simulations" button should be disabled
- UpgradeBanner should show "Upgrade to run simulations"

**As Pro/Premium User:**
- All inputs should be ENABLED
- "Run Simulations" button should be clickable
- 50,000 simulations should run and show distribution chart

### 3. **SS & Healthcare Tab**
- "Quick Mode" should be available to all users
- "Detailed Mode" button should show for Pro/Premium users
- Click "Run" to calculate Social Security and healthcare projections
- Chart shows claiming age sweep analysis

### 4. **What-If Scenarios (Persistence Test)**
1. Go to What-If tab
2. Create scenario "Test Scenario" with parameters
3. Go to Profile → Click "Saved Scenarios"
4. Modal should show your scenario
5. Click "Open" → Should jump back to What-If
6. **PERSISTENCE TEST**: Hard-close app and reopen
7. Go to Profile → "Saved Scenarios"
8. Scenario should still be there ✅

### 5. **Profile Screen**
- Tier badge card should show colored background
- Current tier, scenarios used, and status should display
- "View Plans" should navigate to full Plans page
- "Saved Scenarios" opens modal with persisted scenarios

### 6. **Plans Page**
- Shows 3 tier cards at top
- Full 12-feature comparison table
- Back button returns to Profile

---

## 📱 Testing Commands

```bash
# Start the app
cd /Users/vinodhchandrakumar/Downloads/401K/401/projection
pnpm --filter mobile start

# To open iOS simulator (if available)
# Press 'i' in the terminal

# To open Android (if emulator running)
# Press 'a' in the terminal

# To reload app
# Press 'r' in the terminal
```

---

## 🎯 Success Criteria

✅ All three calculator tabs display and calculate correctly  
✅ Deterministic Save/What-If navigation works  
✅ Monte Carlo respects tier restrictions  
✅ Scenarios persist to AsyncStorage  
✅ Profile displays saved scenarios  
✅ Plans page shows full comparison  
✅ No console errors  
✅ App runs without crashing  

---

## 📂 Files Changed

**New:**
- `apps/mobile/screens/DeterministicTab.tsx`
- `apps/mobile/contexts/DeterministicContext.tsx`

**Updated:**
- `apps/mobile/screens/CalculatorScreen.tsx`
- `apps/mobile/screens/MonteCarloTab.tsx`
- `apps/mobile/screens/ProfileScreen.tsx`
- `apps/mobile/screens/PlansScreen.tsx`
- `apps/mobile/screens/WhatIfScreen.tsx`
- `apps/mobile/features/retirement/ss-healthcare/SSHealthcareTab.tsx`
- `apps/mobile/lib/helpContent.ts`
- `packages/shared/src/types/tiers.ts`

---

## 🔧 Architecture

### DeterministicContext
```tsx
- Stores baseline: { age, retireAge, balance, contribution, rate }
- Survives tab navigation (in-memory)
- Lost on app restart (by design)
```

### AsyncStorage Persistence
```tsx
- Key: 'whatif_scenarios'
- Stores array of scenario objects
- Auto-save on every scenario change
- Auto-load on app startup
```

### Tier System
```tsx
FREE: 🪴 $0/mo - 1k MC sims, 2 scenarios, Quick Mode only
PRO: 🌱 $0/mo - 50k MC sims, 5 scenarios, Quick+Detailed Mode
PREMIUM: 💎 $5.98/mo - 50k MC sims, 10 scenarios, Full features
```

---

## 🎓 Key Routes

```
RootNavigator (Stack)
├── LandingScreen (Entry)
├── StartScreen
├── AuthScreen
└── Main (BottomTabNavigator)
    ├── Home (HomeScreen)
    ├── Calculator (CalculatorScreen)
    │   ├── Deterministic tab (DeterministicTab)
    │   ├── Monte Carlo tab (MonteCarloTab)
    │   └── SS & Healthcare tab (SSHealthcareTab)
    ├── What-If (WhatIfScreen)
    ├── Profile (ProfileScreen)
    └── Plans (PlansScreen)
```

---

## 🐛 Known Issues

1. **Package Version Advisory**: @react-native-picker/picker v2.11.4 (expected 2.11.1)
   - Status: Non-blocking, advisory only
   - Fix: `pnpm install @react-native-picker/picker@2.11.1` if needed

2. **Tier Switching**: UI-only, doesn't persist to backend
   - Phase 10 task: Connect to real authentication system

3. **Account Info**: Mock data only
   - Phase 10 task: Connect to user account API

---

## ✨ Next Steps (Phase 10)

- [ ] Implement real tier switching persistence
- [ ] Add account management screen
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Performance optimization
- [ ] Edge case handling
- [ ] Data export functionality

---

**Status**: ✅ READY FOR TESTING
**Last Updated**: October 17, 2025
