# Phase 9: Mobile Parity Fixes - In Progress

## Completed Fixes ✅

### 1. ✅ Deterministic Tab Implementation
**File**: `apps/mobile/app/calculator.tsx`
**Changes**:
- Added tab navigation with SegmentedButtons (Deterministic, Monte Carlo, SS & Healthcare)
- Moved Deterministic form into conditional render
- Results display only shows when on Deterministic tab
- Proper tab state management

### 2. ✅ MC Tier Gating
**File**: `apps/mobile/app/calculator.tsx`
**Changes**:
- MC tab disabled for non-Premium users
- MC inputs disabled when no access
- UpgradeBanner shown when MC is restricted
- "Run Monte Carlo" button shows "Upgrade to Run" when locked
- Uses `useTier()` hook from TierContext

### 3. ✅ Tab Organization
**Structure**:
- Tab 1: Deterministic - Deterministic calculator + chart
- Tab 2: Monte Carlo - Full MC inputs + results
- Tab 3: SS & Healthcare - Placeholder for future implementation

---

## Remaining Issues to Fix ❌

### 4. ❌ Tooltip Content Sync
**Problem**: Help content is different from web
**Files to Create**:
- `apps/mobile/lib/helpContent.ts` (sync from web)

**Web Example** (web/lib/helpContent.ts):
```typescript
export const helpContent = {
  deterministic: {
    age: {
      title: "Current Age",
      description: "Your current age. This determines your working years and timeline to retirement."
    },
    expectedReturn: {
      title: "Expected Annual Return",
      description: "Average yearly investment return (%). Historical average is 7-8% for stocks, 3-4% for bonds."
    },
    // ... many more
  },
  monteCarlo: {
    volatility: {
      title: "Return Volatility",
      description: "..."
    }
    // ... more
  }
}
```

**Action**: Copy from web, remove MUI-specific styling

### 5. ❌ Profile Screen Not Matching Web
**Current**: Profile screen incomplete/mismatched
**Expected**:
- User info section (tier badge, email, member since)
- Saved scenarios list
- Tier comparison table
- Upgrade button
- Settings/preferences

### 6. ❌ Plans Comparison Content Mismatch
**Current**: PlansComparison may have incomplete content
**Expected**:
- FREE tier: Pricing, features
- PRO tier: Pricing, features
- PREMIUM tier: Pricing, features
- Feature comparison rows matching web

**Source**: TIER_COMPARISON constant in packages/shared/src/types/tiers.ts

### 7. ❌ Tier Restrictions Not Complete
**Missing Restrictions**:
- What-If scenarios limited by tier
- Export functionality locked
- Ad-free locked
- Priority support locked

---

## Implementation Plan

### Phase 9A: Content Sync (Tooltips)
1. Create `apps/mobile/lib/helpContent.ts`
2. Copy all help content from web
3. Update HelpIcon, HelpModal to use shared content
4. Test all tooltips display correctly

### Phase 9B: Profile Screen
1. Rebuild ProfileScreen.tsx to match web
2. Show user tier badge
3. Show saved scenarios
4. Add Plans comparison
5. Add upgrade button

### Phase 9C: Plans Comparison
1. Verify PlansComparison.tsx uses correct data
2. Sync with TIER_COMPARISON from shared package
3. Add icons/styling to match web

### Phase 9D: Full Tier Restrictions
1. Audit all screens for tier-gated features
2. Add restrictions for What-If scenarios
3. Add restrictions for export
4. Add restrictions for ad-free
5. Test all restrictions work correctly

### Phase 9E: Testing
1. Test all tabs work
2. Test MC gating works
3. Test tooltip content displays
4. Test Profile matches web
5. Test Plans comparison matches web
6. Test tier restrictions work

---

## Quick Build Verification

To verify the tab system builds:
```bash
cd /Users/vinodhchandrakumar/Downloads/401K/401/projection/apps/mobile
pnpm start
```

Expected in Expo:
- Top of calculator screen shows 3 segmented buttons: "Deterministic", "Monte Carlo", "SS & Healthcare"
- MC tab disabled unless user is Premium tier
- Switching tabs shows/hides appropriate content

---

## Files Modified This Session

1. `/Users/vinodhchandrakumar/Downloads/401K/401/projection/apps/mobile/app/calculator.tsx`
   - Added imports: SegmentedButtons, useTier, UpgradeBanner, Snackbar
   - Added tab state: activeTab
   - Added tier access check: canAccessMonteCarlo
   - Restructured return() with conditional rendering by tab
   - Added UpgradeBanner for MC when locked

## Files Still Need Changes

1. `apps/mobile/lib/helpContent.ts` - **Create new**
2. `apps/mobile/screens/ProfileScreen.tsx` - **Major update**
3. `apps/mobile/components/PlansComparison.tsx` - **Content verification**
4. `apps/mobile/contexts/TierContext.tsx` - **May need feature restrictions**
5. Multiple screens - **Add tier restrictions**

---

**Status**: Tab system implemented and building ✅
**Next**: Create helpContent.ts to sync tooltip content
