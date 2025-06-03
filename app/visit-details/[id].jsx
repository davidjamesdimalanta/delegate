import {
  Button,
  FullScreenNotesEditor,
  PatientCard,
  PatientDetailsDrawer,
  Spacing,
  ThemedText,
  ThemedView,
  ThemeToggleButton,
  VisitCard
} from '@/components/ui';
import { usePatient } from '@/hooks/usePatients';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useVisit } from '@/hooks/useVisits';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VisitDetailsPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notesEditorVisible, setNotesEditorVisible] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [visitNotes, setVisitNotes] = useState({});
  const [visitStatuses, setVisitStatuses] = useState({}); // Track visit status changes
  const [activeTab, setActiveTab] = useState('overview'); // Track active nursing tab

  // Theme colors
  const surfaceColor = useThemeColor({}, 'surface');
  const outlineColor = useThemeColor({}, 'outline');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');

  // Get the visit from database
  const { visit, loading, error } = useVisit(id);
  
  // Get current visit status (from local state or original visit)
  const currentStatus = visitStatuses[id] || visit?.status || 'scheduled';
  
  // Get the related patient from database - only if we have a visit with a patient ID
  const { patient, loading: patientLoading, error: patientError } = usePatient(
    visit?.patientId && visit.patientId.trim() ? visit.patientId : null
  );

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.sm }}>
          Loading visit data...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error || !visit) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText variant="titleLarge">Visit not found</ThemedText>
        <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.sm, textAlign: 'center' }}>
          {error || 'Unable to load visit data'}
        </ThemedText>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={{ marginTop: Spacing.md }}
        />
      </ThemedView>
    );
  }

  // Show loading state while patient data is loading (only if we have a patient ID to load)
  if (patientLoading && visit?.patientId) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.sm }}>
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
        <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.sm, textAlign: 'center' }}>
          {patientError || 'Unable to load patient data for this visit'}
        </ThemedText>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={{ marginTop: Spacing.md }}
        />
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

  const handleEditNotes = () => {
    setEditingVisit(visit);
    setNotesEditorVisible(true);
  };

  const handleSaveNotes = (notes) => {
    if (editingVisit) {
      setVisitNotes(prev => ({
        ...prev,
        [editingVisit.id]: notes
      }));
      // TODO: Update visit notes in database
    }
  };

  const handleStartVisit = () => {
    console.log(`Starting visit ${visit.id}`);
    // Update visit status to in-progress
    setVisitStatuses(prev => ({
      ...prev,
      [visit.id]: 'in-progress'
    }));
    
    // Navigate to the assessment flow
    router.push(`/visit-details/${visit.id}/assessment`);
  };

  const handleCompleteVisit = () => {
    console.log(`Completing visit ${visit.id}`);
    // Update visit status to completed
    setVisitStatuses(prev => ({
      ...prev,
      [visit.id]: 'completed'
    }));
    
    // TODO: Update visit status in database and record completion time
    
    // Show brief feedback before navigating back
    setTimeout(() => {
      router.back();
    }, 500);
  };

  const handleToggleProgress = () => {
    let newStatus;
    
    switch (currentStatus) {
      case 'scheduled':
        newStatus = 'in-progress';
        break;
      case 'in-progress':
        newStatus = 'scheduled';
        break;
      case 'completed':
        newStatus = 'scheduled'; // Reopen visit
        break;
      default:
        newStatus = 'in-progress';
    }
    
    console.log(`Changing visit ${visit.id} status from ${currentStatus} to: ${newStatus}`);
    setVisitStatuses(prev => ({
      ...prev,
      [visit.id]: newStatus
    }));
    
    // TODO: Update visit status in database
  };

  const getSecondaryButtonContent = () => {
    switch (currentStatus) {
      case 'scheduled':
        return (
          <View style={{ alignItems: 'center' }}>
            <ThemedText variant="labelMedium" style={{ textAlign: 'center' }}>
              Mark as
            </ThemedText>
            <ThemedText variant="labelLarge" style={{ fontWeight: '700', textAlign: 'center' }}>
              In Progress
            </ThemedText>
          </View>
        );
      case 'in-progress':
        return (
          <View style={{ alignItems: 'center' }}>
            <ThemedText variant="labelMedium" style={{ textAlign: 'center' }}>
              Mark as
            </ThemedText>
            <ThemedText variant="labelLarge" style={{ fontWeight: '700', textAlign: 'center' }}>
              Scheduled
            </ThemedText>
          </View>
        );
      case 'completed':
        return (
          <View style={{ alignItems: 'center' }}>
            <ThemedText variant="labelMedium" style={{ textAlign: 'center' }}>
              Reopen
            </ThemedText>
            <ThemedText variant="labelLarge" style={{ fontWeight: '700', textAlign: 'center' }}>
              Visit
            </ThemedText>
          </View>
        );
      default:
        return (
          <View style={{ alignItems: 'center' }}>
            <ThemedText variant="labelLarge" style={{ fontWeight: '700', textAlign: 'center' }}>
              Update Status
            </ThemedText>
          </View>
        );
    }
  };

  const getCurrentNotes = () => {
    return visitNotes[visit.id] || visit.visitNotes || '';
  };

  // Format visit time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Not set';
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Nursing assessment tabs
  const nursingTabs = [
    { id: 'overview', label: 'Overview', icon: 'medical' },
    { id: 'vitals', label: 'Vitals', icon: 'pulse' },
    { id: 'pain', label: 'Pain', icon: 'medical-outline' },
    { id: 'meds', label: 'Medications', icon: 'medical' },
    { id: 'interventions', label: 'Interventions', icon: 'heart' },
    { id: 'family', label: 'Family', icon: 'people' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View>
            {/* Visit Status and Timing */}
            <View style={{ 
              backgroundColor: surfaceColor,
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginBottom: Spacing.md,
              borderWidth: 1,
              borderColor: outlineColor
            }}>
              <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.sm }}>
                Visit Information
              </ThemedText>
              
              <View style={{ marginBottom: Spacing.sm }}>
                <ThemedText variant="bodySmall" style={{ opacity: 0.7, marginBottom: Spacing.xs }}>
                  Scheduled Time
                </ThemedText>
                <ThemedText variant="bodyMedium">
                  {formatTime(visit.scheduledTime)}
                </ThemedText>
              </View>

              {visit.actualStartTime && (
                <View style={{ marginBottom: Spacing.sm }}>
                  <ThemedText variant="bodySmall" style={{ opacity: 0.7, marginBottom: Spacing.xs }}>
                    Started
                  </ThemedText>
                  <ThemedText variant="bodyMedium">
                    {formatTime(visit.actualStartTime)}
                  </ThemedText>
                </View>
              )}

              {visit.actualEndTime && (
                <View style={{ marginBottom: Spacing.sm }}>
                  <ThemedText variant="bodySmall" style={{ opacity: 0.7, marginBottom: Spacing.xs }}>
                    Completed
                  </ThemedText>
                  <ThemedText variant="bodyMedium">
                    {formatTime(visit.actualEndTime)}
                  </ThemedText>
                </View>
              )}

              <View>
                <ThemedText variant="bodySmall" style={{ opacity: 0.7, marginBottom: Spacing.xs }}>
                  Visit Type
                </ThemedText>
                <ThemedText variant="bodyMedium" style={{ textTransform: 'capitalize' }}>
                  {visit.visitType.replace('-', ' ')}
                </ThemedText>
              </View>
            </View>

            {/* Assessment Summary */}
            <View style={{ 
              backgroundColor: surfaceColor,
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginBottom: Spacing.md,
              borderWidth: 1,
              borderColor: outlineColor
            }}>
              <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.sm }}>
                Assessment Summary
              </ThemedText>

              {/* Quick Stats */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {visit.vitalSigns && (
                  <View style={{ 
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    padding: Spacing.sm,
                    borderRadius: Spacing.borderRadius.sm,
                    marginRight: Spacing.sm,
                    marginBottom: Spacing.sm,
                    minWidth: 80
                  }}>
                    <Ionicons name="pulse" size={16} color={successColor} />
                    <ThemedText variant="labelSmall" style={{ marginTop: Spacing.xs }}>
                      Vitals Recorded
                    </ThemedText>
                  </View>
                )}

                {visit.painAssessment && (
                  <View style={{ 
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    padding: Spacing.sm,
                    borderRadius: Spacing.borderRadius.sm,
                    marginRight: Spacing.sm,
                    marginBottom: Spacing.sm,
                    minWidth: 80
                  }}>
                    <Ionicons name="medical" size={16} color={warningColor} />
                    <ThemedText variant="labelSmall" style={{ marginTop: Spacing.xs }}>
                      Pain: {visit.painAssessment.currentPainLevel}/10
                    </ThemedText>
                  </View>
                )}

                {visit.medicationsAdministered && visit.medicationsAdministered.length > 0 && (
                  <View style={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    padding: Spacing.sm,
                    borderRadius: Spacing.borderRadius.sm,
                    marginRight: Spacing.sm,
                    marginBottom: Spacing.sm,
                    minWidth: 80
                  }}>
                    <Ionicons name="medical-outline" size={16} color={primaryColor} />
                    <ThemedText variant="labelSmall" style={{ marginTop: Spacing.xs }}>
                      {visit.medicationsAdministered.length} Meds
                    </ThemedText>
                  </View>
                )}
              </View>

              {/* Notes Preview */}
              {getCurrentNotes() && (
                <View style={{ marginTop: Spacing.md }}>
                  <ThemedText variant="bodySmall" style={{ opacity: 0.7, marginBottom: Spacing.xs }}>
                    Visit Notes
                  </ThemedText>
                  <ThemedText variant="bodyMedium" style={{ fontStyle: 'italic' }}>
                    {getCurrentNotes().substring(0, 150)}{getCurrentNotes().length > 150 ? '...' : ''}
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        );
      
      case 'vitals':
        return (
          <View style={{ 
            backgroundColor: surfaceColor,
            padding: Spacing.md,
            borderRadius: Spacing.borderRadius.md,
            marginBottom: Spacing.md,
            borderWidth: 1,
            borderColor: outlineColor
          }}>
            <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.sm }}>
              Vital Signs
            </ThemedText>
            
            {visit.vitalSigns ? (
              <View>
                {visit.vitalSigns.temperature && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
                    <ThemedText variant="bodyMedium">Temperature</ThemedText>
                    <ThemedText variant="bodyMedium">
                      {visit.vitalSigns.temperature.value}°{visit.vitalSigns.temperature.unit}
                    </ThemedText>
                  </View>
                )}
                
                {visit.vitalSigns.bloodPressure && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
                    <ThemedText variant="bodyMedium">Blood Pressure</ThemedText>
                    <ThemedText variant="bodyMedium">
                      {visit.vitalSigns.bloodPressure.systolic}/{visit.vitalSigns.bloodPressure.diastolic}
                    </ThemedText>
                  </View>
                )}
                
                {visit.vitalSigns.heartRate && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
                    <ThemedText variant="bodyMedium">Heart Rate</ThemedText>
                    <ThemedText variant="bodyMedium">
                      {visit.vitalSigns.heartRate.value} bpm
                    </ThemedText>
                  </View>
                )}
                
                {visit.vitalSigns.painLevel !== undefined && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
                    <ThemedText variant="bodyMedium">Pain Level</ThemedText>
                    <ThemedText variant="bodyMedium">
                      {visit.vitalSigns.painLevel}/10
                    </ThemedText>
                  </View>
                )}
              </View>
            ) : (
              <View style={{ alignItems: 'center', padding: Spacing.lg }}>
                <Ionicons name="pulse-outline" size={48} color={outlineColor} />
                <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.md, textAlign: 'center' }}>
                  No vital signs recorded yet
                </ThemedText>
                <Button
                  title="Record Vital Signs"
                  onPress={() => {
                    // TODO: Navigate to vital signs entry form
                    console.log('Navigate to vital signs entry');
                  }}
                  style={{ marginTop: Spacing.md }}
                />
              </View>
            )}
          </View>
        );
      
      default:
        return (
          <View style={{ 
            backgroundColor: surfaceColor,
            padding: Spacing.md,
            borderRadius: Spacing.borderRadius.md,
            marginBottom: Spacing.md,
            borderWidth: 1,
            borderColor: outlineColor,
            alignItems: 'center'
          }}>
            <Ionicons name="construct-outline" size={48} color={outlineColor} />
            <ThemedText variant="titleMedium" style={{ marginTop: Spacing.md, marginBottom: Spacing.sm }}>
              Coming Soon
            </ThemedText>
            <ThemedText variant="bodyMedium" style={{ textAlign: 'center' }}>
              This nursing assessment feature is being developed.
            </ThemedText>
          </View>
        );
    }
  };

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
        
        <ThemedText variant="titleLarge" style={{ flex: 1 }}>
          Visit Details
        </ThemedText>
        
        <ThemeToggleButton />
      </ThemedView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Spacing.md }}>
        {/* Patient Information */}
        <TouchableOpacity onPress={handlePatientPress} style={{ marginBottom: Spacing.md }}>
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

        {/* Visit Card */}
        <VisitCard
          visit={{ ...visit, status: currentStatus }}
          style={{ marginBottom: Spacing.md }}
        />

        {/* Nursing Assessment Tabs */}
        <View style={{ marginBottom: Spacing.md }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: Spacing.md }}
          >
            {nursingTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.sm,
                  marginRight: Spacing.sm,
                  borderRadius: Spacing.borderRadius.md,
                  backgroundColor: activeTab === tab.id ? primaryColor : surfaceColor,
                  borderWidth: 1,
                  borderColor: activeTab === tab.id ? primaryColor : outlineColor,
                }}
              >
                <Ionicons 
                  name={tab.icon} 
                  size={16} 
                  color={activeTab === tab.id ? 'white' : onSurfaceColor} 
                  style={{ marginRight: Spacing.xs }}
                />
                <ThemedText 
                  variant="labelMedium" 
                  style={{ 
                    color: activeTab === tab.id ? 'white' : onSurfaceColor,
                    fontWeight: activeTab === tab.id ? '600' : '400'
                  }}
                >
                  {tab.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Tab Content */}
          {renderTabContent()}
        </View>

        {/* Existing Palliative Care Components */}
        {/* Removed the three compact components as these will be part of the visit assessment flow */}
      </ScrollView>

      {/* Action Buttons */}
      <ThemedView style={{
        flexDirection: 'row',
        padding: Spacing.md,
        paddingBottom: insets.bottom + Spacing.md,
        borderTopWidth: 1,
        borderTopColor: outlineColor,
        gap: Spacing.sm,
      }}>
        <TouchableOpacity
          onPress={handleToggleProgress}
          style={{
            flex: 1,
            backgroundColor: surfaceColor,
            borderWidth: 1,
            borderColor: outlineColor,
            borderRadius: Spacing.borderRadius.lg,
            paddingHorizontal: 24,
            paddingVertical: 12,
            minHeight: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {getSecondaryButtonContent()}
        </TouchableOpacity>

        {currentStatus === 'scheduled' && (
          <Button
            title="Start Visit"
            onPress={handleStartVisit}
            style={{ flex: 1 }}
          />
        )}

        {currentStatus === 'in-progress' && (
          <Button
            title="Complete Visit"
            onPress={handleCompleteVisit}
            style={{ flex: 1 }}
          />
        )}

        <TouchableOpacity
          onPress={handleEditNotes}
          style={{
            padding: Spacing.md,
            borderRadius: Spacing.borderRadius.md,
            borderWidth: 1,
            borderColor: outlineColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="create-outline" size={20} color={onSurfaceColor} />
        </TouchableOpacity>
      </ThemedView>

      {/* Patient Details Drawer */}
      <PatientDetailsDrawer
        visible={drawerVisible}
        onClose={handleCloseDrawer}
        patient={selectedPatient}
      />

      {/* Notes Editor */}
      <FullScreenNotesEditor
        visible={notesEditorVisible}
        onClose={() => setNotesEditorVisible(false)}
        onSave={handleSaveNotes}
        initialNotes={getCurrentNotes()}
        title={`Visit Notes - ${patient?.name}`}
      />
    </ThemedView>
  );
} 