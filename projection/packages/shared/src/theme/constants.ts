/**
 * Shared Theme Constants
 * Platform-agnostic design tokens for consistent UI across web and mobile
 */

export const COLORS = {
  // Primary brand colors
  primary: '#4ABDAC',      // Teal - primary actions, highlights
  primaryDark: '#2A8A78',  // Darker teal for gradients/hover
  secondary: '#69B47A',    // Green - success, positive indicators
  
  // Neutral colors
  textPrimary: '#30403A',       // Dark green-gray - primary text
  textSecondary: '#60706A',     // Medium gray - secondary text
  textTertiary: '#8A9A94',      // Light gray - tertiary text
  
  // Background colors
  background: '#F5F5F5',        // Light gray background
  backgroundSecondary: '#FAFAFA', // Slightly darker background
  surface: '#FFFFFF',           // White surface
  
  // Status colors
  success: '#69B47A',
  error: '#FF6B6B',
  warning: '#FFB74D',
  info: '#4ABDAC',
  
  // Chart colors
  chartPrimary: '#69B47A',
  chartSecondary: '#4ABDAC',
  chartTertiary: '#FFA500',
  
  // UI element colors
  border: 'rgba(48, 64, 58, 0.12)',
  borderLight: 'rgba(48, 64, 58, 0.08)',
  divider: 'rgba(48, 64, 58, 0.15)',
  shadow: '#000000',
  
  // Card colors
  cardBackground: '#FFFFFF',
  cardBorder: 'rgba(48, 64, 58, 0.12)',
  
  // Input colors
  inputBackground: '#FFFFFF',
  inputBorder: 'rgba(48, 64, 58, 0.23)',
  inputFocusBorder: '#4ABDAC',
  
  // Button colors  
  buttonPrimary: '#4ABDAC',
  buttonPrimaryHover: '#2A8A78',
  buttonSecondary: '#69B47A',
  buttonSecondaryHover: '#558B2F',
  
  // Overlay colors (with alpha)
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
  
  // Glassmorphism
  glass: 'rgba(255, 255, 255, 0.85)',
  glassNavbar: 'rgba(255, 255, 255, 0.85)',
  
  // Premium/tier colors
  premium: '#FFD54F',
  
  // Result highlights
  resultHighlight: '#E8F5E9',    // Light green background
  resultBorder: '#69B47A',       // Green border
  resultText: '#2E7D32',         // Dark green text
  resultValueText: '#1B5E20',    // Darker green for emphasis
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const TYPOGRAPHY = {
  fontFamily: {
    primary: "'Inter', system-ui, sans-serif",
    fallback: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  fontSize: {
    xs: 11,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    heading: 32,
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 2px 8px rgba(0, 0, 0, 0.08)',
  lg: '0 4px 12px rgba(0, 0, 0, 0.12)',
  xl: '0 8px 24px rgba(0, 0, 0, 0.15)',
};

export const ELEVATION = {
  0: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
};

export const TRANSITIONS = {
  fast: '0.15s ease',
  normal: '0.2s ease',
  slow: '0.3s ease',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

// Screen-specific theme overrides
export const SCREEN_THEMES = {
  deterministic: {
    primaryColor: COLORS.secondary,      // Green for deterministic
    accentColor: COLORS.primary,
    backgroundColor: COLORS.background,
    cardBackground: COLORS.cardBackground,
  },
  whatIf: {
    primaryColor: COLORS.primary,        // Teal for what-if
    accentColor: COLORS.secondary,
    backgroundColor: COLORS.background,
    cardBackground: COLORS.cardBackground,
  },
  monteCarlo: {
    primaryColor: COLORS.primary,
    accentColor: COLORS.chartTertiary,
    backgroundColor: COLORS.background,
    cardBackground: COLORS.cardBackground,
  },
};

// Common component styles
export const COMPONENT_STYLES = {
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  button: {
    primary: {
      backgroundColor: COLORS.buttonPrimary,
      color: COLORS.surface,
      borderRadius: BORDER_RADIUS.md,
      padding: `${SPACING.sm}px ${SPACING.lg}px`,
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: COLORS.primary,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1.5,
      borderColor: COLORS.primary,
      padding: `${SPACING.sm}px ${SPACING.lg}px`,
      fontWeight: TYPOGRAPHY.fontWeight.semibold,
    },
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
};

export default {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
  SHADOWS,
  ELEVATION,
  TRANSITIONS,
  SCREEN_THEMES,
  COMPONENT_STYLES,
};
