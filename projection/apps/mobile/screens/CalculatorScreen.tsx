import React from 'react';
import { DeterministicProvider } from '../contexts/DeterministicContext';
import DeterministicTab from './DeterministicTab';

export default function CalculatorScreen() {
  return (
    <DeterministicProvider>
      <DeterministicTab />
    </DeterministicProvider>
  );
}
