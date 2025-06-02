/**
 * Medical App Design System Colors
 * Based on Material Design 3 and Apple Human Interface Guidelines
 * Optimized for medical task delegation with accessibility in mind
 */

// Primary medical colors - calming blues and greens for healthcare
const primaryLight = '#1976D2'; // Medical blue
const primaryDark = '#90CAF9';
const secondaryLight = '#388E3C'; // Medical green
const secondaryDark = '#81C784';

// Error colors for critical medical alerts
const errorLight = '#D32F2F';
const errorDark = '#F44336';

// Warning colors for important notifications
const warningLight = '#F57C00';
const warningDark = '#FFB74D';

// Success colors for completed tasks
const successLight = '#388E3C';
const successDark = '#4CAF50';

// Surface colors for cards and containers
const surfaceLight = '#FFFFFF';
const surfaceDark = '#121212';

// Background colors
const backgroundLight = '#F5F5F5';
const backgroundDark = '#000000';

export const Colors = {
  light: {
    // Primary colors
    primary: primaryLight,
    onPrimary: '#FFFFFF',
    primaryContainer: '#E3F2FD',
    onPrimaryContainer: '#0D47A1',
    
    // Secondary colors
    secondary: secondaryLight,
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E8F5E8',
    onSecondaryContainer: '#1B5E20',
    
    // Background and surface
    background: backgroundLight,
    onBackground: '#1C1B1F',
    surface: surfaceLight,
    onSurface: '#1C1B1F',
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    
    // Outline and borders
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    
    // Status colors
    error: errorLight,
    onError: '#FFFFFF',
    errorContainer: '#FFEBEE',
    onErrorContainer: '#B71C1C',
    
    warning: warningLight,
    onWarning: '#FFFFFF',
    warningContainer: '#FFF3E0',
    onWarningContainer: '#E65100',
    
    success: successLight,
    onSuccess: '#FFFFFF',
    successContainer: '#E8F5E8',
    onSuccessContainer: '#1B5E20',
    
    // Legacy support
    text: '#11181C',
    tint: primaryLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primaryLight,
    
    // Medical specific colors
    urgent: '#D32F2F',
    routine: '#1976D2',
    completed: '#388E3C',
    pending: '#F57C00',
    
    // Card and elevation
    elevation: {
      level0: surfaceLight,
      level1: '#F7F2FA',
      level2: '#F1EDF7',
      level3: '#ECE6F0',
      level4: '#E9E3EA',
      level5: '#E4DEE5',
    }
  },
  dark: {
    // Primary colors
    primary: primaryDark,
    onPrimary: '#003258',
    primaryContainer: '#004881',
    onPrimaryContainer: '#C8E6FF',
    
    // Secondary colors
    secondary: secondaryDark,
    onSecondary: '#003912',
    secondaryContainer: '#00531A',
    onSecondaryContainer: '#A5D6A7',
    
    // Background and surface
    background: backgroundDark,
    onBackground: '#E6E1E5',
    surface: surfaceDark,
    onSurface: '#E6E1E5',
    surfaceVariant: '#49454F',
    onSurfaceVariant: '#CAC4D0',
    
    // Outline and borders
    outline: '#938F99',
    outlineVariant: '#49454F',
    
    // Status colors
    error: errorDark,
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFBAB1',
    
    warning: warningDark,
    onWarning: '#3E2723',
    warningContainer: '#5D4037',
    onWarningContainer: '#FFCC02',
    
    success: '#4CAF50',
    onSuccess: '#003912',
    successContainer: '#00531A',
    onSuccessContainer: '#A5D6A7',
    
    // Legacy support
    text: '#ECEDEE',
    tint: primaryDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryDark,
    
    // Medical specific colors
    urgent: '#F44336',
    routine: '#90CAF9',
    completed: '#81C784',
    pending: '#FFB74D',
    
    // Card and elevation
    elevation: {
      level0: surfaceDark,
      level1: '#1D1B20',
      level2: '#232025',
      level3: '#2A252B',
      level4: '#2E2A30',
      level5: '#322F35',
    }
  },
};

// Color scheme utilities
export const getColorScheme = (isDark) => isDark ? Colors.dark : Colors.light;

// Palliative Care Priority System - Specialized for end-of-life care
export const PalliativePriority = {
  // 🔴 Imminent: End-of-life care (hours-days)
  imminent: {
    light: '#B71C1C', // Deep red for urgent end-of-life care
    dark: '#EF5350',
    background: {
      light: '#FFEBEE',
      dark: '#4A1C1C'
    },
    description: 'End-of-life care (hours-days)',
    emoji: '🔴'
  },
  
  // 🟠 Urgent Comfort: Severe symptom management needed
  'urgent-comfort': {
    light: '#E65100', // Orange for urgent symptom management
    dark: '#FF7043',
    background: {
      light: '#FFF3E0',
      dark: '#4A2C1C'
    },
    description: 'Severe symptom management needed',
    emoji: '🟠'
  },
  
  // 🟡 Symptom Care: Regular symptom monitoring
  'symptom-care': {
    light: '#F57C00', // Amber for regular symptom care
    dark: '#FFB74D',
    background: {
      light: '#FFF8E1',
      dark: '#3E2723'
    },
    description: 'Regular symptom monitoring',
    emoji: '🟡'
  },
  
  // 🟢 Psychosocial: Emotional/spiritual support
  psychosocial: {
    light: '#2E7D32', // Green for emotional/spiritual care
    dark: '#66BB6A',
    background: {
      light: '#E8F5E8',
      dark: '#1B2E1B'
    },
    description: 'Emotional/spiritual support',
    emoji: '🟢'
  },
  
  // 🔵 Family Support: Caregiver assistance
  'family-support': {
    light: '#1565C0', // Blue for family support
    dark: '#42A5F5',
    background: {
      light: '#E3F2FD',
      dark: '#1A2A3A'
    },
    description: 'Caregiver assistance',
    emoji: '🔵'
  },
  
  // 🟣 Bereavement: Post-death family support
  bereavement: {
    light: '#6A1B9A', // Purple for bereavement support
    dark: '#AB47BC',
    background: {
      light: '#F3E5F5',
      dark: '#2A1A2E'
    },
    description: 'Post-death family support',
    emoji: '🟣'
  }
};

// Legacy Medical priority colors (maintained for backward compatibility)
export const MedicalPriority = {
  critical: {
    light: '#D32F2F',
    dark: '#F44336'
  },
  high: {
    light: '#F57C00',
    dark: '#FFB74D'
  },
  medium: {
    light: '#1976D2',
    dark: '#90CAF9'
  },
  low: {
    light: '#388E3C',
    dark: '#81C784'
  }
};

// Task status colors
export const TaskStatus = {
  pending: {
    light: '#F57C00',
    dark: '#FFB74D'
  },
  inProgress: {
    light: '#1976D2',
    dark: '#90CAF9'
  },
  completed: {
    light: '#388E3C',
    dark: '#81C784'
  },
  overdue: {
    light: '#D32F2F',
    dark: '#F44336'
  },
  cancelled: {
    light: '#757575',
    dark: '#BDBDBD'
  }
};

// Symptom Severity Colors for ESAS and pain scales
export const SymptomSeverity = {
  none: {
    light: '#4CAF50',  // Green for no symptoms
    dark: '#81C784',
    range: [0, 1]
  },
  mild: {
    light: '#8BC34A',  // Light green for mild symptoms
    dark: '#AED581', 
    range: [2, 3]
  },
  moderate: {
    light: '#FFC107',  // Yellow for moderate symptoms
    dark: '#FFD54F',
    range: [4, 6]
  },
  severe: {
    light: '#FF9800',  // Orange for severe symptoms
    dark: '#FFB74D',
    range: [7, 8]
  },
  extreme: {
    light: '#F44336',  // Red for extreme symptoms
    dark: '#EF5350',
    range: [9, 10]
  }
};

// Caregiver Burden Colors
export const CaregiverBurden = {
  none: {
    light: '#4CAF50',
    dark: '#81C784'
  },
  low: {
    light: '#8BC34A',
    dark: '#AED581'
  },
  'low-moderate': {
    light: '#CDDC39',
    dark: '#DCE775'
  },
  moderate: {
    light: '#FFC107',
    dark: '#FFD54F'
  },
  'moderate-high': {
    light: '#FF9800',
    dark: '#FFB74D'
  },
  high: {
    light: '#FF5722',
    dark: '#FF7043'
  },
  severe: {
    light: '#F44336',
    dark: '#EF5350'
  }
};

// Grief Stage Colors
export const GriefStage = {
  anticipatory: {
    light: '#3F51B5',  // Indigo for anticipatory grief
    dark: '#7986CB'
  },
  acute: {
    light: '#E91E63',  // Pink for acute grief
    dark: '#F06292'
  },
  complicated: {
    light: '#9C27B0',  // Purple for complicated grief
    dark: '#BA68C8'
  },
  resolved: {
    light: '#009688',  // Teal for resolved grief
    dark: '#4DB6AC'
  }
}; 