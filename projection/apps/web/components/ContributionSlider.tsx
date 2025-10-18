/**
 * ContributionSlider Component (Web)
 * Specialized slider for Annual Contribution with 2025 limit visualization
 * Shows age-based limits and status badges matching mobile UX
 */

import React, { useMemo } from 'react';
import {
  Box,
  Slider,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import { InputFieldDefinition } from '@projection/shared';

interface ContributionSliderProps {
  /** Current age for determining contribution limits */
  age: number;
  /** Current contribution value */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Field definition for constraints */
  field: InputFieldDefinition;
  /** Platform defaults */
  platformDefaults?: {
    heightPixels?: number;
    thumbSize?: number;
    trackHeight?: number;
  };
}

export const ContributionSlider: React.FC<ContributionSliderProps> = ({
  age,
  value,
  onChange,
  field,
  platformDefaults,
}) => {
  // Calculate dynamic max based on age (2025 limits)
  const limit2025 = 23500;
  const limitCatchUp = 30500;
  const dynamicMax = age >= 50 ? limitCatchUp : limit2025;

  // Determine status and color
  const getStatusInfo = () => {
    if (value <= limit2025) {
      return {
        status: '2025 Limit',
        color: '#69B47A', // Green
        backgroundColor: 'rgba(105, 180, 122, 0.15)',
      };
    } else if (age >= 50 && value <= limitCatchUp) {
      return {
        status: 'Catch-up (50+)',
        color: '#FFB74D', // Orange
        backgroundColor: 'rgba(255, 183, 77, 0.15)',
      };
    } else {
      return {
        status: 'Over Limit',
        color: '#FF6B6B', // Red
        backgroundColor: 'rgba(255, 107, 107, 0.15)',
      };
    }
  };

  const statusInfo = getStatusInfo();

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000).toFixed(1)}k`;
  };

  // Calculate fill percentage
  const fillPercentage = (value / dynamicMax) * 100;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header with value and status badge */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: '#30403A',
              fontSize: '0.95rem',
            }}
          >
            Annual Contribution: {formatCurrency(value)}
          </Typography>
          <Chip
            label={statusInfo.status}
            size="small"
            sx={{
              backgroundColor: statusInfo.color,
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        </Box>
      </Box>

      {/* Slider with custom track styling */}
      <Box
        sx={{
          position: 'relative',
          mb: 2,
        }}
      >
        <Slider
          value={value}
          onChange={(_, newValue) => onChange(newValue as number)}
          min={0}
          max={dynamicMax}
          step={500}
          sx={{
            height: platformDefaults?.heightPixels ? `${platformDefaults.heightPixels}px` : '48px',
            '& .MuiSlider-track': {
              backgroundColor: statusInfo.color,
              height: platformDefaults?.trackHeight ? `${platformDefaults.trackHeight}px` : '8px',
            },
            '& .MuiSlider-rail': {
              backgroundColor: 'rgba(48, 64, 58, 0.1)',
              height: platformDefaults?.trackHeight ? `${platformDefaults.trackHeight}px` : '8px',
            },
            '& .MuiSlider-thumb': {
              width: platformDefaults?.thumbSize ? `${platformDefaults.thumbSize}px` : '24px',
              height: platformDefaults?.thumbSize ? `${platformDefaults.thumbSize}px` : '24px',
              backgroundColor: statusInfo.color,
              border: '2px solid #FFFFFF',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              },
            },
          }}
        />
      </Box>

      {/* Range indicators matching mobile */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: '0.75rem',
          color: '#999',
          px: 0.5,
        }}
      >
        <Typography variant="caption" sx={{ color: '#999' }}>
          $0
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#999',
            textAlign: 'center',
            flex: 1,
          }}
        >
          {formatCurrency(limit2025)} (2025)
        </Typography>
        {age >= 50 && (
          <Typography variant="caption" sx={{ color: '#999' }}>
            {formatCurrency(limitCatchUp)} (50+)
          </Typography>
        )}
      </Box>

      {/* Additional info text */}
      <Box sx={{ mt: 2, p: 1.5, backgroundColor: statusInfo.backgroundColor, borderRadius: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: statusInfo.color,
            fontWeight: 500,
            display: 'block',
          }}
        >
          {value <= limit2025
            ? `Current contribution is within the 2025 IRS limit of ${formatCurrency(limit2025)}`
            : age >= 50 && value <= limitCatchUp
            ? `Using catch-up contributions for age 50+. Limit is ${formatCurrency(limitCatchUp)}`
            : `Contribution exceeds the limit of ${formatCurrency(dynamicMax)}`}
        </Typography>
      </Box>
    </Box>
  );
};
