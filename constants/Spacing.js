/**
 * Medical App Spacing System
 * Based on Material Design 3 and Apple Human Interface Guidelines
 * Provides consistent spacing throughout the app
 */

// Base spacing unit (8dp grid system from Material Design)
const BASE_UNIT = 8;

// Spacing scale based on 8dp grid
export const Spacing = {
  // Micro spacing
  xs: BASE_UNIT * 0.5,    // 4dp
  sm: BASE_UNIT,          // 8dp
  md: BASE_UNIT * 2,      // 16dp
  lg: BASE_UNIT * 3,      // 24dp
  xl: BASE_UNIT * 4,      // 32dp
  xxl: BASE_UNIT * 6,     // 48dp
  xxxl: BASE_UNIT * 8,    // 64dp

  // Semantic spacing for specific use cases
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  // Component specific spacing
  component: {
    // Button padding
    buttonPaddingHorizontal: 24,
    buttonPaddingVertical: 12,
    
    // Card spacing
    cardPadding: 16,
    cardMargin: 8,
    cardBorderRadius: 12,
    
    // List item spacing
    listItemPadding: 16,
    listItemMargin: 4,
    
    // Form spacing
    formFieldMargin: 16,
    formFieldPadding: 12,
    
    // Header spacing
    headerPadding: 16,
    headerMargin: 8,
    
    // Tab bar
    tabBarHeight: 80,
    tabBarPadding: 8,
    
    // Status bar safe area
    statusBarHeight: 44,
    
    // Navigation
    navigationHeaderHeight: 56,
    
    // Medical specific spacing
    medical: {
      // Patient card spacing
      patientCardPadding: 20,
      patientCardMargin: 12,
      
      // Task item spacing
      taskItemPadding: 16,
      taskItemMargin: 8,
      
      // Vital signs spacing
      vitalsContainerPadding: 16,
      vitalsItemMargin: 8,
      
      // Medication list spacing
      medicationItemPadding: 12,
      medicationItemMargin: 6,
      
      // Priority indicator spacing
      priorityIndicatorSize: 12,
      priorityIndicatorMargin: 8,
    }
  },

  // Border radius values
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // Icon sizes
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64,
  },

  // Touch target sizes (minimum 44dp for accessibility)
  touchTarget: {
    minimum: 44,
    comfortable: 48,
    large: 56,
  },

  // Layout spacing
  layout: {
    // Screen padding
    screenPaddingHorizontal: 16,
    screenPaddingVertical: 16,
    
    // Section spacing
    sectionSpacing: 32,
    
    // Content max width for tablets
    contentMaxWidth: 768,
    
    // Grid spacing
    gridGutter: 16,
    
    // Divider spacing
    dividerMargin: 16,
  }
};

// Utility functions
export const getSpacing = (size) => {
  return Spacing[size] || Spacing.md;
};

export const getComponentSpacing = (component, property) => {
  return Spacing.component[component]?.[property] || Spacing.md;
};

export const getMedicalSpacing = (property) => {
  return Spacing.component.medical[property] || Spacing.md;
};

// Responsive spacing helpers
export const getResponsiveSpacing = (baseSize, screenWidth) => {
  // Increase spacing on larger screens
  if (screenWidth > 768) {
    return baseSize * 1.5;
  }
  if (screenWidth > 480) {
    return baseSize * 1.25;
  }
  return baseSize;
};

// Elevation values (for shadows and depth)
export const Elevation = {
  none: 0,
  low: 2,
  medium: 4,
  high: 8,
  highest: 16,
  
  // Material Design elevation levels
  level0: 0,
  level1: 1,
  level2: 3,
  level3: 6,
  level4: 8,
  level5: 12,
};

// Shadow presets for different platforms
export const Shadows = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
}; 