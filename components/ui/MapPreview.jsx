import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ThemedText } from '../ThemedText';

export function MapPreview({ 
  latitude, 
  longitude, 
  address,
  style,
  size = 'small' 
}) {
  const [mapError, setMapError] = useState(false);
  const backgroundColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'outline');
  const textColor = useThemeColor({}, 'onSurface');
  
  // Size configurations
  const sizeConfig = {
    small: { width: 80, height: 60 },
    medium: { width: 120, height: 90 },
    large: { width: 160, height: 120 }
  };
  
  const { width, height } = sizeConfig[size];
  
  // Default to a location if coordinates aren't provided
  const region = {
    latitude: latitude || 37.7749,
    longitude: longitude || -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Fallback component when map fails to load
  const MapFallback = () => (
    <View style={[
      styles.container,
      styles.fallback,
      {
        width,
        height,
        backgroundColor,
        borderColor,
      }
    ]}>
      <ThemedText variant="bodySmall" style={{ 
        textAlign: 'center', 
        fontSize: 10,
        opacity: 0.7 
      }}>
        📍 Map
      </ThemedText>
      <ThemedText variant="bodySmall" style={{ 
        textAlign: 'center', 
        fontSize: 8,
        opacity: 0.5 
      }}>
        Location
      </ThemedText>
    </View>
  );

  // Show fallback if there's an error or coordinates are invalid
  if (mapError || !latitude || !longitude) {
    return <MapFallback />;
  }

  return (
    <View style={[
      styles.container,
      {
        width,
        height,
        backgroundColor,
        borderColor,
      },
      style
    ]}>
      <MapView
        style={styles.map}
        region={region}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        mapType="standard"
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsTraffic={false}
        showsIndoors={false}
        showsBuildings={true}
        showsPointsOfInterest={false}
        onError={() => setMapError(true)}
        onMapReady={() => setMapError(false)}
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title="Patient Location"
          description={address}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xs,
  },
}); 