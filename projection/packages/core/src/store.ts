
// No-op ZustandProvider for compatibility; can be enhanced for SSR or context in the future
import type { ReactNode } from 'react';
export function ZustandProvider({ children }: { children: ReactNode }) {
  return children;
}
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for calculator input and projection result
export interface CalculatorInput {
  age: number;
  retireAge: number;
  balance: number;
  contribution: number;
  rate: number;
  inflation: number;
}

export interface ProjectionResult {
  nominalBalances: number[];
  realBalances: number[];
}

interface ProjectionStore {
  input: CalculatorInput | null;
  setInput: (input: CalculatorInput) => void;
  result: ProjectionResult | null;
  setResult: (result: ProjectionResult | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useProjectionStore = create<ProjectionStore>()(
  persist<ProjectionStore>(
    (set) => ({
      input: null,
      setInput: (input: CalculatorInput) => set(() => ({ input })),
      result: null,
  setResult: (result: ProjectionResult | null) => set(() => ({ result })),
      loading: false,
      setLoading: (loading: boolean) => set(() => ({ loading })),
      reset: () => set(() => ({ input: null, result: null, loading: false })),
    }),
    {
      name: 'projection-store',
    }
  )
);
