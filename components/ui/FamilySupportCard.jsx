import { CaregiverBurden, GriefStage } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Card } from './Card';
import { useEnhancedColorScheme } from './ThemeProvider';

const FAMILY_SUPPORT_TASKS = [
  { key: 'education', label: 'Caregiver Education', icon: '📚' },
  { key: 'respite', label: 'Respite Care', icon: '🛌' },
  { key: 'communication', label: 'Family Meeting', icon: '👥' },
  { key: 'resources', label: 'Resource Referral', icon: '🔗' },
  { key: 'counseling', label: 'Grief Counseling', icon: '💭' },
];

export function FamilySupportCard({
  patient,
  onSupportComplete,
  onNavigateToFull,
  style,
  ...props
}) {
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';
  const primaryColor = useThemeColor({}, 'primary');
  const onSurfaceColor = useThemeColor({}, 'onSurface');

  const [selectedSupport, setSelectedSupport] = useState(null);

  const getBurdenColor = (burden) => {
    if (!burden || !CaregiverBurden[burden]) return primaryColor;
    return CaregiverBurden[burden][isDark ? 'dark' : 'light'];
  };

  const getGriefColor = (griefStage) => {
    if (!griefStage || !GriefStage[griefStage]) return primaryColor;
    return GriefStage[griefStage][isDark ? 'dark' : 'light'];
  };

  const handleSupportTask = (supportType) => {
    setSelectedSupport(supportType);
    
    Alert.alert(
      'Family Support Task',
      `Would you like to document ${supportType.label.toLowerCase()} for this family?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Document', 
          onPress: () => {
            const supportEntry = {
              type: supportType.key,
              label: supportType.label,
              timestamp: new Date().toISOString(),
              providedBy: 'Current User', // In real app, get from auth
            };
            
            if (onSupportComplete) {
              onSupportComplete(supportEntry);
            }
          }
        }
      ]
    );
  };

  const family = patient?.family;
  const primaryCaregiver = family?.primaryCaregiver;

  return (
    <Card
      title="👪 Family Support"
      variant="outlined"
      style={style}
      {...props}
    >
      {/* Primary Caregiver Info */}
      {primaryCaregiver && (
        <View style={{ marginBottom: Spacing.lg }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Spacing.sm,
          }}>
            <View style={{ flex: 1 }}>
              <ThemedText variant="titleSmall" style={{ marginBottom: Spacing.xs }}>
                Primary Caregiver
              </ThemedText>
              <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
                {primaryCaregiver.name}
              </ThemedText>
              <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                {primaryCaregiver.relationship}
              </ThemedText>
            </View>
          </View>

          {/* Caregiver Burden & Grief Status */}
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {family.caregiverBurden && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: getBurdenColor(family.caregiverBurden) + '20',
                paddingHorizontal: Spacing.sm,
                paddingVertical: Spacing.xs,
                borderRadius: Spacing.borderRadius.sm,
                borderWidth: 1,
                borderColor: getBurdenColor(family.caregiverBurden) + '40',
                flex: 1,
              }}>
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: getBurdenColor(family.caregiverBurden),
                  marginRight: Spacing.xs,
                }} />
                <ThemedText variant="bodySmall" style={{ fontWeight: '600' }}>
                  {family.caregiverBurden.replace('-', ' ')} burden
                </ThemedText>
              </View>
            )}

            {family.grief && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: getGriefColor(family.grief) + '20',
                paddingHorizontal: Spacing.sm,
                paddingVertical: Spacing.xs,
                borderRadius: Spacing.borderRadius.sm,
                borderWidth: 1,
                borderColor: getGriefColor(family.grief) + '40',
                flex: 1,
              }}>
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: getGriefColor(family.grief),
                  marginRight: Spacing.xs,
                }} />
                <ThemedText variant="bodySmall" style={{ fontWeight: '600' }}>
                  {family.grief} grief
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Quick Support Actions */}
      <View style={{ marginBottom: Spacing.lg }}>
        <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.sm, opacity: 0.8 }}>
          Quick Support Actions
        </ThemedText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
          {FAMILY_SUPPORT_TASKS.slice(0, 4).map((task) => (
            <TouchableOpacity
              key={task.key}
              onPress={() => handleSupportTask(task)}
              style={{
                backgroundColor: primaryColor + '10',
                paddingHorizontal: Spacing.sm,
                paddingVertical: Spacing.sm,
                borderRadius: Spacing.borderRadius.sm,
                borderWidth: 1,
                borderColor: primaryColor + '30',
                flexDirection: 'row',
                alignItems: 'center',
                minWidth: '45%',
              }}
              activeOpacity={0.7}
            >
              <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.xs }}>
                {task.icon}
              </ThemedText>
              <ThemedText variant="bodySmall" style={{ color: primaryColor, fontWeight: '600' }}>
                {task.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Emergency Contacts Count */}
      {family?.emergencyContacts && family.emergencyContacts.length > 0 && (
        <View style={{ marginBottom: Spacing.lg }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.05)',
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            borderRadius: Spacing.borderRadius.sm,
          }}>
            <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.sm }}>
              📞
            </ThemedText>
            <ThemedText variant="bodyMedium">
              {family.emergencyContacts.length} emergency contact{family.emergencyContacts.length !== 1 ? 's' : ''} available
            </ThemedText>
          </View>
        </View>
      )}

      {/* Family Dynamics Note */}
      {family?.familyDynamics && (
        <View style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="labelMedium" style={{ marginBottom: Spacing.sm, opacity: 0.8 }}>
            Family Dynamics
          </ThemedText>
          <View style={{
            backgroundColor: 'rgba(0,0,0,0.03)',
            padding: Spacing.md,
            borderRadius: Spacing.borderRadius.sm,
            borderLeftWidth: 3,
            borderLeftColor: primaryColor,
          }}>
            <ThemedText variant="bodySmall" numberOfLines={2}>
              {family.familyDynamics}
            </ThemedText>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', gap: Spacing.md }}>
        <TouchableOpacity
          onPress={() => handleSupportTask(FAMILY_SUPPORT_TASKS[2])} // Family Meeting
          style={{
            flex: 1,
            backgroundColor: primaryColor,
            paddingVertical: Spacing.md,
            borderRadius: Spacing.borderRadius.md,
            alignItems: 'center',
          }}
          activeOpacity={0.8}
        >
          <ThemedText variant="labelMedium" style={{ color: '#FFFFFF', fontWeight: '600' }}>
            Family Meeting
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={onNavigateToFull}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: primaryColor,
            paddingVertical: Spacing.md,
            borderRadius: Spacing.borderRadius.md,
            alignItems: 'center',
          }}
          activeOpacity={0.7}
        >
          <ThemedText variant="labelMedium" style={{ color: primaryColor, fontWeight: '600' }}>
            Full Support
          </ThemedText>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

// Compact version for task card integration
export function FamilySupportCompact({
  patient,
  onPress,
  style,
  ...props
}) {
  const primaryColor = useThemeColor({}, 'primary');
  
  const family = patient?.family;
  const caregiverName = family?.primaryCaregiver?.name || 'Unknown';
  const burden = family?.caregiverBurden || 'unknown';
  const contactsCount = family?.emergencyContacts?.length || 0;
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: primaryColor + '10',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Spacing.borderRadius.md,
        borderWidth: 1,
        borderColor: primaryColor + '30',
      }, style]}
      activeOpacity={0.7}
      {...props}
    >
      <ThemedText variant="bodyMedium" style={{ marginRight: Spacing.xs }}>
        👪
      </ThemedText>
      <View style={{ flex: 1 }}>
        <ThemedText variant="bodyMedium" style={{ fontWeight: '600' }}>
          Family Support
        </ThemedText>
        <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
          {caregiverName} • {burden} burden • {contactsCount} contacts
        </ThemedText>
      </View>
      <ThemedText variant="bodySmall" style={{ color: primaryColor, fontWeight: '600' }}>
        Support →
      </ThemedText>
    </TouchableOpacity>
  );
} 