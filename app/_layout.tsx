// Polyfills must be imported first
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider, Theme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useEnhancedColorScheme } from '@/components/ui/ThemeProvider';
import { Colors } from '@/constants/Colors';

// ===================================================================
// NAVIGATION THEME TYPES
// ===================================================================

/**
 * Extended navigation theme interface
 */
interface NavigationTheme extends Theme {
  colors: Theme['colors'] & {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
}

// ===================================================================
// CUSTOM NAVIGATION THEMES
// ===================================================================

/**
 * Light theme configuration for navigation
 * Based on Material Design 3 principles
 */
const LightNavigationTheme: NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.surface,
    text: Colors.light.onSurface,
    border: Colors.light.outline,
    notification: Colors.light.error,
  },
} as const;

/**
 * Dark theme configuration for navigation
 * Based on Material Design 3 principles
 */
const DarkNavigationTheme: NavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.onSurface,
    border: Colors.dark.outline,
    notification: Colors.dark.error,
  },
} as const;

// ===================================================================
// FONT CONFIGURATION
// ===================================================================

/**
 * Font configuration for the application
 */
const FONT_CONFIG = {
  SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
} as const;

// ===================================================================
// ROOT LAYOUT CONTENT COMPONENT
// ===================================================================

/**
 * RootLayoutContent Component
 * 
 * Main application content with theme-aware navigation and routing.
 * Handles font loading and theme switching.
 * 
 * @returns Application content with themed navigation stack
 */
function RootLayoutContent(): React.JSX.Element | null {
  const colorScheme = useEnhancedColorScheme();
  const [fontsLoaded] = useFonts(FONT_CONFIG);

  // Wait for fonts to load in development
  if (!fontsLoaded) {
    return null;
  }

  // Select appropriate navigation theme
  const navigationTheme: NavigationTheme = colorScheme === 'dark' 
    ? DarkNavigationTheme 
    : LightNavigationTheme;

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack 
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        {/* Main Tab Navigation */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            title: 'Home'
          }} 
        />
        
        {/* Task Management */}
        <Stack.Screen 
          name="task-details/[id]" 
          options={{ 
            headerShown: false,
            title: 'Task Details',
            presentation: 'modal'
          }} 
        />
        
        {/* Visit Management */}
        <Stack.Screen 
          name="visit-details/[id]" 
          options={{ 
            headerShown: false,
            title: 'Visit Details'
          }} 
        />
        
        {/* Assessment Screens */}
        <Stack.Screen 
          name="visit-details/[id]/assessment" 
          options={{ 
            headerShown: false,
            title: 'Assessment Overview'
          }} 
        />
        <Stack.Screen 
          name="visit-details/[id]/assessment/vitals" 
          options={{ 
            headerShown: false,
            title: 'Vital Signs'
          }} 
        />
        <Stack.Screen 
          name="visit-details/[id]/assessment/pain" 
          options={{ 
            headerShown: false,
            title: 'Pain Assessment'
          }} 
        />
        <Stack.Screen 
          name="visit-details/[id]/assessment/medications" 
          options={{ 
            headerShown: false,
            title: 'Medications'
          }} 
        />
        <Stack.Screen 
          name="visit-details/[id]/assessment/interventions" 
          options={{ 
            headerShown: false,
            title: 'Interventions'
          }} 
        />
        <Stack.Screen 
          name="visit-details/[id]/assessment/family" 
          options={{ 
            headerShown: false,
            title: 'Family Assessment'
          }} 
        />
        <Stack.Screen 
          name="visit-details/[id]/assessment/notes" 
          options={{ 
            headerShown: false,
            title: 'Clinical Notes'
          }} 
        />
        
        {/* Patient Management */}
        <Stack.Screen 
          name="patients-list" 
          options={{ 
            headerShown: false,
            title: 'Patients List'
          }} 
        />
        
        {/* Error Boundary */}
        <Stack.Screen 
          name="+not-found" 
          options={{
            title: 'Page Not Found',
            presentation: 'modal'
          }}
        />
      </Stack>
      
      {/* Status Bar Configuration */}
      <StatusBar 
        style={colorScheme === 'dark' ? 'light' : 'dark'} 
        backgroundColor="transparent"
        translucent
      />
    </NavigationThemeProvider>
  );
}

// ===================================================================
// ROOT LAYOUT COMPONENT
// ===================================================================

/**
 * RootLayout Component
 * 
 * Application root with providers for theme management, safe area handling,
 * and navigation. Sets up the complete provider hierarchy.
 * 
 * @returns Application root with all necessary providers
 */
export default function RootLayout(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// ===================================================================
// TYPE EXPORTS
// ===================================================================

/**
 * Export types for external use
 */
export type { NavigationTheme };
