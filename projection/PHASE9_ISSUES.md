# Mobile Parity Issues - Phase 9 Fixes

## Issues Identified

### 1. ❌ Deterministic Tab Missing
**Problem**: No tab switching. Both deterministic and MC showing together.
**Web**: Has 3 tabs: Deterministic, Monte Carlo, SS & Healthcare
**Mobile**: Showing both at once, no organization

**Fix**: Add tab navigation system like web

### 2. ❌ MC Always Accessible
**Problem**: Monte Carlo showing for all tiers
**Web**: MC is Premium-only feature with UpgradeBanner + lock
**Mobile**: No tier restrictions

**Fix**: Gate MC behind Premium tier with UpgradeBanner

### 3. ❌ Missing Preview/Compare Feature
**Problem**: No side-by-side comparison
**Web**: "Compare" button shows what-if comparisons
**Mobile**: No preview or comparison

**Fix**: Add preview/comparison display

### 4. ❌ Tooltip Content Mismatch
**Problem**: Help content different from web
**Web**: Detailed help system with specific descriptions
**Mobile**: Placeholder or missing tooltips

**Fix**: Sync all tooltips from web helpContent.ts

### 5. ❌ Settings/Profile Page
**Problem**: Profile page doesn't match web
**Web**: User settings, tier info, saved scenarios
**Mobile**: Incomplete or missing

**Fix**: Rebuild profile screen to match web

### 6. ❌ Plans Comparison Content
**Problem**: Plans modal content doesn't match web
**Web**: Complete pricing table with features, icons
**Mobile**: Incomplete content

**Fix**: Sync PlansComparison component

### 7. ❌ Tier Restrictions Not Matching
**Problem**: Not all features properly restricted by tier
**Web**: Free < Standard < Premium (clear hierarchy)
**Mobile**: Incomplete restrictions

**Fix**: Implement full tier restriction matrix

---

## Implementation Order

1. **Tab System** (calculator.tsx) - Add Deterministic, MC, SS tabs
2. **Tier Gating** (calculator.tsx) - MC behind Premium
3. **Help Content Sync** (help content files) - Copy from web
4. **Profile Screen** - Rebuild to match web
5. **Plans Comparison** - Sync content and styling
6. **Tier Restrictions** - Apply across all screens

---

## Files to Modify

- `apps/mobile/app/calculator.tsx` - Tabs + tier gating
- `apps/mobile/contexts/TierContext.tsx` - Tier logic
- `apps/mobile/screens/ProfileScreen.tsx` - Profile rebuild
- `apps/mobile/components/PlansComparison.tsx` - Sync content
- `apps/mobile/lib/helpContent.ts` - Create if missing, sync from web
