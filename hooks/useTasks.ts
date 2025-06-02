import { useCallback, useEffect, useState } from 'react'
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  getTasksByPatient,
  getTasksByPriority,
  getTasksByStatus,
  searchTasks,
  subscribeToTasks,
  Task,
  updateTask
} from '../lib/database'

export interface UseTasks {
  tasks: Task[]
  loading: boolean
  error: string | null
  refreshTasks: () => Promise<void>
  searchTasks: (query: string) => Promise<void>
  getTasksByStatus: (status: Task['status']) => Promise<void>
  getTasksByPriority: (priority: Task['priority']) => Promise<void>
  getTasksByPatient: (patientId: string) => Promise<void>
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>
  updateTask: (id: string, updates: Partial<Task>) => Promise<boolean>
  deleteTask: (id: string) => Promise<boolean>
}

export function useTasks(): UseTasks {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all tasks
  const refreshTasks = useCallback(async () => {
    try {
      console.log('🔄 useTasks: Starting refreshTasks...');
      setLoading(true)
      setError(null)
      
      const { data, error } = await getAllTasks()
      
      if (error) {
        const errorMessage = error.message || 'Failed to fetch tasks'
        setError(errorMessage)
        console.error('❌ useTasks: Error fetching tasks:', error)
      } else {
        console.log('✅ useTasks: Successfully fetched tasks:', data?.length || 0);
        setTasks(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('❌ useTasks: Unexpected error fetching tasks:', err)
    } finally {
      setLoading(false)
      console.log('🔄 useTasks: refreshTasks completed');
    }
  }, [])

  // Search tasks
  const handleSearchTasks = useCallback(async (query: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await searchTasks(query)
      
      if (error) {
        setError(error.message || 'Failed to search tasks')
        console.error('Error searching tasks:', error)
      } else {
        setTasks(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error searching tasks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Get tasks by status
  const handleGetTasksByStatus = useCallback(async (status: Task['status']) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await getTasksByStatus(status)
      
      if (error) {
        setError(error.message || 'Failed to fetch tasks by status')
        console.error('Error fetching tasks by status:', error)
      } else {
        setTasks(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error fetching tasks by status:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Get tasks by priority
  const handleGetTasksByPriority = useCallback(async (priority: Task['priority']) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await getTasksByPriority(priority)
      
      if (error) {
        setError(error.message || 'Failed to fetch tasks by priority')
        console.error('Error fetching tasks by priority:', error)
      } else {
        setTasks(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error fetching tasks by priority:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Get tasks by patient
  const handleGetTasksByPatient = useCallback(async (patientId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await getTasksByPatient(patientId)
      
      if (error) {
        setError(error.message || 'Failed to fetch tasks by patient')
        console.error('Error fetching tasks by patient:', error)
      } else {
        setTasks(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error fetching tasks by patient:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create task
  const handleCreateTask = useCallback(async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    try {
      setError(null)
      
      const { data, error } = await createTask(task)
      
      if (error) {
        setError(error.message || 'Failed to create task')
        console.error('Error creating task:', error)
        return false
      } else {
        // Add the new task to the local state
        if (data) {
          setTasks(prev => [data, ...prev])
        }
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error creating task:', err)
      return false
    }
  }, [])

  // Update task
  const handleUpdateTask = useCallback(async (id: string, updates: Partial<Task>): Promise<boolean> => {
    try {
      setError(null)
      
      const { data, error } = await updateTask(id, updates)
      
      if (error) {
        setError(error.message || 'Failed to update task')
        console.error('Error updating task:', error)
        return false
      } else {
        // Update the task in local state
        if (data) {
          setTasks(prev => prev.map(task => task.id === id ? data : task))
        }
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error updating task:', err)
      return false
    }
  }, [])

  // Delete task
  const handleDeleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      const { error } = await deleteTask(id)
      
      if (error) {
        setError(error.message || 'Failed to delete task')
        console.error('Error deleting task:', error)
        return false
      } else {
        // Remove the task from local state
        setTasks(prev => prev.filter(task => task.id !== id))
        return true
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Unexpected error deleting task:', err)
      return false
    }
  }, [])

  // Set up polling subscription (since realtime is disabled)
  useEffect(() => {
    const unsubscribe = subscribeToTasks((tasks: Task[]) => {
      console.log('Polling update received, refreshing tasks list')
      setTasks(tasks)
    })

    return unsubscribe
  }, [])

  // Initial load with debugging
  useEffect(() => {
    console.log('🚀 useTasks: Initial load starting...');
    refreshTasks()
  }, [refreshTasks])

  return {
    tasks,
    loading,
    error,
    refreshTasks,
    searchTasks: handleSearchTasks,
    getTasksByStatus: handleGetTasksByStatus,
    getTasksByPriority: handleGetTasksByPriority,
    getTasksByPatient: handleGetTasksByPatient,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask
  }
}

export function useTask(id: string) {
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await getTask(id)
        
        if (error) {
          setError(error.message || 'Failed to fetch task')
          console.error('Error fetching task:', error)
        } else {
          setTask(data)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('Unexpected error fetching task:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTask()
    }
  }, [id])

  return { task, loading, error }
} 