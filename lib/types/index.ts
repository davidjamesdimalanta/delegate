// ===================================================================
// FOUNDATION TYPES INDEX
// Central export file for all TypeScript foundation types
// ===================================================================

// Re-export component props types
export * from './component-props';

// Re-export React hook types
export * from './hooks';

// Re-export existing database and nursing types
export * from '../database';
export * from './nursing-types';

// Re-export specific commonly used types for convenience
export type {
    Database,
    // Database types
    Patient,
    Task
} from '../database';

export type {
    ComprehensivePainAssessment,
    ESASAssessment, InterventionType, MedicationAdministration, MedicationFormData, NursingIntervention, PainAssessmentFormData,
    // Nursing types
    Visit, VisitPriority, VisitStatus, VisitType, VitalSigns, VitalSignsFormData
} from './nursing-types';

export type {
    BaseInputProps, ButtonProps, ButtonSize,
    // Button types
    ButtonVariant, CardProps,
    // Card types
    CardVariant, CommonComponentProps, ElevationProps,
    // Typography types
    LegacyTypographyType, MedicalInputProps, MedicalTypographyVariant, SpacingProps,
    // Component props
    ThemedProps, ThemedTextProps, ThemedViewProps, TypographyVariant, WithAccessibility,
    // Utility types
    WithChildren,
    WithOptionalPress,
    WithPress,
    WithTestID
} from './component-props';

// Conditional export of navigation types (only if navigation packages are available)
export type {
    AssessmentNavigationParams, NavigationState, PatientNavigationParams, RootStackParamList, RouteName, TabParamList, TaskNavigationParams, VisitNavigationParams
} from './navigation';

// Export route constants
export { Routes } from './navigation';
