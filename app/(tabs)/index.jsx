import {
  Button,
  Card,
  FullScreenNotesEditor,
  PatientCard,
  PatientDetailsDrawer,
  Spacing,
  ThemedText,
  ThemedView,
  ThemeToggleButton
} from '@/components/ui';
import { SAMPLE_PATIENTS } from '@/constants/SamplePatients';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MedicalDashboard() {
  const insets = useSafeAreaInsets();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notesEditorVisible, setNotesEditorVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [patientNotes, setPatientNotes] = useState({});

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
          Patients
        </ThemedText>
        <ThemeToggleButton />
      </ThemedView>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: Spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <Card variant="elevated" style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="titleLarge" style={{ marginBottom: Spacing.sm }}>
            Patient Dashboard
          </ThemedText>
          <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.md }}>
            View and manage patient information, access medical records, and track patient care progress.
          </ThemedText>
          <Button 
            title="View All Patients" 
            variant="filled" 
            onPress={() => console.log('Navigate to all patients')}
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
            title="New Task" 
            variant="filled" 
            priority="medium"
            size="small"
            style={{ flex: 1, marginRight: Spacing.xs }}
            onPress={() => console.log('Create new task')}
          />
          <Button 
            title="Urgent" 
            variant="outlined" 
            priority="critical"
            size="small"
            style={{ flex: 1, marginHorizontal: Spacing.xs }}
            onPress={() => console.log('View urgent tasks')}
          />
          <Button 
            title="Reports" 
            variant="text" 
            size="small"
            style={{ flex: 1, marginLeft: Spacing.xs }}
            onPress={() => console.log('View reports')}
          />
        </View>

        {/* Patient Cards */}
        <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
          Recent Patients
        </ThemedText>
        
        {/* Render first few sample patients */}
        {SAMPLE_PATIENTS.slice(0, 3).map((patient) => (
          <PatientCard
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
            <ThemedText variant="bodySmall" style={{ marginTop: Spacing.sm }}>
              {patient.vitals}
            </ThemedText>
          </PatientCard>
        ))}

        {/* Design System Demo */}
        <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
          Design System Demo
        </ThemedText>

        <Card variant="outlined" style={{ marginBottom: Spacing.md }}>
          <ThemedText variant="titleSmall" style={{ marginBottom: Spacing.sm }}>
            Typography Variants
          </ThemedText>
          <ThemedText variant="headlineSmall" style={{ marginBottom: Spacing.xs }}>
            Headline Small
          </ThemedText>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.xs }}>
            Title Medium
          </ThemedText>
          <ThemedText variant="bodyLarge" style={{ marginBottom: Spacing.xs }}>
            Body Large - Main content text
          </ThemedText>
          <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.xs }}>
            Body Medium - Secondary content
          </ThemedText>
          <ThemedText variant="labelLarge" style={{ marginBottom: Spacing.xs }}>
            Label Large - Button text
          </ThemedText>
          <ThemedText medicalVariant="patientName" style={{ marginBottom: Spacing.xs }}>
            Patient Name Style
          </ThemedText>
          <ThemedText medicalVariant="medicalId">
            Medical ID: MRN-12345
          </ThemedText>
        </Card>

        {/* Additional patient cards to show more locations */}
        <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
          More Patients
        </ThemedText>
        
        {SAMPLE_PATIENTS.slice(3).map((patient) => (
          <PatientCard
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
            <ThemedText variant="bodySmall" style={{ marginTop: Spacing.sm }}>
              {patient.vitals}
            </ThemedText>
          </PatientCard>
        ))}

        {/* Final spacer */}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      {/* Patient Details Drawer */}
      <PatientDetailsDrawer
        visible={drawerVisible}
        onClose={handleCloseDrawer}
        patient={selectedPatient}
        onEditNotes={handleEditNotes}
      />

      {/* Full Screen Notes Editor */}
      <FullScreenNotesEditor
        visible={notesEditorVisible}
        onClose={handleCloseNotesEditor}
        onSave={handleSaveNotes}
        patient={editingPatient}
        initialNotes={editingPatient ? (patientNotes[editingPatient.id] || editingPatient.notes || '') : ''}
      />
    </ThemedView>
  );
} 