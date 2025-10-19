# Landing Page Integration: Existing Content + Quick Start

## Recommended Layout

The landing page will have this flow:

```
1. HERO SECTION (existing)
   - Title
   - Tagline
   - Description
   - Guest mode badge (if applicable)

2. CTA BUTTON (existing)
   - "Get Started" or similar

3. ★ NEW: QUICK START SECTION ★
   - Age input
   - Balance input
   - Strategy selector
   - Real-time results card
   - "Get Detailed Analysis" button

4. FEATURE CARDS (existing)
   - Deterministic
   - What-If
   - Monte Carlo

```

## Why This Order Works

✅ **Hero first** - Sets context for what the app does  
✅ **Quick Start second** - Gives instant value without commitment  
✅ **Features last** - Details for users who want to explore  

This way:
- New users see results immediately (8 seconds)
- Users who want to explore features can still see all three calculators
- Everything from the existing page is preserved

---

## Implementation: Option A (Quick Start Between CTA and Features)

**File:** `apps/web/pages/index.tsx`

Add import at top:
```tsx
import { QuickStartSection } from "../components/QuickStartSection";
```

Find this section (around line 195):
```tsx
            {/* CTA Button */}
            <motion.div
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.6 }}
            >
              <Button
                component={Link}
                href="/calculator"
                variant="contained"
                size="large"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: "1.05rem",
                  borderRadius: 99,
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: "#69B47A",
                  ":hover": {
                    backgroundColor: "#5AA468",
                    boxShadow: "0 12px 30px rgba(105, 180, 122, 0.25)",
                  },
                }}
              >
                {heroMetadata.primaryCTA}
              </Button>
            </motion.div>

            {/* Feature Cards - Using Schema */}
```

**Replace with:**
```tsx
            {/* CTA Button */}
            <motion.div
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.6 }}
            >
              <Button
                component={Link}
                href="/calculator"
                variant="contained"
                size="large"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: "1.05rem",
                  borderRadius: 99,
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: "#69B47A",
                  ":hover": {
                    backgroundColor: "#5AA468",
                    boxShadow: "0 12px 30px rgba(105, 180, 122, 0.25)",
                  },
                }}
              >
                {heroMetadata.primaryCTA}
              </Button>
            </motion.div>

            {/* ★ QUICK START SECTION - NEW ★ */}
            <QuickStartSection />

            {/* Feature Cards - Using Schema */}
```

That's it! Just **3 lines added** (import + component).

---

## Implementation: Option B (Quick Start After Features)

If you prefer Quick Start to be AFTER the feature cards instead:

Find the end of the feature cards (around line 280):
```tsx
            </motion.div>

            {/* CTA Button */}
            <motion.div
```

**Replace with:**
```tsx
            </motion.div>

            {/* ★ QUICK START SECTION - NEW ★ */}
            <QuickStartSection />

            {/* CTA Button */}
            <motion.div
```

---

## Visual Result (Option A)

### Desktop View
```
┌─────────────────────────────────────────────┐
│           HERO SECTION                      │
│  "Plan Your Retirement with Confidence"    │
│  "See Your Results in 8 Seconds"           │
│  [Get Started Button]                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         QUICK START SECTION (NEW)           │
│  ─────────────────────────────────────────  │
│                                             │
│  INPUT (50%)  │  RESULTS (50%)              │
│  Age: [35]    │  Portfolio: $847,000       │
│  Balance:[100K│  Monthly: $2,470            │
│  Strategy:    │  Lasts Until: 93            │
│  [Balanced]   │  Confidence: ▰▰▰ 65%        │
│               │                             │
│  [Get Analysis]                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│      FEATURE CARDS (Existing)               │
│  ┌─────────────┐  ┌─────────────┐  ...     │
│  │ Deterministic│  │   What-If   │         │
│  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────┘
```

### Mobile View
```
HERO SECTION
(scroll down)
QUICK START SECTION
(scroll down)
FEATURE CARDS
```

---

## Key Points

✅ **No existing content removed** - Everything stays exactly as it was  
✅ **Easy integration** - Just 3 lines of code  
✅ **Better user flow** - Instant results before exploring features  
✅ **Smooth scrolling** - All sections flow naturally  
✅ **Mobile responsive** - Works perfectly on all devices  

---

## CSS/Spacing Considerations

The QuickStartSection already has its own styling with:
- Background color (light teal): `rgba(105, 180, 122, 0.08)`
- Padding: `py: { xs: 6, md: 8 }`
- Borders: Top and bottom subtle borders
- Proper spacing to separate from other sections

So it will naturally stand out as its own section while fitting seamlessly.

---

## Next Steps

1. Choose Option A or B (which section placement)
2. Add the import line
3. Add the QuickStartSection component line
4. Test locally
5. Deploy!

**Recommendation:** Option A (between CTA and features) - because:
- CTA encourages immediate action
- Quick Start delivers instant results
- Features provide options for exploration
- Natural user journey progression
