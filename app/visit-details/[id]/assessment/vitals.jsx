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

export default function VitalsAssessment() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Theme colors
  const surfaceColor = useThemeColor({}, 'surface');
  const outlineColor = useThemeColor({}, 'outline');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const primaryColor = useThemeColor({}, 'primary');
  const warningColor = useThemeColor({}, 'warning');

  // Vital signs state
  const [vitals, setVitals] = useState({
    temperature: '',
    temperatureUnit: 'F',
    temperatureSite: 'oral',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    bloodPressurePosition: 'sitting',
    heartRate: '',
    heartRhythm: 'regular',
    respiratoryRate: '',
    respiratoryCharacter: 'regular',
    oxygenSaturation: '',
    oxygenSupport: 'room air',
    oxygenFlowRate: '',
    weight: '',
    weightUnit: 'kg',
    painLevel: '',
    neurologicalStatus: '',
    skinColor: '',
    edemaLocation: [],
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const temperatureSites = [
    { value: 'oral', label: 'Oral' },
    { value: 'rectal', label: 'Rectal' },
    { value: 'axillary', label: 'Axillary' },
    { value: 'temporal', label: 'Temporal' },
    { value: 'ear', label: 'Ear' }
  ];

  const bloodPressurePositions = [
    { value: 'sitting', label: 'Sitting' },
    { value: 'lying', label: 'Lying' },
    { value: 'standing', label: 'Standing' }
  ];

  const heartRhythms = [
    { value: 'regular', label: 'Regular' },
    { value: 'irregular', label: 'Irregular' }
  ];

  const respiratoryCharacters = [
    { value: 'regular', label: 'Regular' },
    { value: 'labored', label: 'Labored' },
    { value: 'shallow', label: 'Shallow' },
    { value: 'deep', label: 'Deep' }
  ];

  const oxygenSupports = [
    { value: 'room air', label: 'Room Air' },
    { value: 'nasal cannula', label: 'Nasal Cannula' },
    { value: 'face mask', label: 'Face Mask' },
    { value: 'non-rebreather', label: 'Non-Rebreather' }
  ];

  const edemaLocations = [
    'Lower extremities',
    'Upper extremities',
    'Sacral',
    'Abdominal',
    'Facial',
    'Generalized'
  ];

  const validateVitals = () => {
    const newErrors = {};

    // Basic validation
    if (!vitals.temperature) newErrors.temperature = 'Temperature is required';
    if (!vitals.bloodPressureSystolic || !vitals.bloodPressureDiastolic) {
      newErrors.bloodPressure = 'Blood pressure is required';
    }
    if (!vitals.heartRate) newErrors.heartRate = 'Heart rate is required';
    if (!vitals.respiratoryRate) newErrors.respiratoryRate = 'Respiratory rate is required';

    // Range validation
    if (vitals.temperature) {
      const temp = parseFloat(vitals.temperature);
      if (vitals.temperatureUnit === 'F' && (temp < 90 || temp > 110)) {
        newErrors.temperature = 'Temperature out of normal range';
      } else if (vitals.temperatureUnit === 'C' && (temp < 32 || temp > 43)) {
        newErrors.temperature = 'Temperature out of normal range';
      }
    }

    if (vitals.oxygenSaturation) {
      const spo2 = parseInt(vitals.oxygenSaturation);
      if (spo2 < 50 || spo2 > 100) {
        newErrors.oxygenSaturation = 'Oxygen saturation must be between 50-100%';
      }
    }

    if (vitals.painLevel) {
      const pain = parseInt(vitals.painLevel);
      if (pain < 0 || pain > 10) {
        newErrors.painLevel = 'Pain level must be between 0-10';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveVitals = async () => {
    if (!validateVitals()) {
      Alert.alert('Validation Error', 'Please correct the highlighted fields.');
      return;
    }

    try {
      // TODO: Save to database via MCP
      console.log('Saving vitals:', vitals);
      
      Alert.alert(
        'Vital Signs Saved',
        'Vital signs have been recorded successfully.',
        [
          {
            text: 'Continue to Pain Assessment',
            onPress: () => router.push(`/visit-details/${id}/assessment/pain`)
          },
          {
            text: 'Back to Assessment',
            onPress: () => router.back()
          }
        ]
      );
    } catch (_error) {
      Alert.alert('Error', 'Failed to save vital signs. Please try again.');
    }
  };

  const renderInputField = (label, value, onChangeText, keyboardType = 'default', placeholder = '', error = null) => (
    <View style={{ marginBottom: Spacing.md }}>
      <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.xs, fontWeight: '600' }}>
        {label}
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
        }}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={onSurfaceColor + '60'}
      />
      {error && (
        <ThemedText variant="bodySmall" style={{ color: warningColor, marginTop: Spacing.xs }}>
          {error}
        </ThemedText>
      )}
    </View>
  );

  const renderSelector = (label, value, onSelect, options, error = null) => (
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
      {error && (
        <ThemedText variant="bodySmall" style={{ color: warningColor, marginTop: Spacing.xs }}>
          {error}
        </ThemedText>
      )}
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
          Vital Signs
        </ThemedText>
        
        <ThemeToggleButton />
      </ThemedView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Spacing.md }}>
        {/* Temperature */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            🌡️ Temperature
          </ThemedText>
          
          <View style={{ flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md }}>
            <View style={{ flex: 2 }}>
              {renderInputField(
                'Temperature',
                vitals.temperature,
                (text) => setVitals(prev => ({ ...prev, temperature: text })),
                'numeric',
                '98.6',
                errors.temperature
              )}
            </View>
            <View style={{ flex: 1 }}>
              {renderSelector(
                'Unit',
                vitals.temperatureUnit,
                (value) => setVitals(prev => ({ ...prev, temperatureUnit: value })),
                [{ value: 'F', label: '°F' }, { value: 'C', label: '°C' }]
              )}
            </View>
          </View>
          
          {renderSelector(
            'Measurement Site',
            vitals.temperatureSite,
            (value) => setVitals(prev => ({ ...prev, temperatureSite: value })),
            temperatureSites
          )}
        </View>

        {/* Blood Pressure */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            🩺 Blood Pressure
          </ThemedText>
          
          <View style={{ flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md }}>
            <View style={{ flex: 1 }}>
              {renderInputField(
                'Systolic',
                vitals.bloodPressureSystolic,
                (text) => setVitals(prev => ({ ...prev, bloodPressureSystolic: text })),
                'numeric',
                '120',
                errors.bloodPressure
              )}
            </View>
            <View style={{ flex: 1 }}>
              {renderInputField(
                'Diastolic',
                vitals.bloodPressureDiastolic,
                (text) => setVitals(prev => ({ ...prev, bloodPressureDiastolic: text })),
                'numeric',
                '80'
              )}
            </View>
          </View>
          
          {renderSelector(
            'Position',
            vitals.bloodPressurePosition,
            (value) => setVitals(prev => ({ ...prev, bloodPressurePosition: value })),
            bloodPressurePositions
          )}
        </View>

        {/* Heart Rate */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            💓 Heart Rate
          </ThemedText>
          
          <View style={{ flexDirection: 'row', gap: Spacing.md }}>
            <View style={{ flex: 1 }}>
              {renderInputField(
                'Rate (bpm)',
                vitals.heartRate,
                (text) => setVitals(prev => ({ ...prev, heartRate: text })),
                'numeric',
                '72',
                errors.heartRate
              )}
            </View>
            <View style={{ flex: 1 }}>
              {renderSelector(
                'Rhythm',
                vitals.heartRhythm,
                (value) => setVitals(prev => ({ ...prev, heartRhythm: value })),
                heartRhythms
              )}
            </View>
          </View>
        </View>

        {/* Respiratory */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            🫁 Respiratory
          </ThemedText>
          
          <View style={{ flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md }}>
            <View style={{ flex: 1 }}>
              {renderInputField(
                'Rate (per min)',
                vitals.respiratoryRate,
                (text) => setVitals(prev => ({ ...prev, respiratoryRate: text })),
                'numeric',
                '16',
                errors.respiratoryRate
              )}
            </View>
            <View style={{ flex: 1 }}>
              {renderInputField(
                'O2 Sat (%)',
                vitals.oxygenSaturation,
                (text) => setVitals(prev => ({ ...prev, oxygenSaturation: text })),
                'numeric',
                '98',
                errors.oxygenSaturation
              )}
            </View>
          </View>
          
          {renderSelector(
            'Character',
            vitals.respiratoryCharacter,
            (value) => setVitals(prev => ({ ...prev, respiratoryCharacter: value })),
            respiratoryCharacters
          )}
          
          {renderSelector(
            'Oxygen Support',
            vitals.oxygenSupport,
            (value) => setVitals(prev => ({ ...prev, oxygenSupport: value })),
            oxygenSupports
          )}
          
          {vitals.oxygenSupport !== 'room air' && (
            <View style={{ marginTop: Spacing.md }}>
              {renderInputField(
                'Flow Rate (L/min)',
                vitals.oxygenFlowRate,
                (text) => setVitals(prev => ({ ...prev, oxygenFlowRate: text })),
                'numeric',
                '2'
              )}
            </View>
          )}
        </View>

        {/* Additional Assessments */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            📊 Additional Assessments
          </ThemedText>
          
          <View style={{ flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md }}>
            <View style={{ flex: 1 }}>
              {renderInputField(
                `Weight (${vitals.weightUnit})`,
                vitals.weight,
                (text) => setVitals(prev => ({ ...prev, weight: text })),
                'numeric',
                '70'
              )}
            </View>
            <View style={{ flex: 1 }}>
              {renderInputField(
                'Pain Level (0-10)',
                vitals.painLevel,
                (text) => setVitals(prev => ({ ...prev, painLevel: text })),
                'numeric',
                '0',
                errors.painLevel
              )}
            </View>
          </View>
          
          {renderInputField(
            'Neurological Status',
            vitals.neurologicalStatus,
            (text) => setVitals(prev => ({ ...prev, neurologicalStatus: text })),
            'default',
            'Alert and oriented x3'
          )}
          
          {renderInputField(
            'Skin Color/Condition',
            vitals.skinColor,
            (text) => setVitals(prev => ({ ...prev, skinColor: text })),
            'default',
            'Pink, warm, dry'
          )}
          
          {renderMultiSelector(
            'Edema Location (if present)',
            vitals.edemaLocation,
            (location) => {
              setVitals(prev => ({
                ...prev,
                edemaLocation: prev.edemaLocation.includes(location)
                  ? prev.edemaLocation.filter(l => l !== location)
                  : [...prev.edemaLocation, location]
              }));
            },
            edemaLocations
          )}
        </View>

        {/* Notes */}
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
            value={vitals.notes}
            onChangeText={(text) => setVitals(prev => ({ ...prev, notes: text }))}
            placeholder="Additional observations, concerns, or relevant clinical notes..."
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
          onPress={handleSaveVitals}
          style={{ flex: 2 }}
        />
      </ThemedView>
    </ThemedView>
  );
} 