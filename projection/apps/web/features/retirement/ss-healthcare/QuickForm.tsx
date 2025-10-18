"use client";

import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Stack,
  Card,
  CardContent,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { HelpTooltip } from '../../../components/HelpTooltip';
import { QuickModeInputs, ClaimAge, getFRA, US_STATES } from '@projection/shared';

interface QuickFormProps {
  inputs: QuickModeInputs;
  onChange: (inputs: QuickModeInputs) => void;
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

export function QuickForm({ inputs, onChange, disabled = false }: QuickFormProps) {
  const handleChange = (field: keyof QuickModeInputs, value: any) => {
    onChange({ ...inputs, [field]: value });
  };

  const fra = getFRA(inputs.birthYear);

  return (
    <Stack spacing={3}>
      <Card elevation={2} sx={{ backgroundColor: 'rgba(105, 180, 122, 0.03)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            Quick Estimate - Just 5 Questions
            <HelpTooltip
              title="Quick Mode"
              description="Provide minimal information for a fast estimate. We'll use smart defaults for everything else. Switch to Detailed mode for full control."
            />
          </Typography>

          <Stack spacing={3}>
            {/* Birth Year */}
            <TextField
              label="What year were you born?"
              type="number"
              value={inputs.birthYear}
              onChange={(e) => handleChange('birthYear', parseInt(e.target.value) || 1960)}
              disabled={disabled}
              inputProps={{ min: 1937, max: 2010 }}
              helperText={`Your Full Retirement Age: ${fra}`}
              sx={inputFieldStyles}
              fullWidth
              required
            />

            {/* Claim Age */}
            <FormControl fullWidth sx={inputFieldStyles} required>
              <InputLabel>When do you plan to start benefits?</InputLabel>
              <Select
                value={inputs.claimAge}
                label="When do you plan to start benefits?"
                onChange={(e) => handleChange('claimAge', e.target.value as ClaimAge)}
                disabled={disabled}
              >
                {CLAIM_AGES.map((age) => (
                  <MenuItem key={age} value={age}>
                    Age {age} {age === Math.floor(fra) ? '(Full Retirement Age)' : ''}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {inputs.claimAge < fra
                  ? `⚠️ Claiming early reduces benefits`
                  : inputs.claimAge > fra
                  ? `✓ Delayed credits increase benefits`
                  : `✓ Full benefit (no reduction)`}
              </FormHelperText>
            </FormControl>

            {/* Income Today */}
            <TextField
              label="What's your current annual income?"
              type="number"
              value={inputs.incomeToday}
              onChange={(e) => handleChange('incomeToday', parseFloat(e.target.value) || 0)}
              disabled={disabled}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText="We'll estimate your lifetime earnings from this"
              sx={inputFieldStyles}
              fullWidth
              required
            />

            {/* Years Worked */}
            <TextField
              label="How many years have you worked?"
              type="number"
              value={inputs.yearsWorked}
              onChange={(e) => handleChange('yearsWorked', parseInt(e.target.value) || 35)}
              disabled={disabled}
              inputProps={{ min: 1, max: 50 }}
              helperText="Social Security uses your highest 35 years"
              sx={inputFieldStyles}
              fullWidth
            />

            {/* State */}
            <FormControl fullWidth sx={inputFieldStyles}>
              <InputLabel>What state do you live in?</InputLabel>
              <Select
                value={inputs.stateCode}
                label="What state do you live in?"
                onChange={(e) => handleChange('stateCode', e.target.value)}
                disabled={disabled}
              >
                {Object.entries(US_STATES).map(([code, name]) => (
                  <MenuItem key={code} value={code}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Used to estimate Medicare/Medicaid costs</FormHelperText>
            </FormControl>
          </Stack>

          {/* What's Assumed Box */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              backgroundColor: 'rgba(255, 213, 79, 0.1)',
              borderRadius: 2,
              border: '1px dashed rgba(255, 213, 79, 0.5)',
            }}
          >
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              💡 Smart Defaults We're Using:
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div" sx={{ lineHeight: 1.8 }}>
              • Medicare Advantage plan (~$0-35/month)
              <br />
              • Part B premium: $185/month (2025)
              <br />
              • No IRMAA surcharges (typical retiree income)
              <br />
              • Assumes you have 40 credits (Part A free)
              <br />• For detailed control, switch to <strong>Detailed Mode</strong>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
