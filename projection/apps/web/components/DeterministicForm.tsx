/**
 * DeterministicForm (Web)
 * Renders deterministic calculator inputs using the shared UI schema.
 */

import React, { FormEvent, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { ContributionSlider } from "./ContributionSlider";
import { ReturnRateSlider } from "./ReturnRateSlider";
import { InflationSlider } from "./InflationSlider";
import { HelpTooltip } from "./HelpTooltip";
import { helpContent } from "../lib/helpContent";
import {
  getFieldDefinition,
  getScreenDefinition,
  InputFieldDefinition,
  ScreenDefinition,
} from "@projection/shared";

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

type HelpTopicKey =
  | "currentAge"
  | "retirementAge"
  | "currentBalance"
  | "annualContribution"
  | "expectedReturn"
  | "inflation";

const HELP_TOPIC_MAP: Record<string, HelpTopicKey> = {
  age_help: "currentAge",
  retirement_age_help: "retirementAge",
  current_balance_help: "currentBalance",
  annual_contribution_help: "annualContribution",
  expected_return_help: "expectedReturn",
  inflation_help: "inflation",
};

const deterministicScreen: ScreenDefinition = getScreenDefinition("deterministic");

interface FieldBinding {
  value: number;
  onChange: (value: number) => void;
}

const currencyFormatter = (value: number) =>
  value.toLocaleString(undefined, { maximumFractionDigits: 0 });

function renderTextField(
  field: InputFieldDefinition,
  binding: FieldBinding,
  adornment?: "currency"
) {
  const helpTopic = field.helpTopicId ? HELP_TOPIC_MAP[field.helpTopicId] : undefined;
  const helper =
    helpTopic && helpContent.calculator[helpTopic]
      ? helpContent.calculator[helpTopic]
      : undefined;

  return (
    <TextField
      key={field.id}
      label={
        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
          {field.label}
          {helper && (
            <HelpTooltip
              title={helper.title}
              description={helper.description}
              size="small"
              placement="right"
            />
          )}
        </Box>
      }
      type="number"
      value={binding.value}
      onChange={(e) => binding.onChange(Number(e.target.value))}
      inputProps={{
        min: field.constraints.min,
        max: field.constraints.max,
        step: field.constraints.step,
      }}
      fullWidth
      size="small"
      variant="outlined"
      InputProps={
        adornment === "currency"
          ? {
              startAdornment: "$",
            }
          : undefined
      }
    />
  );
}

function renderSliderField(
  field: InputFieldDefinition,
  binding: FieldBinding,
  context: {
    age: number;
    webDefaults?: Record<string, any>;
  }
) {
  const helpTopic = field.helpTopicId ? HELP_TOPIC_MAP[field.helpTopicId] : undefined;
  const helper =
    helpTopic && helpContent.calculator[helpTopic]
      ? helpContent.calculator[helpTopic]
      : undefined;

  if (field.id === "contribution") {
    return (
      <ContributionSlider
        key={field.id}
        age={context.age}
        value={binding.value}
        onChange={binding.onChange}
        field={field}
        platformDefaults={context.webDefaults}
        help={
          helper && {
            title: helper.title,
            description: helper.description,
          }
        }
      />
    );
  }

  if (field.id === "expectedReturn") {
    return (
      <ReturnRateSlider
        key={field.id}
        value={binding.value}
        onChange={binding.onChange}
        field={field}
        platformDefaults={context.webDefaults}
        help={
          helper && {
            title: helper.title,
            description: helper.description,
          }
        }
      />
    );
  }

  if (field.id === "inflation") {
    return (
      <InflationSlider
        key={field.id}
        value={binding.value}
        onChange={binding.onChange}
        field={field}
        platformDefaults={context.webDefaults}
        help={
          helper && {
            title: helper.title,
            description: helper.description,
          }
        }
      />
    );
  }

  return null;
}

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
  const bindings: Record<string, FieldBinding> = useMemo(
    () => ({
      age: { value: age, onChange: setAge },
      retirementAge: { value: retireAge, onChange: setRetireAge },
      currentBalance: { value: balance, onChange: setBalance },
      contribution: { value: contribution, onChange: setContribution },
      expectedReturn: { value: rate, onChange: setRate },
      inflation: { value: inflation, onChange: setInflation },
    }),
    [age, retireAge, balance, contribution, rate, inflation, setAge, setRetireAge, setBalance, setContribution, setRate, setInflation]
  );

  const webDefaults = deterministicScreen.platformVariants?.web?.sliderDefaults;
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
                const binding = bindings[fieldId];
                if (!binding) {
                  return null;
                }

                const fieldDef = getFieldDefinition(fieldId);
                const isCurrencyField = fieldDef.id === "currentBalance";
                const key = `${section.id}-${fieldDef.id}`;

                if (fieldDef.type === "slider") {
                  const slider = renderSliderField(fieldDef, binding, {
                    age,
                    webDefaults,
                  });
                  if (!slider) return null;

                  return layout === "horizontal" ? (
                    <Grid item xs={12} key={key}>
                      {slider}
                    </Grid>
                  ) : (
                    <Box key={key}>{slider}</Box>
                  );
                }

                const fieldNode = renderTextField(fieldDef, binding, isCurrencyField ? "currency" : undefined);
                return layout === "horizontal" ? (
                  <Grid item xs={12} sm={6} key={key}>
                    {fieldNode}
                  </Grid>
                ) : (
                  <Box key={key}>{fieldNode}</Box>
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
