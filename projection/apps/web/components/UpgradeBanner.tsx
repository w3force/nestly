"use client";
import React from 'react';
import { Card, CardContent, Typography, Button, Box, Stack } from '@mui/material';
import { Upgrade, Star } from '@mui/icons-material';
import Link from 'next/link';

interface UpgradeBannerProps {
  title: string;
  description: string;
  features?: string[];
  compact?: boolean;
}

export function UpgradeBanner({ title, description, features, compact = false }: UpgradeBannerProps) {
  if (compact) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #FFD54F 0%, #FFA726 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Star sx={{ color: '#1A1A1A', fontSize: 24 }} />
          <Typography
            sx={{
              fontWeight: 600,
              color: '#1A1A1A',
              fontSize: '0.95rem',
            }}
          >
            {title}
          </Typography>
        </Box>
        
        <Button
          component={Link}
          href="/profile?tab=upgrade"
          variant="contained"
          size="small"
          startIcon={<Upgrade />}
          sx={{
            backgroundColor: '#1A1A1A',
            color: '#FFD54F',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 99,
            '&:hover': {
              backgroundColor: '#2A2A2A',
            },
          }}
        >
          Upgrade
        </Button>
      </Box>
    );
  }

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #FFD54F 0%, #FFA726 100%)',
        boxShadow: '0 4px 20px rgba(255, 165, 38, 0.3)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Star sx={{ color: '#1A1A1A', fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1A1A1A',
              }}
            >
              {title}
            </Typography>
          </Box>
          
          <Typography
            sx={{
              color: '#1A1A1A',
              opacity: 0.9,
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
          
          {features && features.length > 0 && (
            <Stack spacing={1} sx={{ pl: 2 }}>
              {features.map((feature, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#1A1A1A',
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      color: '#1A1A1A',
                      opacity: 0.9,
                    }}
                  >
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
          
          <Button
            component={Link}
            href="/profile?tab=upgrade"
            variant="contained"
            size="large"
            startIcon={<Upgrade />}
            sx={{
              backgroundColor: '#1A1A1A',
              color: '#FFD54F',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 99,
              mt: 1,
              '&:hover': {
                backgroundColor: '#2A2A2A',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            Upgrade to Premium
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
