/**
 * ContributionSlider Component (Web)
 * Specialized slider for Annual Contribution with inline IRS limit markers
 */

import React, { useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  Box,
  Slider,
  Typography,
  Chip,
} from '@mui/material';
import {
  getSliderMetadata,
  InputFieldDefinition,
  resolveSliderRangeIndicators,
  resolveSliderState,
} from '@projection/shared';
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
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop changes
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const formState = useMemo(() => ({ age }), [age]);
  const sliderMetadata = useMemo(() => getSliderMetadata(field), [field]);
  const dynamicMax = useMemo(() => {
    if (typeof field.constraints.conditionalMax === 'function') {
      const conditional = field.constraints.conditionalMax(formState);
      if (typeof conditional === 'number') {
        return conditional;
      }
    }
    return field.constraints.max;
  }, [field, formState]);
  const safeMax = dynamicMax ?? field.constraints.max;

  const sliderState = useMemo(() => resolveSliderState(sliderMetadata, {
    value: localValue,
    formState,
    dynamicMax: safeMax,
  }), [sliderMetadata, localValue, formState, safeMax]);
  
  const rangeIndicators = useMemo(
    () => resolveSliderRangeIndicators(sliderMetadata, { formState }),
    [sliderMetadata, formState],
  );

  // Optimized change handlers
  const handleChange = useCallback((_: Event, newValue: number | number[]) => {
    setLocalValue(newValue as number);
  }, []);

  const handleChangeCommitted = useCallback((_: Event | React.SyntheticEvent, newValue: number | number[]) => {
    onChange(newValue as number);
  }, [onChange]);

  const trackColor =
    sliderState?.trackColor ?? sliderState?.badgeColor ?? '#69B47A';
  const badgeLabel = sliderState?.label ?? 'Status';
  const badgeColor = sliderState?.badgeColor ?? '#69B47A';
  const badgeTextColor = sliderState?.textColor ?? '#FFFFFF';
  const infoBackground =
    sliderState?.backgroundColor ?? 'rgba(105, 180, 122, 0.12)';

  const infoTitle = sliderState?.info?.title;
  const infoDescription = sliderState?.info?.description;

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const getPercent = (amount: number) => {
    if (safeMax <= 0) {
      return 0;
    }
    return (amount / safeMax) * 100;
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
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          marginBottom: 1.5,
          gap: { xs: 0.5, sm: 0 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: '#30403A',
              fontSize: { xs: '0.875rem', sm: '0.95rem' },
              whiteSpace: 'nowrap',
            }}
          >
            Annual Contribution: {formatCurrency(localValue)}
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
            label={badgeLabel}
            size="small"
            sx={{
              backgroundColor: badgeColor,
              color: badgeTextColor,
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
          value={localValue}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommitted}
          min={0}
          max={safeMax}
          step={500}
          sx={{
            height: platformDefaults?.heightPixels ? `${platformDefaults.heightPixels}px` : '48px',
            '& .MuiSlider-track': {
              backgroundColor: trackColor,
              height: platformDefaults?.trackHeight ? `${platformDefaults.trackHeight}px` : '8px',
              transition: 'none',
            },
            '& .MuiSlider-rail': {
              backgroundColor: 'rgba(48, 64, 58, 0.1)',
              height: platformDefaults?.trackHeight ? `${platformDefaults.trackHeight}px` : '8px',
            },
            '& .MuiSlider-thumb': {
              width: platformDefaults?.thumbSize ? `${platformDefaults.thumbSize}px` : '24px',
              height: platformDefaults?.thumbSize ? `${platformDefaults.thumbSize}px` : '24px',
              backgroundColor: trackColor,
              border: '2px solid #FFFFFF',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
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
            {rangeIndicators.map((indicator) => {
              const percent = getPercent(indicator.value);
              return (
                <Box
                  key={`contribution-indicator-${indicator.label}-${indicator.value}`}
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
                    {indicator.label}
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

      {(infoTitle || infoDescription) && (
        <Box
          sx={{
            mt: 1,
            px: 1.5,
            py: 1.25,
            borderRadius: 1,
            backgroundColor: infoBackground,
            borderLeft: `4px solid ${trackColor}`,
          }}
        >
          {infoTitle && (
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '0.85rem',
                color: '#30403A',
                mb: infoDescription ? 0.5 : 0,
              }}
            >
              {infoTitle}
            </Typography>
          )}
          {infoDescription && (
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: 'rgba(48, 64, 58, 0.78)',
                lineHeight: 1.45,
              }}
            >
              {infoDescription}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
