import { useEnhancedColorScheme } from '@/components/ui/ThemeProvider';
import { MedicalPriority, PalliativePriority } from '@/constants/Colors';
import { Shadows, Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';

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
  ...props
}) {
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

  // Size configurations
  const sizeConfig = {
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

  const currentSize = sizeConfig[size];

  // Get priority colors if specified - supports both priority systems
  const getPriorityColors = () => {
    if (!priority) return null;
    
    // Use palliative priority system by default, fall back to medical priority
    const prioritySystem = usePalliativePriority ? PalliativePriority : MedicalPriority;
    const priorityColors = prioritySystem[priority];
    
    if (!priorityColors) {
      // Try the other system if priority not found
      const fallbackSystem = usePalliativePriority ? MedicalPriority : PalliativePriority;
      const fallbackColors = fallbackSystem[priority];
      
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
  };

  // Variant styles
  const getVariantStyles = () => {
    const priorityColors = getPriorityColors();
    
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: priorityColors?.backgroundColor || primaryColor,
          borderWidth: 0,
          textColor: priorityColors?.textColor || onPrimaryColor,
          elevation: 'small',
        };
      
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: priorityColors?.backgroundColor || outlineColor,
          textColor: priorityColors?.backgroundColor || primaryColor,
          elevation: 'none',
        };
      
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          textColor: priorityColors?.backgroundColor || primaryColor,
          elevation: 'none',
        };
      
      case 'tonal':
        return {
          backgroundColor: primaryContainerColor,
          borderWidth: 0,
          textColor: onPrimaryContainerColor,
          elevation: 'none',
        };
      
      default:
        return getVariantStyles('filled');
    }
  };

  const variantStyles = getVariantStyles();

  // Disabled styles
  const getDisabledStyles = () => {
    if (!disabled) return {};
    
    return {
      backgroundColor: isDark ? '#1F1F1F' : '#F5F5F5',
      borderColor: isDark ? '#3F3F3F' : '#E0E0E0',
      opacity: 0.6,
    };
  };

  const buttonStyles = [
    {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: Spacing.borderRadius.lg,
      paddingHorizontal: currentSize.paddingHorizontal,
      paddingVertical: currentSize.paddingVertical,
      minHeight: currentSize.minHeight,
      backgroundColor: variantStyles.backgroundColor,
      borderWidth: variantStyles.borderWidth,
      borderColor: variantStyles.borderColor,
    },
    variantStyles.elevation !== 'none' && Shadows[variantStyles.elevation],
    disabled && getDisabledStyles(),
    style,
  ].filter(Boolean);

  const textStyles = [
    {
      color: disabled 
        ? (isDark ? '#666666' : '#999999')
        : variantStyles.textColor,
    },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
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
            variant={currentSize.textVariant}
            style={textStyles}
          >
            {title}
          </ThemedText>
        </>
      )}
    </TouchableOpacity>
  );
} 