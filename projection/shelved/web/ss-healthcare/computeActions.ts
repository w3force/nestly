'use server';

/**
 * Server Actions for SS & Healthcare Calculations
 * 
 * These functions run on the server and are called from the client
 * component. They handle expensive computations securely.
 */

import { computeSSHealthcareResults as computeResults } from '@projection/shared/src/calculations/compute';
import type { QuickModeInputs, DetailedModeInputs, SSHealthcareResults } from '@projection/shared';

export async function computeSSHealthcareResults(
  inputs: QuickModeInputs | DetailedModeInputs
): Promise<SSHealthcareResults> {
  'use server';
  
  try {
    const results = computeResults(inputs);
    return results;
  } catch (error) {
    console.error('Computation error:', error);
    throw new Error('Failed to compute SS & Healthcare results');
  }
}
