import { Shadows, Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { View } from 'react-native';

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  spacing,
  padding,
  margin,
  elevation,
  borderRadius,
  ...otherProps 
}) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  // Build dynamic styles based on props
  const dynamicStyles = {};

  // Apply spacing if provided
  if (spacing) {
    const spacingValue = Spacing[spacing] || spacing;
    dynamicStyles.padding = spacingValue;
  }

  // Apply specific padding if provided
  if (padding) {
    if (typeof padding === 'string') {
      dynamicStyles.padding = Spacing.padding[padding] || Spacing.padding.md;
    } else {
      dynamicStyles.padding = padding;
    }
  }

  // Apply specific margin if provided
  if (margin) {
    if (typeof margin === 'string') {
      dynamicStyles.margin = Spacing.margin[margin] || Spacing.margin.md;
    } else {
      dynamicStyles.margin = margin;
    }
  }

  // Apply elevation/shadow if provided
  if (elevation) {
    const shadowStyle = Shadows[elevation] || Shadows.none;
    Object.assign(dynamicStyles, shadowStyle);
  }

  // Apply border radius if provided
  if (borderRadius) {
    if (typeof borderRadius === 'string') {
      dynamicStyles.borderRadius = Spacing.borderRadius[borderRadius] || Spacing.borderRadius.md;
    } else {
      dynamicStyles.borderRadius = borderRadius;
    }
  }

  return (
    <View 
      style={[
        { backgroundColor }, 
        dynamicStyles,
        style
      ]} 
      {...otherProps} 
    />
  );
} 