# Medical Delegate App

A comprehensive medical task delegation system designed for healthcare professionals, built with React Native and Expo.

## 🏥 Features

- **Medical Task Management**: Efficient delegation and tracking of medical tasks
- **Patient Cards**: Organized patient information with priority indicators
- **Theme System**: Dynamic light/dark/system theme switching with persistent preferences
- **Medical-Specific Design**: Color-coded priorities and status indicators optimized for healthcare
- **Accessibility**: WCAG 2.1 AA compliant design with proper contrast ratios
- **Cross-Platform**: Runs on iOS, Android, and Web

## 🎨 Design System

Built on Material Design 3 principles with medical-specific adaptations:

- **Theme Provider**: Custom theme context with persistent preferences
- **Medical Color Priorities**: Critical (Red), High (Orange), Medium (Blue), Low (Green)
- **Status Indicators**: Pending, In Progress, Completed, Overdue
- **Typography**: Medical-specific text styles for patient names, IDs, and vital signs
- **Components**: Cards, Buttons, Forms optimized for medical workflows

## 🚀 Recent Updates

### Theme Switching Fix (Latest)
- ✅ Fixed theme switching not working in settings
- ✅ Updated `useThemeColor` hook to use `useEnhancedColorScheme` from ThemeProvider
- ✅ Replaced React Native's `useColorScheme` with enhanced version in all components
- ✅ Fixed TypeScript issues with proper type assertions
- ✅ Theme changes now properly update all themed components
- ✅ Persistent theme preferences with AsyncStorage

## 📱 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd medical-delegate-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your preferred platform:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your device

## 🏗️ Project Structure

```
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based navigation
│   └── _layout.jsx        # Root layout with theme provider
├── components/            # Reusable components
│   ├── ui/               # UI component library
│   │   ├── ThemeProvider.jsx
│   │   ├── ThemeSettings.jsx
│   │   ├── Card.jsx
│   │   └── Button.jsx
│   ├── ThemedText.jsx
│   └── ThemedView.jsx
├── constants/            # Design tokens and constants
│   ├── Colors.js         # Theme colors
│   ├── Spacing.js        # Spacing and layout
│   └── Typography.js     # Text styles
└── hooks/               # Custom React hooks
    └── useThemeColor.ts  # Theme-aware color hook
```

## 🎯 Theme System Usage

### Basic Theme Usage
```javascript
import { useTheme, ThemeSettings } from '@/components/ui';

function MyComponent() {
  const { colorScheme, toggleTheme, setThemeMode } = useTheme();
  
  return (
    <View>
      <Text>Current theme: {colorScheme}</Text>
      <Button onPress={toggleTheme} title="Toggle Theme" />
    </View>
  );
}
```

### Using Theme Colors
```javascript
import { useThemeColor } from '@/hooks/useThemeColor';

function ThemedComponent() {
  const backgroundColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'onSurface');
  
  return (
    <View style={{ backgroundColor }}>
      <Text style={{ color: textColor }}>Themed content</Text>
    </View>
  );
}
```

### Theme Settings Component
```javascript
import { ThemeSettings } from '@/components/ui';

// Full settings panel
<ThemeSettings />

// Compact toggle button
<ThemeToggleButton />
```

## 🏥 Medical Components

### Patient Card
```javascript
<PatientCard
  patientName="John Doe"
  patientId="PT-001"
  room="Room 302"
  priority="high"
  onPress={() => navigate('PatientDetails')}
/>
```

### Task Card
```javascript
<TaskCard
  taskTitle="Medication Administration"
  taskDescription="Administer morning medications"
  dueTime="09:00 AM"
  status="pending"
  priority="critical"
  onPress={() => navigate('TaskDetails')}
/>
```

### Medical Priority Button
```javascript
<Button
  title="Urgent Task"
  variant="filled"
  priority="critical"
  onPress={handleUrgentTask}
/>
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📦 Building

### Development Build
```bash
npx expo build
```

### Production Build
```bash
npx expo build --type app-bundle
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏥 Medical Disclaimer

This software is intended for healthcare professional use only. It is not a substitute for professional medical judgment and should be used in accordance with your institution's protocols and guidelines.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.
