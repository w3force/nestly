"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Button, Container, Stack, Typography, Grid, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import CalculateIcon from "@mui/icons-material/Calculate";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { LANDING_SCREEN } from "@projection/shared";
import { QuickStartSection } from "../components/QuickStartSection";

const fadeInUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
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

export default function Home() {
  const router = useRouter();
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    setIsGuestMode(router.query.mode === "guest");
  }, [router.query.mode]);

  // Get sections from schema
  const heroSection = LANDING_SCREEN.sections.find((section) => section.id === "hero") ?? LANDING_SCREEN.sections[0];
  const featuresSection =
    LANDING_SCREEN.sections.find((section) => section.id === "features") ?? LANDING_SCREEN.sections[1];
  const heroMetadata = heroSection.metadata as any;
  const heroIconKey =
    typeof heroMetadata?.heroIcon === "string" && heroMetadata.heroIcon.trim().length > 0
      ? heroMetadata.heroIcon.trim()
      : undefined;
  const heroIconSrc =
    heroIconKey && heroIconKey.startsWith("/")
      ? heroIconKey
      : HERO_ICON_SOURCE_MAP[heroIconKey ?? ""] ?? "/icon-192x192.png";
  const featureItems = (featuresSection.metadata?.items || []) as Array<{
    id: string;
    title: string;
    description: string;
    cta: string;
    navigateTo: string;
  }>;

  // Map schema to feature objects with icons and colors
  const features = featureItems.map((item) => {
    const iconMap: Record<string, React.ReactNode> = {
      deterministic: <CalculateIcon sx={{ fontSize: 40 }} />,
      whatif: <CompareArrowsIcon sx={{ fontSize: 40 }} />,
      montecarlo: <AutoGraphIcon sx={{ fontSize: 40 }} />,
    };

    const colorMap: Record<string, string> = {
      deterministic: "#69B47A",
      whatif: "#4ABDAC",
      montecarlo: "#FFD54F",
    };

    const hrefMap: Record<string, string> = {
      deterministic: "/calculator",
      whatif: "/what-if",
      montecarlo: "/calculator?tab=montecarlo",
    };

    return {
      title: item.title,
      description: item.description,
      icon: iconMap[item.id] || <CalculateIcon sx={{ fontSize: 40 }} />,
      href: hrefMap[item.id] || "/calculator",
      color: colorMap[item.id] || "#69B47A",
      badge: (item as any).badge,
    };
  });

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#F5F5F5",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(105, 180, 122, 0.18), transparent 55%), radial-gradient(circle at 80% 0%, rgba(74, 189, 172, 0.15), transparent 50%)",
          pb: 10,
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 3.5, md: 5 } }}>
          <Stack spacing={{ xs: 4.2, md: 6 }} alignItems="center">
            {/* Hero Section */}
            <Stack spacing={{ xs: 3, md: 4 }} alignItems="center" textAlign="center">
              <motion.div
                initial={fadeInUp.initial}
                animate={fadeInUp.animate}
                transition={{ ...fadeInUp.transition, delay: 0 }}
              >
                <Box
                  sx={{
                    mb: { xs: 1.25, md: 1.75 },
                    p: 1.8,
                    borderRadius: "999px",
                    background: "linear-gradient(135deg, rgba(74, 189, 172, 0.08) 0%, rgba(105, 180, 122, 0.14) 100%)",
                    boxShadow: "0 16px 36px rgba(74, 189, 172, 0.24)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(74, 189, 172, 0.18)",
                  }}
                >
                  <Box
                    component="img"
                    src={heroIconSrc}
                    alt="Nestly icon"
                    sx={{ width: { xs: 48, md: 60 }, height: { xs: 48, md: 60 }, borderRadius: "16px" }}
                  />
                </Box>
              </motion.div>

              <motion.div
                initial={fadeInUp.initial}
                animate={fadeInUp.animate}
                transition={{ ...fadeInUp.transition, delay: 0.1 }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "2.25rem", md: "3.5rem" },
                    color: "#30403A",
                    letterSpacing: "0.04em",
                  }}
                >
                  {heroMetadata.heroTitle}
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
                    color: "#4ABDAC",
                    fontSize: { xs: "1.125rem", md: "1.5rem" },
                  }}
                >
                  {heroMetadata.heroTagline}
                </Typography>
              </motion.div>

              <motion.div
                initial={fadeIn.initial}
                animate={fadeIn.animate}
                transition={fadeIn.transition}
              >
                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: "48ch",
                    color: "rgba(48, 64, 58, 0.8)",
                    fontSize: { xs: "0.98rem", md: "1.12rem" },
                    lineHeight: 1.6,
                  }}
                >
                  {heroMetadata.heroDescription}
                </Typography>
              </motion.div>

              {isGuestMode && (
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
                    {heroMetadata.guestWelcome}
                  </Typography>
                </Box>
              )}

            </Stack>

            {/* CTA Button */}
            <motion.div
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={{ ...fadeIn.transition, delay: 0.6 }}
            >
              <Button
                component={Link}
                href="/calculator"
                variant="contained"
                size="large"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: "1.05rem",
                  borderRadius: 99,
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: "#69B47A",
                  ":hover": {
                    backgroundColor: "#5AA468",
                    boxShadow: "0 12px 30px rgba(105, 180, 122, 0.25)",
                  },
                }}
              >
                {heroMetadata.primaryCTA}
              </Button>
            </motion.div>

            {/* ★ QUICK START SECTION - Get Results in 8 Seconds ★ */}
            <QuickStartSection
              badgeLabel="Free Forever"
              badgeDescription="We never send personal data to servers — calculations run entirely on your device."
            />

            {/* Feature Cards - Using Schema */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ width: "100%" }}
            >
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} md={4} key={feature.title}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        component={Link}
                        href={feature.href}
                        sx={{
                          height: "100%",
                          textDecoration: "none",
                          borderRadius: 3,
                          border: "1px solid rgba(0,0,0,0.08)",
                          transition: "all 0.2s",
                          position: "relative",
                          overflow: "visible",
                          "&:hover": {
                            borderColor: feature.color,
                            boxShadow: `0 8px 24px ${feature.color}33`,
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Stack spacing={2}>
                            <Box
                              sx={{
                                width: 64,
                                height: 64,
                                borderRadius: 2,
                                backgroundColor: `${feature.color}22`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: feature.color,
                              }}
                            >
                              {feature.icon}
                            </Box>
                            <Stack spacing={1}>
                              <Typography
                                variant="h6"
                                fontWeight={600}
                                color="#30403A"
                                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                              >
                                {feature.title}
                                {feature.badge && (
                                  <Box
                                    component="span"
                                    sx={{
                                      px: 1,
                                      py: 0.25,
                                      fontSize: "0.7rem",
                                      fontWeight: 600,
                                      borderRadius: 1,
                                      backgroundColor: "#FFD54F",
                                      color: "#30403A",
                                    }}
                                  >
                                    {feature.badge}
                                  </Box>
                                )}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {feature.description}
                              </Typography>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
