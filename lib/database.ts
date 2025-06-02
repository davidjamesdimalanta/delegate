import { supabase } from './supabase-minimal'

// Database Types (based on your sample patients data)
export type Database = {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          name: string
          priority: string
          address: string
          coordinates: {
            latitude: number
            longitude: number
          }
          vitals: string
          age: number | null
          condition: string
          last_visit: string | null
          next_appointment: string | null
          last_seen_by: {
            provider: string
            discipline: string
            date: string
            time: string
          } | null
          palliative_care: any
          family: any
          symptoms: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          priority: string
          address: string
          coordinates: {
            latitude: number
            longitude: number
          }
          vitals: string
          age?: number | null
          condition: string
          last_visit?: string | null
          next_appointment?: string | null
          last_seen_by?: {
            provider: string
            discipline: string
            date: string
            time: string
          } | null
          palliative_care?: any
          family?: any
          symptoms?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          priority?: string
          address?: string
          coordinates?: {
            latitude: number
            longitude: number
          }
          vitals?: string
          age?: number | null
          condition?: string
          last_visit?: string | null
          next_appointment?: string | null
          last_seen_by?: {
            provider: string
            discipline: string
            date: string
            time: string
          } | null
          palliative_care?: any
          family?: any
          symptoms?: any
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          due_time: string
          status: 'pending' | 'inProgress' | 'completed' | 'overdue' | 'cancelled'
          priority: 'critical' | 'high' | 'medium' | 'low' | 'symptom-care' | 'family-support' | 'goals-of-care'
          patient_id: string
          notes: string
          created_at: string
          updated_at: string
          created_by: string | null
          assigned_to: string | null
          completed_at: string | null
          estimated_duration: number | null
          actual_duration: number | null
          task_type: 'general' | 'medication' | 'vitals' | 'assessment' | 'discharge' | 'wound_care' | 'therapy' | 'emergency' | 'palliative'
          metadata: any
        }
        Insert: {
          id?: string
          title: string
          description: string
          due_time: string
          status?: 'pending' | 'inProgress' | 'completed' | 'overdue' | 'cancelled'
          priority?: 'critical' | 'high' | 'medium' | 'low' | 'symptom-care' | 'family-support' | 'goals-of-care'
          patient_id: string
          notes?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          estimated_duration?: number | null
          actual_duration?: number | null
          task_type?: 'general' | 'medication' | 'vitals' | 'assessment' | 'discharge' | 'wound_care' | 'therapy' | 'emergency' | 'palliative'
          metadata?: any
        }
        Update: {
          id?: string
          title?: string
          description?: string
          due_time?: string
          status?: 'pending' | 'inProgress' | 'completed' | 'overdue' | 'cancelled'
          priority?: 'critical' | 'high' | 'medium' | 'low' | 'symptom-care' | 'family-support' | 'goals-of-care'
          patient_id?: string
          notes?: string
          updated_at?: string
          created_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          estimated_duration?: number | null
          actual_duration?: number | null
          task_type?: 'general' | 'medication' | 'vitals' | 'assessment' | 'discharge' | 'wound_care' | 'therapy' | 'emergency' | 'palliative'
          metadata?: any
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Patient = Database['public']['Tables']['patients']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']

// Sample data for initial setup
export const samplePatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    priority: 'High',
    address: '123 Main St, Boston, MA',
    coordinates: { latitude: 42.3601, longitude: -71.0589 },
    vitals: 'BP: 140/90, HR: 88',
    age: 65,
    condition: 'Hypertension',
    last_visit: '2024-01-15',
    next_appointment: '2024-02-15',
    last_seen_by: {
      provider: 'Dr. Smith',
      discipline: 'Cardiology',
      date: '2024-01-15',
      time: '10:30 AM'
    },
    palliative_care: null,
    family: null,
    symptoms: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Add more sample patients as needed
]

// =============================================================================
// PATIENT FUNCTIONS
// =============================================================================

// Database functions
export async function initializeDatabase() {
  try {
    // Check if table exists and has data
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Error checking patients table:', error)
      return { success: false, error }
    }

    // If no patients exist, insert sample data
    if (!patients || patients.length === 0) {
      const { error: insertError } = await supabase
        .from('patients')
        .insert(samplePatients)

      if (insertError) {
        console.error('Error inserting sample data:', insertError)
        return { success: false, error: insertError }
      }

      console.log('Sample patients inserted successfully')
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Error initializing database:', error)
    return { success: false, error }
  }
}

export async function getAllPatients(): Promise<{ data: Patient[] | null, error: any }> {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })

    return { data: patients, error }
  } catch (error) {
    console.error('Error in getAllPatients:', error)
    return { data: null, error }
  }
}

export async function getPatient(id: string): Promise<{ data: Patient | null, error: any }> {
  try {
    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()

    return { data: patient, error }
  } catch (error) {
    console.error('Error in getPatient:', error)
    return { data: null, error }
  }
}

export async function createPatient(patient: Database['public']['Tables']['patients']['Insert']): Promise<{ data: Patient | null, error: any }> {
  try {
    const { data: newPatient, error } = await supabase
      .from('patients')
      .insert([patient])
      .select()
      .single()

    return { data: newPatient, error }
  } catch (error) {
    console.error('Error in createPatient:', error)
    return { data: null, error }
  }
}

export async function updatePatient(id: string, updates: Database['public']['Tables']['patients']['Update']): Promise<{ data: Patient | null, error: any }> {
  try {
    const { data: updatedPatient, error } = await supabase
      .from('patients')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    return { data: updatedPatient, error }
  } catch (error) {
    console.error('Error in updatePatient:', error)
    return { data: null, error }
  }
}

export async function deletePatient(id: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)

    return { error }
  } catch (error) {
    console.error('Error in deletePatient:', error)
    return { error }
  }
}

export async function searchPatients(query: string): Promise<{ data: Patient[] | null, error: any }> {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .or(`name.ilike.%${query}%, condition.ilike.%${query}%`)
      .order('updated_at', { ascending: false })

    return { data: patients, error }
  } catch (error) {
    console.error('Error in searchPatients:', error)
    return { data: null, error }
  }
}

export async function getPatientsByPriority(priority: string): Promise<{ data: Patient[] | null, error: any }> {
  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .eq('priority', priority)
      .order('updated_at', { ascending: false })

    return { data: patients, error }
  } catch (error) {
    console.error('Error in getPatientsByPriority:', error)
    return { data: null, error }
  }
}

// Since realtime is disabled, we'll use polling for subscriptions
export function subscribeToPatients(callback: (patients: Patient[]) => void) {
  console.log('Setting up patients polling (realtime disabled)')
  
  // Poll every 30 seconds for updates
  const interval = setInterval(async () => {
    try {
      const { data: patients } = await getAllPatients()
      if (patients) {
        callback(patients)
      }
    } catch (error) {
      console.error('Error polling patients:', error)
    }
  }, 30000) // 30 seconds

  // Return cleanup function
  return () => {
    clearInterval(interval)
  }
}

// =============================================================================
// TASK FUNCTIONS
// =============================================================================

export async function getAllTasks(): Promise<{ data: Task[] | null, error: any }> {
  try {
    console.log('=== getAllTasks DEBUG ===');
    console.log('Attempting to fetch tasks from database...');
    
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('Database response:');
    console.log('- Data:', tasks);
    console.log('- Error:', error);
    console.log('- Tasks count:', tasks?.length || 0);
    console.log('========================');

    return { data: tasks, error }
  } catch (error) {
    console.error('Error in getAllTasks:', error)
    return { data: null, error }
  }
}

export async function getTask(id: string): Promise<{ data: Task | null, error: any }> {
  try {
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single()

    return { data: task, error }
  } catch (error) {
    console.error('Error in getTask:', error)
    return { data: null, error }
  }
}

export async function getTasksByPatient(patientId: string): Promise<{ data: Task[] | null, error: any }> {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    return { data: tasks, error }
  } catch (error) {
    console.error('Error in getTasksByPatient:', error)
    return { data: null, error }
  }
}

export async function getTasksByStatus(status: Task['status']): Promise<{ data: Task[] | null, error: any }> {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    return { data: tasks, error }
  } catch (error) {
    console.error('Error in getTasksByStatus:', error)
    return { data: null, error }
  }
}

export async function getTasksByPriority(priority: Task['priority']): Promise<{ data: Task[] | null, error: any }> {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('priority', priority)
      .order('created_at', { ascending: false })

    return { data: tasks, error }
  } catch (error) {
    console.error('Error in getTasksByPriority:', error)
    return { data: null, error }
  }
}

export async function createTask(task: Database['public']['Tables']['tasks']['Insert']): Promise<{ data: Task | null, error: any }> {
  try {
    const { data: newTask, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single()

    return { data: newTask, error }
  } catch (error) {
    console.error('Error in createTask:', error)
    return { data: null, error }
  }
}

export async function updateTask(id: string, updates: Database['public']['Tables']['tasks']['Update']): Promise<{ data: Task | null, error: any }> {
  try {
    const { data: updatedTask, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    return { data: updatedTask, error }
  } catch (error) {
    console.error('Error in updateTask:', error)
    return { data: null, error }
  }
}

export async function deleteTask(id: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    return { error }
  } catch (error) {
    console.error('Error in deleteTask:', error)
    return { error }
  }
}

export async function searchTasks(query: string): Promise<{ data: Task[] | null, error: any }> {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
      .order('updated_at', { ascending: false })

    return { data: tasks, error }
  } catch (error) {
    console.error('Error in searchTasks:', error)
    return { data: null, error }
  }
}

// Since realtime is disabled, we'll use polling for subscriptions
export function subscribeToTasks(callback: (tasks: Task[]) => void) {
  console.log('Setting up tasks polling (realtime disabled)')
  
  // Poll every 30 seconds for updates
  const interval = setInterval(async () => {
    try {
      const { data: tasks } = await getAllTasks()
      if (tasks) {
        callback(tasks)
      }
    } catch (error) {
      console.error('Error polling tasks:', error)
    }
  }, 30000) // 30 seconds

  // Return cleanup function
  return () => {
    clearInterval(interval)
  }
}

// Add this function to check tasks table
export async function debugTasksTable() {
  console.log('=== DEBUGGING TASKS TABLE ===');
  
  try {
    // Try to get table info
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Error accessing tasks table:', error);
      console.log('Error details:', JSON.stringify(error, null, 2));
      
      if (error.message?.includes('relation "tasks" does not exist')) {
        console.log('🚨 ISSUE: Tasks table does not exist!');
        console.log('💡 SOLUTION: Run the CREATE TABLE SQL for tasks in Supabase');
      }
    } else {
      console.log('✅ Tasks table exists');
      console.log('Sample data:', data);
      
      // Get total count
      const { count, error: countError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
      
      if (countError) {
        console.log('Error getting count:', countError);
      } else {
        console.log(`📊 Total tasks in database: ${count}`);
      }
    }
  } catch (err) {
    console.log('❌ Unexpected error:', err);
  }
  
  console.log('============================');
} 