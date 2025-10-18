import React, { createContext, useContext, useState } from 'react';
import { WhatIfScenario } from '@projection/shared';

interface DeterministicBaseline {
  age: number;
  retireAge: number;
  balance: number;
  contribution: number;
  rate: number;
}

interface DeterministicContextType {
  baseline: DeterministicBaseline | null;
  setBaseline: (baseline: DeterministicBaseline) => void;
  clearBaseline: () => void;
}

const DeterministicContext = createContext<DeterministicContextType | undefined>(undefined);

export function DeterministicProvider({ children }: { children: React.ReactNode }) {
  const [baseline, setBaselineState] = useState<DeterministicBaseline | null>(null);

  const setBaseline = (newBaseline: DeterministicBaseline) => {
    setBaselineState(newBaseline);
  };

  const clearBaseline = () => {
    setBaselineState(null);
  };

  return (
    <DeterministicContext.Provider value={{ baseline, setBaseline, clearBaseline }}>
      {children}
    </DeterministicContext.Provider>
  );
}

export function useDeterministicBaseline() {
  const context = useContext(DeterministicContext);
  if (!context) {
    throw new Error('useDeterministicBaseline must be used within DeterministicProvider');
  }
  return context;
}
