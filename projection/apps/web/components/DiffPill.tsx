"use client";
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface DiffPillProps {
  difference: number;
  label?: string;
  format?: 'currency' | 'percent';
}

export function DiffPill({ difference, label = 'vs Baseline (Real)', format = 'currency' }: DiffPillProps) {
  const isPositive = difference > 0;
  const absValue = Math.abs(difference);
  
  const formattedValue = format === 'currency'
    ? `$${absValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : `${absValue.toFixed(1)}%`;
  
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        borderRadius: 99,
        backgroundColor: isPositive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
        border: `1px solid ${isPositive ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
      }}
    >
      {isPositive ? (
        <TrendingUp sx={{ color: '#4CAF50', fontSize: 20 }} />
      ) : (
        <TrendingDown sx={{ color: '#F44336', fontSize: 20 }} />
      )}
      
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '0.9rem',
          color: isPositive ? '#4CAF50' : '#F44336',
        }}
      >
        {isPositive ? '+' : '-'}{formattedValue}
      </Typography>
      
      <Typography
        sx={{
          fontSize: '0.85rem',
          color: 'rgba(48, 64, 58, 0.7)',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
