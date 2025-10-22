"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Slider,
  Stack,
  Button,
  Chip,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import dynamic from "next/dynamic";
import {
  COLORS,
  getFieldDefinition,
  getSliderMetadata,
  resolveSliderRangeIndicators,
  resolveSliderState,
  type InputFieldDefinition,
} from "@projection/shared";
import { useUser } from "../../contexts/UserContext";
import { UpgradeBanner } from "../../components/UpgradeBanner";
import { DiffPill } from "../../components/DiffPill";
import { Scenario } from "../../lib/types";
import { InfoCard } from "../../components/InfoCard";
import { HelpTooltip } from "../../components/HelpTooltip";
import { helpContent } from "../../lib/helpContent";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

const normalizeScenario = (scenario: WhatIfScenario): WhatIfScenario => {
  const savingsRate = scenario.savingsRate ?? scenario.contribution ?? 0;
  return {
    ...scenario,
    savingsRate,
    contribution: savingsRate,
  };
};

interface WhatIfScenario {
  id: string;
  name: string;
  age: number;
  savingsRate: number;
  returnRate: number;
  inflation: number;
  currentSavings: number;
  contribution?: number;
}

export default function WhatIfSimulator() {
  const { user, scenarios, getTierFeatures, canAddScenario } = useUser();
  const tierFeatures = getTierFeatures();

  const ageField = useMemo(() => getFieldDefinition("age"), []);
  const savingsRateField = useMemo(() => getFieldDefinition("savingsRate"), []);
  const expectedReturnField = useMemo(() => getFieldDefinition("expectedReturn"), []);
  const inflationField = useMemo(() => getFieldDefinition("inflation"), []);
  const currentSavingsField = useMemo(() => getFieldDefinition("currentSavings"), []);

  const [activeTab, setActiveTab] = useState(0);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  const normalizeUpdates = (updates: Partial<WhatIfScenario>): Partial<WhatIfScenario> => {
    if (updates.savingsRate != null && updates.contribution == null) {
      return { ...updates, contribution: updates.savingsRate };
    }
    if (updates.contribution != null && updates.savingsRate == null) {
      return { ...updates, savingsRate: updates.contribution };
    }
    return updates;
  };
  
  const [baseline, setBaseline] = useState<WhatIfScenario>(() =>
    normalizeScenario({
      id: "baseline",
      name: "Baseline",
      age: 30,
      savingsRate: 10,
      returnRate: 7,
      inflation: 3,
      currentSavings: 50000,
    })
  );

  const [whatIf1, setWhatIf1] = useState<WhatIfScenario>(() =>
    normalizeScenario({
      id: "whatif1",
      name: "What-If 1",
      age: 30,
      savingsRate: 15,
      returnRate: 8,
      inflation: 3,
      currentSavings: 50000,
    })
  );

  const [whatIfScenarios, setWhatIfScenarios] = useState<WhatIfScenario[]>([whatIf1]);

  const currentScenario = useMemo(() => {
    if (activeTab === 0) return baseline;
    return whatIfScenarios[activeTab - 1] || whatIf1;
  }, [activeTab, baseline, whatIfScenarios, whatIf1]);

  const currentFormState = useMemo(
    () => ({
      age: currentScenario.age,
      savingsRate: currentScenario.savingsRate,
      expectedReturn: currentScenario.returnRate,
      inflation: currentScenario.inflation,
      currentSavings: currentScenario.currentSavings,
    }),
    [currentScenario],
  );

  const buildSliderPresentation = useCallback(
    (field: InputFieldDefinition, value: number) => {
      const metadata = getSliderMetadata(field);
      const rangeIndicators = resolveSliderRangeIndicators(metadata, { formState: currentFormState });
      const sliderState = resolveSliderState(metadata, {
        value,
        formState: currentFormState,
      });
      const trackColor =
        sliderState?.trackColor ?? sliderState?.badgeColor ?? COLORS.primary;

      return {
        rangeIndicators,
        sliderState,
        trackColor,
      };
    },
    [currentFormState],
  );

  const agePresentation = useMemo(
    () => buildSliderPresentation(ageField, currentScenario.age),
    [buildSliderPresentation, ageField, currentScenario.age],
  );
  const savingsRatePresentation = useMemo(
    () => buildSliderPresentation(savingsRateField, currentScenario.savingsRate),
    [buildSliderPresentation, savingsRateField, currentScenario.savingsRate],
  );
  const expectedReturnPresentation = useMemo(
    () => buildSliderPresentation(expectedReturnField, currentScenario.returnRate),
    [buildSliderPresentation, expectedReturnField, currentScenario.returnRate],
  );
  const inflationPresentation = useMemo(
    () => buildSliderPresentation(inflationField, currentScenario.inflation),
    [buildSliderPresentation, inflationField, currentScenario.inflation],
  );

  const ageMarks = useMemo(() => {
    if (agePresentation.rangeIndicators.length > 0) {
      return agePresentation.rangeIndicators.map((indicator) => ({
        value: indicator.value,
        label: indicator.label,
      }));
    }
    const min = ageField.constraints.min;
    const max = ageField.constraints.max;
    const mid = Math.round((min + max) / 2);
    return [
      { value: min, label: String(min) },
      { value: mid, label: String(mid) },
      { value: max, label: String(max) },
    ];
  }, [agePresentation.rangeIndicators, ageField.constraints.min, ageField.constraints.max]);

  const savingsRateMarks = useMemo(() => {
    if (savingsRatePresentation.rangeIndicators.length > 0) {
      return savingsRatePresentation.rangeIndicators.map((indicator) => ({
        value: indicator.value,
        label: indicator.label,
      }));
    }
    return [
      { value: savingsRateField.constraints.min, label: `${savingsRateField.constraints.min}%` },
      { value: (savingsRateField.constraints.max ?? 50) / 2, label: `${Math.round((savingsRateField.constraints.max ?? 50) / 2)}%` },
      { value: savingsRateField.constraints.max, label: `${savingsRateField.constraints.max}%` },
    ];
  }, [savingsRatePresentation.rangeIndicators, savingsRateField.constraints.min, savingsRateField.constraints.max]);

  const expectedReturnMarks = useMemo(() => {
    if (expectedReturnPresentation.rangeIndicators.length > 0) {
      return expectedReturnPresentation.rangeIndicators.map((indicator) => ({
        value: indicator.value,
        label: indicator.label,
      }));
    }
    return [
      { value: expectedReturnField.constraints.min, label: `${expectedReturnField.constraints.min}%` },
      { value: expectedReturnField.constraints.max, label: `${expectedReturnField.constraints.max}%` },
    ];
  }, [expectedReturnPresentation.rangeIndicators, expectedReturnField.constraints.min, expectedReturnField.constraints.max]);

  const inflationMarks = useMemo(() => {
    if (inflationPresentation.rangeIndicators.length > 0) {
      return inflationPresentation.rangeIndicators.map((indicator) => ({
        value: indicator.value,
        label: indicator.label,
      }));
    }
    return [
      { value: inflationField.constraints.min, label: `${inflationField.constraints.min}%` },
      { value: inflationField.constraints.max, label: `${inflationField.constraints.max}%` },
    ];
  }, [inflationPresentation.rangeIndicators, inflationField.constraints.min, inflationField.constraints.max]);

  const updateScenario = (updates: Partial<WhatIfScenario>) => {
    const normalizedUpdates = normalizeUpdates(updates);
    if (activeTab === 0) {
      setBaseline((prev) => normalizeScenario({ ...prev, ...normalizedUpdates }));
    } else {
      const updated = [...whatIfScenarios];
      updated[activeTab - 1] = normalizeScenario({
        ...updated[activeTab - 1],
        ...normalizedUpdates,
      });
      setWhatIfScenarios(updated);
    }
  };

  const startEditingName = () => {
    setTempName(currentScenario.name);
    setEditingName(true);
  };

  const saveScenarioName = () => {
    if (tempName.trim()) {
      updateScenario({ name: tempName.trim() });
    }
    setEditingName(false);
  };

  const cancelEditingName = () => {
    setEditingName(false);
    setTempName("");
  };

  const calculateProjection = (scenario: WhatIfScenario) => {
    const years = 65 - scenario.age;
    const data: { age: number; balance: number }[] = [];
    let balance = scenario.currentSavings;
    const savingsRate = scenario.savingsRate ?? scenario.contribution ?? 0;
    const annualContribution = 100000 * (savingsRate / 100);

    for (let year = 0; year <= years; year++) {
      data.push({
        age: scenario.age + year,
        balance: Math.round(balance),
      });
      balance = balance * (1 + scenario.returnRate / 100) + annualContribution;
    }

    return data;
  };

  const baselineData = calculateProjection(baseline);
  const whatIfData = calculateProjection(currentScenario);

  const finalDiff = (whatIfData.length > 0 && baselineData.length > 0) 
    ? whatIfData[whatIfData.length - 1].balance - baselineData[baselineData.length - 1].balance
    : 0;

  const chartOption = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const age = params[0].axisValue;
        let tooltip = `<b>Age ${age}</b><br/>`;
        params.forEach((param: any) => {
          const value = param.value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          });
          tooltip += `${param.marker} ${param.seriesName}: ${value}<br/>`;
        });
        return tooltip;
      },
    },
    legend: {
      data: activeTab === 0 ? ["Baseline"] : ["Baseline", currentScenario.name],
      top: 10,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: baselineData.map((d) => d.age),
      name: "Age",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: "Balance ($)",
      axisLabel: {
        formatter: (value: number) =>
          "$" + (value / 1000).toFixed(0) + "k",
      },
    },
    series:
      activeTab === 0
        ? [
            {
              name: "Baseline",
              type: "line",
              data: baselineData.map((d) => d.balance),
              smooth: true,
              lineStyle: { width: 3, color: COLORS.secondary },
              itemStyle: { color: COLORS.secondary },
            },
          ]
        : [
            {
              name: "Baseline",
              type: "line",
              data: baselineData.map((d) => d.balance),
              smooth: true,
              lineStyle: { width: 2, color: "#ccc", type: "dashed" },
              itemStyle: { color: "#ccc" },
            },
            {
              name: currentScenario.name,
              type: "line",
              data: whatIfData.map((d) => d.balance),
              smooth: true,
              lineStyle: { width: 3, color: COLORS.primary },
              itemStyle: { color: COLORS.primary },
            },
          ],
  };

  const handleAddScenario = () => {
    // Check if user can add more What-If scenarios (baseline + whatIfScenarios should not exceed tier limit)
    const totalScenarios = 1 + whatIfScenarios.length; // 1 for baseline + what-if scenarios
    if (totalScenarios >= tierFeatures.maxScenarios) {
      alert(`You've reached the maximum of ${tierFeatures.maxScenarios} scenarios for your tier. Upgrade to add more!`);
      return;
    }
    const newScenario: WhatIfScenario = normalizeScenario({
      ...baseline,
      id: `whatif${whatIfScenarios.length + 1}`,
      name: `What-If ${whatIfScenarios.length + 1}`,
    });
    setWhatIfScenarios([...whatIfScenarios, newScenario]);
    setActiveTab(whatIfScenarios.length + 1);
  };

  const handleCloneScenario = () => {
    // Check if user can add more What-If scenarios
    const totalScenarios = 1 + whatIfScenarios.length; // 1 for baseline + what-if scenarios
    if (totalScenarios >= tierFeatures.maxScenarios) {
      alert(`You've reached the maximum of ${tierFeatures.maxScenarios} scenarios for your tier. Upgrade to add more!`);
      return;
    }
    const cloned: WhatIfScenario = normalizeScenario({
      ...currentScenario,
      id: `whatif${whatIfScenarios.length + 1}`,
      name: `${currentScenario.name} (Copy)`,
    });
    setWhatIfScenarios([...whatIfScenarios, cloned]);
    setActiveTab(whatIfScenarios.length + 1);
  };

  const handleDeleteScenario = () => {
    if (activeTab === 0) return;
    const updated = whatIfScenarios.filter((_, i) => i !== activeTab - 1);
    setWhatIfScenarios(updated);
    setActiveTab(Math.max(0, activeTab - 1));
  };

  // Comparison table data
  const comparisonRows = useMemo(() => {
    if (activeTab === 0) return [];
    return baselineData.map((base, index) => {
      const whatIf = whatIfData[index];
      if (!whatIf) {
        return {
          age: base.age,
          baseline: base.balance,
          whatIf: 0,
          diff: 0,
        };
      }
      return {
        age: base.age,
        baseline: base.balance,
        whatIf: whatIf.balance,
        diff: whatIf.balance - base.balance,
      };
    });
  }, [activeTab, baselineData, whatIfData]);

  return (
    <>
      <Box sx={{ minHeight: "100vh", backgroundColor: COLORS.background, pb: 10 }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700} color={COLORS.textPrimary}>
                  What-If Simulator
                </Typography>
                <Typography variant="body2" color={COLORS.textSecondary} sx={{ mt: 0.5 }}>
                  Compare scenarios side-by-side to optimize your strategy
                </Typography>
              </Box>
              <Chip
                label={`${user?.tier.toUpperCase()} Tier`}
                sx={{
                  backgroundColor: user?.tier === "premium" ? COLORS.premium : COLORS.border,
                  fontWeight: 600,
                }}
              />
            </Stack>

            <InfoCard
              title="How to Use What-If Simulator"
              description="Create multiple scenarios to compare different strategies. Start with your baseline (current plan), then add variations like 'increase contributions by $2000', 'retire 2 years earlier', or 'higher returns'. The comparison chart and difference pills show which strategy works best."
              variant="tip"
              defaultExpanded={false}
            />

            {/* Tabs */}
            <Paper sx={{ borderRadius: 2, mt: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="🎯 Baseline" />
                {whatIfScenarios.map((scenario, i) => (
                  <Tab key={scenario.id} label={`🔮 ${scenario.name}`} />
                ))}
                <Tab
                  icon={<AddIcon />}
                  iconPosition="start"
                  label="Add Scenario"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddScenario();
                  }}
                  sx={{ ml: "auto" }}
                />
              </Tabs>
            </Paper>

            {/* Upgrade Banner */}
            {user?.tier !== "premium" && (1 + whatIfScenarios.length) >= tierFeatures.maxScenarios && (
              <UpgradeBanner
                title="Upgrade to Premium"
                description="Get unlimited scenarios, Monte Carlo analysis, and more!"
                compact
              />
            )}

            {/* Main Content */}
            <Grid container spacing={3}>
              {/* Left Panel - Sliders */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {editingName ? (
                        <>
                          <TextField
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            size="small"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveScenarioName();
                              if (e.key === 'Escape') cancelEditingName();
                            }}
                            sx={{ flexGrow: 1 }}
                          />
                          <IconButton size="small" onClick={saveScenarioName} color="primary">
                            <CheckIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
                            {currentScenario.name} Settings
                          </Typography>
                          <Tooltip title="Edit scenario name">
                            <IconButton size="small" onClick={startEditingName}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {ageField.label}: {currentScenario.age}
                        </Typography>
                        <HelpTooltip
                          title={helpContent.calculator.currentAge.title}
                          description={helpContent.calculator.currentAge.description}
                          size="small"
                        />
                      </Box>
                      <Slider
                        value={currentScenario.age}
                        onChange={(_, v) => updateScenario({ age: Math.round(v as number) })}
                        min={ageField.constraints.min}
                        max={ageField.constraints.max}
                        step={ageField.constraints.step}
                        marks={ageMarks}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) =>
                          ageField.constraints.format
                            ? ageField.constraints.format(v as number)
                            : `${v}`
                        }
                        sx={{ color: agePresentation.trackColor }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {currentSavingsField.label}: ${currentScenario.currentSavings.toLocaleString()}
                        </Typography>
                        <HelpTooltip
                          title={helpContent.calculator.currentBalance.title}
                          description={helpContent.calculator.currentBalance.description}
                          size="small"
                        />
                      </Box>
                      <Slider
                        value={currentScenario.currentSavings}
                        onChange={(_, v) => updateScenario({ currentSavings: v as number })}
                        min={currentSavingsField.constraints.min}
                        max={currentSavingsField.constraints.max}
                        step={currentSavingsField.constraints.step}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) =>
                          currentSavingsField.constraints.format
                            ? currentSavingsField.constraints.format(v as number)
                            : `$${(v as number).toLocaleString()}`
                        }
                        sx={{ color: COLORS.secondary }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {savingsRateField.label}: {currentScenario.savingsRate}%
                        </Typography>
                        <HelpTooltip
                          title={helpContent.calculator.annualContribution.title}
                          description={helpContent.calculator.annualContribution.description}
                          size="small"
                        />
                        {savingsRatePresentation.sliderState && (
                          <Chip
                            label={savingsRatePresentation.sliderState.label}
                            size="small"
                            sx={{
                              ml: 1,
                              height: 20,
                              fontSize: '0.7rem',
                              backgroundColor: savingsRatePresentation.sliderState.badgeColor,
                              color: '#fff',
                            }}
                          />
                        )}
                      </Box>
                      <Slider
                        value={currentScenario.savingsRate}
                        onChange={(_, v) => updateScenario({ savingsRate: v as number })}
                        min={savingsRateField.constraints.min}
                        max={savingsRateField.constraints.max}
                        step={savingsRateField.constraints.step}
                        marks={savingsRateMarks}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => `${v}%`}
                        sx={{ color: savingsRatePresentation.trackColor }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {expectedReturnField.label}: {currentScenario.returnRate}%
                        </Typography>
                        <HelpTooltip
                          title={helpContent.calculator.expectedReturn.title}
                          description={helpContent.calculator.expectedReturn.description}
                          size="small"
                        />
                        {expectedReturnPresentation.sliderState && (
                          <Chip
                            label={expectedReturnPresentation.sliderState.label}
                            size="small"
                            sx={{
                              ml: 1,
                              height: 20,
                              fontSize: '0.7rem',
                              backgroundColor: expectedReturnPresentation.sliderState.badgeColor,
                              color: '#fff',
                            }}
                          />
                        )}
                      </Box>
                      <Slider
                        value={currentScenario.returnRate}
                        onChange={(_, v) => updateScenario({ returnRate: v as number })}
                        min={expectedReturnField.constraints.min}
                        max={expectedReturnField.constraints.max}
                        step={expectedReturnField.constraints.step}
                        marks={expectedReturnMarks}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => `${v}%`}
                        sx={{ color: expectedReturnPresentation.trackColor }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {inflationField.label}: {currentScenario.inflation}%
                        </Typography>
                        <HelpTooltip
                          title={helpContent.calculator.inflation.title}
                          description={helpContent.calculator.inflation.description}
                          size="small"
                        />
                        {inflationPresentation.sliderState && (
                          <Chip
                            label={inflationPresentation.sliderState.label}
                            size="small"
                            sx={{
                              ml: 1,
                              height: 20,
                              fontSize: '0.7rem',
                              backgroundColor: inflationPresentation.sliderState.badgeColor,
                              color: '#fff',
                            }}
                          />
                        )}
                      </Box>
                      <Slider
                        value={currentScenario.inflation}
                        onChange={(_, v) => updateScenario({ inflation: v as number })}
                        min={inflationField.constraints.min}
                        max={inflationField.constraints.max}
                        step={inflationField.constraints.step}
                        marks={inflationMarks}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => `${v}%`}
                        sx={{ color: inflationPresentation.trackColor }}
                      />
                    </Box>

                    {activeTab > 0 && (
                      <>
                        <Button
                          variant="outlined"
                          startIcon={<ContentCopyIcon />}
                          onClick={handleCloneScenario}
                          fullWidth
                        >
                          Clone This Scenario
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={handleDeleteScenario}
                          fullWidth
                        >
                          Delete Scenario
                        </Button>
                      </>
                    )}
                  </Stack>
                </Paper>
              </Grid>

              {/* Right Panel - Chart */}
              <Grid item xs={12} md={8}>
                <Stack spacing={2}>
                  {activeTab > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <DiffPill
                        difference={finalDiff}
                        format="currency"
                        label="Final Difference"
                      />
                    </Box>
                  )}

                  <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <ReactECharts option={chartOption} style={{ height: 400 }} />
                  </Paper>

                  {/* Comparison Table */}
                  {activeTab > 0 && comparisonRows.length > 0 && (
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        Year-by-Year Comparison
                      </Typography>
                      <Box sx={{ maxHeight: 400, overflow: "auto", mt: 2 }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ backgroundColor: COLORS.background }}>
                              <th style={{ padding: "12px", textAlign: "left" }}>Age</th>
                              <th style={{ padding: "12px", textAlign: "right" }}>Baseline</th>
                              <th style={{ padding: "12px", textAlign: "right" }}>{currentScenario.name}</th>
                              <th style={{ padding: "12px", textAlign: "right" }}>Difference</th>
                            </tr>
                          </thead>
                          <tbody>
                            {comparisonRows.map((row) => (
                              <tr key={row.age} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                                <td style={{ padding: "12px" }}>{row.age}</td>
                                <td style={{ padding: "12px", textAlign: "right" }}>
                                  ${row.baseline.toLocaleString()}
                                </td>
                                <td style={{ padding: "12px", textAlign: "right" }}>
                                  ${row.whatIf.toLocaleString()}
                                </td>
                                <td
                                  style={{
                                    padding: "12px",
                                    textAlign: "right",
                                    color: row.diff >= 0 ? COLORS.success : COLORS.error,
                                    fontWeight: 600,
                                  }}
                                >
                                  {row.diff >= 0 ? "+" : ""}${row.diff.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Box>
                    </Paper>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>

    </>
  );
}
