import { Spacing } from '@/components/ui'
import { useEnhancedColorScheme } from '@/components/ui/ThemeProvider'
import { Colors } from '@/constants/Colors'
import React from 'react'
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { usePatients } from '../hooks/usePatients'
import { Patient } from '../lib/database'

interface PatientItemProps {
  patient: Patient
  onPress: (patient: Patient) => void
  onUpdate: (id: string) => void
  onDelete: (id: string) => void
}

const PatientItem: React.FC<PatientItemProps> = ({ patient, onPress, onUpdate, onDelete }) => {
  const colorScheme = useEnhancedColorScheme()
  const theme = Colors[(colorScheme ?? 'light') as keyof typeof Colors]
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'imminent': return '#FF4444'
      case 'urgent-comfort': return '#FF8800'
      case 'urgent': return '#FFAA00'
      case 'symptom-care': return '#0088FF'
      case 'family-support': return '#00AA88'
      case 'psychosocial': return '#8800FF'
      case 'bereavement': return '#666666'
      default: return '#888888'
    }
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Patient',
      `Are you sure you want to delete ${patient.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete(patient.id)
        }
      ]
    )
  }

  return (
    <TouchableOpacity 
      style={[
        styles.patientItem, 
        { 
          backgroundColor: theme.surface,
          shadowColor: theme.outline,
        }
      ]} 
      onPress={() => onPress(patient)}
    >
      <View style={styles.patientHeader}>
        <Text style={[styles.patientName, { color: theme.onSurface }]}>{patient.name}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(patient.priority) }]}>
          <Text style={styles.priorityText}>{patient.priority}</Text>
        </View>
      </View>
      
      <Text style={[styles.condition, { color: theme.onSurfaceVariant }]}>{patient.condition}</Text>
      <Text style={[styles.vitals, { color: theme.outline }]}>{patient.vitals}</Text>
      
      {patient.age && (
        <Text style={[styles.details, { color: theme.outline }]}>Age: {patient.age}</Text>
      )}
      
      {patient.last_visit && (
        <Text style={[styles.details, { color: theme.outline }]}>Last Visit: {patient.last_visit}</Text>
      )}
      
      {patient.next_appointment && (
        <Text style={[styles.details, { color: theme.outline }]}>Next: {patient.next_appointment}</Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.primary }]} 
          onPress={() => onUpdate(patient.id)}
        >
          <Text style={[styles.actionButtonText, { color: theme.onPrimary }]}>Update</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={handleDelete}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

export const PatientsList: React.FC = () => {
  const colorScheme = useEnhancedColorScheme()
  const theme = Colors[(colorScheme ?? 'light') as keyof typeof Colors]
  
  const { 
    patients, 
    loading, 
    error, 
    refreshPatients, 
    updatePatient, 
    deletePatient 
  } = usePatients()

  const handlePatientPress = (patient: Patient) => {
    // Navigate to patient details or show modal
    Alert.alert('Patient Details', `Selected: ${patient.name}`)
  }

  const handleUpdate = async (id: string) => {
    // Example update - in a real app, you'd show a form
    const patient = patients.find(p => p.id === id)
    if (patient) {
      const success = await updatePatient(id, {
        vitals: `Updated at ${new Date().toLocaleTimeString()}`
      })
      
      if (success) {
        Alert.alert('Success', 'Patient updated successfully')
      }
    }
  }

  const handleDelete = async (id: string) => {
    const success = await deletePatient(id)
    
    if (success) {
      Alert.alert('Success', 'Patient deleted successfully')
    }
  }

  const renderPatient = ({ item }: { item: Patient }) => (
    <PatientItem
      patient={item}
      onPress={handlePatientPress}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  )

  if (loading && patients.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.onBackground }]}>Loading patients...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>Error: {error}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.primary }]} 
          onPress={refreshPatients}
        >
          <Text style={[styles.retryButtonText, { color: theme.onPrimary }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.onSurface, backgroundColor: theme.surface, borderBottomColor: theme.outline }]}>
        Patients ({patients.length})
      </Text>
      
      <FlatList
        data={patients}
        renderItem={renderPatient}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshPatients}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  listContainer: {
    padding: Spacing.md,
  },
  patientItem: {
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.lg,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  condition: {
    fontSize: 16,
    marginBottom: Spacing.xs,
  },
  vitals: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  details: {
    fontSize: 12,
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
  },
  deleteButton: {
    backgroundColor: '#FF4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.sm,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
})

export default PatientsList 