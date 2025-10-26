/**
 * DeterministicForm (Web)
 * Renders deterministic calculator inputs using the shared UI schema.
 */

import React, { FormEvent, useMemo, useCallback } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import {
  getFieldDefinition,
  getScreenDefinition,
  ScreenDefinition,
} from "@projection/shared";
import { SchemaFieldControl } from "./SchemaFieldControl";

interface DeterministicFormProps {
  age: number;
  setAge: (value: number) => void;
  retireAge: number;
  setRetireAge: (value: number) => void;
  balance: number;
  setBalance: (value: number) => void;
  contribution: number;
  setContribution: (value: number) => void;
  rate: number;
  setRate: (value: number) => void;
  inflation: number;
  setInflation: (value: number) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  error?: string;
  onSaveScenario?: () => void;
  onOpenWhatIf?: () => void;
}

const deterministicScreen: ScreenDefinition = getScreenDefinition("deterministic");

export const DeterministicForm: React.FC<DeterministicFormProps> = ({
  age,
  setAge,
  retireAge,
  setRetireAge,
  balance,
  setBalance,
  contribution,
  setContribution,
  rate,
  setRate,
  inflation,
  setInflation,
  onSubmit,
  loading = false,
  error,
  onSaveScenario,
  onOpenWhatIf,
}) => {
  const formState = useMemo(
    () => ({
      age,
      retirementAge: retireAge,
      currentBalance: balance,
      contribution,
      expectedReturn: rate,
      inflation,
    }),
    [age, retireAge, balance, contribution, rate, inflation]
  );

  const handleFieldChange = useCallback(
    (fieldId: string, nextValue: number | string) => {
      const numericValue = typeof nextValue === "string" ? Number(nextValue) : nextValue;
      switch (fieldId) {
        case "age":
          setAge(Number(numericValue));
          break;
        case "retirementAge":
          setRetireAge(Number(numericValue));
          break;
        case "currentBalance":
          setBalance(Number(numericValue));
          break;
        case "contribution":
          setContribution(Number(numericValue));
          break;
        case "expectedReturn":
          setRate(Number(numericValue));
          break;
        case "inflation":
          setInflation(Number(numericValue));
          break;
        default:
          break;
      }
    },
    [setAge, setRetireAge, setBalance, setContribution, setRate, setInflation]
  );
  const submitLabel = deterministicScreen.submitButtonLabel ?? "Calculate";
  const whatIfButton = deterministicScreen.buttons?.find((btn) => btn.id === "whatif");

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mb: 3, mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {deterministicScreen.sections.map((section) => {
        const layout = section.layout ?? "vertical";
        const SectionWrapper =
          layout === "horizontal"
            ? ({ children }: { children: React.ReactNode }) => (
                <Grid container spacing={2}>{children}</Grid>
              )
            : ({ children }: { children: React.ReactNode }) => (
                <Stack spacing={2}>{children}</Stack>
              );

        return (
          <Box key={section.id} sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#30403A",
                mb: 2,
                fontSize: "1rem",
              }}
            >
              {section.title}
            </Typography>
            {section.description && (
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(48, 64, 58, 0.7)",
                  mb: 2,
                  fontSize: "0.875rem",
                }}
              >
                {section.description}
              </Typography>
            )}

            <SectionWrapper>
              {section.fields.map((fieldId) => {
                const fieldDef = getFieldDefinition(fieldId);
                const value = (() => {
                  switch (fieldDef.id) {
                    case "age":
                      return age;
                    case "retirementAge":
                      return retireAge;
                    case "currentBalance":
                      return balance;
                    case "contribution":
                      return contribution;
                    case "expectedReturn":
                      return rate;
                    case "inflation":
                      return inflation;
                    default:
                      return 0;
                  }
                })();

                const control = (
                  <SchemaFieldControl
                    field={fieldDef}
                    value={value}
                    onChange={(next) => handleFieldChange(fieldDef.id, next)}
                    formState={formState}
                  />
                );

                if (layout === "horizontal") {
                  return (
                    <Grid item xs={12} sm={6} key={`${section.id}-${fieldDef.id}`}>
                      {control}
                    </Grid>
                  );
                }

                return (
                  <Box key={`${section.id}-${fieldDef.id}`}>
                    {control}
                  </Box>
                );
              })}
            </SectionWrapper>
          </Box>
        );
      })}

      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading}
          sx={{
            backgroundColor: "#69B47A",
            color: "#FFFFFF",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { backgroundColor: "#5A9D6D" },
            "&:disabled": { backgroundColor: "rgba(105, 180, 122, 0.5)" },
          }}
        >
          {loading ? "Calculating..." : submitLabel}
        </Button>

        {onOpenWhatIf && whatIfButton && (
          <Button
            variant="outlined"
            startIcon={<CompareArrowsIcon />}
            onClick={onOpenWhatIf}
            sx={{
              borderColor: "#4ABDAC",
              color: "#4ABDAC",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(74, 189, 172, 0.08)",
              },
            }}
          >
            {whatIfButton.label}
          </Button>
        )}

        {onSaveScenario && (
          <Button
            variant="text"
            onClick={onSaveScenario}
            sx={{
              color: "#69B47A",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(105, 180, 122, 0.08)",
              },
            }}
          >
            Save as Scenario
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default DeterministicForm;
