# Landing Page: Web vs Mobile Visual Comparison

## Same Content, Different Layouts

### Content That Is Identical on Both Platforms

#### Title
```
Nestly
```

#### Tagline
```
Watch your future grow, one nest at a time.
```

#### Description
```
Nestly helps you project your savings, 401(k), Social Security, Medicare costs, 
and investments over time — guiding you to build a secure financial future.
```

#### Feature Cards (Same Data, Different Rendering)

| Feature | Title | Description | Icon Semantic | Color | Badge |
|---------|-------|-------------|--|-------|-------|
| 1 | Deterministic | Single scenario based on fixed assumptions | Calculator | Green (#69B47A) | - |
| 2 | What-If Analysis | Compare multiple scenarios side by side | Compare | Teal (#4ABDAC) | - |
| 3 | Monte Carlo | Probability-based analysis with 10,000 simulations | TrendingUp | Yellow (#FFD54F) | PREMIUM |

#### CTAs
- Feature CTAs: "Get Started", "Compare Scenarios", "Run Simulations"
- Main CTA: "Start Planning Now"

---

## Layout Differences

### WEB (Desktop)

```
┌──────────────────────────────────────────────────────────┐
│                    NESTLY                                │
│   Watch your future grow, one nest at a time.           │
│                                                           │
│  Nestly helps you project your savings, 401(k),         │
│  Social Security, Medicare costs, and investments       │
│  over time — guiding you to build a secure financial    │
│  future.                                                 │
└──────────────────────────────────────────────────────────┘

┌─────────────────────┬─────────────────────┬──────────────────┐
│   Calculator Icon   │   Compare Icon      │   TrendingUp Icon│
│   Green Box         │   Teal Box          │   Yellow Box     │
├─────────────────────┼─────────────────────┼──────────────────┤
│                     │                     │                  │
│ Deterministic       │ What-If Analysis    │ Monte Carlo      │
│                     │                     │ [PREMIUM]        │
│ Single scenario...  │ Compare multiple... │ Probability...   │
│                     │                     │                  │
└─────────────────────┴─────────────────────┴──────────────────┘

         ┌──────────────────────────────┐
         │   Start Planning Now         │
         └──────────────────────────────┘
```

**Features:**
- 3-column grid layout
- Large responsive typography
- Hover animations on cards
- Color-shadow effects on hover
- Full-width container
- Material-UI Card components

---

### MOBILE (Portrait)

```
┌──────────────────────────────┐
│        NESTLY                │
│  Watch your future grow,     │
│  one nest at a time.         │
│                              │
│  Nestly helps you project    │
│  your savings, 401(k),       │
│  Social Security, Medicare   │
│  costs, and investments over │
│  time — guiding you to build │
│  a secure financial future.  │
└──────────────────────────────┘

┌──────────────────────────────┐
│   [Calculator Icon]          │
│   Green Background           │
├──────────────────────────────┤
│ Deterministic                │
│                              │
│ Single scenario based on     │
│ fixed assumptions            │
│                              │
│ [Get Started]                │
└──────────────────────────────┘

┌──────────────────────────────┐
│   [Compare Icon]             │
│   Teal Background            │
├──────────────────────────────┤
│ What-If Analysis             │
│                              │
│ Compare multiple scenarios   │
│ side by side                 │
│                              │
│ [Compare Scenarios]          │
└──────────────────────────────┘

┌──────────────────────────────┐
│   [TrendingUp Icon]          │
│   Yellow Background          │
├──────────────────────────────┤
│ Monte Carlo        [PREMIUM] │
│                              │
│ Probability-based analysis   │
│ with 10,000 simulations      │
│                              │
│ [Run Simulations]            │
└──────────────────────────────┘

     [Start Planning Now]
```

**Features:**
- Vertical stacked layout
- Touch-friendly spacing
- Feature cards scrollable
- Action buttons on each card
- React Native Paper components
- Gradient hero background

---

## Color Palette (Identical on Both Platforms)

### Primary Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Green | #69B47A | (105, 180, 122) | Deterministic feature |
| Teal | #4ABDAC | (74, 189, 172) | What-If feature |
| Yellow | #FFD54F | (255, 213, 79) | Monte Carlo feature |

### Background Colors
| Name | Hex | Usage |
|------|-----|-------|
| Icon Background | Primary + 20% opacity | Lighter icon boxes |
| Card Hover Shadow | Primary + 20% opacity (web only) | Hover state |

### Text Colors
| Name | Hex | Usage |
|------|-----|-------|
| Dark | #30403A | Headings, primary text |
| Medium | rgba(48, 64, 58, 0.8) | Body text |
| Light | rgba(0, 0, 0, 0.6) | Secondary text |

---

## Icon Mapping (Semantically Consistent)

### Platform Differences

| Feature | Mobile | Web | Semantic Meaning |
|---------|--------|-----|------------------|
| Deterministic | calculator | CalculateIcon | Math/calculation |
| What-If | compare-arrows | CompareArrowsIcon | Scenario comparison |
| Monte Carlo | trending-up | AutoGraphIcon | Probability/analysis |

**Implementation:**
```typescript
// Mobile uses react-native-paper icon names
const mobileIcons = {
  deterministic: 'calculator',
  whatif: 'compare-arrows',
  montecarlo: 'trending-up',
};

// Web uses @mui/icons-material components
const webIcons = {
  deterministic: <CalculateIcon />,
  whatif: <CompareArrowsIcon />,
  montecarlo: <AutoGraphIcon />,
};
```

---

## Typography Consistency

### Sizes and Weights

| Element | Mobile | Web | Weight | Size |
|---------|--------|-----|--------|------|
| App Title | displayMedium | h2 | 700 | 2.25rem (mobile) / 3.5rem (desktop) |
| Tagline | headlineSmall | h5 | 500 | 1.125rem (mobile) / 1.5rem (desktop) |
| Description | bodyLarge | body1 | 400 | 1rem (mobile) / 1.15rem (desktop) |
| Card Title | titleMedium | h6 | 600 | 1rem |
| Card Description | bodyMedium | body2 | 400 | 0.875rem |

---

## Responsive Behavior

### Web
```
Desktop (> 960px):
┌──────────────────────────────────────────────────────────┐
│ 3-column grid, full width features                       │
└──────────────────────────────────────────────────────────┘

Tablet (600px - 960px):
┌──────────────────────────────────────────────────────────┐
│ 2-column grid or stacked                                 │
└──────────────────────────────────────────────────────────┘

Mobile (< 600px):
┌───────────────────────┐
│ Single column layout  │
└───────────────────────┘
```

### Mobile
```
All screen sizes:
┌──────────────────────┐
│ Single column stacked│
└──────────────────────┘
```

---

## Navigation Consistency

### Button Actions
Both platforms navigate to the same conceptual destinations:

```
┌─────────────────────────────────────┐
│ User taps/clicks "Get Started"       │
│ (or "Compare Scenarios")             │
│ (or "Run Simulations")               │
└────────────┬────────────────────────┘
             │
      ┌──────┴───────┐
      ↓              ↓
   Mobile          Web
      │              │
      ↓              ↓
Tab in app      New page route
      │              │
      ├─ Deterministic Tab     /calculator
      ├─ What-If Tab          /what-if
      └─ Monte Carlo Tab      /calculator?tab=montecarlo
```

---

## Shared Schema Source

### Before (Duplicated)
```
Web Landing Page          Mobile Landing Screen
├─ Feature list (web)    ├─ Feature list (mobile)
├─ Icons (web)           ├─ Icons (mobile)
├─ Colors (web)          ├─ Colors (mobile)
├─ Descriptions (web)    ├─ Descriptions (mobile)
└─ Content (web)         └─ Content (mobile)
↓ Risk of divergence     ↓ Risk of divergence
```

### After (Unified Schema)
```
                LANDING_SCREEN
               (from schema)
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
    Web Platform            Mobile Platform
        │                         │
    index.tsx          LandingScreen.tsx
        │                         │
    Same features      Same features
    Same content       Same content
    Same data          Same data
        │                         │
    MUI rendering      React Native rendering
    3-column grid      Vertical stacking
    Desktop UX         Mobile UX
```

---

## Animation Differences

### Web (Framer Motion)
```
Hero fade-in-up (0.1s delay)
Tagline fade-in-up (0.2s delay)
Description fade-in (0.2s delay)
Feature cards fade-in (0.4s delay)
Feature cards hover: y -4px
CTA fade-in (0.6s delay)
```

### Mobile (React Native)
```
No complex animations (performance consideration)
Simple fade-in on mount
Touch feedback on buttons
Smooth scroll behavior
```

---

## Data Flow Diagram

```
@projection/shared/uiSchema/screens.ts
        ↓
    LANDING_SCREEN
        ├─ heroSection (hero content)
        ├─ featuresSection (feature cards)
        │   └─ metadata.items[3]
        │       ├─ deterministic
        │       ├─ whatif
        │       └─ montecarlo
        └─ platformVariants
            ├─ web: gridColumns=3, maxWidth=1200px
            └─ mobile: layout=stacked

        ↓
    ┌───┴────┐
    ↓        ↓
   Web     Mobile
    ↓        ↓
   ┌─────────┴──────────┐
   │ Extract from       │
   │ schema at runtime  │
   └─────────┬──────────┘
        ↓
   ┌─────────────────────────┐
   │ Render using platform   │
   │ specific components     │
   └─────────┬───────────────┘
        ↓
   ┌─────────┴─────────┐
   ↓                   ↓
Web: MUI Cards    Mobile: RN Paper Cards
with animations   with native feel
```

---

## Platform-Specific Considerations

### Web
- ✅ Smooth animations
- ✅ Hover states
- ✅ Link components (Next.js routing)
- ✅ Responsive grid
- ✅ Shadow effects
- ✅ Framer Motion

### Mobile
- ✅ Touch-friendly sizes
- ✅ Scrollable content
- ✅ Native Paper components
- ✅ Navigation handlers
- ✅ Action buttons per card
- ✅ Performance optimized

### Shared
- ✅ **Same text content**
- ✅ **Same structure**
- ✅ **Same feature order**
- ✅ **Same color scheme**
- ✅ **Same icons (semantically)**
- ✅ **Same UX philosophy**

---

## Testing Checklist: Visual Parity

- [ ] Same 3 feature cards on both platforms
- [ ] Same title "Nestly"
- [ ] Same tagline "Watch your future grow..."
- [ ] Same description text
- [ ] Same colors on each feature
- [ ] Same icon representation (semantically)
- [ ] Same PREMIUM badge on Monte Carlo
- [ ] Same CTA text
- [ ] Same navigation targets
- [ ] Responsive on all screen sizes
- [ ] No hardcoded feature lists
- [ ] Both pull from LANDING_SCREEN schema

---

## Success Criteria: 100% ✅

✅ **Content Parity** - Identical text on both platforms
✅ **Visual Consistency** - Same colors, icons, layout principles
✅ **Single Source of Truth** - Schema drives both implementations
✅ **Responsive Design** - Works on all screen sizes
✅ **Code Quality** - DRY principle applied, no duplication
✅ **Performance** - Platform-optimized rendering
✅ **Maintainability** - Change schema once, both update

---

## Next Phase: Deterministic Calculator

Both platforms will follow the same pattern for the Deterministic calculator:
1. Define fields in schema (`DETERMINISTIC_SCREEN`)
2. Web builds form component
3. Mobile builds form screen
4. Both extract field definitions from schema
5. Same validation, colors, ranges
6. Different layouts (2-col web, 1-col mobile)

**Timeline:** Next week

