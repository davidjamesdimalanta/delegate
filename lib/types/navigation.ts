import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

// ===================================================================
// ROOT STACK NAVIGATION TYPES
// ===================================================================

/**
 * Root stack parameter list defining all possible routes and their params
 */
export type RootStackParamList = {
  /** Main tab navigation */
  '(tabs)': NavigatorScreenParams<TabParamList>;
  
  /** Task detail screen with task ID */
  'task-details/[id]': { 
    id: string;
    mode?: 'view' | 'edit';
  };
  
  /** Visit detail screen with visit ID */
  'visit-details/[id]': { 
    id: string; 
    mode?: 'view' | 'edit';
    patientId?: string;
  };
  
  /** Visit assessment main screen */
  'visit-details/[id]/assessment': { 
    id: string;
    assessmentType?: 'initial' | 'follow-up' | 'discharge';
  };
  
  /** Vital signs assessment */
  'visit-details/[id]/assessment/vitals': { 
    id: string;
    vitalType?: 'blood-pressure' | 'temperature' | 'heart-rate' | 'respiratory-rate' | 'oxygen-saturation' | 'weight';
  };
  
  /** Pain assessment */
  'visit-details/[id]/assessment/pain': { 
    id: string;
    painAssessmentType?: 'initial' | 'follow-up' | 'esa-r';
  };
  
  /** Medication administration */
  'visit-details/[id]/assessment/medications': { 
    id: string;
    medicationType?: 'scheduled' | 'prn' | 'new-order';
  };
  
  /** Nursing interventions */
  'visit-details/[id]/assessment/interventions': { 
    id: string;
    interventionType?: 'comfort' | 'wound-care' | 'hygiene' | 'positioning' | 'other';
  };
  
  /** Family interaction and education */
  'visit-details/[id]/assessment/family': { 
    id: string;
    interactionType?: 'education' | 'support' | 'goals-of-care' | 'discharge-planning';
  };
  
  /** Clinical notes */
  'visit-details/[id]/assessment/notes': { 
    id: string;
    noteType?: 'nursing-note' | 'assessment-note' | 'care-plan-update' | 'incident-report';
  };
  
  /** Patients list screen */
  'patients-list': {
    filter?: 'all' | 'high-priority' | 'due-today' | 'overdue';
    sortBy?: 'name' | 'priority' | 'last-visit' | 'next-appointment';
  };
  
  /** 404 Not Found screen */
  '+not-found': undefined;
};

// ===================================================================
// TAB NAVIGATION TYPES
// ===================================================================

/**
 * Tab parameter list for bottom tab navigation
 */
export type TabParamList = {
  /** Home/Dashboard tab */
  index: {
    view?: 'dashboard' | 'quick-stats' | 'recent-activity';
  };
  
  /** Visits tab */
  visits: {
    filter?: 'all' | 'today' | 'upcoming' | 'completed' | 'cancelled';
    sortBy?: 'scheduled-time' | 'priority' | 'patient-name' | 'visit-type';
    view?: 'list' | 'calendar' | 'map';
  };
  
  /** Tasks tab */
  tasks: {
    filter?: 'all' | 'pending' | 'in-progress' | 'completed' | 'overdue';
    priority?: 'all' | 'critical' | 'high' | 'medium' | 'low';
    assignedTo?: 'me' | 'team' | 'all';
    sortBy?: 'due-time' | 'priority' | 'patient-name' | 'task-type';
  };
  
  /** Explore/Settings tab */
  explore: {
    section?: 'profile' | 'settings' | 'reports' | 'help' | 'about';
  };
};

// ===================================================================
// SCREEN PROPS TYPES
// ===================================================================

/**
 * Screen props for root stack screens
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  StackScreenProps<RootStackParamList, T>;

/**
 * Screen props for tab screens
 */
export type TabScreenProps<T extends keyof TabParamList> = 
  BottomTabScreenProps<TabParamList, T>;

/**
 * Combined navigation props (useful for screens that need both)
 */
export type CombinedScreenProps<
  RootKey extends keyof RootStackParamList,
  TabKey extends keyof TabParamList = never
> = RootStackScreenProps<RootKey> & 
    (TabKey extends never ? {} : TabScreenProps<TabKey>);

// ===================================================================
// NAVIGATION HELPERS
// ===================================================================

/**
 * Visit navigation parameters for different visit screens
 */
export interface VisitNavigationParams {
  visitId: string;
  patientId?: string;
  mode?: 'view' | 'edit';
  returnTo?: keyof RootStackParamList;
}

/**
 * Task navigation parameters
 */
export interface TaskNavigationParams {
  taskId: string;
  patientId?: string;
  mode?: 'view' | 'edit' | 'complete';
  returnTo?: keyof RootStackParamList;
}

/**
 * Assessment navigation parameters for visit assessments
 */
export interface AssessmentNavigationParams {
  visitId: string;
  assessmentType: 'vitals' | 'pain' | 'medications' | 'interventions' | 'family' | 'notes';
  assessmentId?: string;
  isRequired?: boolean;
  canSkip?: boolean;
}

/**
 * Patient navigation parameters
 */
export interface PatientNavigationParams {
  patientId: string;
  action?: 'view' | 'edit' | 'schedule-visit' | 'add-task' | 'view-history';
  context?: 'dashboard' | 'visit' | 'task' | 'search';
}

// ===================================================================
// ROUTE NAMING HELPERS
// ===================================================================

/**
 * Type-safe route names
 */
export const Routes = {
  // Root Stack Routes
  TABS: '(tabs)' as const,
  TASK_DETAILS: 'task-details/[id]' as const,
  VISIT_DETAILS: 'visit-details/[id]' as const,
  VISIT_ASSESSMENT: 'visit-details/[id]/assessment' as const,
  VISIT_VITALS: 'visit-details/[id]/assessment/vitals' as const,
  VISIT_PAIN: 'visit-details/[id]/assessment/pain' as const,
  VISIT_MEDICATIONS: 'visit-details/[id]/assessment/medications' as const,
  VISIT_INTERVENTIONS: 'visit-details/[id]/assessment/interventions' as const,
  VISIT_FAMILY: 'visit-details/[id]/assessment/family' as const,
  VISIT_NOTES: 'visit-details/[id]/assessment/notes' as const,
  PATIENTS_LIST: 'patients-list' as const,
  NOT_FOUND: '+not-found' as const,
  
  // Tab Routes
  HOME: 'index' as const,
  VISITS: 'visits' as const,
  TASKS: 'tasks' as const,
  EXPLORE: 'explore' as const,
} as const;

/**
 * Type for route names
 */
export type RouteName = typeof Routes[keyof typeof Routes];

// ===================================================================
// NAVIGATION STATE TYPES
// ===================================================================

/**
 * Navigation state for tracking current route and params
 */
export interface NavigationState {
  currentRoute: RouteName;
  previousRoute?: RouteName;
  routeParams?: Record<string, any>;
  tabIndex?: number;
  stackIndex?: number;
}

/**
 * Navigation context for sharing navigation state
 */
export interface NavigationContextType {
  state: NavigationState;
  canGoBack: boolean;
  goBack: () => void;
  navigate: <T extends keyof RootStackParamList>(
    route: T,
    params?: RootStackParamList[T]
  ) => void;
  reset: () => void;
}

// ===================================================================
// DEEP LINKING TYPES
// ===================================================================

/**
 * Deep link configuration for the app
 */
export interface DeepLinkConfig {
  screens: {
    [K in keyof RootStackParamList]: string;
  };
}

/**
 * Deep link parameters extracted from URLs
 */
export interface DeepLinkParams {
  route: RouteName;
  params: Record<string, string | number | boolean>;
  query?: Record<string, string>;
} 