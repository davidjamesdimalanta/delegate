import { Shadows, Spacing } from '@/constants/Spacing';
import { LegacyTypography, Typography } from '@/constants/Typography';
import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';

// ===================================================================
// CORE THEME PROPS
// ===================================================================

/**
 * Base theme-related props for themed components
 */
export interface ThemedProps {
  /** Light theme color override */
  lightColor?: string;
  /** Dark theme color override */
  darkColor?: string;
}

/**
 * Spacing-related props for layout components
 */
export interface SpacingProps {
  /** General spacing applied as padding */
  spacing?: keyof typeof Spacing | number;
  /** Specific padding override */
  padding?: keyof typeof Spacing.padding | number;
  /** Specific margin override */
  margin?: keyof typeof Spacing.margin | number;
}

/**
 * Elevation and shadow props for enhanced visual hierarchy
 */
export interface ElevationProps {
  /** Elevation level for shadows */
  elevation?: keyof typeof Shadows;
  /** Border radius for rounded corners */
  borderRadius?: keyof typeof Spacing.borderRadius | number;
}

// ===================================================================
// THEMED VIEW PROPS
// ===================================================================

/**
 * Props for ThemedView component
 * Combines theming, spacing, and elevation capabilities
 */
export interface ThemedViewProps extends ThemedProps, SpacingProps, ElevationProps {
  /** Custom style overrides */
  style?: ViewStyle;
  /** Child elements */
  children?: React.ReactNode;
  /** Additional props passed to underlying View */
  [key: string]: any;
}

// ===================================================================
// THEMED TEXT PROPS
// ===================================================================

/**
 * Typography variant types for text components
 */
export type LegacyTypographyType = keyof typeof LegacyTypography;
export type TypographyVariant = keyof typeof Typography;

/**
 * Medical-specific typography variants for healthcare context
 */
export type MedicalTypographyVariant = 
  | 'patient-name'
  | 'condition-primary'
  | 'condition-secondary'
  | 'vital-signs'
  | 'medication-name'
  | 'dosage-info'
  | 'priority-high'
  | 'priority-medium'
  | 'priority-low'
  | 'assessment-label'
  | 'assessment-value'
  | 'nursing-note'
  | 'family-info'
  | 'emergency-alert';

/**
 * Props for ThemedText component
 * Supports legacy types, Material Design variants, and medical-specific variants
 */
export interface ThemedTextProps extends ThemedProps {
  /** Legacy typography type (for backward compatibility) */
  type?: LegacyTypographyType;
  /** Material Design typography variant */
  variant?: TypographyVariant;
  /** Medical-specific typography variant */
  medicalVariant?: string | MedicalTypographyVariant;
  /** Custom style overrides */
  style?: TextStyle;
  /** Text content */
  children?: React.ReactNode;
  /** Additional props passed to underlying Text */
  [key: string]: any;
}

// ===================================================================
// BUTTON PROPS
// ===================================================================

/**
 * Button variant types for different use cases
 */
export type ButtonVariant = 
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning'
  | 'medical-urgent'
  | 'medical-routine'
  | 'medical-comfort';

/**
 * Button size options
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Props for Button component
 */
export interface ButtonProps extends ThemedProps {
  /** Button text */
  title: string;
  /** Press handler */
  onPress: () => void;
  /** Button variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon name (if using icon library) */
  icon?: string;
  /** Icon position relative to text */
  iconPosition?: 'left' | 'right';
  /** Custom style overrides */
  style?: ViewStyle;
  /** Custom text style overrides */
  textStyle?: TextStyle;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}

// ===================================================================
// CARD PROPS
// ===================================================================

/**
 * Card variant types for different contexts
 */
export type CardVariant = 
  | 'default'
  | 'elevated'
  | 'outlined'
  | 'patient-summary'
  | 'visit-card'
  | 'task-card'
  | 'assessment-card'
  | 'alert-card';

/**
 * Props for Card component
 */
export interface CardProps extends ThemedProps, SpacingProps, ElevationProps {
  /** Card variant */
  variant?: CardVariant;
  /** Card content */
  children?: React.ReactNode;
  /** Press handler for interactive cards */
  onPress?: () => void;
  /** Custom style overrides */
  style?: ViewStyle;
  /** Header content */
  header?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Whether card is selectable */
  selectable?: boolean;
  /** Selected state */
  selected?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}

// ===================================================================
// FORM COMPONENT PROPS
// ===================================================================

/**
 * Base props for form input components
 */
export interface BaseInputProps extends ThemedProps {
  /** Input label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Required field indicator */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Input value */
  value: string;
  /** Value change handler */
  onChangeText: (text: string) => void;
  /** Custom style overrides */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Props for medical-specific input components
 */
export interface MedicalInputProps extends BaseInputProps {
  /** Medical field type for validation */
  medicalFieldType?: 
    | 'vital-sign'
    | 'medication-dosage'
    | 'pain-scale'
    | 'temperature'
    | 'blood-pressure'
    | 'heart-rate'
    | 'respiratory-rate'
    | 'oxygen-saturation'
    | 'weight'
    | 'height';
  /** Unit of measurement */
  unit?: string;
  /** Min/max validation values */
  validationRange?: {
    min?: number;
    max?: number;
  };
}

// ===================================================================
// UTILITY TYPES
// ===================================================================

/**
 * Generic props with children
 */
export interface WithChildren {
  children?: React.ReactNode;
}

/**
 * Generic props with optional press handler
 */
export interface WithOptionalPress {
  onPress?: () => void;
}

/**
 * Generic props with required press handler
 */
export interface WithPress {
  onPress: () => void;
}

/**
 * Generic props with test ID
 */
export interface WithTestID {
  testID?: string;
}

/**
 * Generic props with accessibility
 */
export interface WithAccessibility {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
}

/**
 * Combines common component props
 */
export interface CommonComponentProps 
  extends WithChildren, WithOptionalPress, WithTestID, WithAccessibility {
  style?: ViewStyle;
} 