import { useEnhancedColorScheme } from '@/components/ui/ThemeProvider';
import { MedicalPriority, PalliativePriority } from '@/constants/Colors';
import { Shadows, Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ButtonProps, ButtonSize, ButtonVariant } from '@/lib/types/component-props';
import React from 'react';
import { ActivityIndicator, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';

// Extend ButtonProps to include additional medical-specific props
interface MedicalButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: ButtonVariant | 'filled' | 'outlined' | 'text' | 'tonal';
  size?: ButtonSize | 'small' | 'medium' | 'large';
  priority?: string;
  usePalliativePriority?: boolean;
  textStyle?: TextStyle;
  [key: string]: any; // For additional props
}

interface SizeConfig {
  paddingHorizontal: number;
  paddingVertical: number;
  minHeight: number;
  textVariant: string;
}

interface VariantStyles {
  backgroundColor: string;
  borderWidth: number;
  borderColor?: string;
  textColor: string;
  elevation: keyof typeof Shadows;
}

interface PriorityColors {
  backgroundColor: string;
  textColor: string;
}

/**
 * Button Component
 * 
 * A versatile button component with multiple variants, sizes, and medical priority support.
 * Supports Material Design variants and medical-specific priority color systems.
 * 
 * @param props - MedicalButtonProps including title, variant, size, priority options
 * @returns Themed Button component with interactive states
 */
export function Button({
  title,
  onPress,
  variant = 'filled',
  size = 'medium',
  priority,
  disabled = false,
  loading = false,
  icon,
  usePalliativePriority = true,
  style,
  textStyle,
  accessibilityLabel,
  testID,
  ...props
}: MedicalButtonProps): React.JSX.Element {
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';

  // Get theme colors
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const onPrimaryColor = useThemeColor({}, 'onPrimary');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const outlineColor = useThemeColor({}, 'outline');
  const primaryContainerColor = useThemeColor({}, 'primaryContainer');
  const onPrimaryContainerColor = useThemeColor({}, 'onPrimaryContainer');

  // Ensure colors are strings
  const resolvedPrimaryColor = typeof primaryColor === 'string' ? primaryColor : '#007AFF';
  const resolvedOnPrimaryColor = typeof onPrimaryColor === 'string' ? onPrimaryColor : '#FFFFFF';
  const resolvedOutlineColor = typeof outlineColor === 'string' ? outlineColor : '#E0E0E0';
  const resolvedPrimaryContainerColor = typeof primaryContainerColor === 'string' ? primaryContainerColor : '#E3F2FD';
  const resolvedOnPrimaryContainerColor = typeof onPrimaryContainerColor === 'string' ? onPrimaryContainerColor : '#1976D2';

  // Size configurations
  const sizeConfig: Record<string, SizeConfig> = {
    small: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      minHeight: 32,
      textVariant: 'labelMedium',
    },
    medium: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      minHeight: 40,
      textVariant: 'labelLarge',
    },
    large: {
      paddingHorizontal: 32,
      paddingVertical: 16,
      minHeight: 48,
      textVariant: 'labelLarge',
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.medium;

  // Get priority colors if specified - supports both priority systems
  const getPriorityColors = (): PriorityColors | null => {
    if (!priority) return null;
    
    try {
      // Use palliative priority system by default, fall back to medical priority
      const prioritySystem = usePalliativePriority ? PalliativePriority : MedicalPriority;
      const priorityColors = (prioritySystem as any)?.[priority];
      
      if (!priorityColors) {
        // Try the other system if priority not found
        const fallbackSystem = usePalliativePriority ? MedicalPriority : PalliativePriority;
        const fallbackColors = (fallbackSystem as any)?.[priority];
        
        if (!fallbackColors) {
          console.warn(`Unknown priority: ${priority}`);
          return null;
        }
        return {
          backgroundColor: isDark ? fallbackColors.dark : fallbackColors.light,
          textColor: '#FFFFFF',
        };
      }
      
      return {
        backgroundColor: isDark ? priorityColors.dark : priorityColors.light,
        textColor: '#FFFFFF',
      };
    } catch (error) {
      console.warn(`Error getting priority colors for: ${priority}`, error);
      return null;
    }
  };

  // Variant styles
  const getVariantStyles = (): VariantStyles => {
    const priorityColors = getPriorityColors();
    
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: priorityColors?.backgroundColor || resolvedPrimaryColor,
          borderWidth: 0,
          textColor: priorityColors?.textColor || resolvedOnPrimaryColor,
          elevation: 'small',
        };
      
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: priorityColors?.backgroundColor || resolvedOutlineColor,
          textColor: priorityColors?.backgroundColor || resolvedPrimaryColor,
          elevation: 'none',
        };
      
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          textColor: priorityColors?.backgroundColor || resolvedPrimaryColor,
          elevation: 'none',
        };
      
      case 'tonal':
        return {
          backgroundColor: resolvedPrimaryContainerColor,
          borderWidth: 0,
          textColor: resolvedOnPrimaryContainerColor,
          elevation: 'none',
        };
      
      default:
        // Fallback to filled variant
        return {
          backgroundColor: priorityColors?.backgroundColor || resolvedPrimaryColor,
          borderWidth: 0,
          textColor: priorityColors?.textColor || resolvedOnPrimaryColor,
          elevation: 'small',
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Disabled styles
  const getDisabledStyles = (): ViewStyle => {
    if (!disabled) return {};
    
    return {
      backgroundColor: isDark ? '#1F1F1F' : '#F5F5F5',
      borderColor: isDark ? '#3F3F3F' : '#E0E0E0',
      opacity: 0.6,
    };
  };

  const buttonStyles: ViewStyle[] = [
    {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: (Spacing.borderRadius as any)?.lg || 16,
      paddingHorizontal: currentSize.paddingHorizontal,
      paddingVertical: currentSize.paddingVertical,
      minHeight: currentSize.minHeight,
      backgroundColor: variantStyles.backgroundColor,
      borderWidth: variantStyles.borderWidth,
      borderColor: variantStyles.borderColor,
    },
    variantStyles.elevation !== 'none' ? ((Shadows as any)?.[variantStyles.elevation] || {}) : {},
    disabled ? getDisabledStyles() : {},
    style || {},
  ];

  const resolvedTextStyle: TextStyle = {
    color: disabled 
      ? (isDark ? '#666666' : '#999999')
      : variantStyles.textColor,
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      testID={testID}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variantStyles.textColor} 
        />
      ) : (
        <>
          {icon && icon}
          <ThemedText 
            variant={currentSize.textVariant as any}
            style={resolvedTextStyle}
          >
            {title}
          </ThemedText>
        </>
      )}
    </TouchableOpacity>
  );
} 