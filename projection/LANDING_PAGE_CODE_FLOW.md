# Landing Page Implementation: Complete Code Flow

## How Both Platforms Use the Same Schema

---

## The Schema (Source of Truth)

### File: `packages/shared/src/uiSchema/screens.ts`

```typescript
export const LANDING_SCREEN: ScreenDefinition = {
  id: 'landing',
  name: 'Home',
  description: 'Welcome to Nestly Retirement Projection',
  icon: 'home',

  sections: [
    {
      id: 'hero',
      title: 'Plan Your Retirement with Confidence',
      description: 'Use data-driven calculators to understand your retirement readiness',
      fields: [],
      layout: 'vertical',
    },
    {
      id: 'features',
      title: 'Choose Your Analysis Method',
      description: 'Three ways to analyze your retirement',
      fields: [],
      layout: 'grid',
      metadata: {
        type: 'feature-cards',
        items: [
          {
            id: 'deterministic',
            title: 'Deterministic',
            description: 'Single scenario based on fixed assumptions',
            cta: 'Get Started',
            navigateTo: 'deterministic',
          },
          {
            id: 'whatif',
            title: 'What-If Analysis',
            description: 'Compare multiple scenarios side by side',
            cta: 'Compare Scenarios',
            navigateTo: 'whatif',
          },
          {
            id: 'montecarlo',
            title: 'Monte Carlo',
            description: 'Probability-based analysis with 10,000 simulations',
            cta: 'Run Simulations',
            navigateTo: 'monteCarlo',
          },
        ],
      },
    },
  ],

  buttons: [
    {
      id: 'profile',
      label: 'My Profile',
      type: 'secondary',
      action: 'navigate',
      navigateTo: 'profile',
    },
  ],

  platformVariants: {
    web: {
      layout: 'fullwidth',
      gridColumns: 3,
      maxWidth: '1200px',
    },
    mobile: {
      layout: 'stacked',
      collapseSections: false,
    },
  },
};
```

---

## Implementation 1: Mobile (React Native)

### File: `apps/mobile/screens/LandingScreen.tsx`

#### Step 1: Import Schema
```typescript
import { LANDING_SCREEN } from '@projection/shared';

interface LandingScreenProps {
  onGetStarted: () => void;
  onNavigateTo?: (screen: string) => void;
}

export default function LandingScreen({ onGetStarted, onNavigateTo }: LandingScreenProps) {
  const theme = useTheme();
```

#### Step 2: Extract Hero Section
```typescript
  // Get hero section from schema
  const heroSection = LANDING_SCREEN.sections[0];
  
  // Hero title: "Plan Your Retirement with Confidence"
  // Hero description: "Use data-driven calculators..."
```

#### Step 3: Extract Feature Items
```typescript
  // Get features from schema
  const featuresSection = LANDING_SCREEN.sections[1];
  const featureItems = (featuresSection.metadata?.items || []) as Array<{
    id: string;
    title: string;
    description: string;
    cta: string;
    navigateTo: string;
  }>;
  
  // featureItems now contains:
  // [
  //   { id: 'deterministic', title: 'Deterministic', ... },
  //   { id: 'whatif', title: 'What-If Analysis', ... },
  //   { id: 'montecarlo', title: 'Monte Carlo', ... }
  // ]
```

#### Step 4: Render Hero
```typescript
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#D4F5E5', '#E8F5E9', '#F1F8F4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text variant="displayMedium" style={styles.heroTitle}>
            Nestly
          </Text>
          <Text variant="headlineSmall" style={styles.heroSubtitle}>
            Watch your future grow, one nest at a time.
          </Text>
          <Text variant="bodyLarge" style={styles.heroDescription}>
            {LANDING_SCREEN.description}
            {'\n\n'}
            Nestly helps you project your savings, 401(k), Social Security, Medicare costs, 
            and investments over time — guiding you to build a secure financial future.
          </Text>
        </View>
      </LinearGradient>
```

#### Step 5: Render Feature Cards from Schema
```typescript
      {/* Feature Cards Section */}
      <View style={styles.featuresSection}>
        <Text variant="headlineSmall" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Choose Your Analysis Method
        </Text>

        {/* Iterate through schema items */}
        {featureItems.map((item, index) => {
          // Map item ID to icon name
          const getIcon = () => {
            if (item.id === 'deterministic') return 'calculator';
            if (item.id === 'whatif') return 'compare-arrows';
            if (item.id === 'montecarlo') return 'trending-up';
            return 'information';
          };

          // Map item ID to color
          const getIconColor = () => {
            if (item.id === 'deterministic') return '#69B47A';
            if (item.id === 'whatif') return '#4ABDAC';
            if (item.id === 'montecarlo') return '#FFD54F';
            return theme.colors.primary;
          };

          // Determine if premium
          const isPremium = item.id === 'montecarlo';

          return (
            <Card key={item.id} style={styles.featureCard}>
              <Card.Content style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: getIconColor() + '20' }]}>
                  <Icon source={getIcon()} size={32} color={getIconColor()} />
                </View>
                <View style={styles.featureText}>
                  <View style={styles.featureTitleRow}>
                    <Text variant="titleMedium" style={styles.featureTitle}>
                      {item.title}  {/* "Deterministic", "What-If Analysis", "Monte Carlo" */}
                    </Text>
                    {isPremium && (
                      <View style={styles.premiumBadge}>
                        <Text style={styles.premiumText}>PREMIUM</Text>
                      </View>
                    )}
                  </View>
                  <Text variant="bodyMedium" style={styles.featureDescription}>
                    {item.description}  {/* Schema description */}
                  </Text>
                  <Button
                    mode="outlined"
                    onPress={() => handleNavigate(item.navigateTo)}
                    style={styles.featureCta}
                    labelStyle={styles.featureCtaLabel}
                  >
                    {item.cta}  {/* "Get Started", "Compare Scenarios", "Run Simulations" */}
                  </Button>
                </View>
              </Card.Content>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}
```

#### Step 6: Handle Navigation
```typescript
const handleNavigate = (screen: string) => {
  if (onNavigateTo) {
    onNavigateTo(screen);  // Navigate to 'deterministic', 'whatif', 'monteCarlo'
  } else {
    onGetStarted?.();
  }
};
```

---

## Implementation 2: Web (Next.js)

### File: `apps/web/pages/index.tsx`

#### Step 1: Import Schema
```typescript
import { LANDING_SCREEN } from "@projection/shared";

export default function Home() {
  const router = useRouter();
  const [isGuestMode, setIsGuestMode] = useState(false);
```

#### Step 2: Extract Feature Items
```typescript
  // Get feature items from schema
  const featuresSection = LANDING_SCREEN.sections[1];
  const featureItems = (featuresSection.metadata?.items || []) as Array<{
    id: string;
    title: string;
    description: string;
    cta: string;
    navigateTo: string;
  }>;
```

#### Step 3: Map to Web Components
```typescript
  // Map schema to feature objects with icons and colors
  const features = featureItems.map((item) => {
    // Map item ID to MUI icon component
    const iconMap: Record<string, React.ReactNode> = {
      deterministic: <CalculateIcon sx={{ fontSize: 40 }} />,
      whatif: <CompareArrowsIcon sx={{ fontSize: 40 }} />,
      montecarlo: <AutoGraphIcon sx={{ fontSize: 40 }} />,
    };

    // Map item ID to color
    const colorMap: Record<string, string> = {
      deterministic: "#69B47A",
      whatif: "#4ABDAC",
      montecarlo: "#FFD54F",
    };

    // Map item ID to route
    const hrefMap: Record<string, string> = {
      deterministic: "/calculator",
      whatif: "/what-if",
      montecarlo: "/calculator?tab=montecarlo",
    };

    return {
      title: item.title,
      description: item.description,
      icon: iconMap[item.id] || <CalculateIcon sx={{ fontSize: 40 }} />,
      href: hrefMap[item.id] || "/calculator",
      color: colorMap[item.id] || "#69B47A",
      isPremium: item.id === "montecarlo",
    };
  });
```

#### Step 4: Render Hero Section
```typescript
  return (
    <>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#F5F5F5", pb: 10 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Stack spacing={{ xs: 5, md: 7 }} alignItems="center">
            {/* Hero Section */}
            <Stack spacing={{ xs: 4, md: 5 }} alignItems="center" textAlign="center">
              <Typography variant="h2" sx={{ color: "#30403A", fontWeight: 700 }}>
                Nestly
              </Typography>

              <Typography variant="h5" sx={{ color: "#4ABDAC", fontWeight: 500 }}>
                Watch your future grow, one nest at a time.
              </Typography>

              <Typography variant="body1" sx={{ maxWidth: "48ch", color: "rgba(48, 64, 58, 0.8)" }}>
                Nestly helps you project your savings, 401(k), Social Security, Medicare costs, 
                and investments over time — guiding you to build a secure financial future.
              </Typography>
            </Stack>
```

#### Step 5: Render Feature Cards Grid
```typescript
            {/* Feature Cards - Using Schema */}
            <Grid container spacing={3}>
              {features.map((feature) => (
                <Grid item xs={12} md={4} key={feature.title}>
                  <Card
                    component={Link}
                    href={feature.href}
                    sx={{
                      height: "100%",
                      textDecoration: "none",
                      borderRadius: 3,
                      "&:hover": {
                        borderColor: feature.color,
                        boxShadow: `0 8px 24px ${feature.color}33`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 2,
                            backgroundColor: `${feature.color}22`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: feature.color,
                          }}
                        >
                          {feature.icon}  {/* Dynamic icon from mapping */}
                        </Box>
                        <Stack spacing={1}>
                          <Typography variant="h6" fontWeight={600} color="#30403A">
                            {feature.title}  {/* From schema */}
                            {feature.isPremium && (
                              <Box
                                component="span"
                                sx={{
                                  px: 1,
                                  py: 0.25,
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  borderRadius: 1,
                                  backgroundColor: "#FFD54F",
                                  color: "#30403A",
                                }}
                              >
                                PREMIUM
                              </Box>
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {feature.description}  {/* From schema */}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
```

#### Step 6: Render CTA
```typescript
            {/* CTA Button */}
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
                backgroundColor: "#69B47A",
              }}
            >
              Start Planning Now
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
```

---

## Data Flow Comparison

### Mobile
```
LANDING_SCREEN (schema)
    ↓
Extract heroSection
Extract featuresSection.metadata.items[]
    ↓
Map features to icon names:
  deterministic → 'calculator'
  whatif → 'compare-arrows'
  montecarlo → 'trending-up'
    ↓
Map features to colors:
  deterministic → '#69B47A'
  whatif → '#4ABDAC'
  montecarlo → '#FFD54F'
    ↓
Render React Native Paper Cards
```

### Web
```
LANDING_SCREEN (schema)
    ↓
Extract heroSection
Extract featuresSection.metadata.items[]
    ↓
Map features to MUI icon components:
  deterministic → <CalculateIcon />
  whatif → <CompareArrowsIcon />
  montecarlo → <AutoGraphIcon />
    ↓
Map features to colors:
  deterministic → '#69B47A'
  whatif → '#4ABDAC'
  montecarlo → '#FFD54F'
    ↓
Map features to routes:
  deterministic → '/calculator'
  whatif → '/what-if'
  montecarlo → '/calculator?tab=montecarlo'
    ↓
Render MUI Cards with Grid
```

---

## Key Insights

### 1. Single Schema, Multiple Renderings
```typescript
// The same schema item
{
  id: 'deterministic',
  title: 'Deterministic',
  description: 'Single scenario based on fixed assumptions',
  cta: 'Get Started',
  navigateTo: 'deterministic',
}

// Renders differently on mobile
<Card>
  <Icon name="calculator" />
  <Title>Deterministic</Title>
  <Description>Single scenario...</Description>
  <Button onPress={handleNavigate}>Get Started</Button>
</Card>

// Renders differently on web (but same content)
<MuiCard href="/calculator">
  <CalculateIcon />
  <Title>Deterministic</Title>
  <Description>Single scenario...</Description>
</MuiCard>
```

### 2. Platform-Specific Mappings
```typescript
// Mobile: Icon names (strings)
const mobileIcon = 'calculator';

// Web: Icon components
const webIcon = <CalculateIcon />;

// Both represent the same concept
```

### 3. Navigation Mapping
```typescript
// Schema: navigateTo = 'deterministic'

// Mobile: Maps to screen name
handleNavigate('deterministic')  // Switches to DeterministicTab

// Web: Maps to URL route
href="/calculator"  // Navigates to /calculator page
```

---

## Adding a New Feature (Future)

When you want to add a 4th calculator (e.g., "Tax Optimization"):

### Step 1: Update Schema
```typescript
// In packages/shared/src/uiSchema/screens.ts

items: [
  // ... existing items ...
  {
    id: 'taxoptimization',  // New feature
    title: 'Tax Optimizer',
    description: 'Optimize your tax strategy',
    cta: 'Optimize',
    navigateTo: 'taxoptimization',
  },
]
```

### Step 2: Update Mobile (if needed)
```typescript
// In getIcon()
if (item.id === 'taxoptimization') return 'calculator-check';

// In getIconColor()
if (item.id === 'taxoptimization') return '#5C6BC0';
```

### Step 3: Update Web (if needed)
```typescript
// In iconMap
taxoptimization: <CheckCircleIcon sx={{ fontSize: 40 }} />,

// In colorMap
taxoptimization: "#5C6BC0",

// In hrefMap
taxoptimization: "/tax-optimizer",
```

### Result
✅ New feature appears on both landing pages automatically
✅ No duplicate content to maintain
✅ Both platforms stay in sync

---

## Testing the Implementation

### Mobile Checklist
- [ ] Schema imports correctly
- [ ] Feature items extract correctly
- [ ] Icons render with correct names
- [ ] Colors match (Green, Teal, Yellow)
- [ ] PREMIUM badge shows on item 3
- [ ] Navigation handles work
- [ ] Layout is vertical stacked
- [ ] Scrollable on all screen sizes

### Web Checklist
- [ ] Schema imports correctly
- [ ] Feature items extract correctly
- [ ] Icons render with correct components
- [ ] Colors match (Green, Teal, Yellow)
- [ ] PREMIUM badge shows on card 3
- [ ] Links navigate to correct routes
- [ ] Layout is 3-column grid
- [ ] Responsive on mobile/tablet/desktop

---

## Conclusion

Both platforms use the same schema but render it differently:
- **Schema** = Data (what to show)
- **Mobile** = React Native rendering (native feel)
- **Web** = MUI rendering (web feel)

Result: **Perfect consistency with optimal platform experience**

