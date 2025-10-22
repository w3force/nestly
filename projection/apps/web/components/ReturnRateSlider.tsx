/**
 * ReturnRateSlider Component (Web)
 * Schema-driven slider for Expected Return with inline milestone and quick-pick markers
 */

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Slider,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  getSliderMetadata,
  InputFieldDefinition,
  resolveSliderMilestones,
  resolveSliderRangeIndicators,
  resolveSliderState,
  resolveSliderSuggestions,
} from '@projection/shared';
import { HelpTooltip } from './HelpTooltip';

const MARKER_SIZE = 16;
const MILESTONE_LABEL_OFFSET = 8;

interface ReturnRateSliderProps {
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

export const ReturnRateSlider: React.FC<ReturnRateSliderProps> = ({
  value,
  onChange,
  field,
  platformDefaults,
  help,
}) => {
  const sliderRef = useRef<HTMLSpanElement | null>(null);
  const [trackMetrics, setTrackMetrics] = useState<TrackMetrics | null>(null);

  const sliderMetadata = useMemo(() => getSliderMetadata(field), [field]);
  const sliderState = resolveSliderState(sliderMetadata, {
    value,
    formState: {},
  });
  const rangeIndicators = useMemo(
    () => resolveSliderRangeIndicators(sliderMetadata, { formState: {} }),
    [sliderMetadata],
  );
  const milestones = useMemo(
    () => resolveSliderMilestones(sliderMetadata),
    [sliderMetadata],
  );
  const suggestions = useMemo(
    () => resolveSliderSuggestions(sliderMetadata),
    [sliderMetadata],
  );

  const trackColor =
    sliderState?.trackColor ?? sliderState?.badgeColor ?? '#69B47A';
  const badgeLabel = sliderState?.label ?? 'Status';
  const badgeColor = sliderState?.badgeColor ?? '#69B47A';
  const badgeTextColor = sliderState?.textColor ?? '#FFFFFF';
  const infoBackground =
    sliderState?.backgroundColor ?? 'rgba(105, 180, 122, 0.12)';
  const infoTitle = sliderState?.info?.title;
  const infoDescription = sliderState?.info?.description;

  const minValue = field.constraints.min;
  const maxValue = field.constraints.max;

  const suggestionThreshold = useMemo(
    () => Math.max((field.constraints.step ?? 0.5) * 0.75, 0.3),
    [field.constraints.step],
  );

  const activeMilestone = useMemo(() => {
    if (!milestones.length) return null;
    const milestoneThreshold = Math.max(
      (field.constraints.step ?? 0.5) * 1.2,
      0.3,
    );
    return (
      milestones.find(
        (milestone) => Math.abs(milestone.value - value) <= milestoneThreshold,
      ) ?? null
    );
  }, [milestones, value, field.constraints.step]);

  const formatValue =
    typeof field.constraints.format === 'function'
      ? field.constraints.format
      : (v: number) => `${v.toFixed(1)}%`;

  const getPercent = (val: number) => {
    const range = maxValue - minValue;
    if (range <= 0) {
      return 0;
    }
    return ((val - minValue) / range) * 100;
  };

  const isSuggestionActive = (suggestionValue: number) =>
    Math.abs(value - suggestionValue) < suggestionThreshold;

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
            Expected Return: {formatValue(value)}
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
          value={value}
          onChange={(_, newValue) => onChange(newValue as number)}
          min={field.constraints.min}
          max={field.constraints.max}
          step={field.constraints.step}
          sx={{
            height: platformDefaults?.heightPixels ? `${platformDefaults.heightPixels}px` : '48px',
            '& .MuiSlider-track': {
              backgroundColor: trackColor,
              height: platformDefaults?.trackHeight ? `${platformDefaults.trackHeight}px` : '8px',
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
              '&:hover': {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              },
            },
          }}
        />

        {suggestions.map((suggestion) => {
          const percent = getPercent(suggestion.value);
          const active = isSuggestionActive(suggestion.value);
          return (
            <Tooltip
              key={suggestion.label}
              title={`${suggestion.label}: ${formatValue(suggestion.value)}`}
              arrow
            >
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
                aria-label={`${suggestion.label} ${formatValue(suggestion.value)}`}
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
            {rangeIndicators.map((indicator) => {
              const percent = getPercent(indicator.value);
              return (
                <Box
                  key={`return-indicator-${indicator.label}-${indicator.value}`}
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

      {(infoTitle || infoDescription || activeMilestone) && (
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
                mb: infoDescription || activeMilestone ? 0.5 : 0,
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
                mb: activeMilestone ? 0.75 : 0,
              }}
            >
              {infoDescription}
            </Typography>
          )}
          {activeMilestone && (
            <Typography
              sx={{
                fontSize: '0.78rem',
                color: 'rgba(48, 64, 58, 0.85)',
                fontWeight: 500,
              }}
            >
              {activeMilestone.label}: {activeMilestone.description}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

