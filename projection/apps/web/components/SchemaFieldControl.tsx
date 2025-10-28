import React, { useMemo, useState, useCallback } from "react";
import {
  Stack,
  Typography,
  Slider,
  TextField,
  Chip,
  InputAdornment,
  Box,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  InputFieldDefinition,
  getSliderMetadata,
  resolveSliderRangeIndicators,
  resolveSliderState,
} from "@projection/shared";
import { HelpTooltip } from "./HelpTooltip";
import { helpContent } from "../lib/helpContent";

const HELP_KEY_REMAP: Record<string, string> = {
  age: "currentAge",
  current_balance: "currentBalance",
  annual_contribution: "annualContribution",
  contribution_rate: "contributionRate",
  expected_return: "expectedReturn",
  inflation: "inflation",
};

function resolveHelp(field: InputFieldDefinition) {
  const raw = field.helpTopicId?.replace(/_help$/, "");
  if (!raw) {
    return undefined;
  }

  const calculatorTopics = helpContent.calculator as Record<
    string,
    { title: string; description: string }
  >;

  const normalized = raw.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
  const candidates = [raw, normalized, HELP_KEY_REMAP[raw]];

  for (const key of candidates) {
    if (key && calculatorTopics[key]) {
      return calculatorTopics[key];
    }
  }
  return undefined;
}

export interface SchemaFieldControlProps {
  field: InputFieldDefinition;
  value: number | string;
  onChange: (value: number | string) => void;
  formState: Record<string, unknown>;
}

export const SchemaFieldControl: React.FC<SchemaFieldControlProps> = ({
  field,
  value,
  onChange,
  formState,
}) => {
  const help = useMemo(() => resolveHelp(field), [field]);
  const [localValue, setLocalValue] = useState(Number(value));

  // Update local value when prop changes
  React.useEffect(() => {
    setLocalValue(Number(value));
  }, [value]);

  // Optimized change handlers for slider
  const handleSliderChange = useCallback((_: Event, newValue: number | number[]) => {
    const resolved = Array.isArray(newValue) ? newValue[0] : newValue;
    setLocalValue(Number(resolved));
  }, []);

  const handleSliderChangeCommitted = useCallback((_: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const resolved = Array.isArray(newValue) ? newValue[0] : newValue;
    onChange(Number(resolved));
  }, [onChange]);

  if (field.type === "slider") {
    const numericValue = localValue;
    const metadata = getSliderMetadata(field);
    const minValue = typeof field.constraints.conditionalMin === "function"
      ? field.constraints.conditionalMin(formState)
      : field.constraints.min;
    const maxValue = typeof field.constraints.conditionalMax === "function"
      ? field.constraints.conditionalMax(formState)
      : field.constraints.max;
    const rangeIndicators = resolveSliderRangeIndicators(metadata, { formState });
    const sliderState = resolveSliderState(metadata, {
      value: numericValue,
      formState,
      dynamicMax: maxValue,
    });

    const marks =
      rangeIndicators.length > 0
        ? rangeIndicators.map((indicator) => ({
            value: indicator.value,
            label: indicator.label,
          }))
        : undefined;

    const labelFormatter =
      typeof field.constraints.format === "function"
        ? field.constraints.format
        : (val: number) => `${val}`;

    const sliderSx: Record<string, unknown> = {
      color: sliderState?.trackColor,
      '& .MuiSlider-track': {
        transition: 'none',
      },
      '& .MuiSlider-thumb': {
        transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      },
    };

    if (marks && marks.length > 0) {
      sliderSx['& .MuiSlider-markLabel'] = {
        whiteSpace: 'nowrap',
        textAlign: 'center',
        lineHeight: 1.2,
        transform: 'translateX(-50%)',
        display: { xs: 'none', lg: 'block' },
      };

      if (marks.length > 1) {
        sliderSx['& .MuiSlider-markLabel[data-index="0"]'] = {
          transform: 'translateX(0%)',
          textAlign: 'left',
        };

        sliderSx[`& .MuiSlider-markLabel[data-index="${marks.length - 1}"]`] = {
          transform: 'translateX(-100%)',
          textAlign: 'right',
        };
      }
    }

    return (
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 0.5, sm: 1 },
            flexWrap: 'wrap',
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.875rem', sm: '0.875rem' },
              fontWeight: 600,
            }}
          >
            {field.label}: {labelFormatter(numericValue)}
          </Typography>
          {help ? (
            <HelpTooltip
              title={help.title}
              description={help.description}
              size="small"
            />
          ) : null}
          {sliderState ? (
            <Chip
              label={sliderState.label}
              size="small"
              sx={{
                backgroundColor: sliderState.badgeColor,
                color: "#fff",
                height: 22,
                fontSize: '0.75rem',
              }}
            />
          ) : null}
        </Box>
        <Slider
          value={numericValue}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderChangeCommitted}
          min={minValue}
          max={maxValue}
          step={field.constraints.step}
          marks={marks}
          valueLabelDisplay="auto"
          valueLabelFormat={(val) => labelFormatter(Number(val))}
          sx={sliderSx as SxProps<Theme>}
        />
      </Stack>
    );
  }

  const isCurrency = field.constraints.displayUnit === "$";
  const isStringField = field.id === "scenarioName";

  return (
    <Stack spacing={1} sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" color="text.secondary">
          {field.label}
        </Typography>
        {help ? (
          <HelpTooltip title={help.title} description={help.description} size="small" />
        ) : null}
      </Stack>
      <TextField
        size="small"
        type={isStringField ? "text" : "number"}
        value={value}
        onChange={(event) => {
          if (isStringField) {
            onChange(event.target.value);
          } else {
            const numeric = Number(event.target.value);
            onChange(Number.isNaN(numeric) ? 0 : numeric);
          }
        }}
        inputProps={
          isStringField
            ? {
                spellCheck: false,
                "data-ms-editor": "false",
              }
            : undefined
        }
        InputProps={
          isCurrency
            ? {
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }
            : undefined
        }
      />
    </Stack>
  );
};
