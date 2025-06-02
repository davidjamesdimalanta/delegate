import {
    Button,
    GoalsOfCareCard,
    Spacing,
    ThemedText,
    ThemedView
} from '@/components/ui';
import { usePatient } from '@/hooks/usePatients';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SAMPLE_TASKS = [
  {
    id: '3',
    title: 'Goals of Care Discussion',
    description: 'Conduct goals of care discussion with patient and family',
    priority: 'goals-of-care',
    patientId: '1', // Use database patient ID
    status: 'pending'
  }
];

export default function GoalsOfCarePage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Theme colors - must be called before any conditional returns
  const primaryColor = useThemeColor({}, 'primary');
  const onSurfaceColor = useThemeColor({}, 'onSurface');

  // Find the task
  const task = SAMPLE_TASKS.find(t => t.id === id);
  
  // Get the patient from database
  const { patient, loading: patientLoading, error: patientError } = usePatient(task?.patientId || '');

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

  // Show loading state
  if (patientLoading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={primaryColor} />
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

  const handleGoalsComplete = (goals) => {
    console.log('Goals updated:', goals);
    // TODO: Save goals data
    
    // Show feedback and navigate back
    router.back();
  };

  const handleNavigateToFull = () => {
    console.log('Navigate to comprehensive goals of care planning');
    // TODO: Navigate to full advance care planning interface
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: Spacing.md, paddingTop: Spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Context */}
        <View style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.sm }}>
            Patient: {patient.name}
          </ThemedText>
          <ThemedText variant="bodyMedium" style={{ opacity: 0.8 }}>
            {patient.condition} • Task #{id}
          </ThemedText>
        </View>

        {/* Main Goals of Care Card */}
        <GoalsOfCareCard
          patient={patient}
          onGoalsComplete={handleGoalsComplete}
          onNavigateToFull={handleNavigateToFull}
          style={{ marginBottom: Spacing.lg }}
        />

        {/* Care Planning Tools */}
        <View style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            Care Planning Tools
          </ThemedText>
          
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginBottom: Spacing.md,
            }}
            onPress={() => console.log('Navigate to advance directive forms')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                📋
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Advance Directive Forms
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  DNR, DNI, MOLST, and POLST documentation
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={onSurfaceColor} style={{ opacity: 0.5 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginBottom: Spacing.md,
            }}
            onPress={() => console.log('Navigate to care preferences')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                🏠
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Care Preferences
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  Preferred location and treatment options
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={onSurfaceColor} style={{ opacity: 0.5 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginBottom: Spacing.md,
            }}
            onPress={() => console.log('Navigate to prognosis discussion')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                💭
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Prognosis Discussion
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  Document prognosis conversations
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={onSurfaceColor} style={{ opacity: 0.5 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
            }}
            onPress={() => console.log('Navigate to care team coordination')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                👥
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Care Team Coordination
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  Multi-disciplinary care planning
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={onSurfaceColor} style={{ opacity: 0.5 }} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Legal Documents */}
        <View style={{ marginBottom: insets.bottom + Spacing.lg }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            Legal Documents
          </ThemedText>
          
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginBottom: Spacing.md,
            }}
            onPress={() => console.log('Navigate to advance directive forms')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                📋
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Advance Directive Forms
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  DNR, DNI, MOLST, and POLST documentation
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={onSurfaceColor} style={{ opacity: 0.5 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginBottom: Spacing.md,
            }}
            onPress={() => console.log('Navigate to care preferences')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                🏠
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Care Preferences
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  Preferred location and treatment options
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={onSurfaceColor} style={{ opacity: 0.5 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginBottom: Spacing.md,
            }}
            onPress={() => console.log('Navigate to prognosis discussion')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                💭
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Prognosis Discussion
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  Document prognosis conversations
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={onSurfaceColor} style={{ opacity: 0.5 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
            }}
            onPress={() => console.log('Navigate to care team coordination')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                👥
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Care Team Coordination
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  Multi-disciplinary care planning
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={onSurfaceColor} style={{ opacity: 0.5 }} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
} 