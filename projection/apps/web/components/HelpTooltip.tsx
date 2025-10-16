"use client";
import React from 'react';
import { Tooltip, IconButton, Box, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface HelpTooltipProps {
  title: string;
  description: string;
  variant?: 'icon' | 'inline';
  size?: 'small' | 'medium';
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export function HelpTooltip({ 
  title, 
  description, 
  variant = 'icon',
  size = 'small',
  placement = 'top',
}: HelpTooltipProps) {
  const tooltipContent = (
    <Box sx={{ maxWidth: 300 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
        {description}
      </Typography>
    </Box>
  );

  if (variant === 'inline') {
    return (
      <Tooltip title={tooltipContent} arrow placement={placement}>
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'help',
            color: 'primary.main',
            '&:hover': {
              color: 'primary.dark',
            },
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: size === 'small' ? 16 : 20 }} />
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltipContent} arrow placement={placement}>
      <IconButton
        size={size}
        sx={{
          color: 'rgba(0, 0, 0, 0.54)',
          p: 0.5,
          '&:hover': {
            color: '#69B47A',
            backgroundColor: 'rgba(105, 180, 122, 0.08)',
          },
        }}
      >
        <HelpOutlineIcon sx={{ fontSize: size === 'small' ? 18 : 22 }} />
      </IconButton>
    </Tooltip>
  );
}
