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

export default function PainAssessment() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Theme colors
  const surfaceColor = useThemeColor({}, 'surface');
  const outlineColor = useThemeColor({}, 'outline');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const primaryColor = useThemeColor({}, 'primary');
  const warningColor = useThemeColor({}, 'warning');

  // Pain assessment state
  const [painData, setPainData] = useState({
    currentPainLevel: '',
    worstPain24h: '',
    averagePain24h: '',
    painOnMovement: '',
    painAtRest: '',
    painLocation: [],
    painQuality: [],
    painPattern: '',
    painOnset: '',
    aggravatingFactors: [],
    relievingFactors: [],
    previousPainLevel: '',
    painInterference: {
      generalActivity: '',
      mood: '',
      walking: '',
      normalWork: '',
      relationships: '',
      sleep: '',
      enjoymentOfLife: ''
    },
    functionalGoals: '',
    currentMedications: [],
    medicationEffectiveness: '',
    sideEffects: [],
    nonPharmacologicalMethods: [],
    caregiverConcerns: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const painLocations = [
    'Head/Face', 'Neck', 'Chest', 'Back', 'Abdomen', 'Pelvis',
    'Right arm', 'Left arm', 'Right leg', 'Left leg', 'Generalized'
  ];

  const painQualities = [
    'Sharp', 'Dull', 'Burning', 'Shooting', 'Cramping', 'Throbbing',
    'Stabbing', 'Aching', 'Tight', 'Heavy', 'Tingling', 'Numb'
  ];

  const painPatterns = [
    { value: 'constant', label: 'Constant' },
    { value: 'intermittent', label: 'Intermittent' },
    { value: 'breakthrough', label: 'Breakthrough' },
    { value: 'incident', label: 'Incident-related' }
  ];

  const aggravatingFactors = [
    'Movement', 'Coughing', 'Deep breathing', 'Touching', 'Eating',
    'Stress', 'Weather changes', 'Time of day', 'Position changes'
  ];

  const relievingFactors = [
    'Rest', 'Heat', 'Cold', 'Massage', 'Distraction', 'Breathing exercises',
    'Position changes', 'Medication', 'Music', 'Prayer/meditation'
  ];

  const sideEffects = [
    'Nausea', 'Vomiting', 'Constipation', 'Drowsiness', 'Confusion',
    'Dizziness', 'Dry mouth', 'Itching', 'Loss of appetite'
  ];

  const nonPharmacologicalMethods = [
    'Heat therapy', 'Cold therapy', 'Massage', 'Relaxation techniques',
    'Breathing exercises', 'Music therapy', 'Distraction', 'Positioning',
    'TENS unit', 'Acupuncture', 'Prayer/spiritual care'
  ];

  const validatePainAssessment = () => {
    const newErrors = {};

    if (!painData.currentPainLevel) {
      newErrors.currentPainLevel = 'Current pain level is required';
    } else {
      const level = parseInt(painData.currentPainLevel);
      if (level < 0 || level > 10) {
        newErrors.currentPainLevel = 'Pain level must be between 0-10';
      }
    }

    if (painData.worstPain24h) {
      const level = parseInt(painData.worstPain24h);
      if (level < 0 || level > 10) {
        newErrors.worstPain24h = 'Pain level must be between 0-10';
      }
    }

    if (painData.averagePain24h) {
      const level = parseInt(painData.averagePain24h);
      if (level < 0 || level > 10) {
        newErrors.averagePain24h = 'Pain level must be between 0-10';
      }
    }

    if (painData.currentPainLevel > 0 && painData.painLocation.length === 0) {
      newErrors.painLocation = 'Please specify pain location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePainAssessment = async () => {
    if (!validatePainAssessment()) {
      Alert.alert('Validation Error', 'Please correct the highlighted fields.');
      return;
    }

    try {
      // TODO: Save to database via MCP
      console.log('Saving pain assessment:', painData);
      
      Alert.alert(
        'Pain Assessment Saved',
        'Pain assessment has been recorded successfully.',
        [
          {
            text: 'Continue to Medications',
            onPress: () => router.push(`/visit-details/${id}/assessment/medications`)
          },
          {
            text: 'Back to Assessment',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save pain assessment. Please try again.');
    }
  };

  const renderPainScale = (label, value, onChangeText, error = null) => (
    <View style={{ marginBottom: Spacing.md }}>
      <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.xs, fontWeight: '600' }}>
        {label}
      </ThemedText>
      
      {/* Visual pain scale */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => onChangeText(level.toString())}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: value === level.toString() ? primaryColor : surfaceColor,
              borderWidth: 1,
              borderColor: value === level.toString() ? primaryColor : outlineColor,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ThemedText
              variant="bodySmall"
              style={{
                color: value === level.toString() ? 'white' : onSurfaceColor,
                fontWeight: value === level.toString() ? '600' : '400'
              }}
            >
              {level}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
        <ThemedText variant="bodySmall" style={{ opacity: 0.7 }}>No Pain</ThemedText>
        <ThemedText variant="bodySmall" style={{ opacity: 0.7 }}>Worst Pain</ThemedText>
      </View>
      
      {error && (
        <ThemedText variant="bodySmall" style={{ color: warningColor, marginTop: Spacing.xs }}>
          {error}
        </ThemedText>
      )}
    </View>
  );

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

  const renderInterferenceScale = (label, value, onChangeText) => (
    <View style={{ marginBottom: Spacing.md }}>
      <ThemedText variant="bodySmall" style={{ marginBottom: Spacing.sm, fontWeight: '500' }}>
        {label}
      </ThemedText>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => onChangeText(level.toString())}
            style={{
              width: 25,
              height: 25,
              borderRadius: 12.5,
              backgroundColor: value === level.toString() ? primaryColor : surfaceColor,
              borderWidth: 1,
              borderColor: value === level.toString() ? primaryColor : outlineColor,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ThemedText
              variant="labelSmall"
              style={{
                color: value === level.toString() ? 'white' : onSurfaceColor,
                fontSize: 10
              }}
            >
              {level}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
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
          Pain Assessment
        </ThemedText>
        
        <ThemeToggleButton />
      </ThemedView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Spacing.md }}>
        {/* Current Pain Intensity */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            ⚡ Current Pain Intensity
          </ThemedText>
          
          {renderPainScale(
            'Current Pain Level (0-10)',
            painData.currentPainLevel,
            (value) => setPainData(prev => ({ ...prev, currentPainLevel: value })),
            errors.currentPainLevel
          )}
          
          {renderPainScale(
            'Worst Pain in Last 24 Hours',
            painData.worstPain24h,
            (value) => setPainData(prev => ({ ...prev, worstPain24h: value })),
            errors.worstPain24h
          )}
          
          {renderPainScale(
            'Average Pain in Last 24 Hours',
            painData.averagePain24h,
            (value) => setPainData(prev => ({ ...prev, averagePain24h: value })),
            errors.averagePain24h
          )}
        </View>

        {/* Pain Characteristics */}
        {parseInt(painData.currentPainLevel) > 0 && (
          <View style={{ 
            backgroundColor: surfaceColor,
            padding: Spacing.md,
            borderRadius: Spacing.borderRadius.md,
            marginBottom: Spacing.md,
            borderWidth: 1,
            borderColor: outlineColor
          }}>
            <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
              📍 Pain Characteristics
            </ThemedText>
            
            {renderMultiSelector(
              'Pain Location',
              painData.painLocation,
              (location) => {
                setPainData(prev => ({
                  ...prev,
                  painLocation: prev.painLocation.includes(location)
                    ? prev.painLocation.filter(l => l !== location)
                    : [...prev.painLocation, location]
                }));
              },
              painLocations,
              errors.painLocation
            )}
            
            {renderMultiSelector(
              'Pain Quality/Description',
              painData.painQuality,
              (quality) => {
                setPainData(prev => ({
                  ...prev,
                  painQuality: prev.painQuality.includes(quality)
                    ? prev.painQuality.filter(q => q !== quality)
                    : [...prev.painQuality, quality]
                }));
              },
              painQualities
            )}
            
            {renderSelector(
              'Pain Pattern',
              painData.painPattern,
              (value) => setPainData(prev => ({ ...prev, painPattern: value })),
              painPatterns
            )}
          </View>
        )}

        {/* Pain Impact */}
        {parseInt(painData.currentPainLevel) > 0 && (
          <View style={{ 
            backgroundColor: surfaceColor,
            padding: Spacing.md,
            borderRadius: Spacing.borderRadius.md,
            marginBottom: Spacing.md,
            borderWidth: 1,
            borderColor: outlineColor
          }}>
            <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
              📊 Pain Impact on Daily Life
            </ThemedText>
            
            <ThemedText variant="bodySmall" style={{ marginBottom: Spacing.md, opacity: 0.8 }}>
              Rate how pain interferes with each area (0 = no interference, 10 = complete interference)
            </ThemedText>
            
            {renderInterferenceScale(
              'General Activity',
              painData.painInterference.generalActivity,
              (value) => setPainData(prev => ({
                ...prev,
                painInterference: { ...prev.painInterference, generalActivity: value }
              }))
            )}
            
            {renderInterferenceScale(
              'Mood',
              painData.painInterference.mood,
              (value) => setPainData(prev => ({
                ...prev,
                painInterference: { ...prev.painInterference, mood: value }
              }))
            )}
            
            {renderInterferenceScale(
              'Walking/Mobility',
              painData.painInterference.walking,
              (value) => setPainData(prev => ({
                ...prev,
                painInterference: { ...prev.painInterference, walking: value }
              }))
            )}
            
            {renderInterferenceScale(
              'Sleep',
              painData.painInterference.sleep,
              (value) => setPainData(prev => ({
                ...prev,
                painInterference: { ...prev.painInterference, sleep: value }
              }))
            )}
            
            {renderInterferenceScale(
              'Relationships with Others',
              painData.painInterference.relationships,
              (value) => setPainData(prev => ({
                ...prev,
                painInterference: { ...prev.painInterference, relationships: value }
              }))
            )}
            
            {renderInterferenceScale(
              'Enjoyment of Life',
              painData.painInterference.enjoymentOfLife,
              (value) => setPainData(prev => ({
                ...prev,
                painInterference: { ...prev.painInterference, enjoymentOfLife: value }
              }))
            )}
          </View>
        )}

        {/* Pain Management */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            💊 Current Pain Management
          </ThemedText>
          
          {renderMultiSelector(
            'Aggravating Factors',
            painData.aggravatingFactors,
            (factor) => {
              setPainData(prev => ({
                ...prev,
                aggravatingFactors: prev.aggravatingFactors.includes(factor)
                  ? prev.aggravatingFactors.filter(f => f !== factor)
                  : [...prev.aggravatingFactors, factor]
              }));
            },
            aggravatingFactors
          )}
          
          {renderMultiSelector(
            'Relieving Factors',
            painData.relievingFactors,
            (factor) => {
              setPainData(prev => ({
                ...prev,
                relievingFactors: prev.relievingFactors.includes(factor)
                  ? prev.relievingFactors.filter(f => f !== factor)
                  : [...prev.relievingFactors, factor]
              }));
            },
            relievingFactors
          )}
          
          {renderMultiSelector(
            'Non-Pharmacological Methods Used',
            painData.nonPharmacologicalMethods,
            (method) => {
              setPainData(prev => ({
                ...prev,
                nonPharmacologicalMethods: prev.nonPharmacologicalMethods.includes(method)
                  ? prev.nonPharmacologicalMethods.filter(m => m !== method)
                  : [...prev.nonPharmacologicalMethods, method]
              }));
            },
            nonPharmacologicalMethods
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
            📝 Additional Notes
          </ThemedText>
          
          <View style={{ marginBottom: Spacing.md }}>
            <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.xs, fontWeight: '600' }}>
              Functional Goals
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
                minHeight: 60,
                textAlignVertical: 'top',
              }}
              value={painData.functionalGoals}
              onChangeText={(text) => setPainData(prev => ({ ...prev, functionalGoals: text }))}
              placeholder="What would the patient like to be able to do with better pain control?"
              placeholderTextColor={onSurfaceColor + '60'}
              multiline
            />
          </View>
          
          <View style={{ marginBottom: Spacing.md }}>
            <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.xs, fontWeight: '600' }}>
              Caregiver Concerns
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
                minHeight: 60,
                textAlignVertical: 'top',
              }}
              value={painData.caregiverConcerns}
              onChangeText={(text) => setPainData(prev => ({ ...prev, caregiverConcerns: text }))}
              placeholder="Family/caregiver concerns about pain management..."
              placeholderTextColor={onSurfaceColor + '60'}
              multiline
            />
          </View>
          
          <View>
            <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.xs, fontWeight: '600' }}>
              Clinical Notes
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
              value={painData.notes}
              onChangeText={(text) => setPainData(prev => ({ ...prev, notes: text }))}
              placeholder="Additional clinical observations, assessment findings, or care planning notes..."
              placeholderTextColor={onSurfaceColor + '60'}
              multiline
            />
          </View>
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
          onPress={handleSavePainAssessment}
          style={{ flex: 2 }}
        />
      </ThemedView>
    </ThemedView>
  );
} 