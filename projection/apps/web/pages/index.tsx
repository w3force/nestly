import React from "react";
import Link from "next/link";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

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

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(105, 180, 122, 0.18), transparent 55%), radial-gradient(circle at 80% 0%, rgba(74, 189, 172, 0.15), transparent 50%)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        <Stack
          spacing={{ xs: 4, md: 5 }}
          alignItems="center"
          textAlign="center"
        >
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
              Nestly
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
              Watch your future grow, one nest at a time.
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
                fontSize: { xs: "1rem", md: "1.15rem" },
                lineHeight: 1.7,
              }}
            >
              Nestly helps you project your savings, 401(k), and investments
              over time — guiding you to build a secure financial future.
            </Typography>
          </motion.div>

          <motion.div
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ ...fadeIn.transition, delay: 0.35 }}
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
              Get Started
            </Button>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
}
