import { LegacyTypography, Typography, getMedicalTypographyStyle } from '@/constants/Typography';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedTextProps } from '@/lib/types/component-props';
import React from 'react';
import { Text, TextStyle } from 'react-native';

/**
 * ThemedText Component
 * 
 * A Text component with theme support and multiple typography systems.
 * Supports legacy types, Material Design variants, and medical-specific variants.
 * Automatically adapts to light and dark color schemes.
 * 
 * @param props - ThemedTextProps including theme, typography, and style options
 * @returns Themed Text component with typography styling
 */
export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  variant,
  medicalVariant,
  children,
  ...rest
}: ThemedTextProps): React.JSX.Element {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  
  // Ensure color is a string for React Native
  const resolvedColor = typeof color === 'string' ? color : '#000000'; // fallback color

  // Determine which typography style to use
  let typographyStyle: TextStyle = {};
  
  if (medicalVariant) {
    // Use medical-specific typography
    if (typeof getMedicalTypographyStyle === 'function') {
      typographyStyle = getMedicalTypographyStyle(medicalVariant) || {};
    }
  } else if (variant) {
    // Use Material Design typography variant
    typographyStyle = (Typography as any)?.[variant] || (Typography as any)?.bodyMedium || {};
  } else if (type) {
    // Use legacy type system for backward compatibility
    typographyStyle = (LegacyTypography as any)?.[type] || (LegacyTypography as any)?.default || {};
  }

  return (
    <Text
      style={[
        { color: resolvedColor },
        typographyStyle,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
} 