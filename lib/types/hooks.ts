import { Patient, Task } from '../database';
import { ComprehensivePainAssessment, Visit, VitalSigns } from './nursing-types';

// ===================================================================
// REACT HOOK TYPES
// ===================================================================

/**
 * Generic async state hook return type
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook return type with refresh capability
 */
export interface RefreshableAsyncState<T> extends AsyncState<T> {
  refresh: () => Promise<void>;
}

/**
 * CRUD operations hook return type
 */
export interface CRUDHook<T, CreateInput, UpdateInput> extends RefreshableAsyncState<T[]> {
  create: (input: CreateInput) => Promise<T | null>;
  update: (id: string, input: UpdateInput) => Promise<T | null>;
  delete: (id: string) => Promise<boolean>;
  getById: (id: string) => Promise<T | null>;
}

// ===================================================================
// PATIENTS HOOK TYPES
// ===================================================================

/**
 * usePatients hook return type
 */
export interface UsePatientsReturn extends RefreshableAsyncState<Patient[]> {
  patients: Patient[];
  refreshPatients: () => Promise<void>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<boolean>;
  deletePatient: (id: string) => Promise<boolean>;
  searchPatients: (query: string) => Promise<Patient[]>;
  getPatientsByPriority: (priority: string) => Promise<Patient[]>;
}

/**
 * usePatient hook return type
 */
export interface UsePatientReturn extends AsyncState<Patient> {
  patient: Patient | null;
  updatePatient: (updates: Partial<Patient>) => Promise<boolean>;
  refreshPatient: () => Promise<void>;
}

// ===================================================================
// TASKS HOOK TYPES
// ===================================================================

/**
 * useTasks hook return type
 */
export interface UseTasksReturn extends RefreshableAsyncState<Task[]> {
  tasks: Task[];
  refreshTasks: () => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<Task | null>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  completeTask: (id: string) => Promise<boolean>;
  getTasksByPatient: (patientId: string) => Promise<Task[]>;
  getTasksByStatus: (status: Task['status']) => Promise<Task[]>;
}

/**
 * useTask hook return type
 */
export interface UseTaskReturn extends AsyncState<Task> {
  task: Task | null;
  updateTask: (updates: Partial<Task>) => Promise<boolean>;
  completeTask: () => Promise<boolean>;
  refreshTask: () => Promise<void>;
}

// ===================================================================
// VISITS HOOK TYPES
// ===================================================================

/**
 * useVisits hook return type
 */
export interface UseVisitsReturn extends RefreshableAsyncState<Visit[]> {
  visits: Visit[];
  refreshVisits: () => Promise<void>;
  createVisit: (visit: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Visit | null>;
  updateVisit: (id: string, updates: Partial<Visit>) => Promise<boolean>;
  deleteVisit: (id: string) => Promise<boolean>;
  completeVisit: (id: string) => Promise<boolean>;
  getVisitsByPatient: (patientId: string) => Promise<Visit[]>;
  getVisitsByStatus: (status: Visit['status']) => Promise<Visit[]>;
}

/**
 * useVisit hook return type
 */
export interface UseVisitReturn extends AsyncState<Visit> {
  visit: Visit | null;
  updateVisit: (updates: Partial<Visit>) => Promise<boolean>;
  completeVisit: () => Promise<boolean>;
  refreshVisit: () => Promise<void>;
}

// ===================================================================
// ASSESSMENT HOOK TYPES
// ===================================================================

/**
 * useVitalSigns hook return type
 */
export interface UseVitalSignsReturn extends AsyncState<VitalSigns> {
  vitalSigns: VitalSigns | null;
  updateVitalSigns: (vitals: Partial<VitalSigns>) => Promise<boolean>;
  refreshVitalSigns: () => Promise<void>;
}

/**
 * usePainAssessment hook return type
 */
export interface UsePainAssessmentReturn extends AsyncState<ComprehensivePainAssessment> {
  painAssessment: ComprehensivePainAssessment | null;
  updatePainAssessment: (assessment: Partial<ComprehensivePainAssessment>) => Promise<boolean>;
  refreshPainAssessment: () => Promise<void>;
}

// ===================================================================
// THEME HOOK TYPES
// ===================================================================

/**
 * useTheme hook return type
 */
export interface UseThemeReturn {
  colorScheme: 'light' | 'dark';
  colors: Record<string, string>;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

/**
 * useThemeColor hook parameters and return type
 */
export interface UseThemeColorParams {
  light: string;
  dark: string;
}

export type UseThemeColorReturn = string;

// ===================================================================
// FORM HOOK TYPES
// ===================================================================

/**
 * Generic form state
 */
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

/**
 * Form actions
 */
export interface FormActions<T> {
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  reset: () => void;
  submit: () => Promise<boolean>;
  validate: () => boolean;
}

/**
 * useForm hook return type
 */
export interface UseFormReturn<T> extends FormState<T>, FormActions<T> {}

// ===================================================================
// NAVIGATION HOOK TYPES (if navigation libraries are available)
// ===================================================================

/**
 * Navigation hook return type
 */
export interface UseNavigationReturn {
  navigate: (route: string, params?: Record<string, any>) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  reset: () => void;
  currentRoute: string | null;
}

/**
 * Route parameters hook return type
 */
export interface UseRouteReturn<T = Record<string, any>> {
  params: T;
  route: {
    name: string;
    params: T;
  };
}

// ===================================================================
// API HOOK TYPES
// ===================================================================

/**
 * Generic API hook options
 */
export interface ApiHookOptions {
  enabled?: boolean;
  refetchOnFocus?: boolean;
  refetchOnReconnect?: boolean;
  retry?: number;
  retryDelay?: number;
}

/**
 * Mutation hook return type
 */
export interface UseMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData>;
  data: TData | null;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
}

/**
 * Query hook return type
 */
export interface UseQueryReturn<TData> extends AsyncState<TData> {
  refetch: () => Promise<void>;
  isFetching: boolean;
  isStale: boolean;
  dataUpdatedAt: number | null;
  errorUpdatedAt: number | null;
}

// ===================================================================
// UTILITY HOOK TYPES
// ===================================================================

/**
 * useDebounce hook return type
 */
export interface UseDebounceReturn<T> {
  debouncedValue: T;
  isDebouncing: boolean;
}

/**
 * useLocalStorage hook return type
 */
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}

/**
 * useToggle hook return type
 */
export interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

/**
 * useCounter hook return type
 */
export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
} 