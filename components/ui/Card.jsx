import { useEnhancedColorScheme } from '@/components/ui/ThemeProvider';
import { MedicalPriority, TaskStatus } from '@/constants/Colors';
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

  // Get priority colors if specified
  const getPriorityColor = () => {
    if (!priority) return null;
    const priorityColors = MedicalPriority[priority];
    if (!priorityColors) {
      console.warn(`Unknown priority: ${priority}`);
      return null;
    }
    return isDark ? priorityColors.dark : priorityColors.light;
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: surfaceColor,
          ...Shadows.medium,
          borderWidth: 0,
        };
      
      case 'filled':
        return {
          backgroundColor: surfaceVariantColor,
          ...Shadows.none,
          borderWidth: 0,
        };
      
      case 'outlined':
        return {
          backgroundColor: surfaceColor,
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

// Specialized medical card components
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
              ID: {patientId}
            </ThemedText>
          </View>
          {location && (
            <View style={{ alignItems: 'flex-end' }}>
              <MapPreview
                latitude={location.coordinates?.latitude}
                longitude={location.coordinates?.longitude}
                address={location.address}
                size="small"
                style={{ marginBottom: Spacing.xs }}
              />
              <ThemedText 
                variant="bodySmall" 
                style={{ 
                  textAlign: 'right',
                  maxWidth: 100,
                  fontSize: 10,
                  opacity: 0.7
                }}
                numberOfLines={2}
              >
                {location.address}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
      {children}
    </Card>
  );
}

export function TaskCard({
  taskTitle,
  taskDescription,
  dueTime,
  status,
  priority,
  onPress,
  children,
  ...props
}) {
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Card
      title={taskTitle}
      subtitle={taskDescription}
      status={status}
      priority={priority}
      onPress={onPress}
      {...props}
    >
      {dueTime && (
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: Spacing.sm 
        }}>
          <ThemedText medicalVariant="timestamp">
            Due: {dueTime}
          </ThemedText>
          {status && (
            <View style={{
              paddingHorizontal: Spacing.sm,
              paddingVertical: Spacing.xs,
              borderRadius: Spacing.borderRadius.sm,
              backgroundColor: TaskStatus[status]?.[isDark ? 'dark' : 'light'] + '20',
            }}>
              <ThemedText 
                variant="labelSmall"
                style={{ 
                  color: TaskStatus[status]?.[isDark ? 'dark' : 'light'],
                  textTransform: 'uppercase'
                }}
              >
                {status}
              </ThemedText>
            </View>
          )}
        </View>
      )}
      {children}
    </Card>
  );
} 