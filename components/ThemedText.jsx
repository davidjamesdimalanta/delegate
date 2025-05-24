import { LegacyTypography, Typography, getMedicalTypographyStyle } from '@/constants/Typography';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Text } from 'react-native';

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  variant,
  medicalVariant,
  ...rest
}) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  // Determine which typography style to use
  let typographyStyle;
  
  if (medicalVariant) {
    // Use medical-specific typography
    typographyStyle = getMedicalTypographyStyle(medicalVariant);
  } else if (variant) {
    // Use Material Design typography variant
    typographyStyle = Typography[variant] || Typography.bodyMedium;
  } else {
    // Use legacy type system for backward compatibility
    typographyStyle = LegacyTypography[type] || LegacyTypography.default;
  }

  return (
    <Text
      style={[
        { color },
        typographyStyle,
        style,
      ]}
      {...rest}
    />
  );
} 