/**
 * ContributionSlider Component (Web)
 * Specialized slider for Annual Contribution with inline IRS limit markers
 */

import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  Box,
  Slider,
  Typography,
  Chip,
} from '@mui/material';
import { InputFieldDefinition } from '@projection/shared';
import { HelpTooltip } from './HelpTooltip';

const MARKER_SIZE = 16;
const MILESTONE_LABEL_OFFSET = 8;

interface ContributionSliderProps {
  age: number;
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

export const ContributionSlider: React.FC<ContributionSliderProps> = ({
  age,
  value,
  onChange,
  field,
  platformDefaults,
  help,
}) => {
  const sliderRef = useRef<HTMLSpanElement | null>(null);
  const [trackMetrics, setTrackMetrics] = useState<TrackMetrics | null>(null);

  const limit2025 = 23500;
  const limitCatchUp = 30500;
  const dynamicMax = age >= 50 ? limitCatchUp : limit2025;

  const milestones = [
    { value: 0, label: '$0' },
    { value: limit2025, label: `$${(limit2025 / 1000).toFixed(1)}k (2025)` },
    ...(age >= 50
      ? [{ value: limitCatchUp, label: `$${(limitCatchUp / 1000).toFixed(1)}k (50+)` }]
      : []),
  ];

  const getStatusInfo = () => {
    if (value <= limit2025) {
      return {
        status: '2025 Limit',
        color: '#69B47A',
        backgroundColor: 'rgba(105, 180, 122, 0.15)',
      };
    }
    if (age >= 50 && value <= limitCatchUp) {
      return {
        status: 'Catch-up (50+)',
        color: '#FFB74D',
        backgroundColor: 'rgba(255, 183, 77, 0.15)',
      };
    }
    return {
      status: 'Over Limit',
      color: '#FF6B6B',
      backgroundColor: 'rgba(255, 107, 107, 0.15)',
    };
  };

  const statusInfo = getStatusInfo();

  const formatCurrency = (amount: number) => `$${(amount / 1000).toFixed(1)}k`;

  const getPercent = (amount: number) => {
    if (dynamicMax <= 0) {
      return 0;
    }
    return (amount / dynamicMax) * 100;
  };

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
  }, [age, dynamicMax]);

  const markerTop =
    trackMetrics != null
      ? `${trackMetrics.offsetTop + trackMetrics.height / 2 - MARKER_SIZE / 2}px`
      : `calc(50% - ${MARKER_SIZE / 2}px)`;
  const milestoneLabelTop =
    trackMetrics != null ? `${Math.max(trackMetrics.offsetTop - MILESTONE_LABEL_OFFSET, 0)}px` : '0px';
  const milestoneLineTop = trackMetrics != null ? `${trackMetrics.offsetTop}px` : '0px';
  const milestoneLineHeight = trackMetrics != null ? `${trackMetrics.height}px` : '0px';

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
            Annual Contribution: {formatCurrency(value)}
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

      <Box sx={{ position: 'relative', mb: 1.5, pb: 2 }}>
        <Slider
          ref={sliderRef}
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
            {milestones.map((milestone) => {
              const percent = getPercent(milestone.value);
              return (
                <Box
                  key={`contribution-milestone-${milestone.value}`}
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
