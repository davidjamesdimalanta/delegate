import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

const ThemeContext = createContext({
  colorScheme: 'light',
  setColorScheme: () => {},
  isDark: false,
  toggleTheme: () => {},
  themeMode: 'system', // 'light', 'dark', 'system'
  setThemeMode: () => {},
});

const THEME_STORAGE_KEY = '@delegate_theme_mode';

export function ThemeProvider({ children }) {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeMode] = useState('system');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    if (!isLoading) {
      saveThemePreference(themeMode);
    }
  }, [themeMode, isLoading]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeMode(savedTheme);
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemePreference = async (mode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Determine the actual color scheme to use
  const getEffectiveColorScheme = () => {
    switch (themeMode) {
      case 'light':
        return 'light';
      case 'dark':
        return 'dark';
      case 'system':
      default:
        return systemColorScheme || 'light';
    }
  };

  const colorScheme = getEffectiveColorScheme();
  const isDark = colorScheme === 'dark';

  const toggleTheme = () => {
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
  };

  const setColorScheme = (scheme) => {
    if (['light', 'dark', 'system'].includes(scheme)) {
      setThemeMode(scheme);
    }
  };

  const contextValue = {
    colorScheme,
    setColorScheme,
    isDark,
    toggleTheme,
    themeMode,
    setThemeMode,
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Enhanced hook that uses our theme provider if available, falls back to system
export function useEnhancedColorScheme() {
  const systemColorScheme = useSystemColorScheme();
  
  try {
    const theme = useTheme();
    return theme.colorScheme;
  } catch {
    // ThemeProvider not available, use system color scheme
    return systemColorScheme || 'light';
  }
} 