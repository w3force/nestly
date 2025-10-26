/**
 * Help Content for Mobile App
 * Synced from web app for consistent messaging
 */

export const helpContent = {
  calculator: {
    currentAge: {
      title: "Current Age",
      description: "Your age today. This helps calculate how many years until retirement.",
    },
    retirementAge: {
      title: "Retirement Age",
      description: "The age when you plan to stop working. Common retirement ages are 62-67.",
    },
    currentBalance: {
      title: "Current 401(k) Balance",
      description: "The total amount currently in your 401(k) or retirement account. Include all pre-tax contributions.",
    },
    annualContribution: {
      title: "Annual Contribution",
      description: "How much you (and your employer) contribute each year. Include employer match.",
    },
    contributionRate: {
      title: "Savings Rate",
      description: "Percentage of your income you contribute toward retirement. Boosting this by even 2-3% can dramatically increase your future balance.",
    },
    whatif_income: {
      title: "Annual Income",
      description: "Your household income before taxes. We use this with your savings rate to estimate how many dollars you contribute each year.",
    },
    whatif_target_age: {
      title: "Target Retirement Age",
      description: "The age you would like to retire. Retiring later gives your savings more time to grow and reduces how long they need to last.",
    },
    whatif_target_income: {
      title: "Target Retirement Income",
      description: "The annual spending you want in retirement (today's dollars). We use this to check whether your plan closes the gap to your goal.",
    },
    expectedReturn: {
      title: "Expected Return",
      description: "Average annual growth rate. Conservative: 5-6%, Moderate: 7-8%, Aggressive: 9-10%. Historical stock market average is ~7% after inflation. Recent 401(k) benchmarks: ~8.5% (5-year), ~7.5% (10-year), and ~7.0% (15-year) based on total U.S. stock market returns.",
    },
    salaryGrowth: {
      title: "Salary Growth",
      description: "Expected annual increase in your salary. Typical range: 2-4%. This affects future contributions if they're percentage-based.",
    },
    inflation: {
      title: "Inflation Rate",
      description: "Expected annual inflation. Historical average: 2-3%. This shows what your money will be worth in today's dollars. Recent CPI averages: ~3.6% (5-year), ~2.6% (10-year), and ~2.2% (15-year).",
    },
    deterministic: {
      title: "Deterministic Calculator",
      description: "Shows a single projection based on your exact inputs. Best for quick estimates and planning.",
    },
    monteCarlo: {
      title: "Monte Carlo Simulation",
      description: "Runs 1,000+ scenarios with varying returns to show the range of possible outcomes. Helps you understand risk and prepare for uncertainty.",
    },
  },

  monteCarloInputs: {
    returnVolatility: {
      title: "Return Volatility",
      description: "How much your returns vary year-to-year. Conservative portfolio: 8-12%, Balanced: 12-16%, Aggressive stocks: 16-20%. Higher volatility = more uncertainty.",
    },
    annualFee: {
      title: "Annual Fees",
      description: "Total expense ratio of your investments. Index funds: 0.03-0.20%, Actively managed: 0.5-1.5%. Lower fees = more money for you.",
    },
    numPaths: {
      title: "Number of Simulations",
      description: "How many scenarios to run. More paths = more accurate results but slower. 1,000-5,000 is typical.",
    },
    glidepath: {
      title: "Glidepath Strategy",
      description: "Automatically reduce risk as you age by shifting from stocks to bonds. Recommended for most retirement savers.",
    },
  },

  results: {
    projectionGraph: {
      title: "Projection Graph",
      description: "Shows how your balance grows over time. The higher the line, the more you'll have in retirement.",
    },
    finalBalance: {
      title: "Final Balance at Retirement",
      description: "Total amount in your account when you retire. Use this to plan your retirement lifestyle.",
    },
    realVsNominal: {
      title: "Real vs Nominal Dollars",
      description: "Real = adjusted for inflation (today's buying power). Nominal = actual dollar amount. Real dollars show what you can actually buy.",
    },
    contributionsVsGrowth: {
      title: "Contributions vs Growth",
      description: "Contributions = money you put in. Growth = earnings from investments. Over time, growth becomes the bigger portion.",
    },
  },

  monteCarloResults: {
    percentileFan: {
      title: "Percentile Fan Chart",
      description: "Shows the range of possible outcomes. p50 (median) is most likely. p5-p95 shows the 90% confidence range.",
    },
    successProbability: {
      title: "Success Probability",
      description: "Chance you'll meet or exceed your goal. 70%+ is good, 85%+ is excellent. Below 60% means you may need to adjust your plan.",
    },
    p5: {
      title: "5th Percentile (Worst Case)",
      description: "Only 5% of scenarios do worse. This is your 'bad luck' scenario. Use it to prepare for downturns.",
    },
    p25: {
      title: "25th Percentile (Below Average)",
      description: "25% of scenarios fall below this. A conservative estimate for planning.",
    },
    p50: {
      title: "50th Percentile (Median)",
      description: "Half of scenarios are above, half below. This is your most likely outcome.",
    },
    p75: {
      title: "75th Percentile (Above Average)",
      description: "75% of scenarios fall below this. An optimistic but realistic estimate.",
    },
    p95: {
      title: "95th Percentile (Best Case)",
      description: "Only 5% of scenarios do better. This is your 'good luck' scenario.",
    },
    meanStd: {
      title: "Mean & Standard Deviation",
      description: "Mean = average outcome. Std Dev = typical variation. Larger std dev = more uncertainty.",
    },
  },

  whatIf: {
    simulator: {
      title: "What-If Simulator",
      description: "Compare different scenarios side-by-side. Change one variable at a time to see its impact on your retirement.",
    },
    baseline: {
      title: "Baseline Scenario",
      description: "Your original plan. Compare all other scenarios against this to see the difference.",
    },
    comparison: {
      title: "Scenario Comparison",
      description: "See how changing contributions, returns, or retirement age affects your final balance. The difference shows if you'll be better or worse off.",
    },
  },

  tiers: {
    free: {
      title: "Free Tier",
      description: "Try Nestly without signing up. Perfect for quick calculations and exploring features.",
    },
    standard: {
      title: "Standard Tier",
      description: "Free account with sign-in. Save scenarios, run what-if comparisons, and track your progress over time.",
    },
    premium: {
      title: "Premium Tier",
      description: "Full access to Monte Carlo simulations, unlimited scenarios, AI insights, and advanced features. Best for serious retirement planning.",
    },
    scenarios: {
      title: "Saved Scenarios",
      description: "Save different retirement plans to compare later. Try 'aggressive investing' vs 'conservative' or 'retire early' vs 'work longer'.",
    },
  },

  general: {
    realDollars: {
      title: "Inflation-Adjusted (Real) Dollars",
      description: "Shows what your money will actually buy in the future, adjusted for inflation. $1M in 30 years might only buy what $500K buys today.",
    },
    nominalDollars: {
      title: "Nominal (Future) Dollars",
      description: "The actual number you'll see in your account. Doesn't account for inflation, so it looks bigger but buys less.",
    },
    compounding: {
      title: "Compound Growth",
      description: "Earning returns on your returns. This is why starting early matters so much - your money has more time to multiply.",
    },
  },
};

export type HelpContentKey = keyof typeof helpContent;
