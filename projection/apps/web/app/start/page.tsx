"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
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
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

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

const HERO_ICON_SOURCE_MAP: Record<string, string> = {
  "nestly-default": "/icon-192x192.png",
  favicon: "/favicon-96x96.png",
};

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
  const heroSectionBase =
    landingScreen.sections.find((section) => section.id === "hero") ?? landingScreen.sections[0];
  const heroMetaBase = (heroSectionBase?.metadata as Record<string, unknown>) ?? {};
  const metaHeroIconBase = heroMetaBase.heroIcon;
  const heroIconKey =
    typeof metaHeroIconBase === "string" && metaHeroIconBase.trim().length > 0 ? metaHeroIconBase.trim() : undefined;
  const heroIconSrc =
    heroIconKey && heroIconKey.startsWith("/")
      ? heroIconKey
      : HERO_ICON_SOURCE_MAP[heroIconKey ?? ""] ?? "/icon-192x192.png";

  const heroRenderer = useMemo(() => {
    const heroSection = heroSectionBase;
    const heroMeta = heroMetaBase;
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
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            px: { xs: 3, sm: 4, md: 6 },
            py: { xs: 4, md: 6 },
            borderRadius: "36px",
            background: "linear-gradient(135deg, rgba(233, 247, 239, 0.98) 0%, rgba(217, 241, 230, 0.99) 100%)",
            border: "1px solid rgba(74, 189, 172, 0.22)",
            boxShadow: "0 26px 72px rgba(74, 189, 172, 0.25)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 320,
              height: 320,
              top: -140,
              right: -130,
              background: "radial-gradient(circle, rgba(74,189,172,0.35) 0%, rgba(74,189,172,0) 70%)",
              opacity: 0.55,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 260,
              height: 260,
              bottom: -120,
              left: -90,
              background: "radial-gradient(circle, rgba(105,180,122,0.32) 0%, rgba(105,180,122,0) 76%)",
              opacity: 0.55,
            }}
          />

          <Stack spacing={{ xs: 1, md: 1.8 }} alignItems="center" textAlign="center">
            <motion.div initial={fadeInUp.initial} animate={fadeInUp.animate} transition={{ ...fadeInUp.transition, delay: 0 }}>
              <Box
                sx={{
                  width: 92,
                  height: 92,
                  borderRadius: "26px",
                  background: "linear-gradient(135deg, rgba(74, 189, 172, 0.18) 0%, rgba(105, 180, 122, 0.25) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 16px 32px rgba(74, 189, 172, 0.24)",
                  border: "1px solid rgba(74, 189, 172, 0.25)",
                  backdropFilter: "blur(6px)",
                  mt: { xs: -0.5, md: -1 },
                }}
              >
                <Image
                  src={heroIconSrc}
                  alt="Nestly planner icon"
                  width={60}
                  height={60}
                  style={{ borderRadius: "18px" }}
                  priority
                />
              </Box>
            </motion.div>

            <motion.div initial={fadeInUp.initial} animate={fadeInUp.animate} transition={{ ...fadeInUp.transition, delay: 0.08 }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2.55rem", md: "3.5rem" },
                  background: "linear-gradient(135deg, #264336 0%, #3F6B59 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
              >
                {heroTitle}
              </Typography>
            </motion.div>

            <motion.div initial={fadeInUp.initial} animate={fadeInUp.animate} transition={{ ...fadeInUp.transition, delay: 0.14 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "#2C5F50",
                  fontSize: { xs: "1.15rem", md: "1.45rem" },
                  maxWidth: "38ch",
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
                  maxWidth: "54ch",
                  color: "rgba(38, 67, 54, 0.78)",
                  fontSize: { xs: "0.98rem", md: "1.08rem" },
                  lineHeight: 1.55,
                }}
              >
                {heroDescription}
              </Typography>
            </motion.div>

            {guestWelcome && (
              <motion.div initial={fadeIn.initial} animate={fadeIn.animate} transition={{ ...fadeIn.transition, delay: 0.25 }}>
                <Box
                  sx={{
                    px: { xs: 2.5, md: 3 },
                    py: 1.5,
                    borderRadius: "999px",
                    backgroundColor: "rgba(74, 189, 172, 0.12)",
                    border: "1px solid rgba(74, 189, 172, 0.3)",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#264336", fontWeight: 600 }}>
                    {guestWelcome}
                  </Typography>
                </Box>
              </motion.div>
            )}

            <motion.div initial={fadeInUp.initial} animate={fadeInUp.animate} transition={{ ...fadeInUp.transition, delay: 0.24 }} style={{ width: "100%" }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.2}
                sx={{ width: "100%", maxWidth: 340, mx: "auto" }}
                alignItems="center"
              >
                <Button
                  component={Link}
                  href="/?mode=guest"
                  onClick={handleGuestMode}
                  variant="contained"
                  size="large"
                  startIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    py: 1.65,
                    fontSize: "1.02rem",
                    borderRadius: "18px",
                    textTransform: "none",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #69B47A 0%, #4ABDAC 100%)",
                    boxShadow: "0 16px 46px rgba(74, 189, 172, 0.35)",
                    transition: "all 0.3s ease",
                    ":hover": {
                      boxShadow: "0 18px 52px rgba(74, 189, 172, 0.45)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {primaryCTA}
                </Button>

                {secondaryCTA && (
                  <Button
                    component={Link}
                    href={secondaryLink}
                    variant="outlined"
                    size="large"
                    startIcon={<LoginRoundedIcon />}
                    sx={{
                    py: 1.65,
                    fontSize: "1.02rem",
                    borderRadius: "18px",
                    textTransform: "none",
                    fontWeight: 600,
                      borderColor: "rgba(48, 64, 58, 0.22)",
                      color: "#30403A",
                      borderWidth: 2,
                      transition: "all 0.3s ease",
                     ":hover": {
                       borderWidth: 2,
                       borderColor: "#4ABDAC",
                       color: "#4ABDAC",
                       backgroundColor: "rgba(74, 189, 172, 0.08)",
                     },
                   }}
                 >
                   {secondaryCTA}
                 </Button>
               )}
             </Stack>
           </motion.div>
         </Stack>
       </Paper>
     </Container>
  );
}, [heroSectionBase, heroMetaBase, heroIconSrc, setUser]);

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
              const badgeLabel =
                typeof item.badge === "string" && item.badge.trim().length > 0
                  ? (item.badge as string)
                  : undefined;
              const normalizedStatus =
                typeof item.status === "string" ? (item.status as string).toLowerCase() : undefined;
              const isComingSoon =
                normalizedStatus === "comingsoon" ||
                normalizedStatus === "coming_soon" ||
                badgeLabel === "COMING SOON";
              const color = item.themeColor ?? iconColorMap[item.id] ?? "#69B47A";
              const route = resolveRoute(item.navigateTo ?? item.id);
              const chipBackground = isComingSoon ? "rgba(48, 64, 58, 0.12)" : "#FFD54F";
              const chipColor = isComingSoon ? "#30403A" : "#1A1A1A";

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
                        {badgeLabel && (
                          <Chip
                            label={badgeLabel}
                            size="small"
                            sx={{
                              height: 22,
                              fontWeight: 700,
                              background: chipBackground,
                              color: chipColor,
                            }}
                          />
                        )}
                      </Box>
                      <Typography sx={{ color: "rgba(48,64,58,0.72)", flexGrow: 1 }}>{item.description}</Typography>
                      {isComingSoon ? (
                        <Button
                          variant="outlined"
                          disabled
                          sx={{
                            borderColor: "rgba(48, 64, 58, 0.3)",
                            color: "rgba(48, 64, 58, 0.6)",
                            fontWeight: 600,
                            textTransform: "none",
                          }}
                        >
                          {item.cta ?? "Coming Soon"}
                        </Button>
                      ) : (
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
                      )}
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

  const heroFooterRaw =
    landingScreen.sections.find((section) => section.id === "hero")?.metadata?.footerNote || "Free forever • No credit card required";
  const quickStartBadgeLabel = heroFooterRaw
    ? heroFooterRaw.split("•")[0]?.trim().replace(/\b\w/g, (char) => char.toUpperCase())
    : "Free Forever";
  const quickStartBadgeDescription =
    "We never send personal data to servers — calculations run entirely on your device.";

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
          badgeLabel={quickStartBadgeLabel}
          badgeDescription={quickStartBadgeDescription}
        />
      ),
    }),
    [quickStartBadgeLabel, quickStartBadgeDescription]
  );

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

      <Stack spacing={{ xs: 2.2, md: 4.2 }} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
        <ScreenRenderer
          screen={landingScreen}
          sectionRenderers={sectionRenderers}
          customComponentRenderers={customComponentRenderers}
        />
      </Stack>
    </Box>
  );
}
