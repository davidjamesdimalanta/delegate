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

export default function FamilyAssessment() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Theme colors
  const surfaceColor = useThemeColor({}, 'surface');
  const outlineColor = useThemeColor({}, 'outline');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const primaryColor = useThemeColor({}, 'primary');
  const warningColor = useThemeColor({}, 'warning');

  // Family assessment state
  const [familyData, setFamilyData] = useState({
    familyMembersPresent: [],
    primaryCaregiverPresent: false,
    primaryCaregiverName: '',
    caregiverBurdenLevel: '',
    familyDynamics: '',
    communicationPatterns: '',
    copingMechanisms: [],
    spiritualNeeds: [],
    culturalConsiderations: '',
    griefStage: '',
    bereavement: {
      anticipatoryGrief: false,
      stageOfGrief: '',
      supportNeeded: []
    },
    educationProvided: [],
    educationNeeds: [],
    resourcesProvided: [],
    resourcesNeeded: [],
    familyMeetingRequested: false,
    familyMeetingScheduled: '',
    emergencyContactsUpdated: false,
    advanceDirectivesDiscussed: false,
    goalsOfCareAlignment: '',
    supportServiceReferrals: [],
    familyQuestions: '',
    caregiverStress: '',
    visitDynamics: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const familyRoles = [
    'Spouse/Partner', 'Child', 'Parent', 'Sibling', 'Extended family',
    'Friend', 'Neighbor', 'Hired caregiver', 'Clergy/spiritual advisor'
  ];

  const caregiverBurdenLevels = [
    { value: 'minimal', label: 'Minimal' },
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' },
    { value: 'overwhelming', label: 'Overwhelming' }
  ];

  const copingMechanisms = [
    'Prayer/spirituality', 'Family support', 'Friends', 'Counseling',
    'Support groups', 'Exercise', 'Hobbies', 'Work/routine',
    'Denial', 'Avoidance', 'Substance use', 'Humor'
  ];

  const spiritualNeeds = [
    'Chaplain visit', 'Prayer', 'Meditation', 'Religious services',
    'Communion/sacraments', 'Spiritual counseling', 'Religious community support',
    'Sacred readings', 'Music/hymns', 'Forgiveness/reconciliation'
  ];

  const griefStages = [
    { value: 'denial', label: 'Denial' },
    { value: 'anger', label: 'Anger' },
    { value: 'bargaining', label: 'Bargaining' },
    { value: 'depression', label: 'Depression' },
    { value: 'acceptance', label: 'Acceptance' },
    { value: 'anticipatory', label: 'Anticipatory Grief' }
  ];

  const educationTopics = [
    'Disease progression', 'Symptom management', 'Medication administration',
    'Emergency procedures', 'Comfort measures', 'Equipment use',
    'When to call healthcare team', 'End-of-life signs', 'Bereavement resources',
    'Advanced directives', 'Hospice care', 'Respite care'
  ];

  const supportServices = [
    'Social work', 'Chaplain', 'Bereavement counselor', 'Support groups',
    'Respite care', 'Home health aide', 'Volunteer services',
    'Transportation', 'Meal delivery', 'Financial assistance',
    'Legal services', 'Insurance advocacy'
  ];

  const goalsAlignment = [
    { value: 'fully-aligned', label: 'Fully Aligned' },
    { value: 'mostly-aligned', label: 'Mostly Aligned' },
    { value: 'some-differences', label: 'Some Differences' },
    { value: 'major-differences', label: 'Major Differences' },
    { value: 'unclear', label: 'Unclear/Needs Discussion' }
  ];

  const validateFamilyAssessment = () => {
    const newErrors = {};

    if (familyData.familyMembersPresent.length === 0) {
      newErrors.familyMembersPresent = 'Please indicate who was present during the visit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveFamilyAssessment = async () => {
    if (!validateFamilyAssessment()) {
      Alert.alert('Validation Error', 'Please correct the highlighted fields.');
      return;
    }

    try {
      // TODO: Save to database via MCP
      console.log('Saving family assessment:', familyData);
      
      Alert.alert(
        'Family Assessment Saved',
        'Family information has been recorded successfully.',
        [
          {
            text: 'Continue to Visit Notes',
            onPress: () => router.push(`/visit-details/${id}/assessment/notes`)
          },
          {
            text: 'Back to Assessment',
            onPress: () => router.back()
          }
        ]
      );
    } catch (_error) {
      Alert.alert('Error', 'Failed to save family assessment. Please try again.');
    }
  };

  const renderMultiSelector = (label, selectedValues, onToggle, options, error = null) => (
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
      {error && (
        <ThemedText variant="bodySmall" style={{ color: warningColor, marginTop: Spacing.xs }}>
          {error}
        </ThemedText>
      )}
    </View>
  );

  const renderSelector = (label, value, onSelect, options) => (
    <View style={{ marginBottom: Spacing.md }}>
      <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.xs, fontWeight: '600' }}>
        {label}
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={{
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.sm,
                borderRadius: Spacing.borderRadius.md,
                borderWidth: 1,
                borderColor: value === option.value ? primaryColor : outlineColor,
                backgroundColor: value === option.value ? primaryColor + '10' : surfaceColor,
              }}
            >
              <ThemedText
                variant="bodySmall"
                style={{
                  color: value === option.value ? primaryColor : onSurfaceColor,
                  fontWeight: value === option.value ? '600' : '400'
                }}
              >
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderTextArea = (label, value, onChangeText, placeholder = '', required = false) => (
    <View style={{ marginBottom: Spacing.md }}>
      <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.xs, fontWeight: '600' }}>
        {label} {required && <ThemedText style={{ color: warningColor }}>*</ThemedText>}
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
          minHeight: 80,
          textAlignVertical: 'top',
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={onSurfaceColor + '60'}
        multiline
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
          Family Support
        </ThemedText>
        
        <ThemeToggleButton />
      </ThemedView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Spacing.md }}>
        {/* Family Presence & Dynamics */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            👥 Family Presence & Dynamics
          </ThemedText>
          
          {renderMultiSelector(
            'Family Members Present During Visit *',
            familyData.familyMembersPresent,
            (member) => {
              setFamilyData(prev => ({
                ...prev,
                familyMembersPresent: prev.familyMembersPresent.includes(member)
                  ? prev.familyMembersPresent.filter(m => m !== member)
                  : [...prev.familyMembersPresent, member]
              }));
            },
            familyRoles,
            errors.familyMembersPresent
          )}
          
          {renderCheckbox(
            'Primary caregiver was present during visit',
            familyData.primaryCaregiverPresent,
            () => setFamilyData(prev => ({ ...prev, primaryCaregiverPresent: !prev.primaryCaregiverPresent }))
          )}
          
          {familyData.primaryCaregiverPresent && (
            <View style={{ marginBottom: Spacing.md }}>
              <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.xs, fontWeight: '600' }}>
                Primary Caregiver Name
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
                value={familyData.primaryCaregiverName}
                onChangeText={(text) => setFamilyData(prev => ({ ...prev, primaryCaregiverName: text }))}
                placeholder="Enter caregiver name"
                placeholderTextColor={onSurfaceColor + '60'}
              />
            </View>
          )}
          
          {renderSelector(
            'Caregiver Burden Level',
            familyData.caregiverBurdenLevel,
            (value) => setFamilyData(prev => ({ ...prev, caregiverBurdenLevel: value })),
            caregiverBurdenLevels
          )}
          
          {renderTextArea(
            'Family Dynamics Observed',
            familyData.familyDynamics,
            (text) => setFamilyData(prev => ({ ...prev, familyDynamics: text })),
            'Describe family interactions, communication patterns, roles, and dynamics observed during the visit...'
          )}
        </View>

        {/* Coping & Support */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            🤝 Coping & Support Systems
          </ThemedText>
          
          {renderMultiSelector(
            'Current Coping Mechanisms',
            familyData.copingMechanisms,
            (mechanism) => {
              setFamilyData(prev => ({
                ...prev,
                copingMechanisms: prev.copingMechanisms.includes(mechanism)
                  ? prev.copingMechanisms.filter(m => m !== mechanism)
                  : [...prev.copingMechanisms, mechanism]
              }));
            },
            copingMechanisms
          )}
          
          {renderMultiSelector(
            'Spiritual Needs Identified',
            familyData.spiritualNeeds,
            (need) => {
              setFamilyData(prev => ({
                ...prev,
                spiritualNeeds: prev.spiritualNeeds.includes(need)
                  ? prev.spiritualNeeds.filter(n => n !== need)
                  : [...prev.spiritualNeeds, need]
              }));
            },
            spiritualNeeds
          )}
          
          {renderTextArea(
            'Cultural Considerations',
            familyData.culturalConsiderations,
            (text) => setFamilyData(prev => ({ ...prev, culturalConsiderations: text })),
            'Cultural, religious, or ethnic considerations affecting care...'
          )}
          
          {renderSelector(
            'Predominant Grief Stage Observed',
            familyData.griefStage,
            (value) => setFamilyData(prev => ({ ...prev, griefStage: value })),
            griefStages
          )}
        </View>

        {/* Education & Resources */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📚 Education & Resources
          </ThemedText>
          
          {renderMultiSelector(
            'Education Provided Today',
            familyData.educationProvided,
            (topic) => {
              setFamilyData(prev => ({
                ...prev,
                educationProvided: prev.educationProvided.includes(topic)
                  ? prev.educationProvided.filter(t => t !== topic)
                  : [...prev.educationProvided, topic]
              }));
            },
            educationTopics
          )}
          
          {renderMultiSelector(
            'Additional Education Needs Identified',
            familyData.educationNeeds,
            (need) => {
              setFamilyData(prev => ({
                ...prev,
                educationNeeds: prev.educationNeeds.includes(need)
                  ? prev.educationNeeds.filter(n => n !== need)
                  : [...prev.educationNeeds, need]
              }));
            },
            educationTopics
          )}
          
          {renderMultiSelector(
            'Resources Provided/Discussed',
            familyData.resourcesProvided,
            (resource) => {
              setFamilyData(prev => ({
                ...prev,
                resourcesProvided: prev.resourcesProvided.includes(resource)
                  ? prev.resourcesProvided.filter(r => r !== resource)
                  : [...prev.resourcesProvided, resource]
              }));
            },
            supportServices
          )}
          
          {renderMultiSelector(
            'Support Service Referrals Made',
            familyData.supportServiceReferrals,
            (service) => {
              setFamilyData(prev => ({
                ...prev,
                supportServiceReferrals: prev.supportServiceReferrals.includes(service)
                  ? prev.supportServiceReferrals.filter(s => s !== service)
                  : [...prev.supportServiceReferrals, service]
              }));
            },
            supportServices
          )}
        </View>

        {/* Care Planning */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            🎯 Care Planning & Goals
          </ThemedText>
          
          {renderCheckbox(
            'Family meeting requested/needed',
            familyData.familyMeetingRequested,
            () => setFamilyData(prev => ({ ...prev, familyMeetingRequested: !prev.familyMeetingRequested }))
          )}
          
          {renderCheckbox(
            'Emergency contacts updated',
            familyData.emergencyContactsUpdated,
            () => setFamilyData(prev => ({ ...prev, emergencyContactsUpdated: !prev.emergencyContactsUpdated }))
          )}
          
          {renderCheckbox(
            'Advance directives discussed',
            familyData.advanceDirectivesDiscussed,
            () => setFamilyData(prev => ({ ...prev, advanceDirectivesDiscussed: !prev.advanceDirectivesDiscussed }))
          )}
          
          {renderSelector(
            'Family Alignment with Goals of Care',
            familyData.goalsOfCareAlignment,
            (value) => setFamilyData(prev => ({ ...prev, goalsOfCareAlignment: value })),
            goalsAlignment
          )}
        </View>

        {/* Additional Notes */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📝 Additional Documentation
          </ThemedText>
          
          {renderTextArea(
            'Family Questions/Concerns',
            familyData.familyQuestions,
            (text) => setFamilyData(prev => ({ ...prev, familyQuestions: text })),
            'Document questions asked by family members and responses provided...'
          )}
          
          {renderTextArea(
            'Caregiver Stress Assessment',
            familyData.caregiverStress,
            (text) => setFamilyData(prev => ({ ...prev, caregiverStress: text })),
            'Observations about caregiver stress, burden, or burnout...'
          )}
          
          {renderTextArea(
            'Visit Dynamics & Interactions',
            familyData.visitDynamics,
            (text) => setFamilyData(prev => ({ ...prev, visitDynamics: text })),
            'Describe the overall tone of the visit, family interactions with patient and care team...'
          )}
          
          {renderTextArea(
            'Clinical Notes',
            familyData.notes,
            (text) => setFamilyData(prev => ({ ...prev, notes: text })),
            'Additional observations, recommendations, or follow-up needed...'
          )}
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
          <ThemedText variant="labelMedium">Cancel</ThemedText>
        </TouchableOpacity>

        <Button
          title="Save & Continue"
          onPress={handleSaveFamilyAssessment}
          style={{ flex: 2 }}
        />
      </ThemedView>
    </ThemedView>
  );
} 