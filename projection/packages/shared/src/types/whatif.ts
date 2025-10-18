/**
 * What-If Scenario Types
 * Platform-agnostic types for retirement scenario comparison
 */

export interface WhatIfScenario {
  id: string;
  name: string;
  age: number;                 // Current age
  contribution: number;        // Annual contribution as % of income (0-100)
  returnRate: number;          // Expected annual return % (0-15)
  inflation: number;           // Expected inflation % (0-10)
  currentSavings: number;      // Current balance in dollars
}

export interface ProjectionPoint {
  age: number;
  balance: number;
}

export interface ScenarioProjection {
  scenario: WhatIfScenario;
  data: ProjectionPoint[];
  finalBalance: number;
}

export interface WhatIfComparison {
  baseline: ScenarioProjection;
  scenarios: ScenarioProjection[];
  maxBalance: number;
  minBalance: number;
}

// Default scenarios
export const DEFAULT_BASELINE: WhatIfScenario = {
  id: 'baseline',
  name: 'Baseline',
  age: 30,
  contribution: 10,
  returnRate: 7,
  inflation: 3,
  currentSavings: 50000,
};

export const DEFAULT_WHATIF: WhatIfScenario = {
  id: 'whatif1',
  name: 'What-If 1',
  age: 30,
  contribution: 15,
  returnRate: 8,
  inflation: 3,
  currentSavings: 50000,
};

// Helper to create new scenario
export function createScenario(index: number): WhatIfScenario {
  return {
    id: `whatif${index}`,
    name: `What-If ${index}`,
    age: 30,
    contribution: 10,
    returnRate: 7,
    inflation: 3,
    currentSavings: 50000,
  };
}

// Helper to clone scenario
export function cloneScenario(scenario: WhatIfScenario, newIndex: number): WhatIfScenario {
  return {
    ...scenario,
    id: `whatif${newIndex}`,
    name: `${scenario.name} (Copy)`,
  };
}
