import React, { createContext, useContext, useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, actualTheme, setTheme, toggleTheme, initializeTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme on mount
    initializeTheme();
  }, [initializeTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};