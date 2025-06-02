import {
    Button,
    FamilySupportCard,
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
    id: '1',
    title: 'Family Support Assessment',
    description: 'Conduct family support assessment and provide resources',
    priority: 'family-support',
    patientId: '1', // Use database patient ID
    status: 'pending'
  }
];

export default function FamilySupportPage() {
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

  const handleSupportComplete = (support) => {
    console.log('Support completed:', support);
    // TODO: Save support data
    
    // Show feedback and navigate back
    router.back();
  };

  const handleNavigateToFull = () => {
    console.log('Navigate to comprehensive family support');
    // TODO: Navigate to full family support interface
  };

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

        {/* Main Family Support Card */}
        <FamilySupportCard
          patient={patient}
          onSupportComplete={handleSupportComplete}
          onNavigateToFull={handleNavigateToFull}
          style={{ marginBottom: Spacing.lg }}
        />

        {/* Support Resources */}
        <View style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            Support Resources
          </ThemedText>
          
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginBottom: Spacing.md,
            }}
            onPress={() => console.log('Navigate to caregiver education')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                📚
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Caregiver Education Resources
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  Guides, videos, and training materials
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
            onPress={() => console.log('Navigate to respite care')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                🛌
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Respite Care Options
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  Temporary care to give caregivers a break
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
            onPress={() => console.log('Navigate to grief counseling')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                💭
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Grief & Bereavement Support
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  Counseling and support groups
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
            onPress={() => console.log('Navigate to community resources')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                🔗
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Community Resources
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  Local support services and organizations
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={onSurfaceColor} style={{ opacity: 0.5 }} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Emergency Contacts */}
        <View style={{ marginBottom: insets.bottom + Spacing.lg }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            Emergency Support
          </ThemedText>
          
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: Spacing.md,
              borderRadius: Spacing.borderRadius.md,
              marginBottom: Spacing.md,
            }}
            onPress={() => console.log('Navigate to emergency contact')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
                📞
              </ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                  Contact Emergency Services
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                  Call 911 or local emergency services
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