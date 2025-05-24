/**
 * Medical App Typography System
 * Based on Material Design 3 and Apple Human Interface Guidelines
 * Optimized for medical content readability and accessibility
 */

import { Platform } from 'react-native';

// Font families - using system fonts for better performance and consistency
const fontFamily = {
  regular: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto',
    default: 'System'
  }),
  medium: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto',
    default: 'System'
  }),
  bold: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto',
    default: 'System'
  }),
  mono: Platform.select({
    ios: 'SF Mono',
    android: 'Roboto Mono',
    default: 'monospace'
  })
};

// Material Design 3 Typography Scale
export const Typography = {
  // Display styles - for large, prominent text
  displayLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '400',
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontFamily: fontFamily.regular,
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '400',
    letterSpacing: 0,
  },
  displaySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '400',
    letterSpacing: 0,
  },

  // Headline styles - for section headers
  headlineLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '400',
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily: fontFamily.regular,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '400',
    letterSpacing: 0,
  },
  headlineSmall: {
    fontFamily: fontFamily.regular,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '400',
    letterSpacing: 0,
  },

  // Title styles - for card headers and important content
  titleLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '400',
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
  },

  // Label styles - for buttons and form labels
  labelLarge: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  // Body styles - for main content
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.4,
  },

  // Medical specific typography
  medical: {
    // For patient names and important medical info
    patientName: {
      fontFamily: fontFamily.medium,
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600',
      letterSpacing: 0,
    },
    // For medical record numbers and IDs
    medicalId: {
      fontFamily: fontFamily.mono,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
      letterSpacing: 0.5,
    },
    // For vital signs and measurements
    vitals: {
      fontFamily: fontFamily.medium,
      fontSize: 16,
      lineHeight: 20,
      fontWeight: '500',
      letterSpacing: 0,
    },
    // For medication names
    medication: {
      fontFamily: fontFamily.regular,
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '400',
      letterSpacing: 0.1,
    },
    // For dosage information
    dosage: {
      fontFamily: fontFamily.mono,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '400',
      letterSpacing: 0.2,
    },
    // For timestamps and dates
    timestamp: {
      fontFamily: fontFamily.regular,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
      letterSpacing: 0.4,
    },
    // For urgent/critical information
    urgent: {
      fontFamily: fontFamily.bold,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '700',
      letterSpacing: 0.1,
    }
  }
};

// Legacy support for existing components
export const LegacyTypography = {
  default: Typography.bodyMedium,
  title: Typography.headlineMedium,
  defaultSemiBold: {
    ...Typography.bodyMedium,
    fontWeight: '600'
  },
  subtitle: Typography.titleLarge,
  link: {
    ...Typography.bodyMedium,
    textDecorationLine: 'underline'
  }
};

// Utility functions
export const getTypographyStyle = (variant) => {
  return Typography[variant] || Typography.bodyMedium;
};

export const getMedicalTypographyStyle = (variant) => {
  return Typography.medical[variant] || Typography.bodyMedium;
}; 