import AIScribeInterface from '@/components/ai-scribe/AIScribeInterface';
import { PatientCard, PatientDetailsDrawer, ThemedText, ThemedView, ThemeToggleButton, VisitCard } from '@/components/ui';
import { usePatient } from '@/hooks/usePatients';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useVisit } from '@/hooks/useVisits';
import { createClinicalNote } from '@/lib/database-clinical-notes';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VisitDetailsPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [aiScribeVisible, setAiScribeVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Theme colors
  const outlineColor = useThemeColor({}, 'outline');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');

  // Get the visit from database
  const { visit, loading, error } = useVisit(id);
  
  // Get the related patient from database - only if we have a visit with a patient ID
  const { patient, loading: patientLoading, error: patientError } = usePatient(
    visit?.patientId && visit.patientId.trim() ? visit.patientId : null
  );

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <ThemedText variant="bodyMedium" style={{ marginTop: 16 }}>
          Loading visit data...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error || !visit) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText variant="titleLarge">Visit not found</ThemedText>
        <ThemedText variant="bodyMedium" style={{ marginTop: 16, textAlign: 'center' }}>
          {error || 'Unable to load visit data'}
        </ThemedText>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{
            backgroundColor: primaryColor,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            marginTop: 16
          }}
        >
          <ThemedText style={{ color: 'white', fontWeight: '600' }}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // Show loading state while patient data is loading (only if we have a patient ID to load)
  if (patientLoading && visit?.patientId) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <ThemedText variant="bodyMedium" style={{ marginTop: 16 }}>
          Loading patient data...
        </ThemedText>
      </ThemedView>
    );
  }

  // Show error if patient not found (only if we tried to load a patient)
  if (visit?.patientId && (patientError || !patient)) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText variant="titleLarge">Patient not found</ThemedText>
        <ThemedText variant="bodyMedium" style={{ marginTop: 16, textAlign: 'center' }}>
          {patientError || 'Unable to load patient data for this visit'}
        </ThemedText>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{
            backgroundColor: primaryColor,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            marginTop: 16
          }}
        >
          <ThemedText style={{ color: 'white', fontWeight: '600' }}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const handlePatientPress = () => {
    if (patient) {
      setSelectedPatient(patient);
      setDrawerVisible(true);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setTimeout(() => setSelectedPatient(null), 300);
  };

  const handleBeginVisit = () => {
    setAiScribeVisible(true);
  };

  const handleAiScribeClose = () => {
    setAiScribeVisible(false);
  };

  const handleNoteSaved = async (note, transcription) => {
    console.log('Clinical note saved:', note);
    console.log('Original transcription:', transcription);
    
    try {
      if (!visit?.id || !patient?.id) {
        throw new Error('Missing visit or patient ID');
      }

      // Save the clinical note to the database
      const { data, error } = await createClinicalNote(
        visit.id,
        patient.id,
        note,
        transcription,
        undefined // No user ID until auth is implemented
      );

      if (error) {
        throw new Error(error.message || 'Failed to save clinical note');
      }

      Alert.alert(
        'Note Saved',
        'Clinical note has been saved to the patient record.',
        [{ text: 'OK' }]
      );
      
      console.log('✅ Clinical note saved to database:', data);
    } catch (error) {
      console.error('❌ Error saving clinical note:', error);
      Alert.alert(
        'Save Failed',
        `Failed to save clinical note: ${error.message}`,
        [{ text: 'OK' }]
      );
    }
  };

  const patientContext = patient ? {
    id: patient.id,
    name: patient.name,
    condition: patient.primaryDiagnosis || patient.condition || 'General care',
    currentSymptoms: patient.currentSymptoms || [],
    medications: patient.medications || []
  } : undefined;

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Header */}
      <ThemedView style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: insets.top + 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: outlineColor,
      }}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color={onSurfaceColor} />
        </TouchableOpacity>
        
        <ThemedText variant="titleLarge" style={{ flex: 1 }}>
          Visit Details
        </ThemedText>
        
        <ThemeToggleButton />
      </ThemedView>

      {/* Main Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Patient Card */}
        <TouchableOpacity onPress={handlePatientPress} style={{ marginBottom: 24 }}>
          <PatientCard
            patientName={patient.name}
            patientId={patient.id}
            location={{
              address: patient.address,
              coordinates: patient.coordinates
            }}
            priority={patient.priority}
          />
        </TouchableOpacity>

        {/* Expanded Visit Details Card */}
        <View style={{ marginBottom: 24 }}>
          <VisitCard visit={visit} />
        </View>

        {/* Visit Information Section */}
        <View style={{
          backgroundColor: surfaceColor,
          padding: 16,
          borderRadius: 12,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: 16 }}>
            📋 Visit Information
          </ThemedText>
          
          {/* Scheduled Time */}
          <View style={{ marginBottom: 12 }}>
            <ThemedText variant="bodySmall" style={{ opacity: 0.7, marginBottom: 4 }}>
              Scheduled Time
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="time-outline" size={16} color={onSurfaceColor} style={{ marginRight: 8 }} />
              <ThemedText variant="bodyMedium">
                {visit.scheduledTime ? new Date(visit.scheduledTime).toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                }) : 'Not scheduled'}
              </ThemedText>
            </View>
          </View>

          {/* Visit Type */}
          <View style={{ marginBottom: 12 }}>
            <ThemedText variant="bodySmall" style={{ opacity: 0.7, marginBottom: 4 }}>
              Visit Type
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="medical-outline" size={16} color={onSurfaceColor} style={{ marginRight: 8 }} />
              <ThemedText variant="bodyMedium" style={{ textTransform: 'capitalize' }}>
                {visit.visitType ? visit.visitType.replace('-', ' ') : 'Standard visit'}
              </ThemedText>
            </View>
          </View>

          {/* Status */}
          <View style={{ marginBottom: 12 }}>
            <ThemedText variant="bodySmall" style={{ opacity: 0.7, marginBottom: 4 }}>
              Status
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons 
                name={visit.status === 'scheduled' ? 'time-outline' : 
                      visit.status === 'in-progress' ? 'play-circle' : 
                      visit.status === 'completed' ? 'checkmark-circle' : 'alert-circle'} 
                size={16} 
                color={visit.status === 'completed' ? '#10B981' : 
                       visit.status === 'in-progress' ? '#F59E0B' : 
                       visit.status === 'scheduled' ? '#6B7280' : '#EF4444'} 
                style={{ marginRight: 8 }} 
              />
              <ThemedText variant="bodyMedium" style={{ textTransform: 'capitalize' }}>
                {visit.status || 'Scheduled'}
              </ThemedText>
            </View>
          </View>

          {/* Duration */}
          {visit.estimatedDurationMinutes && (
            <View style={{ marginBottom: 12 }}>
              <ThemedText variant="bodySmall" style={{ opacity: 0.7, marginBottom: 4 }}>
                Estimated Duration
              </ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="hourglass-outline" size={16} color={onSurfaceColor} style={{ marginRight: 8 }} />
                <ThemedText variant="bodyMedium">
                  {visit.estimatedDurationMinutes} minutes
                </ThemedText>
              </View>
            </View>
          )}

          {/* Assigned Nurse */}
          {visit.assignedNurse && (
            <View style={{ marginBottom: 12 }}>
              <ThemedText variant="bodySmall" style={{ opacity: 0.7, marginBottom: 4 }}>
                Assigned Nurse
              </ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="person-outline" size={16} color={onSurfaceColor} style={{ marginRight: 8 }} />
                <ThemedText variant="bodyMedium">
                  {visit.assignedNurse}
                </ThemedText>
              </View>
            </View>
          )}

          {/* Visit Notes Preview */}
          {visit.visitNotes && (
            <View>
              <ThemedText variant="bodySmall" style={{ opacity: 0.7, marginBottom: 4 }}>
                Notes
              </ThemedText>
              <View style={{ 
                backgroundColor: 'rgba(0,0,0,0.05)', 
                padding: 12, 
                borderRadius: 8, 
                borderLeftWidth: 3, 
                borderLeftColor: primaryColor 
              }}>
                <ThemedText variant="bodyMedium" style={{ fontStyle: 'italic' }}>
                  &quot;{visit.visitNotes.substring(0, 200)}{visit.visitNotes.length > 200 ? '...' : ''}&quot;
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Begin Visit Button */}
        <TouchableOpacity
          onPress={handleBeginVisit}
          style={{
            backgroundColor: primaryColor,
            paddingVertical: 20,
            paddingHorizontal: 32,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="medical" size={24} color="white" style={{ marginRight: 12 }} />
            <ThemedText style={{ 
              color: 'white', 
              fontSize: 18, 
              fontWeight: '600' 
            }}>
              Begin Visit
            </ThemedText>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Patient Details Drawer */}
      <PatientDetailsDrawer
        visible={drawerVisible}
        onClose={handleCloseDrawer}
        patient={selectedPatient}
      />

      {/* AI Scribe Interface */}
      <AIScribeInterface
        isVisible={aiScribeVisible}
        onClose={handleAiScribeClose}
        onNoteSaved={handleNoteSaved}
        patientContext={patientContext}
        visitId={visit?.id}
        currentUserId={undefined} // No user ID until auth is implemented
      />
    </ThemedView>
  );
} 