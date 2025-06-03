import {
  Button,
  PatientCard,
  Spacing,
  ThemedText,
  ThemedView,
  ThemeToggleButton
} from '@/components/ui';
import { usePatient } from '@/hooks/usePatients';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useVisit } from '@/hooks/useVisits';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VisitAssessmentFlow() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [assessmentData] = useState({
    vitals: null,
    pain: null,
    medications: [],
    interventions: [],
    familyInfo: null,
    visitNotes: ''
  });

  // Theme colors
  const surfaceColor = useThemeColor({}, 'surface');
  const outlineColor = useThemeColor({}, 'outline');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');

  // Get visit and patient data
  const { visit, loading: visitLoading } = useVisit(id);
  const { patient, loading: patientLoading } = usePatient(visit?.patientId);

  const assessmentSteps = [
    {
      id: 'vitals',
      title: 'Vital Signs',
      description: 'Record patient vital signs',
      icon: 'pulse',
      route: `/visit-details/${id}/assessment/vitals`,
      completed: !!assessmentData.vitals
    },
    {
      id: 'pain',
      title: 'Pain Assessment',
      description: 'Assess pain level and characteristics',
      icon: 'medical-outline',
      route: `/visit-details/${id}/assessment/pain`,
      completed: !!assessmentData.pain
    },
    {
      id: 'medications',
      title: 'Medications',
      description: 'Document medications administered',
      icon: 'medical',
      route: `/visit-details/${id}/assessment/medications`,
      completed: assessmentData.medications.length > 0
    },
    {
      id: 'interventions',
      title: 'Interventions',
      description: 'Record nursing interventions performed',
      icon: 'heart',
      route: `/visit-details/${id}/assessment/interventions`,
      completed: assessmentData.interventions.length > 0
    },
    {
      id: 'family',
      title: 'Family Information',
      description: 'Document family interaction and support',
      icon: 'people',
      route: `/visit-details/${id}/assessment/family`,
      completed: !!assessmentData.familyInfo
    },
    {
      id: 'notes',
      title: 'Visit Notes',
      description: 'Final visit documentation',
      icon: 'document-text',
      route: `/visit-details/${id}/assessment/notes`,
      completed: !!assessmentData.visitNotes
    }
  ];

  if (visitLoading || patientLoading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.sm }}>
          Loading assessment...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!visit || !patient) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText variant="titleLarge">Assessment Not Available</ThemedText>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={{ marginTop: Spacing.md }}
        />
      </ThemedView>
    );
  }

  const completedSteps = assessmentSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / assessmentSteps.length) * 100;

  const handleStepPress = (step) => {
    router.push(step.route);
  };

  const handleCompleteAssessment = () => {
    // TODO: Save all assessment data to database
    console.log('Assessment completed:', assessmentData);
    
    // Navigate back to visit details
    router.push(`/visit-details/${id}`);
  };

  const canCompleteAssessment = completedSteps >= 4; // Require at least vitals, pain, interventions, and notes

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
          Visit Assessment
        </ThemedText>
        
        <ThemeToggleButton />
      </ThemedView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Spacing.md }}>
        {/* Patient Information */}
        <View style={{ marginBottom: Spacing.md }}>
          <PatientCard
            patientName={patient.name}
            patientId={patient.id}
            location={{
              address: patient.address,
              coordinates: patient.coordinates
            }}
            priority={patient.priority}
          />
        </View>

        {/* Progress Indicator */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm }}>
            <ThemedText variant="titleMedium">Assessment Progress</ThemedText>
            <ThemedText variant="bodyMedium" style={{ color: primaryColor, fontWeight: '600' }}>
              {completedSteps}/{assessmentSteps.length}
            </ThemedText>
          </View>
          
          <View style={{ 
            height: 8, 
            backgroundColor: outlineColor + '30', 
            borderRadius: 4,
            marginBottom: Spacing.sm
          }}>
            <View style={{ 
              height: '100%', 
              width: `${progressPercentage}%`, 
              backgroundColor: successColor,
              borderRadius: 4
            }} />
          </View>
          
          <ThemedText variant="bodySmall" style={{ opacity: 0.7 }}>
            Complete all required assessments to finish the visit
          </ThemedText>
        </View>

        {/* Assessment Steps */}
        <View style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            Assessment Components
          </ThemedText>
          
          {assessmentSteps.map((step, index) => (
            <TouchableOpacity
              key={step.id}
              onPress={() => handleStepPress(step)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: step.completed ? successColor + '10' : surfaceColor,
                padding: Spacing.md,
                borderRadius: Spacing.borderRadius.md,
                marginBottom: Spacing.sm,
                borderWidth: 1,
                borderColor: step.completed ? successColor + '30' : outlineColor,
              }}
            >
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: step.completed ? successColor : primaryColor,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: Spacing.md
              }}>
                {step.completed ? (
                  <Ionicons name="checkmark" size={20} color="white" />
                ) : (
                  <Ionicons name={step.icon} size={20} color="white" />
                )}
              </View>
              
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodyMedium" style={{ fontWeight: '600', marginBottom: Spacing.xs }}>
                  {step.title}
                </ThemedText>
                <ThemedText variant="bodySmall" style={{ opacity: 0.7 }}>
                  {step.description}
                </ThemedText>
              </View>
              
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={onSurfaceColor} 
                style={{ opacity: 0.5 }} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={{ 
          backgroundColor: surfaceColor,
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          marginBottom: Spacing.lg,
          borderWidth: 1,
          borderColor: outlineColor
        }}>
          <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
            Quick Actions
          </ThemedText>
          
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                padding: Spacing.md,
                borderRadius: Spacing.borderRadius.md,
                borderWidth: 1,
                borderColor: 'rgba(255, 193, 7, 0.3)',
                alignItems: 'center'
              }}
              onPress={() => router.push(`/visit-details/${id}/assessment/emergency`)}
            >
              <Ionicons name="warning" size={24} color="#FFC107" />
              <ThemedText variant="labelSmall" style={{ marginTop: Spacing.xs, textAlign: 'center' }}>
                Emergency Documentation
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                padding: Spacing.md,
                borderRadius: Spacing.borderRadius.md,
                borderWidth: 1,
                borderColor: 'rgba(33, 150, 243, 0.3)',
                alignItems: 'center'
              }}
              onPress={() => router.push(`/visit-details/${id}/assessment/summary`)}
            >
              <Ionicons name="document-text" size={24} color="#2196F3" />
              <ThemedText variant="labelSmall" style={{ marginTop: Spacing.xs, textAlign: 'center' }}>
                View Summary
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <ThemedView style={{
        flexDirection: 'row',
        padding: Spacing.md,
        paddingBottom: insets.bottom + Spacing.md,
        borderTopWidth: 1,
        borderTopColor: outlineColor,
        gap: Spacing.sm,
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flex: 1,
            backgroundColor: surfaceColor,
            borderWidth: 1,
            borderColor: outlineColor,
            borderRadius: Spacing.borderRadius.lg,
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ThemedText variant="labelMedium">Save & Exit</ThemedText>
        </TouchableOpacity>

        <Button
          title={canCompleteAssessment ? "Complete Visit" : "Continue Assessment"}
          onPress={canCompleteAssessment ? handleCompleteAssessment : () => {
            const nextIncompleteStep = assessmentSteps.find(step => !step.completed);
            if (nextIncompleteStep) {
              handleStepPress(nextIncompleteStep);
            }
          }}
          style={{ flex: 2 }}
          disabled={!canCompleteAssessment && completedSteps === 0}
        />
      </ThemedView>
    </ThemedView>
  );
} 