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
  DEFAULT_VALUES,
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

type QuickStartReadinessMessages = Partial<Record<'Comfortable' | 'Borderline' | 'Low', string>>;

export type QuickStartReadinessLevel = 'Comfortable' | 'Borderline' | 'Low';

export interface QuickStartCopy {
  label?: string;
  helper?: string;
  placeholder?: string;
}

export interface QuickStartInputMetadata {
  age?: QuickStartCopy;
  retirementAge?: QuickStartCopy;
  balance?: QuickStartCopy;
}

export interface QuickStartStrategyMetadata {
  heading?: string;
  presetsLabel?: string;
  optionReturns?: Partial<Record<StrategyType, string>>;
}

export interface QuickStartResultsMetadata {
  strategySuffix?: string;
  retirementHeadline?: string;
  retirementHeadlineRetired?: string;
  portfolioLabel?: string;
  portfolioGrowth?: string;
  portfolioBaseline?: string;
  monthlyIncomeLabel?: string;
  monthlyIncomeSuffix?: string;
  retirementDurationLabel?: string;
  retirementDurationSuffix?: string;
  retirementReadyLabel?: string;
}

interface QuickStartSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  onNavigateToCalculator?: () => void;
  ctaLabel?: string;
  footnote?: string;
  badgeLabel?: string;
  badgeDescription?: string;
  readinessMessages?: QuickStartReadinessMessages;
  inputLabels?: QuickStartInputMetadata;
  strategyMetadata?: QuickStartStrategyMetadata;
  resultsMetadata?: QuickStartResultsMetadata;
}

/**
 * QuickStartSection Component
 * 
 * Allows users to enter age, balance, and strategy to see instant retirement projections.
 * Shows portfolio at retirement, monthly income, retirement duration, and confidence level.
 * Users can then navigate to the calculator with all values pre-populated.
 */
export function QuickStartSection({
  title = "⚡ Quick Start",
  subtitle = "See Your Results in 8 Seconds",
  description = "Enter your age, current balance, and investment strategy to see your retirement projection instantly",
  onNavigateToCalculator,
  ctaLabel,
  footnote,
  badgeLabel,
  badgeDescription,
  readinessMessages,
  inputLabels,
  strategyMetadata,
  resultsMetadata,
}: QuickStartSectionProps) {
  const router = useRouter();
  const renderTemplate = (
    template: string | undefined,
    context: Record<string, string | number | undefined>
  ): string | undefined => {
    if (!template) return undefined;
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key) => {
      const value = context[key];
      return value !== undefined && value !== null ? String(value) : "";
    });
  };
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
  const ageNum = Number(age);
  const retirementAgeNum = Number(retirementAge);
  const yearsToRetirement = Math.max(0, retirementAgeNum - ageNum);

  const ageMeta = inputLabels?.age ?? {};
  const retirementMeta = inputLabels?.retirementAge ?? {};
  const balanceMeta = inputLabels?.balance ?? {};

  const ageHelper =
    renderTemplate(ageMeta.helper, { yearsToRetirement }) ??
    `You have ${Math.max(0, retirementAgeNum - ageNum)} years until retirement age`;
  const retirementHelper =
    renderTemplate(retirementMeta.helper, { yearsToRetirement }) ?? "When you want to retire";
  const balanceHelper =
    renderTemplate(balanceMeta.helper, { yearsToRetirement }) ??
    "This is your starting amount. We'll add your contributions and growth from here.";

  const strategyHeading = strategyMetadata?.heading ?? "Investment Strategy";
  const optionReturns = strategyMetadata?.optionReturns ?? {};

  const ctaCopy = ctaLabel ?? "Get Detailed Analysis →";
  const footnoteCopy =
    footnote ??
    "📊 These are estimates based on historical market averages.\nActual results will vary based on market conditions and personal circumstances.";
  const footnoteLines = footnoteCopy.split("\n");
  const badgeLabelCopy = badgeLabel;
  const badgeDescriptionCopy = badgeDescription;

  const handleNavigateToCalculator = () => {
    if (!result) return;

    if (onNavigateToCalculator) {
      onNavigateToCalculator();
    }

    const params = createCalculatorParams(result);
    const queryString = new URLSearchParams(params).toString();

    router.push(`/calculator?${queryString}`);
  };

  const getConfidenceColor = (percentage: number) => {
    if (percentage >= 75) return "#4CAF50";
    if (percentage >= 50) return "#FF9800";
    return "#F44336";
  };

  const growthDifference = result ? result.portfolioAtRetirement - result.balance : 0;
  const resultContext = result
    ? {
        yearsToRetirement: result.yearsToRetirement,
        retirementAge: result.retirementAge,
        retirementDuration: result.retirementDuration,
        retirementEndAge: result.retirementAge + result.retirementDuration,
        strategyLabel: strategyConfig.label,
        growth: growthDifference > 0 ? formatCurrency(growthDifference) : undefined,
      }
    : undefined;

  const strategySuffixText = (resultsMetadata?.strategySuffix ?? " Strategy").trim();
  const defaultRetirementHeadline = result
    ? result.yearsToRetirement > 0
      ? `Retirement in ${result.yearsToRetirement} years`
      : "Already retired!"
    : "";
  const retirementHeadline = result
    ? result.yearsToRetirement > 0
      ? renderTemplate(resultsMetadata?.retirementHeadline, resultContext ?? {}) ?? defaultRetirementHeadline
      : renderTemplate(resultsMetadata?.retirementHeadlineRetired, resultContext ?? {}) ?? defaultRetirementHeadline
    : defaultRetirementHeadline;
  const portfolioLabel =
    renderTemplate(resultsMetadata?.portfolioLabel, resultContext ?? {}) ??
    (result ? `Portfolio at Age ${result.retirementAge}` : "Portfolio at Retirement");
  const portfolioGrowthText =
    result && growthDifference > 0
      ? renderTemplate(resultsMetadata?.portfolioGrowth, {
          ...(resultContext ?? {}),
          growth: formatCurrency(growthDifference),
        }) ?? `+${formatCurrency(growthDifference)} from growth & contributions`
      : resultsMetadata?.portfolioBaseline ?? "Starting amount";
  const monthlyIncomeLabel = resultsMetadata?.monthlyIncomeLabel ?? "Monthly Income (4% Rule)";
  const monthlyIncomeSuffix = resultsMetadata?.monthlyIncomeSuffix ?? "/month";
  const retirementDurationLabel = resultsMetadata?.retirementDurationLabel ?? "Retirement Duration";
  const retirementDurationSuffix =
    renderTemplate(resultsMetadata?.retirementDurationSuffix, resultContext ?? {}) ??
    (result ? `(${result.retirementDuration} years)` : "");
  const retirementReadyLabel = resultsMetadata?.retirementReadyLabel ?? "Retirement Readiness";
  const defaultReadinessCopy: QuickStartReadinessMessages = {
    Comfortable: "On track for comfortable retirement",
    Borderline: "May need to adjust contributions or timeline",
    Low: "Review your strategy and goals",
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgba(105, 180, 122, 0.08)",
        py: { xs: 4.5, md: 6 },
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        mt: { xs: -3, md: -4 },
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={fadeInUp.initial}
          whileInView={fadeInUp.animate}
          transition={{ ...fadeInUp.transition, delay: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Stack spacing={{ xs: 3.5, md: 4.5 }}>
            {/* Header */}
            <Stack spacing={0.75} alignItems="center" textAlign="center">
              <Typography
                variant="overline"
                sx={{
                  color: "#4ABDAC",
                  fontWeight: 700,
                  letterSpacing: "0.3rem",
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#30403A",
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                }}
              >
                {subtitle}
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(48, 64, 58, 0.7)", maxWidth: "60ch" }}>
                {description}
              </Typography>
            </Stack>

            {(badgeLabelCopy || badgeDescriptionCopy) && (
              <Stack spacing={1.2} alignItems="center" textAlign="center">
                {badgeLabelCopy ? (
                  <Chip
                    label={badgeLabelCopy}
                    size="medium"
                    sx={{
                      borderRadius: 999,
                      fontWeight: 600,
                      px: 1.5,
                      backgroundColor: "rgba(74, 189, 172, 0.12)",
                      color: "#2FBAA0",
                      border: "1px solid rgba(74, 189, 172, 0.35)",
                      letterSpacing: "0.05em",
                    }}
                  />
                ) : null}
                {badgeDescriptionCopy ? (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(48, 64, 58, 0.7)",
                      maxWidth: "46ch",
                      fontWeight: 500,
                    }}
                  >
                    {badgeDescriptionCopy}
                  </Typography>
                ) : null}
              </Stack>
            )}

            {/* Input & Results Grid */}
            <Grid container spacing={3}>
              {/* Left Column - Inputs */}
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  {/* Age Input */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#30403A" }}>
                      {ageMeta.label ?? "Current Age"}
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
                      placeholder={ageMeta.placeholder ?? "e.g., 35"}
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
                      {ageHelper}
                    </Typography>
                  </Box>

                  {/* Retirement Age Input */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#30403A" }}>
                      {retirementMeta.label ?? "Target Retirement Age"}
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
                      placeholder={retirementMeta.placeholder ?? "e.g., 65"}
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
                      {retirementHelper}
                    </Typography>
                  </Box>

                  {/* Balance Input */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#30403A" }}>
                      {balanceMeta.label ?? "Current 401(k) Balance"}
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
                      placeholder={balanceMeta.placeholder ?? "e.g., 100000"}
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
                      {balanceHelper}
                    </Typography>
                  </Box>

                  {/* Strategy Selection */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "#30403A" }}>
                      {strategyHeading}
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
                      {(Object.keys(DEFAULT_VALUES) as StrategyType[]).map((option) => {
                        const optionConfig = getStrategyConfig(option);
                        const optionReturn = optionReturns?.[option];
                        const isSelected = strategy === option;
                        return (
                          <ToggleButton key={option} value={option}>
                            <Stack spacing={0.25} alignItems="center">
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: isSelected ? optionConfig.color : "rgba(48,64,58,0.85)",
                                }}
                              >
                                {optionConfig.label}
                              </Typography>
                              {optionReturn ? (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 500,
                                    color: isSelected ? optionConfig.color : "rgba(48,64,58,0.6)",
                                  }}
                                >
                                  {optionReturn}
                                </Typography>
                              ) : null}
                            </Stack>
                          </ToggleButton>
                        );
                      })}
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
                              {strategySuffixText
                                ? `${strategyConfig.label.toUpperCase()} ${strategySuffixText.toUpperCase()}`
                                : strategyConfig.label.toUpperCase()}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#30403A", mt: 0.5 }}>
                              {retirementHeadline}
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
                              {portfolioLabel}
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
                              {portfolioGrowthText}
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
                              {monthlyIncomeLabel}
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
                                {monthlyIncomeSuffix}
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
                              {retirementDurationLabel}
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
                                {retirementDurationSuffix}
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
                                {retirementReadyLabel}
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
                              {readinessMessages?.[result.confidenceLevel] ??
                                defaultReadinessCopy[result.confidenceLevel]}
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
                {ctaCopy}
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
                {footnoteLines.map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < footnoteLines.length - 1 ? <br /> : null}
                  </React.Fragment>
                ))}
              </Typography>
            </Box>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}

export default QuickStartSection;
