import { PatientsList } from '@/components/PatientsList'
import { useEnhancedColorScheme } from '@/components/ui/ThemeProvider'
import { Colors } from '@/constants/Colors'
import { Stack } from 'expo-router'
import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'

export default function PatientsListScreen() {
  const colorScheme = useEnhancedColorScheme()
  const theme = Colors[(colorScheme ?? 'light') as keyof typeof Colors]

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: 'All Patients',
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.surface,
          },
          headerTintColor: theme.onSurface,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }} 
      />
      <PatientsList />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}) 