import { useCallback, useEffect, useState } from 'react'
import {
    addNursingIntervention,
    addVitalSigns,
    completeVisit,
    createVisit,
    getAllVisits,
    getNurseSchedule,
    getNursingInterventions,
    getNursingMetrics,
    getVisit,
    searchVisits,
    startVisit,
    updateVisit,
} from '../lib/database-visits'
import {
    NursingIntervention,
    Visit,
    VitalSigns
} from '../lib/types/nursing-types'

export interface UseVisits {
  visits: Visit[]
  loading: boolean
  error: string | null
  refreshVisits: () => Promise<void>
  searchVisits: (query: string) => Promise<void>
  getVisitsByStatus: (status: Visit['status']) => Promise<void>
  getVisitsByPriority: (priority: Visit['priority']) => Promise<void>
  getVisitsByPatient: (patientId: string) => Promise<void>
  getVisitsByNurse: (nurseId: string, date?: string) => Promise<void>
  createVisit: (visit: Partial<Visit>) => Promise<boolean>
  updateVisit: (id: string, updates: Partial<Visit>) => Promise<boolean>
  startVisit: (visitId: string, nurseId: string) => Promise<boolean>
  completeVisit: (visitId: string, completionData?: any) => Promise<boolean>
  addVitalSigns: (visitId: string, patientId: string, vitalSigns: VitalSigns, nurseId: string) => Promise<boolean>
  addNursingIntervention: (intervention: Partial<NursingIntervention>) => Promise<boolean>
}

export function useVisits(): UseVisits {
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all visits
  const refreshVisits = useCallback(async () => {
    try {
      console.log('🔄 useVisits: Starting refreshVisits...');
      setLoading(true)
      setError(null)
      
      const { data, error } = await getAllVisits()
      
      if (error) {
        const errorMessage = error || 'Failed to fetch visits'
        setError(errorMessage)
        console.error('❌ useVisits: Error fetching visits:', error)
      } else {
        console.log('✅ useVisits: Successfully fetched visits:', data?.length || 0);
        setVisits(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('❌ useVisits: Unexpected error fetching visits:', err)
    } finally {
      setLoading(false)
      console.log('🔄 useVisits: refreshVisits completed');
    }
  }, [])

  // Search visits
  const handleSearchVisits = useCallback(async (query: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await searchVisits(query)
      
      if (error) {
        setError(error || 'Failed to search visits')
        console.error('Error searching visits:', error)
      } else {
        setVisits(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error searching visits:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Get visits by status
  const handleGetVisitsByStatus = useCallback(async (status: Visit['status']) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await getAllVisits({ status })
      
      if (error) {
        setError(error || 'Failed to fetch visits by status')
        console.error('Error fetching visits by status:', error)
      } else {
        setVisits(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error fetching visits by status:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Get visits by priority
  const handleGetVisitsByPriority = useCallback(async (priority: Visit['priority']) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await getAllVisits({ priority })
      
      if (error) {
        setError(error || 'Failed to fetch visits by priority')
        console.error('Error fetching visits by priority:', error)
      } else {
        setVisits(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error fetching visits by priority:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Get visits by patient
  const handleGetVisitsByPatient = useCallback(async (patientId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await getAllVisits({ patientId })
      
      if (error) {
        setError(error || 'Failed to fetch visits by patient')
        console.error('Error fetching visits by patient:', error)
      } else {
        setVisits(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error fetching visits by patient:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Get visits by nurse (nurse schedule)
  const handleGetVisitsByNurse = useCallback(async (nurseId: string, date?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await getNurseSchedule(nurseId, date)
      
      if (error) {
        setError(error || 'Failed to fetch nurse schedule')
        console.error('Error fetching nurse schedule:', error)
      } else {
        setVisits(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error fetching nurse schedule:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create visit
  const handleCreateVisit = useCallback(async (visit: Partial<Visit>): Promise<boolean> => {
    try {
      setError(null)
      
      const { data, error } = await createVisit(visit)
      
      if (error) {
        setError(error || 'Failed to create visit')
        console.error('Error creating visit:', error)
        return false
      } else {
        // Add the new visit to the local state
        if (data) {
          setVisits(prev => [data, ...prev])
        }
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error creating visit:', err)
      return false
    }
  }, [])

  // Update visit
  const handleUpdateVisit = useCallback(async (id: string, updates: Partial<Visit>): Promise<boolean> => {
    try {
      setError(null)
      
      const { data, error } = await updateVisit(id, updates)
      
      if (error) {
        setError(error || 'Failed to update visit')
        console.error('Error updating visit:', error)
        return false
      } else {
        // Update the visit in local state
        if (data) {
          setVisits(prev => prev.map(visit => visit.id === id ? data : visit))
        }
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error updating visit:', err)
      return false
    }
  }, [])

  // Start visit
  const handleStartVisit = useCallback(async (visitId: string, nurseId: string): Promise<boolean> => {
    try {
      setError(null)
      
      const { data, error } = await startVisit(visitId, nurseId)
      
      if (error) {
        setError(error || 'Failed to start visit')
        console.error('Error starting visit:', error)
        return false
      } else {
        // Update the visit in local state
        if (data) {
          setVisits(prev => prev.map(visit => visit.id === visitId ? data : visit))
        }
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error starting visit:', err)
      return false
    }
  }, [])

  // Complete visit
  const handleCompleteVisit = useCallback(async (visitId: string, completionData?: any): Promise<boolean> => {
    try {
      setError(null)
      
      const { data, error } = await completeVisit(visitId, completionData)
      
      if (error) {
        setError(error || 'Failed to complete visit')
        console.error('Error completing visit:', error)
        return false
      } else {
        // Update the visit in local state
        if (data) {
          setVisits(prev => prev.map(visit => visit.id === visitId ? data : visit))
        }
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error completing visit:', err)
      return false
    }
  }, [])

  // Add vital signs
  const handleAddVitalSigns = useCallback(async (
    visitId: string, 
    patientId: string, 
    vitalSigns: VitalSigns, 
    nurseId: string
  ): Promise<boolean> => {
    try {
      setError(null)
      
      const { data, error } = await addVitalSigns(visitId, patientId, vitalSigns, nurseId)
      
      if (error) {
        setError(error || 'Failed to add vital signs')
        console.error('Error adding vital signs:', error)
        return false
      } else {
        // Update the visit in local state with new vital signs
        if (data?.visit) {
          setVisits(prev => prev.map(visit => visit.id === visitId ? data.visit : visit))
        }
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error adding vital signs:', err)
      return false
    }
  }, [])

  // Add nursing intervention
  const handleAddNursingIntervention = useCallback(async (intervention: Partial<NursingIntervention>): Promise<boolean> => {
    try {
      setError(null)
      
      const { data, error } = await addNursingIntervention(intervention)
      
      if (error) {
        setError(error || 'Failed to add nursing intervention')
        console.error('Error adding nursing intervention:', error)
        return false
      } else {
        // Intervention added successfully
        console.log('✅ Nursing intervention added:', data)
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error adding nursing intervention:', err)
      return false
    }
  }, [])

  // Initialize visits on mount
  useEffect(() => {
    console.log('🚀 useVisits: Hook mounted, fetching initial visits...');
    refreshVisits();
  }, [refreshVisits])

  return {
    visits,
    loading,
    error,
    refreshVisits,
    searchVisits: handleSearchVisits,
    getVisitsByStatus: handleGetVisitsByStatus,
    getVisitsByPriority: handleGetVisitsByPriority,
    getVisitsByPatient: handleGetVisitsByPatient,
    getVisitsByNurse: handleGetVisitsByNurse,
    createVisit: handleCreateVisit,
    updateVisit: handleUpdateVisit,
    startVisit: handleStartVisit,
    completeVisit: handleCompleteVisit,
    addVitalSigns: handleAddVitalSigns,
    addNursingIntervention: handleAddNursingIntervention,
  }
}

// Hook for single visit
export function useVisit(id: string) {
  const [visit, setVisit] = useState<Visit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVisit = useCallback(async () => {
    if (!id) {
      setLoading(false)
      return
    }

    try {
      console.log(`🔍 useVisit: Fetching visit ${id}...`);
      setLoading(true)
      setError(null)
      
      const { data, error } = await getVisit(id)
      
      if (error) {
        setError(error || 'Failed to fetch visit')
        console.error('Error fetching visit:', error)
      } else {
        console.log('✅ useVisit: Successfully fetched visit:', data);
        setVisit(data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error fetching visit:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchVisit()
  }, [fetchVisit])

  return { visit, loading, error, refetch: fetchVisit }
}

// Hook for nursing interventions
export function useNursingInterventions(visitId: string) {
  const [interventions, setInterventions] = useState<NursingIntervention[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInterventions = useCallback(async () => {
    if (!visitId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await getNursingInterventions(visitId)
      
      if (error) {
        setError(error || 'Failed to fetch nursing interventions')
        console.error('Error fetching nursing interventions:', error)
      } else {
        setInterventions(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error fetching nursing interventions:', err)
    } finally {
      setLoading(false)
    }
  }, [visitId])

  useEffect(() => {
    fetchInterventions()
  }, [fetchInterventions])

  return { interventions, loading, error, refetch: fetchInterventions }
}

// Hook for nursing metrics
export function useNursingMetrics(nurseId?: string, startDate?: string, endDate?: string) {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await getNursingMetrics(nurseId, startDate, endDate)
      
      if (error) {
        setError(error || 'Failed to fetch nursing metrics')
        console.error('Error fetching nursing metrics:', error)
      } else {
        setMetrics(data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error fetching nursing metrics:', err)
    } finally {
      setLoading(false)
    }
  }, [nurseId, startDate, endDate])

  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  return { metrics, loading, error, refetch: fetchMetrics }
} 