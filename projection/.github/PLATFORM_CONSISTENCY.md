# Nestly Project - Unified Design System Instructions

## CRITICAL: Cross-Platform Consistency Rules

### 1. **Shared Schema is Source of Truth**
- All content that appears on BOTH web and mobile (landing page, feature descriptions, etc.) MUST come from `packages/shared/src/uiSchema/screens.ts`
- NEVER hardcode values in component files that should come from the schema
- If you need to change landing page content, update the schema first, then both platforms will automatically use it

### 2. **Feature Card Labels & Badges - MUST BE IDENTICAL**
- Monte Carlo premium badge text: **`PREMIUM`** (not "PRO", not "Premium", not "Pro")
- Both web (`apps/web/pages/index.tsx` line 226) and mobile (`apps/mobile/screens/HomeScreen.tsx`) use `PREMIUM`
- If you add any new badges or labels, make sure:
  - Define them in the schema if they apply to both platforms
  - Use the same text across both apps
  - Check both implementations after changes

### 3. **Landing Page Content Structure**

#### Web Landing Page
- File: `apps/web/pages/index.tsx`
- Uses: `LANDING_SCREEN` schema from `@projection/shared`
- Feature items: Maps from `LANDING_SCREEN.sections[1].metadata.items`
- Each feature gets: title, description, icon, href, color, isPremium flag

#### Mobile Landing Page  
- Onboarding: `apps/mobile/screens/LandingScreen.tsx` (shows on app first launch)
- Home Screen: `apps/mobile/screens/HomeScreen.tsx` (shows after onboarding, main dashboard)
- Uses: `LANDING_SCREEN` schema from `@projection/shared`
- Feature items: Same extraction pattern as web

**BOTH SCREENS MUST USE SCHEMA** - No hardcoded descriptions or labels

### 4. **Feature Descriptions - Extended Format**
Current schema descriptions for landing page features:

**Deterministic:**
```
"Project your retirement with a single set of fixed assumptions. See one clear scenario for your financial future based on conservative estimates."
```

**What-If:**
```
"Compare multiple retirement scenarios side-by-side to explore different strategies. Understand how changes in spending or savings affect your outcomes."
```

**Monte Carlo:**
```
"Run 10,000+ simulations to see the probability of retirement success. Get a realistic range of outcomes with best, median, and worst-case scenarios."
```

**Action**: If you need to shorten/change descriptions, update in `packages/shared/src/uiSchema/screens.ts` LANDING_SCREEN.sections[1].metadata.items

### 5. **Component Imports Pattern**

#### For Cross-Platform Content (Web + Mobile)
```typescript
import { LANDING_SCREEN } from '@projection/shared';

// Extract from schema
const featureItems = LANDING_SCREEN.sections[1].metadata.items;
```

#### For Platform-Specific Components
- Web: Use components from `apps/web/components/`
- Mobile: Use components from `apps/mobile/components/`
- Share business logic via `packages/shared/`

### 6. **Color Consistency**

**Feature Card Colors:**
- Deterministic: `#69B47A` (green)
- What-If: `#4ABDAC` (teal)
- Monte Carlo: `#FFD54F` (yellow)

**Text Colors:**
- Feature titles: Color-coded (use feature color)
- Descriptions: `#666` on web, `#555` on mobile (both dark gray, acceptable variance)
- Premium badge: `#FFD54F` background, `#1A1A1A` text

### 7. **Profile Page Implementation (Web)**
- **DO NOT** use `useSearchParams()` directly in page components
- **ALWAYS** wrap in `Suspense` boundary or use a separate client component
- Structure:
  - `apps/web/app/profile/page.tsx` - Server component with Suspense
  - `apps/web/components/ProfileContent.tsx` - Client component with logic (uses useSearchParams)

### 8. **Build Configuration**
- `apps/web/next.config.js` has: `transpilePackages: ['@projection/shared']`
- This allows TypeScript files from shared package to work in browser
- Never remove or modify without testing both apps

### 9. **Testing Checklist Before Committing**
- [ ] Web landing page builds without webpack errors
- [ ] Mobile landing page displays correct content
- [ ] Feature descriptions are identical on both
- [ ] Premium badges show "PREMIUM" on both (not Pro/PRO)
- [ ] Colors are consistent (green for deterministic, teal for what-if, yellow for monte carlo)
- [ ] Navigation targets are correct
- [ ] Schema is single source of truth for shared content

### 10. **Common Mistakes to AVOID**

❌ **WRONG:** Hardcoding descriptions in mobile HomeScreen
```typescript
const descriptions = {
  deterministic: 'Some text...',
  whatif: 'Other text...',
};
```

✅ **RIGHT:** Use schema
```typescript
const featureItems = featuresSection.metadata.items;
// item.description comes from schema
```

---

❌ **WRONG:** Different badge text
```typescript
// Web: "PREMIUM"
// Mobile: "PRO"
```

✅ **RIGHT:** Same everywhere
```typescript
// Both: "PREMIUM"
```

---

❌ **WRONG:** Profile page with useSearchParams in root component
```typescript
export default function ProfilePage() {
  const searchParams = useSearchParams(); // ❌ Will fail pre-rendering
}
```

✅ **RIGHT:** Suspense wrapper pattern
```typescript
export default function ProfilePage() {
  return (
    <Suspense fallback={<Box>Loading...</Box>}>
      <ProfileContent />
    </Suspense>
  );
}
```

---

## Files to Review Before Making Changes

1. **Schema definitions**: `packages/shared/src/uiSchema/screens.ts`
2. **Web landing**: `apps/web/pages/index.tsx`
3. **Mobile landing**: `apps/mobile/screens/LandingScreen.tsx`
4. **Mobile home**: `apps/mobile/screens/HomeScreen.tsx`
5. **Build config**: `apps/web/next.config.js`

## Key Principles

1. **One Schema, Two Platforms** - Content lives in schema, not components
2. **Consistency First** - Same text, colors, labels across all apps
3. **No Hardcoding** - Especially for user-facing content
4. **Test Both** - Changes must work on web AND mobile
5. **Follow Patterns** - Use existing patterns from LandingScreen, not new approaches
