"use client";

import React, { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";
import { useProjectionStore } from "@projection/core";
import { Box, Button, Grid, Slider, TextField, Typography, CircularProgress, Alert, Tabs, Tab, Switch, Card, CardContent } from "@mui/material";
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
    <Box sx={{ maxWidth: 700, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        401(k) Projection Calculator
      </Typography>
  <Tabs value={tab} onChange={(_event: SyntheticEvent, value: number) => setTab(value)} sx={{ mb: 2 }}>
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
            />
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography gutterBottom>Annual Return</Typography>
              <Box sx={{
                background: '#e3f2fd',
                color: '#1976d2',
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                fontWeight: 600,
                fontSize: 16,
                minWidth: 56,
                textAlign: 'center',
              }}>{rate.toFixed(2)}%</Box>
            </Box>
            <Slider
              value={rate}
              onChange={handleSliderChange(setRate)}
              min={0}
              max={15}
              step={0.1}
              valueLabelDisplay="off"
            />
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography gutterBottom>Inflation Rate</Typography>
              <Box sx={{
                background: '#fff3e0',
                color: '#ef6c00',
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                fontWeight: 600,
                fontSize: 16,
                minWidth: 56,
                textAlign: 'center',
              }}>{inflation.toFixed(2)}%</Box>
            </Box>
            <Slider
              value={inflation}
              onChange={handleSliderChange(setInflation)}
              min={0}
              max={10}
              step={0.1}
              valueLabelDisplay="off"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
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
            <Box sx={{ mb: 2 }}>
              <ReactECharts option={chartOptions} style={{ height: 300 }} />
            </Box>
          )}
          {result && !loading && (
            <Box>
              <Typography variant="h6">Final Balances</Typography>
              <Typography>
                Nominal: $
                {result.nominalBalances.at(-1)?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? "0"}
              </Typography>
              <Typography>
                Real: $
                {result.realBalances.at(-1)?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? "0"}
              </Typography>
            </Box>
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
                <Button type="submit" variant="contained" fullWidth>
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
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Card variant="outlined" sx={{ minWidth: 180 }}>
                  <CardContent>
                    <Typography variant="subtitle2">Success Probability</Typography>
                    <Typography variant="h5">{mcQuery.data.success_probability != null ? `${(mcQuery.data.success_probability * 100).toFixed(1)}%` : '—'}</Typography>
                  </CardContent>
                </Card>
                <Card variant="outlined" sx={{ minWidth: 180 }}>
                  <CardContent>
                    <Typography variant="subtitle2">Final Balance (Real $)</Typography>
                    <Typography>Mean: ${mcQuery.data.final_balances_real.mean.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                    <Typography>Std: ${mcQuery.data.final_balances_real.std.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                  </CardContent>
                </Card>
                <Card variant="outlined" sx={{ minWidth: 180 }}>
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
  );
}
