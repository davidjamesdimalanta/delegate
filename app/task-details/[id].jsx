import {
  Button,
  FamilySupportCompact,
  FullScreenNotesEditor,
  GoalsOfCareCompact,
  PatientCard,
  PatientDetailsDrawer,
  Spacing,
  SymptomAssessmentCompact,
  TaskCard,
  ThemedText,
  ThemedView,
  ThemeToggleButton
} from '@/components/ui';
import { usePatient } from '@/hooks/usePatients';
import { useTask } from '@/hooks/useTasks';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TaskDetailsPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notesEditorVisible, setNotesEditorVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskNotes, setTaskNotes] = useState({});
  const [taskStatuses, setTaskStatuses] = useState({}); // Track task status changes

  // Theme colors
  const surfaceColor = useThemeColor({}, 'surface');
  const outlineColor = useThemeColor({}, 'outline');
  const onSurfaceColor = useThemeColor({}, 'onSurface');

  // Get the task from database
  const { task, loading, error } = useTask(id);
  
  // Get current task status (from local state or original task)
  const currentStatus = taskStatuses[id] || task?.status || 'pending';
  
  // Get the related patient from database
  const { patient, loading: patientLoading, error: patientError } = usePatient(task?.patient_id || '');

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.sm }}>
          Loading task data...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error || !task) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText variant="titleLarge">Task not found</ThemedText>
        <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.sm, textAlign: 'center' }}>
          {error || 'Unable to load task data'}
        </ThemedText>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={{ marginTop: Spacing.md }}
        />
      </ThemedView>
    );
  }

  // Show loading state while patient data is loading
  if (patientLoading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.sm }}>
          Loading patient data...
        </ThemedText>
      </ThemedView>
    );
  }

  // Show error if patient not found
  if (patientError || !patient) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText variant="titleLarge">Patient not found</ThemedText>
        <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.sm, textAlign: 'center' }}>
          {patientError || 'Unable to load patient data for this task'}
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
    setEditingTask(task);
    setNotesEditorVisible(true);
  };

  const handleSaveNotes = (notes) => {
    if (editingTask) {
      setTaskNotes(prev => ({
        ...prev,
        [editingTask.id]: notes
      }));
      // TODO: Update task notes in database
    }
  };

  const handleMarkAsDone = () => {
    console.log(`Marking task ${task.id} as done`);
    // Update task status to completed
    setTaskStatuses(prev => ({
      ...prev,
      [task.id]: 'completed'
    }));
    
    // TODO: Update task status in database
    
    // Show brief feedback before navigating back
    setTimeout(() => {
      router.back();
    }, 500);
  };

  const handleToggleProgress = () => {
    let newStatus;
    
    switch (currentStatus) {
      case 'pending':
        newStatus = 'inProgress';
        break;
      case 'inProgress':
        newStatus = 'pending';
        break;
      case 'completed':
        newStatus = 'pending'; // Reopen task
        break;
      default:
        newStatus = 'inProgress';
    }
    
    console.log(`Changing task ${task.id} status from ${currentStatus} to: ${newStatus}`);
    setTaskStatuses(prev => ({
      ...prev,
      [task.id]: newStatus
    }));
    
    // TODO: Update task status in database
  };

  const getSecondaryButtonContent = () => {
    switch (currentStatus) {
      case 'pending':
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
      case 'inProgress':
        return (
          <View style={{ alignItems: 'center' }}>
            <ThemedText variant="labelMedium" style={{ textAlign: 'center' }}>
              Mark as
            </ThemedText>
            <ThemedText variant="labelLarge" style={{ fontWeight: '700', textAlign: 'center' }}>
              Pending
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
              Task
            </ThemedText>
          </View>
        );
      default:
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
    }
  };

  const getCurrentNotes = () => {
    return taskNotes[task.id] || task.notes || '';
  };

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
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            flex: 1 
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#666" />
          <ThemedText variant="headlineMedium" style={{ marginLeft: Spacing.sm }}>
            Task Details
          </ThemedText>
        </TouchableOpacity>
        <ThemeToggleButton />
      </ThemedView>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: Spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {/* Task Information */}
        <TaskCard
          taskTitle={task.title}
          taskDescription={task.description}
          dueTime={task.due_time}
          status={currentStatus}
          priority={task.priority}
          style={{ marginBottom: Spacing.lg }}
        />

        {/* Patient Card */}
        {patient && (
          <View style={{ marginBottom: Spacing.lg }}>
            <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
              Patient Information
            </ThemedText>
            <PatientCard
              patientName={patient.name}
              patientId={patient.id}
              location={{
                address: patient.address,
                coordinates: patient.coordinates
              }}
              priority={patient.priority}
              onPress={handlePatientPress}
            >
              <ThemedText variant="bodySmall" style={{ marginTop: Spacing.sm }}>
                {patient.vitals}
              </ThemedText>
            </PatientCard>
          </View>
        )}

        {/* Phase 2: Palliative Care Task Sections */}
        {patient && (
          <View style={{ marginBottom: Spacing.lg }}>
            <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
              Care Assessment & Planning
            </ThemedText>
            
            {/* Symptom Assessment Section */}
            <SymptomAssessmentCompact
              patient={patient}
              onPress={() => {
                console.log('Navigate to symptom assessment page');
                router.push(`/task-details/${id}/symptom-assessment`);
              }}
              style={{ marginBottom: Spacing.md }}
            />

            {/* Family Support Section */}
            <FamilySupportCompact
              patient={patient}
              onPress={() => {
                console.log('Navigate to family support page');
                router.push(`/task-details/${id}/family-support`);
              }}
              style={{ marginBottom: Spacing.md }}
            />

            {/* Goals of Care Section */}
            <GoalsOfCareCompact
              patient={patient}
              onPress={() => {
                console.log('Navigate to goals of care page');
                router.push(`/task-details/${id}/goals-of-care`);
              }}
              style={{ marginBottom: Spacing.md }}
            />
          </View>
        )}

        {/* Notes Section */}
        <View style={{ marginBottom: Spacing.xl }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: Spacing.md 
          }}>
            <ThemedText variant="titleMedium">
              Task Notes
            </ThemedText>
            <TouchableOpacity 
              onPress={handleEditNotes}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: Spacing.sm,
                borderRadius: Spacing.borderRadius.sm,
              }}
            >
              <Ionicons name="create-outline" size={20} color={onSurfaceColor} style={{ opacity: 0.7 }} />
              <ThemedText variant="labelMedium" style={{ marginLeft: Spacing.xs, opacity: 0.7 }}>
                Edit
              </ThemedText>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            onPress={handleEditNotes}
            activeOpacity={0.7}
            style={{
              backgroundColor: surfaceColor,
              borderColor: outlineColor,
              borderWidth: 1,
              borderRadius: Spacing.borderRadius.md,
              padding: Spacing.md,
              minHeight: 120,
            }}
          >
            <ThemedText variant="bodyMedium" style={{ opacity: getCurrentNotes() ? 1 : 0.6 }}>
              {getCurrentNotes() || 'No notes added yet. Tap here to add notes about this task.'}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={{ marginBottom: insets.bottom + Spacing.md }}>
          <View style={{ flexDirection: 'row', gap: Spacing.md }}>
            <TouchableOpacity 
              onPress={handleToggleProgress}
              style={{ 
                flex: 1,
                borderWidth: 1,
                borderColor: outlineColor,
                borderRadius: Spacing.borderRadius.lg,
                paddingVertical: 16,
                paddingHorizontal: 24,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 48,
              }}
              activeOpacity={0.7}
            >
              {getSecondaryButtonContent()}
            </TouchableOpacity>
            <Button 
              title={currentStatus === 'completed' ? 'Completed' : 'Mark as Done'}
              variant="filled"
              priority={currentStatus === 'completed' ? 'low' : 'medium'}
              size="large"
              onPress={handleMarkAsDone}
              style={{ flex: 1 }}
              disabled={currentStatus === 'completed'}
            />
          </View>
        </View>
      </ScrollView>

      {/* Patient Details Drawer */}
      <PatientDetailsDrawer
        visible={drawerVisible}
        onClose={handleCloseDrawer}
        patient={selectedPatient}
        onEditNotes={(patient, notes) => {
          setDrawerVisible(false);
          // Handle patient notes editing if needed
        }}
      />

      {/* Full Screen Notes Editor */}
      <FullScreenNotesEditor
        visible={notesEditorVisible}
        onClose={() => setNotesEditorVisible(false)}
        onSave={handleSaveNotes}
        patient={editingTask ? { name: editingTask.title, id: editingTask.id } : null}
        initialNotes={getCurrentNotes()}
      />
    </ThemedView>
  );
} 