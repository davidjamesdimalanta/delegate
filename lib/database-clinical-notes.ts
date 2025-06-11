import { ClinicalNote } from './ai/openai-client';
import { supabase } from './supabase';

// Database types for clinical notes
export interface ClinicalNoteRecord {
  id: string;
  visit_id: string;
  patient_id: string;
  created_by?: string;
  
  // AI Scribe output structure
  soap_note: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
  };
  visit_summary?: string;
  recommendations?: string[];
  follow_up_actions?: string[];
  clinical_entities: {
    symptoms?: string[];
    medications?: string[];
    interventions?: string[];
    assessments?: string[];
  };
  
  // Original transcription and metadata
  original_transcription: string;
  ai_model_used?: string;
  confidence_score?: number;
  
  // Review and approval workflow
  status: 'draft' | 'reviewed' | 'approved' | 'archived';
  reviewed_by?: string;
  reviewed_at?: string;
  approved_by?: string;
  approved_at?: string;
  
  // Validation metadata
  validation_errors?: any[];
  missing_fields?: string[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ClinicalNoteInsert {
  visit_id: string;
  patient_id: string;
  created_by?: string;
  soap_note?: ClinicalNoteRecord['soap_note'];
  visit_summary?: string;
  recommendations?: string[];
  follow_up_actions?: string[];
  clinical_entities?: ClinicalNoteRecord['clinical_entities'];
  original_transcription: string;
  ai_model_used?: string;
  confidence_score?: number;
  status?: ClinicalNoteRecord['status'];
  validation_errors?: any[];
  missing_fields?: string[];
}

export interface ClinicalNoteUpdate {
  soap_note?: ClinicalNoteRecord['soap_note'];
  visit_summary?: string;
  recommendations?: string[];
  follow_up_actions?: string[];
  clinical_entities?: ClinicalNoteRecord['clinical_entities'];
  original_transcription?: string;
  status?: ClinicalNoteRecord['status'];
  reviewed_by?: string;
  reviewed_at?: string;
  approved_by?: string;
  approved_at?: string;
  validation_errors?: any[];
  missing_fields?: string[];
}

// =============================================================================
// CLINICAL NOTES CRUD OPERATIONS
// =============================================================================

/**
 * Create a new clinical note from AI Scribe output
 */
export async function createClinicalNote(
  visitId: string,
  patientId: string,
  clinicalNote: ClinicalNote,
  transcription: string,
  createdBy?: string
): Promise<{ data: ClinicalNoteRecord | null; error: any }> {
  try {
    const noteData: ClinicalNoteInsert = {
      visit_id: visitId,
      patient_id: patientId,
      created_by: createdBy,
      soap_note: clinicalNote.soap || {},
      visit_summary: clinicalNote.visitSummary,
      recommendations: clinicalNote.recommendations || [],
      follow_up_actions: clinicalNote.followUpActions || [],
      clinical_entities: clinicalNote.clinicalEntities || {},
      original_transcription: transcription,
      ai_model_used: 'gpt-4o-mini',
      status: 'draft'
    };

    const { data, error } = await supabase
      .from('clinical_notes')
      .insert(noteData)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating clinical note:', error);
      return { data: null, error };
    }

    console.log('✅ Clinical note created successfully');
    return { data, error: null };
  } catch (error) {
    console.error('Error in createClinicalNote:', error);
    return { data: null, error: 'Failed to create clinical note' };
  }
}

/**
 * Get all clinical notes for a specific visit
 */
export async function getClinicalNotesByVisit(
  visitId: string
): Promise<{ data: ClinicalNoteRecord[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('clinical_notes')
      .select('*')
      .eq('visit_id', visitId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clinical notes by visit:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getClinicalNotesByVisit:', error);
    return { data: null, error: 'Failed to fetch clinical notes' };
  }
}

/**
 * Get all clinical notes for a specific patient
 */
export async function getClinicalNotesByPatient(
  patientId: string
): Promise<{ data: ClinicalNoteRecord[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('clinical_notes')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clinical notes by patient:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getClinicalNotesByPatient:', error);
    return { data: null, error: 'Failed to fetch clinical notes' };
  }
}

/**
 * Get a specific clinical note by ID
 */
export async function getClinicalNote(
  noteId: string
): Promise<{ data: ClinicalNoteRecord | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('clinical_notes')
      .select('*')
      .eq('id', noteId)
      .single();

    if (error) {
      console.error('Error fetching clinical note:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getClinicalNote:', error);
    return { data: null, error: 'Failed to fetch clinical note' };
  }
}

/**
 * Update a clinical note
 */
export async function updateClinicalNote(
  noteId: string,
  updates: ClinicalNoteUpdate
): Promise<{ data: ClinicalNoteRecord | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('clinical_notes')
      .update(updates)
      .eq('id', noteId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating clinical note:', error);
      return { data: null, error };
    }

    console.log('✅ Clinical note updated successfully');
    return { data, error: null };
  } catch (error) {
    console.error('Error in updateClinicalNote:', error);
    return { data: null, error: 'Failed to update clinical note' };
  }
}

/**
 * Review a clinical note (change status to reviewed)
 */
export async function reviewClinicalNote(
  noteId: string,
  reviewedBy: string
): Promise<{ data: ClinicalNoteRecord | null; error: any }> {
  try {
    const updates: ClinicalNoteUpdate = {
      status: 'reviewed',
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString()
    };

    return await updateClinicalNote(noteId, updates);
  } catch (error) {
    console.error('Error in reviewClinicalNote:', error);
    return { data: null, error: 'Failed to review clinical note' };
  }
}

/**
 * Approve a clinical note (change status to approved)
 */
export async function approveClinicalNote(
  noteId: string,
  approvedBy: string
): Promise<{ data: ClinicalNoteRecord | null; error: any }> {
  try {
    const updates: ClinicalNoteUpdate = {
      status: 'approved',
      approved_by: approvedBy,
      approved_at: new Date().toISOString()
    };

    return await updateClinicalNote(noteId, updates);
  } catch (error) {
    console.error('Error in approveClinicalNote:', error);
    return { data: null, error: 'Failed to approve clinical note' };
  }
}

/**
 * Archive a clinical note
 */
export async function archiveClinicalNote(
  noteId: string
): Promise<{ data: ClinicalNoteRecord | null; error: any }> {
  try {
    const updates: ClinicalNoteUpdate = {
      status: 'archived'
    };

    return await updateClinicalNote(noteId, updates);
  } catch (error) {
    console.error('Error in archiveClinicalNote:', error);
    return { data: null, error: 'Failed to archive clinical note' };
  }
}

/**
 * Delete a clinical note
 */
export async function deleteClinicalNote(
  noteId: string
): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('clinical_notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('Error deleting clinical note:', error);
      return { error };
    }

    console.log('✅ Clinical note deleted successfully');
    return { error: null };
  } catch (error) {
    console.error('Error in deleteClinicalNote:', error);
    return { error: 'Failed to delete clinical note' };
  }
}

/**
 * Search clinical notes by content
 */
export async function searchClinicalNotes(
  query: string,
  patientId?: string
): Promise<{ data: ClinicalNoteRecord[] | null; error: any }> {
  try {
    let dbQuery = supabase
      .from('clinical_notes')
      .select('*')
      .or(`visit_summary.ilike.%${query}%,original_transcription.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (patientId) {
      dbQuery = dbQuery.eq('patient_id', patientId);
    }

    const { data, error } = await dbQuery;

    if (error) {
      console.error('Error searching clinical notes:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in searchClinicalNotes:', error);
    return { data: null, error: 'Failed to search clinical notes' };
  }
}

/**
 * Get clinical notes by status
 */
export async function getClinicalNotesByStatus(
  status: ClinicalNoteRecord['status']
): Promise<{ data: ClinicalNoteRecord[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('clinical_notes')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clinical notes by status:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getClinicalNotesByStatus:', error);
    return { data: null, error: 'Failed to fetch clinical notes by status' };
  }
}

/**
 * Get clinical notes requiring review
 */
export async function getClinicalNotesForReview(): Promise<{ data: ClinicalNoteRecord[] | null; error: any }> {
  return getClinicalNotesByStatus('draft');
}

/**
 * Convert AI Scribe ClinicalNote to database format
 */
export function mapClinicalNoteToRecord(
  clinicalNote: ClinicalNote,
  visitId: string,
  patientId: string,
  transcription: string,
  createdBy?: string
): ClinicalNoteInsert {
  return {
    visit_id: visitId,
    patient_id: patientId,
    created_by: createdBy,
    soap_note: clinicalNote.soap || {},
    visit_summary: clinicalNote.visitSummary,
    recommendations: clinicalNote.recommendations || [],
    follow_up_actions: clinicalNote.followUpActions || [],
    clinical_entities: clinicalNote.clinicalEntities || {},
    original_transcription: transcription,
    ai_model_used: 'gpt-4o-mini',
    status: 'draft'
  };
}

/**
 * Convert database record to AI Scribe ClinicalNote format
 */
export function mapRecordToClinicalNote(record: ClinicalNoteRecord): ClinicalNote {
  return {
    soap: record.soap_note.subjective ? {
      subjective: record.soap_note.subjective,
      objective: record.soap_note.objective || '',
      assessment: record.soap_note.assessment || '',
      plan: record.soap_note.plan || ''
    } : undefined,
    visitSummary: record.visit_summary,
    recommendations: record.recommendations,
    followUpActions: record.follow_up_actions,
    clinicalEntities: {
      symptoms: record.clinical_entities.symptoms || [],
      medications: record.clinical_entities.medications || [],
      interventions: record.clinical_entities.interventions || [],
      assessments: record.clinical_entities.assessments || []
    }
  };
}

// =============================================================================
// SUBSCRIPTION FUNCTIONS
// =============================================================================

/**
 * Subscribe to real-time updates for clinical notes
 */
export function subscribeToClinicalNotes(
  callback: (notes: ClinicalNoteRecord[]) => void,
  visitId?: string,
  patientId?: string
) {
  console.log('🔄 Setting up real-time clinical notes subscription');
  
  let channel = supabase
    .channel('clinical_notes_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'clinical_notes' },
      async () => {
        console.log('📝 Clinical note change detected');
        
        // Refetch data when changes occur
        try {
          if (visitId) {
            const { data } = await getClinicalNotesByVisit(visitId);
            if (data) callback(data);
          } else if (patientId) {
            const { data } = await getClinicalNotesByPatient(patientId);
            if (data) callback(data);
          }
        } catch (error) {
          console.error('❌ Error refreshing clinical notes after change:', error);
        }
      }
    )
    .subscribe((status: string) => {
      console.log('📡 Clinical notes subscription status:', status);
    });

  return () => {
    console.log('🔕 Unsubscribing from clinical notes changes');
    supabase.removeChannel(channel);
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Validate clinical note completeness
 */
export function validateClinicalNoteRecord(record: ClinicalNoteRecord): {
  isValid: boolean;
  missingFields: string[];
  errors: string[];
} {
  const missingFields: string[] = [];
  const errors: string[] = [];

  // Check required fields
  if (!record.original_transcription) {
    missingFields.push('Original transcription');
  }

  if (!record.visit_summary) {
    missingFields.push('Visit summary');
  }

  // Check SOAP note completeness
  if (!record.soap_note.subjective) {
    missingFields.push('SOAP: Subjective');
  }
  if (!record.soap_note.objective) {
    missingFields.push('SOAP: Objective');
  }
  if (!record.soap_note.assessment) {
    missingFields.push('SOAP: Assessment');
  }
  if (!record.soap_note.plan) {
    missingFields.push('SOAP: Plan');
  }

  // Check for minimum content length
  if (record.soap_note.subjective && record.soap_note.subjective.length < 10) {
    errors.push('Subjective section too brief');
  }
  if (record.soap_note.objective && record.soap_note.objective.length < 10) {
    errors.push('Objective section too brief');
  }

  return {
    isValid: missingFields.length === 0 && errors.length === 0,
    missingFields,
    errors
  };
}

/**
 * Initialize clinical notes database (for testing/setup)
 */
export async function initializeClinicalNotesDatabase(): Promise<{ error: any }> {
  try {
    // Test connection and table existence
    const { error } = await supabase
      .from('clinical_notes')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error checking clinical_notes table:', error);
      return { error: error.message };
    }

    console.log('✅ Clinical notes database initialized successfully');
    return { error: null };
  } catch (error) {
    console.error('Error initializing clinical notes database:', error);
    return { error: 'Failed to initialize clinical notes database' };
  }
} 