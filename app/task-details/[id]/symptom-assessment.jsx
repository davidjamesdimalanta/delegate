import {
    Button,
    Spacing,
    SymptomAssessmentCard,
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
    id: '2',
    title: 'Symptom Assessment',
    description: 'Conduct comprehensive symptom assessment',
    priority: 'symptom-care',
    patientId: '1', // Use database patient ID
    status: 'pending'
  }
];

export default function SymptomAssessmentPage() {
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

  const handleAssessmentComplete = (assessment) => {
    console.log('Assessment completed:', assessment);
    // TODO: Save assessment data
    
    // Show feedback and navigate back
    router.back();
  };

  const handleNavigateToFull = () => {
    console.log('Navigate to comprehensive symptom assessment');
    // TODO: Navigate to full ESAS-r interface
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

        {/* Main Symptom Assessment Card */}
        <SymptomAssessmentCard
          patient={patient}
          onAssessmentComplete={handleAssessmentComplete}
          onNavigateToFull={handleNavigateToFull}
          style={{ marginBottom: Spacing.lg }}
        />

        {/* Additional Assessment Tools */}
        <View style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            Additional Tools
          </ThemedText>
          
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginBottom: Spacing.md,
            }}
            onPress={() => console.log('Navigate to ESAS-r')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                📋
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Complete ESAS-r Assessment
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  Full 9-item symptom assessment scale
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
            onPress={() => console.log('Navigate to pain assessment')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                ⚡
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Detailed Pain Assessment
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  Location, quality, and triggers
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
            onPress={() => console.log('Navigate to symptom history')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                📈
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Symptom Trends
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  View historical symptom data
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={onSurfaceColor} style={{ opacity: 0.5 }} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Assessment History */}
        <View style={{ marginBottom: insets.bottom + Spacing.lg }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            Assessment History
          </ThemedText>
          
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginBottom: Spacing.md,
            }}
            onPress={() => console.log('Navigate to assessment history')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                📅
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  View Assessment History
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  Past assessments and trends
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