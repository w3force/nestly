# Nestly Web App - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)

### Installation

```bash
# From the project root
cd /Users/vinodhchandrakumar/Downloads/401K/401/projection

# Install dependencies
pnpm install

# Start the FastAPI backend (in one terminal)
cd services/fastapi-calcs
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt
python app.py

# Start the web app (in another terminal)
pnpm --filter web dev
```

The app will be available at `http://localhost:3000`

## 📱 Navigation Flow

### Entry Points

1. **Start Page** (`/start`)
   - First page users see
   - Options:
     - "Try Without Sign-In" → Guest mode (Free tier)
     - "Sign In / Create Account" → Auth page

2. **Landing Page** (`/`)
   - Main feature showcase
   - 3 feature cards:
     - Projection Calculator → `/calculator`
     - What-If Simulator → `/what-if`
     - Monte Carlo (Premium) → `/calculator?tab=montecarlo`

### Main Pages

3. **Calculator** (`/calculator`)
   - Two tabs: Deterministic | Monte Carlo
   - **NEW Features:**
     - "Save as Baseline" button (tier gated)
     - "Open What-If Simulator" button
     - Toast notifications
   - Calculate projections and save scenarios

4. **What-If Simulator** (`/what-if`)
   - Compare multiple scenarios side-by-side
   - Interactive sliders: Age, Savings, Contribution, Return, Inflation
   - Real-time chart updates
   - Year-by-year comparison table
   - Clone and delete scenarios
   - Tier limits enforced

5. **Profile** (`/profile`)
   - 3 tabs:
     - **Account**: User info and tier status
     - **Saved Scenarios**: Manage saved projections
     - **Upgrade**: Tier comparison and upgrade options

6. **Auth** (`/auth`)
   - Demo authentication page
   - Each sign-in method sets a different tier for demo

## 🎯 User Tiers

| Feature | Free | Standard | Premium |
|---------|------|----------|---------|
| **Max Scenarios** | 3 | 5 | Unlimited |
| **Export** | ❌ | 1/month | Unlimited |
| **Monte Carlo** | ❌ | ❌ | ✅ |
| **What-If** | Basic | Basic | Advanced |
| **AI Insights** | ❌ | ❌ | ✅ |

## 🎨 Demo Features

### Guest Mode Testing
1. Go to `/start`
2. Click "Try Without Sign-In"
3. You'll be on Free tier (1 scenario max)
4. Test tier limits by trying to save multiple scenarios

### Tier Upgrade Testing
1. Go to `/profile`
2. Click "Upgrade" tab
3. Click any "Upgrade to..." button
4. Tier changes instantly (demo mode)
5. Test new limits immediately

### What-If Simulator Flow
1. Go to `/calculator`
2. Enter values and calculate
3. Click "Save as Baseline"
4. Click "Open What-If Simulator"
5. Adjust sliders to see comparison
6. Click "+ Add Scenario" tab
7. Try adding more scenarios (will hit tier limit)

## 🔧 Key Features

### State Management
- **UserContext**: Global user tier and scenarios
- **localStorage**: Persists data across sessions
  - `nestly.user.v1`: User tier and info
  - `nestly.scenarios.v1`: Saved scenarios
- **Zustand**: Projection calculations (existing)
- **TanStack Query**: API calls (existing)

### Responsive Design
- Mobile-first approach
- Bottom navigation (on app directory pages)
- Responsive grids (breakpoints: xs, md)
- Touch-friendly controls

### Animations
- Framer Motion for page transitions
- Hover effects on cards
- Smooth chart updates
- Auto-hide toast notifications

## 🐛 Troubleshooting

### Build Issues
```bash
# If build fails, clear Next.js cache
rm -rf apps/web/.next
pnpm --filter web build
```

### Backend Not Running
```bash
# Make sure FastAPI is running on port 8000
cd services/fastapi-calcs
source venv/bin/activate
python app.py

# Should see: "Uvicorn running on http://0.0.0.0:8000"
```

### localStorage Issues
```bash
# Clear localStorage in browser console
localStorage.clear()
# Refresh the page
```

### Page Not Found
- App Router pages: `/start`, `/calculator`, `/what-if`, `/profile`, `/auth`
- Pages Router page: `/` (landing)
- Make sure you're using the correct path

## 📂 File Structure

```
apps/web/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── providers.tsx        # UserProvider, QueryClient, Zustand
│   ├── start/page.tsx       # Entry page
│   ├── calculator/page.tsx  # Calculator (updated)
│   ├── what-if/page.tsx     # What-If Simulator (NEW)
│   ├── profile/page.tsx     # Profile (NEW)
│   └── auth/page.tsx        # Auth (NEW)
├── pages/
│   └── index.tsx            # Landing page (Pages Router)
├── components/
│   ├── FeatureCard.tsx      # Feature card component (NEW)
│   ├── DiffPill.tsx         # Difference indicator (NEW)
│   ├── UpgradeBanner.tsx    # Upgrade CTA (NEW)
│   └── BottomNav.tsx        # Bottom navigation (NEW)
├── contexts/
│   └── UserContext.tsx      # User state management (NEW)
└── lib/
    └── types.ts             # TypeScript types (NEW)
```

## 🎓 Development Tips

### Adding a New Tier Feature
1. Update `TIER_FEATURES` in `lib/types.ts`
2. Add check in `UserContext.getTierFeatures()`
3. Use `canAddScenario()` or create similar function
4. Show `UpgradeBanner` when limit reached

### Creating a New Page
1. Create in `app/your-page/page.tsx` (App Router)
2. Use `"use client"` directive at top
3. Import and use `useUser()` hook
4. Add `<BottomNav />` at bottom
5. Add route to BottomNav component

### Testing Tier Gating
1. Set user tier in Profile → Upgrade
2. Go to Calculator and save scenarios until limit
3. Toast should show tier limit message
4. Upgrade tier in Profile
5. Return to Calculator - should allow more saves

## 📊 Production Checklist

- [ ] Replace demo auth with real provider (Auth0, Clerk, etc.)
- [ ] Add Stripe or payment processor integration
- [ ] Move scenarios to database (Supabase, Firebase, etc.)
- [ ] Add server-side validation
- [ ] Implement real export functionality (PDF/CSV)
- [ ] Add error boundaries
- [ ] Add loading states/skeletons
- [ ] Optimize bundle size
- [ ] Add analytics (Vercel Analytics, GA4)
- [ ] Add accessibility (ARIA labels, keyboard nav)
- [ ] Write unit/integration tests
- [ ] Set up CI/CD pipeline

## 🎉 Happy Planning!

Your Nestly app is ready to help users plan their financial future. All core features are implemented and working. The foundation is solid for adding more advanced features like AI insights, advanced export options, and more!

For detailed technical documentation, see `NESTLY_EXTENSION_PROGRESS.md`.
