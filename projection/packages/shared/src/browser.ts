/**
 * Browser-safe utilities from shared package
 * 
 * These functions are safe to use in browser/client code
 * and don't require server-side computation
 */

export { parseEarningsCSV } from './calculations/ssaMath';
export { getFRA } from './config/retirement';
export * from './utils/modeUtils';
