"use client";
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Spa as SpaIcon,
  LocalFlorist as LocalFloristIcon,
  Diamond as DiamondIcon,
} from '@mui/icons-material';
import Image from 'next/image';

interface FeatureRow {
  feature: string;
  free: string | boolean;
  standard: string | boolean;
  premium: string | boolean;
}

const features: FeatureRow[] = [
  {
    feature: 'Quick Start (No Setup Needed)',
    free: true,
    standard: true,
    premium: true,
  },
  {
    feature: 'Smart 401(k) & Savings Calculator',
    free: true,
    standard: true,
    premium: 'Advanced with tax & inflation',
  },
  {
    feature: 'Projection Graphs & Growth Curve',
    free: 'Static',
    standard: 'Up to 3',
    premium: 'Advanced with custom metrics',
  },
  {
    feature: 'Save Your Scenarios',
    free: false,
    standard: 'Up to 3',
    premium: 'Unlimited',
  },
  {
    feature: '"What-If" Simulator',
    free: 'One parameter',
    standard: 'Multi-parameter',
    premium: 'Unlimited + side-by-side compare',
  },
  {
    feature: 'Goal Tracker',
    free: false,
    standard: 'Basic goals',
    premium: 'Full goal dashboard & milestones',
  },
  {
    feature: 'AI Insights & Tips',
    free: false,
    standard: 'Basic',
    premium: 'Personalized Advisor Mode',
  },
  {
    feature: 'Portfolio & Account Sync (Plaid/API)',
    free: false,
    standard: false,
    premium: 'Real-time updates',
  },
  {
    feature: 'Data Export (PDF / CSV)',
    free: false,
    standard: '1 report/month',
    premium: 'Unlimited exports',
  },
  {
    feature: 'Visual Themes (Light / Dark Mode)',
    free: false,
    standard: false,
    premium: 'Yes',
  },
  {
    feature: 'Email / Push Notifications',
    free: false,
    standard: 'Monthly summary',
    premium: 'Smart reminders + insights',
  },
  {
    feature: 'Secure Cloud Backup',
    free: false,
    standard: 'Basic',
    premium: 'Encrypted + Priority sync',
  },
];

const renderCell = (value: string | boolean) => {
  if (value === true) {
    return <CheckCircleIcon sx={{ color: '#69B47A', fontSize: 24 }} />;
  }
  if (value === false) {
    return <CancelIcon sx={{ color: '#bdbdbd', fontSize: 24 }} />;
  }
  return (
    <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
      {value}
    </Typography>
  );
};

export function PlansComparison() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mobile: Stacked cards view
  if (isMobile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <SpaIcon sx={{ fontSize: 32, color: '#69B47A' }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#30403A' }}>
              nestly
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#30403A' }}>
            Nestly Plans Comparison
          </Typography>
        </Box>

        <Stack spacing={3}>
          {/* Free Tier Card */}
          <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SpaIcon sx={{ fontSize: 28, color: '#69B47A' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#30403A' }}>
                  Free
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
                (No Sign-In)
              </Typography>
              {features.map((row, idx) => (
                <Box key={idx} sx={{ py: 1.5, borderBottom: idx < features.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.85rem' }}>
                    {row.feature}
                  </Typography>
                  <Box>{renderCell(row.free)}</Box>
                </Box>
              ))}
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#69B47A' }}>
                  Free
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Standard Tier Card */}
          <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocalFloristIcon sx={{ fontSize: 28, color: '#4ABDAC' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#30403A' }}>
                  Standard
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
                (Free Sign-In)
              </Typography>
              {features.map((row, idx) => (
                <Box key={idx} sx={{ py: 1.5, borderBottom: idx < features.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.85rem' }}>
                    {row.feature}
                  </Typography>
                  <Box>{renderCell(row.standard)}</Box>
                </Box>
              ))}
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#4ABDAC' }}>
                  Free
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Premium Tier Card */}
          <Card 
            sx={{ 
              borderRadius: 4, 
              boxShadow: 4,
              background: 'linear-gradient(135deg, rgba(255,213,79,0.1) 0%, rgba(255,167,38,0.1) 100%)',
              border: '2px solid #FFD54F',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <DiamondIcon sx={{ fontSize: 28, color: '#FFD54F' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#30403A' }}>
                  Premium
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
                (Full Access)
              </Typography>
              {features.map((row, idx) => (
                <Box key={idx} sx={{ py: 1.5, borderBottom: idx < features.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.85rem' }}>
                    {row.feature}
                  </Typography>
                  <Box>{renderCell(row.premium)}</Box>
                </Box>
              ))}
              <Box 
                sx={{ 
                  mt: 3, 
                  p: 2, 
                  background: 'linear-gradient(135deg, #FFD54F 0%, #FFA726 100%)', 
                  borderRadius: 2, 
                  textAlign: 'center' 
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A1A' }}>
                  $5.98/mo or $49.99/yr
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Stack>

        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 3, 
            color: 'text.secondary' 
          }}
        >
          All prices in USD. Cancel anytime.
        </Typography>
      </Container>
    );
  }

  // Desktop: Table view
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
          <SpaIcon sx={{ fontSize: 40, color: '#69B47A' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#30403A' }}>
            nestly
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#30403A' }}>
          Nestly Plans Comparison
        </Typography>
      </Box>

      <Paper
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          backgroundColor: '#FEFDF8',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: '1rem', color: '#30403A', py: 3 }}>
                  Feature
                </TableCell>
                <TableCell align="center" sx={{ py: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <SpaIcon sx={{ fontSize: 32, color: '#69B47A' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#30403A' }}>
                      Free
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      (No Sign-In)
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ py: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <LocalFloristIcon sx={{ fontSize: 32, color: '#4ABDAC' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#30403A' }}>
                      Standard
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      (Free Sign-In)
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    py: 3,
                    background: 'linear-gradient(135deg, rgba(255,213,79,0.15) 0%, rgba(255,167,38,0.15) 100%)',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <DiamondIcon sx={{ fontSize: 32, color: '#FFD54F' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#30403A' }}>
                      Premium
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      (Full Access)
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {features.map((row, idx) => (
                <TableRow 
                  key={idx}
                  sx={{ 
                    '&:nth-of-type(even)': { backgroundColor: '#FAFAFA' },
                    '&:hover': { backgroundColor: '#F5F5F5' },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: '#30403A', py: 2.5 }}>
                    {row.feature}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2.5 }}>
                    {renderCell(row.free)}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2.5 }}>
                    {renderCell(row.standard)}
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ 
                      py: 2.5,
                      background: 'linear-gradient(135deg, rgba(255,213,79,0.05) 0%, rgba(255,167,38,0.05) 100%)',
                    }}
                  >
                    {renderCell(row.premium)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Price Row */}
              <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: '1rem', color: '#30403A', py: 3 }}>
                  Price
                </TableCell>
                <TableCell align="center" sx={{ py: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#69B47A' }}>
                    Free
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ py: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#4ABDAC' }}>
                    Free
                  </Typography>
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    py: 3,
                    background: 'linear-gradient(135deg, rgba(255,213,79,0.2) 0%, rgba(255,167,38,0.2) 100%)',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A1A' }}>
                    $5.98/mo or $49.99/yr
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          textAlign: 'center', 
          mt: 3, 
          color: 'text.secondary',
          fontSize: '0.875rem',
        }}
      >
        All prices in USD. Cancel anytime.
      </Typography>
    </Container>
  );
}
