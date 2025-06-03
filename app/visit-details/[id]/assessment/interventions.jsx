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

export default function InterventionsAssessment() {
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

  // Interventions state
  const [interventionsData, setInterventionsData] = useState({
    comfortMeasures: [],
    symptomManagement: [],
    patientEducation: [],
    familySupport: [],
    clinicalProcedures: [],
    psychosocialSupport: [],
    spiritualCare: [],
    environmentalModifications: [],
    safetyMeasures: [],
    coordinationOfCare: [],
    customInterventions: [],
    patientResponse: '',
    familyResponse: '',
    effectiveness: '',
    followUpNeeded: [],
    referralsMade: [],
    notes: ''
  });

  const [newCustomIntervention, setNewCustomIntervention] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [errors, setErrors] = useState({});

  const comfortMeasures = [
    'Repositioning for comfort', 'Mouth care', 'Skin care', 'Massage therapy',
    'Heat/cold therapy', 'Aromatherapy', 'Music therapy', 'Environmental comfort',
    'Pillow positioning', 'Bed/chair adjustments', 'Temperature regulation'
  ];

  const symptomManagementInterventions = [
    'Pain assessment and management', 'Nausea/vomiting management', 'Dyspnea management',
    'Anxiety/agitation support', 'Constipation management', 'Wound care',
    'Oxygen therapy adjustment', 'Medication administration', 'Equipment teaching',
    'Symptom monitoring', 'Breakthrough symptom response'
  ];

  const patientEducationTopics = [
    'Disease process education', 'Medication instructions', 'Equipment use training',
    'Symptom recognition', 'When to call healthcare team', 'Self-care techniques',
    'Safety precautions', 'Activity modifications', 'Nutrition guidance',
    'Comfort measure techniques', 'End-of-life preparation'
  ];

  const familySupportInterventions = [
    'Caregiver training', 'Emotional support', 'Respite care coordination',
    'Bereavement preparation', 'Communication facilitation', 'Resource provision',
    'Support group referral', 'Crisis intervention', 'Decision-making support',
    'Caregiver stress assessment', 'Family dynamics support'
  ];

  const clinicalProcedures = [
    'Vital signs assessment', 'Physical assessment', 'Wound assessment/care',
    'Catheter care', 'Tube feeding management', 'Oxygen equipment check',
    'Medication reconciliation', 'Laboratory coordination', 'IV site assessment',
    'Nebulizer treatment', 'Bowel/bladder assessment'
  ];

  const psychosocialSupport = [
    'Active listening', 'Emotional validation', 'Grief counseling',
    'Coping strategy development', 'Life review facilitation', 'Legacy projects',
    'Dignity therapy', 'Meaning-making support', 'Quality of life assessment',
    'Relationship counseling', 'Closure facilitation'
  ];

  const spiritualCareInterventions = [
    'Spiritual assessment', 'Prayer/meditation support', 'Chaplain referral',
    'Religious community connection', 'Sacred ritual facilitation',
    'Forgiveness/reconciliation support', 'Hope and meaning exploration',
    'Faith community coordination', 'Spiritual distress support',
    'End-of-life spiritual care', 'Cultural spiritual practices'
  ];

  const environmentalModifications = [
    'Lighting adjustments', 'Noise reduction', 'Room temperature control',
    'Furniture rearrangement', 'Safety equipment installation',
    'Accessibility improvements', 'Communication aids setup',
    'Personal item arrangement', 'Technology setup', 'Workspace organization'
  ];

  const safetyMeasures = [
    'Fall risk assessment', 'Medication safety review', 'Equipment safety check',
    'Emergency plan review', 'Contact information update', 'Hazard identification',
    'Emergency equipment check', 'Safety education', 'Risk mitigation planning',
    'Emergency protocol teaching', 'Safety device installation'
  ];

  const coordinationActivities = [
    'Physician communication', 'Social worker coordination', 'Chaplain coordination',
    'Pharmacy communication', 'Equipment company coordination', 'Insurance coordination',
    'Specialist referral', 'Community resource coordination', 'Volunteer coordination',
    'Family meeting facilitation', 'Care plan updates'
  ];

  const followUpOptions = [
    'Physician notification needed', 'Social worker follow-up', 'Chaplain visit requested',
    'Equipment service needed', 'Medication adjustment needed', 'Family meeting needed',
    'Increased visit frequency', 'Specialist consultation', 'Emergency plan update',
    'Caregiver training follow-up', 'Symptom monitoring increase'
  ];

  const referralOptions = [
    'Social work', 'Chaplain services', 'Bereavement counselor', 'Support groups',
    'Respite care', 'Home health aide', 'Volunteer services', 'Physical therapy',
    'Occupational therapy', 'Speech therapy', 'Dietitian', 'Psychiatrist/psychologist'
  ];

  const effectivenessLevels = [
    { value: 'very-effective', label: 'Very Effective' },
    { value: 'effective', label: 'Effective' },
    { value: 'somewhat-effective', label: 'Somewhat Effective' },
    { value: 'not-effective', label: 'Not Effective' },
    { value: 'too-early', label: 'Too Early to Assess' }
  ];

  const validateInterventions = () => {
    const newErrors = {};

    const totalInterventions = 
      interventionsData.comfortMeasures.length +
      interventionsData.symptomManagement.length +
      interventionsData.patientEducation.length +
      interventionsData.familySupport.length +
      interventionsData.clinicalProcedures.length +
      interventionsData.customInterventions.length;

    if (totalInterventions === 0) {
      newErrors.general = 'Please select at least one intervention performed during this visit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCustomIntervention = () => {
    if (!newCustomIntervention.trim()) {
      Alert.alert('Required Field', 'Please enter an intervention description.');
      return;
    }

    setInterventionsData(prev => ({
      ...prev,
      customInterventions: [...prev.customInterventions, newCustomIntervention.trim()]
    }));

    setNewCustomIntervention('');
    setShowAddCustom(false);
  };

  const handleRemoveCustomIntervention = (index) => {
    setInterventionsData(prev => ({
      ...prev,
      customInterventions: prev.customInterventions.filter((_, i) => i !== index)
    }));
  };

  const handleSaveInterventions = async () => {
    if (!validateInterventions()) {
      Alert.alert('Validation Error', 'Please select interventions performed during this visit.');
      return;
    }

    try {
      // TODO: Save to database via MCP
      console.log('Saving interventions data:', interventionsData);
      
      Alert.alert(
        'Interventions Saved',
        'Nursing interventions have been recorded successfully.',
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
      Alert.alert('Error', 'Failed to save interventions data. Please try again.');
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

  const renderTextArea = (label, value, onChangeText, placeholder = '') => (
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
          Interventions
        </ThemedText>
        
        <ThemeToggleButton />
      </ThemedView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Spacing.md }}>
        {/* Comfort Measures */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            🛌 Comfort Measures
          </ThemedText>
          
          {renderMultiSelector(
            'Comfort interventions performed',
            interventionsData.comfortMeasures,
            (measure) => {
              setInterventionsData(prev => ({
                ...prev,
                comfortMeasures: prev.comfortMeasures.includes(measure)
                  ? prev.comfortMeasures.filter(m => m !== measure)
                  : [...prev.comfortMeasures, measure]
              }));
            },
            comfortMeasures
          )}
        </View>

        {/* Symptom Management */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            🩺 Symptom Management
          </ThemedText>
          
          {renderMultiSelector(
            'Symptom management interventions',
            interventionsData.symptomManagement,
            (intervention) => {
              setInterventionsData(prev => ({
                ...prev,
                symptomManagement: prev.symptomManagement.includes(intervention)
                  ? prev.symptomManagement.filter(i => i !== intervention)
                  : [...prev.symptomManagement, intervention]
              }));
            },
            symptomManagementInterventions
          )}
        </View>

        {/* Clinical Procedures */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            🔬 Clinical Procedures
          </ThemedText>
          
          {renderMultiSelector(
            'Clinical procedures performed',
            interventionsData.clinicalProcedures,
            (procedure) => {
              setInterventionsData(prev => ({
                ...prev,
                clinicalProcedures: prev.clinicalProcedures.includes(procedure)
                  ? prev.clinicalProcedures.filter(p => p !== procedure)
                  : [...prev.clinicalProcedures, procedure]
              }));
            },
            clinicalProcedures
          )}
        </View>

        {/* Education & Support */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📚 Education & Support
          </ThemedText>
          
          {renderMultiSelector(
            'Patient Education Provided',
            interventionsData.patientEducation,
            (education) => {
              setInterventionsData(prev => ({
                ...prev,
                patientEducation: prev.patientEducation.includes(education)
                  ? prev.patientEducation.filter(e => e !== education)
                  : [...prev.patientEducation, education]
              }));
            },
            patientEducationTopics
          )}
          
          {renderMultiSelector(
            'Family Support Interventions',
            interventionsData.familySupport,
            (support) => {
              setInterventionsData(prev => ({
                ...prev,
                familySupport: prev.familySupport.includes(support)
                  ? prev.familySupport.filter(s => s !== support)
                  : [...prev.familySupport, support]
              }));
            },
            familySupportInterventions
          )}
          
          {renderMultiSelector(
            'Psychosocial Support',
            interventionsData.psychosocialSupport,
            (support) => {
              setInterventionsData(prev => ({
                ...prev,
                psychosocialSupport: prev.psychosocialSupport.includes(support)
                  ? prev.psychosocialSupport.filter(s => s !== support)
                  : [...prev.psychosocialSupport, support]
              }));
            },
            psychosocialSupport
          )}
          
          {renderMultiSelector(
            'Spiritual Care',
            interventionsData.spiritualCare,
            (care) => {
              setInterventionsData(prev => ({
                ...prev,
                spiritualCare: prev.spiritualCare.includes(care)
                  ? prev.spiritualCare.filter(c => c !== care)
                  : [...prev.spiritualCare, care]
              }));
            },
            spiritualCareInterventions
          )}
        </View>

        {/* Safety & Environment */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            🏠 Safety & Environment
          </ThemedText>
          
          {renderMultiSelector(
            'Environmental Modifications',
            interventionsData.environmentalModifications,
            (modification) => {
              setInterventionsData(prev => ({
                ...prev,
                environmentalModifications: prev.environmentalModifications.includes(modification)
                  ? prev.environmentalModifications.filter(m => m !== modification)
                  : [...prev.environmentalModifications, modification]
              }));
            },
            environmentalModifications
          )}
          
          {renderMultiSelector(
            'Safety Measures',
            interventionsData.safetyMeasures,
            (measure) => {
              setInterventionsData(prev => ({
                ...prev,
                safetyMeasures: prev.safetyMeasures.includes(measure)
                  ? prev.safetyMeasures.filter(m => m !== measure)
                  : [...prev.safetyMeasures, measure]
              }));
            },
            safetyMeasures
          )}
        </View>

        {/* Coordination of Care */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            🤝 Coordination of Care
          </ThemedText>
          
          {renderMultiSelector(
            'Care Coordination Activities',
            interventionsData.coordinationOfCare,
            (activity) => {
              setInterventionsData(prev => ({
                ...prev,
                coordinationOfCare: prev.coordinationOfCare.includes(activity)
                  ? prev.coordinationOfCare.filter(a => a !== activity)
                  : [...prev.coordinationOfCare, activity]
              }));
            },
            coordinationActivities
          )}
        </View>

        {/* Custom Interventions */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }}>
            <ThemedText variant="titleMedium">
              ✏️ Additional Interventions
            </ThemedText>
            <TouchableOpacity
              onPress={() => setShowAddCustom(true)}
              style={{
                backgroundColor: primaryColor,
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.sm,
                borderRadius: Spacing.borderRadius.md,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Ionicons name="add" size={16} color="white" style={{ marginRight: Spacing.xs }} />
              <ThemedText variant="labelMedium" style={{ color: 'white' }}>
                Add Custom
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Add Custom Intervention Form */}
          {showAddCustom && (
            <View style={{ 
              backgroundColor: primaryColor + '05',
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginBottom: Spacing.md,
              borderWidth: 1,
              borderColor: primaryColor + '20'
            }}>
              <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.md, fontWeight: '600' }}>
                Add Custom Intervention
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
                  marginBottom: Spacing.md
                }}
                value={newCustomIntervention}
                onChangeText={setNewCustomIntervention}
                placeholder="Describe the intervention performed..."
                placeholderTextColor={onSurfaceColor + '60'}
                multiline
              />
              
              <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                <TouchableOpacity
                  onPress={() => setShowAddCustom(false)}
                  style={{
                    flex: 1,
                    backgroundColor: surfaceColor,
                    borderWidth: 1,
                    borderColor: outlineColor,
                    borderRadius: Spacing.borderRadius.md,
                    paddingVertical: Spacing.sm,
                    alignItems: 'center'
                  }}
                >
                  <ThemedText variant="labelMedium">Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddCustomIntervention}
                  style={{
                    flex: 1,
                    backgroundColor: primaryColor,
                    borderRadius: Spacing.borderRadius.md,
                    paddingVertical: Spacing.sm,
                    alignItems: 'center'
                  }}
                >
                  <ThemedText variant="labelMedium" style={{ color: 'white' }}>
                    Add Intervention
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Custom Interventions List */}
          {interventionsData.customInterventions.length > 0 && (
            <View>
              {interventionsData.customInterventions.map((intervention, index) => (
                <View key={index} style={{
                  backgroundColor: successColor + '10',
                  padding: Spacing.md,
                  borderRadius: Spacing.borderRadius.md,
                  marginBottom: Spacing.sm,
                  borderWidth: 1,
                  borderColor: successColor + '30',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <ThemedText variant="bodyMedium" style={{ flex: 1, marginRight: Spacing.md }}>
                    {intervention}
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => handleRemoveCustomIntervention(index)}
                    style={{ padding: Spacing.xs }}
                  >
                    <Ionicons name="close-circle" size={20} color={warningColor} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {errors.general && (
            <ThemedText variant="bodySmall" style={{ color: warningColor, marginTop: Spacing.sm }}>
              {errors.general}
            </ThemedText>
          )}
        </View>

        {/* Response & Effectiveness */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📊 Response & Effectiveness
          </ThemedText>
          
          {renderTextArea(
            'Patient Response to Interventions',
            interventionsData.patientResponse,
            (text) => setInterventionsData(prev => ({ ...prev, patientResponse: text })),
            'Describe how the patient responded to the interventions...'
          )}
          
          {renderTextArea(
            'Family Response to Interventions',
            interventionsData.familyResponse,
            (text) => setInterventionsData(prev => ({ ...prev, familyResponse: text })),
            'Describe how family members responded to the interventions...'
          )}
          
          {renderSelector(
            'Overall Effectiveness of Interventions',
            interventionsData.effectiveness,
            (value) => setInterventionsData(prev => ({ ...prev, effectiveness: value })),
            effectivenessLevels
          )}
        </View>

        {/* Follow-up & Referrals */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📞 Follow-up & Referrals
          </ThemedText>
          
          {renderMultiSelector(
            'Follow-up Needed',
            interventionsData.followUpNeeded,
            (followUp) => {
              setInterventionsData(prev => ({
                ...prev,
                followUpNeeded: prev.followUpNeeded.includes(followUp)
                  ? prev.followUpNeeded.filter(f => f !== followUp)
                  : [...prev.followUpNeeded, followUp]
              }));
            },
            followUpOptions
          )}
          
          {renderMultiSelector(
            'Referrals Made',
            interventionsData.referralsMade,
            (referral) => {
              setInterventionsData(prev => ({
                ...prev,
                referralsMade: prev.referralsMade.includes(referral)
                  ? prev.referralsMade.filter(r => r !== referral)
                  : [...prev.referralsMade, referral]
              }));
            },
            referralOptions
          )}
        </View>

        {/* Clinical Notes */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📝 Clinical Notes
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
              minHeight: 100,
              textAlignVertical: 'top',
            }}
            value={interventionsData.notes}
            onChangeText={(text) => setInterventionsData(prev => ({ ...prev, notes: text }))}
            placeholder="Additional observations about interventions, patient/family feedback, recommendations for future visits..."
            placeholderTextColor={onSurfaceColor + '60'}
            multiline
          />
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
          onPress={handleSaveInterventions}
          style={{ flex: 2 }}
        />
      </ThemedView>
    </ThemedView>
  );
} 