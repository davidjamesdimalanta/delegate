import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Card } from './Card';

const CARE_GOALS = [
  { key: 'comfort-focused', label: 'Comfort Focused', icon: '🕊️', description: 'Focus on comfort and symptom management' },
  { key: 'limited-interventions', label: 'Limited Interventions', icon: '⚖️', description: 'Some treatments with comfort priority' },
  { key: 'life-prolonging', label: 'Life Prolonging', icon: '💪', description: 'All appropriate treatments' },
  { key: 'undecided', label: 'Under Discussion', icon: '💭', description: 'Goals being discussed with family' },
];

const ADVANCE_DIRECTIVES = [
  { key: 'dnr', label: 'DNR', description: 'Do Not Resuscitate' },
  { key: 'dni', label: 'DNI', description: 'Do Not Intubate' },
  { key: 'molst', label: 'MOLST', description: 'Medical Orders for Life-Sustaining Treatment' },
  { key: 'polst', label: 'POLST', description: 'Physician Orders for Life-Sustaining Treatment' },
];

export function GoalsOfCareCard({
  patient,
  onGoalsUpdate,
  onNavigateToFull,
  style,
  ...props
}) {
  const primaryColor = useThemeColor({}, 'primary');
  const onSurfaceColor = useThemeColor({}, 'onSurface');

  const [selectedGoal, setSelectedGoal] = useState(null);

  const palliativeCare = patient?.palliativeCare;
  const currentGoals = palliativeCare?.goalsOfCare;
  const advanceDirectives = palliativeCare?.advanceDirectives;
  const prognosis = palliativeCare?.prognosis;

  const handleGoalsDiscussion = () => {
    Alert.alert(
      'Goals of Care Discussion',
      'Would you like to document a goals of care conversation with this patient/family?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Document', 
          onPress: () => {
            const goalsEntry = {
              type: 'goals-discussion',
              timestamp: new Date().toISOString(),
              discussedBy: 'Current User', // In real app, get from auth
              participantsIncluded: ['patient', 'family'], // Could be dynamic
            };
            
            if (onGoalsUpdate) {
              onGoalsUpdate(goalsEntry);
            }
          }
        }
      ]
    );
  };

  const handleAdvanceDirectiveUpdate = () => {
    Alert.alert(
      'Advance Directives',
      'Would you like to review or update advance directives?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Review', 
          onPress: () => {
            const directiveEntry = {
              type: 'advance-directive-review',
              timestamp: new Date().toISOString(),
              reviewedBy: 'Current User',
            };
            
            if (onGoalsUpdate) {
              onGoalsUpdate(directiveEntry);
            }
          }
        }
      ]
    );
  };

  const getCurrentGoalInfo = () => {
    return CARE_GOALS.find(goal => goal.key === currentGoals) || CARE_GOALS[3]; // Default to undecided
  };

  const currentGoalInfo = getCurrentGoalInfo();

  return (
    <Card
      title="🎯 Goals of Care"
      variant="outlined"
      style={style}
      {...props}
    >
      {/* Current Goals */}
      <View style={{ marginBottom: Spacing.lg }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: Spacing.sm,
        }}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: primaryColor + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: Spacing.sm,
          }}>
            <ThemedText variant="titleMedium">
              {currentGoalInfo.icon}
            </ThemedText>
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText variant="titleSmall" style={{ marginBottom: Spacing.xs }}>
              Current Goals
            </ThemedText>
            <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
              {currentGoalInfo.label}
            </ThemedText>
            <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
              {currentGoalInfo.description}
            </ThemedText>
          </View>
        </View>

        {/* Prognosis */}
        {prognosis && (
          <View style={{
            backgroundColor: 'rgba(0,0,0,0.05)',
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            borderRadius: Spacing.borderRadius.sm,
            marginBottom: Spacing.sm,
          }}>
            <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
              Prognosis: <ThemedText style={{ fontWeight: '600' }}>{prognosis}</ThemedText>
            </ThemedText>
          </View>
        )}
      </View>

      {/* Advance Directives Status */}
      {advanceDirectives && (
        <View style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.sm, opacity: 0.8 }}>
            Advance Directives
          </ThemedText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
            {ADVANCE_DIRECTIVES.map((directive) => {
              const isActive = advanceDirectives[directive.key];
              return (
                <View 
                  key={directive.key}
                  style={{
                    backgroundColor: isActive ? primaryColor + '20' : 'rgba(0,0,0,0.05)',
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: Spacing.xs,
                    borderRadius: Spacing.borderRadius.sm,
                    borderWidth: 1,
                    borderColor: isActive ? primaryColor + '40' : 'rgba(0,0,0,0.1)',
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  <ThemedText 
                    variant="bodySmall" 
                    style={{ 
                      color: isActive ? primaryColor : onSurfaceColor, 
                      fontWeight: isActive ? '600' : 'normal'
                    }}
                  >
                    {directive.label}
                  </ThemedText>
                </View>
              );
            })}
          </View>
          
          {advanceDirectives.lastUpdated && (
            <ThemedText variant="bodySmall" style={{ opacity: 0.6, marginTop: Spacing.sm }}>
              Last updated: {advanceDirectives.lastUpdated}
            </ThemedText>
          )}
        </View>
      )}

      {/* Preferred Care Location */}
      {palliativeCare?.preferredPlaceOfCare && (
        <View style={{ marginBottom: Spacing.lg }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.05)',
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            borderRadius: Spacing.borderRadius.sm,
          }}>
            <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
              🏠
            </ThemedText>
            <View style={{ flex: 1 }}>
              <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                Preferred care location
              </ThemedText>
              <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                {palliativeCare.preferredPlaceOfCare}
              </ThemedText>
            </View>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', gap: Spacing.md }}>
        <TouchableOpacity
          onPress={handleGoalsDiscussion}
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
            Goals Discussion
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleAdvanceDirectiveUpdate}
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
            Review Directives
          </ThemedText>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

// Compact version for task card integration
export function GoalsOfCareCompact({
  patient,
  onPress,
  style,
  ...props
}) {
  const primaryColor = useThemeColor({}, 'primary');
  
  const palliativeCare = patient?.palliativeCare;
  const currentGoals = palliativeCare?.goalsOfCare || 'undecided';
  const prognosis = palliativeCare?.prognosis || 'unknown';
  const advanceDirectives = palliativeCare?.advanceDirectives;
  
  // Count active directives
  const activeDirectives = advanceDirectives ? 
    Object.values(advanceDirectives).filter(Boolean).length : 0;
  
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
        🎯
      </ThemedText>
      <View style={{ flex: 1 }}>
        <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
          Goals of Care
        </ThemedText>
        <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
          {currentGoals} • {prognosis} • {activeDirectives} directives
        </ThemedText>
      </View>
      <ThemedText variant="bodySmall" style={{ color: primaryColor, fontWeight: '600' }}>
        Plan →
      </ThemedText>
    </TouchableOpacity>
  );
} 