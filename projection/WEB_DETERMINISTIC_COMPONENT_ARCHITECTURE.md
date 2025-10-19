# Web Deterministic - Component Architecture

## 🏗️ Component Structure

```
┌─ DeterministicForm (Existing - Will be enhanced)
│
├─ Personal Information Section
│  ├─ SectionCard (NEW)
│  │  ├─ Title: "Personal Information"
│  │  ├─ Step: 1
│  │  ├─ Status: ✓/◐/◯
│  │  └─ Content:
│  │     ├─ EnhancedTextField (ENHANCED)
│  │     │  ├─ Field: Age
│  │     │  ├─ Validation: ✓/⚠️
│  │     │  └─ Derived: (Shows years to retirement)
│  │     │
│  │     └─ EnhancedTextField
│  │        ├─ Field: Retirement Age
│  │        ├─ Validation: ✓
│  │        └─ Help: (Contextual info)
│  │
│  └─ HelpPanel (NEW)
│     ├─ Title: "Why This Matters"
│     ├─ Content: "30 years of compound growth..."
│     ├─ Examples: "If you start at 30 vs 40..."
│     └─ RelatedFields: "Affects: Contribution limit, Social Security"
│
├─ Savings & Contributions Section
│  ├─ SectionCard (NEW)
│  │  ├─ Title: "Savings & Contributions"
│  │  ├─ Step: 2
│  │  ├─ Status: ◐
│  │  ├─ CompletionPercent: 67%
│  │  └─ Content:
│  │     ├─ EnhancedTextField
│  │     │  ├─ Field: Current Balance
│  │     │  ├─ Validation: ✓
│  │     │  ├─ DerivedValue: "Years to save: 30"
│  │     │  └─ Help: "Include all 401k accounts"
│  │     │
│  │     └─ UnifiedNumberInput (NEW - Major component)
│  │        ├─ Field: Annual Contribution
│  │        ├─ InputMethods:
│  │        │  ├─ TextField: [input]
│  │        │  ├─ Slider: [═════●═════]
│  │        │  ├─ Presets:
│  │        │  │  ├─ Button: "Min" ($500)
│  │        │  │  ├─ Button: "Avg" ($15,000)
│  │        │  │  ├─ Button: "Max" ($23,500)
│  │        │  │  └─ Button: "Custom"
│  │        │  └─ HistoricalRef: "S&P 500 avg..."
│  │        │
│  │        ├─ ValidationFeedback: "✓ At IRS limit"
│  │        ├─ DerivedValue: "Annual growth: ~$2,000"
│  │        └─ Help: "Can contribute up to $23,500/year"
│  │
│  └─ HelpPanel (NEW)
│     ├─ Benchmarks: Table of savings levels
│     ├─ Tips: "Maximize your employer match"
│     └─ Links: "IRS contribution limits"
│
├─ Investment Strategy Section
│  ├─ SectionCard (NEW)
│  │  ├─ Title: "Investment Strategy"
│  │  ├─ Step: 3
│  │  ├─ Status: ◯
│  │  └─ Content:
│  │     ├─ ReturnRateSlider (ENHANCED)
│  │     │  ├─ Title: "Expected Return Rate"
│  │     │  ├─ CurrentValue: 8.5%
│  │     │  ├─ Badge: "Moderate Growth"
│  │     │  ├─ Slider with Milestones:
│  │     │  │  ├─ 0% ├─────O──────┤ 15%
│  │     │  │  │         ↓
│  │     │  │  │    Milestone: 8%
│  │     │  │  │    Based on: S&P 500
│  │     │  │  │    Your match: ✓ Exactly
│  │     │  │  └─ Implication: Realistic
│  │     │  │
│  │     │  ├─ PresetButtons:
│  │     │  │  ├─ [5% - Low]
│  │     │  │  ├─ [8% - Average]
│  │     │  │  └─ [12% - High]
│  │     │  │
│  │     │  ├─ ManualInput: [8.5]%
│  │     │  └─ Help: "1950-2024 S&P 500 avg..."
│  │     │
│  │     └─ InflationSlider (ENHANCED)
│  │        ├─ Title: "Inflation Rate"
│  │        ├─ CurrentValue: 2.5%
│  │        ├─ Badge: "Target"
│  │        ├─ Slider with Milestones
│  │        ├─ PresetButtons
│  │        ├─ ManualInput
│  │        └─ Help: "Affects real purchasing power..."
│  │
│  └─ HelpPanel (NEW)
│     ├─ Section: "Milestone Meanings"
│     ├─ Examples: "What 8% return means"
│     └─ Tips: "Historical vs projected returns"
│
├─ Preview Card (NEW - Major new feature)
│  ├─ UpdateTrigger: "Real-time as user adjusts"
│  ├─ CalculationEngine: (connects to backend)
│  ├─ Display:
│  │  ├─ Title: "Quick Preview"
│  │  ├─ Result: "$1,245,000 at age 65"
│  │  ├─ Longevity: "Will last 28 years (age 93)"
│  │  ├─ MonthlyIncome: "$3,620"
│  │  ├─ ReadinessStatus: "⚠️ Borderline"
│  │  └─ Recommendations: (Dynamic improvement list)
│  │
│  └─ InteractiveElements:
│     ├─ [Try 1 more year of work]
│     ├─ [Try $5K more savings]
│     ├─ [Try higher return target]
│     └─ [Build custom scenario]
│
├─ Form Actions Section
│  ├─ ValidationSummary (NEW)
│  │  ├─ Personal Info: ✓
│  │  ├─ Savings: ◐
│  │  ├─ Strategy: ◯
│  │  └─ OverallStatus: "67% complete"
│  │
│  └─ ActionButtons:
│     ├─ [Calculate Results] (enabled if valid)
│     ├─ [Open What-If] (secondary)
│     └─ [Save Scenario] (tertiary)
│
└─ Results Panel (Redesigned for next page)
   ├─ Portfolio Summary
   ├─ Readiness Assessment
   ├─ Improvement Recommendations
   └─ What-If Scenario Buttons
```

---

## 📦 New Components to Build

### 1. SectionCard Component
```tsx
interface SectionCardProps {
  step: number;
  title: string;
  description?: string;
  completed?: boolean;
  inProgress?: boolean;
  completionPercent?: number;
  children: React.ReactNode;
}

<SectionCard step={1} title="Personal Information" completed={true}>
  {/* Fields */}
</SectionCard>
```

**Responsibilities:**
- Render step indicator (1, 2, 3)
- Show completion status (✓/◐/◯)
- Display completion percentage
- Provide consistent card styling
- Manage expansion/collapse on mobile

**File:** `components/SectionCard.tsx`

---

### 2. UnifiedNumberInput Component
```tsx
interface UnifiedNumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  
  // Input methods
  allowText?: boolean;
  allowSlider?: boolean;
  allowPresets?: boolean;
  
  // Presets
  presets?: Array<{
    label: string;
    value: number;
  }>;
  
  // Milestones
  milestones?: Array<{
    value: number;
    label: string;
    description: string;
  }>;
  
  // Feedback
  validationFeedback?: (value: number) => string;
  derivedValue?: string;
  help?: {
    title: string;
    description: string;
  };
}

<UnifiedNumberInput
  label="Annual Contribution"
  value={contribution}
  onChange={setContribution}
  min={0}
  max={23500}
  step={100}
  suffix="$"
  allowText
  allowSlider
  allowPresets
  presets={[
    { label: "Min", value: 500 },
    { label: "Avg", value: 15000 },
    { label: "Max", value: 23500 },
  ]}
  validationFeedback={(val) => {
    if (val === 23500) return "✓ At IRS limit";
    if (val > 20000) return "✓ Excellent";
    if (val > 10000) return "✓ Good";
    return "⚠️ Consider increasing";
  }}
  derivedValue="Annual growth from contributions: ~$2,000"
/>
```

**Responsibilities:**
- Show text input option
- Show slider option
- Show preset buttons
- Show manual input
- Validate value
- Display feedback
- Show derived values

**File:** `components/UnifiedNumberInput.tsx`

---

### 3. HelpPanel Component
```tsx
interface HelpPanelProps {
  title: string;
  description: string;
  sections?: Array<{
    heading: string;
    content: string;
  }>;
  examples?: Array<{
    label: string;
    description: string;
  }>;
  tips?: Array<string>;
  related?: Array<string>;
  defaultExpanded?: boolean;
}

<HelpPanel
  title="Why Expected Return Matters"
  description="This is the annual return you expect from your investments."
  sections={[
    {
      heading: "Historical Benchmarks",
      content: "S&P 500: 8-10%, Bonds: 4-5%, ..."
    }
  ]}
  examples={[
    { label: "Conservative", description: "5% return, safer" },
    { label: "Moderate", description: "8% return, balanced" },
  ]}
  tips={[
    "Use 30-year historical averages",
    "Be conservative rather than optimistic",
    "Don't use best-case scenarios"
  ]}
/>
```

**Responsibilities:**
- Render help content in collapsible card
- Show examples and tips
- Link to related fields
- Expandable for detailed info
- Collapsible to save space

**File:** `components/HelpPanel.tsx`

---

### 4. PreviewCard Component
```tsx
interface PreviewCardProps {
  isLoading?: boolean;
  projection?: {
    portfolioAtRetirement: number;
    monthlyIncome: number;
    longevityYears: number;
    readinessStatus: "on-track" | "borderline" | "at-risk";
    recommendations: Array<{
      action: string;
      impact: string;
      difficulty: "easy" | "moderate" | "hard";
    }>;
  };
  onTryScenario?: (scenario: string) => void;
}

<PreviewCard
  projection={calculatedProjection}
  onTryScenario={handleScenario}
/>
```

**Responsibilities:**
- Display real-time calculations
- Show readiness status
- List improvement recommendations
- Provide scenario quick-links
- Update without page reload
- Show loading state

**File:** `components/PreviewCard.tsx`

---

### 5. ValidationFeedback Component
```tsx
interface ValidationFeedbackProps {
  status: "valid" | "warning" | "error" | "info";
  message: string;
  icon?: React.ReactNode;
}

<ValidationFeedback
  status="valid"
  message="✓ At IRS contribution limit"
/>
```

**Responsibilities:**
- Display validation status
- Show appropriate icon
- Color-coded feedback
- Inline with input

**File:** `components/ValidationFeedback.tsx`

---

### 6. EnhancedTextField Component
```tsx
interface EnhancedTextFieldProps extends TextFieldProps {
  validation?: (value: string) => "valid" | "warning" | "error";
  derivedValue?: string;
  helpContent?: {
    title: string;
    description: string;
  };
}

<EnhancedTextField
  label="Current Age"
  validation={(val) => parseInt(val) >= 18 ? "valid" : "error"}
  derivedValue="Years to retirement: 30"
  helpContent={{
    title: "Your Current Age",
    description: "Used to calculate..."
  }}
/>
```

**Responsibilities:**
- Wrap MUI TextField
- Add validation display
- Show derived values
- Include help integration
- Maintain existing functionality

**File:** `components/EnhancedTextField.tsx`

---

## 🔄 Enhanced Components

### ReturnRateSlider (ENHANCED)
```tsx
// Add to existing component:
+ Add milestone labels on track
+ Add preset buttons below slider
+ Add derived values
+ Add manual input option
+ Add milestone explanation popup
```

### InflationSlider (ENHANCED)
```tsx
// Add to existing component:
+ Add milestone labels on track
+ Add preset buttons
+ Add validation feedback
+ Add derived values
```

### ContributionSlider (ENHANCED)
```tsx
// Add to existing component:
+ Add preset buttons (Min/Avg/Max)
+ Add IRS limit indicator
+ Add validation feedback
+ Show contribution growth
```

---

## 🎯 Component Relationships

```
DeterministicForm
├── Loop: For each section
│   ├── SectionCard
│   │   ├── EnhancedTextField or UnifiedNumberInput
│   │   ├── ValidationFeedback
│   │   └── HelpPanel
│   │
│   └── Connected to:
│       └── PreviewCard (real-time update)
│
└── Form Actions
    ├── ValidationSummary
    └── ActionButtons
```

---

## 📊 State Management

### New State Needed
```tsx
// Real-time preview calculation
const [preview, setPreview] = useState<ProjectionResult | null>(null);

// Validation status per field
const [validationStatus, setValidationStatus] = useState({
  age: "valid",
  retireAge: "valid",
  balance: "valid",
  contribution: "warning",
  rate: "valid",
  inflation: "valid",
});

// Help visibility
const [expandedHelp, setExpandedHelp] = useState<string | null>(null);

// Selected input methods
const [inputMethods, setInputMethods] = useState({
  contribution: "slider",
  rate: "slider",
  inflation: "slider",
});
```

### Effect Hooks Needed
```tsx
// Recalculate preview on any value change
useEffect(() => {
  calculateProjection({ age, retireAge, balance, contribution, rate, inflation })
    .then(setPreview);
}, [age, retireAge, balance, contribution, rate, inflation]);

// Validate all fields
useEffect(() => {
  const newStatus = {
    age: validateAge(age),
    retireAge: validateRetireAge(retireAge, age),
    balance: validateBalance(balance),
    contribution: validateContribution(contribution),
    rate: validateRate(rate),
    inflation: validateInflation(inflation),
  };
  setValidationStatus(newStatus);
}, [age, retireAge, balance, contribution, rate, inflation]);
```

---

## 🎨 Styling Approach

### CSS-in-JS with MUI
```tsx
const sx = {
  sectionCard: {
    background: 'white',
    border: '1px solid rgba(48, 64, 58, 0.1)',
    borderRadius: 2,
    p: 3,
    mb: 3,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 2,
  },
  validCheckmark: {
    color: '#69B47A',
    fontSize: 24,
  },
  presetButton: {
    variant: 'outlined',
    size: 'small',
    sx: {
      textTransform: 'none',
      borderColor: 'rgba(48, 64, 58, 0.2)',
      '&.selected': {
        backgroundColor: 'rgba(105, 180, 122, 0.1)',
        borderColor: '#69B47A',
        color: '#69B47A',
      },
    },
  },
};
```

---

## ✅ Implementation Checklist

### Components to Create
- [ ] SectionCard
- [ ] UnifiedNumberInput
- [ ] HelpPanel
- [ ] PreviewCard
- [ ] ValidationFeedback
- [ ] EnhancedTextField

### Components to Enhance
- [ ] ReturnRateSlider
- [ ] InflationSlider
- [ ] ContributionSlider
- [ ] DeterministicForm

### Features to Add
- [ ] Real-time preview calculation
- [ ] Field validation feedback
- [ ] Preset buttons
- [ ] Derived value displays
- [ ] Help integration
- [ ] Section progress tracking

### Utilities to Create
- [ ] useFormValidation
- [ ] useCalculationPreview
- [ ] useDerivedValues
- [ ] formatCurrency
- [ ] formatPercent

---

## 🚀 Build Order

1. **Week 1:** Foundation
   - [ ] ValidationFeedback (simplest)
   - [ ] SectionCard (visual structure)
   - [ ] HelpPanel (help content)

2. **Week 2:** Core Input
   - [ ] EnhancedTextField (wraps existing)
   - [ ] UnifiedNumberInput (major component)
   - [ ] Validation utilities

3. **Week 3:** Advanced
   - [ ] PreviewCard (calculation integration)
   - [ ] Enhance existing sliders
   - [ ] Real-time update flow

4. **Week 4:** Polish
   - [ ] Animations
   - [ ] Mobile responsiveness
   - [ ] Accessibility
   - [ ] Performance optimization

---

## 📈 Success Metrics

Track these after implementation:
- Form completion rate: +25%
- Time to complete: -37%
- Help panel opens: +45%
- Mobile usage: +20%
- User satisfaction: +10 NPS points
- Calculation accuracy: +12%

---

## 🎓 Development Tips

1. **Start with SectionCard** - Gets visual foundation in place
2. **Use existing MUI styles** - Maintain consistency
3. **Make components reusable** - Use in multiple places
4. **Test validation early** - Core to user experience
5. **Implement preview last** - Depends on everything else
6. **Mobile first** - Make sure it works on phones
7. **Accessibility throughout** - Don't leave for last

---

Summary: ~6 new components, ~4 enhanced components, ~3 new hooks, ready to build! 🚀
