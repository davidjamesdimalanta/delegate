import { useCallback, useEffect, useState } from 'react'
import {
    createPatient,
    deletePatient,
    getAllPatients,
    getPatient,
    getPatientsByPriority,
    initializeDatabase,
    Patient,
    searchPatients,
    subscribeToPatients,
    updatePatient
} from '../lib/database'

export interface UsePatients {
  patients: Patient[]
  loading: boolean
  error: string | null
  refreshPatients: () => Promise<void>
  searchPatients: (query: string) => Promise<void>
  getPatientsByPriority: (priority: string) => Promise<void>
  createPatient: (patient: Omit<Patient, 'created_at' | 'updated_at'>) => Promise<boolean>
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<boolean>
  deletePatient: (id: string) => Promise<boolean>
  initialize: () => Promise<boolean>
}

export function usePatients(): UsePatients {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all patients
  const refreshPatients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await getAllPatients()
      
      if (error) {
        setError(error.message || 'Failed to fetch patients')
        console.error('Error fetching patients:', error)
      } else {
        setPatients(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error fetching patients:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Search patients
  const handleSearchPatients = useCallback(async (query: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await searchPatients(query)
      
      if (error) {
        setError(error.message || 'Failed to search patients')
        console.error('Error searching patients:', error)
      } else {
        setPatients(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error searching patients:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Get patients by priority
  const handleGetPatientsByPriority = useCallback(async (priority: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await getPatientsByPriority(priority)
      
      if (error) {
        setError(error.message || 'Failed to fetch patients by priority')
        console.error('Error fetching patients by priority:', error)
      } else {
        setPatients(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error fetching patients by priority:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create patient
  const handleCreatePatient = useCallback(async (patient: Omit<Patient, 'created_at' | 'updated_at'>): Promise<boolean> => {
    try {
      setError(null)
      
      const { data, error } = await createPatient(patient)
      
      if (error) {
        setError(error.message || 'Failed to create patient')
        console.error('Error creating patient:', error)
        return false
      } else {
        // Add the new patient to the local state
        if (data) {
          setPatients(prev => [data, ...prev])
        }
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error creating patient:', err)
      return false
    }
  }, [])

  // Update patient
  const handleUpdatePatient = useCallback(async (id: string, updates: Partial<Patient>): Promise<boolean> => {
    try {
      setError(null)
      
      const { data, error } = await updatePatient(id, updates)
      
      if (error) {
        setError(error.message || 'Failed to update patient')
        console.error('Error updating patient:', error)
        return false
      } else {
        // Update the patient in local state
        if (data) {
          setPatients(prev => prev.map(patient => 
            patient.id === id ? data : patient
          ))
        }
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error updating patient:', err)
      return false
    }
  }, [])

  // Delete patient
  const handleDeletePatient = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      const { error } = await deletePatient(id)
      
      if (error) {
        setError(error.message || 'Failed to delete patient')
        console.error('Error deleting patient:', error)
        return false
      } else {
        // Remove the patient from local state
        setPatients(prev => prev.filter(patient => patient.id !== id))
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error deleting patient:', err)
      return false
    }
  }, [])

  // Initialize database
  const initialize = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await initializeDatabase()
      
      if (result.success) {
        // Refresh the patients list after initialization
        await refreshPatients()
        return true
      } else {
        const errorMessage = result.error && typeof result.error === 'object' && 'message' in result.error 
          ? (result.error as any).message 
          : 'Failed to initialize database'
        setError(errorMessage)
        console.error('Error initializing database:', result.error)
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error initializing database:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [refreshPatients])

  // Set up real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToPatients((patients) => {
      console.log('Real-time update received, refreshing patients list')
      setPatients(patients)
    })

    return unsubscribe
  }, [])

  // Initial load
  useEffect(() => {
    initialize()
  }, [initialize])

  return {
    patients,
    loading,
    error,
    refreshPatients,
    searchPatients: handleSearchPatients,
    getPatientsByPriority: handleGetPatientsByPriority,
    createPatient: handleCreatePatient,
    updatePatient: handleUpdatePatient,
    deletePatient: handleDeletePatient,
    initialize
  }
}

// Hook for getting a single patient
export function usePatient(id: string) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPatient = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await getPatient(id)
      
      if (error) {
        setError(error.message || 'Failed to fetch patient')
        console.error('Error fetching patient:', error)
      } else {
        setPatient(data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error fetching patient:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchPatient()
  }, [fetchPatient])

  return {
    patient,
    loading,
    error,
    refreshPatient: fetchPatient
  }
} 