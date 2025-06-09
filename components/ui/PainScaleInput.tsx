import { SymptomSeverity } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useState } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useEnhancedColorScheme } from './ThemeProvider';

// ===================================================================
// PAIN SCALE TYPES AND INTERFACES
// ===================================================================

/**
 * Pain level range from 0 (no pain) to 10 (worst pain)
 */
export type PainLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Pain severity categories for medical assessment
 */
export type PainSeverity = 'none' | 'mild' | 'moderate' | 'severe' | 'extreme';

/**
 * Props for PainScaleInput component
 */
interface PainScaleInputProps {
  /** Current pain level value (0-10) */
  value?: PainLevel;
  /** Callback when pain level changes */
  onValueChange?: (value: PainLevel) => void;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Show min/max labels */
  showLabels?: boolean;
  /** Show current selection description */
  showDescription?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Test ID for automation */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Additional props */
  [key: string]: any;
}

/**
 * Props for PainScaleCompact component
 */
interface PainScaleCompactProps extends Omit<PainScaleInputProps, 'showLabels' | 'showDescription'> {
  /** Custom container style for compact version */
  style?: ViewStyle;
}

/**
 * Pain color configuration interface
 */
interface PainColorConfig {
  color: string;
  description: string;
  severity: PainSeverity;
}

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

/**
 * Get pain color based on severity level
 */
function getPainColor(painLevel: PainLevel, isDark: boolean): string {
  if (painLevel === 0) return SymptomSeverity.none[isDark ? 'dark' : 'light'];
  if (painLevel <= 3) return SymptomSeverity.mild[isDark ? 'dark' : 'light'];
  if (painLevel <= 6) return SymptomSeverity.moderate[isDark ? 'dark' : 'light'];
  if (painLevel <= 8) return SymptomSeverity.severe[isDark ? 'dark' : 'light'];
  return SymptomSeverity.extreme[isDark ? 'dark' : 'light'];
}

/**
 * Get pain description based on level
 */
function getPainDescription(painLevel: PainLevel): string {
  if (painLevel === 0) return 'No pain';
  if (painLevel <= 3) return 'Mild pain';
  if (painLevel <= 6) return 'Moderate pain';
  if (painLevel <= 8) return 'Severe pain';
  return 'Extreme pain';
}

/**
 * Get pain severity category
 */
function getPainSeverity(painLevel: PainLevel): PainSeverity {
  if (painLevel === 0) return 'none';
  if (painLevel <= 3) return 'mild';
  if (painLevel <= 6) return 'moderate';
  if (painLevel <= 8) return 'severe';
  return 'extreme';
}

/**
 * Validate if a number is a valid pain level
 */
function isValidPainLevel(value: number): value is PainLevel {
  return Number.isInteger(value) && value >= 0 && value <= 10;
}

// ===================================================================
// PAIN SCALE INPUT COMPONENT
// ===================================================================

/**
 * PainScaleInput Component
 * 
 * Comprehensive pain assessment component using the standard 0-10 pain scale.
 * Features visual color coding, accessibility support, and medical-grade accuracy.
 * 
 * @param props - PainScaleInputProps containing value, change handlers, and display options
 * @returns Interactive pain scale component with visual feedback
 */
export function PainScaleInput({
  value = 0,
  onValueChange,
  disabled = false,
  showLabels = true,
  showDescription = true,
  style,
  testID,
  accessibilityLabel,
  ...props
}: PainScaleInputProps): React.JSX.Element {
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedValue, setSelectedValue] = useState<PainLevel>(value);

  const surfaceColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const outlineColor = useThemeColor({}, 'outline');

  // Ensure colors are strings
  const resolvedSurfaceColor = typeof surfaceColor === 'string' ? surfaceColor : '#FFFFFF';
  const resolvedOnSurfaceColor = typeof onSurfaceColor === 'string' ? onSurfaceColor : '#000000';
  const resolvedOutlineColor = typeof outlineColor === 'string' ? outlineColor : '#E0E0E0';

  const handleValueSelect = (newValue: number): void => {
    if (disabled || !isValidPainLevel(newValue)) return;
    
    const painLevel = newValue as PainLevel;
    setSelectedValue(painLevel);
    
    if (onValueChange) {
      onValueChange(painLevel);
    }
  };

  const containerStyle: ViewStyle[] = [
    {
      padding: (Spacing as any)?.md || 16,
      borderRadius: (Spacing.borderRadius as any)?.lg || 16,
      backgroundColor: resolvedSurfaceColor,
      borderWidth: 1,
      borderColor: resolvedOutlineColor,
    },
    style,
  ].filter(Boolean) as ViewStyle[];

  return (
    <View 
      style={containerStyle} 
      testID={testID}
      accessibilityLabel={accessibilityLabel || `Pain scale input, current value ${selectedValue} out of 10`}
      {...props}
    >
      {/* Header */}
      <View style={{ marginBottom: (Spacing as any)?.md || 16 }}>
        <ThemedText variant="titleMedium" style={{ marginBottom: (Spacing as any)?.xs || 4 }}>
          Pain Scale Assessment
        </ThemedText>
        <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
          Rate current pain level from 0 (no pain) to 10 (worst pain)
        </ThemedText>
      </View>

      {/* Pain Scale Grid */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: (Spacing as any)?.md || 16,
      }}>
        {Array.from({ length: 11 }, (_, index) => {
          const painLevel = index as PainLevel;
          const isSelected = selectedValue === painLevel;
          const painColor = getPainColor(painLevel, isDark);
          
          return (
            <TouchableOpacity
              key={painLevel}
              onPress={() => handleValueSelect(painLevel)}
              disabled={disabled}
              style={{
                width: '18%',
                aspectRatio: 1,
                marginBottom: (Spacing as any)?.sm || 8,
                borderRadius: (Spacing.borderRadius as any)?.md || 12,
                backgroundColor: isSelected ? painColor : 'transparent',
                borderWidth: 2,
                borderColor: isSelected ? painColor : resolvedOutlineColor,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: disabled ? 0.5 : 1,
              }}
              activeOpacity={0.7}
              accessibilityLabel={`Pain level ${painLevel}, ${getPainDescription(painLevel)}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled }}
            >
              <ThemedText
                variant="titleLarge"
                style={{
                  color: isSelected ? '#FFFFFF' : resolvedOnSurfaceColor,
                  fontWeight: 'bold',
                }}
              >
                {painLevel}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Current Selection Display */}
      {showDescription && (
        <View style={{
          padding: (Spacing as any)?.md || 16,
          borderRadius: (Spacing.borderRadius as any)?.md || 12,
          backgroundColor: getPainColor(selectedValue, isDark) + '20',
          borderLeftWidth: 4,
          borderLeftColor: getPainColor(selectedValue, isDark),
          marginBottom: (Spacing as any)?.sm || 8,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: getPainColor(selectedValue, isDark),
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: (Spacing as any)?.sm || 8,
            }}>
              <ThemedText
                variant="bodySmall"
                style={{ color: '#FFFFFF', fontWeight: 'bold' }}
              >
                {selectedValue}
              </ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText variant="titleSmall" style={{ marginBottom: (Spacing as any)?.xs || 4 }}>
                {getPainDescription(selectedValue)}
              </ThemedText>
              <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                Selected pain level: {selectedValue}/10 ({getPainSeverity(selectedValue)})
              </ThemedText>
            </View>
          </View>
        </View>
      )}

      {/* Labels */}
      {showLabels && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: (Spacing as any)?.sm || 8,
        }}>
          <ThemedText variant="bodySmall" style={{ opacity: 0.6 }}>
            No pain
          </ThemedText>
          <ThemedText variant="bodySmall" style={{ opacity: 0.6 }}>
            Worst pain
          </ThemedText>
        </View>
      )}
    </View>
  );
}

// ===================================================================
// COMPACT PAIN SCALE COMPONENT
// ===================================================================

/**
 * PainScaleCompact Component
 * 
 * Compact horizontal version of the pain scale for quick assessments
 * and space-constrained layouts.
 * 
 * @param props - PainScaleCompactProps containing value and change handlers
 * @returns Compact horizontal pain scale component
 */
export function PainScaleCompact({
  value = 0,
  onValueChange,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
  ...props
}: PainScaleCompactProps): React.JSX.Element {
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedValue, setSelectedValue] = useState<PainLevel>(value);

  const outlineColor = useThemeColor({}, 'outline');
  const onSurfaceColor = useThemeColor({}, 'onSurface');

  // Ensure colors are strings
  const resolvedOutlineColor = typeof outlineColor === 'string' ? outlineColor : '#E0E0E0';
  const resolvedOnSurfaceColor = typeof onSurfaceColor === 'string' ? onSurfaceColor : '#000000';

  const handleValueSelect = (newValue: number): void => {
    if (disabled || !isValidPainLevel(newValue)) return;
    
    const painLevel = newValue as PainLevel;
    setSelectedValue(painLevel);
    
    if (onValueChange) {
      onValueChange(painLevel);
    }
  };

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    ...(style as ViewStyle || {})
  };

  return (
    <View 
      style={containerStyle}
      testID={testID}
      accessibilityLabel={accessibilityLabel || `Compact pain scale, current value ${selectedValue} out of 10`}
      {...props}
    >
      <ThemedText variant="bodySmall" style={{ marginRight: (Spacing as any)?.sm || 8 }}>
        Pain (0-10):
      </ThemedText>
      
      <View style={{ flexDirection: 'row', flex: 1 }}>
        {Array.from({ length: 11 }, (_, index) => {
          const painLevel = index as PainLevel;
          const isSelected = selectedValue === painLevel;
          const painColor = getPainColor(painLevel, isDark);
          
          return (
            <TouchableOpacity
              key={painLevel}
              onPress={() => handleValueSelect(painLevel)}
              disabled={disabled}
              style={{
                flex: 1,
                height: 32,
                marginHorizontal: 1,
                borderRadius: (Spacing.borderRadius as any)?.sm || 8,
                backgroundColor: isSelected ? painColor : 'transparent',
                borderWidth: 1,
                borderColor: isSelected ? painColor : resolvedOutlineColor,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: disabled ? 0.5 : 1,
              }}
              activeOpacity={0.7}
              accessibilityLabel={`Pain level ${painLevel}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled }}
            >
              <ThemedText
                variant="bodySmall"
                style={{
                  color: isSelected ? '#FFFFFF' : resolvedOnSurfaceColor,
                  fontWeight: isSelected ? 'bold' : 'normal',
                  fontSize: 12,
                }}
              >
                {painLevel}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ===================================================================
// UTILITY EXPORTS
// ===================================================================

/**
 * Utility function to convert pain level to severity category
 */
export { getPainDescription, getPainSeverity, isValidPainLevel };

/**
 * Pain level constants for reference
 */
export const PAIN_LEVELS = {
  NONE: 0 as PainLevel,
  MILD_LOW: 1 as PainLevel,
  MILD_HIGH: 3 as PainLevel,
  MODERATE_LOW: 4 as PainLevel,
  MODERATE_HIGH: 6 as PainLevel,
  SEVERE_LOW: 7 as PainLevel,
  SEVERE_HIGH: 8 as PainLevel,
  EXTREME_LOW: 9 as PainLevel,
  EXTREME_HIGH: 10 as PainLevel,
} as const; 