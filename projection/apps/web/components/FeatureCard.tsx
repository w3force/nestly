"use client";
import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import Link from 'next/link';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  locked?: boolean;
  badge?: string;
}

export function FeatureCard({ title, description, icon, href, locked, badge }: FeatureCardProps) {
  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        transition: 'all 0.3s ease',
        cursor: locked ? 'not-allowed' : 'pointer',
        opacity: locked ? 0.7 : 1,
        '&:hover': locked ? {} : {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(105, 180, 122, 0.2)',
        },
      }}
    >
      {locked && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '50%',
            p: 0.5,
          }}
        >
          <LockOutlined sx={{ color: '#FFA726', fontSize: 20 }} />
        </Box>
      )}
      
      {badge && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1,
            backgroundColor: '#FFD54F',
            color: '#1A1A1A',
            px: 1.5,
            py: 0.5,
            borderRadius: 99,
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {badge}
        </Box>
      )}

      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 2, color: locked ? '#999' : '#69B47A' }}>
          {icon}
        </Box>
        
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: locked ? '#666' : '#30403A',
            mb: 1,
          }}
        >
          {title}
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: locked ? '#888' : 'rgba(48, 64, 58, 0.7)',
            mb: 2,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
        
        <Button
          component={locked ? 'button' : Link}
          href={locked ? undefined : href}
          fullWidth
          variant={locked ? 'outlined' : 'contained'}
          sx={{
            textTransform: 'none',
            borderRadius: 99,
            py: 1,
            backgroundColor: locked ? 'transparent' : '#69B47A',
            borderColor: locked ? '#999' : undefined,
            color: locked ? '#666' : 'white',
            '&:hover': {
              backgroundColor: locked ? 'transparent' : '#5AA468',
            },
          }}
        >
          {locked ? 'Upgrade to Unlock' : 'Open'}
        </Button>
      </CardContent>
    </Card>
  );
}
