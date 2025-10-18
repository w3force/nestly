/**
 * InflationSlider Component (Web)
 * Specialized slider for Inflation with rate assessment visualization
 * Shows inflation level with color coding matching mobile UX
 */

import React from 'react';
import {
  Box,
  Slider,
  Typography,
  Chip,
} from '@mui/material';
import { InputFieldDefinition } from '@projection/shared';

interface InflationSliderProps {
  /** Current inflation value */
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

export const InflationSlider: React.FC<InflationSliderProps> = ({
  value,
  onChange,
  field,
  platformDefaults,
}) => {
  // Determine inflation level and color
  const getInflationInfo = () => {
    if (value < 2) {
      return {
        status: 'Low Inflation',
        color: '#69B47A', // Green
        backgroundColor: 'rgba(105, 180, 122, 0.15)',
        description: 'Below historical average. Strong purchasing power growth.',
      };
    } else if (value <= 4) {
      return {
        status: 'Moderate Inflation',
        color: '#FFB74D', // Orange
        backgroundColor: 'rgba(255, 183, 77, 0.15)',
        description: 'Within normal range. Plan accordingly for purchasing power erosion.',
      };
    } else {
      return {
        status: 'High Inflation',
        color: '#FF6B6B', // Red
        backgroundColor: 'rgba(255, 107, 107, 0.15)',
        description: 'Above historical average. Significant purchasing power reduction.',
      };
    }
  };

  const inflationInfo = getInflationInfo();

  // Calculate fill percentage
  const fillPercentage = (value / field.constraints.max) * 100;

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
            Inflation Rate: {value.toFixed(1)}%
          </Typography>
          <Chip
            label={inflationInfo.status}
            size="small"
            sx={{
              backgroundColor: inflationInfo.color,
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        </Box>
      </Box>

      {/* Slider with custom track styling */}
      <Box sx={{ mb: 2 }}>
        <Slider
          value={value}
          onChange={(_, newValue) => onChange(newValue as number)}
          min={field.constraints.min}
          max={field.constraints.max}
          step={field.constraints.step}
          sx={{
            height: platformDefaults?.heightPixels ? `${platformDefaults.heightPixels}px` : '48px',
            '& .MuiSlider-track': {
              backgroundColor: inflationInfo.color,
              height: platformDefaults?.trackHeight ? `${platformDefaults.trackHeight}px` : '8px',
            },
            '& .MuiSlider-rail': {
              backgroundColor: 'rgba(48, 64, 58, 0.1)',
              height: platformDefaults?.trackHeight ? `${platformDefaults.trackHeight}px` : '8px',
            },
            '& .MuiSlider-thumb': {
              width: platformDefaults?.thumbSize ? `${platformDefaults.thumbSize}px` : '24px',
              height: platformDefaults?.thumbSize ? `${platformDefaults.thumbSize}px` : '24px',
              backgroundColor: inflationInfo.color,
              border: '2px solid #FFFFFF',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              },
            },
          }}
        />
      </Box>

      {/* Range indicators with inflation zones */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: '0.75rem',
          color: '#999',
          px: 0.5,
          mb: 2,
        }}
      >
        <Typography variant="caption" sx={{ color: '#999' }}>
          0%
        </Typography>
        <Typography variant="caption" sx={{ color: '#999', textAlign: 'center' }}>
          2% (Low)
        </Typography>
        <Typography variant="caption" sx={{ color: '#999', textAlign: 'center' }}>
          4% (Moderate)
        </Typography>
        <Typography variant="caption" sx={{ color: '#999' }}>
          6%
        </Typography>
      </Box>

      {/* Additional info text */}
      <Box sx={{ p: 1.5, backgroundColor: inflationInfo.backgroundColor, borderRadius: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: inflationInfo.color,
            fontWeight: 500,
            display: 'block',
          }}
        >
          {inflationInfo.description}
        </Typography>
      </Box>
    </Box>
  );
};
