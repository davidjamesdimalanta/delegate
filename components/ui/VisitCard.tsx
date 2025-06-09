import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Spacing } from '../../constants/Spacing';
import { ThemedText } from '../ThemedText';
import { Card } from './Card';

// ===================================================================
// VISIT CARD TYPES AND INTERFACES
// ===================================================================

/**
 * Visit status options for tracking visit progress
 */
export type VisitStatus = 
  | 'scheduled' 
  | 'in-progress' 
  | 'completed' 
  | 'cancelled' 
  | 'missed' 
  | 'rescheduled';

/**
 * Visit type categories for palliative care
 */
export type VisitType = 
  | 'routine' 
  | 'admission' 
  | 'discharge' 
  | 'emergency' 
  | 'medication' 
  | 'symptom-management' 
  | 'comfort-care' 
  | 'family-support' 
  | 'assessment';

/**
 * Priority levels for palliative care visits
 */
export type VisitPriority = 
  | 'imminent' 
  | 'urgent-comfort' 
  | 'symptom-care' 
  | 'psychosocial' 
  | 'family-support' 
  | 'bereavement' 
  | 'routine';

/**
 * Vital signs data structure
 */
interface VitalSigns {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  weight?: number;
  [key: string]: any;
}

/**
 * Pain assessment data
 */
interface PainAssessment {
  currentPainLevel: number; // 0-10 scale
  painLocation?: string;
  painQuality?: string;
  painFrequency?: string;
  reliefMeasures?: string[];
  [key: string]: any;
}

/**
 * ESAS (Edmonton Symptom Assessment Scale) data
 */
interface ESASAssessment {
  totalScore: number; // 0-90 scale
  painScore?: number;
  tirednessScore?: number;
  nauseaScore?: number;
  depressionScore?: number;
  anxietyScore?: number;
  drowsinessScore?: number;
  appetiteScore?: number;
  wellbeingScore?: number;
  shortnessOfBreathScore?: number;
  [key: string]: any;
}

/**
 * Medication administration record
 */
interface MedicationRecord {
  medicationName: string;
  dosage: string;
  administeredAt: string;
  administeredBy: string;
  route?: string;
  effectiveness?: string;
  sideEffects?: string[];
  [key: string]: any;
}

/**
 * Comfort care intervention
 */
interface ComfortIntervention {
  interventionType: string;
  description: string;
  performedAt: string;
  performedBy: string;
  patientResponse?: string;
  effectiveness?: string;
  [key: string]: any;
}

/**
 * Core visit data structure
 */
export interface Visit {
  id: string;
  title: string;
  description: string;
  patientId?: string;
  patientName?: string;
  visitType: VisitType;
  priority: VisitPriority;
  status: VisitStatus;
  
  // Scheduling information
  scheduledTime: string;
  estimatedDurationMinutes?: number;
  actualStartTime?: string;
  actualEndTime?: string;
  actualDurationMinutes?: number;
  
  // Assessment data
  vitalSigns?: VitalSigns;
  painAssessment?: PainAssessment;
  esasAssessment?: ESASAssessment;
  medicationsAdministered?: MedicationRecord[];
  comfortInterventions?: ComfortIntervention[];
  
  // Documentation
  visitNotes?: string;
  documentationComplete?: boolean;
  supervisorReviewRequired?: boolean;
  supervisorReviewedAt?: string;
  
  // Additional metadata
  assignedNurse?: string;
  location?: string;
  [key: string]: any;
}

/**
 * Props for VisitCard component
 */
interface VisitCardProps {
  visit: Visit;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

/**
 * Props for CompactVisitCard component
 */
interface CompactVisitCardProps extends VisitCardProps {
  showPatient?: boolean;
}

/**
 * Status information for UI display
 */
interface StatusInfo {
  icon: string;
  color: string;
  label: string;
}

/**
 * Priority information for UI display
 */
interface PriorityInfo {
  emoji: string;
  description: string;
  urgent: boolean;
}

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

/**
 * Get status icon and color information
 */
function getStatusInfo(status: VisitStatus): StatusInfo {
  const statusMap: Record<VisitStatus, StatusInfo> = {
    scheduled: { icon: 'time-outline', color: '#6B7280', label: 'Scheduled' },
    'in-progress': { icon: 'play-circle', color: '#F59E0B', label: 'In Progress' },
    completed: { icon: 'checkmark-circle', color: '#10B981', label: 'Completed' },
    cancelled: { icon: 'close-circle', color: '#EF4444', label: 'Cancelled' },
    missed: { icon: 'warning', color: '#EF4444', label: 'Missed' },
    rescheduled: { icon: 'refresh-circle', color: '#F59E0B', label: 'Rescheduled' }
  };

  return statusMap[status] || { icon: 'help-circle', color: '#6B7280', label: 'Unknown' };
}

/**
 * Get priority information with emoji and urgency
 */
function getPriorityInfo(priority: VisitPriority): PriorityInfo {
  const priorityMap: Record<VisitPriority, PriorityInfo> = {
    imminent: { emoji: '🔴', description: 'Imminent', urgent: true },
    'urgent-comfort': { emoji: '🟠', description: 'Urgent Comfort', urgent: true },
    'symptom-care': { emoji: '🟡', description: 'Symptom Care', urgent: false },
    psychosocial: { emoji: '🟢', description: 'Psychosocial', urgent: false },
    'family-support': { emoji: '🔵', description: 'Family Support', urgent: false },
    bereavement: { emoji: '🟣', description: 'Bereavement', urgent: false },
    routine: { emoji: '⚪', description: 'Routine', urgent: false }
  };

  return priorityMap[priority] || { emoji: '⚪', description: 'Routine', urgent: false };
}

/**
 * Get visit type icon
 */
function getVisitTypeIcon(visitType: VisitType): string {
  const iconMap: Record<VisitType, string> = {
    routine: 'calendar-outline',
    admission: 'log-in-outline',
    discharge: 'log-out-outline',
    emergency: 'alert-circle-outline',
    medication: 'medical-outline',
    'symptom-management': 'pulse-outline',
    'comfort-care': 'heart-outline',
    'family-support': 'people-outline',
    assessment: 'clipboard-outline'
  };

  return iconMap[visitType] || 'document-outline';
}

// ===================================================================
// VISIT CARD COMPONENT
// ===================================================================

/**
 * VisitCard Component
 * 
 * Enhanced card component for displaying nursing visit information with comprehensive
 * assessment data, documentation status, and palliative care priorities.
 * 
 * @param props - VisitCardProps containing visit data and event handlers
 * @returns Themed VisitCard component with medical assessment indicators
 */
export function VisitCard({
  visit,
  onPress,
  children,
  style,
  testID,
  accessibilityLabel,
  ...props
}: VisitCardProps): React.JSX.Element | null {
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');

  // Ensure colors are strings
  const resolvedOnSurfaceColor = typeof onSurfaceColor === 'string' ? onSurfaceColor : '#000000';
  const resolvedSuccessColor = typeof successColor === 'string' ? successColor : '#10B981';
  const resolvedWarningColor = typeof warningColor === 'string' ? warningColor : '#F59E0B';
  const resolvedErrorColor = typeof errorColor === 'string' ? errorColor : '#EF4444';

  if (!visit) {
    return null;
  }

  // Format scheduled time
  const formatTime = (timestamp: string): string => {
    if (!timestamp) return 'Not scheduled';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date
  const formatDate = (timestamp: string): string => {
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
      style={style}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      {...props}
    >
      {/* Visit Header */}
      <View style={{ marginBottom: (Spacing as any)?.sm || 8 }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: (Spacing as any)?.xs || 4
        }}>
          <View style={{ flex: 1, marginRight: (Spacing as any)?.sm || 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: (Spacing as any)?.xs || 4 }}>
              <Ionicons 
                name={visitTypeIcon as any} 
                size={16} 
                color={resolvedOnSurfaceColor} 
                style={{ marginRight: (Spacing as any)?.xs || 4 }} 
              />
              <ThemedText variant="titleMedium" style={{ flex: 1 }}>
                {visit.title}
              </ThemedText>
            </View>
            
            <ThemedText variant="bodyMedium" style={{ marginBottom: (Spacing as any)?.xs || 4 }}>
              {visit.description}
            </ThemedText>
            
            {/* Priority Badge */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: (Spacing as any)?.xs || 4 }}>
              <ThemedText 
                variant="bodySmall" 
                style={{ 
                  fontWeight: '600',
                  color: priorityInfo.urgent ? resolvedErrorColor : resolvedOnSurfaceColor
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
            paddingHorizontal: (Spacing as any)?.sm || 8,
            paddingVertical: (Spacing as any)?.xs || 4,
            borderRadius: (Spacing.borderRadius as any)?.sm || 8,
            backgroundColor: 'rgba(0,0,0,0.1)'
          }}>
            <Ionicons 
              name={statusInfo.icon as any} 
              size={14} 
              color={statusInfo.color} 
              style={{ marginRight: (Spacing as any)?.xs || 4 }} 
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
              color={resolvedOnSurfaceColor} 
              style={{ marginRight: (Spacing as any)?.xs || 4 }} 
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
          <View style={{ marginTop: (Spacing as any)?.xs || 4 }}>
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
          marginTop: (Spacing as any)?.sm || 8,
          paddingTop: (Spacing as any)?.sm || 8,
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.1)'
        }}>
          <ThemedText variant="labelSmall" style={{ 
            marginBottom: (Spacing as any)?.xs || 4, 
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
                marginRight: (Spacing as any)?.md || 12, 
                marginBottom: (Spacing as any)?.xs || 4
              }}>
                <Ionicons name="pulse" size={12} color={resolvedSuccessColor} />
                <ThemedText variant="labelSmall" style={{ marginLeft: (Spacing as any)?.xs || 4, fontSize: 11 }}>
                  Vitals
                </ThemedText>
              </View>
            )}
            
            {hasPainAssessment && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginRight: (Spacing as any)?.md || 12, 
                marginBottom: (Spacing as any)?.xs || 4
              }}>
                <Ionicons name="medical" size={12} color={resolvedWarningColor} />
                <ThemedText variant="labelSmall" style={{ marginLeft: (Spacing as any)?.xs || 4, fontSize: 11 }}>
                  Pain: {visit.painAssessment!.currentPainLevel}/10
                </ThemedText>
              </View>
            )}
            
            {hasESAS && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginRight: (Spacing as any)?.md || 12, 
                marginBottom: (Spacing as any)?.xs || 4
              }}>
                <Ionicons name="analytics" size={12} color={resolvedSuccessColor} />
                <ThemedText variant="labelSmall" style={{ marginLeft: (Spacing as any)?.xs || 4, fontSize: 11 }}>
                  ESAS: {visit.esasAssessment!.totalScore}/90
                </ThemedText>
              </View>
            )}
            
            {hasMedications && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginRight: (Spacing as any)?.md || 12, 
                marginBottom: (Spacing as any)?.xs || 4
              }}>
                <Ionicons name="medical-outline" size={12} color={resolvedSuccessColor} />
                <ThemedText variant="labelSmall" style={{ marginLeft: (Spacing as any)?.xs || 4, fontSize: 11 }}>
                  Meds ({visit.medicationsAdministered!.length})
                </ThemedText>
              </View>
            )}
            
            {hasInterventions && (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginRight: (Spacing as any)?.md || 12, 
                marginBottom: (Spacing as any)?.xs || 4
              }}>
                <Ionicons name="heart" size={12} color={resolvedSuccessColor} />
                <ThemedText variant="labelSmall" style={{ marginLeft: (Spacing as any)?.xs || 4, fontSize: 11 }}>
                  Comfort ({visit.comfortInterventions!.length})
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Documentation Status */}
      {visit.status === 'completed' && (
        <View style={{ 
          marginTop: (Spacing as any)?.sm || 8,
          paddingTop: (Spacing as any)?.sm || 8,
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.1)'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons 
                name={visit.documentationComplete ? 'checkmark-circle' : 'document-text-outline'} 
                size={14} 
                color={visit.documentationComplete ? resolvedSuccessColor : resolvedWarningColor} 
                style={{ marginRight: (Spacing as any)?.xs || 4 }}
              />
              <ThemedText variant="labelSmall" style={{ fontSize: 11 }}>
                {visit.documentationComplete ? 'Documentation Complete' : 'Documentation Pending'}
              </ThemedText>
            </View>
            
            {visit.supervisorReviewRequired && !visit.supervisorReviewedAt && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="eye-outline" size={14} color={resolvedWarningColor} style={{ marginRight: (Spacing as any)?.xs || 4 }} />
                <ThemedText variant="labelSmall" style={{ fontSize: 11, color: resolvedWarningColor }}>
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
          marginTop: (Spacing as any)?.sm || 8,
          paddingTop: (Spacing as any)?.sm || 8,
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

// ===================================================================
// COMPACT VISIT CARD COMPONENT
// ===================================================================

/**
 * CompactVisitCard Component
 * 
 * Condensed version of VisitCard for use in lists and summaries.
 * 
 * @param props - CompactVisitCardProps containing visit data and display options
 * @returns Compact VisitCard component for list views
 */
export function CompactVisitCard({
  visit,
  onPress,
  showPatient = false,
  style,
  testID,
  accessibilityLabel,
  ...props
}: CompactVisitCardProps): React.JSX.Element | null {
  if (!visit) return null;

  const statusInfo = getStatusInfo(visit.status);
  const priorityInfo = getPriorityInfo(visit.priority);

  const formatTime = (timestamp: string): string => {
    if (!timestamp) return 'TBD';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Combine styles safely
  const combinedStyle: ViewStyle = {
    marginBottom: (Spacing as any)?.sm || 8,
    ...(style as ViewStyle || {})
  };

  return (
    <Card
      variant="outlined"
      priority={visit.priority}
      usePalliativePriority={true}
      onPress={onPress}
      style={combinedStyle}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      {...props}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <ThemedText variant="bodyMedium" style={{ fontWeight: '600', marginBottom: (Spacing as any)?.xs || 4 }}>
            {visit.title}
          </ThemedText>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedText variant="bodySmall" style={{ marginRight: (Spacing as any)?.sm || 8 }}>
              {formatTime(visit.scheduledTime)}
            </ThemedText>
            <ThemedText variant="labelSmall" style={{ 
              backgroundColor: 'rgba(0,0,0,0.1)',
              paddingHorizontal: (Spacing as any)?.xs || 4,
              paddingVertical: 2,
              borderRadius: 4,
              fontSize: 10
            }}>
              {priorityInfo.emoji} {visit.visitType}
            </ThemedText>
          </View>
          
          {showPatient && visit.patientName && (
            <ThemedText variant="bodySmall" style={{ 
              marginTop: (Spacing as any)?.xs || 4,
              opacity: 0.7 
            }}>
              Patient: {visit.patientName}
            </ThemedText>
          )}
        </View>
        
        <Ionicons 
          name={statusInfo.icon as any} 
          size={20} 
          color={statusInfo.color} 
        />
      </View>
    </Card>
  );
} 