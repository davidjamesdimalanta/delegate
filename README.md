# Delegate - Palliative Care Management App

## 🚀 Quick Setup with Supabase Database

Your sample patients are now connected to a real Supabase database! Here's how to get started:

### 1. Set Up Database Schema
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to SQL Editor
3. Copy and run the contents of `sql/create_patients_table.sql`

### 2. Environment Setup
Your `.env.local` file should contain:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Test the Connection (Optional)
```bash
npm install dotenv
node test-database.js
```

### 4. Start the App
```bash
npm start
```

🎉 The app will automatically seed your database with 6 sample patients on first run!

### 5. Access Patient List
- Open the app and go to the "Patients" tab
- Click "View All Patients" to see the Supabase-powered patient list
- Features include:
  - Real-time updates
  - Search and filtering
  - Full CRUD operations
  - Responsive design

For detailed documentation, see [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).

---

# Original README Content

# Medical Delegate 🏥

A modern, comprehensive medical task delegation system built with React Native and Expo. Designed for healthcare professionals to efficiently manage and delegate medical tasks to field nurses.

## 🚀 Features

- **Modern Design System**: Material Design 3 and Apple Human Interface Guidelines
- **Patient Location Maps**: Interactive maps showing patient locations with address markers
- **Medical Task Management**: Comprehensive task delegation with priority levels
- **Dark/Light Theme**: Automatic theme switching with persistent preferences
- **Medical Priority System**: Color-coded priority levels (Critical, High, Medium, Low)
- **Field Nurse Support**: Optimized for nurses working in the field with location-based features
- **Accessibility First**: Built with accessibility in mind
- **Cross-Platform**: Works on iOS, Android, and Web

## 🗺️ Maps Integration

The app now includes interactive maps for patient locations:

- **Patient Location Display**: Each patient card shows a small map preview with their location
- **Address-Based Locations**: Patients are assigned real addresses instead of room numbers
- **Field Nurse Optimization**: Designed for nurses who need to visit patients at various locations
- **Interactive Markers**: Tap markers to see patient information and addresses

### Map Features
- Small map previews on patient cards
- Fallback display when maps fail to load
- Location permissions for enhanced functionality
- Real-world addresses for realistic testing

## 🎨 Design System

### Patient Cards with Maps
```javascript
<PatientCard
  patientName="John Doe"
  patientId="PT-001"
  location={{
    address: "123 Main St, City, State 12345",
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    }
  }}
  priority="high"
  onPress={() => navigate('PatientDetails')}
/>
```

### Map Preview Component
```javascript
<MapPreview
  latitude={40.7128}
  longitude={-74.0060}
  address="123 Main St, New York, NY 10001"
  size="small" // or "medium", "large"
/>
```

## 📦 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd delegate
```

2. Install dependencies:
```bash
npm install
```

3. Install maps dependencies:
```bash
npx expo install react-native-maps
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
│   │   ├── MapPreview.jsx  # NEW: Map preview component
│   │   └── Button.jsx
│   ├── ThemedText.jsx
│   └── ThemedView.jsx
├── constants/            # Design tokens and constants
│   ├── Colors.js         # Theme colors
│   ├── Spacing.js        # Spacing and layout
│   ├── Typography.js     # Text styles
│   └── SamplePatients.js # NEW: Sample patient data with locations
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
