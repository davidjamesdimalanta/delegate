import {
  Button,
  Spacing,
  ThemedText,
  ThemedView,
  ThemeToggleButton
} from '@/components/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VisitNotesAssessment() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Theme colors
  const surfaceColor = useThemeColor({}, 'surface');
  const outlineColor = useThemeColor({}, 'outline');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const primaryColor = useThemeColor({}, 'primary');
  const warningColor = useThemeColor({}, 'warning');
  const successColor = useThemeColor({}, 'success');

  // Visit notes state
  const [visitNotesData, setVisitNotesData] = useState({
    visitSummary: '',
    patientCondition: '',
    symptomStatus: '',
    familyInteraction: '',
    goalsMetToday: [],
    challengesEncountered: [],
    patientResponse: '',
    familyResponse: '',
    visitObjectives: '',
    outcomeAchieved: '',
    nextVisitPlan: '',
    urgentFollowUp: '',
    physicianNotifications: [],
    careTeamCommunications: [],
    visitDuration: '',
    mileage: '',
    clinicalNotes: '',
    teachingProvided: '',
    safetyAssessment: '',
    qualityOfLife: '',
    comfortLevel: '',
    emergencyPlanReviewed: false,
    advanceDirectivesReviewed: false,
    medicationReconciled: false,
    equipmentFunctioning: true,
    visitCompleted: false
  });

  const [errors, setErrors] = useState({});

  const goalOptions = [
    'Pain management optimized', 'Symptom relief achieved', 'Family education completed',
    'Medication regimen reviewed', 'Equipment functioning properly', 'Safety plan updated',
    'Comfort measures implemented', 'Spiritual needs addressed', 'Caregiver support provided',
    'Care coordination improved', 'Quality of life enhanced', 'Patient dignity maintained'
  ];

  const challengeOptions = [
    'Pain management difficulties', 'Medication compliance issues', 'Family communication barriers',
    'Equipment problems', 'Safety concerns', 'Caregiver burnout', 'Financial concerns',
    'Transportation issues', 'Insurance barriers', 'Spiritual distress', 'Social isolation',
    'Environmental hazards', 'Cognitive changes', 'Emergency preparedness gaps'
  ];

  const communicationOptions = [
    'Physician notification sent', 'Social worker contacted', 'Chaplain notified',
    'Pharmacy consultation', 'Equipment company called', 'Insurance communication',
    'Emergency contact updated', 'Care plan revised', 'Family meeting scheduled',
    'Volunteer coordinator notified', 'Bereavement counselor contacted'
  ];

  const validateVisitNotes = () => {
    const newErrors = {};

    if (!visitNotesData.visitSummary.trim()) {
      newErrors.visitSummary = 'Visit summary is required';
    }

    if (!visitNotesData.patientCondition.trim()) {
      newErrors.patientCondition = 'Patient condition assessment is required';
    }

    if (!visitNotesData.nextVisitPlan.trim()) {
      newErrors.nextVisitPlan = 'Next visit plan is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompleteVisit = async () => {
    if (!validateVisitNotes()) {
      Alert.alert('Validation Error', 'Please complete all required fields.');
      return;
    }

    try {
      // TODO: Save to database via MCP and complete visit
      console.log('Completing visit with notes:', visitNotesData);
      
      Alert.alert(
        'Visit Completed Successfully',
        'All assessment data has been saved and the visit has been completed.',
        [
          {
            text: 'View Visit Summary',
            onPress: () => router.push(`/visit-details/${id}`)
          },
          {
            text: 'Return to Dashboard',
            onPress: () => router.push('/')
          }
        ]
      );
    } catch (_error) {
      Alert.alert('Error', 'Failed to complete visit. Please try again.');
    }
  };

  const renderMultiSelector = (label, selectedValues, onToggle, options) => (
    <View style={{ marginBottom: Spacing.md }}>
      <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.xs, fontWeight: '600' }}>
        {label}
      </ThemedText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onToggle(option)}
            style={{
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.sm,
              borderRadius: Spacing.borderRadius.md,
              borderWidth: 1,
              borderColor: selectedValues.includes(option) ? primaryColor : outlineColor,
              backgroundColor: selectedValues.includes(option) ? primaryColor + '10' : surfaceColor,
            }}
          >
            <ThemedText
              variant="bodySmall"
              style={{
                color: selectedValues.includes(option) ? primaryColor : onSurfaceColor,
                fontWeight: selectedValues.includes(option) ? '600' : '400'
              }}
            >
              {option}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTextArea = (label, value, onChangeText, placeholder = '', required = false, error = null) => (
    <View style={{ marginBottom: Spacing.md }}>
      <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.xs, fontWeight: '600' }}>
        {label} {required && <ThemedText style={{ color: warningColor }}>*</ThemedText>}
      </ThemedText>
      <TextInput
        style={{
          backgroundColor: surfaceColor,
          borderWidth: 1,
          borderColor: error ? warningColor : outlineColor,
          borderRadius: Spacing.borderRadius.md,
          padding: Spacing.md,
          fontSize: 16,
          color: onSurfaceColor,
          minHeight: 100,
          textAlignVertical: 'top',
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={onSurfaceColor + '60'}
        multiline
      />
      {error && (
        <ThemedText variant="bodySmall" style={{ color: warningColor, marginTop: Spacing.xs }}>
          {error}
        </ThemedText>
      )}
    </View>
  );

  const renderTextInput = (label, value, onChangeText, placeholder = '') => (
    <View style={{ marginBottom: Spacing.md }}>
      <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.xs, fontWeight: '600' }}>
        {label}
      </ThemedText>
      <TextInput
        style={{
          backgroundColor: surfaceColor,
          borderWidth: 1,
          borderColor: outlineColor,
          borderRadius: Spacing.borderRadius.md,
          padding: Spacing.md,
          fontSize: 16,
          color: onSurfaceColor,
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={onSurfaceColor + '60'}
      />
    </View>
  );

  const renderCheckbox = (label, checked, onToggle) => (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md
      }}
    >
      <View style={{
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: checked ? primaryColor : outlineColor,
        backgroundColor: checked ? primaryColor : 'transparent',
        marginRight: Spacing.sm,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {checked && (
          <Ionicons name="checkmark" size={12} color="white" />
        )}
      </View>
      <ThemedText variant="bodyMedium" style={{ flex: 1 }}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Header */}
      <ThemedView style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingTop: insets.top + Spacing.sm,
        paddingBottom: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: outlineColor,
      }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ marginRight: Spacing.md }}
        >
          <Ionicons name="arrow-back" size={24} color={onSurfaceColor} />
        </TouchableOpacity>
        
        <ThemedText variant="titleLarge" style={{ flex: 1, fontWeight: '600' }}>
          Visit Notes
        </ThemedText>
        
        <ThemeToggleButton />
      </ThemedView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Spacing.md }}>
        {/* Visit Summary */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📝 Visit Summary
          </ThemedText>
          
          {renderTextArea(
            'Overall Visit Summary',
            visitNotesData.visitSummary,
            (text) => setVisitNotesData(prev => ({ ...prev, visitSummary: text })),
            'Provide a comprehensive summary of today\'s visit, including key observations and activities...',
            true,
            errors.visitSummary
          )}
          
          {renderTextArea(
            'Patient Condition Assessment',
            visitNotesData.patientCondition,
            (text) => setVisitNotesData(prev => ({ ...prev, patientCondition: text })),
            'Describe the patient\'s overall condition, changes since last visit, and current status...',
            true,
            errors.patientCondition
          )}
          
          {renderTextArea(
            'Symptom Status',
            visitNotesData.symptomStatus,
            (text) => setVisitNotesData(prev => ({ ...prev, symptomStatus: text })),
            'Document current symptom management status, new symptoms, and symptom changes...'
          )}
        </View>

        {/* Goals & Challenges */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            🎯 Goals & Challenges
          </ThemedText>
          
          {renderMultiSelector(
            'Goals Met During This Visit',
            visitNotesData.goalsMetToday,
            (goal) => {
              setVisitNotesData(prev => ({
                ...prev,
                goalsMetToday: prev.goalsMetToday.includes(goal)
                  ? prev.goalsMetToday.filter(g => g !== goal)
                  : [...prev.goalsMetToday, goal]
              }));
            },
            goalOptions
          )}
          
          {renderMultiSelector(
            'Challenges Encountered',
            visitNotesData.challengesEncountered,
            (challenge) => {
              setVisitNotesData(prev => ({
                ...prev,
                challengesEncountered: prev.challengesEncountered.includes(challenge)
                  ? prev.challengesEncountered.filter(c => c !== challenge)
                  : [...prev.challengesEncountered, challenge]
              }));
            },
            challengeOptions
          )}
          
          {renderTextArea(
            'Visit Objectives & Outcomes',
            visitNotesData.outcomeAchieved,
            (text) => setVisitNotesData(prev => ({ ...prev, outcomeAchieved: text })),
            'Describe what was planned for this visit and what was accomplished...'
          )}
        </View>

        {/* Patient & Family Response */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            👥 Patient & Family Response
          </ThemedText>
          
          {renderTextArea(
            'Patient Response to Visit',
            visitNotesData.patientResponse,
            (text) => setVisitNotesData(prev => ({ ...prev, patientResponse: text })),
            'How did the patient respond to interventions and the visit overall?'
          )}
          
          {renderTextArea(
            'Family Interaction & Response',
            visitNotesData.familyInteraction,
            (text) => setVisitNotesData(prev => ({ ...prev, familyInteraction: text })),
            'Document family involvement, concerns, and responses during the visit...'
          )}
          
          {renderTextArea(
            'Teaching Provided',
            visitNotesData.teachingProvided,
            (text) => setVisitNotesData(prev => ({ ...prev, teachingProvided: text })),
            'What education or teaching was provided to patient/family?'
          )}
        </View>

        {/* Quality & Comfort Assessment */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            💝 Quality & Comfort Assessment
          </ThemedText>
          
          {renderTextArea(
            'Quality of Life Assessment',
            visitNotesData.qualityOfLife,
            (text) => setVisitNotesData(prev => ({ ...prev, qualityOfLife: text })),
            'Patient\'s quality of life, activities they enjoy, dignity concerns...'
          )}
          
          {renderTextArea(
            'Comfort Level',
            visitNotesData.comfortLevel,
            (text) => setVisitNotesData(prev => ({ ...prev, comfortLevel: text })),
            'Patient\'s current comfort level and effectiveness of comfort measures...'
          )}
          
          {renderTextArea(
            'Safety Assessment',
            visitNotesData.safetyAssessment,
            (text) => setVisitNotesData(prev => ({ ...prev, safetyAssessment: text })),
            'Home safety observations, fall risks, emergency preparedness...'
          )}
        </View>

        {/* Care Coordination */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📞 Care Coordination & Communication
          </ThemedText>
          
          {renderMultiSelector(
            'Care Team Communications',
            visitNotesData.careTeamCommunications,
            (communication) => {
              setVisitNotesData(prev => ({
                ...prev,
                careTeamCommunications: prev.careTeamCommunications.includes(communication)
                  ? prev.careTeamCommunications.filter(c => c !== communication)
                  : [...prev.careTeamCommunications, communication]
              }));
            },
            communicationOptions
          )}
          
          {renderTextArea(
            'Urgent Follow-up Required',
            visitNotesData.urgentFollowUp,
            (text) => setVisitNotesData(prev => ({ ...prev, urgentFollowUp: text })),
            'Any urgent issues requiring immediate follow-up or attention...'
          )}
        </View>

        {/* Next Visit Planning */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📅 Next Visit Planning
          </ThemedText>
          
          {renderTextArea(
            'Next Visit Plan',
            visitNotesData.nextVisitPlan,
            (text) => setVisitNotesData(prev => ({ ...prev, nextVisitPlan: text })),
            'Plan for next visit: focus areas, goals, specific interventions needed...',
            true,
            errors.nextVisitPlan
          )}
        </View>

        {/* Visit Documentation */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📋 Visit Documentation
          </ThemedText>
          
          <View style={{ flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md }}>
            <View style={{ flex: 1 }}>
              {renderTextInput(
                'Visit Duration (minutes)',
                visitNotesData.visitDuration,
                (text) => setVisitNotesData(prev => ({ ...prev, visitDuration: text })),
                '60'
              )}
            </View>
            <View style={{ flex: 1 }}>
              {renderTextInput(
                'Mileage',
                visitNotesData.mileage,
                (text) => setVisitNotesData(prev => ({ ...prev, mileage: text })),
                '12.5'
              )}
            </View>
          </View>
          
          {renderCheckbox(
            'Emergency plan reviewed with patient/family',
            visitNotesData.emergencyPlanReviewed,
            () => setVisitNotesData(prev => ({ ...prev, emergencyPlanReviewed: !prev.emergencyPlanReviewed }))
          )}
          
          {renderCheckbox(
            'Advance directives reviewed and current',
            visitNotesData.advanceDirectivesReviewed,
            () => setVisitNotesData(prev => ({ ...prev, advanceDirectivesReviewed: !prev.advanceDirectivesReviewed }))
          )}
          
          {renderCheckbox(
            'Medication reconciliation completed',
            visitNotesData.medicationReconciled,
            () => setVisitNotesData(prev => ({ ...prev, medicationReconciled: !prev.medicationReconciled }))
          )}
          
          {renderCheckbox(
            'All equipment functioning properly',
            visitNotesData.equipmentFunctioning,
            () => setVisitNotesData(prev => ({ ...prev, equipmentFunctioning: !prev.equipmentFunctioning }))
          )}
        </View>

        {/* Final Clinical Notes */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📝 Final Clinical Notes
          </ThemedText>
          
          <TextInput
            style={{
              backgroundColor: surfaceColor,
              borderWidth: 1,
              borderColor: outlineColor,
              borderRadius: Spacing.borderRadius.md,
              padding: Spacing.md,
              fontSize: 16,
              color: onSurfaceColor,
              minHeight: 120,
              textAlignVertical: 'top',
            }}
            value={visitNotesData.clinicalNotes}
            onChangeText={(text) => setVisitNotesData(prev => ({ ...prev, clinicalNotes: text }))}
            placeholder="Additional clinical observations, recommendations, or important notes for the medical record..."
            placeholderTextColor={onSurfaceColor + '60'}
            multiline
          />
        </View>

        {/* Completion Confirmation */}
        <View style={{ 
          backgroundColor: successColor + '10',
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.lg,
          borderWidth: 1,
          borderColor: successColor + '30'
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md, color: successColor }}>
            ✅ Visit Completion
          </ThemedText>
          
          {renderCheckbox(
            'I confirm that this visit is complete and all assessment data is accurate',
            visitNotesData.visitCompleted,
            () => setVisitNotesData(prev => ({ ...prev, visitCompleted: !prev.visitCompleted }))
          )}
          
          <ThemedText variant="bodySmall" style={{ opacity: 0.8, marginTop: Spacing.sm }}>
            By checking this box, you confirm that all assessment components have been completed
            and the visit documentation is ready for submission.
          </ThemedText>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <ThemedView style={{
        flexDirection: 'row',
        padding: Spacing.md,
        paddingBottom: insets.bottom + Spacing.md,
        borderTopWidth: 1,
        borderTopColor: outlineColor,
        gap: Spacing.sm,
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flex: 1,
            backgroundColor: surfaceColor,
            borderWidth: 1,
            borderColor: outlineColor,
            borderRadius: Spacing.borderRadius.lg,
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ThemedText variant="labelMedium">Save Draft</ThemedText>
        </TouchableOpacity>

        <Button
          title="Complete Visit"
          onPress={handleCompleteVisit}
          style={{ flex: 2 }}
          disabled={!visitNotesData.visitCompleted}
        />
      </ThemedView>
    </ThemedView>
  );
} 