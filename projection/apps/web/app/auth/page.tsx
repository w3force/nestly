"use client";
import React from "react";
import { Box, Container, Paper, Typography, Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useUser } from "../../contexts/UserContext";

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useUser();

  const handleGuestMode = () => {
    setUser({ tier: "free", isGuest: true });
    router.push("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h4" fontWeight={700} color="#30403A">
              Sign In / Create Account
            </Typography>

            <Typography variant="body1" color="text.secondary" textAlign="center">
              This is a demo page. In production, this would integrate with an authentication provider like Auth0, Firebase, or NextAuth.
            </Typography>

            <Stack spacing={2} sx={{ width: "100%", mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  backgroundColor: "#69B47A",
                  textTransform: "none",
                  fontWeight: 600,
                }}
                onClick={() => {
                  setUser({ tier: "free", isGuest: false, email: "demo@nestly.com" });
                  router.push("/");
                }}
              >
                Sign In with Email
              </Button>

              <Button
                variant="outlined"
                size="large"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
                onClick={() => {
                  setUser({ tier: "standard", isGuest: false, email: "demo@nestly.com" });
                  router.push("/");
                }}
              >
                Sign In with Google (Demo: Standard Tier)
              </Button>

              <Button
                variant="outlined"
                size="large"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "#FFD54F",
                  color: "#30403A",
                  "&:hover": {
                    borderColor: "#FFD54F",
                    backgroundColor: "rgba(255, 213, 79, 0.1)",
                  },
                }}
                onClick={() => {
                  setUser({ tier: "premium", isGuest: false, email: "premium@nestly.com" });
                  router.push("/");
                }}
              >
                Sign In with GitHub (Demo: Premium Tier)
              </Button>

              <Button
                variant="text"
                size="large"
                fullWidth
                sx={{
                  textTransform: "none",
                  color: "text.secondary",
                }}
                onClick={handleGuestMode}
              >
                Continue as Guest
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
