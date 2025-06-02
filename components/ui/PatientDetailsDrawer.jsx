import { PalliativePriority, SymptomSeverity } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Linking,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { FamilyContactCard } from './FamilyContactCard';
import { useEnhancedColorScheme } from './ThemeProvider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.90; // Increased to 90% for more content
const SWIPE_THRESHOLD = 50;

export function PatientDetailsDrawer({ 
  visible, 
  onClose, 
  patient,
  onEditNotes 
}) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const [savedNotes, setSavedNotes] = useState('');
  const colorScheme = useEnhancedColorScheme();
  const isDark = colorScheme === 'dark';
  
  const backgroundColor = useThemeColor({}, 'surface');
  const surfaceColor = useThemeColor({}, 'surfaceVariant');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const outlineColor = useThemeColor({}, 'outline');
  const primaryColor = useThemeColor({}, 'primary');

  // Initialize notes when patient changes
  useEffect(() => {
    if (patient) {
      const existingNotes = patient.notes || '';
      setSavedNotes(existingNotes);
    }
  }, [patient]);

  const handleEditNotes = () => {
    if (onEditNotes) {
      onEditNotes(patient, savedNotes);
    } else {
      console.error('onEditNotes prop is not provided');
    }
  };

  const handleOpenInMaps = () => {
    if (!patient || !patient.coordinates) {
      Alert.alert('Error', 'Location coordinates not available for this patient.');
      return;
    }

    const { latitude, longitude } = patient.coordinates;
    const address = patient.address || '';

    // Create different URL schemes for different platforms and apps
    const mapOptions = [
      {
        name: 'Apple Maps',
        url: Platform.OS === 'ios' 
          ? `maps://?q=${encodeURIComponent(address)}&ll=${latitude},${longitude}`
          : `https://maps.apple.com/?q=${encodeURIComponent(address)}&ll=${latitude},${longitude}`,
      },
      {
        name: 'Google Maps',
        url: `https://maps.google.com/?q=${latitude},${longitude}`,
      },
    ];

    // For iOS, try Apple Maps first, then Google Maps
    // For Android, try Google Maps first, then Apple Maps
    const primaryOption = Platform.OS === 'ios' ? mapOptions[0] : mapOptions[1];
    const secondaryOption = Platform.OS === 'ios' ? mapOptions[1] : mapOptions[0];

    // Try to open the primary maps app
    Linking.canOpenURL(primaryOption.url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(primaryOption.url);
        } else {
          // If primary app is not available, try secondary
          return Linking.canOpenURL(secondaryOption.url);
        }
      })
      .then((fallbackSupported) => {
        if (fallbackSupported === true) {
          return Linking.openURL(secondaryOption.url);
        } else if (fallbackSupported === false) {
          // If no native apps work, show options
          showMapOptionsAlert(mapOptions);
        }
      })
      .catch((error) => {
        console.error('Error opening maps:', error);
        showMapOptionsAlert(mapOptions);
      });
  };

  const showMapOptionsAlert = (mapOptions) => {
    const buttons = mapOptions.map((option) => ({
      text: option.name,
      onPress: () => {
        Linking.openURL(option.url).catch((error) => {
          console.error(`Error opening ${option.name}:`, error);
          Alert.alert('Error', `Unable to open ${option.name}. Please check if the app is installed.`);
        });
      },
    }));

    buttons.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert(
      'Open Location',
      'Choose a maps app to open the patient location:',
      buttons
    );
  };

  const clearNotes = () => {
    Alert.alert(
      'Clear Notes',
      'Are you sure you want to clear all notes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            setSavedNotes('');
            if (onEditNotes) {
              onEditNotes(patient, '');
            }
          }
        }
      ]
    );
  };

  // Pan responder for swipe to close (only on header area)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Only allow pan gestures in the header area (first ~100px of the drawer)
        const relativeY = evt.nativeEvent.pageY - (SCREEN_HEIGHT - DRAWER_HEIGHT);
        return relativeY < 100;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD || gestureState.vy > 0.5) {
          closeDrawer();
        } else {
          // Snap back to open position with ease-out
          Animated.timing(translateY, {
            toValue: 0,
            duration: 250,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const openDrawer = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(translateY, {
      toValue: DRAWER_HEIGHT,
      duration: 300,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  useEffect(() => {
    if (visible) {
      openDrawer();
    } else {
      translateY.setValue(DRAWER_HEIGHT);
    }
  }, [visible, openDrawer, translateY]);

  if (!patient) return null;

  const region = {
    latitude: patient.coordinates?.latitude || 37.7749,
    longitude: patient.coordinates?.longitude || -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Get priority info for display
  const priorityInfo = PalliativePriority[patient.priority];

  // Get pain color for symptom display
  const getPainColor = (painLevel) => {
    if (painLevel === 0) return SymptomSeverity.none[isDark ? 'dark' : 'light'];
    if (painLevel <= 3) return SymptomSeverity.mild[isDark ? 'dark' : 'light'];
    if (painLevel <= 6) return SymptomSeverity.moderate[isDark ? 'dark' : 'light'];
    if (painLevel <= 8) return SymptomSeverity.severe[isDark ? 'dark' : 'light'];
    return SymptomSeverity.extreme[isDark ? 'dark' : 'light'];
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeDrawer}
    >
      {/* Backdrop */}
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={closeDrawer}
      >
        <View style={styles.backdropContent} />
      </TouchableOpacity>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            backgroundColor,
            transform: [{ translateY }],
            paddingBottom: insets.bottom,
            height: DRAWER_HEIGHT,
          },
        ]}
      >
        {/* Header with pan responder */}
        <View {...panResponder.panHandlers} style={styles.headerContainer}>
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: outlineColor }]} />

          {/* Header */}
          <View style={styles.header}>
            <ThemedText variant="headlineSmall" style={{ color: onSurfaceColor }}>
              {patient.name}
            </ThemedText>
            <ThemedText variant="bodyMedium" style={{ color: onSurfaceColor, opacity: 0.7 }}>
              {patient.id}
            </ThemedText>
            
            {/* Priority Badge */}
            {priorityInfo && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: Spacing.sm,
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.sm,
                borderRadius: Spacing.borderRadius.md,
                backgroundColor: (isDark ? priorityInfo.dark : priorityInfo.light) + '20',
                borderWidth: 1,
                borderColor: isDark ? priorityInfo.dark : priorityInfo.light,
              }}>
                <ThemedText variant="bodyMedium" style={{
                  color: isDark ? priorityInfo.dark : priorityInfo.light,
                  fontWeight: '600'
                }}>
                  {priorityInfo.emoji} {priorityInfo.description}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Open in Maps Button */}
          <View style={styles.locationHeader}>
            <TouchableOpacity 
              onPress={handleOpenInMaps}
              style={[styles.openMapsButton, { backgroundColor: surfaceColor }]}
            >
              <ThemedText variant="labelMedium" style={{ color: primaryColor, fontWeight: '600' }}>
                Open in Maps
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Map Section */}
          <View style={[styles.mapContainer, { borderColor: outlineColor }]}>
            <MapView
              style={styles.map}
              region={region}
              showsUserLocation={false}
              showsMyLocationButton={true}
              showsCompass={true}
              showsScale={true}
              showsTraffic={false}
              showsIndoors={true}
              showsBuildings={true}
              showsPointsOfInterest={true}
            >
              <Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
                title={patient.name}
                description={patient.address}
              />
            </MapView>
          </View>

          {/* Basic Patient Information */}
          <View style={styles.infoContainer}>
            <ThemedView 
              style={[
                styles.infoCard, 
                { backgroundColor: surfaceColor, borderColor: outlineColor }
              ]}
            >
              <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
                Patient Information
              </ThemedText>
              
              {/* Basic Info Grid */}
              <View style={styles.infoGrid}>
                <View style={styles.infoField}>
                  <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7 }]}>
                    Age
                  </ThemedText>
                  <ThemedText variant="titleMedium" style={styles.fieldValue}>
                    {patient.age || 'N/A'}
                  </ThemedText>
                </View>
                <View style={styles.infoField}>
                  <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7 }]}>
                    Condition
                  </ThemedText>
                  <ThemedText variant="titleMedium" style={styles.fieldValue}>
                    {patient.condition}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.infoGrid}>
                <View style={styles.infoField}>
                  <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7 }]}>
                    Last Visit
                  </ThemedText>
                  <ThemedText variant="titleMedium" style={styles.fieldValue}>
                    {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'N/A'}
                  </ThemedText>
                </View>
                <View style={styles.infoField}>
                  <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7 }]}>
                    Next Visit
                  </ThemedText>
                  <ThemedText variant="titleMedium" style={[styles.fieldValue, { fontWeight: '600' }]}>
                    {patient.nextAppointment ? new Date(patient.nextAppointment.split(' ')[0]).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'N/A'}
                  </ThemedText>
                </View>
              </View>

              {/* Current Status */}
              <View style={styles.infoField}>
                <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7 }]}>
                  Current Status
                </ThemedText>
                <ThemedText variant="bodyMedium" style={styles.fieldValue}>
                  {patient.vitals}
                </ThemedText>
              </View>
            </ThemedView>
          </View>

          {/* Palliative Care Information */}
          {patient.palliativeCare && (
            <View style={styles.infoContainer}>
              <ThemedView 
                style={[
                  styles.infoCard, 
                  { backgroundColor: surfaceColor, borderColor: outlineColor }
                ]}
              >
                <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
                  🏥 Palliative Care Plan
                </ThemedText>
                
                <View style={styles.infoGrid}>
                  <View style={styles.infoField}>
                    <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7 }]}>
                      Prognosis
                    </ThemedText>
                    <ThemedText variant="titleMedium" style={styles.fieldValue}>
                      {patient.palliativeCare.prognosis}
                    </ThemedText>
                  </View>
                  <View style={styles.infoField}>
                    <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7 }]}>
                      Goals of Care
                    </ThemedText>
                    <ThemedText variant="titleMedium" style={styles.fieldValue}>
                      {patient.palliativeCare.goalsOfCare}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoField}>
                    <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7 }]}>
                      Preferred Care Location
                    </ThemedText>
                    <ThemedText variant="bodyMedium" style={styles.fieldValue}>
                      {patient.palliativeCare.preferredPlaceOfCare}
                    </ThemedText>
                  </View>
                  <View style={styles.infoField}>
                    <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7 }]}>
                      Preferred Death Location
                    </ThemedText>
                    <ThemedText variant="bodyMedium" style={styles.fieldValue}>
                      {patient.palliativeCare.preferredPlaceOfDeath}
                    </ThemedText>
                  </View>
                </View>

                {/* Advance Directives */}
                {patient.palliativeCare.advanceDirectives && (
                  <View style={{ marginTop: Spacing.md }}>
                    <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7, marginBottom: Spacing.sm }]}>
                      Advance Directives
                    </ThemedText>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                      {patient.palliativeCare.advanceDirectives.dnr && (
                        <View style={[styles.directiveBadge, { backgroundColor: '#FF5722' + '20', borderColor: '#FF5722' }]}>
                          <ThemedText variant="bodySmall" style={{ color: '#FF5722', fontWeight: '600' }}>
                            DNR
                          </ThemedText>
                        </View>
                      )}
                      {patient.palliativeCare.advanceDirectives.dni && (
                        <View style={[styles.directiveBadge, { backgroundColor: '#FF9800' + '20', borderColor: '#FF9800' }]}>
                          <ThemedText variant="bodySmall" style={{ color: '#FF9800', fontWeight: '600' }}>
                            DNI
                          </ThemedText>
                        </View>
                      )}
                      {patient.palliativeCare.advanceDirectives.POLST && (
                        <View style={[styles.directiveBadge, { backgroundColor: '#2196F3' + '20', borderColor: '#2196F3' }]}>
                          <ThemedText variant="bodySmall" style={{ color: '#2196F3', fontWeight: '600' }}>
                            POLST
                          </ThemedText>
                        </View>
                      )}
                      {patient.palliativeCare.advanceDirectives.polst && (
                        <View style={[styles.directiveBadge, { backgroundColor: '#4CAF50' + '20', borderColor: '#4CAF50' }]}>
                          <ThemedText variant="bodySmall" style={{ color: '#4CAF50', fontWeight: '600' }}>
                            POLST
                          </ThemedText>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Spiritual and Cultural Needs */}
                {patient.palliativeCare.spiritualNeeds && (
                  <View style={{ marginTop: Spacing.md }}>
                    <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7 }]}>
                      Spiritual & Cultural Considerations
                    </ThemedText>
                    <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.xs }}>
                      Religion: {patient.palliativeCare.spiritualNeeds.religion}
                    </ThemedText>
                    {patient.palliativeCare.spiritualNeeds.spiritualConcerns && (
                      <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.xs, fontStyle: 'italic' }}>
                        &ldquo;{patient.palliativeCare.spiritualNeeds.spiritualConcerns}&rdquo;
                      </ThemedText>
                    )}
                  </View>
                )}
              </ThemedView>
            </View>
          )}

          {/* Current Symptoms & Pain Assessment */}
          {patient.symptoms && (
            <View style={styles.infoContainer}>
              <ThemedView 
                style={[
                  styles.infoCard, 
                  { backgroundColor: surfaceColor, borderColor: outlineColor }
                ]}
              >
                <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
                  🩺 Current Symptoms
                </ThemedText>

                {/* Pain Scale Display */}
                {patient.symptoms.painScale !== undefined && (
                  <View style={{ marginBottom: Spacing.md }}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: Spacing.sm,
                    }}>
                      <View style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: getPainColor(patient.symptoms.painScale),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: Spacing.sm,
                      }}>
                        <ThemedText variant="titleMedium" style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                          {patient.symptoms.painScale}
                        </ThemedText>
                      </View>
                      <View style={{ flex: 1 }}>
                        <ThemedText variant="titleSmall">
                          Pain Level: {patient.symptoms.painScale}/10
                        </ThemedText>
                        <ThemedText variant="bodySmall" style={{ opacity: 0.8 }}>
                          Last assessed: {patient.symptoms.lastAssessment}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                )}

                {/* Current Symptoms List */}
                {patient.symptoms.current && patient.symptoms.current.length > 0 && (
                  <View style={{ marginBottom: Spacing.md }}>
                    <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7, marginBottom: Spacing.sm }]}>
                      Active Symptoms
                    </ThemedText>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                      {patient.symptoms.current.map((symptom, index) => (
                        <View key={index} style={[styles.symptomBadge, { backgroundColor: primaryColor + '20', borderColor: primaryColor }]}>
                          <ThemedText variant="bodySmall" style={{ color: primaryColor, fontWeight: '600' }}>
                            {symptom.charAt(0).toUpperCase() + symptom.slice(1).replace('-', ' ')}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* ESAS Scores */}
                {patient.symptoms.esasScore && (
                  <View>
                    <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7, marginBottom: Spacing.sm }]}>
                      ESAS Assessment (Last: {patient.symptoms.esasScore.lastUpdated})
                    </ThemedText>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                      {Object.entries(patient.symptoms.esasScore).map(([key, value]) => {
                        if (key === 'lastUpdated') return null;
                        return (
                          <View key={key} style={styles.esasItem}>
                            <ThemedText variant="bodySmall" style={{ opacity: 0.8, textTransform: 'capitalize' }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </ThemedText>
                            <ThemedText variant="titleSmall" style={{ fontWeight: '600' }}>
                              {value}/10
                            </ThemedText>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}
              </ThemedView>
            </View>
          )}

          {/* Family & Caregivers */}
          {patient.family && (
            <View style={styles.infoContainer}>
              <FamilyContactCard
                primaryCaregiver={patient.family.primaryCaregiver}
                emergencyContacts={patient.family.emergencyContacts}
                caregiverBurden={patient.family.caregiverBurden}
                grief={patient.family.grief}
                familyDynamics={patient.family.familyDynamics}
                bereavementSupport={patient.family.bereavementSupport}
              />
            </View>
          )}

          {/* Notes Section */}
          <View style={styles.notesContainer}>
            <ThemedView 
              style={[
                styles.notesCard, 
                { backgroundColor: surfaceColor, borderColor: outlineColor }
              ]}
            >
              <View style={styles.notesHeader}>
                <ThemedText variant="titleMedium" style={{ flex: 1 }}>
                  Practitioner Notes
                </ThemedText>
                <View style={styles.notesActions}>
                  {savedNotes && (
                    <TouchableOpacity 
                      onPress={clearNotes}
                      style={[styles.noteButton, { borderColor: outlineColor }]}
                    >
                      <ThemedText variant="labelSmall" style={{ color: onSurfaceColor, opacity: 0.7 }}>
                        Clear
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    onPress={handleEditNotes}
                    style={[styles.noteButton, styles.editButton, { backgroundColor: primaryColor }]}
                  >
                    <ThemedText variant="labelSmall" style={{ color: 'white', fontWeight: '600' }}>
                      {savedNotes ? 'Edit' : 'Add Notes'}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={[
                  styles.notesPreview,
                  {
                    borderColor: outlineColor,
                    backgroundColor: backgroundColor,
                  }
                ]}
                onPress={handleEditNotes}
                activeOpacity={0.7}
              >
                {savedNotes ? (
                  <ThemedText 
                    variant="bodyMedium" 
                    style={{ color: onSurfaceColor }}
                    numberOfLines={4}
                  >
                    {savedNotes}
                  </ThemedText>
                ) : (
                  <ThemedText 
                    variant="bodyMedium" 
                    style={{ color: onSurfaceColor, opacity: 0.5, fontStyle: 'italic' }}
                  >
                    Tap to add notes about the patient condition, treatment, or observations...
                  </ThemedText>
                )}
              </TouchableOpacity>

              {savedNotes && (
                <View style={styles.notesFooter}>
                  <ThemedText variant="labelSmall" style={{ opacity: 0.5 }}>
                    {savedNotes.length} characters
                  </ThemedText>
                  <ThemedText variant="labelSmall" style={{ opacity: 0.5 }}>
                    Tap to edit
                  </ThemedText>
                </View>
              )}
            </ThemedView>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: Spacing.xl }} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropContent: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: Spacing.borderRadius.lg,
    borderTopRightRadius: Spacing.borderRadius.lg,
    paddingTop: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
    opacity: 0.3,
  },
  headerContainer: {
    paddingTop: Spacing.sm,
  },
  header: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  locationHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  openMapsButton: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.sm,
    alignItems: 'center',
  },
  mapContainer: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    height: SCREEN_HEIGHT * 0.25, // Reduced to make room for more content
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoCard: {
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    gap: Spacing.lg,
  },
  infoField: {
    flex: 1,
  },
  fieldLabel: {
    marginBottom: Spacing.xs,
  },
  fieldValue: {
    // No need for flex: 1 here since these are text components
  },
  directiveBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 1,
  },
  symptomBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 1,
  },
  esasItem: {
    alignItems: 'center',
    minWidth: 60,
    padding: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  notesContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  notesCard: {
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  notesActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  noteButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 1,
  },
  editButton: {
    borderWidth: 0,
  },
  notesPreview: {
    borderWidth: 1,
    borderRadius: Spacing.borderRadius.sm,
    padding: Spacing.md,
    minHeight: 80,
    justifyContent: 'center',
  },
  notesFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
}); 