import { useEnhancedColorScheme } from '@/components/ui/ThemeProvider';
import { MedicalPriority, PalliativePriority, TaskStatus } from '@/constants/Colors';
import { Shadows, Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CardVariant } from '@/lib/types/component-props';
import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import { MapPreview } from './MapPreview';

// ===================================================================
// CARD COMPONENT INTERFACES
// ===================================================================

interface BaseCardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  variant?: CardVariant | 'elevated' | 'filled' | 'outlined';
  priority?: string;
  status?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  usePalliativePriority?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

interface LocationInfo {
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface PalliativePatientCardProps extends Omit<BaseCardProps, 'title' | 'subtitle'> {
  patientName: string;
  patientId: string;
  location?: LocationInfo;
  priority: string;
  prognosis?: string;
  goalsOfCare?: string;
  painLevel?: number;
  primaryCaregiver?: string;
}

interface PatientCardProps extends Omit<BaseCardProps, 'title' | 'subtitle'> {
  patientName: string;
  patientId: string;
  location?: LocationInfo;
  priority?: string;
}

interface TaskCardProps extends Omit<BaseCardProps, 'title' | 'subtitle'> {
  taskTitle: string;
  taskDescription?: string;
  dueTime: string;
  status?: string;
  priority?: string;
  usePalliativePriority?: boolean;
}

interface VariantStyles {
  backgroundColor: string;
  borderWidth: number;
  borderColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}

// ===================================================================
// BASE CARD COMPONENT
// ===================================================================

/**
 * Card Component
 * 
 * A versatile card component with multiple variants and medical priority support.
 * Supports elevated, filled, and outlined variants with priority and status indicators.
 * 
 * @param props - BaseCardProps including variant, priority, status, and styling options
 * @returns Themed Card component with interactive states
 */
export function Card({
  children,
  title,
  subtitle,
  onPress,
  variant = 'elevated',
  priority,
  status,
  style,
  contentStyle,
  headerStyle,
  usePalliativePriority = true,
  accessibilityLabel,
  testID,
}: BaseCardProps): React.JSX.Element {
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';

  // Get theme colors
  const surfaceColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const outlineColor = useThemeColor({}, 'outline');
  const surfaceVariantColor = useThemeColor({}, 'surfaceVariant');

  // Ensure colors are strings
  const resolvedSurfaceColor = typeof surfaceColor === 'string' ? surfaceColor : '#FFFFFF';
  const resolvedOnSurfaceColor = typeof onSurfaceColor === 'string' ? onSurfaceColor : '#000000';
  const resolvedOutlineColor = typeof outlineColor === 'string' ? outlineColor : '#E0E0E0';
  const resolvedSurfaceVariantColor = typeof surfaceVariantColor === 'string' ? surfaceVariantColor : '#F5F5F5';

  // Get status colors if specified
  const getStatusColor = (): string | null => {
    if (!status) return null;
    
    try {
      const statusColors = (TaskStatus as any)?.[status];
      if (!statusColors) {
        console.warn(`Unknown task status: ${status}`);
        return null;
      }
      return isDark ? statusColors.dark : statusColors.light;
    } catch (error) {
      console.warn(`Error getting status color for: ${status}`, error);
      return null;
    }
  };

  // Get priority colors if specified - supports both systems
  const getPriorityColor = (): string | null => {
    if (!priority) return null;
    
    try {
      // Use palliative priority system by default, fall back to medical priority
      const prioritySystem = usePalliativePriority ? PalliativePriority : MedicalPriority;
      const priorityColors = (prioritySystem as any)?.[priority];
      
      if (!priorityColors) {
        // Try the other system if priority not found
        const fallbackSystem = usePalliativePriority ? MedicalPriority : PalliativePriority;
        const fallbackColors = (fallbackSystem as any)?.[priority];
        
        if (!fallbackColors) {
          console.warn(`Unknown priority: ${priority}`);
          return null;
        }
        return isDark ? fallbackColors.dark : fallbackColors.light;
      }
      
      return isDark ? priorityColors.dark : priorityColors.light;
    } catch (error) {
      console.warn(`Error getting priority color for: ${priority}`, error);
      return null;
    }
  };

  // Get priority background color for enhanced visual indication
  const getPriorityBackground = (): string | null => {
    if (!priority || !usePalliativePriority) return null;
    
    try {
      const priorityColors = (PalliativePriority as any)?.[priority];
      if (!priorityColors?.background) return null;
      
      return isDark ? priorityColors.background.dark : priorityColors.background.light;
    } catch (error) {
      console.warn(`Error getting priority background for: ${priority}`, error);
      return null;
    }
  };

  // Variant styles
  const getVariantStyles = (): VariantStyles => {
    const priorityBg = getPriorityBackground();
    
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: priorityBg || resolvedSurfaceColor,
          ...(Shadows.medium || {}),
          borderWidth: 0,
        };
      
      case 'filled':
        return {
          backgroundColor: priorityBg || resolvedSurfaceVariantColor,
          ...(Shadows.none || {}),
          borderWidth: 0,
        };
      
      case 'outlined':
        return {
          backgroundColor: priorityBg || resolvedSurfaceColor,
          ...(Shadows.none || {}),
          borderWidth: 1,
          borderColor: resolvedOutlineColor,
        };
      
      default:
        // Fallback to elevated
        return {
          backgroundColor: priorityBg || resolvedSurfaceColor,
          ...(Shadows.medium || {}),
          borderWidth: 0,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const statusColor = getStatusColor();
  const priorityColor = getPriorityColor();

  const cardStyles: ViewStyle[] = [
    {
      borderRadius: (Spacing.borderRadius as any)?.lg || 16,
      padding: (Spacing.component as any)?.cardPadding || 16,
      margin: (Spacing.component as any)?.cardMargin || 8,
      backgroundColor: variantStyles.backgroundColor,
      borderWidth: variantStyles.borderWidth,
      borderColor: variantStyles.borderColor,
    },
    variantStyles.shadowOffset && {
      shadowOffset: variantStyles.shadowOffset,
      shadowOpacity: variantStyles.shadowOpacity,
      shadowRadius: variantStyles.shadowRadius,
      elevation: variantStyles.elevation,
    },
    // Add status or priority indicator
    (statusColor || priorityColor) && {
      borderLeftWidth: 4,
      borderLeftColor: statusColor || priorityColor,
    },
    style,
  ].filter(Boolean) as ViewStyle[];

  const headerStyles: ViewStyle[] = [
    {
      marginBottom: (title || subtitle) ? ((Spacing as any)?.sm || 8) : 0,
    },
    headerStyle,
  ].filter(Boolean) as ViewStyle[];

  const contentStyles: ViewStyle[] = [
    contentStyle,
  ].filter(Boolean) as ViewStyle[];

  const CardContent = (): React.JSX.Element => (
    <View style={cardStyles}>
      {(title || subtitle) && (
        <View style={headerStyles}>
          {title && (
            <ThemedText 
              variant="titleMedium"
              style={{ 
                color: resolvedOnSurfaceColor,
                marginBottom: subtitle ? ((Spacing as any)?.xs || 4) : 0 
              }}
            >
              {title}
            </ThemedText>
          )}
          {subtitle && (
            <ThemedText 
              variant="bodyMedium"
              style={{ 
                color: resolvedOnSurfaceColor,
                opacity: 0.7 
              }}
            >
              {subtitle}
            </ThemedText>
          )}
        </View>
      )}
      <View style={contentStyles}>
        {children}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        testID={testID}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
}

// ===================================================================
// SPECIALIZED CARD COMPONENTS
// ===================================================================

/**
 * Enhanced Palliative Patient Card with comprehensive medical information
 */
export function PalliativePatientCard({
  patientName,
  patientId,
  location,
  priority,
  prognosis,
  goalsOfCare,
  painLevel,
  primaryCaregiver,
  onPress,
  children,
  ...props
}: PalliativePatientCardProps): React.JSX.Element {
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Get priority info for display
  const priorityInfo = (PalliativePriority as any)?.[priority];
  
  return (
    <Card
      priority={priority}
      usePalliativePriority={true}
      onPress={onPress}
      {...props}
    >
      <View style={{ marginBottom: (Spacing as any)?.sm || 8 }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: (Spacing as any)?.xs || 4
        }}>
          <View style={{ flex: 1, marginRight: (Spacing as any)?.sm || 8 }}>
            <ThemedText 
              medicalVariant="patient-name"
              style={{ marginBottom: (Spacing as any)?.xs || 4 }}
            >
              {patientName}
            </ThemedText>
            <ThemedText medicalVariant="condition-secondary">
              {patientId}
            </ThemedText>
            
            {/* Palliative Care Info */}
            <View style={{ marginTop: (Spacing as any)?.xs || 4 }}>
              {priorityInfo && (
                <ThemedText 
                  variant="bodySmall" 
                  style={{ 
                    color: isDark ? priorityInfo.dark : priorityInfo.light,
                    fontWeight: '600',
                    marginBottom: (Spacing as any)?.xs || 4
                  }}
                >
                  {priorityInfo.emoji} {priorityInfo.description}
                </ThemedText>
              )}
              
              {prognosis && (
                <ThemedText variant="bodySmall" style={{ marginBottom: (Spacing as any)?.xs || 4 }}>
                  Prognosis: {prognosis}
                </ThemedText>
              )}
              
              {goalsOfCare && (
                <ThemedText variant="bodySmall" style={{ marginBottom: (Spacing as any)?.xs || 4 }}>
                  Goals: {goalsOfCare}
                </ThemedText>
              )}
              
              {painLevel !== undefined && (
                <ThemedText variant="bodySmall" style={{ marginBottom: (Spacing as any)?.xs || 4 }}>
                  Current Pain: {painLevel}/10
                </ThemedText>
              )}
              
              {primaryCaregiver && (
                <ThemedText variant="bodySmall">
                  Caregiver: {primaryCaregiver}
                </ThemedText>
              )}
            </View>
          </View>
          
          {/* Map preview */}
          {location?.coordinates && (
            <View style={{ width: 80, height: 60 }}>
              <MapPreview
                latitude={location.coordinates.latitude}
                longitude={location.coordinates.longitude}
                address={location.address}
                size="small"
                style={{}}
              />
            </View>
          )}
        </View>
        
        {location?.address && (
          <ThemedText variant="bodySmall" style={{ 
            fontStyle: 'italic',
            opacity: 0.8,
            marginTop: (Spacing as any)?.xs || 4
          }}>
            📍 {location.address}
          </ThemedText>
        )}
      </View>
      
      {children}
    </Card>
  );
}

/**
 * Legacy PatientCard (maintained for backward compatibility)
 */
export function PatientCard({
  patientName,
  patientId,
  location,
  priority,
  onPress,
  children,
  ...props
}: PatientCardProps): React.JSX.Element {
  return (
    <Card
      priority={priority}
      usePalliativePriority={false} // Use legacy priority system
      onPress={onPress}
      {...props}
    >
      <View style={{ marginBottom: (Spacing as any)?.sm || 8 }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: (Spacing as any)?.xs || 4
        }}>
          <View style={{ flex: 1, marginRight: (Spacing as any)?.sm || 8 }}>
            <ThemedText 
              medicalVariant="patient-name"
              style={{ marginBottom: (Spacing as any)?.xs || 4 }}
            >
              {patientName}
            </ThemedText>
            <ThemedText medicalVariant="condition-secondary">
              {patientId}
            </ThemedText>
          </View>
          
          {/* Map preview */}
          {location?.coordinates && (
            <View style={{ width: 80, height: 60 }}>
              <MapPreview
                latitude={location.coordinates.latitude}
                longitude={location.coordinates.longitude}
                address={location.address}
                size="small"
                style={{}}
              />
            </View>
          )}
        </View>
        
        {location?.address && (
          <ThemedText variant="bodySmall" style={{ 
            fontStyle: 'italic',
            opacity: 0.8,
            marginTop: (Spacing as any)?.xs || 4
          }}>
            📍 {location.address}
          </ThemedText>
        )}
      </View>
      
      {children}
    </Card>
  );
}

/**
 * Enhanced Task Card with palliative priority support
 */
export function TaskCard({
  taskTitle,
  taskDescription,
  dueTime,
  status,
  priority,
  onPress,
  usePalliativePriority = false,
  children,
  ...props
}: TaskCardProps): React.JSX.Element {
  return (
    <Card
      title={taskTitle}
      subtitle={taskDescription}
      priority={priority}
      status={status}
      usePalliativePriority={usePalliativePriority}
      onPress={onPress}
      {...props}
    >
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: (Spacing as any)?.sm || 8
      }}>
        <ThemedText variant="bodySmall" style={{ fontWeight: '600' }}>
          Due: {dueTime}
        </ThemedText>
        
        {status && (
          <View style={{
            paddingHorizontal: (Spacing as any)?.sm || 8,
            paddingVertical: (Spacing as any)?.xs || 4,
            borderRadius: (Spacing.borderRadius as any)?.sm || 8,
            backgroundColor: 'rgba(0,0,0,0.1)'
          }}>
            <ThemedText variant="labelSmall" style={{ 
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              {status}
            </ThemedText>
          </View>
        )}
      </View>
      
      {children}
    </Card>
  );
} 