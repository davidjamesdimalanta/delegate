import OpenAI from 'openai';

// OpenAI Client Configuration
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || process.env.openApiKey,
  // Note: In production, API calls should go through your backend for security
  dangerouslyAllowBrowser: true // Only for development/prototyping
});

// Medical terminology and context for better transcription
const MEDICAL_CONTEXT = `
You are an AI assistant specialized in hospice and palliative care documentation. 
You understand medical terminology, patient assessment protocols, and clinical documentation standards.
Focus on comfort care, symptom management, family support, and end-of-life care.
`;

// Common medical abbreviations and terms for context
const MEDICAL_TERMS = [
  'ESAS', 'Edmonton Symptom Assessment', 'pain scale', 'dyspnea', 'nausea',
  'fatigue', 'appetite', 'wellbeing', 'anxiety', 'depression', 'drowsiness',
  'PRN', 'as needed', 'morphine', 'oxycodone', 'lorazepam', 'haloperidol',
  'comfort care', 'goals of care', 'advance directives', 'DNR', 'DNI',
  'hospice', 'palliative', 'symptom management', 'caregiver burden'
];

export interface TranscriptionResult {
  text: string;
  confidence?: number;
  duration?: number;
  timestamp: string;
}

export interface ClinicalNote {
  soap?: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  visitSummary?: string;
  recommendations?: string[];
  followUpActions?: string[];
  clinicalEntities?: {
    symptoms: string[];
    medications: string[];
    interventions: string[];
    assessments: string[];
  };
}

/**
 * Transcribe audio using OpenAI Whisper API
 */
export async function transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
  try {
    console.log('🎤 Starting audio transcription...');
    
    // Create form data for the API request
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
    formData.append('prompt', MEDICAL_TERMS.join(', '));

    const transcription = await openai.audio.transcriptions.create({
      file: audioBlob as any,
      model: 'whisper-1',
      language: 'en',
      prompt: 'Medical visit documentation including: ' + MEDICAL_TERMS.slice(0, 10).join(', ')
    });

    console.log('✅ Transcription completed');
    
    return {
      text: transcription.text,
      timestamp: new Date().toISOString(),
      duration: 0 // Duration would need to be calculated from audio
    };
  } catch (error) {
    console.error('❌ Transcription error:', error);
    throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate structured clinical notes from transcribed text
 */
export async function generateClinicalNotes(
  transcriptionText: string,
  patientContext?: {
    name: string;
    condition: string;
    currentSymptoms?: string[];
    medications?: string[];
  }
): Promise<ClinicalNote> {
  try {
    console.log('📝 Generating clinical notes...');

    const prompt = `${MEDICAL_CONTEXT}

Patient Context:
${patientContext ? `
- Name: ${patientContext.name}
- Primary Condition: ${patientContext.condition}
- Current Symptoms: ${patientContext.currentSymptoms?.join(', ') || 'Not specified'}
- Current Medications: ${patientContext.medications?.join(', ') || 'Not specified'}
` : 'Limited patient context available'}

Transcribed Visit Notes:
"${transcriptionText}"

Please generate a structured clinical note in the following format:

1. SOAP Note:
   - Subjective: Patient/family reported symptoms, concerns, and experiences
   - Objective: Observable findings, vital signs, assessments performed
   - Assessment: Clinical interpretation and current status
   - Plan: Interventions, medications, follow-up actions

2. Visit Summary: Brief overview of the visit

3. Recommendations: Specific care recommendations

4. Follow-up Actions: Tasks that need to be completed

5. Clinical Entities: Extract and categorize:
   - Symptoms mentioned
   - Medications discussed
   - Interventions performed
   - Assessments completed

Focus on hospice/palliative care context. Use professional medical language while being clear and concise.
Return the response in valid JSON format.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert hospice and palliative care nurse practitioner specializing in clinical documentation. Respond only with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const clinicalNote = JSON.parse(responseText);
    
    console.log('✅ Clinical notes generated');
    return clinicalNote;

  } catch (error) {
    console.error('❌ Clinical note generation error:', error);
    
    // Fallback: Return a basic structure if JSON parsing fails
    return {
      soap: {
        subjective: extractSection(transcriptionText, 'subjective'),
        objective: extractSection(transcriptionText, 'objective'),
        assessment: extractSection(transcriptionText, 'assessment'),
        plan: extractSection(transcriptionText, 'plan')
      },
      visitSummary: transcriptionText.substring(0, 200) + '...',
      recommendations: [],
      followUpActions: [],
      clinicalEntities: {
        symptoms: [],
        medications: [],
        interventions: [],
        assessments: []
      }
    };
  }
}

/**
 * Extract medical entities from transcribed text
 */
export async function extractMedicalEntities(text: string): Promise<{
  symptoms: string[];
  medications: string[];
  vitals: string[];
  interventions: string[];
  confidence: number;
}> {
  try {
    const prompt = `Extract medical entities from this hospice/palliative care visit note:

"${text}"

Return only a JSON object with these categories:
- symptoms: Array of symptoms mentioned
- medications: Array of medications discussed
- vitals: Array of vital signs or measurements
- interventions: Array of care interventions performed
- confidence: Overall confidence score (0-1)

Focus on hospice/palliative care terminology.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a medical entity extraction specialist. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 800
    });

    const responseText = completion.choices[0]?.message?.content;
    return JSON.parse(responseText || '{}');

  } catch (error) {
    console.error('❌ Entity extraction error:', error);
    return {
      symptoms: [],
      medications: [],
      vitals: [],
      interventions: [],
      confidence: 0
    };
  }
}

/**
 * Helper function to extract sections from unstructured text
 */
function extractSection(text: string, section: 'subjective' | 'objective' | 'assessment' | 'plan'): string {
  const sectionKeywords = {
    subjective: ['patient states', 'reports', 'complains', 'family reports', 'feels'],
    objective: ['observed', 'vital signs', 'appears', 'examination', 'assessment shows'],
    assessment: ['appears', 'seems', 'condition', 'status', 'improvement', 'decline'],
    plan: ['will', 'continue', 'increase', 'decrease', 'follow up', 'contact', 'schedule']
  };

  const keywords = sectionKeywords[section];
  const sentences = text.split(/[.!?]+/);
  
  const relevantSentences = sentences.filter(sentence => 
    keywords.some(keyword => sentence.toLowerCase().includes(keyword))
  );

  return relevantSentences.join('. ').trim() || `Please document ${section} findings.`;
}

/**
 * Validate clinical note content for completeness
 */
export function validateClinicalNote(note: ClinicalNote): {
  isValid: boolean;
  missingFields: string[];
  suggestions: string[];
} {
  const missingFields: string[] = [];
  const suggestions: string[] = [];

  if (!note.soap?.subjective || note.soap.subjective.length < 10) {
    missingFields.push('Subjective findings');
    suggestions.push('Add patient/family reported symptoms and concerns');
  }

  if (!note.soap?.objective || note.soap.objective.length < 10) {
    missingFields.push('Objective findings');
    suggestions.push('Include vital signs, observations, and examination findings');
  }

  if (!note.soap?.assessment || note.soap.assessment.length < 10) {
    missingFields.push('Assessment');
    suggestions.push('Provide clinical interpretation of findings');
  }

  if (!note.soap?.plan || note.soap.plan.length < 10) {
    missingFields.push('Plan');
    suggestions.push('Document interventions and follow-up actions');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    suggestions
  };
} 