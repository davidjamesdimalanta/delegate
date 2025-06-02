import { SymptomSeverity } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useEnhancedColorScheme } from './ThemeProvider';

export function PainScaleInput({
  value = 0,
  onValueChange,
  disabled = false,
  showLabels = true,
  showDescription = true,
  style,
  ...props
}) {
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedValue, setSelectedValue] = useState(value);

  const surfaceColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const outlineColor = useThemeColor({}, 'outline');
  const primaryColor = useThemeColor({}, 'primary');

  // Get pain scale color based on severity
  const getPainColor = (painLevel) => {
    if (painLevel === 0) return SymptomSeverity.none[isDark ? 'dark' : 'light'];
    if (painLevel <= 3) return SymptomSeverity.mild[isDark ? 'dark' : 'light'];
    if (painLevel <= 6) return SymptomSeverity.moderate[isDark ? 'dark' : 'light'];
    if (painLevel <= 8) return SymptomSeverity.severe[isDark ? 'dark' : 'light'];
    return SymptomSeverity.extreme[isDark ? 'dark' : 'light'];
  };

  // Get pain description
  const getPainDescription = (painLevel) => {
    if (painLevel === 0) return 'No pain';
    if (painLevel <= 3) return 'Mild pain';
    if (painLevel <= 6) return 'Moderate pain';
    if (painLevel <= 8) return 'Severe pain';
    return 'Extreme pain';
  };

  const handleValueSelect = (newValue) => {
    if (disabled) return;
    
    setSelectedValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const containerStyle = [
    {
      padding: Spacing.md,
      borderRadius: Spacing.borderRadius.lg,
      backgroundColor: surfaceColor,
      borderWidth: 1,
      borderColor: outlineColor,
    },
    style,
  ];

  return (
    <View style={containerStyle} {...props}>
      {/* Header */}
      <View style={{ marginBottom: Spacing.md }}>
        <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.xs }}>
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
        marginBottom: Spacing.md,
      }}>
        {[...Array(11)].map((_, index) => {
          const isSelected = selectedValue === index;
          const painColor = getPainColor(index);
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleValueSelect(index)}
              disabled={disabled}
              style={{
                width: '18%',
                aspectRatio: 1,
                marginBottom: Spacing.sm,
                borderRadius: Spacing.borderRadius.md,
                backgroundColor: isSelected ? painColor : 'transparent',
                borderWidth: 2,
                borderColor: isSelected ? painColor : outlineColor,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: disabled ? 0.5 : 1,
              }}
              activeOpacity={0.7}
            >
              <ThemedText
                variant="titleLarge"
                style={{
                  color: isSelected ? '#FFFFFF' : onSurfaceColor,
                  fontWeight: 'bold',
                }}
              >
                {index}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Current Selection Display */}
      {showDescription && (
        <View style={{
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          backgroundColor: getPainColor(selectedValue) + '20',
          borderLeftWidth: 4,
          borderLeftColor: getPainColor(selectedValue),
          marginBottom: Spacing.sm,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: getPainColor(selectedValue),
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: Spacing.sm,
            }}>
              <ThemedText
                variant="bodySmall"
                style={{ color: '#FFFFFF', fontWeight: 'bold' }}
              >
                {selectedValue}
              </ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText variant="titleSmall" style={{ marginBottom: Spacing.xs }}>
                {getPainDescription(selectedValue)}
              </ThemedText>
              <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                Selected pain level: {selectedValue}/10
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
          paddingHorizontal: Spacing.sm,
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

// Compact version for quick assessment
export function PainScaleCompact({
  value = 0,
  onValueChange,
  disabled = false,
  style,
  ...props
}) {
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedValue, setSelectedValue] = useState(value);

  const outlineColor = useThemeColor({}, 'outline');
  const onSurfaceColor = useThemeColor({}, 'onSurface');

  const getPainColor = (painLevel) => {
    if (painLevel === 0) return SymptomSeverity.none[isDark ? 'dark' : 'light'];
    if (painLevel <= 3) return SymptomSeverity.mild[isDark ? 'dark' : 'light'];
    if (painLevel <= 6) return SymptomSeverity.moderate[isDark ? 'dark' : 'light'];
    if (painLevel <= 8) return SymptomSeverity.severe[isDark ? 'dark' : 'light'];
    return SymptomSeverity.extreme[isDark ? 'dark' : 'light'];
  };

  const handleValueSelect = (newValue) => {
    if (disabled) return;
    setSelectedValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]} {...props}>
      <ThemedText variant="bodySmall" style={{ marginRight: Spacing.sm }}>
        Pain (0-10):
      </ThemedText>
      
      <View style={{ flexDirection: 'row', flex: 1 }}>
        {[...Array(11)].map((_, index) => {
          const isSelected = selectedValue === index;
          const painColor = getPainColor(index);
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleValueSelect(index)}
              disabled={disabled}
              style={{
                flex: 1,
                height: 32,
                marginHorizontal: 1,
                borderRadius: Spacing.borderRadius.sm,
                backgroundColor: isSelected ? painColor : 'transparent',
                borderWidth: 1,
                borderColor: isSelected ? painColor : outlineColor,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: disabled ? 0.5 : 1,
              }}
              activeOpacity={0.7}
            >
              <ThemedText
                variant="bodySmall"
                style={{
                  color: isSelected ? '#FFFFFF' : onSurfaceColor,
                  fontWeight: isSelected ? 'bold' : 'normal',
                  fontSize: 12,
                }}
              >
                {index}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
} 