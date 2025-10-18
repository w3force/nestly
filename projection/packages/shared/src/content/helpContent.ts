/**
 * Help Content Types
 * Shared help content for tooltips and help modals across web and mobile
 */

/**
 * Help topic structure
 */
export interface HelpTopic {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  examples?: string[];
  relatedTopics?: string[];
  category: HelpCategory;
}

/**
 * Help categories for organization
 */
export type HelpCategory =
  | 'monte-carlo'
  | 'social-security'
  | 'medicare'
  | 'what-if'
  | 'retirement'
  | 'general';

/**
 * Help content for a specific UI element
 */
export interface HelpContent {
  title: string;
  description: string;
  tip?: string;
}

/**
 * Comprehensive help topics database
 */
export const HELP_TOPICS: Record<string, HelpTopic> = {
  // Monte Carlo Topics
  monteCarlo: {
    id: 'monteCarlo',
    title: 'Monte Carlo Simulation',
    category: 'monte-carlo',
    shortDescription: 'Run thousands of scenarios to understand retirement outcome probabilities.',
    fullDescription:
      'Monte Carlo simulation runs thousands of different scenarios with varying investment returns to show you a range of possible retirement outcomes. Instead of one single projection, you see the probability distribution of outcomes. This helps you understand risk and prepare for uncertainty in your retirement plan.',
    examples: [
      'Run 10,000 simulations to see your chances of reaching $1M by age 65',
      'Compare conservative vs aggressive strategies to understand risk/reward',
      'Set a retirement spending goal to calculate success probability',
    ],
    relatedTopics: ['expectedReturn', 'volatility', 'percentiles', 'successProbability'],
  },
  expectedReturn: {
    id: 'expectedReturn',
    title: 'Expected Return',
    category: 'monte-carlo',
    shortDescription: 'Average annual investment return you expect.',
    fullDescription:
      'Expected return is the average annual percentage gain you anticipate from your investments. Historical stock market returns average ~7-10% nominal (before inflation). Conservative portfolios might expect 4-6%, moderate 6-8%, and aggressive 8-10%. This is the mean of the return distribution in Monte Carlo simulations.',
    examples: [
      'Conservative (bonds heavy): 5% expected return',
      'Moderate (60/40 stocks/bonds): 7% expected return',
      'Aggressive (stocks heavy): 9% expected return',
    ],
    relatedTopics: ['volatility', 'realReturn', 'inflation'],
  },
  volatility: {
    id: 'volatility',
    title: 'Return Volatility (Risk)',
    category: 'monte-carlo',
    shortDescription: 'How much investment returns fluctuate year-to-year.',
    fullDescription:
      'Volatility measures how much your returns vary from year to year. Higher volatility means more uncertainty and wider range of outcomes. Stocks have ~15-20% volatility, bonds ~5-10%. In Monte Carlo simulations, volatility determines the spread between best-case and worst-case scenarios.',
    examples: [
      'Conservative (low volatility): 8% - stable but lower returns',
      'Moderate (medium volatility): 15% - balanced risk/reward',
      'Aggressive (high volatility): 22% - high risk, high potential reward',
    ],
    relatedTopics: ['expectedReturn', 'percentiles', 'riskProfile'],
  },
  percentiles: {
    id: 'percentiles',
    title: 'Percentiles (p5, p50, p95)',
    category: 'monte-carlo',
    shortDescription: 'Show best-case, median, and worst-case outcomes.',
    fullDescription:
      'Percentiles show the distribution of possible outcomes:\n\n• p5 (5th percentile): Worst-case scenario - only 5% of outcomes are worse\n• p25 (25th percentile): Below-average outcome\n• p50 (50th percentile): Median - the middle outcome, most likely\n• p75 (75th percentile): Above-average outcome\n• p95 (95th percentile): Best-case scenario - only 5% of outcomes are better\n\nFocus on the median (p50) as your expected outcome, but plan for the worst case (p5).',
    examples: [
      'p50 = $1M: Half of simulations end with more, half with less',
      'p5 = $400k: Even in bad scenarios, you have at least this much',
      'p95 = $2M: In great scenarios, you could have this much',
    ],
    relatedTopics: ['monteCarlo', 'volatility', 'successProbability'],
  },
  successProbability: {
    id: 'successProbability',
    title: 'Success Probability',
    category: 'monte-carlo',
    shortDescription: 'Likelihood of meeting your retirement spending goal.',
    fullDescription:
      'Success probability is the percentage of simulations where your savings last throughout retirement. Set a retirement spending goal (e.g., $60k/year for 30 years) and the simulation calculates how often you achieve it.\n\n• 90%+ : Excellent - very likely to meet goal\n• 75-89%: Good - likely to meet goal\n• 50-74%: Fair - consider increasing contributions\n• 25-49%: Concerning - significant changes needed\n• <25%: High risk - major adjustments required',
    examples: [
      '85% probability with $60k/year spending goal',
      'Increase contributions 5% → raises probability to 92%',
      'Retire 2 years later → raises probability to 88%',
    ],
    relatedTopics: ['monteCarlo', 'retirementSpending', 'withdrawalRate'],
  },
  inflation: {
    id: 'inflation',
    title: 'Inflation Rate',
    category: 'monte-carlo',
    shortDescription: 'Annual increase in cost of living.',
    fullDescription:
      'Inflation erodes purchasing power over time. Historical US inflation averages ~3%. This means $100 today will only buy $97 worth of goods next year. In retirement planning, we adjust for inflation to show "real" (inflation-adjusted) values. Always plan in real terms to understand true purchasing power.',
    examples: [
      'Low inflation (2%): More stable purchasing power',
      'Historical average (3%): Standard planning assumption',
      'High inflation (4-5%): Reduces real returns significantly',
      '$1M in 30 years with 3% inflation = $412k in today\'s dollars',
    ],
    relatedTopics: ['realReturn', 'expectedReturn', 'retirementSpending'],
  },
  glidepath: {
    id: 'glidepath',
    title: 'Glidepath (Target-Date Fund)',
    category: 'monte-carlo',
    shortDescription: 'Automatically reduce risk as you approach retirement.',
    fullDescription:
      'A glidepath gradually shifts your portfolio from aggressive (stocks) to conservative (bonds) as you near retirement. This reduces volatility when you have less time to recover from market downturns. Target-date funds use this strategy automatically.\n\nWith glidepath enabled:\n• Young investors: 90% stocks, 10% bonds (high return, high risk)\n• Mid-career: 70% stocks, 30% bonds (balanced)\n• Near retirement: 50% stocks, 50% bonds (lower risk)',
    examples: [
      'Age 30: 9% return, 20% volatility',
      'Age 45: 7.5% return, 15% volatility',
      'Age 60: 6% return, 10% volatility',
    ],
    relatedTopics: ['volatility', 'expectedReturn', 'riskProfile'],
  },
  riskProfile: {
    id: 'riskProfile',
    title: 'Risk Profiles',
    category: 'monte-carlo',
    shortDescription: 'Pre-configured investment strategies based on risk tolerance.',
    fullDescription:
      'Risk profiles are preset combinations of expected return and volatility:\n\n**Conservative**: Lower returns (5%) with less volatility (8%)\n• Best for: Near-retirees (5-10 years), risk-averse investors\n• Pros: Stable, predictable outcomes\n• Cons: Lower growth potential\n\n**Moderate**: Balanced returns (7%) with medium volatility (15%)\n• Best for: Mid-career (10-20 years), balanced investors\n• Pros: Good balance of growth and stability\n• Cons: Some year-to-year fluctuation\n\n**Aggressive**: Higher returns (9%) with more volatility (22%)\n• Best for: Young investors (20+ years), risk-tolerant\n• Pros: Maximum growth potential\n• Cons: Large swings, requires patience',
    examples: [
      'Conservative: Near retirement, need stability',
      'Moderate: 15 years to retirement, want balance',
      'Aggressive: 30 years old, maximize growth',
    ],
    relatedTopics: ['expectedReturn', 'volatility', 'glidepath'],
  },

  // Social Security Topics
  claimingAge: {
    id: 'claimingAge',
    title: 'Social Security Claiming Age',
    category: 'social-security',
    shortDescription: 'When you start taking Social Security benefits (62-70).',
    fullDescription:
      'You can claim Social Security between ages 62 and 70. Your Full Retirement Age (FRA) depends on birth year (66-67 for most). Benefits are permanently reduced if claimed early, or increased if delayed.\n\n• Age 62 (earliest): ~30% reduction from FRA amount\n• Age 66-67 (FRA): 100% of calculated benefit\n• Age 70 (latest): ~24% increase from FRA amount (8% per year delayed)\n\nDelaying increases your monthly benefit permanently, which is especially valuable if you live a long life.',
    examples: [
      'FRA benefit: $2,000/month → Age 62: $1,400/month → Age 70: $2,480/month',
      'Break-even: Delaying to 70 pays off if you live past ~82',
      'Married couples: Higher earner should often delay to maximize survivor benefit',
    ],
    relatedTopics: ['fullRetirementAge', 'spousalBenefit', 'survivorBenefit', 'longevity'],
  },
  fullRetirementAge: {
    id: 'fullRetirementAge',
    title: 'Full Retirement Age (FRA)',
    category: 'social-security',
    shortDescription: 'Age at which you receive 100% of your calculated Social Security benefit.',
    fullDescription:
      'Full Retirement Age (FRA) is the age when you qualify for 100% of your Social Security benefit. It depends on your birth year:\n\n• Born 1943-1954: FRA is 66\n• Born 1955: FRA is 66 and 2 months\n• Born 1956: FRA is 66 and 4 months\n• Born 1957: FRA is 66 and 6 months\n• Born 1958: FRA is 66 and 8 months\n• Born 1959: FRA is 66 and 10 months\n• Born 1960 or later: FRA is 67\n\nClaiming before FRA permanently reduces benefits. Delaying past FRA increases benefits by 8% per year until age 70.',
    examples: [
      'Born 1960, FRA 67: Claim at 62 = 70% of benefit, claim at 70 = 124% of benefit',
    ],
    relatedTopics: ['claimingAge', 'primaryInsuranceAmount'],
  },
  primaryInsuranceAmount: {
    id: 'primaryInsuranceAmount',
    title: 'Primary Insurance Amount (PIA)',
    category: 'social-security',
    shortDescription: 'Your base Social Security benefit at Full Retirement Age.',
    fullDescription:
      'Primary Insurance Amount (PIA) is your monthly Social Security benefit if you claim at Full Retirement Age. It\'s calculated from your highest 35 years of earnings, adjusted for inflation.\n\nThe calculation uses "bend points" to favor lower earners:\n• First $1,115 of average monthly earnings: 90% replacement\n• $1,115 - $6,721: 32% replacement\n• Above $6,721: 15% replacement\n\nYour actual benefit depends on when you claim relative to FRA.',
    examples: [
      'Career average $60k/year → ~$2,000/month PIA',
      'Career average $100k/year → ~$3,000/month PIA',
      'Career average $160k+ (max): ~$3,800/month PIA',
    ],
    relatedTopics: ['fullRetirementAge', 'claimingAge', 'earningsHistory'],
  },
  spousalBenefit: {
    id: 'spousalBenefit',
    title: 'Spousal Benefit',
    category: 'social-security',
    shortDescription: 'Benefit based on your spouse\'s work record.',
    fullDescription:
      'If you\'re married, you can receive a spousal benefit worth up to 50% of your spouse\'s Primary Insurance Amount (PIA) at their Full Retirement Age. You must be at least 62 and your spouse must have filed for their benefit.\n\nYou receive the higher of:\n• Your own benefit based on your work record\n• Spousal benefit (up to 50% of spouse\'s PIA)\n\nIf you claim before your FRA, the spousal benefit is reduced. Delaying past FRA does NOT increase spousal benefits (unlike your own benefit).',
    examples: [
      'Your benefit: $1,000/month, Spouse\'s PIA: $3,000/month → You get $1,500/month (50% of spouse)',
      'Your benefit: $2,000/month, Spouse\'s PIA: $3,000/month → You get $2,000/month (your own is higher)',
    ],
    relatedTopics: ['primaryInsuranceAmount', 'survivorBenefit', 'claimingAge'],
  },
  survivorBenefit: {
    id: 'survivorBenefit',
    title: 'Survivor Benefit',
    category: 'social-security',
    shortDescription: 'Benefit for widows/widowers based on deceased spouse\'s record.',
    fullDescription:
      'When a spouse dies, the surviving spouse receives the higher of their own benefit or the deceased spouse\'s benefit (including any delayed retirement credits). This is why higher earners often delay claiming - to maximize the survivor benefit.\n\nKey points:\n• Survivor gets 100% of deceased\'s benefit (not just 50% like spousal)\n• If deceased delayed past FRA, survivor gets those higher amounts\n• Can claim survivor benefit as early as age 60 (50 if disabled)\n• Can switch between survivor and own benefit at different ages',
    examples: [
      'Higher earner delays to 70 ($3,500/month) → survivor gets $3,500/month for life',
      'Higher earner claims at 62 ($2,400/month) → survivor only gets $2,400/month',
      'Claim survivor benefit at 60, switch to own benefit at 70 if it\'s higher',
    ],
    relatedTopics: ['spousalBenefit', 'claimingAge', 'longevity'],
  },

  // Medicare Topics
  medicarePartA: {
    id: 'medicarePartA',
    title: 'Medicare Part A (Hospital Insurance)',
    category: 'medicare',
    shortDescription: 'Covers inpatient hospital stays, skilled nursing, hospice.',
    fullDescription:
      'Medicare Part A covers:\n• Inpatient hospital care\n• Skilled nursing facility care (limited)\n• Hospice care\n• Home health care (limited)\n\nMost people get Part A premium-free if they or their spouse paid Medicare taxes for 10+ years. You\'re automatically enrolled at 65 if receiving Social Security. There\'s a deductible ($1,600/year in 2024) per benefit period.',
    examples: [
      'Hospital stay: Part A covers after $1,600 deductible',
      'Skilled nursing: First 20 days fully covered, days 21-100 have copay',
    ],
    relatedTopics: ['medicarePartB', 'medicareEnrollment', 'medicareCosts'],
  },
  medicarePartB: {
    id: 'medicarePartB',
    title: 'Medicare Part B (Medical Insurance)',
    category: 'medicare',
    shortDescription: 'Covers doctor visits, outpatient care, preventive services.',
    fullDescription:
      'Medicare Part B covers:\n• Doctor visits and outpatient care\n• Preventive services (screenings, vaccines)\n• Ambulance services\n• Durable medical equipment\n• Mental health care\n\nPart B has a monthly premium ($174.70 in 2024 for most) and annual deductible ($240 in 2024). After deductible, you typically pay 20% coinsurance. High earners pay IRMAA surcharges on top of base premium.',
    examples: [
      'Doctor visit: Pay $240 deductible, then 20% of Medicare-approved amount',
      'Preventive care: Annual wellness visit, flu shot - no cost',
    ],
    relatedTopics: ['medicarePartA', 'irmaa', 'medigap', 'medicareAdvantage'],
  },
  irmaa: {
    id: 'irmaa',
    title: 'IRMAA (Income-Related Monthly Adjustment Amount)',
    category: 'medicare',
    shortDescription: 'Extra Medicare premium for high earners.',
    fullDescription:
      'IRMAA is an extra premium paid by high-income Medicare beneficiaries for Part B and Part D. Based on Modified Adjusted Gross Income (MAGI) from 2 years ago.\n\n2024 IRMAA brackets (individual/married filing jointly):\n• <$103k / <$206k: $0 (standard premium only)\n• $103-129k / $206-258k: +$69.90/month\n• $129-161k / $258-322k: +$174.70/month\n• $161-193k / $322-386k: +$279.50/month\n• $193-500k / $386-750k: +$384.30/month\n• >$500k / >$750k: +$419.30/month\n\nStrategies to reduce IRMAA: Roth conversions, tax-loss harvesting, charitable giving.',
    examples: [
      'Single, $150k income → +$174.70/month extra ($2,096/year)',
      'Married, $250k income → +$69.90/month extra ($838/year)',
      'Reduce MAGI below threshold to avoid surcharge',
    ],
    relatedTopics: ['medicarePartB', 'medicarePartD', 'magi'],
  },
  medicareEnrollment: {
    id: 'medicareEnrollment',
    title: 'Medicare Enrollment Periods',
    category: 'medicare',
    shortDescription: 'When you can sign up for Medicare.',
    fullDescription:
      'Medicare enrollment periods:\n\n**Initial Enrollment Period (IEP)**: 7-month window around your 65th birthday\n• 3 months before birth month\n• Birth month\n• 3 months after birth month\n\n**General Enrollment Period (GEP)**: Jan 1 - Mar 31 each year\n• For those who missed IEP\n• Coverage starts July 1\n• May have late enrollment penalty\n\n**Special Enrollment Period (SEP)**: When you lose employer coverage\n• 8 months to enroll without penalty\n• Must enroll before or within 8 months after coverage ends\n\nMissing deadlines can result in permanent premium penalties!',
    examples: [
      'Turn 65 in June → IEP is March - September',
      'Still working at 65 with employer insurance → can delay Part B without penalty',
      'Retire at 67, lose employer coverage → have 8 months to enroll',
    ],
    relatedTopics: ['medicarePartA', 'medicarePartB', 'lateEnrollmentPenalty'],
  },

  // What-If Topics
  whatIfScenarios: {
    id: 'whatIfScenarios',
    title: 'What-If Scenarios',
    category: 'what-if',
    shortDescription: 'Compare different retirement strategies side-by-side.',
    fullDescription:
      'What-If scenarios let you test different retirement strategies by adjusting key parameters:\n• Retirement age\n• Savings rate\n• Expected return\n• Inflation assumptions\n• Current savings\n\nCreate multiple scenarios (baseline + up to 5 alternatives) to compare outcomes visually. This helps answer questions like "What if I save 5% more?" or "What if I retire 2 years later?"',
    examples: [
      'Baseline: Current plan → $1.2M at 65',
      'What-If #1: +5% savings rate → $1.5M at 65 (+$300k!)',
      'What-If #2: Retire at 67 instead of 65 → $1.4M (+$200k)',
    ],
    relatedTopics: ['savingsRate', 'retirementAge', 'compoundGrowth'],
  },
  savingsRate: {
    id: 'savingsRate',
    title: 'Savings Rate',
    category: 'what-if',
    shortDescription: 'Percentage of income contributed to retirement.',
    fullDescription:
      'Savings rate is the percentage of your gross income you contribute to retirement accounts. Higher savings rates dramatically accelerate retirement readiness.\n\nRules of thumb:\n• 10-15%: Standard recommendation (including employer match)\n• 15-20%: Aggressive saver\n• 20%+: Early retirement path\n\nIncreasing savings rate by just 5% can add hundreds of thousands to your retirement nest egg.',
    examples: [
      '$100k income, 10% savings → $10k/year contribution',
      '$100k income, 15% savings → $15k/year contribution ($5k more!)',
      'Over 30 years at 7% return: 10% = $945k, 15% = $1.4M (50% more!)',
    ],
    relatedTopics: ['whatIfScenarios', 'compoundGrowth', 'employerMatch'],
  },
  compoundGrowth: {
    id: 'compoundGrowth',
    title: 'Compound Growth',
    category: 'retirement',
    shortDescription: 'Earning returns on your returns - the power of time.',
    fullDescription:
      'Compound growth means your investment earnings generate their own earnings over time. This is why starting early is so powerful.\n\nExample: $10k invested at 7% annual return:\n• Year 1: $10,700 (+$700)\n• Year 10: $19,672 (+$9,672)\n• Year 30: $76,123 (+$66,123)\n• Year 40: $149,745 (+$139,745!)\n\nEarly contributions have more time to compound, making them exponentially more valuable than later contributions.',
    examples: [
      'Save $5k/year ages 25-35 (10 years) = $700k at 65',
      'Save $5k/year ages 35-65 (30 years) = $500k at 65',
      'Starting 10 years earlier with less total saved = more money!',
    ],
    relatedTopics: ['expectedReturn', 'savingsRate', 'timeHorizon'],
  },
  realReturn: {
    id: 'realReturn',
    title: 'Real Return (Inflation-Adjusted)',
    category: 'retirement',
    shortDescription: 'Investment return after accounting for inflation.',
    fullDescription:
      'Real return is your investment return minus inflation. It represents true purchasing power growth.\n\nFormula: Real Return ≈ Nominal Return - Inflation\n\nExample:\n• Nominal return: 7%\n• Inflation: 3%\n• Real return: ~4%\n\nAlways plan in real (inflation-adjusted) terms to understand your actual purchasing power in retirement.',
    examples: [
      '7% nominal return, 3% inflation → 4% real return',
      '$1M portfolio earning 4% real → maintains purchasing power',
      'Focus on real returns for retirement planning accuracy',
    ],
    relatedTopics: ['expectedReturn', 'inflation', 'purchasingPower'],
  },
};

/**
 * Get help topic by ID
 */
export function getHelpTopic(id: string): HelpTopic | undefined {
  return HELP_TOPICS[id];
}

/**
 * Get help topics by category
 */
export function getHelpTopicsByCategory(category: HelpCategory): HelpTopic[] {
  return Object.values(HELP_TOPICS).filter((topic) => topic.category === category);
}

/**
 * Search help topics
 */
export function searchHelpTopics(query: string): HelpTopic[] {
  const lowercaseQuery = query.toLowerCase();
  return Object.values(HELP_TOPICS).filter(
    (topic) =>
      topic.title.toLowerCase().includes(lowercaseQuery) ||
      topic.shortDescription.toLowerCase().includes(lowercaseQuery) ||
      topic.fullDescription.toLowerCase().includes(lowercaseQuery)
  );
}
