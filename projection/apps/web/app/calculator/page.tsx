"use client";

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import { useMutation } from "@tanstack/react-query";
import { useProjectionStore } from "@projection/core";
import { COLORS } from "@projection/shared";
import { useUser } from "../../contexts/UserContext";
import { DeterministicForm } from "../../components/DeterministicForm";
import { HelpTooltip } from "../../components/HelpTooltip";
import { helpContent } from "../../lib/helpContent";

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
  } = useProjectionStore();
  const { addScenario, canAddScenario, getTierFeatures } = useUser();
  const tierFeatures = getTierFeatures();
  const router = useRouter();

  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [series, setSeries] = useState<any[]>([]);

  const [age, setAge] = useState(input?.age ?? 30);
  const [retireAge, setRetireAge] = useState(input?.retireAge ?? 65);
  const [balance, setBalance] = useState(input?.balance ?? 50000);
  const [contribution, setContribution] = useState(input?.contribution ?? 10000);
  const [rate, setRate] = useState(input?.rate ?? 7);
  const [inflation, setInflation] = useState(input?.inflation ?? 2.5);
  const [shouldAutoCalculate, setShouldAutoCalculate] = useState(false);
  const [autoCalcParams, setAutoCalcParams] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const urlAge = params.get("age");
    const urlBalance = params.get("balance");
    const urlContribution = params.get("contribution");
    const urlRate = params.get("rate");
    const urlInflation = params.get("inflation");
    const urlRetireAge = params.get("retireAge");
    const fromDefaults = params.get("fromDefaults");

    if (urlAge || urlBalance || urlContribution || urlRate) {
      const ageNum = urlAge ? Number(urlAge) : 30;
      const balanceNum = urlBalance ? Number(urlBalance) : 100000;
      const contributionNum = urlContribution ? Number(urlContribution) : 15000;
      const rateNum = urlRate ? Number(urlRate) : 7;
      const inflationNum = urlInflation ? Number(urlInflation) : 2.5;
      const retireAgeNum = urlRetireAge ? Number(urlRetireAge) : 65;

      setAge(ageNum);
      setBalance(balanceNum);
      setContribution(contributionNum);
      setRate(rateNum);
      setInflation(inflationNum);
      setRetireAge(retireAgeNum);

      if (fromDefaults === "true") {
        setAutoCalcParams({
          age: ageNum,
          retireAge: retireAgeNum,
          balance: balanceNum,
          contribution: contributionNum,
          rate: rateNum,
          inflation: inflationNum,
        });
        setShouldAutoCalculate(true);
      } else {
        setInput({
          age: ageNum,
          retireAge: retireAgeNum,
          balance: balanceNum,
          contribution: contributionNum,
          rate: rateNum / 100,
          inflation: inflationNum / 100,
        });
      }
    }
  }, [setInput]);

  const mutation = useMutation({
    mutationFn: async (payload: {
      initialBalance: number;
      annualContribution: number;
      years: number;
      annualReturn: number;
      inflation: number;
    }) => {
      setLoading(true);
      const res = await fetch("http://localhost:8000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Failed to fetch projection");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
      setLoading(false);
      setSeries([
        { name: "Nominal Balance", type: "line", data: data.nominalBalances },
        { name: "Real Balance", type: "line", data: data.realBalances },
      ]);
      lastSubmittedRef.current = {
        age,
        retireAge,
        balance,
        contribution,
        rate,
        inflation,
      };
    },
    onError: () => {
      setResult(null);
      setLoading(false);
      setSeries([]);
    },
  });

  const lastSubmittedRef = useRef<{
    age: number;
    retireAge: number;
    balance: number;
    contribution: number;
    rate: number;
    inflation: number;
  } | null>(null);

  useEffect(() => {
    if (shouldAutoCalculate && autoCalcParams) {
      const years = autoCalcParams.retireAge - autoCalcParams.age;
      setInput(autoCalcParams);
      mutation.mutate({
        initialBalance: autoCalcParams.balance,
        annualContribution: autoCalcParams.contribution,
        years,
        annualReturn: autoCalcParams.rate / 100,
        inflation: autoCalcParams.inflation / 100,
      });
      setShouldAutoCalculate(false);
    }
  }, [shouldAutoCalculate, autoCalcParams, mutation, setInput]);

  useEffect(() => {
    if (!result || !lastSubmittedRef.current) {
      return;
    }

    const debounceTimer = setTimeout(() => {
      const last = lastSubmittedRef.current!;
      const paramsChanged =
        rate !== last.rate ||
        inflation !== last.inflation ||
        age !== last.age ||
        retireAge !== last.retireAge ||
        balance !== last.balance ||
        contribution !== last.contribution;

      if (paramsChanged) {
        const years = retireAge - age;
        mutation.mutate({
          initialBalance: balance,
          annualContribution: contribution,
          years,
          annualReturn: rate / 100,
          inflation: inflation / 100,
        });
        lastSubmittedRef.current = {
          age,
          retireAge,
          balance,
          contribution,
          rate,
          inflation,
        };
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [age, retireAge, balance, contribution, rate, inflation, result, mutation]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const years = retireAge - age;
    const payload = {
      age,
      retireAge,
      balance,
      contribution,
      rate,
      inflation,
    };
    setInput(payload);

    lastSubmittedRef.current = {
      age,
      retireAge,
      balance,
      contribution,
      rate,
      inflation,
    };

    mutation.mutate({
      initialBalance: balance,
      annualContribution: contribution,
      years,
      annualReturn: rate / 100,
      inflation: inflation / 100,
    });
  };

  const handleSaveScenario = () => {
    if (!canAddScenario()) {
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
        contribution: contribution / 1000,
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

  const chartOptions = useMemo(
    () => ({
      tooltip: {
        trigger: "axis" as const,
        valueFormatter: (value: number) =>
          value != null
            ? `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
            : "",
      },
      legend: { data: ["Nominal Balance", "Real Balance"] },
      xAxis: {
        type: "category" as const,
        data: Array.from({ length: Math.max(retireAge - age + 1, 0) }, (_, i) => age + i),
        name: "Age",
      },
      yAxis: {
        type: "value" as const,
        name: "Balance ($)",
        axisLabel: {
          formatter: (value: number) =>
            `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        },
      },
      series,
    }),
    [age, retireAge, series],
  );

  return (
    <Box
      sx={{
        backgroundColor: "#F2FBF5",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            mb: 3,
            px: { xs: 2.5, md: 3.5 },
            py: { xs: 2.5, md: 3 },
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            gap: { xs: 2, md: 3 },
            background: "linear-gradient(135deg, #E9F7EF 0%, #D9F1E6 100%)",
            boxShadow: "0 16px 32px rgba(38, 67, 54, 0.08)",
          }}
        >
          <Box
            sx={{
              width: { xs: 46, md: 60 },
              height: { xs: 46, md: 60 },
              borderRadius: { xs: "18px", md: "22px" },
              background: "linear-gradient(135deg, rgba(105, 180, 122, 0.2) 0%, rgba(74, 189, 172, 0.28) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(74, 189, 172, 0.3)",
            }}
          >
            <CalculateRoundedIcon
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
            401(k) Projection Calculator
          </Typography>
            <Typography variant="body1" sx={{ color: "#3F6B59", maxWidth: 520, lineHeight: 1.5 }}>
              Explore deterministic projections to understand how your retirement savings grow over
              time while staying mindful of today’s dollars.
            </Typography>
          </Box>
        </Box>

        <Card
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 3,
            boxShadow: "0 18px 40px rgba(38, 67, 54, 0.08)",
            border: "1px solid rgba(74, 189, 172, 0.2)",
            p: { xs: 2, md: 4 },
          }}
        >
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
            onOpenWhatIf={handleOpenWhatIf}
          />

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress />
            </Box>
          )}
        </Card>

        {mutation.isError && (
          <Alert severity="error" sx={{ my: 2 }}>
            Error fetching projection. Please try again.
          </Alert>
        )}

        {series.length > 0 && !loading && (
          <Box sx={{ mb: 3 }}>
            <ReactECharts option={chartOptions} style={{ height: 300 }} />
          </Box>
        )}

        {result && !loading && (
          <Box sx={{ mt: 2 }}>
            <Card
              variant="outlined"
              sx={{
                backgroundColor: COLORS.cardBackground,
                borderColor: COLORS.cardBorder,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: COLORS.textPrimary, fontWeight: 600 }}>
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: COLORS.textSecondary, fontWeight: 600 }}>
                        Real (Today's $)
                      </Typography>
                      <HelpTooltip
                        title={helpContent.general.realDollars.title}
                        description={helpContent.general.realDollars.description}
                        size="small"
                      />
                    </Box>
                    <Typography variant="h5" sx={{ color: COLORS.textPrimary, fontWeight: 700 }}>
                      $
                      {result.realBalances
                        .at(-1)
                        ?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? "0"}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 0.5, color: COLORS.textTertiary }}
                    >
                      Reflects today's buying power with your inflation assumption.
                    </Typography>
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: COLORS.textSecondary, fontWeight: 600 }}>
                        Nominal (Future $)
                      </Typography>
                      <HelpTooltip
                        title={helpContent.general.nominalDollars.title}
                        description={helpContent.general.nominalDollars.description}
                        size="small"
                      />
                    </Box>
                    <Typography variant="h6" sx={{ color: COLORS.textPrimary }}>
                      $
                      {result.nominalBalances
                        .at(-1)
                        ?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? "0"}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 0.5, color: COLORS.textTertiary }}
                    >
                      Future dollars before adjusting for inflation.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveScenario}
                sx={{
                  backgroundColor: COLORS.buttonSecondary,
                  "&:hover": { backgroundColor: COLORS.buttonSecondaryHover },
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Save as Baseline
              </Button>
              <Button
                variant="outlined"
                startIcon={<CompareArrowsIcon />}
                onClick={handleOpenWhatIf}
                sx={{
                  borderColor: COLORS.buttonPrimary,
                  color: COLORS.buttonPrimary,
                  "&:hover": {
                    borderColor: COLORS.buttonPrimaryHover,
                    backgroundColor: `${COLORS.buttonPrimary}15`,
                  },
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Open What-If Simulator
              </Button>
            </Stack>
          </Box>
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />

    </Box>
  );
}
