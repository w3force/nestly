/**
 * DeterministicForm Component
 * Renders the deterministic calculator form using schema-driven SliderField components
 * Reads from DETERMINISTIC_SCREEN with platform-specific styling
 */

import React from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Alert,
  Stack,
  TextField,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { ContributionSlider } from './ContributionSlider';
import { ReturnRateSlider } from './ReturnRateSlider';
import { InflationSlider } from './InflationSlider';
import {
  DETERMINISTIC_SCREEN,
  AGE_FIELD,
  RETIREMENT_AGE_FIELD,
  CURRENT_BALANCE_FIELD,
  ANNUAL_CONTRIBUTION_FIELD,
  EXPECTED_RETURN_FIELD,
  INFLATION_FIELD,
} from '@projection/shared';
import { HelpTooltip } from './HelpTooltip';
import { helpContent } from '../lib/helpContent';

interface DeterministicFormProps {
  age: number;
  setAge: (value: number) => void;
  retireAge: number;
  setRetireAge: (value: number) => void;
  balance: number;
  setBalance: (value: number) => void;
  contribution: number;
  setContribution: (value: number) => void;
  rate: number;
  setRate: (value: number) => void;
  inflation: number;
  setInflation: (value: number) => void;
  onSubmit: (e: any) => void;
  loading?: boolean;
  error?: string;
  onSaveScenario?: () => void;
  onOpenWhatIf?: () => void;
}

export const DeterministicForm: React.FC<DeterministicFormProps> = ({
  age,
  setAge,
  retireAge,
  setRetireAge,
  balance,
  setBalance,
  contribution,
  setContribution,
  rate,
  setRate,
  inflation,
  setInflation,
  onSubmit,
  loading = false,
  error,
  onSaveScenario,
  onOpenWhatIf,
}) => {
  // Get schema configuration
  const personalSection = DETERMINISTIC_SCREEN.sections[0];
  const savingsSection = DETERMINISTIC_SCREEN.sections[1];
  const assumptionsSection = DETERMINISTIC_SCREEN.sections[2];
  const webDefaults = DETERMINISTIC_SCREEN.platformVariants?.web?.sliderDefaults;
  const calculatorHelp = helpContent.calculator;

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mb: 3, mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Personal Information Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#30403A',
            mb: 2,
            fontSize: '1rem',
          }}
        >
          {personalSection.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(48, 64, 58, 0.7)',
            mb: 2,
            fontSize: '0.875rem',
          }}
        >
          {personalSection.description}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={
                <Box
                  component="span"
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                >
                  {AGE_FIELD.label}
                  <HelpTooltip
                    title={calculatorHelp.currentAge.title}
                    description={calculatorHelp.currentAge.description}
                    size="small"
                    placement="right"
                  />
                </Box>
              }
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              inputProps={{ min: AGE_FIELD.constraints.min, max: AGE_FIELD.constraints.max }}
              fullWidth
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={
                <Box
                  component="span"
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                >
                  {RETIREMENT_AGE_FIELD.label}
                  <HelpTooltip
                    title={calculatorHelp.retirementAge.title}
                    description={calculatorHelp.retirementAge.description}
                    size="small"
                    placement="right"
                  />
                </Box>
              }
              type="number"
              value={retireAge}
              onChange={(e) => setRetireAge(Number(e.target.value))}
              inputProps={{ min: RETIREMENT_AGE_FIELD.constraints.min, max: RETIREMENT_AGE_FIELD.constraints.max }}
              fullWidth
              size="small"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Savings & Contributions Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#30403A',
            mb: 2,
            fontSize: '1rem',
          }}
        >
          {savingsSection.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(48, 64, 58, 0.7)',
            mb: 2,
            fontSize: '0.875rem',
          }}
        >
          {savingsSection.description}
        </Typography>

        <Stack spacing={2}>
          <TextField
            label={
              <Box
                component="span"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
              >
                {CURRENT_BALANCE_FIELD.label}
                <HelpTooltip
                  title={calculatorHelp.currentBalance.title}
                  description={calculatorHelp.currentBalance.description}
                  size="small"
                  placement="right"
                />
              </Box>
            }
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            inputProps={{ min: CURRENT_BALANCE_FIELD.constraints.min }}
            fullWidth
            size="small"
            variant="outlined"
            InputProps={{
              startAdornment: '$',
            }}
          />

          {/* Annual Contribution Slider with Mobile-style UX */}
          <ContributionSlider
            age={age}
            value={contribution}
            onChange={setContribution}
            field={ANNUAL_CONTRIBUTION_FIELD}
            platformDefaults={webDefaults}
            help={{
              title: calculatorHelp.annualContribution.title,
              description: calculatorHelp.annualContribution.description,
            }}
          />
        </Stack>
      </Box>

      {/* Retirement Assumptions Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#30403A',
            mb: 2,
            fontSize: '1rem',
          }}
        >
          {assumptionsSection.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(48, 64, 58, 0.7)',
            mb: 2,
            fontSize: '0.875rem',
          }}
        >
          {assumptionsSection.description}
        </Typography>

        <Stack spacing={2}>
          {/* Expected Return Slider with Risk Assessment */}
          <ReturnRateSlider
            value={rate}
            onChange={setRate}
            field={EXPECTED_RETURN_FIELD}
            platformDefaults={webDefaults}
            help={{
              title: calculatorHelp.expectedReturn.title,
              description: calculatorHelp.expectedReturn.description,
            }}
          />

          {/* Inflation Slider with Inflation Level Assessment */}
          <InflationSlider
            value={inflation}
            onChange={setInflation}
            field={INFLATION_FIELD}
            platformDefaults={webDefaults}
            help={{
              title: calculatorHelp.inflation.title,
              description: calculatorHelp.inflation.description,
            }}
          />
        </Stack>
      </Box>

      {/* Buttons */}
      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading}
          sx={{
            backgroundColor: '#69B47A',
            color: '#FFFFFF',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#5A9D6D',
            },
            '&:disabled': {
              backgroundColor: 'rgba(105, 180, 122, 0.5)',
            },
          }}
        >
          {loading ? 'Calculating...' : 'Calculate'}
        </Button>

        {onOpenWhatIf && (
          <Button
            variant="outlined"
            startIcon={<CompareArrowsIcon />}
            onClick={onOpenWhatIf}
            sx={{
              borderColor: '#4ABDAC',
              color: '#4ABDAC',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(74, 189, 172, 0.08)',
              },
            }}
          >
            Open in What-If
          </Button>
        )}

        {onSaveScenario && (
          <Button
            variant="text"
            onClick={onSaveScenario}
            sx={{
              color: '#69B47A',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(105, 180, 122, 0.08)',
              },
            }}
          >
            Save as Scenario
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default DeterministicForm;
