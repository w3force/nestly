/**
 * InflationSlider Component (Web)
 * Specialized slider for Inflation with inline milestone and quick-pick markers
 */

import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  Box,
  Slider,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import { InputFieldDefinition } from '@projection/shared';
import { HelpTooltip } from './HelpTooltip';

const INFLATION_SUGGESTIONS = [
  { label: '5-yr avg', value: 3.6 },
  { label: '10-yr avg', value: 2.6 },
  { label: '15-yr avg', value: 2.2 },
];

const INFLATION_MILESTONES = [
  { value: 0, label: '0%' },
  { value: 2, label: '2% (Good)' },
  { value: 4, label: '4% (Normal)' },
  { value: 6, label: '6%' },
];

const MARKER_SIZE = 16;
const SUGGESTION_SNAP_THRESHOLD = 0.2;
const MILESTONE_LABEL_OFFSET = 8;

interface InflationSliderProps {
  value: number;
  onChange: (value: number) => void;
  field: InputFieldDefinition;
  platformDefaults?: {
    heightPixels?: number;
    thumbSize?: number;
    trackHeight?: number;
  };
  help?: {
    title: string;
    description: string;
  };
}

type TrackMetrics = {
  offsetTop: number;
  height: number;
};

export const InflationSlider: React.FC<InflationSliderProps> = ({
  value,
  onChange,
  field,
  platformDefaults,
  help,
}) => {
  const sliderRef = useRef<HTMLSpanElement | null>(null);
  const [trackMetrics, setTrackMetrics] = useState<TrackMetrics | null>(null);

  const getInflationInfo = () => {
    if (value < 2) {
      return {
        status: 'Low Inflation',
        color: '#69B47A',
        backgroundColor: 'rgba(105, 180, 122, 0.15)',
        description: 'Below historical average. Strong purchasing power growth.',
      };
    }
    if (value <= 4) {
      return {
        status: 'Moderate Inflation',
        color: '#FFB74D',
        backgroundColor: 'rgba(255, 183, 77, 0.15)',
        description: 'Within normal range. Plan accordingly for purchasing power erosion.',
      };
    }
    return {
      status: 'High Inflation',
      color: '#FF6B6B',
      backgroundColor: 'rgba(255, 107, 107, 0.15)',
      description: 'Above historical average. Significant purchasing power reduction.',
    };
  };

  const inflationInfo = getInflationInfo();

  const minValue = field.constraints.min;
  const maxValue = field.constraints.max;

  const getPercent = (val: number) => {
    const range = maxValue - minValue;
    if (range <= 0) {
      return 0;
    }
    return ((val - minValue) / range) * 100;
  };

  const isSuggestionActive = (suggestionValue: number) =>
    Math.abs(value - suggestionValue) < SUGGESTION_SNAP_THRESHOLD;

  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateTrackMetrics = () => {
      if (!sliderRef.current) return;
      const track = sliderRef.current.querySelector<HTMLElement>('.MuiSlider-track');
      if (!track) return;
      const trackRect = track.getBoundingClientRect();
      const rootRect = sliderRef.current.getBoundingClientRect();
      setTrackMetrics({
        offsetTop: trackRect.top - rootRect.top,
        height: trackRect.height,
      });
    };

    updateTrackMetrics();
    window.addEventListener('resize', updateTrackMetrics);
    return () => window.removeEventListener('resize', updateTrackMetrics);
  }, [minValue, maxValue, value]);

  const markerTop =
    trackMetrics != null
      ? `${trackMetrics.offsetTop + trackMetrics.height / 2 - MARKER_SIZE / 2}px`
      : `calc(50% - ${MARKER_SIZE / 2}px)`;

  const milestoneLabelTop =
    trackMetrics != null ? `${Math.max(trackMetrics.offsetTop - MILESTONE_LABEL_OFFSET, 0)}px` : '0px';

  const milestoneLineTop = trackMetrics != null ? `${trackMetrics.offsetTop}px` : '0px';
  const milestoneLineHeight = trackMetrics != null ? `${trackMetrics.height}px` : '0px';

  const handleSuggestionSelect = (suggestionValue: number) => {
    onChange(Number(suggestionValue.toFixed(1)));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 1.5,
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
          {help && (
            <HelpTooltip
              title={help.title}
              description={help.description}
              size="small"
              placement="top"
            />
          )}
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

      <Box sx={{ position: 'relative', mb: 1.5, pb: 2 }}>
        <Slider
          ref={sliderRef}
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

        {INFLATION_SUGGESTIONS.map((suggestion) => {
          const percent = getPercent(suggestion.value);
          const active = isSuggestionActive(suggestion.value);
          return (
            <Tooltip key={suggestion.label} title={`${suggestion.label}: ${suggestion.value.toFixed(1)}%`} arrow>
              <Box
                onClick={() => handleSuggestionSelect(suggestion.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleSuggestionSelect(suggestion.value);
                  }
                }}
                sx={{
                  position: 'absolute',
                  top: markerTop,
                  left: `calc(${percent}% )`,
                  transform: 'translateX(-50%)',
                  width: MARKER_SIZE,
                  height: MARKER_SIZE,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border: `2px solid ${active ? '#2E7D32' : 'rgba(48, 64, 58, 0.4)'}`,
                  backgroundColor: active ? '#A5D6A7' : '#FFFFFF',
                  boxShadow: active
                    ? '0 0 0 4px rgba(165, 214, 167, 0.35)'
                    : '0 0 0 2px rgba(48, 64, 58, 0.1)',
                  transition: 'all 120ms ease',
                  '&:hover': {
                    backgroundColor: active ? '#81C784' : '#F1F8E9',
                  },
                }}
                role="button"
                tabIndex={0}
                aria-label={`${suggestion.label} ${suggestion.value.toFixed(1)} percent`}
              />
            </Tooltip>
          );
        })}

        {trackMetrics && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              pointerEvents: 'none',
              height: trackMetrics.offsetTop + trackMetrics.height,
            }}
          >
            {INFLATION_MILESTONES.map((milestone) => {
              const percent = getPercent(milestone.value);
              return (
                <Box
                  key={`inflation-milestone-${milestone.value}`}
                  sx={{
                    position: 'absolute',
                    left: `calc(${percent}% )`,
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    color: 'rgba(48, 64, 58, 0.8)',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: milestoneLabelTop,
                      px: 0.6,
                      py: 0.2,
                      borderRadius: 1,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      bgcolor: 'rgba(255,255,255,0.85)',
                      boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-100%)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {milestone.label}
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: milestoneLineTop,
                      width: '2px',
                      height: milestoneLineHeight,
                      borderRadius: 1,
                      bgcolor: 'rgba(48, 64, 58, 0.35)',
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Info bar removed for cleaner layout */}
    </Box>
  );
};

