/**
 * What-If Scenario Calculations
 * Retirement projection calculations for scenario comparison
 */

import {
  WhatIfScenario,
  ProjectionPoint,
  ScenarioProjection,
  WhatIfComparison,
} from '../types/whatif';

/**
 * Calculate retirement projection for a scenario
 * Projects from current age to 65 with annual contributions and returns
 */
export function calculateProjection(scenario: WhatIfScenario): ProjectionPoint[] {
  const retirementAge = 65;
  const years = retirementAge - scenario.age;
  
  if (years <= 0) {
    return [{ age: scenario.age, balance: scenario.currentSavings }];
  }

  const data: ProjectionPoint[] = [];
  let balance = scenario.currentSavings;
  
  // Assuming $100k annual income for contribution calculation
  const annualIncome = 100000;
  const savingsRate = scenario.savingsRate ?? scenario.contribution ?? 0;
  const annualContribution = annualIncome * (savingsRate / 100);
  const realReturnRate = (scenario.returnRate - scenario.inflation) / 100;

  for (let year = 0; year <= years; year++) {
    data.push({
      age: scenario.age + year,
      balance: Math.round(balance),
    });
    
    // Apply growth and add contribution (contribution happens at start of year)
    if (year < years) {
      balance = (balance + annualContribution) * (1 + realReturnRate);
    }
  }

  return data;
}

/**
 * Calculate projection with full details
 */
export function getScenarioProjection(scenario: WhatIfScenario): ScenarioProjection {
  const data = calculateProjection(scenario);
  const finalBalance = data[data.length - 1]?.balance || 0;

  return {
    scenario,
    data,
    finalBalance,
  };
}

/**
 * Compare baseline scenario against multiple what-if scenarios
 */
export function compareScenarios(
  baseline: WhatIfScenario,
  scenarios: WhatIfScenario[]
): WhatIfComparison {
  const baselineProjection = getScenarioProjection(baseline);
  const scenarioProjections = scenarios.map(getScenarioProjection);

  const allBalances = [
    baselineProjection.finalBalance,
    ...scenarioProjections.map(p => p.finalBalance),
  ];

  return {
    baseline: baselineProjection,
    scenarios: scenarioProjections,
    maxBalance: Math.max(...allBalances),
    minBalance: Math.min(...allBalances),
  };
}

/**
 * Calculate difference between two scenarios
 */
export function calculateDifference(
  scenario: WhatIfScenario,
  baseline: WhatIfScenario
): number {
  const scenarioData = calculateProjection(scenario);
  const baselineData = calculateProjection(baseline);

  const scenarioFinal = scenarioData[scenarioData.length - 1]?.balance || 0;
  const baselineFinal = baselineData[baselineData.length - 1]?.balance || 0;

  return scenarioFinal - baselineFinal;
}

/**
 * Get color for slider based on value and type
 */
export function getSliderColor(type: 'return' | 'inflation', value: number): string {
  if (type === 'return') {
    // Low return = red, average = teal, high = green
    if (value < 5) return '#FF6B6B';
    if (value <= 8) return '#4ABDAC';
    return '#69B47A';
  } else {
    // Low inflation = green, average = orange, high = red
    if (value < 2) return '#69B47A';
    if (value <= 4) return '#FFB74D';
    return '#FF6B6B';
  }
}
