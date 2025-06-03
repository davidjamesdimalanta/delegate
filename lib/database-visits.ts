import { supabase } from './supabase-minimal';
import {
    EnhancedPatient,
    NursingIntervention,
    NursingMetricsResponse,
    Visit,
    VisitResponse,
    VisitsResponse,
    VitalSigns
} from './types/nursing-types';

// Enhanced Database Types for Visits
export type Database = {
  public: {
    Tables: {
      patients: {
        Row: EnhancedPatient;
        Insert: Partial<EnhancedPatient>;
        Update: Partial<EnhancedPatient>;
      };
      visits: {
        Row: Visit;
        Insert: Partial<Visit>;
        Update: Partial<Visit>;
      };
      nursing_interventions: {
        Row: NursingIntervention;
        Insert: Partial<NursingIntervention>;
        Update: Partial<NursingIntervention>;
      };
      vital_signs: {
        Row: {
          id: string;
          visit_id: string;
          patient_id: string;
          measured_at: string;
          measured_by: string;
          temperature?: number;
          temperature_unit?: 'F' | 'C';
          temperature_site?: string;
          blood_pressure_systolic?: number;
          blood_pressure_diastolic?: number;
          blood_pressure_position?: string;
          heart_rate?: number;
          heart_rhythm?: string;
          respiratory_rate?: number;
          respiratory_character?: string;
          oxygen_saturation?: number;
          oxygen_support?: string;
          oxygen_flow_rate?: number;
          weight?: number;
          weight_unit?: 'kg' | 'lbs';
          pain_level?: number;
          neurological_status?: string;
          skin_color?: string;
          edema_location?: string[];
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['vital_signs']['Row']>;
        Update: Partial<Database['public']['Tables']['vital_signs']['Row']>;
      };
      wound_assessments: {
        Row: {
          id: string;
          visit_id: string;
          patient_id: string;
          assessed_at: string;
          assessed_by: string;
          wound_identifier: string;
          wound_location: string;
          wound_type?: string;
          stage_grade?: string;
          length_cm?: number;
          width_cm?: number;
          depth_cm?: number;
          wound_bed_description?: string;
          drainage_amount?: string;
          drainage_type?: string;
          surrounding_skin_condition?: string;
          odor_present?: boolean;
          treatment_provided?: string;
          dressing_type?: string;
          next_dressing_change?: string;
          healing_progress?: string;
          infection_signs?: boolean;
          photo_documentation?: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['wound_assessments']['Row']>;
        Update: Partial<Database['public']['Tables']['wound_assessments']['Row']>;
      };
      medication_effectiveness: {
        Row: {
          id: string;
          visit_id: string;
          patient_id: string;
          medication_name: string;
          dosage: string;
          route: string;
          indication: string;
          administered_at: string;
          administered_by: string;
          pre_assessment: Record<string, any>;
          post_assessment?: Record<string, any>;
          assessment_time_minutes?: number;
          effectiveness_rating?: number;
          side_effects?: string[];
          duration_of_effect_hours?: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['medication_effectiveness']['Row']>;
        Update: Partial<Database['public']['Tables']['medication_effectiveness']['Row']>;
      };
    };
    Views: {
      nursing_workload: {
        Row: {
          nurse_id: string;
          scheduled_visits: number;
          active_visits: number;
          completed_today: number;
          avg_visit_duration: number;
        };
      };
      patient_visit_history: {
        Row: {
          patient_id: string;
          name: string;
          total_visits: number;
          last_visit_date: string;
          avg_pain_level: number;
          completed_visits: number;
          missed_visits: number;
        };
      };
      medication_effectiveness_summary: {
        Row: {
          medication_name: string;
          times_administered: number;
          avg_effectiveness: number;
          side_effect_incidents: number;
          avg_duration_hours: number;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// =============================================================================
// VISIT FUNCTIONS (Enhanced from Task Functions)
// =============================================================================

/**
 * Initialize the visits database with sample data if empty
 */
export async function initializeVisitsDatabase(): Promise<{ error: any }> {
  try {
    // Check if visits table exists and has data
    const { data: visits, error } = await supabase
      .from('visits')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error checking visits table:', error);
      return { error: error.message };
    }

    // If no visits exist, we could populate with sample data
    if (!visits || visits.length === 0) {
      console.log('Visits table is empty - ready for data entry');
    }

    return { error: null };
  } catch (error) {
    console.error('Error initializing visits database:', error);
    return { error: 'Failed to initialize visits database' };
  }
}

/**
 * Get all visits with optional filtering
 */
export async function getAllVisits(filters?: {
  status?: Visit['status'];
  priority?: Visit['priority'];
  nurseId?: string;
  patientId?: string;
  visitType?: Visit['visitType'];
  date?: string; // ISO date string for filtering by date
}): Promise<VisitsResponse> {
  try {
    let query = supabase
      .from('visits')
      .select('*');

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.nurseId) {
      query = query.eq('nurse_id', filters.nurseId);
    }
    if (filters?.patientId) {
      query = query.eq('patient_id', filters.patientId);
    }
    if (filters?.visitType) {
      query = query.eq('visit_type', filters.visitType);
    }
    if (filters?.date) {
      const startOfDay = new Date(filters.date).toISOString().split('T')[0] + 'T00:00:00.000Z';
      const endOfDay = new Date(filters.date).toISOString().split('T')[0] + 'T23:59:59.999Z';
      query = query.gte('scheduled_time', startOfDay).lte('scheduled_time', endOfDay);
    }

    const { data, error } = await query.order('scheduled_time', { ascending: true });

    if (error) {
      console.error('Error fetching visits:', error);
      return { data: null, error: error.message };
    }

    // Map all visits from database format to TypeScript format
    const mappedVisits = data ? data.map(mapDatabaseVisitToTypeScript) : [];

    return { data: mappedVisits, error: null };
  } catch (error) {
    console.error('Error in getAllVisits:', error);
    return { data: null, error: 'Failed to fetch visits' };
  }
}

/**
 * Get a single visit by ID
 */
export async function getVisit(id: string): Promise<VisitResponse> {
  try {
    console.log(`🔍 getVisit: Fetching visit with ID: ${id}`);
    
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ getVisit: Error fetching visit:', error);
      return { data: null, error: error.message };
    }

    if (!data) {
      console.error('❌ getVisit: No visit found with ID:', id);
      return { data: null, error: 'Visit not found' };
    }

    console.log('📋 getVisit: Raw database data:', data);
    
    // Map database fields to TypeScript interface
    const mappedVisit = mapDatabaseVisitToTypeScript(data);
    
    console.log('✅ getVisit: Mapped visit data:', mappedVisit);
    console.log(`✅ getVisit: Patient ID extracted: ${mappedVisit.patientId}`);

    return { data: mappedVisit, error: null };
  } catch (error) {
    console.error('💥 getVisit: Unexpected error:', error);
    return { data: null, error: 'Failed to fetch visit' };
  }
}

/**
 * Create a new visit
 */
export async function createVisit(visit: Partial<Visit>): Promise<VisitResponse> {
  try {
    const { data, error } = await supabase
      .from('visits')
      .insert([{
        ...visit,
        status: visit.status || 'scheduled',
        priority: visit.priority || 'routine',
        visit_type: visit.visitType || 'routine',
        estimated_duration_minutes: visit.estimatedDurationMinutes || 60,
        documentation_complete: false,
        supervisor_review_required: false,
        visit_notes: visit.visitNotes || '',
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating visit:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Visit, error: null };
  } catch (error) {
    console.error('Error in createVisit:', error);
    return { data: null, error: 'Failed to create visit' };
  }
}

/**
 * Update a visit with nursing assessment data
 */
export async function updateVisit(id: string, updates: Partial<Visit>): Promise<VisitResponse> {
  try {
    const { data, error } = await supabase
      .from('visits')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating visit:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Visit, error: null };
  } catch (error) {
    console.error('Error in updateVisit:', error);
    return { data: null, error: 'Failed to update visit' };
  }
}

/**
 * Start a visit (mark as in-progress)
 */
export async function startVisit(visitId: string, nurseId: string): Promise<VisitResponse> {
  try {
    const { data, error } = await supabase
      .from('visits')
      .update({
        status: 'in-progress',
        actual_start_time: new Date().toISOString(),
        nurse_id: nurseId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', visitId)
      .select()
      .single();

    if (error) {
      console.error('Error starting visit:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Visit, error: null };
  } catch (error) {
    console.error('Error in startVisit:', error);
    return { data: null, error: 'Failed to start visit' };
  }
}

/**
 * Complete a visit
 */
export async function completeVisit(visitId: string, completionData?: {
  visitNotes?: string;
  qualityMetrics?: Visit['qualityMetrics'];
  careCoordination?: Visit['careCoordination'];
}): Promise<VisitResponse> {
  try {
    const endTime = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('visits')
      .update({
        status: 'completed',
        actual_end_time: endTime,
        completed_at: endTime,
        visit_notes: completionData?.visitNotes,
        quality_metrics: completionData?.qualityMetrics,
        care_coordination: completionData?.careCoordination,
        documentation_complete: true,
        updated_at: endTime,
      })
      .eq('id', visitId)
      .select()
      .single();

    if (error) {
      console.error('Error completing visit:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Visit, error: null };
  } catch (error) {
    console.error('Error in completeVisit:', error);
    return { data: null, error: 'Failed to complete visit' };
  }
}

// =============================================================================
// NURSING ASSESSMENT FUNCTIONS
// =============================================================================

/**
 * Add vital signs to a visit
 */
export async function addVitalSigns(
  visitId: string, 
  patientId: string, 
  vitalSigns: VitalSigns, 
  nurseId: string
): Promise<{ data: any; error: any }> {
  try {
    // Insert into vital_signs table
    const { data: vitalSignsData, error: vitalError } = await supabase
      .from('vital_signs')
      .insert([{
        visit_id: visitId,
        patient_id: patientId,
        measured_at: new Date().toISOString(),
        measured_by: nurseId,
        temperature: vitalSigns.temperature?.value,
        temperature_unit: vitalSigns.temperature?.unit,
        temperature_site: vitalSigns.temperature?.site,
        blood_pressure_systolic: vitalSigns.bloodPressure?.systolic,
        blood_pressure_diastolic: vitalSigns.bloodPressure?.diastolic,
        blood_pressure_position: vitalSigns.bloodPressure?.position,
        heart_rate: vitalSigns.heartRate?.value,
        heart_rhythm: vitalSigns.heartRate?.rhythm,
        respiratory_rate: vitalSigns.respiratoryRate?.value,
        respiratory_character: vitalSigns.respiratoryRate?.character,
        oxygen_saturation: vitalSigns.oxygenSaturation?.value,
        oxygen_support: vitalSigns.oxygenSaturation?.oxygenSupport,
        oxygen_flow_rate: vitalSigns.oxygenSaturation?.flowRate,
        weight: vitalSigns.weight?.value,
        weight_unit: vitalSigns.weight?.unit,
        pain_level: vitalSigns.painLevel,
      }])
      .select()
      .single();

    if (vitalError) {
      console.error('Error adding vital signs:', vitalError);
      return { data: null, error: vitalError.message };
    }

    // Update the visit with vital signs data
    const { data: visitData, error: visitError } = await supabase
      .from('visits')
      .update({
        vital_signs: vitalSigns,
        updated_at: new Date().toISOString(),
      })
      .eq('id', visitId)
      .select()
      .single();

    if (visitError) {
      console.error('Error updating visit with vital signs:', visitError);
      return { data: null, error: visitError.message };
    }

    return { data: { vitalSigns: vitalSignsData, visit: visitData }, error: null };
  } catch (error) {
    console.error('Error in addVitalSigns:', error);
    return { data: null, error: 'Failed to add vital signs' };
  }
}

/**
 * Add nursing intervention
 */
export async function addNursingIntervention(intervention: Partial<NursingIntervention>): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from('nursing_interventions')
      .insert([{
        ...intervention,
        performed_at: intervention.performedAt || new Date().toISOString(),
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding nursing intervention:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in addNursingIntervention:', error);
    return { data: null, error: 'Failed to add nursing intervention' };
  }
}

/**
 * Get nursing interventions for a visit
 */
export async function getNursingInterventions(visitId: string): Promise<{ data: NursingIntervention[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('nursing_interventions')
      .select('*')
      .eq('visit_id', visitId)
      .order('performed_at', { ascending: false });

    if (error) {
      console.error('Error fetching nursing interventions:', error);
      return { data: null, error: error.message };
    }

    return { data: data as NursingIntervention[], error: null };
  } catch (error) {
    console.error('Error in getNursingInterventions:', error);
    return { data: null, error: 'Failed to fetch nursing interventions' };
  }
}

/**
 * Get visits for a specific nurse (today's schedule)
 */
export async function getNurseSchedule(nurseId: string, date?: string): Promise<VisitsResponse> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  return getAllVisits({
    nurseId,
    date: targetDate,
  });
}

/**
 * Get nursing workload metrics
 */
export async function getNursingWorkload(nurseId?: string): Promise<{ data: any; error: any }> {
  try {
    let query = supabase.from('nursing_workload').select('*');
    
    if (nurseId) {
      query = query.eq('nurse_id', nurseId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching nursing workload:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getNursingWorkload:', error);
    return { data: null, error: 'Failed to fetch nursing workload' };
  }
}

/**
 * Get patient visit history and trends
 */
export async function getPatientVisitHistory(patientId: string): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from('patient_visit_history')
      .select('*')
      .eq('patient_id', patientId)
      .single();

    if (error) {
      console.error('Error fetching patient visit history:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getPatientVisitHistory:', error);
    return { data: null, error: 'Failed to fetch patient visit history' };
  }
}

/**
 * Get medication effectiveness data
 */
export async function getMedicationEffectiveness(medicationName?: string): Promise<{ data: any; error: any }> {
  try {
    let query = supabase.from('medication_effectiveness_summary').select('*');
    
    if (medicationName) {
      query = query.eq('medication_name', medicationName);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching medication effectiveness:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getMedicationEffectiveness:', error);
    return { data: null, error: 'Failed to fetch medication effectiveness' };
  }
}

/**
 * Search visits by patient name, visit type, or notes
 */
export async function searchVisits(query: string): Promise<VisitsResponse> {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        patients!inner(name)
      `)
      .or(`title.ilike.%${query}%, description.ilike.%${query}%, visit_notes.ilike.%${query}%, patients.name.ilike.%${query}%`)
      .order('scheduled_time', { ascending: false });

    if (error) {
      console.error('Error searching visits:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Visit[], error: null };
  } catch (error) {
    console.error('Error in searchVisits:', error);
    return { data: null, error: 'Failed to search visits' };
  }
}

/**
 * Get nursing quality metrics for reporting
 */
export async function getNursingMetrics(
  nurseId?: string, 
  startDate?: string, 
  endDate?: string
): Promise<NursingMetricsResponse> {
  try {
    // Build the query based on filters
    let query = supabase
      .from('visits')
      .select(`
        id,
        actual_duration_minutes,
        quality_metrics,
        pain_assessment,
        medications_administered,
        status
      `)
      .eq('status', 'completed');

    if (nurseId) {
      query = query.eq('nurse_id', nurseId);
    }

    if (startDate) {
      query = query.gte('completed_at', startDate);
    }

    if (endDate) {
      query = query.lte('completed_at', endDate);
    }

    const { data: visits, error } = await query;

    if (error) {
      console.error('Error fetching nursing metrics:', error);
      return { data: null, error: error.message };
    }

    // Calculate metrics from the data
    const visitCount = visits?.length || 0;
    
    let totalPainReduction = 0;
    let painAssessmentCount = 0;
    let totalMedicationEffectiveness = 0;
    let medicationCount = 0;
    let totalPatientSatisfaction = 0;
    let satisfactionCount = 0;
    let totalInterventions = 0;

    visits?.forEach((visit: any) => {
      // Pain reduction calculation
      if (visit.pain_assessment?.currentPainLevel !== undefined && 
          visit.pain_assessment?.previousPainLevel !== undefined) {
        totalPainReduction += visit.pain_assessment.previousPainLevel - visit.pain_assessment.currentPainLevel;
        painAssessmentCount++;
      }

      // Medication effectiveness
      if (visit.medications_administered?.length) {
        visit.medications_administered.forEach((med: any) => {
          if (med.effectivenessAssessment?.effectiveness) {
            totalMedicationEffectiveness += med.effectivenessAssessment.effectiveness;
            medicationCount++;
          }
        });
      }

      // Patient satisfaction
      if (visit.quality_metrics?.patientSatisfaction) {
        totalPatientSatisfaction += visit.quality_metrics.patientSatisfaction;
        satisfactionCount++;
      }

      // Count interventions
      if (visit.comfort_interventions?.length) {
        totalInterventions += visit.comfort_interventions.length;
      }
    });

    const metrics = {
      visitCount,
      avgPainReduction: painAssessmentCount > 0 ? totalPainReduction / painAssessmentCount : 0,
      medicationEffectiveness: medicationCount > 0 ? (totalMedicationEffectiveness / medicationCount) * 20 : 0, // Convert to percentage
      patientSatisfaction: satisfactionCount > 0 ? totalPatientSatisfaction / satisfactionCount : 0,
      completedInterventions: totalInterventions,
    };

    return { data: metrics, error: null };
  } catch (error) {
    console.error('Error in getNursingMetrics:', error);
    return { data: null, error: 'Failed to fetch nursing metrics' };
  }
}

// =============================================================================
// MIGRATION FUNCTION (Tasks to Visits)
// =============================================================================

/**
 * Migrate existing tasks to visits (one-time operation)
 */
export async function migrateTasksToVisits(): Promise<{ data: any; error: any }> {
  try {
    // Call the SQL function to migrate data
    const { error } = await supabase.rpc('migrate_tasks_to_visits');

    if (error) {
      console.error('Error migrating tasks to visits:', error);
      return { data: null, error: error.message };
    }

    return { data: 'Migration completed successfully', error: null };
  } catch (error) {
    console.error('Error in migrateTasksToVisits:', error);
    return { data: null, error: 'Failed to migrate tasks to visits' };
  }
}

// =============================================================================
// REAL-TIME SUBSCRIPTIONS
// =============================================================================

/**
 * Subscribe to visit changes for real-time updates
 * Note: Real-time is currently disabled in this Supabase configuration
 */
export function subscribeToVisits(callback: (visits: Visit[]) => void) {
  console.log('⚠️  Real-time subscriptions are disabled in current Supabase configuration');
  console.log('📝 To enable real-time features, update lib/supabase.ts to enable realtime');
  
  // Return a mock subscription object that matches the expected interface
  return {
    unsubscribe: () => {
      console.log('🔕 Mock subscription unsubscribed');
    }
  };
  
  // TODO: Uncomment when real-time is enabled in supabase.ts
  /*
  const subscription = supabase
    .channel('visits-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'visits' }, 
      async (payload: { eventType: string; new: any; old: any; errors: any }) => {
        console.log('Visit change detected:', payload);
        // Refresh all visits when any change occurs
        const { data } = await getAllVisits();
        if (data) {
          callback(data);
        }
      }
    )
    .subscribe();

  return subscription;
  */
}

/**
 * Subscribe to nursing interventions for a specific visit
 * Note: Real-time is currently disabled in this Supabase configuration
 */
export function subscribeToNursingInterventions(visitId: string, callback: (interventions: NursingIntervention[]) => void) {
  console.log('⚠️  Real-time subscriptions are disabled in current Supabase configuration');
  console.log('📝 To enable real-time features, update lib/supabase.ts to enable realtime');
  
  // Return a mock subscription object that matches the expected interface
  return {
    unsubscribe: () => {
      console.log('🔕 Mock subscription unsubscribed');
    }
  };
  
  // TODO: Uncomment when real-time is enabled in supabase.ts
  /*
  const subscription = supabase
    .channel(`nursing-interventions-${visitId}`)
    .on('postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'nursing_interventions',
        filter: `visit_id=eq.${visitId}`
      },
      async (payload: { eventType: string; new: any; old: any; errors: any }) => {
        console.log('Nursing intervention change detected:', payload);
        const { data } = await getNursingInterventions(visitId);
        if (data) {
          callback(data);
        }
      }
    )
    .subscribe();

  return subscription;
  */
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Convert database snake_case fields to TypeScript camelCase fields
 */
function mapDatabaseVisitToTypeScript(dbVisit: any): Visit {
  return {
    id: dbVisit.id,
    visitType: dbVisit.visit_type,
    title: dbVisit.title,
    description: dbVisit.description,
    scheduledTime: dbVisit.scheduled_time,
    actualStartTime: dbVisit.actual_start_time,
    actualEndTime: dbVisit.actual_end_time,
    status: dbVisit.status,
    priority: dbVisit.priority,
    patientId: dbVisit.patient_id,
    nurseId: dbVisit.nurse_id,
    supervisingNurseId: dbVisit.supervising_nurse_id,
    visitNotes: dbVisit.visit_notes || '',
    vitalSigns: dbVisit.vital_signs,
    painAssessment: dbVisit.pain_assessment,
    esasAssessment: dbVisit.esas_assessment,
    medicationsAdministered: dbVisit.medications_administered,
    prnMedications: dbVisit.prn_medications,
    skinWoundAssessment: dbVisit.skin_wound_assessment,
    nutritionalAssessment: dbVisit.nutritional_assessment,
    functionalAssessment: dbVisit.functional_assessment,
    comfortInterventions: dbVisit.comfort_interventions,
    familyInteraction: dbVisit.family_interaction,
    goalsOfCareReview: dbVisit.goals_of_care_review,
    environmentAssessment: dbVisit.environment_assessment,
    qualityMetrics: dbVisit.quality_metrics,
    careCoordination: dbVisit.care_coordination,
    createdAt: dbVisit.created_at,
    updatedAt: dbVisit.updated_at,
    completedAt: dbVisit.completed_at,
    estimatedDurationMinutes: dbVisit.estimated_duration_minutes,
    actualDurationMinutes: dbVisit.actual_duration_minutes,
    billingCode: dbVisit.billing_code,
    documentationComplete: dbVisit.documentation_complete,
    supervisorReviewRequired: dbVisit.supervisor_review_required,
    supervisorReviewedAt: dbVisit.supervisor_reviewed_at,
    supervisorReviewedBy: dbVisit.supervisor_reviewed_by,
  };
}

/**
 * Debug function to log visits table structure and data
 */
export async function debugVisitsTable() {
  try {
    console.log('🔍 DEBUGGING VISITS TABLE...');
    
    const { data, error, count } = await supabase
      .from('visits')
      .select('*', { count: 'exact' })
      .limit(5);

    console.log('📊 Visits count:', count);
    console.log('📋 Sample visits data:', data);
    
    if (error) {
      console.error('❌ Error fetching visits:', error);
    } else {
      console.log('✅ Visits table accessible');
    }

    return { data, error, count };
  } catch (error) {
    console.error('💥 Error in debugVisitsTable:', error);
    return { data: null, error, count: 0 };
  }
} 