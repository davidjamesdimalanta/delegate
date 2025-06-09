import { Shadows, Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedViewProps } from '@/lib/types/component-props';
import React from 'react';
import { View, ViewStyle } from 'react-native';

/**
 * ThemedView Component
 * 
 * A View component with theme support, spacing, elevation, and styling capabilities.
 * Supports both light and dark color schemes with automatic theme switching.
 * 
 * @param props - ThemedViewProps including theme, spacing, and style options
 * @returns Themed View component with dynamic styling
 */
export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  spacing,
  padding,
  margin,
  elevation,
  borderRadius,
  children,
  ...otherProps 
}: ThemedViewProps): React.JSX.Element {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  
  // Ensure backgroundColor is a string for React Native
  const resolvedBackgroundColor = typeof backgroundColor === 'string' 
    ? backgroundColor 
    : '#FFFFFF'; // fallback color

  // Build dynamic styles based on props
  const dynamicStyles: ViewStyle = {};

  // Apply spacing if provided
  if (spacing !== undefined) {
    if (typeof spacing === 'string') {
      const spacingValue = (Spacing as any)[spacing];
      if (typeof spacingValue === 'number') {
        dynamicStyles.padding = spacingValue;
      }
    } else if (typeof spacing === 'number') {
      dynamicStyles.padding = spacing;
    }
  }

  // Apply specific padding if provided (overrides spacing)
  if (padding !== undefined) {
    if (typeof padding === 'string') {
      const paddingValue = (Spacing.padding as any)?.[padding];
      dynamicStyles.padding = typeof paddingValue === 'number' ? paddingValue : 16;
    } else if (typeof padding === 'number') {
      dynamicStyles.padding = padding;
    }
  }

  // Apply specific margin if provided
  if (margin !== undefined) {
    if (typeof margin === 'string') {
      const marginValue = (Spacing.margin as any)?.[margin];
      dynamicStyles.margin = typeof marginValue === 'number' ? marginValue : 16;
    } else if (typeof margin === 'number') {
      dynamicStyles.margin = margin;
    }
  }

  // Apply elevation/shadow if provided
  if (elevation !== undefined) {
    const shadowStyle = Shadows[elevation] || Shadows.none || {};
    Object.assign(dynamicStyles, shadowStyle);
  }

  // Apply border radius if provided
  if (borderRadius !== undefined) {
    if (typeof borderRadius === 'string') {
      dynamicStyles.borderRadius = Spacing.borderRadius?.[borderRadius] || Spacing.borderRadius?.md || 8;
    } else {
      dynamicStyles.borderRadius = borderRadius;
    }
  }

  return (
    <View 
      style={[
        { backgroundColor: resolvedBackgroundColor }, 
        dynamicStyles,
        style
      ]} 
      {...otherProps}
    >
      {children}
    </View>
  );
} 