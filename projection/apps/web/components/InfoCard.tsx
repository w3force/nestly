"use client";
import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Collapse, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
  variant?: 'default' | 'tip' | 'warning';
}

export function InfoCard({ 
  title, 
  description, 
  icon,
  defaultExpanded = false,
  variant = 'default',
}: InfoCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const colors = {
    default: {
      bg: 'rgba(105, 180, 122, 0.08)',
      border: 'rgba(105, 180, 122, 0.3)',
      icon: '#69B47A',
    },
    tip: {
      bg: 'rgba(33, 150, 243, 0.08)',
      border: 'rgba(33, 150, 243, 0.3)',
      icon: '#2196F3',
    },
    warning: {
      bg: 'rgba(255, 152, 0, 0.08)',
      border: 'rgba(255, 152, 0, 0.3)',
      icon: '#FF9800',
    },
  };

  const color = colors[variant];

  return (
    <Card
      sx={{
        backgroundColor: color.bg,
        borderLeft: `4px solid ${color.border}`,
        boxShadow: 'none',
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon || <InfoOutlinedIcon sx={{ color: color.icon, fontSize: 22 }} />}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#30403A' }}>
              {title}
            </Typography>
          </Box>
          <IconButton size="small" sx={{ color: color.icon }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        
        <Collapse in={expanded}>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              ml: icon ? 4 : 4,
              color: 'text.secondary',
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        </Collapse>
      </CardContent>
    </Card>
  );
}
