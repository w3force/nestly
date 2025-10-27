"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import type { EChartsOption } from "echarts";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Box,
  Container,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Paper,
  Divider,
  Snackbar,
  CssBaseline,
  Switch,
  FormControlLabel,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SaveIcon from "@mui/icons-material/Save";
import ReplayIcon from "@mui/icons-material/Replay";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import { ThemeProvider, createTheme, alpha, styled } from "@mui/material/styles";
import {
  WhatIfScenario,
  DEFAULT_BASELINE,
  createScenario,
  getScreenDefinition,
  getFieldDefinition,
} from "@projection/shared";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { SchemaFieldControl } from "../../components/SchemaFieldControl";
import { HelpTooltip } from "../../components/HelpTooltip";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

type ViewMode = "balance" | "breakdown";

type ScenarioGroup = {
  id: string;
  title?: string;
  description?: string;
  fields: string[];
};

const ViewToggle = styled(ToggleButtonGroup)(({ theme }) => ({
  borderRadius: 999,
  padding: 4,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  '& .MuiToggleButton-root': {
    border: 0,
    borderRadius: 999,
    textTransform: 'none',
    fontWeight: 600,
    padding: '6px 18px',
    color: '#264336',
  },
  '& .MuiToggleButton-root.Mui-selected': {
    background: 'linear-gradient(135deg, #4ABDAC, #2F8F7C)',
    color: theme.palette.common.white,
    boxShadow: '0 8px 18px rgba(74, 189, 172, 0.22)',
  },
  '& .MuiToggleButton-root.Mui-selected:hover': {
    background: 'linear-gradient(135deg, #3CAFA0, #2A7D6B)',
  },
}));

const ScenarioButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'fixedWidth',
})<{ active?: boolean; fixedWidth?: boolean }>(({ theme, active, fixedWidth = true }) => ({
  borderRadius: 999,
  textTransform: 'none',
  fontWeight: 600,
  padding: '6px 18px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  minWidth: fixedWidth ? 112 : undefined,
  maxWidth: fixedWidth ? 180 : undefined,
  flexShrink: fixedWidth ? 0 : undefined,
  borderWidth: 1.5,
  borderStyle: 'solid',
  backgroundColor: 'transparent',
  transition: 'all 0.2s ease',
  minHeight: 36,
  ...(active
    ? {
        background: 'linear-gradient(135deg, #4ABDAC, #2F8F7C)',
        color: theme.palette.common.white,
        borderColor: 'transparent',
        boxShadow: '0 8px 20px rgba(74, 189, 172, 0.25)',
      }
    : {
        color: '#264336',
        borderColor: alpha(theme.palette.primary.main, 0.28),
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          borderColor: alpha(theme.palette.primary.main, 0.4),
        },
      }),
  '& .scenario-label': fixedWidth
    ? {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: 'calc(100% - 20px)',
      display: 'inline-block',
    }
    : {
        whiteSpace: 'nowrap',
      },
}));

const currencyFormatter = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const normalizeScenario = (scenario: WhatIfScenario): WhatIfScenario => {
  const savingsRate = scenario.savingsRate ?? scenario.contribution ?? 0;
  const income = scenario.income ?? 100000;
  const targetAge = scenario.targetAge ?? 65;
  const targetIncome = scenario.targetIncome ?? 70000;
  return {
    ...scenario,
    savingsRate,
    contribution: savingsRate,
    income,
    targetAge,
    targetIncome,
  };
};

interface YearDetail {
  age: number;
  contribution: number;
  returnAmount: number;
  inflationDrag: number;
  endBalance: number;
  cumulativeContribution: number;
}

const buildYearlyDetails = (scenario: WhatIfScenario): YearDetail[] => {
  const targetAge = scenario.targetAge ?? 65;
  const years = Math.max(targetAge - scenario.age, 0);
  const income = scenario.income ?? 100000;
  const savingsRate = scenario.savingsRate ?? scenario.contribution ?? 0;
  const annualContribution = income * (savingsRate / 100);
  const nominalRate = scenario.returnRate / 100;
  const inflationRate = scenario.inflation / 100;

  let balance = scenario.currentSavings;
  let cumulativeContribution = 0;
  const rows: YearDetail[] = [];

  rows.push({
    age: scenario.age,
    contribution: 0,
    returnAmount: 0,
    inflationDrag: 0,
    endBalance: Math.round(balance),
    cumulativeContribution,
  });

  for (let year = 1; year <= years; year++) {
    const contribution = annualContribution;
    cumulativeContribution += contribution;
    const preGrowth = balance + contribution;
    const returnAmount = preGrowth * nominalRate;
    const inflationDrag = preGrowth * inflationRate;
    balance = preGrowth + returnAmount - inflationDrag;

    rows.push({
      age: scenario.age + year,
      contribution,
      returnAmount,
      inflationDrag,
      endBalance: Math.round(balance),
      cumulativeContribution,
    });
  }

  return rows;
};

const WhatIfPlanner: React.FC = () => {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: {
            main: "#4ABDAC",
          },
          secondary: {
            main: "#69B47A",
          },
        },
        typography: {
          fontFamily: "'Inter', sans-serif",
        },
      }),
    []
  );

  const [viewMode, setViewMode] = useState<ViewMode>("balance");
  const [baseline, setBaseline] = useState<WhatIfScenario>(() => normalizeScenario(DEFAULT_BASELINE));
  const [scenarios, setScenarios] = useState<WhatIfScenario[]>([
    normalizeScenario(createScenario(1)),
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollState, setScrollState] = useState({ canScrollLeft: false, canScrollRight: false });
  const [showAllScenarios, setShowAllScenarios] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const scenarioRailRef = useRef<HTMLDivElement | null>(null);
  const isCompactViewport = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });
  const showDesktopNavigation = !isCompactViewport;

  const whatIfScreen = useMemo(() => getScreenDefinition("whatif"), []);
  const scenarioGroups = useMemo(() => {
    const groups = (whatIfScreen.metadata?.scenarioGroups as ScenarioGroup[]) || [];
    if (groups.length > 0) {
      return groups;
    }
    const fallbackSection = whatIfScreen.sections.find((section) => section.id === "baseline");
    if (!fallbackSection) {
      return [];
    }
    return [
      {
        id: "default",
        title: undefined,
        description: undefined,
        fields: fallbackSection.fields,
      },
    ];
  }, [whatIfScreen]);

  const fieldDefinitions = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getFieldDefinition>>();
    scenarioGroups.forEach((group) => {
      group.fields.forEach((fieldId) => {
        if (!map.has(fieldId)) {
          map.set(fieldId, getFieldDefinition(fieldId));
        }
      });
    });
    return map;
  }, [scenarioGroups]);

  const currentScenario = useMemo(() => {
    if (activeIndex === 0) {
      return baseline;
    }
    return scenarios[activeIndex - 1] ?? scenarios[0];
  }, [activeIndex, baseline, scenarios]);

  const currentFormState = useMemo(
    () => ({
      age: currentScenario.age,
      savingsRate: currentScenario.savingsRate,
      expectedReturn: currentScenario.returnRate,
      inflation: currentScenario.inflation,
      currentSavings: currentScenario.currentSavings,
      income: currentScenario.income,
      targetAge: currentScenario.targetAge,
      targetIncome: currentScenario.targetIncome,
    }),
    [currentScenario]
  );

  const mapFieldUpdates = (fieldId: string, value: number | string) => {
    switch (fieldId) {
      case "scenarioName":
        return { name: String(value) };
      case "age":
        return { age: Number(value) };
      case "currentSavings":
        return { currentSavings: Number(value) };
      case "income":
        return { income: Number(value) };
      case "savingsRate": {
        const numeric = Number(value);
        return { savingsRate: numeric, contribution: numeric };
      }
      case "expectedReturn":
        return { returnRate: Number(value) };
      case "inflation":
        return { inflation: Number(value) };
      case "targetAge":
        return { targetAge: Number(value) };
      case "targetIncome":
        return { targetIncome: Number(value) };
      default:
        return {};
    }
  };

  const handleFieldChange = (fieldId: string, value: number | string) => {
    const updates = mapFieldUpdates(fieldId, value);
    if (activeIndex === 0) {
      setBaseline((prev) => normalizeScenario({ ...prev, ...updates }));
    } else {
      setScenarios((prev) => {
        const next = [...prev];
        next[activeIndex - 1] = normalizeScenario({
          ...next[activeIndex - 1],
          ...updates,
        });
        return next;
      });
    }
  };

  const handleAddScenario = () => {
    const newScenario = normalizeScenario(createScenario(scenarios.length + 1));
    setScenarios((prev) => [...prev, newScenario]);
    setActiveIndex(scenarios.length + 1);
    setSnackbar({ open: true, message: "Scenario added." });
  };

  const handleCloneScenario = () => {
    if (activeIndex === 0) {
      setSnackbar({ open: true, message: "Select a What-If scenario to clone." });
      return;
    }
    const cloned = normalizeScenario({
      ...currentScenario,
      id: `whatif${scenarios.length + 1}`,
      name: `${currentScenario.name} (Copy)`,
    });
    setScenarios((prev) => [...prev, cloned]);
    setActiveIndex(scenarios.length + 1);
    setSnackbar({ open: true, message: "Scenario cloned." });
  };

  const handleSaveScenario = () => {
    setSnackbar({ open: true, message: "Scenario saved." });
  };

  const handleResetScenario = () => {
    if (activeIndex === 0) {
      setBaseline(normalizeScenario(DEFAULT_BASELINE));
    } else {
      setScenarios((prev) => {
        const next = [...prev];
        next[activeIndex - 1] = normalizeScenario(createScenario(activeIndex));
        return next;
      });
    }
    setSnackbar({ open: true, message: "Scenario reset." });
  };

  const handleRemoveScenario = useCallback(
    (chipIndex: number) => {
      if (chipIndex === 0) {
        setSnackbar({ open: true, message: "Baseline cannot be removed." });
        return;
      }

      setScenarios((prev) => {
        const next = [...prev];
        next.splice(chipIndex - 1, 1);
        return next;
      });

      setActiveIndex((prev) => {
        if (prev === chipIndex) {
          return Math.max(chipIndex - 1, 0);
        }
        if (prev > chipIndex) {
          return prev - 1;
        }
        return prev;
      });

      setSnackbar({ open: true, message: "Scenario removed." });
    },
    [setScenarios, setActiveIndex, setSnackbar]
  );

  const updateScrollState = useCallback(() => {
    const rail = scenarioRailRef.current;
    if (!rail) return;
    const tolerance = 2;
    setScrollState({
      canScrollLeft: rail.scrollLeft > tolerance,
      canScrollRight: rail.scrollLeft + rail.clientWidth < rail.scrollWidth - tolerance,
    });
  }, []);

  const scrollScenarios = useCallback((direction: "left" | "right") => {
    const rail = scenarioRailRef.current;
    if (!rail) return;
    const delta = rail.clientWidth * 0.6;
    rail.scrollBy({ left: direction === "left" ? -delta : delta, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const rail = scenarioRailRef.current;
    if (!rail) return;

    updateScrollState();

    const handleScroll = () => updateScrollState();
    rail.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      rail.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  useEffect(() => {
    updateScrollState();
  }, [scenarios.length, updateScrollState]);

  useEffect(() => {
    const rail = scenarioRailRef.current;
    if (!rail) return;
    const activeChip = rail.querySelector<HTMLButtonElement>(`[data-scenario-chip="${activeIndex}"]`);
    if (!activeChip) return;

    const chipRect = activeChip.getBoundingClientRect();
    const railRect = rail.getBoundingClientRect();

    if (chipRect.left < railRect.left || chipRect.right > railRect.right) {
      activeChip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeIndex]);

  const baselineDetails = useMemo(() => buildYearlyDetails(baseline), [baseline]);
  const scenarioDetails = useMemo(
    () => buildYearlyDetails(currentScenario),
    [currentScenario]
  );

  const allScenarioSeries = useMemo(
    () =>
      scenarios.map((scenario) => ({
        id: scenario.id,
        name: scenario.name,
        details: buildYearlyDetails(scenario),
      })),
    [scenarios]
  );

  const scenarioDetailByAge = useMemo(() => {
    const map = new Map<number, YearDetail>();
    scenarioDetails.forEach((detail) => {
      map.set(detail.age, detail);
    });
    return map;
  }, [scenarioDetails]);

  const scenarioFinal = scenarioDetails.at(-1)?.endBalance ?? 0;
  const baselineFinal = baselineDetails.find((row) => row.age === (scenarioDetails.at(-1)?.age ?? row.age))?.endBalance ?? baselineDetails.at(-1)?.endBalance ?? 0;
  const deltaFinal = scenarioFinal - baselineFinal;

  const increasedScenario = useMemo(() => {
    const boostedRate = Math.min(currentScenario.savingsRate + 2, 50);
    return normalizeScenario({ ...currentScenario, savingsRate: boostedRate });
  }, [currentScenario]);
  const increasedBalance = useMemo(() => {
    const details = buildYearlyDetails(increasedScenario);
    return details.at(-1)?.endBalance ?? scenarioFinal;
  }, [increasedScenario, scenarioFinal]);

  const chartOption: EChartsOption = useMemo(() => {
    const baselineColor = "#2F8F7C";
    const activeScenarioColor = "#4ABDAC";
    const secondaryScenarioColor = "rgba(74, 189, 172, 0.35)";

    const goalAge = currentScenario.targetAge;
    const baselineSeries = baselineDetails.map((row) => [row.age, row.endBalance]);
    const scenarioSeries = scenarioDetails.map((row) => [row.age, row.endBalance]);

    const tooltipFormatter = (params: any) => {
      const points = Array.isArray(params) ? params : [params];
      const age = points[0]?.axisValue ?? "";
      let content = `<strong>Age ${age}</strong><br/>`;

      if (viewMode === "balance") {
        points.forEach((point: any) => {
          const label = point.seriesName;
          const value = currencyFormatter(point.value[1] ?? point.value);
          content += `${point.marker} ${label}: ${value}<br/>`;
        });
        return content;
      }

      const detail = scenarioDetailByAge.get(Number(age));
      if (detail) {
        content += `${points[0].marker} Contributions: ${currencyFormatter(detail.cumulativeContribution)}<br/>`;
        content += `${points[0].marker} Growth: ${currencyFormatter(Math.max(detail.endBalance - detail.cumulativeContribution, 0))}<br/>`;
        content += `<span style="color:#9AA5A0">• Inflation Drag: ${currencyFormatter(detail.inflationDrag)}</span><br/>`;
        content += `<strong>Total: ${currencyFormatter(detail.endBalance)}</strong>`;
      }
      return content;
    };

    const option: EChartsOption = {
      animationDuration: 300,
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(32, 48, 44, 0.85)",
        borderWidth: 0,
        textStyle: { color: "#fff" },
        formatter: tooltipFormatter,
      },
      legend: {
        data:
          viewMode === "balance"
            ? showAllScenarios
              ? ["Baseline", ...allScenarioSeries.map((series) => series.name)]
              : ["Baseline", currentScenario.name]
            : ["Contributions", "Growth"],
      },
      grid: { left: 40, right: 20, top: 40, bottom: 40 },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: scenarioDetails.map((row) => row.age),
        name: "Age",
      },
      yAxis: {
        type: "value",
        name: "Balance",
        axisLabel: {
          formatter: (val: number) => currencyFormatter(val),
        },
      },
      series: [],
    };

    if (viewMode === "balance") {
      const series: any[] = [
        {
          name: "Baseline",
          type: "line",
          data: baselineSeries,
          smooth: true,
          lineStyle: { width: 2, type: "dashed", color: baselineColor },
          itemStyle: { color: baselineColor },
        },
      ];

      if (showAllScenarios) {
        allScenarioSeries.forEach((seriesEntry, index) => {
          const isActiveScenario = activeIndex > 0 && activeIndex - 1 === index;
          const lineColor = isActiveScenario ? activeScenarioColor : secondaryScenarioColor;

          series.push({
            name: seriesEntry.name,
            type: "line",
            data: seriesEntry.details.map((row) => [row.age, row.endBalance]),
            smooth: true,
            lineStyle: { width: isActiveScenario ? 3 : 1.5, color: lineColor },
            itemStyle: { color: lineColor },
            ...(isActiveScenario
              ? {
                  areaStyle: {
                    color: "rgba(74, 189, 172, 0.08)",
                  },
                }
              : {}),
          });
        });
      } else {
        series.push({
          name: currentScenario.name,
          type: "line",
          data: scenarioSeries,
          smooth: true,
          lineStyle: { width: 3, color: activeScenarioColor },
          itemStyle: { color: activeScenarioColor },
          areaStyle: {
            color: "rgba(74, 189, 172, 0.08)",
          },
        });
      }

      option.series = series;
    } else {
      const contributionSeries = scenarioDetails.map((row) => [row.age, row.cumulativeContribution]);
      const growthSeries = scenarioDetails.map((row) => [
        row.age,
        Math.max(row.endBalance - row.cumulativeContribution, 0),
      ]);
      option.series = [
        {
          name: "Contributions",
          type: "line",
          stack: "total",
          areaStyle: {},
          data: contributionSeries,
          smooth: true,
          lineStyle: { width: 0 },
          itemStyle: { color: "#9AA5A0" },
        },
        {
          name: "Growth",
          type: "line",
          stack: "total",
          areaStyle: {},
          data: growthSeries,
          smooth: true,
          lineStyle: { width: 0 },
          itemStyle: { color: "#4ABDAC" },
        },
      ];
    }

    option.series?.forEach((series: any) => {
      series.markLine = {
        data: [
          {
            xAxis: goalAge,
            label: {
              formatter: `Goal Age ${goalAge}`,
              position: "end",
            },
            lineStyle: {
              type: "dashed",
              color: "#FFB74D",
            },
          },
        ],
      };
    });

    return option;
  }, [
    baselineDetails,
    scenarioDetails,
    scenarioDetailByAge,
    currentScenario,
    viewMode,
    showAllScenarios,
    allScenarioSeries,
    activeIndex,
  ]);

  const baselineByAge = useMemo(() => {
    const map = new Map<number, YearDetail>();
    baselineDetails.forEach((detail) => {
      map.set(detail.age, detail);
    });
    return map;
  }, [baselineDetails]);

  const tableData = useMemo(() => {
    return scenarioDetails.slice(1).map((detail) => {
      const baselineRow = baselineByAge.get(detail.age);
      return {
        age: detail.age,
        contribution: detail.contribution,
        returnAmount: detail.returnAmount,
        inflationDrag: detail.inflationDrag,
        endBalance: detail.endBalance,
        delta: detail.endBalance - (baselineRow?.endBalance ?? detail.endBalance),
      };
    });
  }, [scenarioDetails, baselineByAge]);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { headerName: "Age", field: "age", width: 110, sortable: true },
      {
        headerName: "Contribution",
        field: "contribution",
        valueFormatter: ({ value }) => currencyFormatter(value ?? 0),
        sortable: true,
      },
      {
        headerName: "Return",
        field: "returnAmount",
        valueFormatter: ({ value }) => currencyFormatter(value ?? 0),
        sortable: true,
      },
      {
        headerName: "Inflation Drag",
        field: "inflationDrag",
        valueFormatter: ({ value }) => currencyFormatter(value ?? 0),
        sortable: true,
      },
      {
        headerName: "End Balance",
        field: "endBalance",
        valueFormatter: ({ value }) => currencyFormatter(value ?? 0),
        sortable: true,
      },
      {
        headerName: "Δ vs Baseline",
        field: "delta",
        valueFormatter: ({ value }) => currencyFormatter(value ?? 0),
        sortable: true,
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      flex: 1,
    }),
    []
  );

  const getFieldValue = useCallback(
    (fieldId: string): number | string => {
      switch (fieldId) {
        case "scenarioName":
          return currentScenario.name;
        case "age":
          return currentScenario.age;
        case "currentSavings":
          return currentScenario.currentSavings;
        case "income":
          return currentScenario.income;
        case "savingsRate":
          return currentScenario.savingsRate;
        case "expectedReturn":
          return currentScenario.returnRate;
        case "inflation":
          return currentScenario.inflation;
        case "targetAge":
          return currentScenario.targetAge;
        case "targetIncome":
          return currentScenario.targetIncome;
        default:
          return 0;
      }
    },
    [currentScenario]
  );

  const scenarioChips = useMemo(
    () => [
      { id: "baseline", label: "Baseline", chipIndex: 0 },
      ...scenarios.map((scenario, index) => ({
        id: scenario.id,
        label: scenario.name,
        chipIndex: index + 1,
      })),
    ],
    [scenarios]
  );
  const baselineChip = scenarioChips[0];
  const whatIfChips = scenarioChips.slice(1);

  const insightMessage = useMemo(() => {
    const boostedRate = Math.min(currentScenario.savingsRate + 2, 50);
    const boostedLabel = `${boostedRate}%`;
    const boostedDiff = increasedBalance - scenarioFinal;
    return `You're on track to have ${currencyFormatter(scenarioFinal)} at ${currentScenario.targetAge} (${currencyFormatter(deltaFinal)} vs Baseline). Increasing savings to ${boostedLabel} could lift your balance to ${currencyFormatter(increasedBalance)} (${currencyFormatter(boostedDiff)} more).`;
  }, [currentScenario, scenarioFinal, deltaFinal, increasedBalance]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "#F2FBF5" }}>
        <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            top: { xs: theme.spacing(8), md: theme.spacing(9) },
            zIndex: theme.zIndex.appBar - 1,
            backgroundColor: alpha("#F2FBF5", 0.92),
            backdropFilter: "blur(12px)",
          }}
        >
          <Toolbar
            sx={{
              gap: 2,
              flexWrap: { xs: "wrap", md: "nowrap" },
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                minWidth: 0,
                gap: 1.2,
              }}
            >
              <ScenarioButton
                active={activeIndex === baselineChip.chipIndex}
                data-scenario-chip={baselineChip.chipIndex}
                onClick={() => setActiveIndex(baselineChip.chipIndex)}
                fixedWidth={false}
                sx={{ flexShrink: 0 }}
              >
                <span className="scenario-label">{baselineChip.label}</span>
              </ScenarioButton>

              <Box
                sx={{
                  position: "relative",
                  flexGrow: 1,
                  minWidth: 0,
                }}
              >
                {showDesktopNavigation && (
                  <IconButton
                    aria-label="Scroll scenarios left"
                    onClick={() => scrollScenarios("left")}
                    disabled={!scrollState.canScrollLeft}
                    sx={{
                      position: "absolute",
                      left: -12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(255,255,255,0.95)",
                      boxShadow: "0 8px 18px rgba(38, 67, 54, 0.12)",
                      zIndex: 2,
                      "&:hover": { bgcolor: "#FFFFFF" },
                      "&.Mui-disabled": { opacity: 0.35, boxShadow: "none" },
                    }}
                  >
                    <ChevronLeftRoundedIcon />
                  </IconButton>
                )}

                <Box
                  ref={scenarioRailRef}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    overflowX: "auto",
                    overflowY: "hidden",
                    scrollbarWidth: "none",
                    maskImage:
                      showDesktopNavigation && (scrollState.canScrollLeft || scrollState.canScrollRight)
                        ? "linear-gradient(90deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0.9) 36px, rgba(0,0,0,0.9) calc(100% - 36px), rgba(0,0,0,0) 100%)"
                        : undefined,
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollBehavior: "smooth",
                    px: showDesktopNavigation ? 4.5 : 1,
                  }}
                >
                  {whatIfChips.map((chip) => {
                    const isActive = activeIndex === chip.chipIndex;
                    return (
                      <ScenarioButton
                        key={chip.id}
                        data-scenario-chip={chip.chipIndex}
                        active={isActive}
                        onClick={() => setActiveIndex(chip.chipIndex)}
                      >
                        <span className="scenario-label">{chip.label}</span>
                        <Box
                          component="span"
                          role="button"
                          tabIndex={0}
                          aria-label={`Remove ${chip.label}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleRemoveScenario(chip.chipIndex);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              handleRemoveScenario(chip.chipIndex);
                            }
                          }}
                          sx={[
                            {
                              ml: 0.5,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              cursor: "pointer",
                              color: isActive ? "rgba(255,255,255,0.8)" : "rgba(38, 67, 54, 0.55)",
                            },
                            {
                              "&:hover": {
                                backgroundColor: "transparent",
                                color: isActive ? "#FFFFFF" : "rgba(38, 67, 54, 0.8)",
                              },
                            },
                          ]}
                        >
                          <CloseRoundedIcon sx={{ fontSize: 16 }} />
                        </Box>
                      </ScenarioButton>
                    );
                  })}
                </Box>

                {showDesktopNavigation && (
                  <IconButton
                    aria-label="Scroll scenarios right"
                    onClick={() => scrollScenarios("right")}
                    disabled={!scrollState.canScrollRight}
                    sx={{
                      position: "absolute",
                      right: -12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(255,255,255,0.95)",
                      boxShadow: "0 8px 18px rgba(38, 67, 54, 0.12)",
                      zIndex: 2,
                      "&:hover": { bgcolor: "#FFFFFF" },
                      "&.Mui-disabled": { opacity: 0.35, boxShadow: "none" },
                    }}
                  >
                    <ChevronRightRoundedIcon />
                  </IconButton>
                )}
              </Box>
            </Box>

            {showDesktopNavigation ? (
              <IconButton
                aria-label="Add scenario"
                color="primary"
                onClick={handleAddScenario}
                sx={{
                  border: "1.5px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                  borderRadius: "50%",
                  width: 38,
                  height: 38,
                  backgroundColor: "rgba(74, 189, 172, 0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(74, 189, 172, 0.16)",
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            ) : (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddScenario}
                sx={[
                  (theme) => ({
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "6px 18px",
                    borderWidth: 1.5,
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                    color: theme.palette.primary.main,
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }),
                  {
                    "&:hover": {
                      backgroundColor: "rgba(74, 189, 172, 0.1)",
                      borderColor: "rgba(74, 189, 172, 0.5)",
                    },
                  },
                ]}
              >
                Add Scenario
              </Button>
            )}
            <ViewToggle
              value={viewMode}
              exclusive
              onChange={(_, value) => value && setViewMode(value)}
              size="small"
              sx={{ flexShrink: 0 }}
            >
              <ToggleButton value="balance">Balance</ToggleButton>
              <ToggleButton value="breakdown">Breakdown</ToggleButton>
            </ViewToggle>
            <HelpTooltip
              title="View Modes"
              description="Balance plots the total projected account value over time. Breakdown splits the projection into contributions, growth, and inflation drag for deeper context."
              size="small"
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  color="primary"
                  checked={showAllScenarios}
                  onChange={(_, checked) => setShowAllScenarios(checked)}
                  disabled={viewMode !== "balance"}
                />
              }
              sx={{ ml: 1, flexShrink: 0 }}
              labelPlacement="start"
              label={<Typography variant="body2">Show All</Typography>}
            />
            <Stack
              direction="row"
              spacing={1.2}
              sx={{ ml: { xs: 0, md: 1 }, flexShrink: 0 }}
              alignItems="center"
              useFlexGap
            >
              <Button
                variant="contained"
                startIcon={<ContentCopyIcon />}
                onClick={handleCloneScenario}
                disabled={activeIndex === 0}
                sx={[
                  (theme) => ({
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "6px 20px",
                    background: "linear-gradient(135deg, #4ABDAC, #2F8F7C)",
                    boxShadow: "0 10px 24px rgba(74, 189, 172, 0.25)",
                  }),
                  {
                    "&:hover": {
                      background: "linear-gradient(135deg, #3CAFA0, #2A7D6B)",
                      boxShadow: "0 12px 26px rgba(74, 189, 172, 0.3)",
                    },
                    "&.Mui-disabled": {
                      background: "rgba(74, 189, 172, 0.15)",
                      color: "rgba(38, 67, 54, 0.45)",
                      boxShadow: "none",
                    },
                  },
                ]}
              >
                Clone
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container
          maxWidth="xl"
          sx={{
            pt: { xs: 2.5, md: 4 },
            pb: 4,
          }}
        >
          <Box
            sx={{
              mb: 3,
              px: { xs: 2.5, md: 3.5 },
              py: { xs: 2.5, md: 3 },
              borderRadius: 3,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 3 },
              alignItems: { xs: "flex-start", md: "center" },
              background: "linear-gradient(135deg, #E9F7EF 0%, #D9F1E6 100%)",
              boxShadow: "0 16px 32px rgba(38, 67, 54, 0.08)",
            }}
          >
            <Box
              sx={{
                width: { xs: 46, md: 60 },
                height: { xs: 46, md: 60 },
                borderRadius: { xs: "18px", md: "22px" },
                background: "linear-gradient(135deg, rgba(74, 189, 172, 0.18) 0%, rgba(105, 180, 122, 0.28) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(74, 189, 172, 0.28)",
              }}
            >
              <TimelineRoundedIcon
                sx={{ fontSize: { xs: 28, md: 34 }, color: "#2E7D32" }}
              />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#264336",
                  mb: 0.25,
                  fontSize: { xs: "1.4rem", md: "1.85rem" },
                }}
              >
                What-If Scenario Planner
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#3F6B59",
                  maxWidth: 560,
                  lineHeight: 1.5,
                }}
              >
                Compare savings strategies side by side and visualize how different return, savings, and retirement-age choices shape your financial future.
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  height: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(74, 189, 172, 0.18)",
                  boxShadow: "0 12px 32px rgba(38, 67, 54, 0.08)",
                }}
              >
                <Stack spacing={2}>
                  {scenarioGroups.map((group) => (
                    <Accordion key={group.id} defaultExpanded disableGutters elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {group.title}
                          </Typography>
                          {group.description ? (
                            <Typography variant="body2" color="text.secondary">
                              {group.description}
                            </Typography>
                          ) : null}
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        {group.fields.map((fieldId) => {
                          const field = fieldDefinitions.get(fieldId);
                          if (!field) return null;
                          return (
                            <SchemaFieldControl
                              key={field.id}
                              field={field}
                              value={getFieldValue(field.id)}
                              onChange={(newValue) => handleFieldChange(field.id, newValue)}
                              formState={currentFormState}
                            />
                          );
                        })}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                  <Divider />
                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveScenario}
                    >
                      Save Scenario
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ReplayIcon />}
                      onClick={handleResetScenario}
                    >
                      Reset
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(74, 189, 172, 0.12)",
                    boxShadow: "0 12px 28px rgba(38, 67, 54, 0.06)",
                  }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Projection Comparison
                  </Typography>
                  <ReactECharts option={chartOption} notMerge style={{ height: 360 }} />
                </Paper>

                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, backgroundColor: theme.palette.mode === "light" ? "rgba(74, 189, 172, 0.08)" : "rgba(74, 189, 172, 0.18)" }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Insight
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {insightMessage}
                  </Typography>
                </Paper>

                <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Year-by-Year Comparison
                  </Typography>
                  <div
                    className="ag-theme-quartz"
                    style={{ height: 360, width: "100%" }}
                  >
                    <AgGridReact
                      rowData={tableData}
                      columnDefs={columnDefs}
                      defaultColDef={defaultColDef}
                      getRowStyle={(params) =>
                        params.node.rowIndex !== null && params.node.rowIndex % 2 === 0
                          ? { backgroundColor: theme.palette.mode === "light" ? "rgba(48,64,58,0.03)" : "rgba(48,64,58,0.12)" }
                          : undefined
                      }
                      animateRows
                    />
                  </div>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>

        <Snackbar
          open={snackbar.open}
          onClose={() => setSnackbar({ open: false, message: "" })}
          autoHideDuration={3000}
          message={snackbar.message}
        />
      </Box>
    </ThemeProvider>
  );
};

export default WhatIfPlanner;
