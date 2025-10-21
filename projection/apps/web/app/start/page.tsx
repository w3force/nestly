"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  getScreenDefinition,
  ScreenDefinition,
} from "@projection/shared";
import { ScreenRenderer, SectionRendererMap, CustomComponentRendererMap } from "../../components/ScreenRenderer";
import QuickStartSection, {
  QuickStartInputMetadata,
  QuickStartResultsMetadata,
  QuickStartStrategyMetadata,
  QuickStartReadinessLevel,
} from "../../components/QuickStartSection";
import { useUser } from "../../contexts/UserContext";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] },
} as const;

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, ease: "easeOut" as const, delay: 0.2 },
} as const;

const float = {
  animate: {
    y: [0, -18, 0],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const landingScreen: ScreenDefinition = getScreenDefinition("landing");

const routeMap: Record<string, string> = {
  deterministic: "/calculator",
  whatif: "/what-if",
  monteCarlo: "/upgrade",
  profile: "/profile",
  start: "/start",
  upgrade: "/upgrade",
};

function resolveRoute(id?: string): string {
  if (!id) return "/";
  return routeMap[id] ?? `/${id}`;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export default function StartPage(): JSX.Element {
  const { setUser } = useUser();

  const heroRenderer = useMemo(() => {
    const heroSection =
      landingScreen.sections.find((section) => section.id === "hero") ?? landingScreen.sections[0];
    const heroMeta = (heroSection.metadata as Record<string, unknown>) ?? {};
    const heroTitle =
      (typeof heroMeta.heroTitle === "string" && heroMeta.heroTitle.trim().length > 0
        ? (heroMeta.heroTitle as string)
        : heroSection.title) ?? "Nestly";
    const heroTagline =
      (typeof heroMeta.heroTagline === "string" && heroMeta.heroTagline.trim().length > 0
        ? (heroMeta.heroTagline as string)
        : heroSection.description) ?? "";
    const heroDescription =
      (typeof heroMeta.heroDescription === "string" && heroMeta.heroDescription.trim().length > 0
        ? (heroMeta.heroDescription as string)
        : "Plan your retirement with projections, simulations, and healthcare planning tools.");
    const primaryCTA =
      (typeof heroMeta.primaryCTA === "string" && heroMeta.primaryCTA.trim().length > 0
        ? (heroMeta.primaryCTA as string)
        : "Try Without Sign-In");
    const secondaryCTA =
      typeof heroMeta.secondaryCTA === "string" && heroMeta.secondaryCTA.trim().length > 0
        ? (heroMeta.secondaryCTA as string)
        : "Sign In / Create Account";
    const guestWelcome =
      typeof heroMeta.guestWelcome === "string" && heroMeta.guestWelcome.trim().length > 0
        ? (heroMeta.guestWelcome as string)
        : undefined;
    const secondaryLink =
      typeof heroMeta.secondaryLink === "string" && heroMeta.secondaryLink.trim().length > 0
        ? (heroMeta.secondaryLink as string)
        : "/auth";

    const handleGuestMode = () => {
      setUser({
        tier: "free",
        isGuest: true,
      });
    };

    return () => (
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Stack spacing={{ xs: 4, md: 5 }} alignItems="center" textAlign="center">
          <motion.div initial={fadeInUp.initial} animate={fadeInUp.animate} transition={{ ...fadeInUp.transition, delay: 0 }}>
            <Box
              sx={{
                width: 104,
                height: 104,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #69B47A 0%, #4ABDAC 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 12px 40px rgba(105, 180, 122, 0.28)",
                fontSize: "3.2rem",
              }}
            >
              🪺
            </Box>
          </motion.div>

          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={{ ...fadeInUp.transition, delay: 0.1 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "3rem", md: "4rem" },
                background: "linear-gradient(135deg, #69B47A 0%, #4ABDAC 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              {heroTitle}
            </Typography>
          </motion.div>

          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
                color: "#30403A",
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                maxWidth: "34ch",
                lineHeight: 1.4,
              }}
            >
              {heroTagline}
            </Typography>
          </motion.div>

          <motion.div initial={fadeIn.initial} animate={fadeIn.animate} transition={fadeIn.transition}>
            <Typography
              variant="body1"
              sx={{
                maxWidth: "48ch",
                color: "rgba(48, 64, 58, 0.8)",
                fontSize: { xs: "1rem", md: "1.15rem" },
                lineHeight: 1.7,
              }}
            >
              {heroDescription}
            </Typography>
          </motion.div>

          {guestWelcome && (
            <motion.div initial={fadeIn.initial} animate={fadeIn.animate} transition={{ ...fadeIn.transition, delay: 0.2 }}>
              <Box
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  backgroundColor: "rgba(105, 180, 122, 0.1)",
                  border: "1px solid rgba(105, 180, 122, 0.3)",
                }}
              >
                <Typography variant="body2" color="#30403A" fontWeight={500}>
                  {guestWelcome}
                </Typography>
              </Box>
            </motion.div>
          )}

          <motion.div
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ ...fadeIn.transition, delay: 0.3 }}
            style={{ width: "100%" }}
          >
            <Stack spacing={2} sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
              <Button
                component={Link}
                href="/?mode=guest"
                onClick={handleGuestMode}
                variant="contained"
                size="large"
                sx={{
                  py: 1.75,
                  fontSize: "1.05rem",
                  borderRadius: 99,
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: "#69B47A",
                  boxShadow: "0 10px 28px rgba(105, 180, 122, 0.3)",
                  ":hover": {
                    backgroundColor: "#5AA468",
                    boxShadow: "0 14px 32px rgba(105, 180, 122, 0.38)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {primaryCTA}
              </Button>

              <Button
                component={Link}
                href={secondaryLink}
                variant="outlined"
                size="large"
                sx={{
                  py: 1.75,
                  fontSize: "1.05rem",
                  borderRadius: 99,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "#69B47A",
                  color: "#69B47A",
                  borderWidth: 2,
                  ":hover": {
                    borderWidth: 2,
                    borderColor: "#5AA468",
                    backgroundColor: "rgba(105, 180, 122, 0.05)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {secondaryCTA}
              </Button>
            </Stack>
          </motion.div>
        </Stack>
      </Container>
    );
  }, [setUser]);

  const featureRenderer = useMemo<SectionRendererMap["feature-cards"]>(() => {
    return ({ section }) => {
      const featureItems: Array<Record<string, any>> = Array.isArray(section.metadata?.items)
        ? (section.metadata?.items as Array<Record<string, any>>)
        : [];

      const iconColorMap: Record<string, string> = {
        deterministic: "#69B47A",
        whatif: "#4ABDAC",
        montecarlo: "#FFD54F",
      };

      return (
        <Container maxWidth="lg">
          <Stack spacing={1.5} sx={{ mb: 3, textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#30403A" }}>
              {section.title ?? "Choose Your Analysis Method"}
            </Typography>
            {section.description && (
              <Typography variant="body1" sx={{ color: "rgba(48, 64, 58, 0.65)", maxWidth: "60ch", mx: "auto" }}>
                {section.description}
              </Typography>
            )}
          </Stack>

          <Grid container spacing={3}>
            {featureItems.map((item) => {
              const route = resolveRoute(item.navigateTo ?? item.id);
              const isPremium = item.badge === "PREMIUM";
              const color = item.themeColor ?? iconColorMap[item.id] ?? "#69B47A";

              return (
                <Grid item xs={12} md={4} key={item.id ?? route}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      backgroundColor: "rgba(255,255,255,0.92)",
                      borderColor: "rgba(74, 189, 172, 0.15)",
                      borderRadius: 3,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h6" sx={{ color: "#30403A", fontWeight: 700 }}>
                          {item.title}
                        </Typography>
                        {isPremium && (
                          <Chip
                            label={item.badge}
                            size="small"
                            sx={{
                              height: 22,
                              fontWeight: 700,
                              background: "#FFD54F",
                              color: "#1A1A1A",
                            }}
                          />
                        )}
                      </Box>
                      <Typography sx={{ color: "rgba(48,64,58,0.72)", flexGrow: 1 }}>{item.description}</Typography>
                      <Button
                        component={Link}
                        href={route}
                        variant="outlined"
                        sx={{
                          borderColor: color,
                          color,
                          fontWeight: 600,
                          textTransform: "none",
                          ":hover": {
                            borderColor: color,
                            backgroundColor: "rgba(74, 189, 172, 0.08)",
                          },
                        }}
                      >
                        {item.cta ?? "Open"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      );
    };
  }, []);

  const sectionRenderers: SectionRendererMap = useMemo(
    () => ({
      hero: () => heroRenderer(),
      "feature-cards": featureRenderer,
    }),
    [featureRenderer, heroRenderer]
  );

  const customComponentRenderers: CustomComponentRendererMap = useMemo(
    () => ({
      QuickStart: (_context, metadata) => (
        <QuickStartSection
          title={(metadata.title as string) ?? undefined}
          subtitle={(metadata.subtitle as string) ?? undefined}
          description={(metadata.description as string) ?? undefined}
          ctaLabel={(metadata.ctaLabel as string) ?? undefined}
          footnote={(metadata.footnote as string) ?? undefined}
          readinessMessages={
            isRecord(metadata.readinessMessages)
              ? (metadata.readinessMessages as Partial<Record<QuickStartReadinessLevel, string>>)
              : undefined
          }
          inputLabels={
            isRecord(metadata.inputLabels)
              ? (metadata.inputLabels as QuickStartInputMetadata)
              : undefined
          }
          strategyMetadata={
            isRecord(metadata.strategy)
              ? (metadata.strategy as QuickStartStrategyMetadata)
              : undefined
          }
          resultsMetadata={
            isRecord(metadata.results)
              ? (metadata.results as QuickStartResultsMetadata)
              : undefined
          }
        />
      ),
    }),
    []
  );

  const heroFooter =
    landingScreen.sections.find((section) => section.id === "hero")?.metadata?.footerNote || "Free forever • No credit card required";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F5F5F5 0%, #E8F5E9 50%, #F1F8F4 100%)",
        pb: { xs: 6, md: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        component={motion.div}
        {...float}
        sx={{
          position: "absolute",
          top: "8%",
          right: "10%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(105, 180, 122, 0.12), transparent)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <Box
        component={motion.div}
        animate={{
          y: [0, 26, 0],
          transition: {
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        sx={{
          position: "absolute",
          bottom: "12%",
          left: "6%",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74, 189, 172, 0.12), transparent)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <Stack spacing={{ xs: 5, md: 8 }} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
        <ScreenRenderer
          screen={landingScreen}
          sectionRenderers={sectionRenderers}
          customComponentRenderers={customComponentRenderers}
        />
        <Typography variant="caption" sx={{ color: "rgba(48,64,58,0.55)", textAlign: "center" }}>
          {heroFooter}
        </Typography>
      </Stack>
    </Box>
  );
}
