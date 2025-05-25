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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.85; // 85% of screen height
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

          {/* Patient Information */}
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
              
              {/* First Row: Age | Condition */}
              <View style={styles.infoGrid}>
                <View style={styles.infoField}>
                  <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7 }]}>
                    Age
                  </ThemedText>
                  <ThemedText variant="titleMedium" style={styles.fieldValue}>
                    {patient.age}
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

              {/* Second Row: Priority | Status */}
              <View style={styles.infoGrid}>
                <View style={styles.infoField}>
                  <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7 }]}>
                    Priority
                  </ThemedText>
                  <ThemedText 
                    variant="titleMedium" 
                    style={[
                      styles.fieldValue,
                      { 
                        textTransform: 'capitalize',
                        fontWeight: '600'
                      }
                    ]}
                  >
                    {patient.priority}
                  </ThemedText>
                </View>
                <View style={styles.infoField}>
                  <ThemedText variant="labelSmall" style={[styles.fieldLabel, { opacity: 0.7 }]}>
                    Status
                  </ThemedText>
                  <ThemedText variant="bodyMedium" style={styles.fieldValue}>
                    {patient.vitals}
                  </ThemedText>
                </View>
              </View>

              {/* Third Row: Last Visit | Next Appointment */}
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
            </ThemedView>
          </View>

          {/* Notes Section - Now touchable to open full screen editor */}
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
    height: DRAWER_HEIGHT,
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
    height: SCREEN_HEIGHT * 0.3, // Restored to original size
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