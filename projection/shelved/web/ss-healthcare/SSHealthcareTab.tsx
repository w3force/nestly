"use client";

import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Alert,
  AlertTitle,
  Snackbar,
  CircularProgress,
  Switch,
  FormControlLabel,
  Typography,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import { QuickForm } from './QuickForm';
import { DetailedForm } from './DetailedForm';
import { SSResultsPanel } from './SSResultsPanel';
import { NetByClaimAgeChart } from './NetByClaimAgeChart';
import { 
  InputMode, 
  QuickModeInputs, 
  DetailedModeInputs, 
  SSHealthcareResults,
  getDefaultQuickInputs,
  getDefaultDetailedInputs,
  quickToDetailed,
} from '@projection/shared';
import { computeSSHealthcareResults } from './computeActions';

export function SSHealthcareTab() {
  const [mode, setMode] = useState<InputMode>('QUICK');
  const [quickInputs, setQuickInputs] = useState<QuickModeInputs>(getDefaultQuickInputs());
  const [detailedInputs, setDetailedInputs] = useState<DetailedModeInputs>(getDefaultDetailedInputs());
  const [results, setResults] = useState<SSHealthcareResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [useInModel, setUseInModel] = useState(false);

  const handleModeSwitch = (newMode: InputMode) => {
    if (newMode === mode) return;
    
    // Migrate data when switching from Quick to Detailed
    if (mode === 'QUICK' && newMode === 'DETAILED') {
      const migrated = quickToDetailed(quickInputs);
      setDetailedInputs(migrated);
    }
    // When switching from Detailed to Quick, preserve basic values
    else if (mode === 'DETAILED' && newMode === 'QUICK') {
      setQuickInputs({
        birthYear: detailedInputs.birthYear,
        claimAge: detailedInputs.claimAge,
        incomeToday: detailedInputs.magi,
        yearsWorked: 25, // Default assumption
        stateCode: detailedInputs.stateCode,
      });
    }
    
    setMode(newMode);
    setResults(null); // Clear results on mode switch
  };

  const handleCompute = async () => {
    setLoading(true);
    
    try {
      const currentInputs = mode === 'QUICK' ? quickInputs : detailedInputs;
      
      // Validate Detailed mode inputs
      if (mode === 'DETAILED') {
        if (detailedInputs.useAIME && (!detailedInputs.aime || detailedInputs.aime <= 0)) {
          throw new Error('Please enter a valid AIME value');
        }
        
        if (!detailedInputs.useAIME && (!detailedInputs.earningsHistory || detailedInputs.earningsHistory.length === 0)) {
          throw new Error('Please enter earnings history or switch to AIME mode');
        }
      }
      
      // Compute results (handles both Quick and Detailed)
      const computed = await computeSSHealthcareResults(currentInputs);
      setResults(computed);
      setSnackbar({ open: true, message: 'Computation complete!' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Computation error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    setSnackbar({ open: true, message: 'Copied to clipboard!' });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Mode Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          SS & Healthcare Estimator
        </Typography>
        
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, value) => value && handleModeSwitch(value)}
          aria-label="input mode"
          size="small"
        >
          <ToggleButton value="QUICK" aria-label="quick mode">
            Quick Estimate
          </ToggleButton>
          <ToggleButton value="DETAILED" aria-label="detailed mode">
            Detailed
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {/* Disclaimer */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Estimate Only - Not Financial Advice</AlertTitle>
        This calculator provides rough estimates based on 2025 SSA and CMS values. Your actual benefits may differ.
        For official estimates, visit{' '}
        <a href="https://www.ssa.gov/myaccount/" target="_blank" rel="noopener noreferrer">
          SSA.gov
        </a>{' '}
        and{' '}
        <a href="https://www.medicare.gov/" target="_blank" rel="noopener noreferrer">
          Medicare.gov
        </a>
        .
      </Alert>

      {/* Main Grid Layout */}
      <Grid container spacing={3}>
        {/* Left Column: Inputs */}
        <Grid item xs={12} md={5}>
          {mode === 'QUICK' ? (
            <QuickForm inputs={quickInputs} onChange={setQuickInputs} disabled={loading} />
          ) : (
            <DetailedForm inputs={detailedInputs} onChange={setDetailedInputs} disabled={loading} />
          )}

          {/* Compute Button */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleCompute}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <CalculateIcon />}
              sx={{
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 700,
                backgroundColor: '#4ABDAC',
                '&:hover': {
                  backgroundColor: '#3DA094',
                },
              }}
            >
              {loading ? 'Computing...' : 'Compute'}
            </Button>
          </Box>

          {/* Integration Toggle */}
          {results && (
            <Card elevation={2} sx={{ mt: 3, backgroundColor: 'rgba(74, 189, 172, 0.05)' }}>
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch checked={useInModel} onChange={(e) => setUseInModel(e.target.checked)} color="primary" />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        Use in Retirement Model
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Integrate net monthly benefit ({results.net.netMonthly.toFixed(2)}/month) into
                        Deterministic/Monte Carlo calculations
                      </Typography>
                    </Box>
                  }
                />
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column: Results */}
        <Grid item xs={12} md={7}>
          <SSResultsPanel 
            results={results} 
            loading={loading} 
            onCopy={handleCopy}
            mode={mode}
            onSwitchToDetailed={() => handleModeSwitch('DETAILED')}
          />
        </Grid>

        {/* Bottom Row: Chart */}
        {results && (
          <Grid item xs={12}>
            <NetByClaimAgeChart 
              sweep={results.sweep} 
              selectedAge={mode === 'QUICK' ? quickInputs.claimAge : detailedInputs.claimAge} 
              loading={loading} 
            />
          </Grid>
        )}
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
