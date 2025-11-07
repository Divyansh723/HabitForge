import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      actualTheme: 'light',
      
      setTheme: (theme: Theme) => {
        set({ theme });
        updateActualTheme(theme, set);
      },
      
      toggleTheme: () => {
        const { theme } = get();
        const themes: Theme[] = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        get().setTheme(nextTheme);
      },
      
      initializeTheme: () => {
        const { theme } = get();
        updateActualTheme(theme, set);
      },
    }),
    {
      name: 'habitforge-theme',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

const updateActualTheme = (theme: Theme, set: (partial: Partial<ThemeState>) => void) => {
  const root = window.document.documentElement;
  
  let resolvedTheme: 'light' | 'dark';
  
  if (theme === 'system') {
    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } else {
    resolvedTheme = theme;
  }
  
  set({ actualTheme: resolvedTheme });
  
  // Update DOM classes
  root.classList.remove('light', 'dark');
  root.classList.add(resolvedTheme);
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#111827' : '#ffffff');
  }
};

// Listen for system theme changes
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    const { theme } = useThemeStore.getState();
    if (theme === 'system') {
      updateActualTheme('system', useThemeStore.setState);
    }
  });
}