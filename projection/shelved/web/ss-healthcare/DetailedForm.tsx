"use client";

import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Typography,
  Stack,
  Slider,
  InputAdornment,
  FormHelperText,
  Card,
  CardContent,
  RadioGroup,
  Radio,
  Divider,
} from '@mui/material';
import { HelpTooltip } from '../../../components/HelpTooltip';
import { DetailedModeInputs, ClaimAge, FilingStatus, PlanType, parseEarningsCSV, US_STATES } from '@projection/shared';

interface DetailedFormProps {
  inputs: DetailedModeInputs;
  onChange: (inputs: DetailedModeInputs) => void;
  disabled?: boolean;
}

const CLAIM_AGES: ClaimAge[] = [62, 63, 64, 65, 66, 67, 68, 69, 70];

const inputFieldStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 2,
    "& fieldset": { borderColor: "rgba(74, 189, 172, 0.35)" },
    "&:hover fieldset": { borderColor: "rgba(74, 189, 172, 0.6)" },
    "&.Mui-focused fieldset": {
      borderColor: "#4ABDAC",
      borderWidth: 2,
    },
  },
};

export function DetailedForm({ inputs, onChange, disabled = false }: DetailedFormProps) {
  const handleChange = (field: keyof DetailedModeInputs, value: any) => {
    onChange({ ...inputs, [field]: value });
  };

  const handleEarningsChange = (csv: string) => {
    try {
      const parsed = parseEarningsCSV(csv);
      handleChange('earningsHistory', parsed);
    } catch (err) {
      console.error('Invalid earnings CSV:', err);
    }
  };

  return (
    <Stack spacing={3}>
      {/* Basic Info Card */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Basic Information
            <HelpTooltip
              title="Birth Year & Claim Age"
              description="Your birth year determines your Full Retirement Age (FRA). Claiming before FRA reduces benefits; delaying past FRA increases them up to age 70."
            />
          </Typography>
          
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Birth Year"
              type="number"
              value={inputs.birthYear}
              onChange={(e) => handleChange('birthYear', parseInt(e.target.value) || 1960)}
              disabled={disabled}
              inputProps={{ min: 1937, max: 2010 }}
              helperText="Year you were born (e.g., 1960)"
              sx={inputFieldStyles}
              fullWidth
            />

            <FormControl fullWidth sx={inputFieldStyles}>
              <InputLabel>Claim Age</InputLabel>
              <Select
                value={inputs.claimAge}
                label="Claim Age"
                onChange={(e) => handleChange('claimAge', e.target.value as ClaimAge)}
                disabled={disabled}
              >
                {CLAIM_AGES.map((age) => (
                  <MenuItem key={age} value={age}>
                    Age {age}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Age when you plan to start Social Security</FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={inputFieldStyles}>
              <InputLabel>Filing Status</InputLabel>
              <Select
                value={inputs.filingStatus}
                label="Filing Status"
                onChange={(e) => handleChange('filingStatus', e.target.value as FilingStatus)}
                disabled={disabled}
              >
                <MenuItem value="SINGLE">Single</MenuItem>
                <MenuItem value="MARRIED">Married Filing Jointly</MenuItem>
              </Select>
              <FormHelperText>Affects IRMAA bracket calculations</FormHelperText>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {/* Earnings Card */}
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Earnings History
              <HelpTooltip
                title="AIME vs Earnings History"
                description="You can either enter your exact AIME (from SSA.gov), or paste your earnings history to calculate it automatically with wage indexing."
              />
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={inputs.useAIME}
                  onChange={(e) => handleChange('useAIME', e.target.checked)}
                  disabled={disabled}
                />
              }
              label="Use AIME Directly"
            />
          </Box>

          {inputs.useAIME ? (
            <TextField
              label="AIME (Average Indexed Monthly Earnings)"
              type="number"
              value={inputs.aime || 0}
              onChange={(e) => handleChange('aime', parseFloat(e.target.value) || 0)}
              disabled={disabled}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText="From SSA.gov (typical range: $1,000 - $15,000/month)"
              sx={inputFieldStyles}
              fullWidth
            />
          ) : (
            <TextField
              label="Earnings History (CSV)"
              multiline
              rows={6}
              value={
                inputs.earningsHistory
                  ? inputs.earningsHistory.map((e) => `${e.year},${e.amount}`).join('\n')
                  : ''
              }
              onChange={(e) => handleEarningsChange(e.target.value)}
              disabled={disabled}
              placeholder="2015,65000&#10;2016,68000&#10;2017,72000&#10;..."
              helperText="Format: year,amount (one per line). Include all years with earnings."
              sx={inputFieldStyles}
              fullWidth
            />
          )}
        </CardContent>
      </Card>

      {/* Medicare/Medicaid Card */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Medicare & Medicaid
            <HelpTooltip
              title="Medicare Premiums"
              description="Medicare costs vary based on your plan type and income. IRMAA surcharges apply if your MAGI exceeds thresholds ($103k single, $206k married in 2025)."
            />
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="MAGI (Modified Adjusted Gross Income)"
              type="number"
              value={inputs.magi}
              onChange={(e) => handleChange('magi', parseFloat(e.target.value) || 0)}
              disabled={disabled}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText="Annual income used to determine IRMAA surcharges"
              sx={inputFieldStyles}
              fullWidth
            />

            <FormControl fullWidth sx={inputFieldStyles}>
              <InputLabel>State</InputLabel>
              <Select
                value={inputs.stateCode}
                label="State"
                onChange={(e) => handleChange('stateCode', e.target.value)}
                disabled={disabled}
              >
                {Object.entries(US_STATES).map(([code, name]) => (
                  <MenuItem key={code} value={code}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Used for Medicaid eligibility check</FormHelperText>
            </FormControl>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Medicare Plan Type
                <HelpTooltip
                  title="Original vs Medicare Advantage"
                  description="Original Medicare (Parts A+B) requires separate Part D and Medigap. Medicare Advantage (Part C) bundles everything but may have network restrictions."
                />
              </Typography>
              <RadioGroup
                value={inputs.planType}
                onChange={(e) => handleChange('planType', e.target.value as PlanType)}
              >
                <FormControlLabel
                  value="ORIGINAL"
                  control={<Radio disabled={disabled} />}
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Original Medicare
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Parts A + B + D + Medigap supplement
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="ADVANTAGE"
                  control={<Radio disabled={disabled} />}
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Medicare Advantage (Part C)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        All-in-one plan (usually lower premiums)
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={inputs.hasPartACoverage}
                  onChange={(e) => handleChange('hasPartACoverage', e.target.checked)}
                  disabled={disabled}
                />
              }
              label={
                <Box>
                  <Typography variant="body2">Have Part A Coverage (40 Credits)</Typography>
                  <Typography variant="caption" color="text.secondary">
                    If unchecked, adds $505/month Part A premium
                  </Typography>
                </Box>
              }
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Premium Overrides Card (Optional) */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Premium Overrides (Optional)
            <HelpTooltip
              title="Custom Premiums"
              description="Override default premium estimates with your actual plan costs. Leave blank to use 2025 national averages."
            />
          </Typography>

          <Stack spacing={2} sx={{ mt: 2 }}>
            {inputs.planType === 'ORIGINAL' ? (
              <>
                <TextField
                  label="Part D Premium"
                  type="number"
                  value={inputs.partDPremiumOverride || ''}
                  onChange={(e) =>
                    handleChange('partDPremiumOverride', e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                  disabled={disabled}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/month</InputAdornment>,
                  }}
                  placeholder="50.00"
                  helperText="Leave blank for default ($50/month)"
                  sx={inputFieldStyles}
                  fullWidth
                />
                <TextField
                  label="Medigap Premium"
                  type="number"
                  value={inputs.medigapPremiumOverride || ''}
                  onChange={(e) =>
                    handleChange('medigapPremiumOverride', e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                  disabled={disabled}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/month</InputAdornment>,
                  }}
                  placeholder="150.00"
                  helperText="Leave blank for default ($150/month - avg Plan G)"
                  sx={inputFieldStyles}
                  fullWidth
                />
              </>
            ) : (
              <TextField
                label="Medicare Advantage Premium"
                type="number"
                value={inputs.advantagePremiumOverride || ''}
                onChange={(e) =>
                  handleChange('advantagePremiumOverride', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                disabled={disabled}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  endAdornment: <InputAdornment position="end">/month</InputAdornment>,
                }}
                placeholder="0.00"
                helperText="Leave blank for default ($0/month)"
                sx={inputFieldStyles}
                fullWidth
              />
            )}

            <TextField
              label="Employer/HSA Offset"
              type="number"
              value={inputs.employerHealthcareOffset || 0}
              onChange={(e) => handleChange('employerHealthcareOffset', parseFloat(e.target.value) || 0)}
              disabled={disabled}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                endAdornment: <InputAdornment position="end">/month</InputAdornment>,
              }}
              helperText="Amount employer covers or you withdraw from HSA"
              sx={inputFieldStyles}
              fullWidth
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
