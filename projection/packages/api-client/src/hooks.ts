import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { components } from './types';

// Export types for convenience
export type MonteCarloInput = components['schemas']['MonteCarloInput'];
export type MonteCarloResponse = components['schemas']['MonteCarloResponse'];

// Declare process for environments where it exists
declare const process: any;

// Get API URL from environment variable or fallback to localhost
const getApiUrl = (): string => {
  try {
    // Check for Next.js public env vars (works in browser and server)
    if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    // Check for Expo public env vars (React Native)
    if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) {
      return process.env.EXPO_PUBLIC_API_URL;
    }
  } catch (e) {
    // process not available
  }
  // Fallback to localhost for development
  return 'http://localhost:8000';
};

// Helper to call /monte-carlo
async function fetchMonteCarlo(input: MonteCarloInput): Promise<MonteCarloResponse> {
  const apiUrl = getApiUrl();
  const res = await fetch(`${apiUrl}/monte-carlo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to fetch Monte Carlo simulation');
  return res.json();
}

// Helper to call /monte-carlo/async (if implemented)
async function fetchMonteCarloAsync(input: MonteCarloInput): Promise<MonteCarloResponse> {
  const apiUrl = getApiUrl();
  const res = await fetch(`${apiUrl}/monte-carlo/async`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to fetch Monte Carlo async simulation');
  return res.json();
}

type MonteCarloQueryOptions = Omit<UseQueryOptions<MonteCarloResponse, Error>, 'queryKey' | 'queryFn'>;

export function useMonteCarloQuery(
  input: MonteCarloInput | null,
  options?: MonteCarloQueryOptions,
): UseQueryResult<MonteCarloResponse, Error> {
  const { enabled, ...rest } = options ?? {};
  return useQuery<MonteCarloResponse, Error>({
    queryKey: ['monte-carlo', input],
    queryFn: () => {
      if (!input) {
        throw new Error('Monte Carlo input is required');
      }
      return fetchMonteCarlo(input);
    },
    enabled: Boolean(input) && (enabled ?? true),
    ...rest,
  });
}

export function useMonteCarloAsync(
  input: MonteCarloInput | null,
  options?: MonteCarloQueryOptions,
): UseQueryResult<MonteCarloResponse, Error> {
  const { enabled, ...rest } = options ?? {};
  return useQuery<MonteCarloResponse, Error>({
    queryKey: ['monte-carlo-async', input],
    queryFn: () => {
      if (!input) {
        throw new Error('Monte Carlo input is required');
      }
      return fetchMonteCarloAsync(input);
    },
    enabled: Boolean(input) && (enabled ?? true),
    ...rest,
  });
}
