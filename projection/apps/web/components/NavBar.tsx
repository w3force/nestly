"use client";

import React, { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { getNavigationDefinition, NavigationLink } from "@projection/shared";

const getVariantFromStyle = (style?: string) => {
  switch (style) {
    case "contained":
      return "contained" as const;
    case "text":
      return "text" as const;
    case "outlined":
    default:
      return "outlined" as const;
  }
};

const isVisibleOnPlatform = (link: NavigationLink, platform: "web" | "mobile") => {
  if (!link.visibility || link.visibility === "all") return true;
  return link.visibility === platform;
};

const renderBadgeLabel = (link: NavigationLink) => {
  const badge = link.metadata?.badge as string | undefined;
  if (!badge) return link.label;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <span>{link.label}</span>
      <Chip
        label={badge}
        size="small"
        sx={{
          height: 22,
          fontSize: "0.7rem",
          fontWeight: 600,
          background: "linear-gradient(135deg, #FDB450, #F67E23)",
          color: "#1A1A1A",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      />
    </Box>
  );
};

const brandGlyph = (size: number = 44, imageSize: number = 28) => (
  <Box
    sx={{
      width: size,
      height: size,
      borderRadius: "18px",
      background: "linear-gradient(135deg, rgba(105, 180, 122, 0.18) 0%, rgba(74, 189, 172, 0.28) 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 14px 32px rgba(74, 189, 172, 0.28)",
      border: "1px solid rgba(74, 189, 172, 0.25)",
    }}
  >
    <Image
      src="/icon-192x192.png"
      alt="Nestly icon"
      width={imageSize}
      height={imageSize}
      style={{ borderRadius: "12px" }}
      priority
    />
  </Box>
);

export const NavBar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const navigation = getNavigationDefinition();
  const { brand, links } = navigation;

  const primaryLinks = useMemo(
    () =>
      links.filter(
        (link) => (link.placement ?? "primary") === "primary" && link.id !== "upgrade"
      ),
    [links]
  );
  const secondaryLinks = useMemo(
    () => links.filter((link) => link.placement === "secondary"),
    [links]
  );
  const ctaLinks = useMemo(
    () => links.filter((link) => link.placement === "cta" && link.id !== "signIn"),
    [links]
  );
  const hasWebCtas = useMemo(
    () => ctaLinks.some((link) => isVisibleOnPlatform(link, "web")),
    [ctaLinks]
  );

  const linkIcons: Record<string, () => React.ReactNode> = useMemo(
    () => ({
      home: () => <HomeOutlinedIcon fontSize="small" color="inherit" />,
      calculator: () => <CalculateOutlinedIcon fontSize="small" color="inherit" />,
      whatIf: () => <TimelineOutlinedIcon fontSize="small" color="inherit" />,
      upgrade: () => <WorkspacePremiumOutlinedIcon fontSize="small" color="inherit" />,
    }),
    []
  );

  const isLinkActive = useCallback(
    (link: NavigationLink) => {
      const href = (link.href ?? "").split("?")[0];
      if (!pathname) {
        return false;
      }
      if (!href || href === "/") {
        return pathname === "/" || pathname.startsWith("/start");
      }
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname]
  );

  const renderPrimaryButton = useCallback(
    (link: NavigationLink) => {
      const active = isLinkActive(link);
      const iconFactory = linkIcons[link.id];
      const icon = iconFactory
        ? iconFactory()
        : <ArrowForwardRoundedIcon fontSize="small" color="inherit" />;

      return (
        <Button
          key={link.id}
          component={Link}
          href={link.href}
          color="inherit"
          startIcon={icon}
          sx={{
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.95rem",
            position: "relative",
            padding: "8px 14px",
            borderRadius: "14px",
            transition: "all 0.25s ease",
            color: active ? "#FFFFFF" : alpha("#30403A", 0.86),
            background: active ? "linear-gradient(135deg, #4ABDAC 0%, #69B47A 100%)" : "transparent",
            boxShadow: active ? "0 16px 36px rgba(74, 189, 172, 0.32)" : "none",
            border: active ? "1px solid rgba(74, 189, 172, 0.48)" : "1px solid transparent",
            "&:hover": {
              background: active
                ? "linear-gradient(135deg, #3DAA9D 0%, #5CA969 100%)"
                : alpha("#4ABDAC", 0.12),
              boxShadow: active ? "0 18px 40px rgba(74, 189, 172, 0.38)" : "none",
              color: active ? "#FFFFFF" : "#4ABDAC",
            },
          }}
        >
          {renderBadgeLabel(link)}
        </Button>
      );
    },
    [isLinkActive, linkIcons]
  );

  const renderCtaButton = (link: NavigationLink) => {
    const iconFactory = linkIcons[link.id];
    return (
      <Button
        key={link.id}
        component={Link}
        href={link.href}
        variant={getVariantFromStyle(link.style)}
        color="primary"
        startIcon={iconFactory ? iconFactory() : <ArrowForwardRoundedIcon fontSize="small" color="inherit" />}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "10px",
          padding: "8px 20px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          ...(getVariantFromStyle(link.style) === "outlined" && {
            border: "1.5px solid",
            borderColor: "#4ABDAC",
            color: "#4ABDAC",
            "&:hover": {
              backgroundColor: alpha("#4ABDAC", 0.08),
              borderColor: "#30403A",
              color: "#30403A",
            },
          }),
          ...(getVariantFromStyle(link.style) === "contained" && {
            background: "linear-gradient(135deg, #4ABDAC, #2A8A78)",
            boxShadow: "0 4px 12px rgba(74, 189, 172, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(74, 189, 172, 0.4)",
              transform: "translateY(-2px)",
            },
          }),
        }}
      >
        {link.label}
      </Button>
    );
  };

  const renderSecondaryLink = (link: NavigationLink) => {
    const active = isLinkActive(link);
    const iconFactory = linkIcons[link.id];
    return (
      <Button
        key={link.id}
        component={Link}
        href={link.href}
        color="inherit"
        size="small"
        startIcon={iconFactory ? iconFactory() : undefined}
        sx={{
          textTransform: "none",
          opacity: active ? 1 : 0.75,
          fontWeight: active ? 600 : 500,
          color: active ? "#4ABDAC" : "inherit",
        }}
      >
        {link.label}
      </Button>
    );
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        backdropFilter: "blur(20px)",
        backgroundColor: alpha("#FFFFFF", 0.88),
        borderBottom: "1px solid",
        borderBottomColor: alpha("#30403A", 0.08),
        transition: "all 0.3s ease",
        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.04)",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: { xs: 64, md: 72 },
          px: { xs: 2.5, md: 4 },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            component={Link}
            href={brand.href ?? "/"}
            color="inherit"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
              padding: "6px 10px",
              borderRadius: "12px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: alpha("#4ABDAC", 0.12),
              },
            }}
          >
            {brandGlyph()}
            <Stack spacing={0} sx={{ alignItems: "flex-start" }}>
              <span>{brand.title}</span>
              {!isMobile && brand.subtitle ? (
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha("#30403A", 0.65),
                    fontWeight: 500,
                    letterSpacing: "0.4px",
                  }}
                >
                  {brand.subtitle}
                </Typography>
              ) : null}
            </Stack>
          </Button>
        </Stack>

        {!isMobile && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            {primaryLinks.filter((link) => isVisibleOnPlatform(link, "web")).map(renderPrimaryButton)}
            {secondaryLinks.filter((link) => isVisibleOnPlatform(link, "web")).map(renderSecondaryLink)}
            {hasWebCtas && <Divider orientation="vertical" flexItem sx={{ my: 1, opacity: 0.25 }} />}
            {hasWebCtas && ctaLinks.filter((link) => isVisibleOnPlatform(link, "web")).map(renderCtaButton)}
          </Stack>
        )}

        {isMobile && (
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: alpha("#4ABDAC", 0.12),
              },
            }}
          >
            <MenuRoundedIcon />
          </IconButton>
        )}
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            backgroundColor: alpha("#FFFFFF", 0.96),
            backdropFilter: "blur(20px)",
            borderLeft: "1px solid rgba(74, 189, 172, 0.12)",
          },
        }}
      >
        <Box sx={{ width: "100%", p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              {brandGlyph(40, 24)}
              <Typography variant="h6" fontWeight={700}>
                {brand.title}
              </Typography>
            </Stack>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha("#4ABDAC", 0.12),
                },
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>

          <List sx={{ mb: 2 }}>
            {primaryLinks.filter((link) => isVisibleOnPlatform(link, "web")).map((link) => {
              const active = isLinkActive(link);
              const iconFactory = linkIcons[link.id];
              const icon = iconFactory
                ? iconFactory()
                : <ArrowForwardRoundedIcon fontSize="small" color="inherit" />;
              return (
                <ListItemButton
                  key={link.id}
                  component={Link}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  selected={active}
                  sx={{
                    borderRadius: "16px",
                    mb: 0.75,
                    transition: "all 0.25s ease",
                    color: active ? "#FFFFFF" : alpha("#30403A", 0.92),
                    background: active ? "linear-gradient(135deg, #4ABDAC 0%, #69B47A 100%)" : "transparent",
                    boxShadow: active ? "0 16px 34px rgba(74, 189, 172, 0.28)" : "none",
                    "&:hover": {
                      background: active
                        ? "linear-gradient(135deg, #3DAA9D 0%, #5CA969 100%)"
                        : alpha("#4ABDAC", 0.12),
                    },
                    "& .MuiListItemIcon-root": {
                      color: active ? "#FFFFFF" : "#4ABDAC",
                      transition: "color 0.25s ease",
                    },
                    "& .MuiListItemText-primary": {
                      fontWeight: active ? 700 : 600,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 700 : 600,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>

          {secondaryLinks.some((link) => isVisibleOnPlatform(link, "web")) && (
            <>
              <Divider sx={{ my: 2, opacity: 0.3 }} />
              <List sx={{ mb: 2 }}>
                {secondaryLinks.filter((link) => isVisibleOnPlatform(link, "web")).map((link) => {
                  const active = isLinkActive(link);
                  const iconFactory = linkIcons[link.id];
                  const icon = iconFactory
                    ? iconFactory()
                    : <ArrowForwardRoundedIcon fontSize="small" color="inherit" />;
                  return (
                    <ListItemButton
                      key={link.id}
                      component={Link}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      selected={active}
                      sx={{
                        borderRadius: "14px",
                        mb: 0.75,
                        transition: "all 0.25s ease",
                        color: active ? "#FFFFFF" : alpha("#30403A", 0.75),
                        background: active ? "linear-gradient(135deg, #4ABDAC 0%, #69B47A 100%)" : "transparent",
                        "&:hover": {
                          background: active
                            ? "linear-gradient(135deg, #3DAA9D 0%, #5CA969 100%)"
                            : alpha("#4ABDAC", 0.12),
                        },
                        "& .MuiListItemIcon-root": {
                          color: active ? "#FFFFFF" : alpha("#30403A", 0.6),
                        },
                        "& .MuiListItemText-primary": {
                          fontWeight: active ? 600 : 500,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
                      <ListItemText
                        primary={link.label}
                        primaryTypographyProps={{
                          fontWeight: active ? 600 : 500,
                          fontSize: "0.9rem",
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </>
          )}

          {hasWebCtas && (
            <Stack spacing={1.2} sx={{ mt: 3 }}>
              {ctaLinks.filter((link) => isVisibleOnPlatform(link, "web")).map((link) => {
                const iconFactory = linkIcons[link.id];
                return (
                <Button
                  key={link.id}
                  component={Link}
                  href={link.href}
                  variant={getVariantFromStyle(link.style)}
                  color="primary"
                  fullWidth
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    ...(getVariantFromStyle(link.style) === "outlined" && {
                      border: "1.5px solid",
                      borderColor: "#4ABDAC",
                      color: "#4ABDAC",
                      "&:hover": {
                        backgroundColor: alpha("#4ABDAC", 0.12),
                        borderColor: "#30403A",
                        color: "#30403A",
                      },
                    }),
                    ...(getVariantFromStyle(link.style) === "contained" && {
                      background: "linear-gradient(135deg, #4ABDAC, #2A8A78)",
                      "&:hover": {
                        transform: "translateY(-1px)",
                      },
                    }),
                  }}
                  startIcon={iconFactory ? iconFactory() : <ArrowForwardRoundedIcon fontSize="small" color="inherit" />}
                >
                  {link.label}
                </Button>
                );
              })}
            </Stack>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default NavBar;
