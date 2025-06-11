# Medical Delegate Design System

A comprehensive design system for the Medical Delegate app, built following Material Design 3 and Apple Human Interface Guidelines principles, optimized for medical task delegation workflows.

## Overview

This design system provides a consistent, accessible, and medical-focused user interface for healthcare professionals. It includes color schemes, typography, spacing, and components specifically designed for medical environments.

## Design Principles

- **Medical-First**: Colors and components designed for healthcare environments
- **Accessibility**: WCAG 2.1 AA compliant with proper contrast ratios
- **Consistency**: Unified design language across all platforms
- **Adaptability**: Support for light, dark, and system themes
- **Clarity**: Clear visual hierarchy for critical medical information

## Color System

### Primary Colors
- **Light Theme**: Medical Blue (#1976D2) - Calming and professional
- **Dark Theme**: Light Blue (#90CAF9) - Maintains accessibility in dark mode

### Medical Priority Colors
```javascript
import { MedicalPriority } from '@/constants/Colors';

// Usage
<Button priority="critical" /> // Red for urgent medical tasks
<Button priority="high" />     // Orange for high priority
<Button priority="medium" />   // Blue for standard priority  
<Button priority="low" />      // Green for low priority
```

### Task Status Colors
```javascript
import { TaskStatus } from '@/constants/Colors';

// Available statuses
- pending: Orange (#F57C00)
- inProgress: Blue (#1976D2)
- completed: Green (#388E3C)
- overdue: Red (#D32F2F)
```

## Typography

### Material Design Typography Scale
```javascript
import { ThemedText } from '@/components/ui';

// Display styles (large, prominent text)
<ThemedText variant="displayLarge">Large Display</ThemedText>
<ThemedText variant="displayMedium">Medium Display</ThemedText>
<ThemedText variant="displaySmall">Small Display</ThemedText>

// Headline styles (section headers)
<ThemedText variant="headlineLarge">Large Headline</ThemedText>
<ThemedText variant="headlineMedium">Medium Headline</ThemedText>
<ThemedText variant="headlineSmall">Small Headline</ThemedText>

// Title styles (card headers, important content)
<ThemedText variant="titleLarge">Large Title</ThemedText>
<ThemedText variant="titleMedium">Medium Title</ThemedText>
<ThemedText variant="titleSmall">Small Title</ThemedText>

// Body styles (main content)
<ThemedText variant="bodyLarge">Large Body Text</ThemedText>
<ThemedText variant="bodyMedium">Medium Body Text</ThemedText>
<ThemedText variant="bodySmall">Small Body Text</ThemedText>

// Label styles (buttons, form labels)
<ThemedText variant="labelLarge">Large Label</ThemedText>
<ThemedText variant="labelMedium">Medium Label</ThemedText>
<ThemedText variant="labelSmall">Small Label</ThemedText>
```

### Medical-Specific Typography
```javascript
// Specialized typography for medical content
<ThemedText medicalVariant="patientName">John Doe</ThemedText>
<ThemedText medicalVariant="medicalId">MRN-12345</ThemedText>
<ThemedText medicalVariant="vitals">120/80 mmHg</ThemedText>
<ThemedText medicalVariant="medication">Lisinopril 10mg</ThemedText>
<ThemedText medicalVariant="dosage">2 tablets daily</ThemedText>
<ThemedText medicalVariant="timestamp">2:30 PM</ThemedText>
<ThemedText medicalVariant="urgent">CRITICAL</ThemedText>
```

## Spacing System

### 8dp Grid System
```javascript
import { Spacing } from '@/constants/Spacing';

// Base spacing units
Spacing.xs   // 4dp
Spacing.sm   // 8dp  
Spacing.md   // 16dp
Spacing.lg   // 24dp
Spacing.xl   // 32dp
Spacing.xxl  // 48dp
Spacing.xxxl // 64dp
```

### Component Spacing
```javascript
// Predefined spacing for components
Spacing.component.cardPadding        // 16dp
Spacing.component.buttonPadding      // 24dp horizontal, 12dp vertical
Spacing.component.medical.patientCardPadding // 20dp
```

## Components

### Button Component
```javascript
import { Button } from '@/components/ui';

// Basic usage
<Button title="Save Patient" onPress={handleSave} />

// Variants
<Button title="Primary" variant="filled" />
<Button title="Secondary" variant="outlined" />
<Button title="Tertiary" variant="text" />
<Button title="Tonal" variant="tonal" />

// Medical priorities
<Button title="Emergency" priority="critical" />
<Button title="Urgent" priority="high" />
<Button title="Standard" priority="medium" />
<Button title="Routine" priority="low" />

// Sizes
<Button title="Large" size="large" />
<Button title="Medium" size="medium" />
<Button title="Small" size="small" />

// States
<Button title="Loading" loading />
<Button title="Disabled" disabled />
```

### Card Components
```javascript
import { Card, PatientCard, TaskCard } from '@/components/ui';

// Basic card
<Card title="Patient Information" subtitle="Room 204">
  <ThemedText>Card content here</ThemedText>
</Card>

// Card variants
<Card variant="elevated" />  // Default with shadow
<Card variant="filled" />    // Filled background
<Card variant="outlined" />  // Outlined border

// Patient card
<PatientCard
  patientName="Sarah Johnson"
  patientId="MRN-12345"
  room="Room 204"
  priority="high"
  onPress={handlePatientPress}
>
  <ThemedText>Additional patient info</ThemedText>
</PatientCard>

// Task card
<TaskCard
  taskTitle="Medication Administration"
  taskDescription="Administer insulin"
  dueTime="2:30 PM"
  status="pending"
  priority="critical"
  onPress={handleTaskPress}
/>
```

### Themed Components
```javascript
import { ThemedView, ThemedText } from '@/components/ui';

// Themed view with design system props
<ThemedView 
  padding="md"
  margin="lg"
  elevation="medium"
  borderRadius="lg"
>
  <ThemedText variant="titleMedium">Content</ThemedText>
</ThemedView>
```

## Theme Management

### Theme Provider Setup
```javascript
import { ThemeProvider } from '@/components/ui';

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Using Theme Context
```javascript
import { useTheme } from '@/components/ui';

function MyComponent() {
  const { colorScheme, toggleTheme, setThemeMode } = useTheme();
  
  return (
    <Button 
      title={`Current: ${colorScheme}`}
      onPress={toggleTheme}
    />
  );
}
```

### Theme Settings Component
```javascript
import { ThemeSettings, ThemeToggleButton } from '@/components/ui';

// Full theme settings panel
<ThemeSettings />

// Compact toggle button for headers
<ThemeToggleButton />
```

## Accessibility Features

- **High Contrast**: All color combinations meet WCAG 2.1 AA standards
- **Touch Targets**: Minimum 44dp touch targets for all interactive elements
- **Screen Readers**: Proper semantic markup and labels
- **Focus Management**: Clear focus indicators and logical tab order
- **Medical Context**: Color coding that works for colorblind users

## Platform Adaptations

### iOS
- Uses SF Pro Text font family
- Native iOS shadows and blur effects
- Follows iOS spacing conventions

### Android
- Uses Roboto font family
- Material Design elevation system
- Android-specific touch feedback

## Medical-Specific Features

### Priority System
- **Critical**: Red (#D32F2F) - Immediate medical attention
- **High**: Orange (#F57C00) - Urgent but not life-threatening
- **Medium**: Blue (#1976D2) - Standard medical priority
- **Low**: Green (#388E3C) - Routine medical tasks

### Status Indicators
- **Pending**: Orange - Task awaiting action
- **In Progress**: Blue - Task currently being performed
- **Completed**: Green - Task finished successfully
- **Overdue**: Red - Task past due date

### Medical Typography
- **Patient Names**: Bold, larger text for easy identification
- **Medical IDs**: Monospace font for accuracy
- **Vital Signs**: Medium weight for clear reading
- **Timestamps**: Consistent format for medical records

## Usage Examples

### Creating a Patient Dashboard
```javascript
import { 
  ThemedView, 
  ThemedText, 
  PatientCard, 
  TaskCard, 
  Button 
} from '@/components/ui';

function PatientDashboard() {
  return (
    <ThemedView padding="md">
      <ThemedText variant="headlineMedium">
        Patient Dashboard
      </ThemedText>
      
      <PatientCard
        patientName="John Doe"
        patientId="MRN-67890"
        room="Room 301"
        priority="high"
      >
        <ThemedText medicalVariant="vitals">
          BP: 140/90, HR: 85, Temp: 99.2°F
        </ThemedText>
      </PatientCard>
      
      <TaskCard
        taskTitle="Blood Pressure Check"
        taskDescription="Monitor hypertension"
        dueTime="3:00 PM"
        status="pending"
        priority="high"
      />
      
      <Button 
        title="Complete Task"
        priority="medium"
        onPress={handleComplete}
      />
    </ThemedView>
  );
}
```

## Best Practices

1. **Consistent Spacing**: Always use the spacing system instead of hardcoded values
2. **Semantic Colors**: Use medical priority colors for their intended purpose
3. **Typography Hierarchy**: Follow the established typography scale
4. **Accessibility**: Test with screen readers and high contrast mode
5. **Theme Support**: Ensure components work in both light and dark themes
6. **Medical Context**: Consider the medical environment when choosing colors and interactions

## Contributing

When adding new components or modifying existing ones:

1. Follow the established design patterns
2. Ensure accessibility compliance
3. Test in both light and dark themes
4. Document any new props or variants
5. Consider medical use cases and safety implications 