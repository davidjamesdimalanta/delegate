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

export default function MedicationsAssessment() {
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

  // Medications state
  const [medicationsData, setMedicationsData] = useState({
    medicationsAdministered: [],
    prnMedications: [],
    medicationChanges: [],
    sideEffectsObserved: [],
    adherenceAssessment: '',
    familyEducation: [],
    medicationConcerns: '',
    pharmacyContact: false,
    physicianContact: false,
    notes: ''
  });

  const [newMedication, setNewMedication] = useState({
    name: '',
    dose: '',
    route: '',
    time: '',
    indication: '',
    effectiveness: '',
    sideEffects: []
  });

  const [showAddMedication, setShowAddMedication] = useState(false);
  const [errors, setErrors] = useState({});

  const medicationRoutes = [
    'PO (by mouth)', 'SL (sublingual)', 'IV (intravenous)', 'IM (intramuscular)',
    'SubQ (subcutaneous)', 'Topical', 'Transdermal', 'Rectal', 'Inhaled', 'Nasal'
  ];

  const medicationIndications = [
    'Pain management', 'Anxiety/agitation', 'Nausea/vomiting', 'Dyspnea',
    'Constipation', 'Insomnia', 'Delirium', 'Seizures', 'Infection',
    'Cardiac symptoms', 'Respiratory symptoms', 'Other'
  ];

  const effectivenessLevels = [
    { value: 'very-effective', label: 'Very Effective' },
    { value: 'effective', label: 'Effective' },
    { value: 'somewhat-effective', label: 'Somewhat Effective' },
    { value: 'not-effective', label: 'Not Effective' },
    { value: 'too-early', label: 'Too Early to Tell' }
  ];

  const commonSideEffects = [
    'Nausea', 'Vomiting', 'Constipation', 'Diarrhea', 'Drowsiness',
    'Confusion', 'Dizziness', 'Dry mouth', 'Loss of appetite',
    'Itching', 'Rash', 'Headache', 'Fatigue', 'Respiratory depression'
  ];

  const adherenceOptions = [
    { value: 'excellent', label: 'Excellent (>90%)' },
    { value: 'good', label: 'Good (75-90%)' },
    { value: 'fair', label: 'Fair (50-75%)' },
    { value: 'poor', label: 'Poor (<50%)' },
    { value: 'unable-assess', label: 'Unable to Assess' }
  ];

  const educationTopics = [
    'Medication purpose', 'Dosing schedule', 'Administration technique',
    'Side effects to watch for', 'When to call healthcare team',
    'Storage requirements', 'Drug interactions', 'PRN usage guidelines'
  ];

  const validateMedications = () => {
    const newErrors = {};

    if (medicationsData.medicationsAdministered.length === 0 && 
        medicationsData.prnMedications.length === 0 && 
        medicationsData.medicationChanges.length === 0) {
      newErrors.general = 'Please document at least one medication activity or indicate no medications given';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dose || !newMedication.route) {
      Alert.alert('Required Fields', 'Please fill in medication name, dose, and route.');
      return;
    }

    const medicationEntry = {
      ...newMedication,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    setMedicationsData(prev => ({
      ...prev,
      medicationsAdministered: [...prev.medicationsAdministered, medicationEntry]
    }));

    setNewMedication({
      name: '',
      dose: '',
      route: '',
      time: '',
      indication: '',
      effectiveness: '',
      sideEffects: []
    });

    setShowAddMedication(false);
  };

  const handleRemoveMedication = (medicationId) => {
    setMedicationsData(prev => ({
      ...prev,
      medicationsAdministered: prev.medicationsAdministered.filter(med => med.id !== medicationId)
    }));
  };

  const handleSaveMedications = async () => {
    if (!validateMedications()) {
      Alert.alert('Validation Error', 'Please document medication activities.');
      return;
    }

    try {
      // TODO: Save to database via MCP
      console.log('Saving medications data:', medicationsData);
      
      Alert.alert(
        'Medications Saved',
        'Medication documentation has been recorded successfully.',
        [
          {
            text: 'Continue to Interventions',
            onPress: () => router.push(`/visit-details/${id}/assessment/interventions`)
          },
          {
            text: 'Back to Assessment',
            onPress: () => router.back()
          }
        ]
      );
    } catch (_error) {
      Alert.alert('Error', 'Failed to save medication data. Please try again.');
    }
  };

  const renderSelector = (label, value, onSelect, options) => (
    <View style={{ marginBottom: Spacing.md }}>
      <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.xs, fontWeight: '600' }}>
        {label}
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value || option}
              onPress={() => onSelect(option.value || option)}
              style={{
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.sm,
                borderRadius: Spacing.borderRadius.md,
                borderWidth: 1,
                borderColor: value === (option.value || option) ? primaryColor : outlineColor,
                backgroundColor: value === (option.value || option) ? primaryColor + '10' : surfaceColor,
              }}
            >
              <ThemedText
                variant="bodySmall"
                style={{
                  color: value === (option.value || option) ? primaryColor : onSurfaceColor,
                  fontWeight: value === (option.value || option) ? '600' : '400'
                }}
              >
                {option.label || option}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

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

  const renderTextInput = (label, value, onChangeText, placeholder = '', required = false) => (
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
          Medications
        </ThemedText>
        
        <ThemeToggleButton />
      </ThemedView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Spacing.md }}>
        {/* Medications Administered */}
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
              💊 Medications Administered
            </ThemedText>
            <TouchableOpacity
              onPress={() => setShowAddMedication(true)}
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
                Add Medication
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Add Medication Form */}
          {showAddMedication && (
            <View style={{ 
              backgroundColor: primaryColor + '05',
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginBottom: Spacing.md,
              borderWidth: 1,
              borderColor: primaryColor + '20'
            }}>
              <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.md, fontWeight: '600' }}>
                Add New Medication
              </ThemedText>
              
              {renderTextInput(
                'Medication Name',
                newMedication.name,
                (text) => setNewMedication(prev => ({ ...prev, name: text })),
                'e.g., Morphine, Lorazepam',
                true
              )}
              
              <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                <View style={{ flex: 1 }}>
                  {renderTextInput(
                    'Dose',
                    newMedication.dose,
                    (text) => setNewMedication(prev => ({ ...prev, dose: text })),
                    'e.g., 5mg, 0.5mg',
                    true
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  {renderTextInput(
                    'Time Given',
                    newMedication.time,
                    (text) => setNewMedication(prev => ({ ...prev, time: text })),
                    'e.g., 14:30'
                  )}
                </View>
              </View>
              
              {renderSelector(
                'Route',
                newMedication.route,
                (value) => setNewMedication(prev => ({ ...prev, route: value })),
                medicationRoutes
              )}
              
              {renderSelector(
                'Indication',
                newMedication.indication,
                (value) => setNewMedication(prev => ({ ...prev, indication: value })),
                medicationIndications
              )}
              
              {renderSelector(
                'Effectiveness',
                newMedication.effectiveness,
                (value) => setNewMedication(prev => ({ ...prev, effectiveness: value })),
                effectivenessLevels
              )}
              
              {renderMultiSelector(
                'Side Effects Observed',
                newMedication.sideEffects,
                (effect) => {
                  setNewMedication(prev => ({
                    ...prev,
                    sideEffects: prev.sideEffects.includes(effect)
                      ? prev.sideEffects.filter(e => e !== effect)
                      : [...prev.sideEffects, effect]
                  }));
                },
                commonSideEffects
              )}
              
              <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md }}>
                <TouchableOpacity
                  onPress={() => setShowAddMedication(false)}
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
                  onPress={handleAddMedication}
                  style={{
                    flex: 1,
                    backgroundColor: primaryColor,
                    borderRadius: Spacing.borderRadius.md,
                    paddingVertical: Spacing.sm,
                    alignItems: 'center'
                  }}
                >
                  <ThemedText variant="labelMedium" style={{ color: 'white' }}>
                    Add Medication
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Medications List */}
          {medicationsData.medicationsAdministered.length > 0 ? (
            medicationsData.medicationsAdministered.map((medication) => (
              <View key={medication.id} style={{
                backgroundColor: successColor + '10',
                padding: Spacing.md,
                borderRadius: Spacing.borderRadius.md,
                marginBottom: Spacing.sm,
                borderWidth: 1,
                borderColor: successColor + '30'
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <ThemedText variant="bodyMedium" style={{ fontWeight: '600', marginBottom: Spacing.xs }}>
                      {medication.name} - {medication.dose}
                    </ThemedText>
                    <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                      Route: {medication.route} | Indication: {medication.indication}
                    </ThemedText>
                    {medication.time && (
                      <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                        Time: {medication.time}
                      </ThemedText>
                    )}
                    {medication.effectiveness && (
                      <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                        Effectiveness: {medication.effectiveness}
                      </ThemedText>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveMedication(medication.id)}
                    style={{ padding: Spacing.xs }}
                  >
                    <Ionicons name="close-circle" size={20} color={warningColor} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={{ alignItems: 'center', padding: Spacing.lg }}>
              <Ionicons name="medical-outline" size={48} color={outlineColor} />
              <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.md, textAlign: 'center' }}>
                No medications administered yet
              </ThemedText>
            </View>
          )}

          {errors.general && (
            <ThemedText variant="bodySmall" style={{ color: warningColor, marginTop: Spacing.sm }}>
              {errors.general}
            </ThemedText>
          )}
        </View>

        {/* Medication Assessment */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📋 Medication Assessment
          </ThemedText>
          
          {renderSelector(
            'Overall Medication Adherence',
            medicationsData.adherenceAssessment,
            (value) => setMedicationsData(prev => ({ ...prev, adherenceAssessment: value })),
            adherenceOptions
          )}
          
          {renderMultiSelector(
            'Side Effects Observed Today',
            medicationsData.sideEffectsObserved,
            (effect) => {
              setMedicationsData(prev => ({
                ...prev,
                sideEffectsObserved: prev.sideEffectsObserved.includes(effect)
                  ? prev.sideEffectsObserved.filter(e => e !== effect)
                  : [...prev.sideEffectsObserved, effect]
              }));
            },
            commonSideEffects
          )}
          
          {renderMultiSelector(
            'Family Education Provided',
            medicationsData.familyEducation,
            (topic) => {
              setMedicationsData(prev => ({
                ...prev,
                familyEducation: prev.familyEducation.includes(topic)
                  ? prev.familyEducation.filter(t => t !== topic)
                  : [...prev.familyEducation, topic]
              }));
            },
            educationTopics
          )}
        </View>

        {/* Communication & Follow-up */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📞 Communication & Follow-up
          </ThemedText>
          
          {renderCheckbox(
            'Pharmacy contacted regarding medication issues',
            medicationsData.pharmacyContact,
            () => setMedicationsData(prev => ({ ...prev, pharmacyContact: !prev.pharmacyContact }))
          )}
          
          {renderCheckbox(
            'Physician contacted regarding medication changes',
            medicationsData.physicianContact,
            () => setMedicationsData(prev => ({ ...prev, physicianContact: !prev.physicianContact }))
          )}
          
          <View style={{ marginBottom: Spacing.md }}>
            <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.xs, fontWeight: '600' }}>
              Medication Concerns or Issues
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
              value={medicationsData.medicationConcerns}
              onChangeText={(text) => setMedicationsData(prev => ({ ...prev, medicationConcerns: text }))}
              placeholder="Document any medication-related concerns, issues, or recommendations..."
              placeholderTextColor={onSurfaceColor + '60'}
              multiline
            />
          </View>
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
            value={medicationsData.notes}
            onChangeText={(text) => setMedicationsData(prev => ({ ...prev, notes: text }))}
            placeholder="Additional medication-related observations, patient response, family feedback, or recommendations..."
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
          onPress={handleSaveMedications}
          style={{ flex: 2 }}
        />
      </ThemedView>
    </ThemedView>
  );
} 