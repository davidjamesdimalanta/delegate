import {
    Spacing,
    TaskCard,
    ThemedText,
    ThemedView,
    ThemeToggleButton
} from '@/components/ui';
import { useTasks } from '@/hooks/useTasks';
import { debugTasksTable } from '@/lib/database';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TasksPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tasks, loading, error, refreshTasks } = useTasks();
  const [refreshing, setRefreshing] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('=== TASKS PAGE DEBUG ===');
    console.log('Tasks array:', tasks);
    console.log('Tasks length:', tasks.length);
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('========================');
  }, [tasks, loading, error]);

  // Add this useEffect to run debugging on mount
  useEffect(() => {
    console.log('📱 TasksPage: Component mounted, running debugTasksTable...');
    debugTasksTable();
  }, []);

  const handleTaskPress = (taskId) => {
    console.log(`Task pressed: ${taskId}`);
    router.push(`/task-details/${taskId}`);
  };

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh button pressed...');
    setRefreshing(true);
    await refreshTasks();
    setRefreshing(false);
    console.log('✅ Manual refresh completed');
  };

  // Separate tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'pending' || task.status === 'inProgress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  console.log('Pending tasks:', pendingTasks.length);
  console.log('Completed tasks:', completedTasks.length);

  if (loading && tasks.length === 0) {
    console.log('Showing loading state');
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.sm }}>
          Loading tasks...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    console.log('Showing error state:', error);
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.md }}>
        <ThemedText variant="titleLarge" style={{ textAlign: 'center', marginBottom: Spacing.sm }}>
          Error Loading Tasks
        </ThemedText>
        <ThemedText variant="bodyMedium" style={{ textAlign: 'center' }}>
          {error}
        </ThemedText>
      </ThemedView>
    );
  }

  console.log('Rendering main tasks view');

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
        contentContainerStyle={{ 
          padding: Spacing.md,
          paddingBottom: insets.bottom + 90 // Tab bar height + extra padding
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Debug Info */}
        <ThemedText variant="bodySmall" style={{ marginBottom: Spacing.md, opacity: 0.7 }}>
          Debug: {tasks.length} total tasks | Loading: {loading.toString()} | Error: {error || 'none'}
        </ThemedText>

        {/* Pending Tasks */}
        <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
          Pending Tasks ({pendingTasks.length})
        </ThemedText>

        {pendingTasks.length === 0 ? (
          <ThemedText variant="bodyMedium" style={{ fontStyle: 'italic', opacity: 0.7, marginBottom: Spacing.lg }}>
            No pending tasks
          </ThemedText>
        ) : (
          pendingTasks.map((task) => (
            <TaskCard
              key={task.id}
              taskTitle={task.title}
              taskDescription={task.description}
              dueTime={task.due_time}
              status={task.status}
              priority={task.priority}
              onPress={() => handleTaskPress(task.id)}
              style={{ marginBottom: Spacing.md }}
            />
          ))
        )}

        {/* Completed Tasks Section */}
        <ThemedText variant="titleMedium" style={{ marginTop: Spacing.lg, marginBottom: Spacing.md }}>
          Completed Tasks ({completedTasks.length})
        </ThemedText>

        {completedTasks.length === 0 ? (
          <ThemedText variant="bodyMedium" style={{ fontStyle: 'italic', opacity: 0.7 }}>
            No completed tasks
          </ThemedText>
        ) : (
          completedTasks.map((task) => (
            <TaskCard
              key={task.id}
              taskTitle={task.title}
              taskDescription={task.description}
              dueTime={task.due_time}
              status={task.status}
              priority={task.priority}
              onPress={() => handleTaskPress(task.id)}
              style={{ marginBottom: Spacing.md }}
            />
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
} 