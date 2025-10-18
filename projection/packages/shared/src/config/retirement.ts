/**
 * Social Security & Medicare Configuration
 * 
 * ⚠️ TODO: Update these values annually based on SSA and CMS announcements
 * Last updated: 2025
 */

import { FilingStatus } from '../types/retirement';

// US States for dropdown
export const US_STATES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas',
  CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho',
  IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas',
  KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
  OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
  VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia',
  WI: 'Wisconsin', WY: 'Wyoming', DC: 'District of Columbia',
};

// Social Security Bend Points by Year (year user turns 62)
// Source: SSA.gov - updated annually
export const BEND_POINTS: Record<number, { first: number; second: number }> = {
  2023: { first: 1115, second: 6721 },
  2024: { first: 1174, second: 7078 },
  2025: { first: 1226, second: 7391 }, // TODO: Verify actual 2025 values
  2026: { first: 1280, second: 7710 }, // TODO: Update when announced
  2027: { first: 1335, second: 8040 }, // TODO: Update when announced
};

// Full Retirement Age (FRA) by Birth Year
export function getFRA(birthYear: number): number {
  if (birthYear <= 1937) return 65;
  if (birthYear <= 1942) return 66;
  if (birthYear === 1943 || birthYear === 1944 || birthYear === 1945 ||
      birthYear === 1946 || birthYear === 1947 || birthYear === 1948 ||
      birthYear === 1949 || birthYear === 1950 || birthYear === 1951 ||
      birthYear === 1952 || birthYear === 1953 || birthYear === 1954) {
    return 66;
  }
  if (birthYear === 1955) return 66.167; // 66 and 2 months
  if (birthYear === 1956) return 66.333; // 66 and 4 months
  if (birthYear === 1957) return 66.5;   // 66 and 6 months
  if (birthYear === 1958) return 66.667; // 66 and 8 months
  if (birthYear === 1959) return 66.833; // 66 and 10 months
  if (birthYear >= 1960) return 67;
  return 67; // Default
}

// Early Retirement Reduction
// First 36 months: 5/9% per month (0.5556% per month)
// Additional months: 5/12% per month (0.4167% per month)
export const EARLY_REDUCTION = {
  first36Months: 5 / 9 / 100, // 0.005556 per month
  additionalMonths: 5 / 12 / 100, // 0.004167 per month
};

// Delayed Retirement Credits
// 8% per year = 0.6667% per month (2/3% per month)
export const DELAYED_CREDIT_PER_MONTH = 8 / 12 / 100; // 0.006667

// Medicare Part B Base Premium (2025)
// TODO: Update annually from CMS
export const PART_B_BASE_2025 = 185.00; // Monthly premium

// Medicare Part D Base Premium (typical 2025)
// TODO: Update annually - this varies by plan
export const PART_D_BASE_2025 = 50.00; // Typical monthly premium

// Medicare Part A Premium (for those without 40 credits)
// Most people have $0 Part A premium
export const PART_A_PREMIUM_2025 = 0; // $0 for most
export const PART_A_PREMIUM_NO_CREDITS_2025 = 505; // Monthly if <30 credits

// Typical Medigap Premium (Plan G average)
// TODO: This varies significantly by state, age, tobacco use
export const MEDIGAP_DEFAULT_2025 = 150.00; // Monthly average

// Typical Medicare Advantage Premium
// Many plans have $0 premium, some charge
export const ADVANTAGE_DEFAULT_2025 = 0; // $0 to $40 typical range

// IRMAA (Income-Related Monthly Adjustment Amount) 2025
// TODO: Update annually from CMS
// Source: Medicare.gov IRMAA brackets
export interface IRMAABracket {
  minMAGI: number;
  maxMAGI: number | null; // null = no upper limit
  partBSurcharge: number;
  partDSurcharge: number;
}

export const IRMAA_BRACKETS_2025: Record<FilingStatus, IRMAABracket[]> = {
  SINGLE: [
    { minMAGI: 0, maxMAGI: 103000, partBSurcharge: 0, partDSurcharge: 0 },
    { minMAGI: 103000, maxMAGI: 129000, partBSurcharge: 74.00, partDSurcharge: 12.90 },
    { minMAGI: 129000, maxMAGI: 161000, partBSurcharge: 185.00, partDSurcharge: 33.30 },
    { minMAGI: 161000, maxMAGI: 193000, partBSurcharge: 295.80, partDSurcharge: 53.80 },
    { minMAGI: 193000, maxMAGI: 500000, partBSurcharge: 406.60, partDSurcharge: 74.20 },
    { minMAGI: 500000, maxMAGI: null, partBSurcharge: 443.90, partDSurcharge: 81.00 },
  ],
  MARRIED: [
    { minMAGI: 0, maxMAGI: 206000, partBSurcharge: 0, partDSurcharge: 0 },
    { minMAGI: 206000, maxMAGI: 258000, partBSurcharge: 74.00, partDSurcharge: 12.90 },
    { minMAGI: 258000, maxMAGI: 322000, partBSurcharge: 185.00, partDSurcharge: 33.30 },
    { minMAGI: 322000, maxMAGI: 386000, partBSurcharge: 295.80, partDSurcharge: 53.80 },
    { minMAGI: 386000, maxMAGI: 750000, partBSurcharge: 406.60, partDSurcharge: 74.20 },
    { minMAGI: 750000, maxMAGI: null, partBSurcharge: 443.90, partDSurcharge: 81.00 },
  ],
};

// Medicaid Eligibility Thresholds by State (simplified)
// TODO: Update annually - these vary significantly by state expansion status
// Using FPL (Federal Poverty Level) multiples as baseline
// 2025 FPL: ~$15,060 for individual
export const MEDICAID_INCOME_THRESHOLDS: Record<string, number> = {
  // Medicaid expansion states (138% FPL ~ $20,783)
  CA: 20783,
  NY: 20783,
  WA: 20783,
  MA: 20783,
  IL: 20783,
  
  // Non-expansion states (typically lower)
  TX: 4500, // Very restrictive
  FL: 4500,
  GA: 4500,
  
  // Default/baseline
  DEFAULT: 15060, // 100% FPL
};

// Asset limits for Medicaid (simplified)
export const MEDICAID_ASSET_LIMIT_SINGLE = 2000;
export const MEDICAID_ASSET_LIMIT_MARRIED = 3000;

// Consumer Price Index (CPI) wage indexing factors
// TODO: Update annually from SSA
// Used to index historical earnings to current wage levels
export const WAGE_INDEX_FACTORS: Record<number, number> = {
  2023: 1.0,
  2022: 0.9456,
  2021: 0.8988,
  2020: 0.8765,
  2019: 0.8543,
  2018: 0.8234,
  2017: 0.7987,
  2016: 0.7765,
  2015: 0.7654,
  // Add more years as needed
  // For years not listed, will use approximation
};

// Maximum taxable earnings by year (SS wage base)
// TODO: Update annually
export const SS_WAGE_BASE: Record<number, number> = {
  2025: 176100, // TODO: Verify
  2024: 168600,
  2023: 160200,
  2022: 147000,
  2021: 142800,
  2020: 137700,
  // Add more years as needed
};

// Helper to get bend points for a given year
export function getBendPoints(year: number): { first: number; second: number } {
  if (BEND_POINTS[year]) {
    return BEND_POINTS[year];
  }
  // If year not found, use latest available
  const years = Object.keys(BEND_POINTS).map(Number).sort((a, b) => b - a);
  const latestYear = years[0];
  console.warn(`Bend points for ${year} not found, using ${latestYear}`);
  return BEND_POINTS[latestYear];
}

// Helper to get IRMAA bracket
export function getIRMAABracket(
  magi: number,
  filingStatus: FilingStatus
): IRMAABracket {
  const brackets = IRMAA_BRACKETS_2025[filingStatus];
  for (const bracket of brackets) {
    if (magi >= bracket.minMAGI && (bracket.maxMAGI === null || magi < bracket.maxMAGI)) {
      return bracket;
    }
  }
  // Fallback to highest bracket
  return brackets[brackets.length - 1];
}

// Helper to get Medicaid threshold
export function getMedicaidThreshold(stateCode: string): number {
  return MEDICAID_INCOME_THRESHOLDS[stateCode] || MEDICAID_INCOME_THRESHOLDS.DEFAULT;
}
