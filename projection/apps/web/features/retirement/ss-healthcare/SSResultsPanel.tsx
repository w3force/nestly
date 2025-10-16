"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Divider,
  Alert,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import { SSHealthcareResults, InputMode } from './types';
import { HelpTooltip } from '../../../components/HelpTooltip';

interface SSResultsPanelProps {
  results: SSHealthcareResults | null;
  loading?: boolean;
  onCopy?: () => void;
  mode?: InputMode;
  onSwitchToDetailed?: () => void;
}

export function SSResultsPanel({ 
  results, 
  loading = false, 
  onCopy,
  mode = 'DETAILED',
  onSwitchToDetailed,
}: SSResultsPanelProps) {
  if (loading) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography variant="body1" color="text.secondary" align="center">
            Computing...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card elevation={2} sx={{ backgroundColor: 'rgba(74, 189, 172, 0.05)' }}>
        <CardContent>
          <Typography variant="body1" color="text.secondary" align="center">
            Enter your information and click <strong>Compute</strong> to see results.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { ssa: ssaCalc, medicare: medicareCalc, medicaid, net: netBenefit } = results;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleCopySummary = () => {
    const summary = `
Social Security Estimate:
- AIME: ${formatCurrency(ssaCalc.aime)}/month
- PIA @ FRA (${ssaCalc.fra}): ${formatCurrency(ssaCalc.pia)}/month
- Monthly @ Claim Age: ${formatCurrency(ssaCalc.monthlyAtClaimAge)}/month
- Adjustment: ${ssaCalc.reductionOrCredit > 0 ? '+' : ''}${(ssaCalc.reductionOrCredit * 100).toFixed(2)}%

Medicare Premiums:
- Part A: ${formatCurrency(medicareCalc.partAPremium)}/month
- Part B (Base + IRMAA): ${formatCurrency(medicareCalc.partBTotal)}/month
- Part D (Base + IRMAA): ${formatCurrency(medicareCalc.partDTotal)}/month
${medicareCalc.medigapPremium ? `- Medigap: ${formatCurrency(medicareCalc.medigapPremium)}/month\n` : ''}${medicareCalc.advantagePremium ? `- Advantage: ${formatCurrency(medicareCalc.advantagePremium)}/month\n` : ''}
- Total: ${formatCurrency(medicareCalc.totalMonthly)}/month
${medicareCalc.irmaApplied ? '- IRMAA surcharges applied\n' : ''}
${medicaid.eligible ? `\nMedicaid Eligible: YES (${medicaid.reason})\n- Adjusted Premiums: ${formatCurrency(medicaid.adjustedPremiums)}/month\n` : ''}
Net Monthly Benefit: ${formatCurrency(netBenefit.netMonthly)}/month
`.trim();

    navigator.clipboard.writeText(summary);
    onCopy?.();
  };

  return (
    <Stack spacing={3}>
      {/* Social Security Card */}
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Social Security Estimate
              <HelpTooltip
                title="SS Calculation"
                description="Based on your AIME (average indexed monthly earnings), SSA calculates your PIA using bend points. Claiming early reduces benefits; delaying increases them."
              />
            </Typography>
            {ssaCalc.reductionOrCredit !== 0 && (
              <Chip
                label={
                  ssaCalc.reductionOrCredit > 0
                    ? `+${(ssaCalc.reductionOrCredit * 100).toFixed(1)}% (Delayed Credits)`
                    : `${(ssaCalc.reductionOrCredit * 100).toFixed(1)}% (Early Reduction)`
                }
                color={ssaCalc.reductionOrCredit > 0 ? 'success' : 'warning'}
                size="small"
              />
            )}
          </Box>

          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ borderBottom: 'none', fontWeight: 600 }}>AIME</TableCell>
                <TableCell align="right" sx={{ borderBottom: 'none' }}>
                  {formatCurrency(ssaCalc.aime)}/month
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ borderBottom: 'none', fontWeight: 600 }}>
                  PIA @ FRA ({ssaCalc.fra})
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: 'none' }}>
                  {formatCurrency(ssaCalc.pia)}/month
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ borderBottom: 'none', fontWeight: 600, fontSize: '1.1rem', color: 'primary.main' }}>
                  Monthly @ Claim Age
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ borderBottom: 'none', fontWeight: 700, fontSize: '1.3rem', color: 'primary.main' }}
                >
                  {formatCurrency(ssaCalc.monthlyAtClaimAge)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Medicare Premiums Card */}
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Medicare Premiums
              <HelpTooltip
                title="Medicare Costs"
                description="Medicare premiums vary by plan type. IRMAA surcharges apply if your MAGI exceeds income thresholds ($103k single, $206k married in 2025)."
              />
            </Typography>
            {medicareCalc.irmaApplied && (
              <Chip label="IRMAA Applied" color="warning" size="small" icon={<WarningAmberIcon />} />
            )}
          </Box>

          <Table size="small">
            <TableBody>
              {medicareCalc.partAPremium > 0 && (
                <TableRow>
                  <TableCell sx={{ borderBottom: 'none' }}>Part A</TableCell>
                  <TableCell align="right" sx={{ borderBottom: 'none' }}>
                    {formatCurrency(medicareCalc.partAPremium)}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell sx={{ borderBottom: 'none' }}>
                  Part B {medicareCalc.partBIRMAA > 0 && '(Base + IRMAA)'}
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: 'none' }}>
                  {formatCurrency(medicareCalc.partBTotal)}
                  {medicareCalc.partBIRMAA > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      ({formatCurrency(medicareCalc.partBBase)} + {formatCurrency(medicareCalc.partBIRMAA)})
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ borderBottom: 'none' }}>
                  Part D {medicareCalc.partDIRMAA > 0 && '(Base + IRMAA)'}
                </TableCell>
                <TableCell align="right" sx={{ borderBottom: 'none' }}>
                  {formatCurrency(medicareCalc.partDTotal)}
                  {medicareCalc.partDIRMAA > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      ({formatCurrency(medicareCalc.partDBase)} + {formatCurrency(medicareCalc.partDIRMAA)})
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
              {medicareCalc.medigapPremium !== undefined && medicareCalc.medigapPremium > 0 && (
                <TableRow>
                  <TableCell sx={{ borderBottom: 'none' }}>Medigap Supplement</TableCell>
                  <TableCell align="right" sx={{ borderBottom: 'none' }}>
                    {formatCurrency(medicareCalc.medigapPremium)}
                  </TableCell>
                </TableRow>
              )}
              {medicareCalc.advantagePremium !== undefined && (
                <TableRow>
                  <TableCell sx={{ borderBottom: 'none' }}>Medicare Advantage</TableCell>
                  <TableCell align="right" sx={{ borderBottom: 'none' }}>
                    {formatCurrency(medicareCalc.advantagePremium)}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell sx={{ borderBottom: 'none', pt: 2 }}>
                  <Divider sx={{ my: 1 }} />
                </TableCell>
                <TableCell sx={{ borderBottom: 'none', pt: 2 }}>
                  <Divider sx={{ my: 1 }} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ borderBottom: 'none', fontWeight: 700 }}>Total Monthly</TableCell>
                <TableCell align="right" sx={{ borderBottom: 'none', fontWeight: 700, fontSize: '1.1rem' }}>
                  {formatCurrency(medicareCalc.totalMonthly)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Medicaid Eligibility (if eligible) */}
      {medicaid.eligible && (
        <Alert severity="success" icon={<CheckCircleIcon />}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Medicaid Eligible (Dual Eligible)
          </Typography>
          <Typography variant="body2">{medicaid.reason}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Medicare premiums reduced to: <strong>{formatCurrency(medicaid.adjustedPremiums)}/month</strong>
          </Typography>
        </Alert>
      )}

      {/* Net Benefit Card */}
      <Card elevation={3} sx={{ backgroundColor: 'rgba(74, 189, 172, 0.08)', border: '2px solid #4ABDAC' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Net Monthly Benefit
              <HelpTooltip
                title="Net Benefit Calculation"
                description="Your Social Security benefit minus Medicare premiums (after employer/HSA offset). This is your net monthly retirement income from SS+Medicare."
              />
            </Typography>
            <Tooltip title="Copy summary to clipboard">
              <IconButton onClick={handleCopySummary} size="small">
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Social Security
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {formatCurrency(ssaCalc.monthlyAtClaimAge)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Medicare Premiums
              </Typography>
              <Typography variant="body1" fontWeight={600} color="error.main">
                -{formatCurrency(netBenefit.medicarePremiums)}
              </Typography>
            </Box>

            {netBenefit.employerOffset > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Employer/HSA Offset
                </Typography>
                <Typography variant="body1" fontWeight={600} color="success.main">
                  +{formatCurrency(netBenefit.employerOffset)}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                Net Monthly
              </Typography>
              <Typography variant="h5" fontWeight={800} color="primary.main">
                {formatCurrency(netBenefit.netMonthly)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Net Annual
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {formatCurrency(netBenefit.netMonthly * 12)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Quick Mode: Show Assumptions and Switch Button */}
      {mode === 'QUICK' && (
        <>
          <Accordion elevation={1} sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" fontWeight={600}>
                📋 Assumptions Used in Quick Estimate
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Medicare Plan"
                    secondary="Medicare Advantage (~$0-35/month typical)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Part B Premium"
                    secondary="Standard 2025 premium ($185/month)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="IRMAA Calculation"
                    secondary="Based on 90% of current income as estimated MAGI"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="SS Credits"
                    secondary="Assumed 40 credits (fully insured)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Filing Status"
                    secondary="Single (use Detailed mode for married calculations)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="AIME Estimation"
                    secondary="Projected from current income with 3% wage growth, capped at SS wage base"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          {onSwitchToDetailed && (
            <Card elevation={1} sx={{ mt: 2, backgroundColor: 'rgba(74, 189, 172, 0.05)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Need More Control?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Switch to Detailed mode to customize plan types, IRMAA overrides, and more.
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<SettingsIcon />}
                    onClick={onSwitchToDetailed}
                    sx={{ ml: 2, flexShrink: 0 }}
                  >
                    Detailed Mode
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Stack>
  );
}
