import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

// ===================================================================
// THEME TYPES
// ===================================================================

/**
 * Available color scheme options
 */
export type ColorScheme = 'light' | 'dark';

/**
 * Theme mode options including system preference
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme context interface
 */
interface ThemeContextType {
  /** Current active color scheme */
  colorScheme: ColorScheme;
  /** Set the color scheme directly */
  setColorScheme: (scheme: ThemeMode) => void;
  /** Whether the current theme is dark */
  isDark: boolean;
  /** Toggle between light/dark/system modes */
  toggleTheme: () => void;
  /** Current theme mode setting */
  themeMode: ThemeMode;
  /** Set theme mode */
  setThemeMode: (mode: ThemeMode) => void;
}

/**
 * Props for ThemeProvider component
 */
interface ThemeProviderProps {
  children: React.ReactNode;
}

// ===================================================================
// THEME CONTEXT AND PROVIDER
// ===================================================================

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_STORAGE_KEY = '@delegate_theme_mode';

/**
 * ThemeProvider Component
 * 
 * Provides theme context throughout the app with persistence and system preference support.
 * Supports light, dark, and system theme modes with automatic storage of user preferences.
 * 
 * @param props - ThemeProviderProps containing children
 * @returns ThemeProvider component with theme context
 */
export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element | null {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Validate if a string is a valid theme mode
   */
  const isValidThemeMode = (mode: string): boolean => {
    return ['light', 'dark', 'system'].includes(mode);
  };

  /**
   * Load theme preference from AsyncStorage
   */
  const loadThemePreference = useCallback(async (): Promise<void> => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && isValidThemeMode(savedTheme)) {
        setThemeMode(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Save theme preference to AsyncStorage
   */
  const saveThemePreference = useCallback(async (mode: ThemeMode): Promise<void> => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, []);

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, [loadThemePreference]);

  // Save theme preference when it changes
  useEffect(() => {
    if (!isLoading) {
      saveThemePreference(themeMode);
    }
  }, [themeMode, isLoading, saveThemePreference]);

  /**
   * Determine the actual color scheme to use based on theme mode and system preference
   */
  const getEffectiveColorScheme = useCallback((): ColorScheme => {
    switch (themeMode) {
      case 'light':
        return 'light';
      case 'dark':
        return 'dark';
      case 'system':
      default:
        return (systemColorScheme as ColorScheme) || 'light';
    }
  }, [themeMode, systemColorScheme]);

  const colorScheme = getEffectiveColorScheme();
  const isDark = colorScheme === 'dark';

  /**
   * Toggle through theme modes: light -> dark -> system -> light
   */
  const toggleTheme = useCallback((): void => {
    setThemeMode(current => {
      switch (current) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'system';
        case 'system':
        default:
          return 'light';
      }
    });
  }, []);

  /**
   * Set color scheme with validation
   */
  const setColorScheme = useCallback((scheme: ThemeMode): void => {
    if (isValidThemeMode(scheme)) {
      setThemeMode(scheme);
    } else {
      console.warn(`Invalid theme mode: ${scheme}`);
    }
  }, []);

  const contextValue: ThemeContextType = {
    colorScheme,
    setColorScheme,
    isDark,
    toggleTheme,
    themeMode,
    setThemeMode,
  };

  // Show loading state while theme preference is being loaded
  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// ===================================================================
// THEME HOOKS
// ===================================================================

/**
 * useTheme Hook
 * 
 * Access theme context with type safety. Must be used within a ThemeProvider.
 * 
 * @returns ThemeContextType with current theme state and controls
 * @throws Error if used outside of ThemeProvider
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * useEnhancedColorScheme Hook
 * 
 * Enhanced hook that uses our theme provider if available, falls back to system.
 * This provides a graceful fallback for components that might be used outside
 * of the theme provider context.
 * 
 * @returns ColorScheme - current color scheme (light or dark)
 */
export function useEnhancedColorScheme(): ColorScheme {
  const systemColorScheme = useSystemColorScheme();
  
  try {
    const theme = useTheme();
    return theme.colorScheme;
  } catch {
    // ThemeProvider not available, use system color scheme
    return (systemColorScheme as ColorScheme) || 'light';
  }
}

/**
 * useThemeToggle Hook
 * 
 * Convenience hook for components that only need theme toggle functionality.
 * 
 * @returns Object with current color scheme and toggle function
 */
export function useThemeToggle(): {
  colorScheme: ColorScheme;
  isDark: boolean;
  toggleTheme: () => void;
} {
  const { colorScheme, isDark, toggleTheme } = useTheme();
  return { colorScheme, isDark, toggleTheme };
}

/**
 * useThemeMode Hook
 * 
 * Convenience hook for components that need to work with theme modes.
 * 
 * @returns Object with current theme mode and setter
 */
export function useThemeMode(): {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isSystemMode: boolean;
} {
  const { themeMode, setThemeMode } = useTheme();
  return { 
    themeMode, 
    setThemeMode, 
    isSystemMode: themeMode === 'system' 
  };
} 