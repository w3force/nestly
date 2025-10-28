/**
 * SliderField Component (Web)
 * Renders a slider input with schema-driven styling, colors, and range indicators
 * Consumes configuration from DETERMINISTIC_SCREEN.platformVariants.web.sliderDefaults
 * and section-level metadata.sliderStyle
 */

import React, { useMemo, useState, useCallback } from 'react';
import {
  Box,
  Slider,
  Typography,
  Stack,
  Tooltip,
} from '@mui/material';
import { InputFieldDefinition } from '@projection/shared';

interface SliderFieldProps {
  /** Field definition containing min, max, step, default */
  field: InputFieldDefinition;
  /** Current value */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Slider styling from section metadata */
  sliderStyle?: {
    showRangeIndicator?: boolean;
    rangeIndicatorType?: 'compact' | 'full' | 'minimal';
    showValue?: boolean;
    showMin?: boolean;
    showMax?: boolean;
    displayFormat?: 'inline' | 'tooltip' | 'below';
    trackColor?: {
      filled?: string;
      empty?: string;
    };
    thumbStyle?: {
      size?: 'small' | 'medium' | 'large';
      color?: string;
      showLabel?: boolean;
    };
  };
  /** Platform defaults from web variant */
  platformDefaults?: {
    heightPixels?: number;
    thumbSize?: number;
    trackHeight?: number;
  };
  /** Global theme configuration */
  theme?: {
    light?: {
      trackFilledColor?: string;
      trackEmptyColor?: string;
      thumbColor?: string;
      thumbBorderColor?: string;
      thumbBorderWidth?: number;
      textColor?: string;
    };
  };
}

/**
 * Map thumb size string to pixels
 */
const getThumbSizePixels = (size?: 'small' | 'medium' | 'large', platformDefault?: number): number => {
  const sizeMap = {
    small: 20,
    medium: 24,
    large: 28,
  };
  return sizeMap[size || 'medium'] || platformDefault || 24;
};

/**
 * Map container height to pixels
 */
const getContainerHeightPixels = (platformHeightPixels?: number): number => {
  return platformHeightPixels || 48;
};

export const SliderField: React.FC<SliderFieldProps> = ({
  field,
  value,
  onChange,
  sliderStyle,
  platformDefaults,
  theme,
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop changes
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Merge defaults: global theme < platform defaults < section-level styling
  const mergedTrackColor = {
    filled: sliderStyle?.trackColor?.filled || theme?.light?.trackFilledColor || '#69B47A',
    empty: sliderStyle?.trackColor?.empty || theme?.light?.trackEmptyColor || 'rgba(105, 180, 122, 0.15)',
  };

  const mergedThumbColor = sliderStyle?.thumbStyle?.color || theme?.light?.thumbColor || '#69B47A';
  const mergedThumbBorder = theme?.light?.thumbBorderColor || '#FFFFFF';
  const mergedThumbBorderWidth = theme?.light?.thumbBorderWidth || 2;
  const mergedTextColor = theme?.light?.textColor || '#30403A';

  const thumbSizePixels = getThumbSizePixels(sliderStyle?.thumbStyle?.size, platformDefaults?.thumbSize);
  const containerHeightPixels = getContainerHeightPixels(platformDefaults?.heightPixels);
  const trackHeightPixels = platformDefaults?.trackHeight || 8;

  // Extract constraints from field definition
  const min = (field as any)?.constraints?.min ?? 0;
  const max = (field as any)?.constraints?.max ?? 100;
  const step = (field as any)?.constraints?.step ?? 1;

  // Determine display format
  const displayFormat = sliderStyle?.displayFormat || 'below';
  const showRangeIndicator = sliderStyle?.showRangeIndicator !== false;
  const rangeIndicatorType = sliderStyle?.rangeIndicatorType || 'full';
  const showValue = sliderStyle?.showValue !== false;
  const showMin = sliderStyle?.showMin !== false;
  const showMax = sliderStyle?.showMax !== false;

  // Format value with currency if it looks like money
  const formatValue = (val: number) => {
    // Currency if field name contains 'balance', 'contribution', 'return', etc.
    const currencyFields = ['balance', 'contribution', 'return'];
    const isCurrency = currencyFields.some(term => field.id?.toLowerCase().includes(term));
    
    if (isCurrency) {
      return `$${Math.round(val).toLocaleString()}`;
    }
    
    // Percentage if field name contains 'rate', 'return', 'inflation'
    const percentFields = ['rate', 'return', 'inflation', 'expectedReturn'];
    const isPercent = percentFields.some(term => field.id?.toLowerCase().includes(term));
    
    if (isPercent) {
      return `${val.toFixed(2)}%`;
    }

    return Math.round(val).toString();
  };

  // Calculate fill percentage for track visual
  const fillPercentage = ((localValue - min) / (max - min)) * 100;

  // Optimized change handlers
  const handleChange = useCallback((_: Event, newValue: number | number[]) => {
    setLocalValue(newValue as number);
  }, []);

  const handleChangeCommitted = useCallback((_: Event | React.SyntheticEvent, newValue: number | number[]) => {
    onChange(newValue as number);
  }, [onChange]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Label and value display */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            color: mergedTextColor,
            fontSize: '0.875rem',
          }}
        >
          {field.label}
        </Typography>
        {displayFormat !== 'inline' && showValue && (
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 700, 
              color: mergedThumbColor,
              fontSize: '0.875rem',
            }}
          >
            {formatValue(localValue)}
          </Typography>
        )}
      </Box>

      {/* Range indicators - above slider */}
      {showRangeIndicator && (rangeIndicatorType === 'full' || rangeIndicatorType === 'compact') && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 0.5, color: 'rgba(48, 64, 58, 0.6)' }}>
          {showMin && <span>{formatValue(min)}</span>}
          {rangeIndicatorType === 'full' && <span style={{ textAlign: 'center' }}>Range</span>}
          {showMax && <span>{formatValue(max)}</span>}
        </Box>
      )}

      {/* Slider container with custom styling */}
      <Box
        sx={{
          height: containerHeightPixels,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Slider
          value={localValue}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommitted}
          min={min}
          max={max}
          step={step}
          valueLabelDisplay={displayFormat === 'tooltip' ? 'on' : 'off'}
          valueLabelFormat={formatValue}
          sx={{
            width: '100%',
            // Track styling
            '& .MuiSlider-track': {
              backgroundColor: mergedTrackColor.filled,
              height: trackHeightPixels,
              border: 'none',
              transition: 'none',
            },
            '& .MuiSlider-rail': {
              backgroundColor: mergedTrackColor.empty,
              height: trackHeightPixels,
              opacity: 1,
            },
            // Thumb styling
            '& .MuiSlider-thumb': {
              width: thumbSizePixels,
              height: thumbSizePixels,
              backgroundColor: mergedThumbColor,
              border: `${mergedThumbBorderWidth}px solid ${mergedThumbBorder}`,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
              },
              '&.Mui-focusVisible': {
                outline: `2px solid ${mergedThumbColor}`,
                outlineOffset: '4px',
              },
            },
            // Value label styling
            '& .MuiSlider-valueLabel': {
              backgroundColor: mergedThumbColor,
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 700,
              borderRadius: '4px',
              padding: '4px 8px',
            },
          }}
        />
      </Box>

      {/* Value display below slider */}
      {displayFormat === 'below' && showValue && (
        <Box sx={{ marginTop: 1, textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: mergedThumbColor,
              fontSize: '0.875rem',
            }}
          >
            {field.label}: {formatValue(localValue)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SliderField;
