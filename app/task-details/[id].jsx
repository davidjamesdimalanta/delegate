import {
    Button,
    FullScreenNotesEditor,
    PatientCard,
    PatientDetailsDrawer,
    Spacing,
    TaskCard,
    ThemedText,
    ThemedView,
    ThemeToggleButton
} from '@/components/ui';
import { SAMPLE_PATIENTS } from '@/constants/SamplePatients';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Sample task data - in a real app this would come from your data store
const SAMPLE_TASKS = [
  {
    id: '1',
    title: 'Medication Administration',
    description: 'Administer insulin to patient in Room 204. Check blood sugar levels before administration and record results.',
    dueTime: '2:30 PM',
    status: 'pending',
    priority: 'critical',
    patientId: 'MRN-12345',
    notes: 'Patient has been showing elevated glucose levels consistently. Monitor for any adverse reactions.'
  },
  {
    id: '2',
    title: 'Vital Signs Check',
    description: 'Record vital signs for post-op patient including blood pressure, heart rate, temperature, and respiratory rate.',
    dueTime: '3:00 PM',
    status: 'pending',
    priority: 'medium',
    patientId: 'MRN-67890',
    notes: 'Patient is recovering well from surgery. Continue monitoring every 2 hours.'
  },
  {
    id: '3',
    title: 'Patient Discharge',
    description: 'Complete discharge paperwork and provide patient with post-care instructions and medication schedule.',
    dueTime: '4:15 PM',
    status: 'pending',
    priority: 'low',
    patientId: 'MRN-24680',
    notes: ''
  },
  {
    id: '4',
    title: 'Wound Care Assessment',
    description: 'Assess and redress surgical wound for patient in Room 302. Check for signs of infection.',
    dueTime: '5:00 PM',
    status: 'pending',
    priority: 'medium',
    patientId: 'MRN-13579',
    notes: 'Wound healing progressing normally. No signs of infection observed.'
  },
  {
    id: '5',
    title: 'Physical Therapy Session',
    description: 'Assist patient with mobility exercises and rehabilitation following hip replacement surgery.',
    dueTime: '6:30 PM',
    status: 'pending',
    priority: 'low',
    patientId: 'MRN-97531',
    notes: ''
  },
  {
    id: '6',
    title: 'Emergency Response',
    description: 'Respond to urgent call in ICU - patient monitoring required for cardiac irregularities.',
    dueTime: 'NOW',
    status: 'pending',
    priority: 'critical',
    patientId: 'MRN-86420',
    notes: 'URGENT: Patient showing cardiac irregularities. Immediate attention required.'
  },
  // Completed Tasks
  {
    id: '7',
    title: 'Morning Medication Round',
    description: 'Administered all scheduled morning medications to patients in assigned ward. All medications given on time without complications.',
    dueTime: '8:00 AM',
    status: 'completed',
    priority: 'medium',
    patientId: 'MRN-12345',
    notes: 'All morning medications administered successfully. Patient responded well to insulin dose adjustment.'
  },
  {
    id: '8',
    title: 'Patient Assessment',
    description: 'Completed comprehensive initial assessment for new patient admission including medical history, current symptoms, and care plan development.',
    dueTime: '10:30 AM',
    status: 'completed',
    priority: 'low',
    patientId: 'MRN-67890',
    notes: 'Initial assessment completed. Patient is stable and comfortable. Care plan established with physician.'
  },
  {
    id: '9',
    title: 'Blood Draw',
    description: 'Collected blood samples for routine lab work including CBC, metabolic panel, and lipid profile as ordered by physician.',
    dueTime: '11:15 AM',
    status: 'completed',
    priority: 'medium',
    patientId: 'MRN-24680',
    notes: 'Blood samples collected without complications. Samples sent to lab for processing. Results expected by 2 PM.'
  }
];

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
  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColor = useThemeColor({}, 'surface');
  const outlineColor = useThemeColor({}, 'outline');
  const onSurfaceColor = useThemeColor({}, 'onSurface');

  // Find the task by ID
  const task = SAMPLE_TASKS.find(t => t.id === id);
  
  // Get current task status (from local state or original task)
  const currentStatus = taskStatuses[id] || task?.status || 'pending';
  
  // Find the related patient
  const patient = task ? SAMPLE_PATIENTS.find(p => p.id === task.patientId) : null;

  if (!task) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText variant="titleLarge">Task not found</ThemedText>
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
    }
  };

  const handleMarkAsDone = () => {
    console.log(`Marking task ${task.id} as done`);
    // Update task status to completed
    setTaskStatuses(prev => ({
      ...prev,
      [task.id]: 'completed'
    }));
    
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
  };

  const getSecondaryButtonTitle = () => {
    switch (currentStatus) {
      case 'pending':
        return 'Mark as In Progress';
      case 'inProgress':
        return 'Mark as Pending';
      case 'completed':
        return 'Reopen Task';
      default:
        return 'Mark as In Progress';
    }
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
          dueTime={task.dueTime}
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