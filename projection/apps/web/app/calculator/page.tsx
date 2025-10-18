"use client";

import React, { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";
import { useProjectionStore } from "@projection/core";
import { Box, Button, Grid, Slider, TextField, Typography, CircularProgress, Alert, Tabs, Tab, Switch, Card, CardContent, Container, Stack, Snackbar, Chip } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import LockIcon from "@mui/icons-material/Lock";
import StarIcon from "@mui/icons-material/Star";
import dynamic from "next/dynamic";
import { useMutation } from "@tanstack/react-query";
import { useMonteCarloQuery, MonteCarloInput } from "@projection/api-client";
import { useUser } from "../../contexts/UserContext";
import { useRouter } from "next/navigation";
import { BottomNav } from "../../components/BottomNav";
import { UpgradeBanner } from "../../components/UpgradeBanner";
import { HelpTooltip } from "../../components/HelpTooltip";
import { InfoCard } from "../../components/InfoCard";
import { DeterministicForm } from "../../components/DeterministicForm";
import { helpContent } from "../../lib/helpContent";
import { SSHealthcareTab } from "../../features/retirement/ss-healthcare";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
}) as React.ComponentType<any>;


export default function CalculatorPage() {
  const {
    input,
    setInput,
    result,
    setResult,
    loading,
    setLoading,
    reset,
  } = useProjectionStore();

  const { user, addScenario, canAddScenario, getTierFeatures } = useUser();
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const tierFeatures = getTierFeatures();

  // Tab state
  const [tab, setTab] = useState(0);

  // Local state for deterministic chart series
  const [series, setSeries] = useState<any[]>([]);

  // Deterministic form state
  const [age, setAge] = useState(input?.age ?? 30);
  const [retireAge, setRetireAge] = useState(input?.retireAge ?? 65);
  const [balance, setBalance] = useState(input?.balance ?? 50000);
  const [contribution, setContribution] = useState(input?.contribution ?? 10000);
  const [rate, setRate] = useState(input?.rate ?? 7);
  const [inflation, setInflation] = useState(input?.inflation ?? 2.5);

  // Monte Carlo form state
  const [mcInput, setMcInput] = useState<MonteCarloInput>({
    current_age: 30,
    retire_age: 65,
    current_balance: 50000,
    annual_contrib: 10000,
    employer_match_rate: 0,
    expected_return: 0.07,
    return_volatility: 0.15,
    inflation: 0.02,
    salary_growth: 0.03,
    n_paths: 10000,
    seed: 42,
    fees_annual: 0.005,
    glidepath: false,
    rebalance_annually: true,
    target_goal: undefined,
  });
  const [mcSubmitted, setMcSubmitted] = useState(false);

  const mcQuery = useMonteCarloQuery(mcSubmitted ? mcInput : null, {
    enabled: mcSubmitted,
    retry: 0,
  });

  // Input field styles for Monte Carlo section
  const inputFieldStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(255,255,255,0.9)",
      borderRadius: 2,
      "& fieldset": { borderColor: "rgba(74, 189, 172, 0.35)" },
      "&:hover fieldset": { borderColor: "rgba(74, 189, 172, 0.6)" },
      "&.Mui-focused fieldset": {
        borderColor: "#69B47A",
        boxShadow: "0 0 0 3px rgba(105, 180, 122, 0.15)",
      },
    },
    "& .MuiInputBase-input": {
      color: "#2F5140",
    },
  } as const;

  const handleNumberChange = (setter: (value: number) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setter(Number(event.target.value));
    };

  const handleSliderChange = (setter: (value: number) => void) =>
    (_event: Event, value: number | number[]) => {
      setter(Array.isArray(value) ? Number(value[0]) : Number(value));
    };

  const handleMonteCarloNumberChange = (
    key: keyof MonteCarloInput,
    transform?: (value: number) => number
  ) => (event: ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(event.target.value);
    setMcInput((prev) => ({
      ...prev,
      [key]: transform ? transform(numericValue) : numericValue,
    }));
  };

  const handleMonteCarloSwitchChange = (key: keyof MonteCarloInput) =>
    (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setMcInput((prev) => ({
        ...prev,
        [key]: checked,
      }));
    };

  const handleSaveScenario = () => {
    if (!canAddScenario()) {
      const tierFeatures = getTierFeatures();
      setSnackbar({
        open: true,
        message: `You've reached the maximum of ${tierFeatures.maxScenarios} scenarios for your tier. Upgrade to save more!`,
      });
      return;
    }

    if (!result) {
      setSnackbar({ open: true, message: "Please calculate a projection first!" });
      return;
    }

    const scenarioName = `Scenario ${new Date().toLocaleDateString()}`;
    const newScenario = {
      id: `scenario-${Date.now()}`,
      name: scenarioName,
      createdAt: new Date().toISOString(),
      assumptions: {
        currentAge: age,
        retireAge: retireAge,
        currentBalance: balance,
        contribution: contribution / 1000, // Store as percentage
        expReturn: rate,
        inflation: inflation,
      },
      results: {
        nominalBalances: result.nominalBalances,
        realBalances: result.realBalances,
      },
    };

    const success = addScenario(newScenario);
    if (success) {
      setSnackbar({ open: true, message: `Saved "${scenarioName}" successfully!` });
    }
  };

  const handleOpenWhatIf = () => {
    if (!result) {
      setSnackbar({ open: true, message: "Please calculate a projection first!" });
      return;
    }
    router.push("/what-if");
  };

  const handleTabChange = (_event: SyntheticEvent, value: number) => {
    setTab(value);
  };

  const mutation = useMutation({
    mutationFn: async (input: any) => {
      setLoading(true);
      const res = await fetch("http://localhost:8000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to fetch projection");
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
      setLoading(false);
      setSeries([
        {
          name: "Nominal Balance",
          type: "line",
          data: data.nominalBalances,
        },
        {
          name: "Real Balance",
          type: "line",
          data: data.realBalances,
        },
      ]);
    },
    onError: () => {
      setResult(null);
      setLoading(false);
      setSeries([]);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const years = retireAge - age;
    const inputObj = {
      age,
      retireAge,
      balance,
      contribution,
      rate,
      inflation,
    };
    setInput(inputObj);
    mutation.mutate({
      initialBalance: balance,
      annualContribution: contribution,
      years,
      annualReturn: rate / 100,
      inflation: inflation / 100,
    });
  };

  const chartOptions = {
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: number) =>
        value != null ? `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "",
    },
    legend: { data: ["Nominal Balance", "Real Balance"] },
    xAxis: {
      type: "category",
      data: Array.from({ length: retireAge - age + 1 }, (_, i) => age + i),
      name: "Age",
    },
    yAxis: {
      type: "value",
      name: "Balance ($)",
      axisLabel: {
        formatter: (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      },
    },
    series,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(105, 180, 122, 0.18), transparent 55%), radial-gradient(circle at 80% 0%, rgba(74, 189, 172, 0.15), transparent 50%)",
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}>
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 3,
              color: "rgba(74, 189, 172, 0.9)",
              fontWeight: 600,
            }}
          >
            Nestly Planner
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.75rem" },
              color: "#30403A",
            }}
          >
            401(k) Projection Calculator
          </Typography>
          <Typography
            sx={{
              mt: 1.5,
              color: "rgba(48, 64, 58, 0.75)",
              maxWidth: "60ch",
              mx: "auto",
            }}
          >
            Explore deterministic or Monte Carlo projections to understand how your retirement savings may grow and the probability of reaching your goals.
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "rgba(255,255,255,0.92)",
            borderRadius: 4,
            boxShadow: "0 30px 80px rgba(48, 64, 58, 0.12)",
            border: "1px solid rgba(74, 189, 172, 0.15)",
            backdropFilter: "blur(16px)",
            p: { xs: 2.5, md: 4 },
          }}
        >
          <Tabs
            value={tab}
            onChange={handleTabChange}
            sx={{
              mb: 2.5,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                color: "rgba(48, 64, 58, 0.7)",
              },
              "& .Mui-selected": {
                color: "#30403A !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#69B47A",
                height: 3,
                borderRadius: 99,
              },
            }}
          >
            <Tab label="Deterministic" />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Monte Carlo</span>
                  {!tierFeatures.hasMonteCarlo && (
                    <Chip
                      icon={<StarIcon sx={{ fontSize: 14 }} />}
                      label="PREMIUM"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        backgroundColor: '#FFD54F',
                        color: '#1A1A1A',
                        '& .MuiChip-icon': { color: '#1A1A1A' },
                      }}
                    />
                  )}
                </Box>
              }
            />
            <Tab label="SS & Healthcare" />
          </Tabs>
          {tab === 0 && (
            <>
              <InfoCard
                title="Understanding the Calculator"
                description="Enter your current financial situation and goals. The calculator will show how your 401(k) balance grows over time through contributions and investment returns. All projections are estimates based on your inputs."
                defaultExpanded={false}
                variant="tip"
              />
              <DeterministicForm
                age={age}
                setAge={setAge}
                retireAge={retireAge}
                setRetireAge={setRetireAge}
                balance={balance}
                setBalance={setBalance}
                contribution={contribution}
                setContribution={setContribution}
                rate={rate}
                setRate={setRate}
                inflation={inflation}
                setInflation={setInflation}
                onSubmit={handleSubmit}
                loading={loading}
                error={mutation.isError ? "Error fetching projection. Please try again." : undefined}
                onSaveScenario={handleSaveScenario}
                onOpenWhatIf={() => router.push("/what-if")}
              />
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress />
                </Box>
              )}
              {mutation.isError && (
                <Alert severity="error" sx={{ my: 2 }}>Error fetching projection. Please try again.</Alert>
              )}
              {series.length > 0 && !loading && (
                <Box sx={{ mb: 3 }}>
                  <ReactECharts option={chartOptions} style={{ height: 300 }} />
                </Box>
              )}
              {result && !loading && (
                <>
                  <InfoCard
                    title="Understanding Your Results"
                    description="Nominal = Future dollar amount (not adjusted for inflation). Real = Today's buying power (adjusted for inflation). Focus on 'Real' to understand what you can actually purchase in retirement."
                    variant="default"
                    defaultExpanded={false}
                  />
                  <Card
                    variant="outlined"
                    sx={{
                      mt: 2,
                      backgroundColor: "rgba(255,255,255,0.9)",
                      borderColor: "rgba(74, 189, 172, 0.25)",
                      borderRadius: 3,
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: "#2F5140" }}>
                          Final Balances at Retirement
                        </Typography>
                        <HelpTooltip
                          title={helpContent.results.finalBalance.title}
                          description={helpContent.results.finalBalance.description}
                        />
                      </Box>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2.5}
                        sx={{ mt: 1.5 }}
                      >
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <Typography variant="body2" sx={{ color: "rgba(48, 64, 58, 0.72)", fontWeight: 600 }}>
                              Nominal (Future $)
                            </Typography>
                            <HelpTooltip
                              title={helpContent.general.nominalDollars.title}
                              description={helpContent.general.nominalDollars.description}
                              size="small"
                            />
                          </Box>
                          <Typography variant="h6" sx={{ color: "#30403A" }}>
                            $
                            {result.nominalBalances
                              .at(-1)
                              ?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? "0"}
                          </Typography>
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <Typography variant="body2" sx={{ color: "rgba(48, 64, 58, 0.72)", fontWeight: 600 }}>
                              Real (Today's $)
                            </Typography>
                            <HelpTooltip
                              title={helpContent.general.realDollars.title}
                              description={helpContent.general.realDollars.description}
                              size="small"
                            />
                          </Box>
                          <Typography variant="h6" sx={{ color: "#30403A" }}>
                            $
                            {result.realBalances
                              .at(-1)
                              ?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? "0"}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </>
              )}
              {result && !loading && (
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveScenario}
                    sx={{
                      backgroundColor: "#69B47A",
                      "&:hover": { backgroundColor: "#5AA468" },
                    }}
                  >
                    Save as Baseline
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CompareArrowsIcon />}
                    onClick={handleOpenWhatIf}
                    sx={{
                      borderColor: "#4ABDAC",
                      color: "#4ABDAC",
                      "&:hover": {
                        borderColor: "#3AA89C",
                        backgroundColor: "rgba(74, 189, 172, 0.1)",
                      },
                    }}
                  >
                    Open What-If Simulator
                  </Button>
                </Stack>
              )}
            </>
          )}
          {tab === 1 && (
            <Box>
              {!tierFeatures.hasMonteCarlo && (
                <UpgradeBanner
                  title="Upgrade to Run Monte Carlo Simulations"
                  description="Premium members can run probabilistic projections with 1,000+ scenarios to understand the full range of retirement outcomes."
                  compact
                />
              )}
              {tierFeatures.hasMonteCarlo && (
                <InfoCard
                  title="Understanding Monte Carlo Simulations"
                  description="Monte Carlo runs 1,000+ scenarios with varying investment returns. Instead of one outcome, you see a range of possibilities. This helps you prepare for uncertainty and understand the risk in your retirement plan. Focus on the median (p50) as your likely outcome, and use p5/p95 to understand best/worst cases."
                  variant="tip"
                  defaultExpanded={false}
                />
              )}
              <Box
                component="form"
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  if (!tierFeatures.hasMonteCarlo) {
                    setSnackbar({
                      open: true,
                      message: "Monte Carlo simulations are a Premium feature. Upgrade to unlock!",
                    });
                    return;
                  }
                  setMcSubmitted(true);
                }}
                sx={{ mb: 3, mt: !tierFeatures.hasMonteCarlo ? 2 : 0 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Current Age
                      </Typography>
                      <HelpTooltip
                        title={helpContent.calculator.currentAge.title}
                        description={helpContent.calculator.currentAge.description}
                      />
                    </Box>
                    <TextField
                      type="number"
                      value={mcInput.current_age}
                      onChange={handleMonteCarloNumberChange("current_age")}
                      fullWidth
                      disabled={!tierFeatures.hasMonteCarlo}
                      inputProps={{ min: 18, max: 70 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Retirement Age
                      </Typography>
                      <HelpTooltip
                        title={helpContent.calculator.retirementAge.title}
                        description={helpContent.calculator.retirementAge.description}
                      />
                    </Box>
                    <TextField
                      type="number"
                      value={mcInput.retire_age}
                      onChange={handleMonteCarloNumberChange("retire_age")}
                      fullWidth
                      disabled={!tierFeatures.hasMonteCarlo}
                      inputProps={{ min: Number(mcInput.current_age) + 1, max: 80 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Current Balance ($)
                      </Typography>
                      <HelpTooltip
                        title={helpContent.calculator.currentBalance.title}
                        description={helpContent.calculator.currentBalance.description}
                      />
                    </Box>
                    <TextField
                      type="number"
                      value={mcInput.current_balance}
                      onChange={handleMonteCarloNumberChange("current_balance")}
                      fullWidth
                      disabled={!tierFeatures.hasMonteCarlo}
                      inputProps={{ min: 0 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Annual Contribution ($)
                      </Typography>
                      <HelpTooltip
                        title={helpContent.calculator.annualContribution.title}
                        description={helpContent.calculator.annualContribution.description}
                      />
                    </Box>
                    <TextField
                      type="number"
                      value={mcInput.annual_contrib}
                      onChange={handleMonteCarloNumberChange("annual_contrib")}
                      fullWidth
                      disabled={!tierFeatures.hasMonteCarlo}
                      inputProps={{ min: 0 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Expected Return (%)
                      </Typography>
                      <HelpTooltip
                        title={helpContent.calculator.expectedReturn.title}
                        description={helpContent.calculator.expectedReturn.description}
                      />
                    </Box>
                    <TextField
                      type="number"
                      value={mcInput.expected_return != null ? mcInput.expected_return * 100 : ""}
                      onChange={handleMonteCarloNumberChange("expected_return", (value) => value / 100)}
                      fullWidth
                      disabled={!tierFeatures.hasMonteCarlo}
                      inputProps={{ min: -90, max: 20, step: 0.01 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Return Volatility (%)
                      </Typography>
                      <HelpTooltip
                        title={helpContent.monteCarloInputs.returnVolatility.title}
                        description={helpContent.monteCarloInputs.returnVolatility.description}
                      />
                    </Box>
                    <TextField
                      type="number"
                      value={mcInput.return_volatility != null ? mcInput.return_volatility * 100 : ""}
                      onChange={handleMonteCarloNumberChange("return_volatility", (value) => value / 100)}
                      fullWidth
                      disabled={!tierFeatures.hasMonteCarlo}
                      inputProps={{ min: 0, max: 100, step: 0.01 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Inflation (%)
                      </Typography>
                      <HelpTooltip
                        title={helpContent.calculator.inflation.title}
                        description={helpContent.calculator.inflation.description}
                      />
                    </Box>
                    <TextField
                      type="number"
                      value={mcInput.inflation != null ? mcInput.inflation * 100 : ""}
                      onChange={handleMonteCarloNumberChange("inflation", (value) => value / 100)}
                      fullWidth
                      disabled={!tierFeatures.hasMonteCarlo}
                      inputProps={{ min: 0, max: 20, step: 0.01 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Salary Growth (%)
                      </Typography>
                      <HelpTooltip
                        title={helpContent.calculator.salaryGrowth.title}
                        description={helpContent.calculator.salaryGrowth.description}
                      />
                    </Box>
                    <TextField
                      type="number"
                      value={mcInput.salary_growth != null ? mcInput.salary_growth * 100 : ""}
                      onChange={handleMonteCarloNumberChange("salary_growth", (value) => value / 100)}
                      fullWidth
                      disabled={!tierFeatures.hasMonteCarlo}
                      inputProps={{ min: 0, max: 20, step: 0.01 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Annual Fee (%)
                      </Typography>
                      <HelpTooltip
                        title={helpContent.monteCarloInputs.annualFee.title}
                        description={helpContent.monteCarloInputs.annualFee.description}
                      />
                    </Box>
                    <TextField
                      type="number"
                      value={mcInput.fees_annual != null ? mcInput.fees_annual * 100 : ""}
                      onChange={handleMonteCarloNumberChange("fees_annual", (value) => value / 100)}
                      fullWidth
                      disabled={!tierFeatures.hasMonteCarlo}
                      inputProps={{ min: 0, max: 5, step: 0.01 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        # Paths
                      </Typography>
                      <HelpTooltip
                        title={helpContent.monteCarloInputs.numPaths.title}
                        description={helpContent.monteCarloInputs.numPaths.description}
                      />
                    </Box>
                    <TextField
                      type="number"
                      value={mcInput.n_paths}
                      onChange={handleMonteCarloNumberChange("n_paths")}
                      fullWidth
                      disabled={!tierFeatures.hasMonteCarlo}
                      inputProps={{ min: 100, max: 200000 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12} display="flex" alignItems="center">
                    <Switch
                      checked={!!mcInput.glidepath}
                      onChange={handleMonteCarloSwitchChange("glidepath")}
                      disabled={!tierFeatures.hasMonteCarlo}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2">
                        Glidepath (reduce risk as you age)
                      </Typography>
                      <HelpTooltip
                        title={helpContent.monteCarloInputs.glidepath.title}
                        description={helpContent.monteCarloInputs.glidepath.description}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={!tierFeatures.hasMonteCarlo}
                      startIcon={!tierFeatures.hasMonteCarlo ? <LockIcon /> : undefined}
                      sx={{
                        backgroundColor: tierFeatures.hasMonteCarlo ? "#69B47A" : "rgba(105, 180, 122, 0.3)",
                        fontWeight: 600,
                        py: 1,
                        borderRadius: 2,
                        "&:hover": { backgroundColor: tierFeatures.hasMonteCarlo ? "#5AA468" : "rgba(105, 180, 122, 0.3)" },
                        color: tierFeatures.hasMonteCarlo ? "#fff" : "rgba(48, 64, 58, 0.5)",
                      }}
                    >
                      {tierFeatures.hasMonteCarlo ? "Run Monte Carlo" : "Upgrade to Run Simulation"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Show demo results for non-premium users */}
              {!tierFeatures.hasMonteCarlo && (
                <Box sx={{ position: 'relative' }}>
                  {/* Overlay to prevent interaction */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 10,
                      cursor: 'not-allowed',
                    }}
                  />
                  
                  <Box sx={{ opacity: 0.6, pointerEvents: 'none' }}>
                    <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>Monte Carlo Percentile Fan Chart (Sample)</Typography>
                    <ReactECharts
                      option={{
                        tooltip: { trigger: 'axis' },
                        legend: { data: ['p5', 'p25', 'p50', 'p75', 'p95'] },
                        xAxis: {
                          type: 'category',
                          data: Array.from({ length: 36 }, (_, i) => 30 + i),
                          name: 'Age',
                        },
                        yAxis: {
                          type: 'value',
                          name: 'Balance ($)',
                          axisLabel: { formatter: (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                        },
                        series: [
                          { 
                            name: 'p5', 
                            type: 'line', 
                            data: Array.from({ length: 36 }, (_, i) => 50000 * Math.pow(1.03, i) * (0.6 + Math.random() * 0.1)),
                            lineStyle: { type: 'dashed', color: '#bdbdbd' } 
                          },
                          { 
                            name: 'p25', 
                            type: 'line', 
                            data: Array.from({ length: 36 }, (_, i) => 50000 * Math.pow(1.05, i) * (0.8 + Math.random() * 0.1)),
                            areaStyle: { color: 'rgba(33,150,243,0.1)' }, 
                            lineStyle: { color: '#90caf9' } 
                          },
                          { 
                            name: 'p50', 
                            type: 'line', 
                            data: Array.from({ length: 36 }, (_, i) => 50000 * Math.pow(1.07, i)),
                            lineStyle: { color: '#1976d2', width: 2 } 
                          },
                          { 
                            name: 'p75', 
                            type: 'line', 
                            data: Array.from({ length: 36 }, (_, i) => 50000 * Math.pow(1.09, i) * (1.0 + Math.random() * 0.1)),
                            areaStyle: { color: 'rgba(33,150,243,0.1)' }, 
                            lineStyle: { color: '#90caf9' } 
                          },
                          { 
                            name: 'p95', 
                            type: 'line', 
                            data: Array.from({ length: 36 }, (_, i) => 50000 * Math.pow(1.11, i) * (1.2 + Math.random() * 0.1)),
                            lineStyle: { type: 'dashed', color: '#bdbdbd' } 
                          },
                        ],
                      }}
                      style={{ height: 320 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: "wrap" }}>
                      <Card variant="outlined" sx={{ minWidth: 180, flex: "1 1 180px", borderColor: "rgba(74, 189, 172, 0.25)" }}>
                        <CardContent>
                          <Typography variant="subtitle2">Success Probability</Typography>
                          <Typography variant="h5">87.3%</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Sample data</Typography>
                        </CardContent>
                      </Card>
                      <Card variant="outlined" sx={{ minWidth: 180, flex: "1 1 180px", borderColor: "rgba(74, 189, 172, 0.25)" }}>
                        <CardContent>
                          <Typography variant="subtitle2">Final Balance (Real $)</Typography>
                          <Typography>Mean: $482,750</Typography>
                          <Typography>Std: $95,200</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Sample data</Typography>
                        </CardContent>
                      </Card>
                      <Card variant="outlined" sx={{ minWidth: 180, flex: "1 1 180px", borderColor: "rgba(74, 189, 172, 0.25)" }}>
                        <CardContent>
                          <Typography variant="subtitle2">Final Balance (Nominal $)</Typography>
                          <Typography>Mean: $867,425</Typography>
                          <Typography>Std: $178,340</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Sample data</Typography>
                        </CardContent>
                      </Card>
                    </Box>
                    
                    {/* Watermark overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                      }}
                    >
                      <Box
                        sx={{
                          background: 'linear-gradient(135deg, rgba(255,213,79,0.95) 0%, rgba(255,167,38,0.95) 100%)',
                          px: 4,
                          py: 2,
                          borderRadius: 3,
                          boxShadow: '0 8px 32px rgba(255,165,38,0.4)',
                          border: '2px solid #FFD54F',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                          <StarIcon sx={{ fontSize: 28, color: '#1A1A1A' }} />
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: '#1A1A1A',
                            }}
                          >
                            SAMPLE PREVIEW
                          </Typography>
                          <StarIcon sx={{ fontSize: 28, color: '#1A1A1A' }} />
                        </Box>
                        <Typography
                          sx={{
                            fontSize: '0.85rem',
                            color: '#1A1A1A',
                            opacity: 0.9,
                            textAlign: 'center',
                          }}
                        >
                          Upgrade to Premium to run your own simulations
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              
              {mcSubmitted && mcQuery.isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress /></Box>
              )}
              {mcSubmitted && mcQuery.isError && (
                <Alert severity="error" sx={{ my: 2 }}>Error fetching Monte Carlo simulation. Please check your inputs.</Alert>
              )}
              {mcSubmitted && mcQuery.data && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>Monte Carlo Percentile Fan Chart</Typography>
                  {(() => {
                    // Validate percentile time-series before passing to ECharts
                    const pct = mcQuery.data?.percentiles as Record<string, any> | undefined;
                    const xLen = Array.from({ length: (mcInput.retire_age ?? 65) - (mcInput.current_age ?? 30) + 1 }, (_, i) => (mcInput.current_age ?? 30) + i).length;
                    const requiredKeys = ['p5', 'p25', 'p50', 'p75', 'p95'];
                    const invalid = !pct || requiredKeys.some(k => !Array.isArray(pct[k]) || pct[k].length !== xLen || pct[k].some((v: any) => typeof v !== 'number' || Number.isNaN(v)));
                    if (invalid) {
                      return (
                        <Alert severity="error" sx={{ my: 2 }}>
                          Received invalid percentile series from backend. Chart cannot be rendered.
                        </Alert>
                      );
                    }
                    return (
                      <ReactECharts
                        option={{
                          tooltip: { trigger: 'axis' },
                          legend: { data: requiredKeys },
                          xAxis: {
                            type: 'category',
                            data: Array.from({ length: xLen }, (_, i) => (mcInput.current_age ?? 30) + i),
                            name: 'Age',
                          },
                          yAxis: {
                            type: 'value',
                            name: 'Balance ($)',
                            axisLabel: { formatter: (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                          },
                          series: [
                            { name: 'p5', type: 'line', data: pct!.p5, lineStyle: { type: 'dashed', color: '#bdbdbd' } },
                            { name: 'p25', type: 'line', data: pct!.p25, areaStyle: { color: 'rgba(33,150,243,0.1)' }, lineStyle: { color: '#90caf9' } },
                            { name: 'p50', type: 'line', data: pct!.p50, lineStyle: { color: '#1976d2', width: 2 } },
                            { name: 'p75', type: 'line', data: pct!.p75, areaStyle: { color: 'rgba(33,150,243,0.1)' }, lineStyle: { color: '#90caf9' } },
                            { name: 'p95', type: 'line', data: pct!.p95, lineStyle: { type: 'dashed', color: '#bdbdbd' } },
                          ],
                        }}
                        style={{ height: 320 }}
                      />
                    );
                  })()}
                  
                  <InfoCard
                    title="How to Read These Results"
                    description="Success Probability = % chance you'll reach your goal. p50 (median) = most likely outcome. p25-p75 range = where 50% of scenarios land. p5-p95 = the full 90% range. Mean shows average, Std Dev shows how much outcomes vary."
                    variant="default"
                    defaultExpanded={false}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: "wrap" }}>
                    <Card variant="outlined" sx={{ minWidth: 180, flex: "1 1 180px", borderColor: "rgba(74, 189, 172, 0.25)" }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <Typography variant="subtitle2">Success Probability</Typography>
                          <HelpTooltip
                            title={helpContent.monteCarloResults.successProbability.title}
                            description={helpContent.monteCarloResults.successProbability.description}
                            size="small"
                          />
                        </Box>
                        <Typography variant="h5">{mcQuery.data.success_probability != null ? `${(mcQuery.data.success_probability * 100).toFixed(1)}%` : '—'}</Typography>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ minWidth: 180, flex: "1 1 180px", borderColor: "rgba(74, 189, 172, 0.25)" }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <Typography variant="subtitle2">Final Balance (Real $)</Typography>
                          <HelpTooltip
                            title="Real Dollars (Inflation-Adjusted)"
                            description={helpContent.general.realDollars.description}
                            size="small"
                          />
                        </Box>
                        <Typography>Mean: ${mcQuery.data.final_balances_real.mean.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                        <Typography>Std: ${mcQuery.data.final_balances_real.std.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ minWidth: 180, flex: "1 1 180px", borderColor: "rgba(74, 189, 172, 0.25)" }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <Typography variant="subtitle2">Final Balance (Nominal $)</Typography>
                          <HelpTooltip
                            title="Nominal Dollars (Future Value)"
                            description={helpContent.general.nominalDollars.description}
                            size="small"
                          />
                        </Box>
                        <Typography>Mean: ${mcQuery.data.final_balances_nominal.mean.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                        <Typography>Std: ${mcQuery.data.final_balances_nominal.std.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Tab 2: SS & Healthcare */}
          {tab === 2 && (
            <SSHealthcareTab />
          )}
        </Box>
      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
      
      <BottomNav />
    </Box>
  );
}
