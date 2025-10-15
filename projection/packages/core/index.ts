export { ZustandProvider } from './src/store';
export { useProjectionStore } from './src/store';
export interface ProjectionInput {
  initialBalance: number;
  annualContribution: number;
  years: number;
  annualReturn: number; // as decimal, e.g. 0.07
  inflation: number; // as decimal, e.g. 0.025
}

export interface ProjectionResult {
  nominalBalances: number[];
  realBalances: number[];
}

export function simulateDeterministic({
  initialBalance,
  annualContribution,
  years,
  annualReturn,
  inflation,
}: ProjectionInput): ProjectionResult {
  const nominalBalances: number[] = [initialBalance];
  const realBalances: number[] = [initialBalance];
  for (let i = 1; i <= years; i++) {
    const prev = nominalBalances[i - 1];
    const next = prev * (1 + annualReturn) + annualContribution;
    nominalBalances.push(next);
    // Inflation adjustment
    const real = next / Math.pow(1 + inflation, i);
    realBalances.push(real);
  }
  return { nominalBalances, realBalances };
}
