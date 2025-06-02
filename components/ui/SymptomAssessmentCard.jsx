import { SymptomSeverity } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Card } from './Card';
import { useEnhancedColorScheme } from './ThemeProvider';

// ESAS-r (Edmonton Symptom Assessment System - revised) symptoms
const ESAS_SYMPTOMS = [
  { key: 'pain', label: 'Pain', icon: '⚡' },
  { key: 'tiredness', label: 'Tiredness', icon: '😴' },
  { key: 'nausea', label: 'Nausea', icon: '🤢' },
  { key: 'depression', label: 'Depression', icon: '😢' },
  { key: 'anxiety', label: 'Anxiety', icon: '😰' },
  { key: 'drowsiness', label: 'Drowsiness', icon: '💤' },
  { key: 'appetite', label: 'Appetite', icon: '🍽️' },
  { key: 'wellbeing', label: 'Wellbeing', icon: '💚' },
  { key: 'shortnessOfBreath', label: 'Shortness of Breath', icon: '🫁' },
];

export function SymptomAssessmentCard({
  patient,
  onAssessmentComplete,
  onNavigateToFull,
  style,
  ...props
}) {
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surfaceVariant');
  const onSurfaceColor = useThemeColor({}, 'onSurface');

  const [currentPainLevel, setCurrentPainLevel] = useState(
    patient?.symptoms?.painScale || 0
  );

  const getSymptomColor = (level) => {
    if (level === 0) return SymptomSeverity.none[isDark ? 'dark' : 'light'];
    if (level <= 3) return SymptomSeverity.mild[isDark ? 'dark' : 'light'];
    if (level <= 6) return SymptomSeverity.moderate[isDark ? 'dark' : 'light'];
    if (level <= 8) return SymptomSeverity.severe[isDark ? 'dark' : 'light'];
    return SymptomSeverity.extreme[isDark ? 'dark' : 'light'];
  };

  const handleQuickAssessment = () => {
    const quickAssessment = {
      painLevel: currentPainLevel,
      timestamp: new Date().toISOString(),
      assessedBy: 'Current User', // In real app, get from auth
    };
    
    if (onAssessmentComplete) {
      onAssessmentComplete(quickAssessment);
    }
  };

  return (
    <Card
      title="🩺 Symptom Assessment"
      variant="outlined"
      style={style}
      {...props}
    >
      {/* Quick Pain Assessment */}
      <View style={{ marginBottom: Spacing.lg }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: Spacing.md,
        }}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: getSymptomColor(currentPainLevel),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: Spacing.sm,
          }}>
            <ThemedText variant="titleMedium" style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
              {currentPainLevel}
            </ThemedText>
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText variant="titleSmall">
              Current Pain Level: {currentPainLevel}/10
            </ThemedText>
            <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
              Last assessed: {patient?.symptoms?.lastAssessment || 'Never'}
            </ThemedText>
          </View>
        </View>

        {/* Quick Pain Scale */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md }}>
          <ThemedText variant="bodySmall" style={{ marginRight: Spacing.sm, minWidth: 80 }}>
            Update pain:
          </ThemedText>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setCurrentPainLevel(level)}
                style={{
                  flex: 1,
                  height: 32,
                  marginHorizontal: 1,
                  borderRadius: Spacing.borderRadius.sm,
                  backgroundColor: currentPainLevel === level ? getSymptomColor(level) : 'transparent',
                  borderWidth: 1,
                  borderColor: currentPainLevel === level ? getSymptomColor(level) : primaryColor + '40',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                <ThemedText
                  variant="bodySmall"
                  style={{
                    color: currentPainLevel === level ? '#FFFFFF' : onSurfaceColor,
                    fontWeight: currentPainLevel === level ? 'bold' : 'normal',
                    fontSize: 11,
                  }}
                >
                  {level}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Current Symptoms Overview */}
      {patient?.symptoms?.current && patient.symptoms.current.length > 0 && (
        <View style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.sm, opacity: 0.8 }}>
            Current Symptoms
          </ThemedText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
            {patient.symptoms.current.slice(0, 4).map((symptom, index) => (
              <View 
                key={index} 
                style={{
                  backgroundColor: primaryColor + '20',
                  paddingHorizontal: Spacing.sm,
                  paddingVertical: Spacing.xs,
                  borderRadius: Spacing.borderRadius.sm,
                  borderWidth: 1,
                  borderColor: primaryColor + '40',
                }}
              >
                <ThemedText variant="bodySmall" style={{ color: primaryColor, fontWeight: '600' }}>
                  {symptom.charAt(0).toUpperCase() + symptom.slice(1).replace('-', ' ')}
                </ThemedText>
              </View>
            ))}
            {patient.symptoms.current.length > 4 && (
              <View style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                paddingHorizontal: Spacing.sm,
                paddingVertical: Spacing.xs,
                borderRadius: Spacing.borderRadius.sm,
              }}>
                <ThemedText variant="bodySmall" style={{ opacity: 0.7 }}>
                  +{patient.symptoms.current.length - 4} more
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', gap: Spacing.md }}>
        <TouchableOpacity
          onPress={handleQuickAssessment}
          style={{
            flex: 1,
            backgroundColor: primaryColor,
            paddingVertical: Spacing.md,
            borderRadius: Spacing.borderRadius.md,
            alignItems: 'center',
          }}
          activeOpacity={0.8}
        >
          <ThemedText variant="labelMedium" style={{ color: '#FFFFFF', fontWeight: '600' }}>
            Quick Update
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={onNavigateToFull}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: primaryColor,
            paddingVertical: Spacing.md,
            borderRadius: Spacing.borderRadius.md,
            alignItems: 'center',
          }}
          activeOpacity={0.7}
        >
          <ThemedText variant="labelMedium" style={{ color: primaryColor, fontWeight: '600' }}>
            Full Assessment
          </ThemedText>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

// Compact version for task card integration
export function SymptomAssessmentCompact({
  patient,
  onPress,
  style,
  ...props
}) {
  const primaryColor = useThemeColor({}, 'primary');
  
  const currentPain = patient?.symptoms?.painScale || 0;
  const symptomsCount = patient?.symptoms?.current?.length || 0;
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: primaryColor + '10',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Spacing.borderRadius.md,
        borderWidth: 1,
        borderColor: primaryColor + '30',
      }, style]}
      activeOpacity={0.7}
      {...props}
    >
      <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.xs }}>
        🩺
      </ThemedText>
      <View style={{ flex: 1 }}>
        <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
          Symptom Assessment
        </ThemedText>
        <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
          Pain: {currentPain}/10 • {symptomsCount} symptoms
        </ThemedText>
      </View>
      <ThemedText variant="bodySmall" style={{ color: primaryColor, fontWeight: '600' }}>
        Update →
      </ThemedText>
    </TouchableOpacity>
  );
} 