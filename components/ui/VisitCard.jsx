import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { Spacing } from '../../constants/Spacing';
import { ThemedText } from '../ThemedText';
import { Card } from './Card';

// Visit Card Component - Enhanced version of TaskCard for nursing workflow
export function VisitCard({
  visit,
  onPress,
  children,
  ...props
}) {
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');

  if (!visit) {
    return null;
  }

  // Format scheduled time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Not scheduled';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date
  const formatDate = (timestamp) => {
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
  const getStatusInfo = (status) => {
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
  const getVisitTypeIcon = (visitType) => {
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
  const getPriorityInfo = (priority) => {
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

  // Show nursing indicators if assessment data exists
  const hasVitalSigns = visit.vitalSigns && Object.keys(visit.vitalSigns).length > 0;
  const hasPainAssessment = visit.painAssessment && visit.painAssessment.currentPainLevel !== undefined;
  const hasESAS = visit.esasAssessment && visit.esasAssessment.totalScore !== undefined;
  const hasMedications = visit.medicationsAdministered && visit.medicationsAdministered.length > 0;
  const hasInterventions = visit.comfortInterventions && visit.comfortInterventions.length > 0;

  return (
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
                textTransform: 'uppercase',
                fontWeight: '600'
              }}
            >
              {statusInfo.label}
            </ThemedText>
          </View>
        </View>
        
        {/* Visit Time Information */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          alignItems: 'center' 
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons 
              name="time-outline" 
              size={16} 
              color={onSurfaceColor} 
              style={{ marginRight: Spacing.xs }} 
            />
            <ThemedText variant="bodySmall" style={{ fontWeight: '600' }}>
              {formatDate(visit.scheduledTime)} at {formatTime(visit.scheduledTime)}
            </ThemedText>
          </View>
          
          {visit.estimatedDurationMinutes && (
            <ThemedText variant="bodySmall" style={{ opacity: 0.7 }}>
              ~{visit.estimatedDurationMinutes}min
            </ThemedText>
          )}
        </View>

        {/* Actual visit time for in-progress/completed visits */}
        {(visit.actualStartTime || visit.actualEndTime) && (
          <View style={{ marginTop: Spacing.xs }}>
            {visit.actualStartTime && (
              <ThemedText variant="bodySmall" style={{ opacity: 0.7 }}>
                Started: {formatTime(visit.actualStartTime)}
              </ThemedText>
            )}
            {visit.actualEndTime && (
              <ThemedText variant="bodySmall" style={{ opacity: 0.7 }}>
                Completed: {formatTime(visit.actualEndTime)}
              </ThemedText>
            )}
            {visit.actualDurationMinutes && (
              <ThemedText variant="bodySmall" style={{ opacity: 0.7 }}>
                Duration: {visit.actualDurationMinutes} minutes
              </ThemedText>
            )}
          </View>
        )}
      </View>

      {/* Nursing Assessment Indicators */}
      {(hasVitalSigns || hasPainAssessment || hasESAS || hasMedications || hasInterventions) && (
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap',
          marginTop: Spacing.sm,
          paddingTop: Spacing.sm,
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.1)'
        }}>
          <ThemedText variant="labelSmall" style={{ 
            marginBottom: Spacing.xs, 
            width: '100%',
            fontWeight: '600',
            opacity: 0.8
          }}>
            Assessment Data:
          </ThemedText>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {hasVitalSigns && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginRight: Spacing.md, 
                marginBottom: Spacing.xs 
              }}>
                <Ionicons name="pulse" size={12} color={successColor} />
                <ThemedText variant="labelSmall" style={{ marginLeft: Spacing.xs, fontSize: 11 }}>
                  Vitals
                </ThemedText>
              </View>
            )}
            
            {hasPainAssessment && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginRight: Spacing.md, 
                marginBottom: Spacing.xs 
              }}>
                <Ionicons name="medical" size={12} color={warningColor} />
                <ThemedText variant="labelSmall" style={{ marginLeft: Spacing.xs, fontSize: 11 }}>
                  Pain: {visit.painAssessment.currentPainLevel}/10
                </ThemedText>
              </View>
            )}
            
            {hasESAS && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginRight: Spacing.md, 
                marginBottom: Spacing.xs 
              }}>
                <Ionicons name="analytics" size={12} color={successColor} />
                <ThemedText variant="labelSmall" style={{ marginLeft: Spacing.xs, fontSize: 11 }}>
                  ESAS: {visit.esasAssessment.totalScore}/90
                </ThemedText>
              </View>
            )}
            
            {hasMedications && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginRight: Spacing.md, 
                marginBottom: Spacing.xs 
              }}>
                <Ionicons name="medical-outline" size={12} color={successColor} />
                <ThemedText variant="labelSmall" style={{ marginLeft: Spacing.xs, fontSize: 11 }}>
                  Meds ({visit.medicationsAdministered.length})
                </ThemedText>
              </View>
            )}
            
            {hasInterventions && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginRight: Spacing.md, 
                marginBottom: Spacing.xs 
              }}>
                <Ionicons name="heart" size={12} color={successColor} />
                <ThemedText variant="labelSmall" style={{ marginLeft: Spacing.xs, fontSize: 11 }}>
                  Comfort ({visit.comfortInterventions.length})
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Documentation Status */}
      {visit.status === 'completed' && (
        <View style={{ 
          marginTop: Spacing.sm,
          paddingTop: Spacing.sm,
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.1)'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons 
                name={visit.documentationComplete ? 'checkmark-circle' : 'document-text-outline'} 
                size={14} 
                color={visit.documentationComplete ? successColor : warningColor} 
                style={{ marginRight: Spacing.xs }}
              />
              <ThemedText variant="labelSmall" style={{ fontSize: 11 }}>
                {visit.documentationComplete ? 'Documentation Complete' : 'Documentation Pending'}
              </ThemedText>
            </View>
            
            {visit.supervisorReviewRequired && !visit.supervisorReviewedAt && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="eye-outline" size={14} color={warningColor} style={{ marginRight: Spacing.xs }} />
                <ThemedText variant="labelSmall" style={{ fontSize: 11, color: warningColor }}>
                  Review Required
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Visit Notes Preview */}
      {visit.visitNotes && visit.visitNotes.trim() && (
        <View style={{ 
          marginTop: Spacing.sm,
          paddingTop: Spacing.sm,
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.1)'
        }}>
          <ThemedText variant="bodySmall" style={{ 
            fontStyle: 'italic',
            opacity: 0.8,
            lineHeight: 16
          }}>
            &ldquo;{visit.visitNotes.substring(0, 80)}{visit.visitNotes.length > 80 ? '...' : ''}&rdquo;
          </ThemedText>
        </View>
      )}
      
      {children}
    </Card>
  );
}

// Compact Visit Card for lists and summaries
export function CompactVisitCard({
  visit,
  onPress,
  showPatient = false,
  ...props
}) {
  if (!visit) return null;

  const statusInfo = getStatusInfo(visit.status);
  const priorityInfo = getPriorityInfo(visit.priority);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'TBD';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card
      variant="outlined"
      priority={visit.priority}
      usePalliativePriority={true}
      onPress={onPress}
      style={{ marginBottom: Spacing.sm }}
      {...props}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <ThemedText variant="bodyMedium" style={{ fontWeight: '600', marginBottom: Spacing.xs }}>
            {visit.title}
          </ThemedText>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedText variant="bodySmall" style={{ marginRight: Spacing.sm }}>
              {formatTime(visit.scheduledTime)}
            </ThemedText>
            <ThemedText variant="labelSmall" style={{ 
              backgroundColor: 'rgba(0,0,0,0.1)',
              paddingHorizontal: Spacing.xs,
              paddingVertical: 2,
              borderRadius: 4,
              fontSize: 10
            }}>
              {priorityInfo.emoji} {visit.visitType}
            </ThemedText>
          </View>
        </View>
        
        <Ionicons 
          name={statusInfo.icon} 
          size={20} 
          color={statusInfo.color} 
        />
      </View>
    </Card>
  );
}

// Helper functions (move these outside if used elsewhere)
function getStatusInfo(status) {
  const colors = {
    scheduled: '#6B7280',
    'in-progress': '#F59E0B',
    completed: '#10B981',
    cancelled: '#EF4444',
    missed: '#EF4444',
    rescheduled: '#F59E0B'
  };

  const icons = {
    scheduled: 'time-outline',
    'in-progress': 'play-circle',
    completed: 'checkmark-circle',
    cancelled: 'close-circle',
    missed: 'warning',
    rescheduled: 'refresh-circle'
  };

  return {
    icon: icons[status] || 'help-circle',
    color: colors[status] || '#6B7280',
    label: status ? status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ') : 'Unknown'
  };
}

function getPriorityInfo(priority) {
  const priorities = {
    imminent: { emoji: '🔴', description: 'Imminent', urgent: true },
    'urgent-comfort': { emoji: '🟠', description: 'Urgent Comfort', urgent: true },
    'symptom-care': { emoji: '🟡', description: 'Symptom Care', urgent: false },
    psychosocial: { emoji: '🟢', description: 'Psychosocial', urgent: false },
    'family-support': { emoji: '🔵', description: 'Family Support', urgent: false },
    bereavement: { emoji: '🟣', description: 'Bereavement', urgent: false },
    routine: { emoji: '⚪', description: 'Routine', urgent: false }
  };

  return priorities[priority] || { emoji: '⚪', description: 'Routine', urgent: false };
} 