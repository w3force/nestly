"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Stack,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { useUser } from "../contexts/UserContext";
import { BottomNav } from "./BottomNav";
import { PlansComparison } from "./PlansComparison";

export function ProfileContent() {
  const { user, scenarios, deleteScenario, upgradeTier, getTierFeatures } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const searchParams = useSearchParams();

  const tierFeatures = getTierFeatures();

  // Handle URL parameters for tab switching
  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab === 'upgrade' || tab === '2') {
      setActiveTab(2);
    } else if (tab === 'scenarios' || tab === '1') {
      setActiveTab(1);
    } else if (tab === 'account' || tab === '0') {
      setActiveTab(0);
    }
  }, [searchParams]);

  return (
    <>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#F5F5F5", pb: 10 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack spacing={4}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700} color="#30403A">
                  My Profile
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Manage your account and saved scenarios
                </Typography>
              </Box>
              <Chip
                icon={user?.tier === "premium" ? <StarIcon /> : undefined}
                label={`${user?.tier.toUpperCase()} Tier`}
                sx={{
                  backgroundColor: user?.tier === "premium" ? "#FFD54F" : "#e0e0e0",
                  fontWeight: 600,
                  px: 1,
                }}
              />
            </Stack>

            {/* Tabs */}
            <Paper sx={{ borderRadius: 2 }}>
              <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                <Tab label="Account" />
                <Tab label={`Saved Scenarios (${scenarios.length})`} />
                <Tab label="Upgrade" />
              </Tabs>
            </Paper>

            {/* Tab Content */}
            {activeTab === 0 && (
              <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Stack spacing={3}>
                  <Typography variant="h6" fontWeight={600}>
                    Account Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        guest@nestly.com
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Member Since
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {new Date().toLocaleDateString()}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Current Tier
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {user?.tier.charAt(0).toUpperCase() + user?.tier.slice(1)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Scenarios Used
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {scenarios.length} / {tierFeatures.maxScenarios === Infinity ? "∞" : tierFeatures.maxScenarios}
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>
            )}

            {activeTab === 1 && (
              <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Stack spacing={3}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" fontWeight={600}>
                      Saved Scenarios
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {scenarios.length} / {tierFeatures.maxScenarios === Infinity ? "∞" : tierFeatures.maxScenarios} used
                    </Typography>
                  </Box>

                  {scenarios.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No saved scenarios yet
                      </Typography>
                      <Button
                        variant="contained"
                        href="/calculator"
                        sx={{ mt: 2, backgroundColor: "#69B47A" }}
                      >
                        Create Your First Scenario
                      </Button>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Current Savings</TableCell>
                            <TableCell>Contribution</TableCell>
                            <TableCell>Expected Return</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {scenarios.map((scenario) => (
                            <TableRow key={scenario.id}>
                              <TableCell>
                                <Typography fontWeight={600}>{scenario.name}</Typography>
                              </TableCell>
                              <TableCell>{scenario.assumptions.currentAge}</TableCell>
                              <TableCell>
                                ${scenario.assumptions.currentBalance.toLocaleString()}
                              </TableCell>
                              <TableCell>{scenario.assumptions.contribution}%</TableCell>
                              <TableCell>{scenario.assumptions.expReturn}%</TableCell>
                              <TableCell>
                                {new Date(scenario.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => deleteScenario(scenario.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Stack>
              </Paper>
            )}

            {activeTab === 2 && (
              <Box sx={{ mx: -2 }}>
                <PlansComparison />
                
                <Container maxWidth="lg">
                  <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: "rgba(105, 180, 122, 0.1)", mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      💡 <strong>Demo Mode:</strong> In this demo, you can switch tiers instantly. 
                      In production, Premium would require payment via Stripe or similar processor.
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => upgradeTier('free')}
                        disabled={user?.tier === 'free'}
                        sx={{
                          borderColor: '#69B47A',
                          color: user?.tier === 'free' ? '#bdbdbd' : '#69B47A',
                          '&:hover': { borderColor: '#5AA468', backgroundColor: 'rgba(105, 180, 122, 0.05)' },
                        }}
                      >
                        {user?.tier === 'free' ? '✓ Current: Free' : 'Switch to Free'}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => upgradeTier('standard')}
                        disabled={user?.tier === 'standard'}
                        sx={{
                          borderColor: '#4ABDAC',
                          color: user?.tier === 'standard' ? '#bdbdbd' : '#4ABDAC',
                          '&:hover': { borderColor: '#3A9D8F', backgroundColor: 'rgba(74, 189, 172, 0.05)' },
                        }}
                      >
                        {user?.tier === 'standard' ? '✓ Current: Standard' : 'Switch to Standard'}
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => upgradeTier('premium')}
                        disabled={user?.tier === 'premium'}
                        sx={{
                          backgroundColor: user?.tier === 'premium' ? '#bdbdbd' : '#FFD54F',
                          color: '#1A1A1A',
                          fontWeight: 600,
                          '&:hover': { backgroundColor: user?.tier === 'premium' ? '#bdbdbd' : '#FFC107' },
                        }}
                      >
                        {user?.tier === 'premium' ? '✓ Current: Premium' : 'Upgrade to Premium'}
                      </Button>
                    </Box>
                  </Paper>
                </Container>
              </Box>
            )}
          </Stack>
        </Container>
      </Box>

      <BottomNav />
    </>
  );
}
