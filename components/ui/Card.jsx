import { useEnhancedColorScheme } from '@/components/ui/ThemeProvider';
import { MedicalPriority, PalliativePriority, TaskStatus } from '@/constants/Colors';
import { Shadows, Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { MapPreview } from './MapPreview';

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
  ...props
}) {
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';

  // Get theme colors
  const surfaceColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const outlineColor = useThemeColor({}, 'outline');
  const surfaceVariantColor = useThemeColor({}, 'surfaceVariant');

  // Get status colors if specified
  const getStatusColor = () => {
    if (!status) return null;
    const statusColors = TaskStatus[status];
    if (!statusColors) {
      console.warn(`Unknown task status: ${status}`);
      return null;
    }
    return isDark ? statusColors.dark : statusColors.light;
  };

  // Get priority colors if specified - now supports both systems
  const getPriorityColor = () => {
    if (!priority) return null;
    
    // Use palliative priority system by default, fall back to medical priority
    const prioritySystem = usePalliativePriority ? PalliativePriority : MedicalPriority;
    const priorityColors = prioritySystem[priority];
    
    if (!priorityColors) {
      // Try the other system if priority not found
      const fallbackSystem = usePalliativePriority ? MedicalPriority : PalliativePriority;
      const fallbackColors = fallbackSystem[priority];
      
      if (!fallbackColors) {
        console.warn(`Unknown priority: ${priority}`);
        return null;
      }
      return isDark ? fallbackColors.dark : fallbackColors.light;
    }
    
    return isDark ? priorityColors.dark : priorityColors.light;
  };

  // Get priority background color for enhanced visual indication
  const getPriorityBackground = () => {
    if (!priority || !usePalliativePriority) return null;
    
    const priorityColors = PalliativePriority[priority];
    if (!priorityColors || !priorityColors.background) return null;
    
    return isDark ? priorityColors.background.dark : priorityColors.background.light;
  };

  // Variant styles
  const getVariantStyles = () => {
    const priorityBg = getPriorityBackground();
    
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: priorityBg || surfaceColor,
          ...Shadows.medium,
          borderWidth: 0,
        };
      
      case 'filled':
        return {
          backgroundColor: priorityBg || surfaceVariantColor,
          ...Shadows.none,
          borderWidth: 0,
        };
      
      case 'outlined':
        return {
          backgroundColor: priorityBg || surfaceColor,
          ...Shadows.none,
          borderWidth: 1,
          borderColor: outlineColor,
        };
      
      default:
        return getVariantStyles('elevated');
    }
  };

  const variantStyles = getVariantStyles();
  const statusColor = getStatusColor();
  const priorityColor = getPriorityColor();

  const cardStyles = [
    {
      borderRadius: Spacing.borderRadius.lg,
      padding: Spacing.component.cardPadding,
      margin: Spacing.component.cardMargin,
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
  ].filter(Boolean);

  const headerStyles = [
    {
      marginBottom: (title || subtitle) ? Spacing.sm : 0,
    },
    headerStyle,
  ];

  const contentStyles = [
    contentStyle,
  ];

  const CardContent = () => (
    <View style={cardStyles}>
      {(title || subtitle) && (
        <View style={headerStyles}>
          {title && (
            <ThemedText 
              variant="titleMedium"
              style={{ 
                color: onSurfaceColor,
                marginBottom: subtitle ? Spacing.xs : 0 
              }}
            >
              {title}
            </ThemedText>
          )}
          {subtitle && (
            <ThemedText 
              variant="bodyMedium"
              style={{ 
                color: onSurfaceColor,
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
        {...props}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent {...props} />;
}

// Enhanced Palliative Patient Card with new features
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
}) {
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Get priority info for display
  const priorityInfo = PalliativePriority[priority];
  
  return (
    <Card
      priority={priority}
      usePalliativePriority={true}
      onPress={onPress}
      {...props}
    >
      <View style={{ marginBottom: Spacing.sm }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: Spacing.xs
        }}>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <ThemedText 
              medicalVariant="patientName"
              style={{ marginBottom: Spacing.xs }}
            >
              {patientName}
            </ThemedText>
            <ThemedText medicalVariant="medicalId">
              {patientId}
            </ThemedText>
            
            {/* Palliative Care Info */}
            <View style={{ marginTop: Spacing.xs }}>
              {priorityInfo && (
                <ThemedText 
                  variant="bodySmall" 
                  style={{ 
                    color: isDark ? priorityInfo.dark : priorityInfo.light,
                    fontWeight: '600',
                    marginBottom: Spacing.xs
                  }}
                >
                  {priorityInfo.emoji} {priorityInfo.description}
                </ThemedText>
              )}
              
              {prognosis && (
                <ThemedText variant="bodySmall" style={{ marginBottom: Spacing.xs }}>
                  Prognosis: {prognosis}
                </ThemedText>
              )}
              
              {goalsOfCare && (
                <ThemedText variant="bodySmall" style={{ marginBottom: Spacing.xs }}>
                  Goals: {goalsOfCare}
                </ThemedText>
              )}
              
              {painLevel !== undefined && (
                <ThemedText variant="bodySmall" style={{ marginBottom: Spacing.xs }}>
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
          {location && location.coordinates && (
            <View style={{ width: 80, height: 60 }}>
              <MapPreview
                latitude={location.coordinates.latitude}
                longitude={location.coordinates.longitude}
                address={location.address}
                size="small"
              />
            </View>
          )}
        </View>
        
        {location && location.address && (
          <ThemedText variant="bodySmall" style={{ 
            fontStyle: 'italic',
            opacity: 0.8,
            marginTop: Spacing.xs
          }}>
            📍 {location.address}
          </ThemedText>
        )}
      </View>
      
      {children}
    </Card>
  );
}

// Legacy PatientCard (maintained for backward compatibility)
export function PatientCard({
  patientName,
  patientId,
  location,
  priority,
  onPress,
  children,
  ...props
}) {
  return (
    <Card
      priority={priority}
      usePalliativePriority={false} // Use legacy priority system
      onPress={onPress}
      {...props}
    >
      <View style={{ marginBottom: Spacing.sm }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: Spacing.xs
        }}>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <ThemedText 
              medicalVariant="patientName"
              style={{ marginBottom: Spacing.xs }}
            >
              {patientName}
            </ThemedText>
            <ThemedText medicalVariant="medicalId">
              {patientId}
            </ThemedText>
          </View>
          
          {/* Map preview */}
          {location && location.coordinates && (
            <View style={{ width: 80, height: 60 }}>
              <MapPreview
                latitude={location.coordinates.latitude}
                longitude={location.coordinates.longitude}
                address={location.address}
                size="small"
              />
            </View>
          )}
        </View>
        
        {location && location.address && (
          <ThemedText variant="bodySmall" style={{ 
            fontStyle: 'italic',
            opacity: 0.8,
            marginTop: Spacing.xs
          }}>
            📍 {location.address}
          </ThemedText>
        )}
      </View>
      
      {children}
    </Card>
  );
}

// Enhanced Task Card with palliative priority support
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
}) {
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
        marginTop: Spacing.sm
      }}>
        <ThemedText variant="bodySmall" style={{ fontWeight: '600' }}>
          Due: {dueTime}
        </ThemedText>
        
        {status && (
          <View style={{
            paddingHorizontal: Spacing.sm,
            paddingVertical: Spacing.xs,
            borderRadius: Spacing.borderRadius.sm,
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