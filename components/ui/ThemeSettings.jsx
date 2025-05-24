import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useTheme } from './ThemeProvider';

export function ThemeSettings({ style }) {
  const { themeMode, setThemeMode, colorScheme } = useTheme();
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');
  const outlineColor = useThemeColor({}, 'outline');

  const themeOptions = [
    {
      key: 'light',
      label: 'Light',
      icon: 'sunny-outline',
      description: 'Always use light theme'
    },
    {
      key: 'dark',
      label: 'Dark',
      icon: 'moon-outline',
      description: 'Always use dark theme'
    },
    {
      key: 'system',
      label: 'System',
      icon: 'phone-portrait-outline',
      description: 'Follow system setting'
    }
  ];

  const renderThemeOption = (option) => {
    const isSelected = themeMode === option.key;
    
    return (
      <TouchableOpacity
        key={option.key}
        onPress={() => setThemeMode(option.key)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: Spacing.md,
          borderRadius: Spacing.borderRadius.md,
          borderWidth: 1,
          borderColor: isSelected ? primaryColor : outlineColor,
          backgroundColor: isSelected ? primaryColor + '10' : 'transparent',
          marginBottom: Spacing.sm,
        }}
        activeOpacity={0.7}
      >
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: isSelected ? primaryColor : surfaceColor,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: Spacing.md,
          borderWidth: 1,
          borderColor: outlineColor,
        }}>
          <Ionicons
            name={option.icon}
            size={20}
            color={isSelected ? '#FFFFFF' : onSurfaceColor}
          />
        </View>
        
        <View style={{ flex: 1 }}>
          <ThemedText 
            variant="titleSmall"
            style={{ 
              color: isSelected ? primaryColor : onSurfaceColor,
              marginBottom: Spacing.xs 
            }}
          >
            {option.label}
          </ThemedText>
          <ThemedText 
            variant="bodySmall"
            style={{ 
              color: onSurfaceColor,
              opacity: 0.7 
            }}
          >
            {option.description}
          </ThemedText>
        </View>
        
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={primaryColor}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView 
      style={[
        {
          padding: Spacing.md,
        },
        style
      ]}
    >
      <ThemedText 
        variant="titleMedium"
        style={{ 
          marginBottom: Spacing.md,
          color: onSurfaceColor 
        }}
      >
        Theme Settings
      </ThemedText>
      
      <ThemedText 
        variant="bodyMedium"
        style={{ 
          marginBottom: Spacing.lg,
          color: onSurfaceColor,
          opacity: 0.8 
        }}
      >
        Choose how the app should appear. The system option will follow your device&apos;s theme setting.
      </ThemedText>

      {themeOptions.map(renderThemeOption)}

      <View style={{
        marginTop: Spacing.lg,
        padding: Spacing.md,
        borderRadius: Spacing.borderRadius.md,
        backgroundColor: surfaceColor,
        borderWidth: 1,
        borderColor: outlineColor,
      }}>
        <ThemedText 
          variant="labelMedium"
          style={{ 
            color: onSurfaceColor,
            opacity: 0.7,
            marginBottom: Spacing.xs 
          }}
        >
          Current theme: {colorScheme}
        </ThemedText>
        <ThemedText 
          variant="bodySmall"
          style={{ 
            color: onSurfaceColor,
            opacity: 0.6 
          }}
        >
          Theme changes are saved automatically and will persist when you restart the app.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

// Compact theme toggle button for headers/toolbars
export function ThemeToggleButton({ style }) {
  const { toggleTheme, themeMode, colorScheme } = useTheme();
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const onSurfaceColor = useThemeColor({}, 'onSurface');

  const getIcon = () => {
    switch (themeMode) {
      case 'light':
        return 'sunny';
      case 'dark':
        return 'moon';
      case 'system':
      default:
        return 'phone-portrait';
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: surfaceColor,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: primaryColor + '30',
        },
        style
      ]}
      activeOpacity={0.7}
    >
      <Ionicons
        name={getIcon()}
        size={20}
        color={primaryColor}
      />
    </TouchableOpacity>
  );
} 