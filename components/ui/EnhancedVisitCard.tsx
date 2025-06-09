import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Spacing } from '../../constants/Spacing';
import { ClinicalNote } from '../../lib/ai/openai-client';
import AIScribeInterface from '../ai-scribe/AIScribeInterface';
import { ThemedText } from '../ThemedText';
import { Card } from './Card';

interface Visit {
  id: string;
  title: string;
  description: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'missed' | 'rescheduled';
  priority: 'imminent' | 'urgent-comfort' | 'symptom-care' | 'psychosocial' | 'family-support' | 'bereavement' | 'routine';
  visitType: string;
  scheduledTime?: string;
  patient?: {
    id: string;
    name: string;
    condition: string;
    currentSymptoms?: string[];
    medications?: string[];
  };
  vitalSigns?: any;
  painAssessment?: any;
  esasAssessment?: any;
  medicationsAdministered?: any[];
  comfortInterventions?: any[];
}

interface EnhancedVisitCardProps {
  visit: Visit;
  onPress?: () => void;
  onNotesSaved?: (visit: Visit, note: ClinicalNote, transcription: string) => void;
  showAIScribe?: boolean;
  children?: React.ReactNode;
}

export function EnhancedVisitCard({
  visit,
  onPress,
  onNotesSaved,
  showAIScribe = true,
  children,
  ...props
}: EnhancedVisitCardProps) {
  const [isAIScribeVisible, setIsAIScribeVisible] = useState(false);
  
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');
  const primaryColor = useThemeColor({}, 'primary');

  if (!visit) {
    return null;
  }

  // Format scheduled time
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return 'Not scheduled';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date
  const formatDate = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Get status icon and color
  const getStatusInfo = (status: Visit['status']) => {
    switch (status) {
      case 'scheduled':
        return { icon: 'time-outline', color: onSurfaceColor, label: 'Scheduled' };
      case 'in-progress':
        return { icon: 'play-circle', color: warningColor, label: 'In Progress' };
      case 'completed':
        return { icon: 'checkmark-circle', color: successColor, label: 'Completed' };
      case 'cancelled':
        return { icon: 'close-circle', color: errorColor, label: 'Cancelled' };
      case 'missed':
        return { icon: 'warning', color: errorColor, label: 'Missed' };
      case 'rescheduled':
        return { icon: 'refresh-circle', color: warningColor, label: 'Rescheduled' };
      default:
        return { icon: 'help-circle', color: onSurfaceColor, label: status };
    }
  };

  // Get visit type icon
  const getVisitTypeIcon = (visitType: string) => {
    switch (visitType) {
      case 'routine':
        return 'calendar-outline';
      case 'admission':
        return 'log-in-outline';
      case 'discharge':
        return 'log-out-outline';
      case 'emergency':
        return 'alert-circle-outline';
      case 'medication':
        return 'medical-outline';
      case 'symptom-management':
        return 'pulse-outline';
      case 'comfort-care':
        return 'heart-outline';
      case 'family-support':
        return 'people-outline';
      case 'assessment':
        return 'clipboard-outline';
      default:
        return 'document-outline';
    }
  };

  // Get priority emoji and info
  const getPriorityInfo = (priority: Visit['priority']) => {
    switch (priority) {
      case 'imminent':
        return { emoji: '🔴', description: 'Imminent', urgent: true };
      case 'urgent-comfort':
        return { emoji: '🟠', description: 'Urgent Comfort', urgent: true };
      case 'symptom-care':
        return { emoji: '🟡', description: 'Symptom Care', urgent: false };
      case 'psychosocial':
        return { emoji: '🟢', description: 'Psychosocial', urgent: false };
      case 'family-support':
        return { emoji: '🔵', description: 'Family Support', urgent: false };
      case 'bereavement':
        return { emoji: '🟣', description: 'Bereavement', urgent: false };
      case 'routine':
        return { emoji: '⚪', description: 'Routine', urgent: false };
      default:
        return { emoji: '⚪', description: 'Routine', urgent: false };
    }
  };

  const statusInfo = getStatusInfo(visit.status);
  const priorityInfo = getPriorityInfo(visit.priority);
  const visitTypeIcon = getVisitTypeIcon(visit.visitType);

  // Check if AI Scribe should be available for this visit
  const canUseAIScribe = showAIScribe && 
    (visit.status === 'in-progress' || visit.status === 'scheduled');

  const handleAIScribePress = () => {
    if (!visit.patient) {
      Alert.alert('Error', 'Patient information is required for AI Scribe functionality');
      return;
    }
    setIsAIScribeVisible(true);
  };

  const handleNotesSaved = (note: ClinicalNote, transcription: string) => {
    console.log('📝 Clinical notes saved for visit:', visit.id);
    onNotesSaved?.(visit, note, transcription);
    
    Alert.alert(
      'Notes Saved',
      'Clinical notes have been saved to the patient record.',
      [{ text: 'OK' }]
    );
  };

  // Show nursing indicators if assessment data exists
  const hasVitalSigns = visit.vitalSigns && Object.keys(visit.vitalSigns).length > 0;
  const hasPainAssessment = visit.painAssessment && visit.painAssessment.currentPainLevel !== undefined;
  const hasESAS = visit.esasAssessment && visit.esasAssessment.totalScore !== undefined;
  const hasMedications = visit.medicationsAdministered && visit.medicationsAdministered.length > 0;
  const hasInterventions = visit.comfortInterventions && visit.comfortInterventions.length > 0;

  return (
    <>
      <Card
        priority={visit.priority}
        status={visit.status}
        usePalliativePriority={true}
        onPress={onPress}
        {...props}
      >
        {/* Visit Header */}
        <View style={{ marginBottom: Spacing.sm }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: Spacing.xs 
          }}>
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
                <Ionicons 
                  name={visitTypeIcon} 
                  size={16} 
                  color={onSurfaceColor} 
                  style={{ marginRight: Spacing.xs }} 
                />
                <ThemedText variant="titleMedium" style={{ flex: 1 }}>
                  {visit.title}
                </ThemedText>
              </View>
              
              <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.xs }}>
                {visit.description}
              </ThemedText>
              
              {/* Patient Info */}
              {visit.patient && (
                <ThemedText variant="bodySmall" style={{ color: primaryColor, marginBottom: Spacing.xs }}>
                  👤 {visit.patient.name}
                </ThemedText>
              )}
              
              {/* Priority Badge */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
                <ThemedText 
                  variant="bodySmall" 
                  style={{ 
                    fontWeight: '600',
                    color: priorityInfo.urgent ? errorColor : onSurfaceColor
                  }}
                >
                  {priorityInfo.emoji} {priorityInfo.description}
                </ThemedText>
              </View>
            </View>
            
            {/* Status Badge */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: Spacing.sm,
              paddingVertical: Spacing.xs,
              borderRadius: Spacing.borderRadius.sm,
              backgroundColor: 'rgba(0,0,0,0.1)'
            }}>
              <Ionicons 
                name={statusInfo.icon} 
                size={14} 
                color={statusInfo.color} 
                style={{ marginRight: Spacing.xs }} 
              />
              <ThemedText 
                variant="labelSmall" 
                style={{ 
                  color: statusInfo.color,
                  fontWeight: '600' 
                }}
              >
                {statusInfo.label}
              </ThemedText>
            </View>
          </View>

          {/* Schedule Info */}
          {visit.scheduledTime && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
              <Ionicons 
                name="time-outline" 
                size={14} 
                color={onSurfaceColor} 
                style={{ marginRight: Spacing.xs }} 
              />
              <ThemedText variant="bodySmall">
                {formatDate(visit.scheduledTime)} at {formatTime(visit.scheduledTime)}
              </ThemedText>
            </View>
          )}

          {/* Assessment Indicators */}
          {(hasVitalSigns || hasPainAssessment || hasESAS || hasMedications || hasInterventions) && (
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              marginTop: Spacing.xs,
              gap: Spacing.xs 
            }}>
              {hasVitalSigns && (
                <View style={{
                  backgroundColor: '#e8f5e8',
                  paddingHorizontal: Spacing.xs,
                  paddingVertical: 2,
                  borderRadius: Spacing.borderRadius.xs
                }}>
                  <ThemedText variant="labelSmall" style={{ color: '#2e7d32' }}>
                    📊 Vitals
                  </ThemedText>
                </View>
              )}
              
              {hasPainAssessment && (
                <View style={{
                  backgroundColor: '#fff3e0',
                  paddingHorizontal: Spacing.xs,
                  paddingVertical: 2,
                  borderRadius: Spacing.borderRadius.xs
                }}>
                  <ThemedText variant="labelSmall" style={{ color: '#f57c00' }}>
                    😣 Pain: {visit.painAssessment.currentPainLevel}/10
                  </ThemedText>
                </View>
              )}
              
              {hasESAS && (
                <View style={{
                  backgroundColor: '#f3e5f5',
                  paddingHorizontal: Spacing.xs,
                  paddingVertical: 2,
                  borderRadius: Spacing.borderRadius.xs
                }}>
                  <ThemedText variant="labelSmall" style={{ color: '#7b1fa2' }}>
                    📋 ESAS: {visit.esasAssessment.totalScore}
                  </ThemedText>
                </View>
              )}
              
              {hasMedications && (
                <View style={{
                  backgroundColor: '#e1f5fe',
                  paddingHorizontal: Spacing.xs,
                  paddingVertical: 2,
                  borderRadius: Spacing.borderRadius.xs
                }}>
                  <ThemedText variant="labelSmall" style={{ color: '#0277bd' }}>
                    💊 Meds: {visit.medicationsAdministered.length}
                  </ThemedText>
                </View>
              )}
              
              {hasInterventions && (
                <View style={{
                  backgroundColor: '#e8f5e8',
                  paddingHorizontal: Spacing.xs,
                  paddingVertical: 2,
                  borderRadius: Spacing.borderRadius.xs
                }}>
                  <ThemedText variant="labelSmall" style={{ color: '#388e3c' }}>
                    🤲 Comfort: {visit.comfortInterventions.length}
                  </ThemedText>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {canUseAIScribe && (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: Spacing.sm,
            paddingTop: Spacing.sm,
            borderTopWidth: 1,
            borderTopColor: 'rgba(0,0,0,0.1)'
          }}>
            <Pressable
              onPress={handleAIScribePress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#007bff',
                paddingHorizontal: Spacing.sm,
                paddingVertical: Spacing.xs,
                borderRadius: Spacing.borderRadius.sm
              }}
            >
              <Ionicons name="mic" size={16} color="white" style={{ marginRight: Spacing.xs }} />
              <ThemedText variant="labelMedium" style={{ color: 'white', fontWeight: '600' }}>
                AI Scribe
              </ThemedText>
            </Pressable>
          </View>
        )}

        {children}
      </Card>

      {/* AI Scribe Modal */}
      {isAIScribeVisible && (
        <AIScribeInterface
          isVisible={isAIScribeVisible}
          onClose={() => setIsAIScribeVisible(false)}
          onNoteSaved={handleNotesSaved}
          patientContext={visit.patient}
          visitId={visit.id}
        />
      )}
    </>
  );
}

export default EnhancedVisitCard; 