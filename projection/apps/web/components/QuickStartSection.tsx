"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  LinearProgress,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  calculateDefaults,
  StrategyType,
  getStrategyConfig,
  formatCurrency,
  createCalculatorParams,
} from "../lib/defaultValues";
import { useRouter } from "next/navigation";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const fadeInUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

interface QuickStartSectionProps {
  onNavigateToCalculator?: () => void;
}

/**
 * QuickStartSection Component
 * 
 * Allows users to enter age, balance, and strategy to see instant retirement projections.
 * Shows portfolio at retirement, monthly income, retirement duration, and confidence level.
 * Users can then navigate to the calculator with all values pre-populated.
 */
export function QuickStartSection({ onNavigateToCalculator }: QuickStartSectionProps) {
  const router = useRouter();
  const [age, setAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [balance, setBalance] = useState(100000);
  const [strategy, setStrategy] = useState<StrategyType>("MID_RISK");

  // Calculate results reactively as user changes inputs
  const result = useMemo(() => {
    if (!age || !balance) return null;
    return calculateDefaults({ age, balance, strategy, retirementAge });
  }, [age, balance, strategy, retirementAge]);

  const strategyConfig = getStrategyConfig(strategy);

  const handleNavigateToCalculator = () => {
    if (!result) return;

    const params = createCalculatorParams(result);
    const queryString = new URLSearchParams(params).toString();

    router.push(`/calculator?${queryString}`);
  };

  const getConfidenceColor = (percentage: number) => {
    if (percentage >= 75) return "#4CAF50";
    if (percentage >= 50) return "#FF9800";
    return "#F44336";
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgba(105, 180, 122, 0.08)",
        py: { xs: 6, md: 8 },
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={fadeInUp.initial}
          whileInView={fadeInUp.animate}
          transition={{ ...fadeInUp.transition, delay: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Stack spacing={{ xs: 4, md: 5 }}>
            {/* Header */}
            <Stack spacing={1} alignItems="center" textAlign="center">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                <LightbulbIcon sx={{ color: "#4ABDAC", fontSize: 28 }} />
                <Typography variant="overline" sx={{ color: "#4ABDAC", fontWeight: 600 }}>
                  ⚡ Quick Start
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#30403A",
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                }}
              >
                See Your Results in 8 Seconds
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(48, 64, 58, 0.7)", maxWidth: "60ch" }}>
                Enter your age, current balance, and investment strategy to see your retirement projection instantly
              </Typography>
            </Stack>

            {/* Input & Results Grid */}
            <Grid container spacing={3}>
              {/* Left Column - Inputs */}
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  {/* Age Input */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#30403A" }}>
                      Current Age
                    </Typography>
                    <TextField
                      inputMode="numeric"
                      value={age}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || value === '-') {
                          setAge(0);
                        } else {
                          const num = Number(value);
                          if (!isNaN(num)) {
                            setAge(num);
                          }
                        }
                      }}
                      onBlur={(e) => {
                        let value = Number(e.target.value) || 0;
                        value = Math.max(18, Math.min(100, value));
                        setAge(value);
                      }}
                      fullWidth
                      variant="outlined"
                      placeholder="e.g., 35"
                      inputProps={{ min: 18, max: 100 }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #E0E0E0",
                          transition: "all 0.2s ease",
                          "&:hover fieldset": {
                            borderColor: "#4ABDAC",
                            borderWidth: "2px",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4ABDAC",
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "14px 12px",
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "rgba(48, 64, 58, 0.6)" }}>
                      You have {Math.max(0, retirementAge - age)} years until retirement age
                    </Typography>
                  </Box>

                  {/* Retirement Age Input */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#30403A" }}>
                      Target Retirement Age
                    </Typography>
                    <TextField
                      inputMode="numeric"
                      value={retirementAge}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || value === '-') {
                          setRetirementAge(0);
                        } else {
                          const num = Number(value);
                          if (!isNaN(num)) {
                            setRetirementAge(num);
                          }
                        }
                      }}
                      onBlur={(e) => {
                        let value = Number(e.target.value) || 0;
                        value = Math.max(40, Math.min(100, value));
                        setRetirementAge(value);
                      }}
                      fullWidth
                      variant="outlined"
                      placeholder="e.g., 65"
                      inputProps={{ min: 40, max: 100 }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #E0E0E0",
                          transition: "all 0.2s ease",
                          "&:hover fieldset": {
                            borderColor: "#4ABDAC",
                            borderWidth: "2px",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4ABDAC",
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "14px 12px",
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "rgba(48, 64, 58, 0.6)" }}>
                      When you want to retire
                    </Typography>
                  </Box>

                  {/* Balance Input */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#30403A" }}>
                      Current 401(k) Balance
                    </Typography>
                    <TextField
                      inputMode="numeric"
                      value={balance}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || value === '-') {
                          setBalance(0);
                        } else {
                          const num = Number(value);
                          if (!isNaN(num)) {
                            setBalance(num);
                          }
                        }
                      }}
                      onBlur={(e) => {
                        let value = Number(e.target.value) || 0;
                        value = Math.max(0, value);
                        setBalance(value);
                      }}
                      fullWidth
                      variant="outlined"
                      placeholder="e.g., 100000"
                      inputProps={{ min: 0, step: 1000 }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #E0E0E0",
                          transition: "all 0.2s ease",
                          "&:hover fieldset": {
                            borderColor: "#4ABDAC",
                            borderWidth: "2px",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4ABDAC",
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "14px 12px",
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "rgba(48, 64, 58, 0.6)" }}>
                      This is your starting amount. We'll add your contributions and growth from here.
                    </Typography>
                  </Box>

                  {/* Strategy Selection */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "#30403A" }}>
                      Investment Strategy
                    </Typography>
                    <ToggleButtonGroup
                      value={strategy}
                      exclusive
                      onChange={(_, newStrategy) => {
                        if (newStrategy) setStrategy(newStrategy as StrategyType);
                      }}
                      fullWidth
                      sx={{
                        display: "flex",
                        gap: { xs: 1, md: 1.5 },
                        flexWrap: "wrap",
                        "& .MuiToggleButton-root": {
                          flex: "1 1 calc(33.333% - 10px)",
                          minWidth: "100px",
                          border: "2px solid rgba(0,0,0,0.1)",
                          borderRadius: 2,
                          py: 1.5,
                          transition: "all 0.2s",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          textTransform: "none",
                          "&.Mui-selected": {
                            backgroundColor: "transparent",
                            borderColor: strategyConfig.color,
                            color: strategyConfig.color,
                          },
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.02)",
                          },
                        },
                      }}
                    >
                      <ToggleButton value="LOW_RISK">
                        Conservative
                      </ToggleButton>
                      <ToggleButton value="MID_RISK">
                        Balanced
                      </ToggleButton>
                      <ToggleButton value="HIGH_RISK">
                        Aggressive
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <Box sx={{ mt: 1.5, p: 1.5, backgroundColor: "rgba(0,0,0,0.02)", borderRadius: 2 }}>
                      <Typography variant="caption" sx={{ display: "block", color: "rgba(48, 64, 58, 0.7)", fontWeight: 500 }}>
                        {strategyConfig.description}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Grid>

              {/* Right Column - Results Card */}
              {result && (
                <Grid item xs={12} md={6}>
                  <motion.div
                    key={`${age}-${balance}-${strategy}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ height: "100%" }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        backgroundColor: "#fff",
                        border: `2px solid ${strategyConfig.color}33`,
                        borderRadius: 3,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Gradient accent bar */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: `linear-gradient(90deg, ${strategyConfig.color}, ${strategyConfig.color}80)`,
                        }}
                      />

                      <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2.5}>
                          {/* Heading with Years to Retirement */}
                          <Box>
                            <Typography
                              variant="overline"
                              sx={{
                                color: strategyConfig.color,
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                letterSpacing: "0.1em",
                              }}
                            >
                              {strategyConfig.label.toUpperCase()} STRATEGY
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#30403A", mt: 0.5 }}>
                              {result.yearsToRetirement > 0
                                ? `Retirement in ${result.yearsToRetirement} years`
                                : "Already retired!"}
                            </Typography>
                          </Box>

                          <Box sx={{ height: "1px", backgroundColor: "rgba(0,0,0,0.08)" }} />

                          {/* Portfolio at Retirement */}
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(48, 64, 58, 0.6)",
                                display: "block",
                                mb: 0.5,
                                fontWeight: 600,
                              }}
                            >
                              Portfolio at Age {result.retirementAge}
                            </Typography>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                color: strategyConfig.color,
                                fontSize: "1.75rem",
                              }}
                            >
                              {formatCurrency(result.portfolioAtRetirement)}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(48, 64, 58, 0.5)",
                                display: "block",
                                mt: 0.5,
                              }}
                            >
                              {result.balance === result.portfolioAtRetirement
                                ? "Starting amount"
                                : `+${formatCurrency(result.portfolioAtRetirement - result.balance)} from growth & contributions`}
                            </Typography>
                          </Box>

                          {/* Monthly Income */}
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(48, 64, 58, 0.6)",
                                display: "block",
                                mb: 0.5,
                                fontWeight: 600,
                              }}
                            >
                              Monthly Income (4% Rule)
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: "#30403A",
                                fontSize: "1.25rem",
                              }}
                            >
                              {formatCurrency(result.monthlyIncome)}
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{
                                  color: "rgba(48, 64, 58, 0.5)",
                                  ml: 0.5,
                                  fontWeight: 400,
                                }}
                              >
                                /month
                              </Typography>
                            </Typography>
                          </Box>

                          {/* Retirement Duration */}
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(48, 64, 58, 0.6)",
                                display: "block",
                                mb: 0.5,
                                fontWeight: 600,
                              }}
                            >
                              Retirement Duration
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: "#30403A" }}>
                              Until Age {result.retirementAge + result.retirementDuration}
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{
                                  color: "rgba(48, 64, 58, 0.5)",
                                  ml: 0.5,
                                  fontWeight: 400,
                                }}
                              >
                                ({result.retirementDuration} years)
                              </Typography>
                            </Typography>
                          </Box>

                          <Box sx={{ height: "1px", backgroundColor: "rgba(0,0,0,0.08)" }} />

                          {/* Confidence Level */}
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "rgba(48, 64, 58, 0.6)",
                                  fontWeight: 600,
                                }}
                              >
                                Retirement Readiness
                              </Typography>
                              <Chip
                                label={`${result.confidenceLevel} (${result.confidencePercentage}%)`}
                                size="small"
                                sx={{
                                  backgroundColor:
                                    result.confidenceLevel === "Comfortable"
                                      ? "#4CAF5022"
                                      : result.confidenceLevel === "Borderline"
                                      ? "#FF980022"
                                      : "#F4433622",
                                  color:
                                    result.confidenceLevel === "Comfortable"
                                      ? "#4CAF50"
                                      : result.confidenceLevel === "Borderline"
                                      ? "#FF9800"
                                      : "#F44336",
                                  fontWeight: 600,
                                  border: "none",
                                }}
                              />
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={result.confidencePercentage}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "rgba(0,0,0,0.06)",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: getConfidenceColor(result.confidencePercentage),
                                  borderRadius: 4,
                                },
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                mt: 0.75,
                                color: "rgba(48, 64, 58, 0.6)",
                                fontStyle: "italic",
                              }}
                            >
                              {result.confidenceLevel === "Comfortable"
                                ? "On track for comfortable retirement"
                                : result.confidenceLevel === "Borderline"
                                ? "May need to adjust contributions or timeline"
                                : "Review your strategy and goals"}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              )}
            </Grid>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                onClick={handleNavigateToCalculator}
                variant="contained"
                size="large"
                startIcon={<TrendingUpIcon />}
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: "1.05rem",
                  borderRadius: 99,
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: strategyConfig.color,
                  boxShadow: `0 4px 12px ${strategyConfig.color}33`,
                  transition: "all 0.3s",
                  "&:hover": {
                    opacity: 0.95,
                    boxShadow: `0 8px 20px ${strategyConfig.color}44`,
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                }}
              >
                Get Detailed Analysis →
              </Button>
            </motion.div>

            {/* Info Footer */}
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(48, 64, 58, 0.6)",
                  display: "block",
                  lineHeight: 1.6,
                }}
              >
                📊 These are estimates based on historical market averages.
                <br />
                Actual results will vary based on market conditions and personal circumstances.
              </Typography>
            </Box>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
