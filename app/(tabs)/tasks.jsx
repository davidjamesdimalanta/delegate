import {
  Spacing,
  TaskCard,
  ThemedText,
  ThemedView,
  ThemeToggleButton
} from '@/components/ui';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TasksPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleTaskPress = (taskId) => {
    console.log(`Task pressed: ${taskId}`);
    router.push(`/task-details/${taskId}`);
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
        <ThemedText variant="headlineMedium">
          Tasks
        </ThemedText>
        <ThemeToggleButton />
      </ThemedView>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: Spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {/* Pending Tasks */}
        <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
          Pending Tasks
        </ThemedText>

        <TaskCard
          taskTitle="Medication Administration"
          taskDescription="Administer insulin to patient in Room 204"
          dueTime="2:30 PM"
          status="pending"
          priority="critical"
          onPress={() => handleTaskPress('1')}
          style={{ marginBottom: Spacing.md }}
        />

        <TaskCard
          taskTitle="Vital Signs Check"
          taskDescription="Record vital signs for post-op patient"
          dueTime="3:00 PM"
          status="pending"
          priority="medium"
          onPress={() => handleTaskPress('2')}
          style={{ marginBottom: Spacing.md }}
        />

        <TaskCard
          taskTitle="Patient Discharge"
          taskDescription="Complete discharge paperwork and instructions"
          dueTime="4:15 PM"
          status="pending"
          priority="low"
          onPress={() => handleTaskPress('3')}
          style={{ marginBottom: Spacing.md }}
        />

        <TaskCard
          taskTitle="Wound Care Assessment"
          taskDescription="Assess and redress surgical wound for patient in Room 302"
          dueTime="5:00 PM"
          status="pending"
          priority="medium"
          onPress={() => handleTaskPress('4')}
          style={{ marginBottom: Spacing.md }}
        />

        <TaskCard
          taskTitle="Physical Therapy Session"
          taskDescription="Assist patient with mobility exercises and rehabilitation"
          dueTime="6:30 PM"
          status="pending"
          priority="low"
          onPress={() => handleTaskPress('5')}
          style={{ marginBottom: Spacing.md }}
        />

        <TaskCard
          taskTitle="Emergency Response"
          taskDescription="Respond to urgent call in ICU - patient monitoring required"
          dueTime="NOW"
          status="pending"
          priority="critical"
          onPress={() => handleTaskPress('6')}
          style={{ marginBottom: Spacing.md }}
        />

        {/* Completed Tasks Section */}
        <ThemedText variant="titleMedium" style={{ marginTop: Spacing.lg, marginBottom: Spacing.md }}>
          Completed Tasks
        </ThemedText>

        <TaskCard
          taskTitle="Morning Medication Round"
          taskDescription="Administered all scheduled morning medications"
          dueTime="8:00 AM"
          status="completed"
          priority="medium"
          onPress={() => handleTaskPress('7')}
          style={{ marginBottom: Spacing.md }}
        />

        <TaskCard
          taskTitle="Patient Assessment"
          taskDescription="Completed initial assessment for new patient in Room 105"
          dueTime="10:30 AM"
          status="completed"
          priority="low"
          onPress={() => handleTaskPress('8')}
          style={{ marginBottom: Spacing.md }}
        />

        <TaskCard
          taskTitle="Blood Draw"
          taskDescription="Collected blood samples for lab work"
          dueTime="11:15 AM"
          status="completed"
          priority="medium"
          onPress={() => handleTaskPress('9')}
          style={{ marginBottom: Spacing.md }}
        />

        {/* Final spacer */}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </ThemedView>
  );
} 