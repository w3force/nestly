"use client";
import React, { useState, useMemo } from "react";
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
import { useUser } from "../../contexts/UserContext";
import { UpgradeBanner } from "../../components/UpgradeBanner";
import { DiffPill } from "../../components/DiffPill";
import { BottomNav } from "../../components/BottomNav";
import { Scenario } from "../../lib/types";
import { InfoCard } from "../../components/InfoCard";
import { HelpTooltip } from "../../components/HelpTooltip";
import { helpContent } from "../../lib/helpContent";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

interface WhatIfScenario {
  id: string;
  name: string;
  age: number;
  contribution: number;
  returnRate: number;
  inflation: number;
  currentSavings: number;
}

export default function WhatIfSimulator() {
  const { user, scenarios, getTierFeatures, canAddScenario } = useUser();
  const tierFeatures = getTierFeatures();

  const [activeTab, setActiveTab] = useState(0);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  
  const [baseline, setBaseline] = useState<WhatIfScenario>({
    id: "baseline",
    name: "Baseline",
    age: 30,
    contribution: 10,
    returnRate: 7,
    inflation: 3,
    currentSavings: 50000,
  });

  const [whatIf1, setWhatIf1] = useState<WhatIfScenario>({
    id: "whatif1",
    name: "What-If 1",
    age: 30,
    contribution: 15,
    returnRate: 8,
    inflation: 3,
    currentSavings: 50000,
  });

  const [whatIfScenarios, setWhatIfScenarios] = useState<WhatIfScenario[]>([whatIf1]);

  const currentScenario = useMemo(() => {
    if (activeTab === 0) return baseline;
    return whatIfScenarios[activeTab - 1] || whatIf1;
  }, [activeTab, baseline, whatIfScenarios, whatIf1]);

  const updateScenario = (updates: Partial<WhatIfScenario>) => {
    if (activeTab === 0) {
      setBaseline({ ...baseline, ...updates });
    } else {
      const updated = [...whatIfScenarios];
      updated[activeTab - 1] = { ...updated[activeTab - 1], ...updates };
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

  // Helper function to get slider color based on value
  const getReturnColor = (value: number) => {
    if (value < 5) return "#FF6B6B"; // Low (red)
    if (value >= 5 && value <= 8) return "#4ABDAC"; // Average (teal)
    return "#69B47A"; // High (green)
  };

  const getInflationColor = (value: number) => {
    if (value < 2) return "#69B47A"; // Low (green - good)
    if (value >= 2 && value <= 4) return "#FFB74D"; // Average (orange)
    return "#FF6B6B"; // High (red - bad)
  };

  const calculateProjection = (scenario: WhatIfScenario) => {
    const years = 65 - scenario.age;
    const data: { age: number; balance: number }[] = [];
    let balance = scenario.currentSavings;
    const annualContribution = 100000 * (scenario.contribution / 100);

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

  const finalDiff = whatIfData[whatIfData.length - 1].balance - baselineData[baselineData.length - 1].balance;

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
              lineStyle: { width: 3, color: "#69B47A" },
              itemStyle: { color: "#69B47A" },
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
              lineStyle: { width: 3, color: "#4ABDAC" },
              itemStyle: { color: "#4ABDAC" },
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
    const newScenario: WhatIfScenario = {
      ...baseline,
      id: `whatif${whatIfScenarios.length + 1}`,
      name: `What-If ${whatIfScenarios.length + 1}`,
    };
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
    const cloned: WhatIfScenario = {
      ...currentScenario,
      id: `whatif${whatIfScenarios.length + 1}`,
      name: `${currentScenario.name} (Copy)`,
    };
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
      <Box sx={{ minHeight: "100vh", backgroundColor: "#F5F5F5", pb: 10 }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" fontWeight={700} color="#30403A">
                  What-If Simulator
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Compare scenarios side-by-side to optimize your strategy
                </Typography>
              </Box>
              <Chip
                label={`${user?.tier.toUpperCase()} Tier`}
                sx={{
                  backgroundColor: user?.tier === "premium" ? "#FFD54F" : "#e0e0e0",
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
                          Current Age: {currentScenario.age}
                        </Typography>
                        <HelpTooltip
                          title={helpContent.calculator.currentAge.title}
                          description={helpContent.calculator.currentAge.description}
                          size="small"
                        />
                      </Box>
                      <Slider
                        value={currentScenario.age}
                        onChange={(_, v) => updateScenario({ age: v as number })}
                        min={18}
                        max={64}
                        marks={[
                          { value: 20, label: "20" },
                          { value: 40, label: "40" },
                          { value: 60, label: "60" },
                        ]}
                        valueLabelDisplay="auto"
                        sx={{ color: "#69B47A" }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Current Savings: ${currentScenario.currentSavings.toLocaleString()}
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
                        min={0}
                        max={500000}
                        step={5000}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => "$" + (v / 1000).toFixed(0) + "k"}
                        sx={{ color: "#69B47A" }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Contribution Rate: {currentScenario.contribution}%
                        </Typography>
                        <HelpTooltip
                          title={helpContent.calculator.annualContribution.title}
                          description={helpContent.calculator.annualContribution.description}
                          size="small"
                        />
                      </Box>
                      <Slider
                        value={currentScenario.contribution}
                        onChange={(_, v) => updateScenario({ contribution: v as number })}
                        min={0}
                        max={30}
                        step={1}
                        marks={[
                          { value: 0, label: "0%" },
                          { value: 15, label: "15%" },
                          { value: 30, label: "30%" },
                        ]}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => v + "%"}
                        sx={{ color: "#4ABDAC" }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Expected Return: {currentScenario.returnRate}%
                        </Typography>
                        <HelpTooltip
                          title={helpContent.calculator.expectedReturn.title}
                          description={helpContent.calculator.expectedReturn.description}
                          size="small"
                        />
                        <Chip
                          label={
                            currentScenario.returnRate < 5 ? "Low" :
                            currentScenario.returnRate <= 8 ? "Average" : "High"
                          }
                          size="small"
                          sx={{
                            ml: 1,
                            height: 20,
                            fontSize: '0.7rem',
                            backgroundColor: getReturnColor(currentScenario.returnRate),
                            color: 'white',
                          }}
                        />
                      </Box>
                      <Slider
                        value={currentScenario.returnRate}
                        onChange={(_, v) => updateScenario({ returnRate: v as number })}
                        min={0}
                        max={15}
                        step={0.5}
                        marks={[
                          { value: 0, label: "0%" },
                          { value: 5, label: "5%" },
                          { value: 8, label: "8%" },
                          { value: 15, label: "15%" },
                        ]}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => v + "%"}
                        sx={{
                          color: getReturnColor(currentScenario.returnRate),
                          '& .MuiSlider-thumb': {
                            boxShadow: `0 4px 12px ${getReturnColor(currentScenario.returnRate)}55`,
                          },
                          '& .MuiSlider-track': {
                            background: 'linear-gradient(to right, #FF6B6B 0%, #FF6B6B 33%, #4ABDAC 33%, #4ABDAC 53%, #69B47A 53%, #69B47A 100%)',
                            border: 'none',
                          },
                          '& .MuiSlider-rail': {
                            background: 'linear-gradient(to right, #FF6B6B 0%, #FF6B6B 33%, #4ABDAC 33%, #4ABDAC 53%, #69B47A 53%, #69B47A 100%)',
                            opacity: 0.3,
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Inflation Rate: {currentScenario.inflation}%
                        </Typography>
                        <HelpTooltip
                          title={helpContent.calculator.inflation.title}
                          description={helpContent.calculator.inflation.description}
                          size="small"
                        />
                        <Chip
                          label={
                            currentScenario.inflation < 2 ? "Low" :
                            currentScenario.inflation <= 4 ? "Average" : "High"
                          }
                          size="small"
                          sx={{
                            ml: 1,
                            height: 20,
                            fontSize: '0.7rem',
                            backgroundColor: getInflationColor(currentScenario.inflation),
                            color: 'white',
                          }}
                        />
                      </Box>
                      <Slider
                        value={currentScenario.inflation}
                        onChange={(_, v) => updateScenario({ inflation: v as number })}
                        min={0}
                        max={10}
                        step={0.5}
                        marks={[
                          { value: 0, label: "0%" },
                          { value: 2, label: "2%" },
                          { value: 4, label: "4%" },
                          { value: 10, label: "10%" },
                        ]}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => v + "%"}
                        sx={{
                          color: getInflationColor(currentScenario.inflation),
                          '& .MuiSlider-thumb': {
                            boxShadow: `0 4px 12px ${getInflationColor(currentScenario.inflation)}55`,
                          },
                          '& .MuiSlider-track': {
                            background: 'linear-gradient(to right, #69B47A 0%, #69B47A 20%, #FFB74D 20%, #FFB74D 40%, #FF6B6B 40%, #FF6B6B 100%)',
                            border: 'none',
                          },
                          '& .MuiSlider-rail': {
                            background: 'linear-gradient(to right, #69B47A 0%, #69B47A 20%, #FFB74D 20%, #FFB74D 40%, #FF6B6B 40%, #FF6B6B 100%)',
                            opacity: 0.3,
                          },
                        }}
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
                            <tr style={{ backgroundColor: "#f5f5f5" }}>
                              <th style={{ padding: "12px", textAlign: "left" }}>Age</th>
                              <th style={{ padding: "12px", textAlign: "right" }}>Baseline</th>
                              <th style={{ padding: "12px", textAlign: "right" }}>{currentScenario.name}</th>
                              <th style={{ padding: "12px", textAlign: "right" }}>Difference</th>
                            </tr>
                          </thead>
                          <tbody>
                            {comparisonRows.map((row) => (
                              <tr key={row.age} style={{ borderBottom: "1px solid #e0e0e0" }}>
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
                                    color: row.diff >= 0 ? "#4caf50" : "#f44336",
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

      <BottomNav />
    </>
  );
}
