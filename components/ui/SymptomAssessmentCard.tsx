import { SymptomSeverity } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import type {
    EnhancedPatient as Patient
} from '@/lib/types/nursing-types';
import React, { useState } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Card } from './Card';
import type { PainLevel } from './PainScaleInput';
import { useEnhancedColorScheme } from './ThemeProvider';

// ===================================================================
// SYMPTOM ASSESSMENT TYPES AND INTERFACES
// ===================================================================

/**
 * ESAS-r (Edmonton Symptom Assessment System - revised) symptoms
 */
export const ESAS_SYMPTOMS = [
  { key: 'pain', label: 'Pain', icon: '⚡' },
  { key: 'tiredness', label: 'Tiredness', icon: '😴' },
  { key: 'nausea', label: 'Nausea', icon: '🤢' },
  { key: 'depression', label: 'Depression', icon: '😢' },
  { key: 'anxiety', label: 'Anxiety', icon: '😰' },
  { key: 'drowsiness', label: 'Drowsiness', icon: '💤' },
  { key: 'appetite', label: 'Appetite', icon: '🍽️' },
  { key: 'wellbeing', label: 'Wellbeing', icon: '💚' },
  { key: 'shortnessOfBreath', label: 'Shortness of Breath', icon: '🫁' },
] as const;

/**
 * Quick assessment data structure
 */
interface QuickAssessment {
  painLevel: PainLevel;
  timestamp: string;
  assessedBy: string;
  type: 'quick' | 'full';
  notes?: string;
}

/**
 * Symptom display information
 */
interface SymptomDisplay {
  name: string;
  severity: number;
  color: string;
  icon?: string;
}

/**
 * Props for SymptomAssessmentCard component
 */
interface SymptomAssessmentCardProps {
  /** Patient data with symptom information */
  patient: Patient;
  /** Callback when assessment is completed */
  onAssessmentComplete?: (assessment: QuickAssessment) => void;
  /** Callback to navigate to full assessment */
  onNavigateToFull?: () => void;
  /** Custom container style */
  style?: ViewStyle;
  /** Test ID for automation */
  testID?: string;
  /** Whether the component is read-only */
  readOnly?: boolean;
  /** Show detailed symptom breakdown */
  showDetails?: boolean;
  /** Additional props */
  [key: string]: any;
}

/**
 * Props for SymptomAssessmentCompact component
 */
interface SymptomAssessmentCompactProps {
  /** Patient data with symptom information */
  patient: Patient;
  /** Callback when pressed */
  onPress?: () => void;
  /** Custom container style */
  style?: ViewStyle;
  /** Test ID for automation */
  testID?: string;
  /** Additional props */
  [key: string]: any;
}

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

/**
 * Get symptom severity color based on level (0-10 scale)
 */
function getSymptomColor(level: number, isDark: boolean): string {
  if (level === 0) return SymptomSeverity.none[isDark ? 'dark' : 'light'];
  if (level <= 3) return SymptomSeverity.mild[isDark ? 'dark' : 'light'];
  if (level <= 6) return SymptomSeverity.moderate[isDark ? 'dark' : 'light'];
  if (level <= 8) return SymptomSeverity.severe[isDark ? 'dark' : 'light'];
  return SymptomSeverity.extreme[isDark ? 'dark' : 'light'];
}

/**
 * Format symptom name for display
 */
function formatSymptomName(symptom: string): string {
  return symptom.charAt(0).toUpperCase() + symptom.slice(1).replace('-', ' ');
}

/**
 * Get current symptoms from patient data
 */
function getCurrentSymptoms(patient: Patient): string[] {
  if (!patient.symptoms?.current) return [];
  return Array.isArray(patient.symptoms.current) ? patient.symptoms.current : [];
}

/**
 * Get pain level from patient data
 */
function getPainLevel(patient: Patient): PainLevel {
  const painLevel = patient.symptoms?.painScale || patient.symptoms?.pain || 0;
  return Math.max(0, Math.min(10, Math.round(painLevel))) as PainLevel;
}

/**
 * Get last assessment timestamp
 */
function getLastAssessmentTime(patient: Patient): string {
  return patient.symptoms?.lastAssessment || 
         patient.symptoms?.assessments?.[0]?.timestamp || 
         'Never';
}

// ===================================================================
// SYMPTOM ASSESSMENT CARD COMPONENT
// ===================================================================

/**
 * SymptomAssessmentCard Component
 * 
 * Comprehensive symptom assessment interface for palliative care patients.
 * Supports quick pain updates and full ESAS-r symptom tracking.
 * 
 * @param props - SymptomAssessmentCardProps containing patient data and callbacks
 * @returns Interactive symptom assessment card with pain scale and symptom tracking
 */
export function SymptomAssessmentCard({
  patient,
  onAssessmentComplete,
  onNavigateToFull,
  style,
  testID,
  readOnly = false,
  showDetails = true,
  ...props
}: SymptomAssessmentCardProps): React.JSX.Element {
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';
  
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surfaceVariant');
  const onSurfaceColor = useThemeColor({}, 'onSurface');

  // Ensure colors are strings
  const resolvedPrimaryColor = typeof primaryColor === 'string' ? primaryColor : '#6750A4';
  const resolvedOnSurfaceColor = typeof onSurfaceColor === 'string' ? onSurfaceColor : '#000000';

  const [currentPainLevel, setCurrentPainLevel] = useState<PainLevel>(getPainLevel(patient));
  const currentSymptoms = getCurrentSymptoms(patient);
  const lastAssessment = getLastAssessmentTime(patient);

  const handleQuickAssessment = (): void => {
    if (readOnly || !onAssessmentComplete) return;

    const quickAssessment: QuickAssessment = {
      painLevel: currentPainLevel,
      timestamp: new Date().toISOString(),
      assessedBy: 'Current User', // In real app, get from auth
      type: 'quick',
    };
    
    onAssessmentComplete(quickAssessment);
  };

  const handlePainLevelChange = (level: number): void => {
    if (readOnly) return;
    
    const painLevel = Math.max(0, Math.min(10, Math.round(level))) as PainLevel;
    setCurrentPainLevel(painLevel);
  };

  return (
    <Card
      title="🩺 Symptom Assessment"
      variant="outlined"
      style={style}
      testID={testID}
      {...props}
    >
      {/* Quick Pain Assessment */}
      <View style={{ marginBottom: (Spacing as any)?.lg || 24 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: (Spacing as any)?.md || 16,
        }}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: getSymptomColor(currentPainLevel, isDark),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: (Spacing as any)?.sm || 8,
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
              Last assessed: {lastAssessment}
            </ThemedText>
          </View>
        </View>

        {/* Quick Pain Scale */}
        {!readOnly && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: (Spacing as any)?.md || 16 }}>
            <ThemedText variant="bodySmall" style={{ marginRight: (Spacing as any)?.sm || 8, minWidth: 80 }}>
              Update pain:
            </ThemedText>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              {Array.from({ length: 11 }, (_, index) => {
                const level = index as PainLevel;
                return (
                  <TouchableOpacity
                    key={level}
                    onPress={() => handlePainLevelChange(level)}
                    style={{
                      flex: 1,
                      height: 32,
                      marginHorizontal: 1,
                      borderRadius: (Spacing.borderRadius as any)?.sm || 8,
                      backgroundColor: currentPainLevel === level ? getSymptomColor(level, isDark) : 'transparent',
                      borderWidth: 1,
                      borderColor: currentPainLevel === level ? getSymptomColor(level, isDark) : resolvedPrimaryColor + '40',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    activeOpacity={0.7}
                    accessibilityLabel={`Pain level ${level}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: currentPainLevel === level }}
                  >
                    <ThemedText
                      variant="bodySmall"
                      style={{
                        color: currentPainLevel === level ? '#FFFFFF' : resolvedOnSurfaceColor,
                        fontWeight: currentPainLevel === level ? 'bold' : 'normal',
                        fontSize: 11,
                      }}
                    >
                      {level}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>

      {/* Current Symptoms Overview */}
      {showDetails && currentSymptoms.length > 0 && (
        <View style={{ marginBottom: (Spacing as any)?.lg || 24 }}>
          <ThemedText variant="labelMedium" style={{ marginBottom: (Spacing as any)?.sm || 8, opacity: 0.8 }}>
            Current Symptoms
          </ThemedText>
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: (Spacing as any)?.sm || 8 
          }}>
            {currentSymptoms.slice(0, 4).map((symptom, index) => (
              <View 
                key={`${symptom}-${index}`}
                style={{
                  backgroundColor: resolvedPrimaryColor + '20',
                  paddingHorizontal: (Spacing as any)?.sm || 8,
                  paddingVertical: (Spacing as any)?.xs || 4,
                  borderRadius: (Spacing.borderRadius as any)?.sm || 8,
                  borderWidth: 1,
                  borderColor: resolvedPrimaryColor + '40',
                }}
              >
                <ThemedText variant="bodySmall" style={{ color: resolvedPrimaryColor, fontWeight: '600' }}>
                  {formatSymptomName(symptom)}
                </ThemedText>
              </View>
            ))}
            {currentSymptoms.length > 4 && (
              <View style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                paddingHorizontal: (Spacing as any)?.sm || 8,
                paddingVertical: (Spacing as any)?.xs || 4,
                borderRadius: (Spacing.borderRadius as any)?.sm || 8,
              }}>
                <ThemedText variant="bodySmall" style={{ opacity: 0.7 }}>
                  +{currentSymptoms.length - 4} more
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      {!readOnly && (
        <View style={{ flexDirection: 'row', gap: (Spacing as any)?.md || 16 }}>
          <TouchableOpacity
            onPress={handleQuickAssessment}
            style={{
              flex: 1,
              backgroundColor: resolvedPrimaryColor,
              paddingVertical: (Spacing as any)?.md || 16,
              borderRadius: (Spacing.borderRadius as any)?.md || 12,
              alignItems: 'center',
            }}
            activeOpacity={0.8}
            accessibilityLabel="Save quick assessment"
            accessibilityRole="button"
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
              borderColor: resolvedPrimaryColor,
              paddingVertical: (Spacing as any)?.md || 16,
              borderRadius: (Spacing.borderRadius as any)?.md || 12,
              alignItems: 'center',
            }}
            activeOpacity={0.7}
            accessibilityLabel="Open full assessment"
            accessibilityRole="button"
          >
            <ThemedText variant="labelMedium" style={{ color: resolvedPrimaryColor, fontWeight: '600' }}>
              Full Assessment
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
}

// ===================================================================
// COMPACT SYMPTOM ASSESSMENT COMPONENT
// ===================================================================

/**
 * SymptomAssessmentCompact Component
 * 
 * Compact version for task card integration and quick overview display.
 * Shows key symptom metrics in a condensed format.
 * 
 * @param props - SymptomAssessmentCompactProps containing patient data and press handler
 * @returns Compact symptom assessment overview component
 */
export function SymptomAssessmentCompact({
  patient,
  onPress,
  style,
  testID,
  ...props
}: SymptomAssessmentCompactProps): React.JSX.Element {
  const primaryColor = useThemeColor({}, 'primary');
  const resolvedPrimaryColor = typeof primaryColor === 'string' ? primaryColor : '#6750A4';
  
  const currentPain = getPainLevel(patient);
  const symptomsCount = getCurrentSymptoms(patient).length;
  
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: resolvedPrimaryColor + '10',
    paddingHorizontal: (Spacing as any)?.md || 16,
    paddingVertical: (Spacing as any)?.sm || 8,
    borderRadius: (Spacing.borderRadius as any)?.md || 12,
    borderWidth: 1,
    borderColor: resolvedPrimaryColor + '30',
    ...(style as ViewStyle || {})
  };
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={containerStyle}
      activeOpacity={0.7}
      testID={testID}
      accessibilityLabel={`Symptom assessment: Pain level ${currentPain} out of 10, ${symptomsCount} symptoms tracked`}
      accessibilityRole="button"
      {...props}
    >
      <ThemedText variant="bodyMedium" style={{ marginRight: (Spacing as any)?.xs || 4 }}>
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
      <ThemedText variant="bodySmall" style={{ color: resolvedPrimaryColor, fontWeight: '600' }}>
        Update →
      </ThemedText>
    </TouchableOpacity>
  );
}

// ===================================================================
// UTILITY EXPORTS
// ===================================================================

/**
 * Export utility functions for external use
 */
export {
    formatSymptomName,
    getCurrentSymptoms, getLastAssessmentTime, getPainLevel, getSymptomColor
};

/**
 * Export types for external use
 */
    export type {
        QuickAssessment, SymptomAssessmentCardProps,
        SymptomAssessmentCompactProps, SymptomDisplay
    };
