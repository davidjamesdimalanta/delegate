import { CaregiverBurden, GriefStage } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Alert, Linking, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Card } from './Card';
import { useEnhancedColorScheme } from './ThemeProvider';

export function FamilyContactCard({
  primaryCaregiver,
  emergencyContacts = [],
  caregiverBurden,
  grief,
  familyDynamics,
  bereavementSupport,
  onEditPress,
  onCallPress,
  onEmailPress,
  style,
  ...props
}) {
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';
  const primaryColor = useThemeColor({}, 'primary');
  const onSurfaceColor = useThemeColor({}, 'onSurface');

  const handleCall = (phoneNumber, name) => {
    if (onCallPress) {
      onCallPress(phoneNumber, name);
      return;
    }

    const cleanedNumber = phoneNumber.replace(/[^\d+]/g, '');
    const url = `tel:${cleanedNumber}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Phone dialing is not supported on this device.');
        }
      })
      .catch((error) => {
        console.error('Error making phone call:', error);
        Alert.alert('Error', 'Unable to initiate phone call.');
      });
  };

  const handleEmail = (email, name) => {
    if (onEmailPress) {
      onEmailPress(email, name);
      return;
    }

    const url = `mailto:${email}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Email is not supported on this device.');
        }
      })
      .catch((error) => {
        console.error('Error opening email:', error);
        Alert.alert('Error', 'Unable to open email client.');
      });
  };

  const getBurdenColor = (burden) => {
    if (!burden || !CaregiverBurden[burden]) return null;
    return CaregiverBurden[burden][isDark ? 'dark' : 'light'];
  };

  const getGriefColor = (griefStage) => {
    if (!griefStage || !GriefStage[griefStage]) return null;
    return GriefStage[griefStage][isDark ? 'dark' : 'light'];
  };

  return (
    <Card
      title="Family & Caregivers"
      variant="outlined"
      style={style}
      {...props}
    >
      {/* Primary Caregiver */}
      {primaryCaregiver && (
        <View style={{ marginBottom: Spacing.lg }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: Spacing.sm 
          }}>
            <View style={{ flex: 1 }}>
              <ThemedText variant="titleSmall" style={{ marginBottom: Spacing.xs }}>
                👨‍⚕️ Primary Caregiver
              </ThemedText>
              <ThemedText variant="bodyLarge" style={{ fontWeight: '600', marginBottom: Spacing.xs }}>
                {primaryCaregiver.name}
              </ThemedText>
              <ThemedText variant="bodyMedium" style={{ opacity: 0.8 }}>
                {primaryCaregiver.relationship}
              </ThemedText>
            </View>
            
            {onEditPress && (
              <TouchableOpacity 
                onPress={() => onEditPress('primaryCaregiver', primaryCaregiver)}
                style={{ padding: Spacing.sm }}
              >
                <ThemedText variant="bodySmall" style={{ color: primaryColor }}>
                  Edit
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {/* Contact Information */}
          <View style={{ 
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: Spacing.borderRadius.md,
            padding: Spacing.md,
            marginBottom: Spacing.sm
          }}>
            {primaryCaregiver.phone && (
              <TouchableOpacity 
                onPress={() => handleCall(primaryCaregiver.phone, primaryCaregiver.name)}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}
              >
                <ThemedText variant="bodyMedium">📞 </ThemedText>
                <ThemedText variant="bodyMedium" style={{ color: primaryColor, textDecorationLine: 'underline' }}>
                  {primaryCaregiver.phone}
                </ThemedText>
              </TouchableOpacity>
            )}
            
            {primaryCaregiver.email && (
              <TouchableOpacity 
                onPress={() => handleEmail(primaryCaregiver.email, primaryCaregiver.name)}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm }}
              >
                <ThemedText variant="bodyMedium">✉️ </ThemedText>
                <ThemedText variant="bodyMedium" style={{ color: primaryColor, textDecorationLine: 'underline' }}>
                  {primaryCaregiver.email}
                </ThemedText>
              </TouchableOpacity>
            )}
            
            {primaryCaregiver.address && (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <ThemedText variant="bodyMedium">🏠 </ThemedText>
                <ThemedText variant="bodyMedium" style={{ flex: 1 }}>
                  {primaryCaregiver.address}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Caregiver Burden Indicator */}
          {caregiverBurden && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: Spacing.sm,
              borderRadius: Spacing.borderRadius.sm,
              backgroundColor: getBurdenColor(caregiverBurden) + '20',
              borderLeftWidth: 3,
              borderLeftColor: getBurdenColor(caregiverBurden),
            }}>
              <View style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: getBurdenColor(caregiverBurden),
                marginRight: Spacing.sm,
              }} />
              <ThemedText variant="bodySmall">
                Caregiver burden: <ThemedText style={{ fontWeight: '600' }}>{caregiverBurden.replace('-', ' ')}</ThemedText>
              </ThemedText>
            </View>
          )}
        </View>
      )}

      {/* Emergency Contacts */}
      {emergencyContacts.length > 0 && (
        <View style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="titleSmall" style={{ marginBottom: Spacing.md }}>
            🚨 Emergency Contacts
          </ThemedText>
          
          {emergencyContacts.map((contact, index) => (
            <View 
              key={index} 
              style={{ 
                marginBottom: Spacing.md,
                padding: Spacing.md,
                borderRadius: Spacing.borderRadius.md,
                backgroundColor: contact.isPrimary ? primaryColor + '10' : 'rgba(0,0,0,0.03)',
                borderWidth: contact.isPrimary ? 1 : 0,
                borderColor: contact.isPrimary ? primaryColor + '40' : 'transparent',
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="bodyLarge" style={{ fontWeight: '600', marginBottom: Spacing.xs }}>
                    {contact.name}
                    {contact.isPrimary && (
                      <ThemedText variant="bodySmall" style={{ color: primaryColor, fontWeight: '600' }}>
                        {' '}(Primary)
                      </ThemedText>
                    )}
                  </ThemedText>
                  <ThemedText variant="bodyMedium" style={{ opacity: 0.8 }}>
                    {contact.relationship}
                  </ThemedText>
                </View>
              </View>
              
              {contact.phone && (
                <TouchableOpacity 
                  onPress={() => handleCall(contact.phone, contact.name)}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <ThemedText variant="bodyMedium">📞 </ThemedText>
                  <ThemedText variant="bodyMedium" style={{ color: primaryColor, textDecorationLine: 'underline' }}>
                    {contact.phone}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Family Dynamics */}
      {familyDynamics && (
        <View style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="titleSmall" style={{ marginBottom: Spacing.sm }}>
            👪 Family Dynamics
          </ThemedText>
          <View style={{
            padding: Spacing.md,
            borderRadius: Spacing.borderRadius.md,
            backgroundColor: 'rgba(0,0,0,0.03)',
            borderLeftWidth: 3,
            borderLeftColor: primaryColor,
          }}>
            <ThemedText variant="bodyMedium">
              {familyDynamics}
            </ThemedText>
          </View>
        </View>
      )}

      {/* Grief Status */}
      {grief && (
        <View style={{ marginBottom: Spacing.lg }}>
          <ThemedText variant="titleSmall" style={{ marginBottom: Spacing.sm }}>
            💔 Grief Support
          </ThemedText>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: Spacing.md,
            borderRadius: Spacing.borderRadius.md,
            backgroundColor: getGriefColor(grief) + '20',
            borderLeftWidth: 3,
            borderLeftColor: getGriefColor(grief),
          }}>
            <View style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: getGriefColor(grief),
              marginRight: Spacing.sm,
            }} />
            <ThemedText variant="bodyMedium">
              <ThemedText style={{ fontWeight: '600' }}>{grief.charAt(0).toUpperCase() + grief.slice(1)}</ThemedText> grief stage
            </ThemedText>
          </View>
        </View>
      )}

      {/* Bereavement Support (for deceased patients) */}
      {bereavementSupport && (
        <View style={{ marginBottom: Spacing.sm }}>
          <ThemedText variant="titleSmall" style={{ marginBottom: Spacing.sm }}>
            🕊️ Bereavement Support
          </ThemedText>
          <View style={{
            padding: Spacing.md,
            borderRadius: Spacing.borderRadius.md,
            backgroundColor: '#F3E5F5',
            borderLeftWidth: 3,
            borderLeftColor: '#6A1B9A',
          }}>
            {bereavementSupport.enrolled && (
              <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.sm }}>
                ✅ Enrolled in bereavement program
              </ThemedText>
            )}
            
            {bereavementSupport.counselorAssigned && (
              <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.sm }}>
                Counselor: {bereavementSupport.counselorAssigned}
              </ThemedText>
            )}
            
            {bereavementSupport.nextContact && (
              <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.sm }}>
                Next contact: {bereavementSupport.nextContact}
              </ThemedText>
            )}
            
            {bereavementSupport.supportGroupReferral && (
              <ThemedText variant="bodyMedium">
                📅 Support group referral provided
              </ThemedText>
            )}
          </View>
        </View>
      )}
    </Card>
  );
}

// Compact version for overview displays
export function FamilyContactCompact({
  primaryCaregiver,
  emergencyContacts = [],
  onPress,
  style,
  ...props
}) {
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <TouchableOpacity onPress={onPress} style={style} {...props}>
      <View style={{
        padding: Spacing.md,
        borderRadius: Spacing.borderRadius.md,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderLeftWidth: 3,
        borderLeftColor: primaryColor,
      }}>
        <ThemedText variant="titleSmall" style={{ marginBottom: Spacing.xs }}>
          👪 Family Contacts
        </ThemedText>
        
        {primaryCaregiver && (
          <ThemedText variant="bodyMedium" style={{ marginBottom: Spacing.xs }}>
            Primary: {primaryCaregiver.name} ({primaryCaregiver.relationship})
          </ThemedText>
        )}
        
        <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
          {emergencyContacts.length} emergency contact{emergencyContacts.length !== 1 ? 's' : ''}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
} 