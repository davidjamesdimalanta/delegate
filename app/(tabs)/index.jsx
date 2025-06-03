import {
    Button,
    Card,
    FullScreenNotesEditor,
    PalliativePatientCard,
    PatientDetailsDrawer,
    Spacing,
    ThemedText,
    ThemedView,
    ThemeToggleButton
} from '@/components/ui';
import { usePatients } from '@/hooks/usePatients';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MedicalDashboard() {
  const insets = useSafeAreaInsets();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notesEditorVisible, setNotesEditorVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [patientNotes, setPatientNotes] = useState({});

  // Get patient data from database
  const { patients, loading, error, refreshPatients } = usePatients();

  // Get theme colors
  const primaryColor = useThemeColor({}, 'primary');

  const handlePatientPress = (patient) => {
    setSelectedPatient(patient);
    setDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    // Small delay to avoid visual glitch when closing
    setTimeout(() => setSelectedPatient(null), 300);
  };

  const handleEditNotes = (patient, currentNotes) => {
    // Ensure we have a valid patient before proceeding
    if (!patient) {
      console.error('No patient provided to handleEditNotes');
      return;
    }
    
    // Close the drawer first
    setDrawerVisible(false);
    
    // Set the editing patient immediately
    setEditingPatient(patient);
    
    // Open the notes editor after a short delay to ensure drawer is closed
    setTimeout(() => {
      setNotesEditorVisible(true);
    }, 100);
  };

  const handleSaveNotes = (notes) => {
    if (editingPatient) {
      setPatientNotes(prev => ({
        ...prev,
        [editingPatient.id]: notes
      }));
      
      // Update the selected patient if it's the same one being edited
      if (selectedPatient && selectedPatient.id === editingPatient.id) {
        setSelectedPatient(prev => ({
          ...prev,
          notes: notes
        }));
      }
    }
  };

  const handleCloseNotesEditor = () => {
    setNotesEditorVisible(false);
    
    // Reopen the drawer if we still have a selected patient
    setTimeout(() => {
      if (selectedPatient || editingPatient) {
        setDrawerVisible(true);
      }
      setEditingPatient(null);
    }, 100);
  };

  // Get patient with updated notes
  const getPatientWithNotes = (patient) => ({
    ...patient,
    notes: patientNotes[patient.id] || patient.notes || ''
  });

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Header */}
      <ThemedView 
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: Spacing.md,
          paddingTop: insets.top + Spacing.md,
        }}
      >
        <ThemedText variant="headlineMedium">
          Palliative Care Dashboard
        </ThemedText>
        <ThemeToggleButton />
      </ThemedView>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          padding: Spacing.md,
          paddingBottom: insets.bottom + 90 // Tab bar height + extra padding
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <Card variant="elevated" style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="titleLarge" style={{ marginBottom: Spacing.sm }}>
            Patient Care Coordination
          </ThemedText>
          <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.md }}>
            Comprehensive palliative care management including symptom assessment, family support, and interdisciplinary coordination.
          </ThemedText>
          <Button 
            title="View All Patients" 
            variant="filled" 
            onPress={() => router.push('/patients-list')}
          />
        </Card>

        {/* Quick Actions */}
        <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
          Quick Actions
        </ThemedText>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          marginBottom: Spacing.lg 
        }}>
          <Button 
            title="Symptom Assessment" 
            variant="filled" 
            priority="symptom-care"
            size="small"
            style={{ flex: 1, marginRight: Spacing.xs }}
            onPress={() => console.log('Start symptom assessment')}
          />
          <Button 
            title="Family Support" 
            variant="outlined" 
            priority="family-support"
            size="small"
            style={{ flex: 1, marginHorizontal: Spacing.xs }}
            onPress={() => console.log('View family support')}
          />
          <Button 
            title="Team Notes" 
            variant="text" 
            size="small"
            style={{ flex: 1, marginLeft: Spacing.xs }}
            onPress={() => console.log('View team notes')}
          />
        </View>

        {/* Patient Cards */}
        <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
          Current Patients
        </ThemedText>
        
        {/* Show loading indicator */}
        {loading && patients.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: Spacing.lg }}>
            <ActivityIndicator size="large" color={primaryColor} />
            <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.sm }}>
              Loading patients...
            </ThemedText>
          </View>
        )}

        {/* Show error message */}
        {error && (
          <Card variant="elevated" style={{ marginBottom: Spacing.md }}>
            <ThemedText variant="bodyMedium" style={{ color: 'red', marginBottom: Spacing.sm }}>
              Error loading patients: {error}
            </ThemedText>
            <Button 
              title="Retry" 
              variant="outlined" 
              onPress={refreshPatients}
              size="small"
            />
          </Card>
        )}

        {/* Render database patients */}
        {patients.map((patient) => (
          <PalliativePatientCard
            key={patient.id}
            patientName={patient.name}
            patientId={patient.id}
            location={{
              address: patient.address,
              coordinates: patient.coordinates
            }}
            priority={patient.priority}
            onPress={() => handlePatientPress(getPatientWithNotes(patient))}
            style={{ marginBottom: Spacing.md }}
          >
            {/* Simplified last seen information */}
            {patient.last_seen_by && (
              <View style={{ marginTop: Spacing.sm, marginLeft: -Spacing.sm }}>
                <ThemedText variant="bodySmall" style={{ marginBottom: Spacing.xs, marginLeft: Spacing.sm }}>
                  Last seen: {new Date(patient.last_seen_by.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })} at {patient.last_seen_by.time}
                </ThemedText>
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  paddingHorizontal: Spacing.sm,
                  paddingVertical: Spacing.xs,
                  borderRadius: Spacing.borderRadius.sm,
                  alignSelf: 'flex-start',
                  marginLeft: Spacing.sm
                }}>
                  <ThemedText variant="bodySmall" style={{ fontWeight: '600', marginRight: Spacing.xs }}>
                    {patient.last_seen_by.provider}
                  </ThemedText>
                  <View style={{
                    backgroundColor: primaryColor + '20',
                    paddingHorizontal: Spacing.xs,
                    paddingVertical: 2,
                    borderRadius: Spacing.borderRadius.xs,
                    borderWidth: 1,
                    borderColor: primaryColor + '40'
                  }}>
                    <ThemedText variant="labelSmall" style={{ 
                      color: primaryColor, 
                      fontWeight: '600',
                      fontSize: 10
                    }}>
                      {patient.last_seen_by.discipline.toUpperCase()}
                    </ThemedText>
                  </View>
                </View>
              </View>
            )}
          </PalliativePatientCard>
        ))}

        {/* Show message when no patients */}
        {!loading && patients.length === 0 && !error && (
          <Card variant="elevated" style={{ marginBottom: Spacing.md }}>
            <ThemedText variant="bodyMedium" style={{ textAlign: 'center' }}>
              No patients found. The database will be initialized with sample data automatically.
            </ThemedText>
          </Card>
        )}

        {/* Patient Details Drawer */}
        <PatientDetailsDrawer
          visible={drawerVisible}
          patient={selectedPatient}
          onClose={handleCloseDrawer}
          onEditNotes={handleEditNotes}
        />

        {/* Notes Editor */}
        <FullScreenNotesEditor
          visible={notesEditorVisible}
          patient={editingPatient}
          initialNotes={editingPatient ? (patientNotes[editingPatient.id] || editingPatient.notes || '') : ''}
          onSave={handleSaveNotes}
          onClose={handleCloseNotesEditor}
        />
      </ScrollView>
    </ThemedView>
  );
} 