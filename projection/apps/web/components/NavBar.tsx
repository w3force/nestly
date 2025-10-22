"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
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
          background: "linear-gradient(135deg, #FFA500, #FF8C00)",
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      />
    </Box>
  );
};

export const NavBar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigation = getNavigationDefinition();
  const { brand, links } = navigation;

  const primaryLinks = useMemo(
    () => links.filter((link) => (link.placement ?? "primary") === "primary"),
    [links]
  );
  const secondaryLinks = useMemo(
    () => links.filter((link) => link.placement === "secondary"),
    [links]
  );
  const ctaLinks = useMemo(
    () => links.filter((link) => link.placement === "cta"),
    [links]
  );

  const renderPrimaryButton = (link: NavigationLink) => (
    <Button
      key={link.id}
      component={Link}
      href={link.href}
      color="inherit"
      sx={{
        fontWeight: 500,
        textTransform: "none",
        fontSize: "0.95rem",
        position: "relative",
        padding: "8px 12px",
        transition: "all 0.2s ease",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "2px",
          background: "linear-gradient(90deg, #4ABD AC, #30403A)",
          transform: "scaleX(0)",
          transformOrigin: "center",
          transition: "transform 0.3s ease",
        },
        "&:hover::after": {
          transform: "scaleX(1)",
        },
        "&:hover": {
          color: "#4ABD AC",
        },
      }}
    >
      {renderBadgeLabel(link)}
    </Button>
  );

  const renderCtaButton = (link: NavigationLink) => (
    <Button
      key={link.id}
      component={Link}
      href={link.href}
      variant={getVariantFromStyle(link.style)}
      color="primary"
      sx={{
        textTransform: "none",
        fontWeight: 600,
        borderRadius: "8px",
        padding: "8px 20px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        ...(getVariantFromStyle(link.style) === "outlined" && {
          border: "1.5px solid",
          borderColor: "#4ABD AC",
          color: "#4ABD AC",
          "&:hover": {
            backgroundColor: alpha("#4ABD AC", 0.08),
            borderColor: "#30403A",
            color: "#30403A",
          },
        }),
        ...(getVariantFromStyle(link.style) === "contained" && {
          background: "linear-gradient(135deg, #4ABD AC, #2A8A78)",
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

  const renderSecondaryLink = (link: NavigationLink) => (
    <Button
      key={link.id}
      component={Link}
      href={link.href}
      color="inherit"
      size="small"
      sx={{ textTransform: "none", opacity: 0.7 }}
    >
      {link.label}
    </Button>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        backdropFilter: "blur(20px)",
        backgroundColor: alpha("#FFFFFF", 0.85),
        borderBottom: "1px solid",
        borderBottomColor: alpha("#30403A", 0.08),
        transition: "all 0.3s ease",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: { xs: 64, md: 72 },
          px: { xs: 2, md: 3 },
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
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              padding: "8px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: alpha("#4ABD AC", 0.08),
              },
            }}
          >
            {brand.logo ? (
              <span style={{ fontSize: "1.5rem", display: "flex", alignItems: "center" }}>
                {brand.logo}
              </span>
            ) : null}
            <Stack spacing={0}>
              <span>{brand.title}</span>
            </Stack>
          </Button>
          {brand.subtitle && !isMobile ? (
            <Typography
              variant="caption"
              sx={{
                color: alpha("#30403A", 0.6),
                fontWeight: 500,
                marginLeft: "8px !important",
                paddingLeft: "8px",
                borderLeft: "1px solid",
                borderLeftColor: alpha("#30403A", 0.15),
              }}
            >
              {brand.subtitle}
            </Typography>
          ) : null}
        </Stack>

        {!isMobile && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            {primaryLinks.filter((link) => isVisibleOnPlatform(link, "web")).map(renderPrimaryButton)}
            {secondaryLinks.filter((link) => isVisibleOnPlatform(link, "web")).map(renderSecondaryLink)}
            <Divider orientation="vertical" flexItem sx={{ my: 1, opacity: 0.3 }} />
            {ctaLinks.filter((link) => isVisibleOnPlatform(link, "web")).map(renderCtaButton)}
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
                backgroundColor: alpha("#4ABD AC", 0.1),
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: alpha("#FFFFFF", 0.95),
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              {brand.logo ? (
                <span style={{ fontSize: "1.5rem", display: "flex", alignItems: "center" }}>
                  {brand.logo}
                </span>
              ) : null}
              <Typography variant="h6" fontWeight={700}>
                {brand.title}
              </Typography>
            </Stack>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha("#4ABD AC", 0.1),
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <List sx={{ mb: 2 }}>
            {primaryLinks.filter((link) => isVisibleOnPlatform(link, "web")).map((link) => (
              <ListItemButton
                key={link.id}
                component={Link}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: "8px",
                  mb: 0.5,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: alpha("#4ABD AC", 0.08),
                  },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            ))}
          </List>

          {secondaryLinks.some((link) => isVisibleOnPlatform(link, "web")) && (
            <>
              <Divider sx={{ my: 2, opacity: 0.3 }} />
              <List sx={{ mb: 2 }}>
                {secondaryLinks.filter((link) => isVisibleOnPlatform(link, "web")).map((link) => (
                  <ListItemButton
                    key={link.id}
                    component={Link}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                      borderRadius: "8px",
                      mb: 0.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: alpha("#4ABD AC", 0.08),
                      },
                    }}
                  >
                    <ListItemText
                      primary={link.label}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </>
          )}

          {ctaLinks.some((link) => isVisibleOnPlatform(link, "web")) && (
            <Stack spacing={1} sx={{ mt: 3 }}>
              {ctaLinks.filter((link) => isVisibleOnPlatform(link, "web")).map((link) => (
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
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    ...(getVariantFromStyle(link.style) === "outlined" && {
                      border: "1.5px solid",
                      borderColor: "#4ABD AC",
                      color: "#4ABD AC",
                      "&:hover": {
                        backgroundColor: alpha("#4ABD AC", 0.1),
                        borderColor: "#30403A",
                        color: "#30403A",
                      },
                    }),
                    ...(getVariantFromStyle(link.style) === "contained" && {
                      background: "linear-gradient(135deg, #4ABD AC, #2A8A78)",
                      "&:hover": {
                        transform: "translateY(-1px)",
                      },
                    }),
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default NavBar;
