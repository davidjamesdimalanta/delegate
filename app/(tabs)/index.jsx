import {
  Button,
  Card,
  PatientCard,
  Spacing,
  TaskCard,
  ThemedText,
  ThemedView,
  ThemeToggleButton
} from '@/components/ui';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MedicalDashboard() {
  const insets = useSafeAreaInsets();

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
          Medical Delegate
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
            Welcome to Medical Delegate
          </ThemedText>
          <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.md }}>
            Efficiently manage and delegate medical tasks to field nurses with our comprehensive task management system.
          </ThemedText>
          <Button 
            title="View All Tasks" 
            variant="filled" 
            onPress={() => console.log('Navigate to tasks')}
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
        
        <PatientCard
          patientName="Sarah Johnson"
          patientId="MRN-12345"
          room="Room 204"
          priority="high"
          onPress={() => console.log('View patient details')}
          style={{ marginBottom: Spacing.md }}
        >
          <ThemedText variant="bodySmall" style={{ marginTop: Spacing.sm }}>
            Last vitals: 98.6°F, 120/80 mmHg, 72 bpm
          </ThemedText>
        </PatientCard>

        <PatientCard
          patientName="Michael Chen"
          patientId="MRN-67890"
          room="Room 156"
          priority="medium"
          onPress={() => console.log('View patient details')}
          style={{ marginBottom: Spacing.md }}
        >
          <ThemedText variant="bodySmall" style={{ marginTop: Spacing.sm }}>
            Scheduled for medication review at 2:00 PM
          </ThemedText>
        </PatientCard>

        {/* Task Cards */}
        <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
          Pending Tasks
        </ThemedText>

        <TaskCard
          taskTitle="Medication Administration"
          taskDescription="Administer insulin to patient in Room 204"
          dueTime="2:30 PM"
          status="pending"
          priority="critical"
          onPress={() => console.log('View task details')}
          style={{ marginBottom: Spacing.md }}
        />

        <TaskCard
          taskTitle="Vital Signs Check"
          taskDescription="Record vital signs for post-op patient"
          dueTime="3:00 PM"
          status="inProgress"
          priority="medium"
          onPress={() => console.log('View task details')}
          style={{ marginBottom: Spacing.md }}
        />

        <TaskCard
          taskTitle="Patient Discharge"
          taskDescription="Complete discharge paperwork and instructions"
          dueTime="4:15 PM"
          status="completed"
          priority="low"
          onPress={() => console.log('View task details')}
          style={{ marginBottom: Spacing.md }}
        />

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

        <Card variant="filled" style={{ marginBottom: Spacing.md }}>
          <ThemedText variant="titleSmall" style={{ marginBottom: Spacing.sm }}>
            Button Variants
          </ThemedText>
          <View style={{ gap: Spacing.sm }}>
            <Button title="Filled Button" variant="filled" />
            <Button title="Outlined Button" variant="outlined" />
            <Button title="Text Button" variant="text" />
            <Button title="Tonal Button" variant="tonal" />
            <Button title="Critical Priority" variant="filled" priority="critical" />
            <Button title="Loading Button" variant="filled" loading />
          </View>
        </Card>

        {/* Bottom spacing */}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </ThemedView>
  );
} 