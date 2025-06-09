import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useTheme, type ThemeMode } from './ThemeProvider';

// ===================================================================
// THEME SETTINGS TYPES AND INTERFACES
// ===================================================================

/**
 * Theme option configuration
 */
interface ThemeOption {
  key: ThemeMode;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

/**
 * Props for ThemeSettings component
 */
interface ThemeSettingsProps {
  /** Custom container style */
  style?: ViewStyle;
  /** Test ID for automation */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Show detailed descriptions */
  showDescriptions?: boolean;
  /** Compact layout mode */
  compact?: boolean;
}

/**
 * Props for ThemeToggleButton component
 */
interface ThemeToggleButtonProps {
  /** Custom container style */
  style?: ViewStyle;
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Test ID for automation */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Show current theme indicator */
  showIndicator?: boolean;
}

// ===================================================================
// THEME OPTION CONFIGURATIONS
// ===================================================================

/**
 * Available theme options with metadata
 */
const THEME_OPTIONS: ThemeOption[] = [
  {
    key: 'light',
    label: 'Light',
    icon: 'sunny-outline',
    description: 'Always use light theme'
  },
  {
    key: 'dark',
    label: 'Dark',
    icon: 'moon-outline',
    description: 'Always use dark theme'
  },
  {
    key: 'system',
    label: 'System',
    icon: 'phone-portrait-outline',
    description: 'Follow system setting'
  }
] as const;

/**
 * Theme icon mapping
 */
const THEME_ICONS: Record<ThemeMode, keyof typeof Ionicons.glyphMap> = {
  light: 'sunny',
  dark: 'moon',
  system: 'phone-portrait'
} as const;

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

/**
 * Get theme mode icon
 */
function getThemeIcon(themeMode: ThemeMode): keyof typeof Ionicons.glyphMap {
  return THEME_ICONS[themeMode] || 'phone-portrait';
}

/**
 * Get button size dimensions
 */
function getButtonSize(size: ThemeToggleButtonProps['size']): number {
  switch (size) {
    case 'small': return 36;
    case 'large': return 52;
    case 'medium':
    default: return 44;
  }
}

/**
 * Get icon size for button
 */
function getIconSize(size: ThemeToggleButtonProps['size']): number {
  switch (size) {
    case 'small': return 16;
    case 'large': return 24;
    case 'medium':
    default: return 20;
  }
}

// ===================================================================
// THEME SETTINGS COMPONENT
// ===================================================================

/**
 * ThemeSettings Component
 * 
 * Comprehensive theme configuration interface with options for light, dark,
 * and system theme modes. Includes accessibility support and visual feedback.
 * 
 * @param props - ThemeSettingsProps containing style and configuration options
 * @returns Interactive theme settings panel with option selection
 */
export function ThemeSettings({
  style,
  testID,
  accessibilityLabel,
  showDescriptions = true,
  compact = false,
}: ThemeSettingsProps): React.JSX.Element {
  const { themeMode, setThemeMode, colorScheme } = useTheme();
  
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const outlineColor = useThemeColor({}, 'outline');

  // Ensure colors are strings
  const resolvedPrimaryColor = typeof primaryColor === 'string' ? primaryColor : '#6750A4';
  const resolvedSurfaceColor = typeof surfaceColor === 'string' ? surfaceColor : '#FFFFFF';
  const resolvedOnSurfaceColor = typeof onSurfaceColor === 'string' ? onSurfaceColor : '#000000';
  const resolvedOutlineColor = typeof outlineColor === 'string' ? outlineColor : '#E0E0E0';

  const handleThemeChange = (newThemeMode: ThemeMode): void => {
    setThemeMode(newThemeMode);
  };

  const renderThemeOption = (option: ThemeOption): React.JSX.Element => {
    const isSelected = themeMode === option.key;
    
    return (
      <TouchableOpacity
        key={option.key}
        onPress={() => handleThemeChange(option.key)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: compact ? (Spacing as any)?.sm || 8 : (Spacing as any)?.md || 16,
          borderRadius: (Spacing.borderRadius as any)?.md || 12,
          borderWidth: 1,
          borderColor: isSelected ? resolvedPrimaryColor : resolvedOutlineColor,
          backgroundColor: isSelected ? resolvedPrimaryColor + '10' : 'transparent',
          marginBottom: (Spacing as any)?.sm || 8,
        }}
        activeOpacity={0.7}
        accessibilityLabel={`Select ${option.label} theme. ${option.description}`}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
      >
        <View style={{
          width: compact ? 32 : 40,
          height: compact ? 32 : 40,
          borderRadius: compact ? 16 : 20,
          backgroundColor: isSelected ? resolvedPrimaryColor : resolvedSurfaceColor,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: (Spacing as any)?.md || 16,
          borderWidth: 1,
          borderColor: resolvedOutlineColor,
        }}>
          <Ionicons
            name={option.icon}
            size={compact ? 16 : 20}
            color={isSelected ? '#FFFFFF' : resolvedOnSurfaceColor}
          />
        </View>
        
        <View style={{ flex: 1 }}>
          <ThemedText 
            variant={compact ? "bodyMedium" : "titleSmall"}
            style={{ 
              color: isSelected ? resolvedPrimaryColor : resolvedOnSurfaceColor,
              marginBottom: showDescriptions ? (Spacing as any)?.xs || 4 : 0
            }}
          >
            {option.label}
          </ThemedText>
          {showDescriptions && (
            <ThemedText 
              variant="bodySmall"
              style={{ 
                color: resolvedOnSurfaceColor,
                opacity: 0.7 
              }}
            >
              {option.description}
            </ThemedText>
          )}
        </View>
        
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={compact ? 20 : 24}
            color={resolvedPrimaryColor}
          />
        )}
      </TouchableOpacity>
    );
  };

  const containerStyle: ViewStyle = {
    padding: (Spacing as any)?.md || 16,
    ...(style as ViewStyle || {})
  };

  return (
    <ThemedView 
      style={containerStyle}
      testID={testID}
      accessibilityLabel={accessibilityLabel || 'Theme settings panel'}
    >
      {!compact && (
        <>
          <ThemedText 
            variant="titleMedium"
            style={{ 
              marginBottom: (Spacing as any)?.md || 16,
              color: resolvedOnSurfaceColor 
            }}
          >
            Theme Settings
          </ThemedText>
          
          <ThemedText 
            variant="bodyMedium"
            style={{ 
              marginBottom: (Spacing as any)?.lg || 24,
              color: resolvedOnSurfaceColor,
              opacity: 0.8 
            }}
          >
            Choose how the app should appear. The system option will follow your device&apos;s theme setting.
          </ThemedText>
        </>
      )}

      <View accessibilityRole="radiogroup">
        {THEME_OPTIONS.map(renderThemeOption)}
      </View>

      {!compact && (
        <View style={{
          marginTop: (Spacing as any)?.lg || 24,
          padding: (Spacing as any)?.md || 16,
          borderRadius: (Spacing.borderRadius as any)?.md || 12,
          backgroundColor: resolvedSurfaceColor,
          borderWidth: 1,
          borderColor: resolvedOutlineColor,
        }}>
          <ThemedText 
            variant="labelMedium"
            style={{ 
              color: resolvedOnSurfaceColor,
              opacity: 0.7,
              marginBottom: (Spacing as any)?.xs || 4
            }}
          >
            Current theme: {colorScheme}
          </ThemedText>
          <ThemedText 
            variant="bodySmall"
            style={{ 
              color: resolvedOnSurfaceColor,
              opacity: 0.6 
            }}
          >
            Theme changes are saved automatically and will persist when you restart the app.
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

// ===================================================================
// THEME TOGGLE BUTTON COMPONENT
// ===================================================================

/**
 * ThemeToggleButton Component
 * 
 * Compact theme toggle button for headers, toolbars, and quick access areas.
 * Cycles through theme modes and provides visual feedback.
 * 
 * @param props - ThemeToggleButtonProps containing style and size options
 * @returns Compact theme toggle button with current theme indicator
 */
export function ThemeToggleButton({
  style,
  size = 'medium',
  testID,
  accessibilityLabel,
  showIndicator = false,
}: ThemeToggleButtonProps): React.JSX.Element {
  const { toggleTheme, themeMode, colorScheme } = useTheme();
  
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');

  // Ensure colors are strings
  const resolvedPrimaryColor = typeof primaryColor === 'string' ? primaryColor : '#6750A4';
  const resolvedSurfaceColor = typeof surfaceColor === 'string' ? surfaceColor : '#FFFFFF';

  const buttonSize = getButtonSize(size);
  const iconSize = getIconSize(size);
  const icon = getThemeIcon(themeMode);

  const buttonStyle: ViewStyle = {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: resolvedSurfaceColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: resolvedPrimaryColor + '30',
    ...(style as ViewStyle || {})
  };

  const handleToggle = (): void => {
    toggleTheme();
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handleToggle}
        style={buttonStyle}
        activeOpacity={0.7}
        testID={testID}
        accessibilityLabel={accessibilityLabel || `Toggle theme. Current: ${themeMode} mode, ${colorScheme} appearance`}
        accessibilityRole="button"
        accessibilityHint="Cycles between light, dark, and system theme modes"
      >
        <Ionicons
          name={icon}
          size={iconSize}
          color={resolvedPrimaryColor}
        />
      </TouchableOpacity>
      
      {showIndicator && (
        <View style={{
          position: 'absolute',
          top: -2,
          right: -2,
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: resolvedPrimaryColor,
          borderWidth: 1,
          borderColor: resolvedSurfaceColor,
        }} />
      )}
    </View>
  );
}

// ===================================================================
// UTILITY EXPORTS
// ===================================================================

/**
 * Export theme-related utilities
 */
export { getThemeIcon, THEME_ICONS, THEME_OPTIONS };

/**
 * Export types for external use
 */
    export type { ThemeOption, ThemeSettingsProps, ThemeToggleButtonProps };
