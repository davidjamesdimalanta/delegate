// ===================================================================
// NURSING VISIT DATA COLLECTION - TypeScript Interfaces
// Supporting the Visit Feature with Comprehensive Nursing Metrics
// ===================================================================

// ===================================================================
// VITAL SIGNS TYPES
// ===================================================================

export interface VitalSigns {
  temperature?: {
    value: number;
    unit: 'F' | 'C';
    site: 'oral' | 'rectal' | 'axillary' | 'temporal' | 'ear';
    time: string; // ISO timestamp
  };
  bloodPressure?: {
    systolic: number;
    diastolic: number;
    position: 'sitting' | 'lying' | 'standing';
    time: string;
  };
  heartRate?: {
    value: number;
    rhythm: 'regular' | 'irregular';
    time: string;
  };
  respiratoryRate?: {
    value: number;
    character: 'regular' | 'labored' | 'shallow' | 'deep';
    time: string;
  };
  oxygenSaturation?: {
    value: number; // 0-100
    oxygenSupport: 'room air' | 'nasal cannula' | 'face mask' | 'non-rebreather';
    flowRate?: number;
    time: string;
  };
  weight?: {
    value: number;
    unit: 'kg' | 'lbs';
    time: string;
  };
  height?: {
    value: number;
    unit: 'cm' | 'inches';
    time: string;
  };
  painLevel?: number; // 0-10 scale
}

// ===================================================================
// PAIN ASSESSMENT TYPES
// ===================================================================

export interface ComprehensivePainAssessment {
  currentPainLevel: number; // 0-10
  location: string[]; // ['lower back', 'abdomen']
  quality: string[]; // ['sharp', 'burning', 'aching', 'throbbing']
  triggers: string[]; // ['movement', 'coughing', 'pressure']
  reliefFactors: string[]; // ['rest', 'heat', 'medication']
  duration: 'constant' | 'intermittent' | 'brief episodes';
  onset: 'sudden' | 'gradual' | 'chronic';
  radiation: string; // 'none' | 'to legs' | 'to arms'
  associatedSymptoms: string[]; // ['nausea', 'dizziness', 'fatigue']
  interferenceWithActivities: number; // 0-10 scale
  interferenceWithSleep: number; // 0-10 scale
  lastPainMedication?: {
    medication: string;
    time: string;
    effectiveness: 'none' | 'minimal' | 'moderate' | 'good' | 'excellent';
  };
  previousPainLevel?: number; // For comparison
  assessedAt: string; // ISO timestamp
}

// ===================================================================
// ESAS-r ASSESSMENT TYPES
// ===================================================================

export interface ESASAssessment {
  pain: number; // 0-10
  tiredness: number; // 0-10
  nausea: number; // 0-10
  depression: number; // 0-10
  anxiety: number; // 0-10
  drowsiness: number; // 0-10
  appetite: number; // 0-10 (0 = best, 10 = worst)
  wellbeing: number; // 0-10 (0 = best, 10 = worst)
  shortnessOfBreath: number; // 0-10
  assessedAt: string; // ISO timestamp
  totalScore: number; // Sum of all scores
  comparedToPrevious?: 'improving' | 'stable' | 'worsening';
  assessedBy: string; // Nurse ID or name
}

// ===================================================================
// MEDICATION ADMINISTRATION TYPES
// ===================================================================

export interface MedicationAdministration {
  medicationName: string;
  dosage: string;
  route: 'oral' | 'IV' | 'IM' | 'subQ' | 'topical' | 'inhaled' | 'rectal' | 'sublingual';
  scheduledTime: string; // ISO timestamp
  actualTime: string; // ISO timestamp
  effectivenessAssessment?: {
    painBefore?: number;
    painAfter?: number;
    assessedAt: string;
    sideEffects?: string;
    effectiveness: 1 | 2 | 3 | 4 | 5; // 1 = no effect, 5 = excellent
  };
  nurseInitials: string;
  witnessRequired: boolean;
  witnessInitials?: string;
  reason?: string; // For PRN medications
}

export interface PRNMedication {
  medicationName: string;
  dosage: string;
  route: string;
  indication: string; // 'pain', 'anxiety', 'nausea', etc.
  timeGiven: string; // ISO timestamp
  effectiveness: 'poor' | 'fair' | 'good' | 'excellent';
  durationOfEffect?: string; // e.g., '4 hours'
  nurseInitials: string;
  nextDoseEligible?: string; // ISO timestamp
}

// ===================================================================
// WOUND CARE ASSESSMENT TYPES
// ===================================================================

export interface WoundAssessment {
  overallSkinCondition: 'excellent' | 'good' | 'fair' | 'poor';
  pressurePointsAssessed: string[]; // ['sacrum', 'heels', 'elbows']
  wounds: Wound[];
  bradenScaleScore?: number; // 6-23, lower = higher risk
  riskFactors: string[]; // ['immobility', 'poor nutrition', 'moisture']
}

export interface Wound {
  identifier: string; // 'sacral-pressure-ulcer-1'
  location: string;
  type: 'pressure ulcer' | 'surgical' | 'diabetic' | 'venous' | 'arterial' | 'traumatic';
  stage?: string; // 'Stage 1', 'Stage 2', etc.
  size: {
    length: number;
    width: number;
    depth: number;
    unit: 'cm' | 'mm';
  };
  drainage: 'none' | 'minimal' | 'moderate' | 'copious';
  drainageType: 'serous' | 'sanguineous' | 'serosanguineous' | 'purulent';
  surroundingSkin: string;
  treatment: string;
  dressingType: string;
  nextDressingChange: string; // ISO timestamp
  healingProgress: 'improving' | 'stable' | 'deteriorating';
  infectionSigns: boolean;
  photoTaken: boolean;
  odorPresent: boolean;
}

// ===================================================================
// NUTRITIONAL ASSESSMENT TYPES
// ===================================================================

export interface NutritionalAssessment {
  appetiteLevel: number; // 0-10 scale
  foodIntakePercentage: number; // 0-100%
  fluidIntakeML: number;
  dietaryRestrictions: string[]; // ['pureed texture', 'thickened liquids']
  weightChange: string; // 'stable' | 'gaining 1kg/week' | 'losing 2kg/week'
  swallowingAssessment: string;
  supplementsGiven: string[];
  familyConcerns: string;
  assistanceRequired: 'independent' | 'setup only' | 'minimal assist' | 'moderate assist' | 'total assist';
  aspiration: boolean;
}

// ===================================================================
// FUNCTIONAL ASSESSMENT TYPES
// ===================================================================

export interface FunctionalAssessment {
  mobilityLevel: 'independent' | 'ambulatory with assist' | 'wheelchair' | 'bed-bound';
  assistanceRequired: 'independent' | 'minimal care' | 'moderate care' | 'total care';
  activitiesOfDailyLiving: {
    bathing: ADLLevel;
    dressing: ADLLevel;
    toileting: ADLLevel;
    transferring: ADLLevel;
    feeding: ADLLevel;
    grooming: ADLLevel;
  };
  fallRiskScore: number;
  safetyMeasures: string[]; // ['bed rails up', 'call light within reach']
  mobilityAids: string[]; // ['wheelchair', 'walker', 'cane']
  cognitiveStatus: 'alert' | 'confused' | 'disoriented' | 'unresponsive';
}

type ADLLevel = 'independent' | 'setup only' | 'minimal assistance' | 'moderate assistance' | 'dependent';

// ===================================================================
// COMFORT CARE INTERVENTIONS TYPES
// ===================================================================

export interface ComfortIntervention {
  intervention: string; // 'position change', 'mouth care', 'massage'
  time: string; // ISO timestamp
  effectiveness?: string; // 'patient more comfortable'
  nextDue?: string; // ISO timestamp for recurring interventions
  productsUsed?: string[]; // ['oral swabs', 'moisturizer']
  patientResponse?: string;
  performedBy: string; // Nurse ID
  familyInvolved?: boolean;
  duration?: number; // minutes
}

// ===================================================================
// FAMILY INTERACTION TYPES
// ===================================================================

export interface FamilyInteraction {
  familyPresent: string[]; // ['husband', 'daughter']
  educationProvided: string[]; // ['comfort positioning', 'medication timing']
  familyQuestions: string[]; // Questions asked by family
  familyEmotionalState: string; // 'anxious but coping'
  caregiverBurdenAssessment: 'low' | 'moderate' | 'high' | 'severe';
  referralsMade: string[]; // ['social worker', 'chaplain']
  nextFamilyMeeting?: string; // ISO timestamp
  culturalConsiderations?: string;
  languageBarriers?: boolean;
  interpreterUsed?: boolean;
}

// ===================================================================
// GOALS OF CARE TYPES
// ===================================================================

export interface GoalsOfCareReview {
  currentGoals: 'curative' | 'comfort with limited interventions' | 'comfort focused' | 'transitioning to comfort';
  goalsChanged: boolean;
  patientUnderstanding: 'poor' | 'fair' | 'good' | 'excellent';
  familyUnderstanding: 'poor' | 'fair' | 'good' | 'excellent';
  advanceDirectivesReviewed: boolean;
  codeStatus: 'full code' | 'DNR' | 'DNI' | 'DNR/DNI' | 'comfort measures only';
  preferredPlaceOfDeath: 'hospital' | 'home' | 'hospice facility' | 'undecided';
  hospiceDiscussion: 'not discussed' | 'family considering' | 'referral made' | 'declined';
  chaplainReferral: 'not needed' | 'requested' | 'scheduled' | 'declined';
  discussionParticipants: string[];
}

// ===================================================================
// ENVIRONMENT AND SAFETY TYPES
// ===================================================================

export interface EnvironmentAssessment {
  roomTemperature: 'too cold' | 'cool' | 'comfortable' | 'warm' | 'too hot';
  lighting: 'bright' | 'moderate' | 'dimmed' | 'dark';
  noiseLevel: 'quiet' | 'moderate' | 'loud';
  visitorRestrictions: string;
  safetyHazards: string[]; // Empty array if none
  infectionPrecautions: 'standard' | 'contact' | 'droplet' | 'airborne';
  equipmentFunctioning: string;
  privacyNeeds: string;
  personalItems: string[]; // Items important to patient
}

// ===================================================================
// QUALITY METRICS TYPES
// ===================================================================

export interface QualityMetrics {
  visitDurationMinutes: number;
  documentationTimeMinutes: number;
  patientSatisfaction?: number; // 1-10 scale
  familySatisfaction?: number; // 1-10 scale
  goalsAchieved: string[];
  unmetNeeds: string[];
  followUpRequired: string[];
  adverseEvents: string; // 'none' or description
  communicationIssues?: string;
  equipmentIssues?: string;
}

// ===================================================================
// CARE COORDINATION TYPES
// ===================================================================

export interface CareCoordination {
  physicianNotificationRequired: boolean;
  physicianNotified?: {
    time: string;
    method: 'phone' | 'secure message' | 'in person';
    reason: string;
  };
  otherDisciplinesConsulted: string[]; // ['social worker', 'chaplain']
  dischargePlanningUpdates: string;
  insuranceAuthorizationNeeded: boolean;
  supplyNeeds: string[];
  nextVisitRecommendations: string;
  urgentIssues?: string[];
}

// ===================================================================
// NURSING INTERVENTION TYPES
// ===================================================================

export interface NursingIntervention {
  interventionType: 'pain-management' | 'comfort-positioning' | 'medication-administration' |
                   'wound-care' | 'hygiene-care' | 'nutrition-support' | 'family-education' |
                   'symptom-assessment' | 'environmental-modification' | 'psychosocial-support' |
                   'spiritual-care' | 'equipment-management' | 'safety-measures';
  details: Record<string, any>; // Flexible structure for intervention-specific data
  performedAt: string; // ISO timestamp
  performedBy: string; // Nurse ID
  effectivenessRating: number; // 1-10 scale
  patientResponse: string;
  nextInterventionDue?: string; // ISO timestamp
  visitId: string;
  patientId: string;
}

// ===================================================================
// MAIN VISIT TYPE
// ===================================================================

export interface Visit {
  id: string;
  visitType: 'routine' | 'admission' | 'discharge' | 'emergency' | 'medication' | 
            'symptom-management' | 'comfort-care' | 'family-support' | 'assessment';
  title: string;
  description: string;
  scheduledTime: string; // ISO timestamp
  actualStartTime?: string; // ISO timestamp
  actualEndTime?: string; // ISO timestamp
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'missed' | 'rescheduled';
  priority: 'imminent' | 'urgent-comfort' | 'symptom-care' | 'psychosocial' | 
           'family-support' | 'bereavement' | 'routine';
  
  // Patient and staff information
  patientId: string;
  nurseId: string;
  supervisingNurseId?: string;
  
  // Visit documentation
  visitNotes: string;
  
  // Nursing assessment data collected during visit
  vitalSigns?: VitalSigns;
  painAssessment?: ComprehensivePainAssessment;
  esasAssessment?: ESASAssessment;
  medicationsAdministered?: MedicationAdministration[];
  prnMedications?: PRNMedication[];
  skinWoundAssessment?: WoundAssessment;
  nutritionalAssessment?: NutritionalAssessment;
  functionalAssessment?: FunctionalAssessment;
  comfortInterventions?: ComfortIntervention[];
  familyInteraction?: FamilyInteraction;
  goalsOfCareReview?: GoalsOfCareReview;
  environmentAssessment?: EnvironmentAssessment;
  qualityMetrics?: QualityMetrics;
  careCoordination?: CareCoordination;
  
  // Timestamps and metadata
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  
  // Duration tracking
  estimatedDurationMinutes: number;
  actualDurationMinutes?: number;
  
  // Billing and documentation
  billingCode?: string;
  documentationComplete: boolean;
  supervisorReviewRequired: boolean;
  supervisorReviewedAt?: string;
  supervisorReviewedBy?: string;
}

// ===================================================================
// ENHANCED PATIENT TYPE WITH NURSING FIELDS
// ===================================================================

export interface EnhancedPatient {
  id: string;
  name: string;
  priority: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  vitals: string;
  age?: number;
  condition: string;
  lastVisit?: string;
  nextAppointment?: string;
  lastSeenBy?: {
    provider: string;
    discipline: string;
    date: string;
    time: string;
  };
  palliativeCare?: any;
  family?: any;
  symptoms?: any;
  
  // New nursing assessment fields
  nursingAssessments?: Record<string, any>;
  vitalSignsHistory?: VitalSigns[];
  medicationAdministrationRecord?: Record<string, any>;
  woundCareLog?: WoundAssessment[];
  functionalStatus?: FunctionalAssessment;
  fallRiskAssessment?: Record<string, any>;
  skinIntegrityAssessment?: WoundAssessment;
  nutritionalAssessment?: NutritionalAssessment;
  painAssessmentDetailed?: ComprehensivePainAssessment;
  comfortCareMeasures?: ComfortIntervention[];
  nursingInterventions?: NursingIntervention[];
  familyEducationLog?: FamilyInteraction[];
  dischargePlanning?: Record<string, any>;
  
  createdAt: string;
  updatedAt: string;
}

// ===================================================================
// API RESPONSE TYPES
// ===================================================================

export interface VisitResponse {
  data: Visit | null;
  error: string | null;
}

export interface VisitsResponse {
  data: Visit[] | null;
  error: string | null;
}

export interface NursingMetricsResponse {
  data: {
    visitCount: number;
    avgPainReduction: number;
    medicationEffectiveness: number;
    patientSatisfaction: number;
    completedInterventions: number;
  } | null;
  error: string | null;
}

// ===================================================================
// FORM DATA TYPES FOR UI COMPONENTS
// ===================================================================

export interface VitalSignsFormData {
  temperature?: string;
  temperatureUnit?: 'F' | 'C';
  temperatureSite?: string;
  systolic?: string;
  diastolic?: string;
  heartRate?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  weight?: string;
  painLevel?: string;
}

export interface PainAssessmentFormData {
  currentPainLevel: number;
  location: string[];
  quality: string[];
  triggers: string[];
  reliefFactors: string[];
  duration: string;
  onset: string;
  interferenceWithActivities: number;
  interferenceWithSleep: number;
}

export interface MedicationFormData {
  medicationName: string;
  dosage: string;
  route: string;
  scheduledTime: string;
  actualTime: string;
  effectiveness?: number;
  sideEffects?: string;
}

// ===================================================================
// UTILITY TYPES
// ===================================================================

export type VisitStatus = Visit['status'];
export type VisitPriority = Visit['priority'];
export type VisitType = Visit['visitType'];
export type InterventionType = NursingIntervention['interventionType'];

// Helper type for form validation
export interface FieldValidation {
  required: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message: string;
}

export interface FormValidationRules {
  [fieldName: string]: FieldValidation;
} 