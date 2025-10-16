"use client";
import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUser } from '../../contexts/UserContext';
import { LoginOutlined, PersonOutline } from '@mui/icons-material';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] },
} as const;

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1, ease: "easeOut" as const, delay: 0.3 },
} as const;

const float = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export default function StartPage() {
  const { setUser } = useUser();

  const handleGuestMode = () => {
    setUser({
      tier: 'free',
      isGuest: true,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F5F5F5 0%, #E8F5E9 50%, #F1F8F4 100%)',
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(105, 180, 122, 0.15), transparent 50%),
          radial-gradient(circle at 90% 10%, rgba(74, 189, 172, 0.12), transparent 50%),
          radial-gradient(circle at 50% 80%, rgba(255, 213, 79, 0.08), transparent 50%)
        `,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background shapes */}
      <Box
        component={motion.div}
        {...float}
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(105, 180, 122, 0.1), transparent)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      
      <Box
        component={motion.div}
        animate={{
          y: [0, 30, 0],
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74, 189, 172, 0.08), transparent)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="sm">
        <Stack
          spacing={{ xs: 4, md: 5 }}
          alignItems="center"
          textAlign="center"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={{ ...fadeInUp.transition, delay: 0 }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #69B47A 0%, #4ABDAC 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 40px rgba(105, 180, 122, 0.3)',
                fontSize: '3rem',
              }}
            >
              🪺
            </Box>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={{ ...fadeInUp.transition, delay: 0.1 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '3rem', md: '4rem' },
                background: 'linear-gradient(135deg, #69B47A 0%, #4ABDAC 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              Nestly
            </Typography>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
                color: '#30403A',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                maxWidth: '28ch',
                lineHeight: 1.4,
              }}
            >
              Watch your future grow, one nest at a time.
            </Typography>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={fadeIn.transition}
          >
            <Typography
              variant="body1"
              sx={{
                maxWidth: '42ch',
                color: 'rgba(48, 64, 58, 0.75)',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.7,
              }}
            >
              Plan your retirement with powerful projections, Monte Carlo simulations, Social Security & Medicare estimates, and what-if scenarios.
            </Typography>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={{ ...fadeIn.transition, delay: 0.4 }}
            style={{ width: '100%' }}
          >
            <Stack spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
              <Button
                component={Link}
                href="/?mode=guest"
                onClick={handleGuestMode}
                variant="contained"
                size="large"
                startIcon={<PersonOutline />}
                sx={{
                  py: 1.75,
                  fontSize: '1.05rem',
                  borderRadius: 99,
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: '#69B47A',
                  boxShadow: '0 8px 24px rgba(105, 180, 122, 0.3)',
                  ':hover': {
                    backgroundColor: '#5AA468',
                    boxShadow: '0 12px 32px rgba(105, 180, 122, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Try Without Sign-In
              </Button>

              <Button
                component={Link}
                href="/auth"
                variant="outlined"
                size="large"
                startIcon={<LoginOutlined />}
                sx={{
                  py: 1.75,
                  fontSize: '1.05rem',
                  borderRadius: 99,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#69B47A',
                  color: '#69B47A',
                  borderWidth: 2,
                  ':hover': {
                    borderWidth: 2,
                    borderColor: '#5AA468',
                    backgroundColor: 'rgba(105, 180, 122, 0.05)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Sign In / Create Account
              </Button>
            </Stack>
          </motion.div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(48, 64, 58, 0.5)',
                fontSize: '0.85rem',
              }}
            >
              Free forever • No credit card required
            </Typography>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
}
