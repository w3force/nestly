"use client";

import React, { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";
import { useProjectionStore } from "@projection/core";
import { Box, Button, Grid, Slider, TextField, Typography, CircularProgress, Alert, Tabs, Tab, Switch, Card, CardContent, Container, Stack } from "@mui/material";
import dynamic from "next/dynamic";
import { useMutation } from "@tanstack/react-query";
import { useMonteCarloQuery, MonteCarloInput } from "@projection/api-client";

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

  const sliderStyles = {
    color: "#69B47A",
    "& .MuiSlider-thumb": {
      boxShadow: "0 4px 12px rgba(105, 180, 122, 0.35)",
    },
    "& .MuiSlider-rail": {
      opacity: 0.3,
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
            onChange={(_event: SyntheticEvent, value: number) => setTab(value)}
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
            <Tab label="Monte Carlo" />
          </Tabs>
          {tab === 0 && (
            <>
              <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Current Age"
                      type="number"
                      value={age}
                      onChange={handleNumberChange(setAge)}
                      fullWidth
                      inputProps={{ min: 18, max: 70 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Retirement Age"
                      type="number"
                      value={retireAge}
                      onChange={handleNumberChange(setRetireAge)}
                      fullWidth
                      inputProps={{ min: age + 1, max: 80 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Current Balance ($)"
                      type="number"
                      value={balance}
                      onChange={handleNumberChange(setBalance)}
                      fullWidth
                      inputProps={{ min: 0 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Annual Contribution ($)"
                      type="number"
                      value={contribution}
                      onChange={handleNumberChange(setContribution)}
                      fullWidth
                      inputProps={{ min: 0 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography gutterBottom>Annual Return</Typography>
                      <Box
                        sx={{
                          background: 'rgba(105, 180, 122, 0.18)',
                          color: '#2F5140',
                          borderRadius: 2,
                          border: '1px solid rgba(74, 189, 172, 0.35)',
                          px: 1.5,
                          py: 0.5,
                          fontWeight: 600,
                          fontSize: 16,
                          minWidth: 56,
                          textAlign: 'center',
                        }}
                      >
                        {rate.toFixed(2)}%
                      </Box>
                    </Box>
                    <Slider
                      value={rate}
                      onChange={handleSliderChange(setRate)}
                      min={0}
                      max={15}
                      step={0.1}
                      valueLabelDisplay="off"
                      sx={sliderStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography gutterBottom>Inflation Rate</Typography>
                      <Box
                        sx={{
                          background: 'rgba(74, 189, 172, 0.12)',
                          color: '#2F5140',
                          borderRadius: 2,
                          border: '1px solid rgba(74, 189, 172, 0.3)',
                          px: 1.5,
                          py: 0.5,
                          fontWeight: 600,
                          fontSize: 16,
                          minWidth: 56,
                          textAlign: 'center',
                        }}
                      >
                        {inflation.toFixed(2)}%
                      </Box>
                    </Box>
                    <Slider
                      value={inflation}
                      onChange={handleSliderChange(setInflation)}
                      min={0}
                      max={10}
                      step={0.1}
                      valueLabelDisplay="off"
                      sx={sliderStyles}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#69B47A",
                        fontWeight: 600,
                        py: 1,
                        borderRadius: 2,
                        "&:hover": { backgroundColor: "#5AA468" },
                      }}
                    >
                      Calculate
                    </Button>
                  </Grid>
                </Grid>
              </Box>
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
                <Card
                  variant="outlined"
                  sx={{
                    mt: 1,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderColor: "rgba(74, 189, 172, 0.25)",
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ color: "#2F5140" }}>
                      Final Balances
                    </Typography>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2.5}
                      sx={{ mt: 1.5 }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ color: "rgba(48, 64, 58, 0.72)", fontWeight: 600 }}>
                          Nominal
                        </Typography>
                        <Typography variant="h6" sx={{ color: "#30403A" }}>
                          $
                          {result.nominalBalances
                            .at(-1)
                            ?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? "0"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: "rgba(48, 64, 58, 0.72)", fontWeight: 600 }}>
                          Real
                        </Typography>
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
              )}
            </>
          )}
          {tab === 1 && (
            <Box>
              <Box
                component="form"
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  setMcSubmitted(true);
                }}
                sx={{ mb: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Current Age"
                      type="number"
                      value={mcInput.current_age}
                      onChange={handleMonteCarloNumberChange("current_age")}
                      fullWidth
                      inputProps={{ min: 18, max: 70 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Retirement Age"
                      type="number"
                      value={mcInput.retire_age}
                      onChange={handleMonteCarloNumberChange("retire_age")}
                      fullWidth
                      inputProps={{ min: Number(mcInput.current_age) + 1, max: 80 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Current Balance ($)"
                      type="number"
                      value={mcInput.current_balance}
                      onChange={handleMonteCarloNumberChange("current_balance")}
                      fullWidth
                      inputProps={{ min: 0 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Annual Contribution ($)"
                      type="number"
                      value={mcInput.annual_contrib}
                      onChange={handleMonteCarloNumberChange("annual_contrib")}
                      fullWidth
                      inputProps={{ min: 0 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Expected Return (%)"
                      type="number"
                      value={mcInput.expected_return != null ? mcInput.expected_return * 100 : ""}
                      onChange={handleMonteCarloNumberChange("expected_return", (value) => value / 100)}
                      fullWidth
                      inputProps={{ min: -90, max: 20, step: 0.01 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Return Volatility (%)"
                      type="number"
                      value={mcInput.return_volatility != null ? mcInput.return_volatility * 100 : ""}
                      onChange={handleMonteCarloNumberChange("return_volatility", (value) => value / 100)}
                      fullWidth
                      inputProps={{ min: 0, max: 100, step: 0.01 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Inflation (%)"
                      type="number"
                      value={mcInput.inflation != null ? mcInput.inflation * 100 : ""}
                      onChange={handleMonteCarloNumberChange("inflation", (value) => value / 100)}
                      fullWidth
                      inputProps={{ min: 0, max: 20, step: 0.01 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Salary Growth (%)"
                      type="number"
                      value={mcInput.salary_growth != null ? mcInput.salary_growth * 100 : ""}
                      onChange={handleMonteCarloNumberChange("salary_growth", (value) => value / 100)}
                      fullWidth
                      inputProps={{ min: 0, max: 20, step: 0.01 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Annual Fee (%)"
                      type="number"
                      value={mcInput.fees_annual != null ? mcInput.fees_annual * 100 : ""}
                      onChange={handleMonteCarloNumberChange("fees_annual", (value) => value / 100)}
                      fullWidth
                      inputProps={{ min: 0, max: 5, step: 0.01 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="# Paths"
                      type="number"
                      value={mcInput.n_paths}
                      onChange={handleMonteCarloNumberChange("n_paths")}
                      fullWidth
                      inputProps={{ min: 100, max: 200000 }}
                      sx={inputFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12} display="flex" alignItems="center">
                    <Switch
                      checked={!!mcInput.glidepath}
                      onChange={handleMonteCarloSwitchChange("glidepath")}
                    />
                    Glidepath (reduce risk as you age)
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#69B47A",
                        fontWeight: 600,
                        py: 1,
                        borderRadius: 2,
                        "&:hover": { backgroundColor: "#5AA468" },
                      }}
                    >
                      Run Monte Carlo
                    </Button>
                  </Grid>
                </Grid>
              </Box>
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
                  <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: "wrap" }}>
                    <Card variant="outlined" sx={{ minWidth: 180, flex: "1 1 180px", borderColor: "rgba(74, 189, 172, 0.25)" }}>
                      <CardContent>
                        <Typography variant="subtitle2">Success Probability</Typography>
                        <Typography variant="h5">{mcQuery.data.success_probability != null ? `${(mcQuery.data.success_probability * 100).toFixed(1)}%` : '—'}</Typography>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ minWidth: 180, flex: "1 1 180px", borderColor: "rgba(74, 189, 172, 0.25)" }}>
                      <CardContent>
                        <Typography variant="subtitle2">Final Balance (Real $)</Typography>
                        <Typography>Mean: ${mcQuery.data.final_balances_real.mean.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                        <Typography>Std: ${mcQuery.data.final_balances_real.std.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ minWidth: 180, flex: "1 1 180px", borderColor: "rgba(74, 189, 172, 0.25)" }}>
                      <CardContent>
                        <Typography variant="subtitle2">Final Balance (Nominal $)</Typography>
                        <Typography>Mean: ${mcQuery.data.final_balances_nominal.mean.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                        <Typography>Std: ${mcQuery.data.final_balances_nominal.std.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
